"""Simulador del Notificador, el proveedor externo de envío de emails.

Simula un servicio de terceros, con sus fallos. Modificarlo no forma parte de la prueba.
Documentación de la API: docs/notificador.md

Uso: python notificador/server.py  (solo librería estándar, Python 3.10+)
"""

import json
import os
import random
import threading
import time
import uuid
from collections import deque
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

PORT = int(os.environ.get("NOTIFIER_PORT", "9000"))
API_KEY = os.environ.get("NOTIFIER_API_KEY", "dev-notifier-key")
FAILURE_RATE = float(os.environ.get("NOTIFIER_FAILURE_RATE", "0.1"))
SLOW_RATE = float(os.environ.get("NOTIFIER_SLOW_RATE", "0.1"))
SLOW_SECONDS = float(os.environ.get("NOTIFIER_SLOW_SECONDS", "3"))
RATE_LIMIT_PER_SECOND = int(os.environ.get("NOTIFIER_RATE_LIMIT_PER_SECOND", "20"))

rng = random.Random(os.environ.get("NOTIFIER_SEED"))
lock = threading.Lock()
messages = []
idempotent_responses = {}
recent_requests = deque()


class Handler(BaseHTTPRequestHandler):
    server_version = "Notificador/1.0"

    def do_GET(self):
        url = urlparse(self.path)
        if url.path == "/health":
            return self._send_json(200, {"status": "ok"})
        if url.path == "/v1/messages":
            to = parse_qs(url.query).get("to", [None])[0]
            with lock:
                results = [m for m in messages if to is None or m["to"] == to]
            return self._send_json(200, {"count": len(results), "results": results})
        return self._send_json(404, {"error": "not_found"})

    def do_DELETE(self):
        if urlparse(self.path).path != "/v1/messages":
            return self._send_json(404, {"error": "not_found"})
        with lock:
            messages.clear()
            idempotent_responses.clear()
        return self._send_json(200, {"deleted": True})

    def do_POST(self):
        if urlparse(self.path).path != "/v1/messages":
            return self._send_json(404, {"error": "not_found"})
        if self.headers.get("Authorization") != f"Bearer {API_KEY}":
            return self._send_json(401, {"error": "unauthorized"})
        if self._rate_limited():
            return self._send_json(429, {"error": "rate_limited"}, {"Retry-After": "1"})

        try:
            length = int(self.headers.get("Content-Length") or 0)
            payload = json.loads(self.rfile.read(length) or b"{}")
        except (ValueError, json.JSONDecodeError):
            return self._send_json(400, {"error": "invalid_json"})

        problem = _validate(payload)
        if problem:
            return self._send_json(400, {"error": "invalid_request", "detail": problem})

        key = self.headers.get("Idempotency-Key")
        roll = rng.random()
        with lock:
            replayed = idempotent_responses.get(key) if key else None
            if replayed is None and roll >= FAILURE_RATE:
                response = _accept_message(payload, key)
        if replayed is not None:
            return self._send_json(*replayed, {"Idempotent-Replayed": "true"})
        if roll < FAILURE_RATE:
            return self._send_json(500, {"error": "internal_error"})
        if roll < FAILURE_RATE + SLOW_RATE:
            # El mensaje ya está aceptado, pero la respuesta llega tarde.
            time.sleep(SLOW_SECONDS)
        return self._send_json(*response)

    def _rate_limited(self) -> bool:
        now = time.monotonic()
        with lock:
            while recent_requests and now - recent_requests[0] > 1:
                recent_requests.popleft()
            if len(recent_requests) >= RATE_LIMIT_PER_SECOND:
                return True
            recent_requests.append(now)
            return False

    def _send_json(self, status, body, headers=None):
        data = json.dumps(body, ensure_ascii=False).encode()
        try:
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            for name, value in (headers or {}).items():
                self.send_header(name, value)
            self.end_headers()
            self.wfile.write(data)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def log_message(self, fmt, *args):
        print(f"[notificador] {self.address_string()} {fmt % args}", flush=True)


def _accept_message(payload, key):
    """Registra el mensaje como aceptado. Hay que llamarla con el lock adquirido."""
    message = {
        "id": f"msg_{uuid.uuid4().hex[:12]}",
        "channel": payload["channel"],
        "to": payload["to"],
        "subject": payload["subject"],
        "body": payload["body"],
        "idempotency_key": key,
        "accepted_at": datetime.now(timezone.utc).isoformat(),
    }
    messages.append(message)
    response = (202, {"id": message["id"], "status": "accepted"})
    if key:
        idempotent_responses[key] = response
    return response


def _validate(payload) -> str | None:
    if not isinstance(payload, dict):
        return "El cuerpo debe ser un objeto JSON"
    if payload.get("channel") != "email":
        return "channel debe ser 'email'"
    for field in ("to", "subject", "body"):
        if not isinstance(payload.get(field), str) or not payload[field].strip():
            return f"{field} es obligatorio"
    if "@" not in payload["to"]:
        return "to no es un email válido"
    return None


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"[notificador] Escuchando en http://localhost:{PORT}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass

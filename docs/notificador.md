# Notificador: API del proveedor de emails

El Notificador es un servicio de terceros que envía los emails. En este repositorio hay un
simulador (`notificador/server.py`) que se comporta como el servicio real, **incluidos sus
fallos**. Modificarlo no forma parte de la prueba.

URL base en local: `http://localhost:9000`. Con Docker, el backend lo ve como
`http://notificador:9000`.

## Autenticación

Todas las peticiones de envío llevan la cabecera:

```
Authorization: Bearer <API key>
```

La API key de desarrollo es `dev-notifier-key`.

## Enviar un mensaje

```
POST /v1/messages
Content-Type: application/json
Authorization: Bearer dev-notifier-key
Idempotency-Key: <opcional, ver abajo>

{
  "channel": "email",
  "to": "ana@example.com",
  "subject": "Inscripción confirmada",
  "body": "Hola Ana…"
}
```

### Respuestas

| Código | Significado |
|---|---|
| `202 Accepted` | Mensaje aceptado para su envío. Cuerpo: `{"id": "msg_…", "status": "accepted"}` |
| `400 Bad Request` | Petición inválida (falta un campo, email mal formado…). Reintentarla no servirá de nada |
| `401 Unauthorized` | API key incorrecta |
| `429 Too Many Requests` | Has superado el límite de peticiones por segundo. La cabecera `Retry-After` indica cuántos segundos esperar |
| `5xx` | Error interno del proveedor. Se puede reintentar |

### Tiempos de respuesta

La mayoría de peticiones responden en milisegundos, pero algunas tardan varios
segundos. Que una petición no responda a tiempo **no significa que el mensaje no se haya
aceptado**.

### Idempotencia

Si envías la cabecera `Idempotency-Key`, el Notificador garantiza que dos peticiones con
la misma clave generan **un solo mensaje**. La segunda petición, y las siguientes,
devuelven la respuesta original con la cabecera `Idempotent-Replayed: true` y no envían
nada. Recomendamos usarla en todos los reintentos.

La clave la eliges tú (máximo 255 caracteres) y debe identificar de forma única el mensaje
lógico que quieres enviar. El proveedor real recuerda las claves durante 24 horas; el
simulador, mientras está en marcha.

## Consultar los mensajes aceptados

Solo existe en el simulador, para ayudarte a depurar.

```
GET /v1/messages               # todos los mensajes aceptados
GET /v1/messages?to=<email>    # solo los de un destinatario
DELETE /v1/messages            # vacía el registro de mensajes y de claves de idempotencia
```

## Configuración del simulador

Variables de entorno, por si necesitas reproducir un problema. Con Docker se definen en el
servicio `notificador` de `docker-compose.yml`.

| Variable | Por defecto | Efecto |
|---|---|---|
| `NOTIFIER_FAILURE_RATE` | `0.1` | Proporción de peticiones que responden `500` sin aceptar el mensaje |
| `NOTIFIER_SLOW_RATE` | `0.1` | Proporción de peticiones que aceptan el mensaje pero tardan en responder |
| `NOTIFIER_SLOW_SECONDS` | `3` | Segundos que tardan esas respuestas lentas |
| `NOTIFIER_RATE_LIMIT_PER_SECOND` | `20` | Peticiones por segundo antes de responder `429` |
| `NOTIFIER_SEED` | — | Semilla para que la secuencia de fallos sea reproducible |
| `NOTIFIER_PORT` | `9000` | Puerto |

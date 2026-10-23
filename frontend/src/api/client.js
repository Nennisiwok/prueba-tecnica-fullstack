export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch(path, { method = 'GET', body } = {}) {
  const isJson = body !== undefined && !(body instanceof FormData);
  const response = await fetch(`/api${path}`, {
    method,
    headers: isJson ? { 'Content-Type': 'application/json' } : undefined,
    body: isJson ? JSON.stringify(body) : body,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(data?.detail ?? `Error ${response.status}`, response.status, data);
  }
  return data;
}

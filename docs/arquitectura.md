# Arquitectura del esqueleto

## Componentes

```
┌────────────────┐   /api (proxy de Vite)   ┌──────────────────┐        ┌──────────────┐
│ frontend :5173 │ ───────────────────────▶ │  backend :8000   │ ─────▶ │  PostgreSQL  │
│ React + MUI    │                          │  Django + DRF    │        │  (o SQLite)  │
└────────────────┘                          └────────┬─────────┘        └──────▲───────┘
                                                     │ encola tareas           │
                                              ┌──────▼──────┐                  │
                                              │  RabbitMQ   │                  │
                                              └──────┬──────┘                  │
                                                     │                         │
                                              ┌──────▼──────────────┐          │
                                              │ worker (Celery ×4)  │ ─────────┘
                                              └─────────────────────┘

                                              ┌─────────────────────┐
                                              │ notificador :9000   │  proveedor de emails
                                              └─────────────────────┘  (simulador)
```

- El **backend** expone la API REST.
- El **worker** ejecuta las tareas de Celery con 4 procesos en paralelo. Comparte el código,
  la base de datos y la carpeta de ficheros subidos (`MEDIA_ROOT`) con el backend.
- Sin Docker no hay worker ni RabbitMQ: las tareas se ejecutan dentro de la propia
  petición HTTP (`CELERY_TASK_ALWAYS_EAGER=True`).
- El **notificador** simula el proveedor de emails del cliente. Su API está en
  [notificador.md](notificador.md); la URL y la API key ya están en los settings
  (`NOTIFIER_BASE_URL`, `NOTIFIER_API_KEY`).

## Backend

```
backend/
├── config/            # settings, urls, aplicación de Celery
├── conftest.py        # fixtures de pytest compartidas
└── races/
    ├── api/           # serializers, vistas y urls de DRF
    ├── management/    # comando seed_demo (carreras de ejemplo)
    ├── migrations/
    ├── models.py
    └── tests/
```

En nuestros proyectos solemos separar el código por capas dentro de cada app:

| Carpeta | Contenido |
|---|---|
| `api/` | Vistas, serializers y urls. Validan la entrada y delegan; no tienen lógica de negocio |
| `application/` | Casos de uso: orquestan una operación completa |
| `domain/` | Reglas de negocio puras, fáciles de testear sin base de datos |
| `infrastructure/` | Acceso a sistemas externos: ficheros, APIs de terceros… |

Es una convención, no una obligación. Si te parece excesiva para lo que construyes, no la
uses y explica por qué.

### Tareas en segundo plano

Celery ya está configurado (`config/celery.py`). Para crear una tarea, define una función con
`@shared_task` en un módulo `tasks.py` dentro de la app: se descubre automáticamente.

```python
from celery import shared_task

@shared_task
def mi_tarea(objeto_id: int) -> None:
    ...
```

Se encola con `mi_tarea.delay(objeto_id)`. En los tests se ejecutan siempre dentro del propio
test (lo configura `conftest.py`).

### API actual

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/races/` | Lista de carreras |
| POST | `/api/races/` | Crea una carrera |
| GET | `/api/races/{id}/` | Detalle de una carrera |

La API es navegable en http://localhost:8000/api/.

## Frontend

```
frontend/src/
├── api/          # llamadas a la API (client.js envuelve fetch)
├── components/   # componentes reutilizables
├── pages/        # pantallas: lista de carreras, detalle, página no encontrada
└── utils/
```

En desarrollo, Vite redirige `/api` al backend, así que no hace falta configurar CORS.

## Condiciones de producción

Ten en cuenta estas restricciones aunque en local no se noten:

- La base de datos es **SQL Server**.
- El proxy que hay delante del backend **corta las peticiones que tardan más de 30
  segundos**.
- La aplicación la usan unas 5 personas de la organización, a veces a la vez.

## Fuera de alcance

- **Autenticación.** La API está abierta. En un entorno real iría detrás de SSO.
- **Despliegue.** El `docker-compose.yml` está pensado para desarrollo (`runserver`, Vite en
  modo desarrollo, código montado en los contenedores).

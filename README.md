# Dorsal: prueba técnica fullstack

Gracias por dedicarnos tu tiempo.

Te damos el esqueleto de una aplicación que ya funciona y el encargo de un cliente con más
necesidades de las que caben en el tiempo que tienes. Queremos ver **cómo piensas y cómo
ejecutas**: qué decides construir, cómo lo construyes y cómo nos lo cuentas. No hay una
única solución correcta.

## Contenido

- [El cliente](#el-cliente)
- [Qué te pedimos](#qué-te-pedimos)
- [El esqueleto](#el-esqueleto)
- [Cómo levantar el proyecto](#cómo-levantar-el-proyecto)
- [Normas](#normas)
- [Cómo entregar](#cómo-entregar)
- [Qué valoramos](#qué-valoramos)

## El cliente

Una organización de carreras populares: unas doce carreras al año, de 500 a 20.000
corredores cada una. Ahora lo gestionan todo con hojas de cálculo y quieren una
herramienta interna. Esto es lo que nos han contado:

> «El 95 % de las inscripciones nos llegan por dos plataformas online. Cada noche nos
> mandan el listado de cada carrera: una en Excel y la otra en CSV. El resto se apunta en
> persona en nuestra tienda, en un Excel que tenemos allí.»
>
> «Cada corredor lleva un dorsal y corre en una categoría según su edad. Nos equivocamos con
> las categorías más de lo que nos gustaría, y siempre se queja alguien.»
>
> «Hay gente que se inscribe dos veces, a veces por canales distintos, y no nos enteramos
> hasta el día de la carrera.»
>
> «El día de la carrera, en la entrega de dorsales, tenemos que encontrar rápido a cualquier
> corredor por su nombre o por su dorsal.»
>
> «Algunas carreras tienen aforo. Cuando se llenan, nos gustaría tener una lista de espera.»
>
> «Nos gustaría mandar a cada corredor un email de confirmación con su dorsal. Ya tenemos
> contratado un proveedor de emails.»

Material de apoyo:

- [docs/reglas-de-negocio.md](docs/reglas-de-negocio.md): categorías, edad mínima, dorsales y
  formato de los listados.
- [samples/](samples/): listados reales (anonimizados) que nos ha pasado el cliente.
- [docs/notificador.md](docs/notificador.md): la API del proveedor de emails.

## Qué te pedimos

1. **Decide qué construir.** En 3–4 horas no da tiempo a todo, y no esperamos que lo hagas.
   Como mínimo, la organización tiene que poder meter las inscripciones de una carrera en la
   aplicación y verlas con su categoría y su dorsal. A partir de ahí, eliges tú qué es lo más
   importante.
2. **Constrúyelo**: backend y frontend, con tests. Preferimos poco y bien hecho a mucho y a
   medias. Lo que entregues tiene que funcionar.
3. **Cuéntanoslo** en [ENTREGA.md](ENTREGA.md): qué has construido y por qué, qué decisiones
   has tomado y qué harías después.

Todo lo que el enunciado no dice lo decides tú. Si crees que algo habría que preguntárselo
al cliente, apunta la pregunta y lo que has supuesto mientras tanto.

## El esqueleto

Ya funciona y está preparado para que construyas encima:

- **Backend:** Django + Django REST Framework con el modelo `Race` y su API (listar, crear
  y ver el detalle), Celery configurado para tareas en segundo plano, y tests.
- **Frontend:** React + MUI con la lista de carreras, el alta de carreras y una página de
  detalle de carrera vacía.
- **Infraestructura:** Docker Compose con PostgreSQL, RabbitMQ, el worker de Celery y el
  simulador del proveedor de emails. Integración continua con GitHub Actions.

| Capa | Tecnología |
|---|---|
| Backend | Python 3.12, Django 5.2, Django REST Framework |
| Tareas en segundo plano | Celery + RabbitMQ |
| Base de datos | PostgreSQL con Docker, SQLite sin Docker |
| Frontend | React 19, MUI, React Router, Vite |
| Tests | pytest (backend), Vitest + Testing Library (frontend) |

Puedes cambiar lo que quieras del esqueleto, añadir dependencias o prescindir de alguna
pieza (de Celery, por ejemplo). Solo explica por qué. Encontrarás más detalle en
[docs/arquitectura.md](docs/arquitectura.md).

## Cómo levantar el proyecto

### Opción A: Docker (recomendada)

Requisitos: Docker con Docker Compose.

```bash
docker compose up --build
```

| Servicio | URL |
|---|---|
| Aplicación web | http://localhost:5173 |
| API (navegable) | http://localhost:8000/api/ |
| Admin de Django | http://localhost:8000/admin/ (crea un usuario con el comando de abajo) |
| Proveedor de emails (simulador) | http://localhost:9000/v1/messages |
| RabbitMQ | http://localhost:15672 (guest / guest) |

Al arrancar se aplican las migraciones y se crean tres carreras de ejemplo. Comandos útiles:

```bash
docker compose exec backend pytest                   # tests del backend
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py createsuperuser
docker compose restart worker                        # Celery no recarga el código solo
docker compose up --build                            # tras añadir dependencias
docker compose down -v                               # parar y borrar los datos
```

### Opción B: sin Docker

Requisitos: Python 3.10 o superior y Node 22.13 o superior. Sin Docker, la base de datos es
SQLite y las tareas de Celery se ejecutan dentro del propio proceso web, así que no hace
falta RabbitMQ. Ten en cuenta que, en ese modo, las tareas en segundo plano no se comportan
como en producción.

```bash
# Terminal 1: backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
python manage.py migrate && python manage.py seed_demo
python manage.py runserver

# Terminal 2: frontend
cd frontend
npm install
npm run dev

# Terminal 3 (solo si usas el proveedor de emails)
python notificador/server.py
```

### Tests y calidad

```bash
cd backend && pytest && ruff check . && ruff format --check .
cd frontend && npm test && npm run lint
```

La integración continua (`.github/workflows/ci.yml`) ejecuta lo mismo en cada pull
request. En tu fork, activa GitHub Actions desde la pestaña *Actions*.

## Normas

- **Tiempo: entre 3 y 4 horas.** Si llegas a las 4 horas, para y cuéntanos en `ENTREGA.md`
  qué te faltaba y cómo lo harías. Dedicarle más tiempo no suma puntos.
- **IA:** está permitida. Úsala como la usarías en el trabajo. Evaluamos tu criterio: qué
  le pides, qué compruebas y qué descartas. Cuéntanos en `ENTREGA.md` cómo la has usado.
  Tienes que poder explicar y modificar todo lo que entregues.
- **No modifiques el simulador del proveedor de emails** (`notificador/`). Representa un
  servicio de un tercero que no controlamos.
- En producción usamos SQL Server. Evita soluciones que solo funcionen en un motor de base
  de datos concreto, o explica por qué te parece aceptable.

## Cómo entregar

1. Haz un **fork** de este repositorio. Si prefieres que tu solución no sea pública, crea
   una copia privada con *Use this template* y danos acceso de lectura a los usuarios que te
   indiquemos.
2. Trabaja en una rama. Haz commits pequeños con mensajes que expliquen el porqué:
   revisaremos el historial.
3. Abre una **pull request contra `main` de tu propio repositorio**, con la descripción que
   escribirías para el compañero que va a revisarla. No la fusiones.
4. Envíanos el enlace a la pull request.

Después de la entrega tendremos una conversación de unos 45 minutos. Repasaremos contigo tu
solución y haremos algún cambio pequeño en directo, con tus herramientas habituales (IA
incluida).

## Qué valoramos

- **Tu criterio:** qué decides construir, en qué orden y por qué.
- **Tus decisiones técnicas**, y cómo las explicas: modelo de datos, API, qué hacer con los
  casos raros.
- **Que funcione con los datos reales**, no solo con los de tus tests.
- **Tests** que den confianza en lo importante.
- **Cuidado del detalle:** mensajes que entienda un usuario, estados de carga y de error,
  casos límite.
- **Código** fácil de leer y de revisar, coherente con el esqueleto.
- **Comunicación:** la pull request, `ENTREGA.md` y los mensajes de commit.

No valoramos la cantidad de funcionalidades ni de código, ni las librerías añadidas sin
motivo.

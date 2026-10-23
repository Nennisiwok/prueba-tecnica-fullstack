# Reglas de negocio

Lo que nos ha contado el cliente sobre cómo funcionan sus inscripciones.

## Datos de una inscripción

| Dato | Obligatorio | Valores |
|---|---|---|
| Nombre | Sí | Texto |
| Apellidos | Sí | Texto |
| Email | Sí | Email válido |
| Fecha de nacimiento | Sí | Fecha |
| Teléfono | No | Texto libre |
| Talla de camiseta | Sí | `XS`, `S`, `M`, `L`, `XL` o `XXL` |

## Edad mínima

Para inscribirse hay que tener **16 años cumplidos el día de la carrera**.

## Categorías

La categoría depende de la **edad cumplida el día de la carrera**:

| Categoría | Edad |
|---|---|
| Junior | 16 a 19 años |
| Senior | 20 a 34 años |
| Veterano A | 35 a 44 años |
| Veterano B | 45 a 54 años |
| Veterano C | 55 años o más |

Ejemplo: en una carrera el 14/03/2027, una persona nacida el 15/03/1992 tiene 34 años (los
35 los cumple al día siguiente) y corre como Senior. Si hubiera nacido el 14/03/1992,
correría como Veterana A.

## Dorsales

Cada corredor tiene un dorsal numérico, **único dentro de su carrera**.

## Listados de inscripciones

Todos los canales usan las mismas columnas, en este orden:

| Columna | Contenido |
|---|---|
| `nombre` | Nombre |
| `apellidos` | Apellidos |
| `email` | Email |
| `fecha_nacimiento` | Fecha de nacimiento en formato `dd/mm/aaaa` (en Excel, celda de fecha) |
| `telefono` | Teléfono (puede estar vacío) |
| `talla_camiseta` | Talla de camiseta |

Cada canal genera el fichero a su manera:

| Canal | Fichero de ejemplo | Carrera |
|---|---|---|
| Plataforma A | `samples/plataforma_a_media_maraton.xlsx` | Media Maratón del Río |
| Plataforma B | `samples/plataforma_b_10k.csv` | 10K Nocturna del Puerto |
| Tienda (Excel guardado como CSV) | `samples/tienda_10k.csv` | 10K Nocturna del Puerto |
| Plataforma B | `samples/plataforma_b_maraton.csv` (20.000 inscripciones) | Maratón de la Ciudad |

Las plataformas mandan cada noche el listado **completo** de la carrera hasta ese momento,
no solo las inscripciones nuevas.

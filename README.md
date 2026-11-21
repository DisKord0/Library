# Bibliotheca (Node.js + Express + MongoDB Atlas)

Aplicación web con tema medieval para registrar libros por **área** y **subárea**.

## Operaciones (CRUD) y reporte
| Operación | Ruta |
|---|---|
| Inserción | `POST /api/libros` |
| Consulta | `GET /api/libros` |
| Actualización | `PUT /api/libros/:id` |
| Eliminación | `DELETE /api/libros/:id` |
| Reporte PDF | `GET /api/reporte?area=...&subarea=...` (sin parámetros: todas las áreas) |

Datos de cada libro: título*, autor, ISBN*, año de publicación*, editorial*, área, subárea y fecha de registro (*obligatorios).

## Estructura
- `server.js`: servidor y rutas de la API
- `reporte.js`: generación del reporte en PDF (pdfkit)
- `public/index.html`, `public/styles.css`, `public/app.js`: interfaz
- `public/fondo.jpg`: fondo principal

## Archivos que se agregan aparte (carpeta `public`)
- `musica.mp3`: música de fondo
- Fondo de cada área (opcionales; si falta alguno, se queda el fondo normal):

| Área | Archivo |
|---|---|
| Tecnologías de la información | `fondo-tecnologia.jpg` |
| Físico matemático | `fondo-fisico-matematico.jpg` |
| Ciencias básicas | `fondo-ciencias-basicas.jpg` |
| Novela | `fondo-novela.jpg` |
| Historia | `fondo-historia.jpg` |
| Fantasía | `fondo-fantasia.jpg` |
| Poesía | `fondo-poesia.jpg` |
| Filosofía | `fondo-filosofia.jpg` |
| Infantil | `fondo-infantil.jpg` |
| Otros | `fondo-otros.jpg` |

Las áreas, subáreas y nombres de imagen se editan al inicio de `public/app.js` (bloque `AREAS`).

## Variable de entorno
- `MONGODB_URI`: cadena de conexión de MongoDB Atlas.

## Render
Build Command: `npm install` — Start Command: `npm start`.

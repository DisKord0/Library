# Bibliotheca (Node.js + Express + MongoDB Atlas)

Aplicación web con tema medieval para registrar libros. Operaciones (CRUD):

| Operación | Ruta |
|---|---|
| Inserción | `POST /api/libros` |
| Consulta | `GET /api/libros` |
| Actualización | `PUT /api/libros/:id` |
| Eliminación | `DELETE /api/libros/:id` |

Cada libro tiene: título, autor, ISBN, año, categoría y fecha de registro.
La página permite filtrar por categoría y buscar por título o autor.

## Estructura
- `server.js`: servidor y rutas de la API
- `public/index.html`, `public/styles.css`, `public/app.js`: interfaz
- `public/fondo.jpg`: imagen de fondo
- `public/musica.mp3`: música de fondo (se agrega aparte)

## Variable de entorno
- `MONGODB_URI`: cadena de conexión de MongoDB Atlas.

## Render
Build Command: `npm install` — Start Command: `npm start`.

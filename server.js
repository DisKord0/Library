require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { generarReporte } = require('./reporte');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Modelo: un libro de la biblioteca
const libroSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  autor: { type: String, trim: true, default: '' },
  isbn: { type: String, required: true, trim: true },
  anio: { type: Number, required: true, min: 0, max: 2100 },
  editorial: { type: String, required: true, trim: true },
  area: { type: String, trim: true, default: 'Otros' },
  subarea: { type: String, trim: true, default: 'General' },
  categoria: { type: String, trim: true }, // campo de la versión anterior (sin áreas)
  fechaRegistro: { type: Date, default: Date.now }
});
const Libro = mongoose.model('Libro', libroSchema);

const ETIQUETAS = {
  titulo: 'Título', autor: 'Autor', isbn: 'ISBN', anio: 'Año de publicación',
  editorial: 'Editorial', area: 'Área', subarea: 'Subárea'
};
function mensajeError(err) {
  if (err && err.name === 'ValidationError') {
    return Object.values(err.errors)
      .map((e) => (ETIQUETAS[e.path] || e.path) + (e.kind === 'required' ? ': es obligatorio' : ': valor no válido'))
      .join('. ');
  }
  return err.message;
}
function idValido(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ error: 'ID no válido' });
    return false;
  }
  return true;
}

// INSERCIÓN: guardar un libro
app.post('/api/libros', async (req, res) => {
  try {
    const { titulo, autor, isbn, anio, editorial, area, subarea } = req.body;
    const libro = await Libro.create({
      titulo, autor, isbn, anio, editorial, area: area || 'Otros', subarea: subarea || 'General'
    });
    res.status(201).json(libro);
  } catch (err) {
    res.status(400).json({ error: mensajeError(err) });
  }
});

// CONSULTA: ver los libros guardados
app.get('/api/libros', async (req, res) => {
  try {
    const libros = await Libro.find().sort({ fechaRegistro: -1 });
    res.json(libros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ACTUALIZACIÓN: modificar un libro
app.put('/api/libros/:id', async (req, res) => {
  if (!idValido(req, res)) return;
  try {
    const { titulo, autor, isbn, anio, editorial, area, subarea } = req.body;
    const libro = await Libro.findByIdAndUpdate(
      req.params.id,
      { titulo, autor: autor || '', isbn, anio, editorial, area: area || 'Otros', subarea: subarea || 'General' },
      { new: true, runValidators: true }
    );
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(libro);
  } catch (err) {
    res.status(400).json({ error: mensajeError(err) });
  }
});

// ELIMINACIÓN: borrar un libro
app.delete('/api/libros/:id', async (req, res) => {
  if (!idValido(req, res)) return;
  try {
    const libro = await Libro.findByIdAndDelete(req.params.id);
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REPORTE EN PDF: por área (y subárea). Sin parámetros: todas las áreas.
app.get('/api/reporte', async (req, res) => {
  try {
    const filtro = {};
    const { area, subarea } = req.query;
    if (typeof area === 'string' && area) filtro.area = area;
    if (typeof subarea === 'string' && subarea) filtro.subarea = subarea;
    const libros = await Libro.find(filtro).lean();
    generarReporte(res, libros, {
      area: typeof area === 'string' ? area : '',
      subarea: typeof subarea === 'string' ? subarea : ''
    });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message });
    else res.end();
  }
});

// Libros de la versión anterior: se les asigna área y subárea
async function migrarLibrosAnteriores() {
  try {
    await Libro.collection.updateMany({ area: { $exists: false } }, [
      {
        $set: {
          area: {
            $switch: {
              branches: [
                { case: { $eq: ['$categoria', 'Tecnología'] }, then: 'Tecnologías de la información' },
                { case: { $eq: ['$categoria', 'Ciencia'] }, then: 'Ciencias básicas' }
              ],
              default: { $ifNull: ['$categoria', 'Otros'] }
            }
          },
          subarea: 'General'
        }
      }
    ]);
  } catch (err) {
    console.error('Migración omitida:', err.message);
  }
}

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Conectado a MongoDB');
    await migrarLibrosAnteriores();
    app.listen(PORT, () => console.log('Servidor en puerto ' + PORT));
  })
  .catch((err) => {
    console.error('Error al conectar con MongoDB:', err.message);
    process.exit(1);
  });

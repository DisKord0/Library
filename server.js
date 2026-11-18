require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Modelo: un libro de la biblioteca
const libroSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  autor: { type: String, required: true, trim: true },
  isbn: { type: String, trim: true },
  categoria: { type: String, trim: true, default: 'Otros' },
  anio: { type: Number, min: 0, max: 2100 },
  fechaRegistro: { type: Date, default: Date.now }
});
const Libro = mongoose.model('Libro', libroSchema);

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
    const { titulo, autor, isbn, anio, categoria } = req.body;
    const libro = await Libro.create({ titulo, autor, isbn, anio, categoria: categoria || 'Otros' });
    res.status(201).json(libro);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    const { titulo, autor, isbn, anio, categoria } = req.body;
    const libro = await Libro.findByIdAndUpdate(
      req.params.id,
      {
        titulo,
        autor,
        isbn: isbn || '',
        categoria: categoria || 'Otros',
        anio: anio === '' || anio === undefined ? null : anio
      },
      { new: true, runValidators: true }
    );
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(libro);
  } catch (err) {
    res.status(400).json({ error: err.message });
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

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log('Servidor en puerto ' + PORT));
  })
  .catch((err) => {
    console.error('Error al conectar con MongoDB:', err.message);
    process.exit(1);
  });

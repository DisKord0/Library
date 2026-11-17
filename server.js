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
  anio: { type: Number, min: 0, max: 2100 },
  fechaRegistro: { type: Date, default: Date.now }
});
const Libro = mongoose.model('Libro', libroSchema);

// Guardar un libro
app.post('/api/libros', async (req, res) => {
  try {
    const { titulo, autor, isbn, anio } = req.body;
    const libro = await Libro.create({ titulo, autor, isbn, anio });
    res.status(201).json(libro);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ver los libros guardados (para comprobar que se guardó)
app.get('/api/libros', async (req, res) => {
  const libros = await Libro.find().sort({ fechaRegistro: -1 });
  res.json(libros);
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

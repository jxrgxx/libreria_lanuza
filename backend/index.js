const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/libros', (req, res) => {
  db.query('SELECT * FROM Libro', (err, results) => {
    if (err) {
      res.status(500).send('Error en la base de datos');
    } else {
      res.json(results);
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
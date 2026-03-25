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

// RUTA DE LOGIN
app.post('/login', (req, res) => {
  const { correo, contrasenya } = req.body;

  const sql = 'SELECT * FROM Usuario WHERE correo_usuario = ? AND contrasenya_usuario = ?';
  
  db.query(sql, [correo, contrasenya], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error en el servidor' });
    } else if (results.length > 0) {
      const user = { ...results[0] };
      delete user.contrasenya_usuario;
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  });
});
const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Creando la base de datos
const db = new sqlite3.Database('students.sqlite', (err) => {
    if (err) {
        console.error('Error al crear la base de datos SQLite:', err);
    } else {
        console.log('Base de datos SQLite creada');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        gender TEXT NOT NULL,
        age INT
)`, (err) => {
    if (err) {
        console.error('Error al crear la tabla:', err);
    } else {
        console.log("Tabla 'students' ya existe");
    }
});

// Endpoint para la inserción
app.post('/student/insert', (req, res) => {
    const { firstname, lastname, gender, age } = req.body;
    const query = `INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)`;

    if (!firstname || !lastname || !gender || !age) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    db.run(query, [firstname, lastname, gender, age], function(err) {
        if (err) {
            console.error('Error al insertar:', err);
            return res.status(500).json({ error: 'Error al insertar el registro' });
        }
        res.json({ message: 'Registro insertado', id: this.lastID });
    });
});

// Endpoint para leer todos los registros
app.get('/student/read', (req, res) => {
    const query = `SELECT * FROM students`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al leer:', err);
            return res.status(500).json({ error: 'Error al leer los registros' });
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

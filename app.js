const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // Importar bcrypt
const app = express();
const port = 3001;

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia esto por tu usuario de MySQL
    password: '', // Cambia esto por tu contraseña de MySQL
    database: 'registro_usuario'
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL.');
});

// Endpoint para el registro de usuarios
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Validación básica
    if (!username || !password) {
        return res.status(400).send('Se requieren un nombre de usuario y una contraseña.');
    }

    // Hashear la contraseña antes de almacenarla
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send('Error al registrar el usuario.');
        }

        // Consulta para insertar el nuevo usuario
        const query = 'INSERT INTO usuarios (username, password) VALUES (?, ?)';
        db.query(query, [username, hash], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).send('El usuario ya está registrado.');
                }
                return res.status(500).send('Error al registrar el usuario.');
            }
            res.status(201).send('Registro exitoso.');
        });
    });
});

// Endpoint para el inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validación básica
    if (!username || !password) {
        return res.status(400).send('Se requieren un nombre de usuario y una contraseña.');
    }

    // Consulta para obtener el usuario
    const query = 'SELECT * FROM usuarios WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).send('Error en la autenticación.');
        }
        if (results.length === 0) {
            return res.status(401).send('Error en la autenticación. Verifique sus credenciales.');
        }

        // Comparar la contraseña ingresada con la contraseña hasheada
        bcrypt.compare(password, results[0].password, (err, match) => {
            if (err) {
                return res.status(500).send('Error en la autenticación.');
            }
            if (match) {
                return res.send('Autenticación satisfactoria.');
            } else {
                return res.status(401).send('Error en la autenticación. Verifique sus credenciales.');
            }
        });
    });
});

// Endpoint para listar todos los usuarios
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM usuarios'; // Consulta para obtener todos los usuarios
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Error al obtener usuarios.'); // Manejo de errores
        }
        res.json(results); // Enviar la lista de usuarios como respuesta en formato JSON
    });
});

// Endpoint de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Iniciamos el servidor
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
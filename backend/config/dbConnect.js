require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectTimeout: 10000 // 10 secondes
});


connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données: ', err.message);
        return;
    }
    console.log('Connecté à la base de données');
});

module.exports = connection;

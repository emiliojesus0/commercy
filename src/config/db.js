const mysql = require("mysql2");
const env = require("./env");

const pool = mysql.createPool({
  host: env.dbHost,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// prueba conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.log("Error de conexión a la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos");
    connection.release();
  }
});

module.exports = pool;

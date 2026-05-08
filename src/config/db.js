const mysql = require("mysql2");
const env = require("./env");

const connection = mysql.createConnection({
  host: env.dbHost,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
});

connection.connect((err) => {
  if (err) {
    console.log("Error de conexion a la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos");
  }
});

module.exports = connection;

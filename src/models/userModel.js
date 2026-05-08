const db = require("../config/db");

exports.createUser = (user, callback) => {
  const sql = `
    INSERT INTO usuarios (nombre, email, password, rol, activo)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user.nombre, user.email, user.password, user.rol, user.activo],
    callback,
  );
};

exports.findUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM usuarios WHERE email = ?";

  db.query(sql, [email], callback);
};

exports.getVendedores = (callback) => {
  const sql = `
    SELECT id, nombre, email, rol, activo
    FROM usuarios
    WHERE rol = 'vendedor'
    ORDER BY id DESC
  `;

  db.query(sql, callback);
};

exports.activarVendedor = (userId, callback) => {
  const sql = `
    UPDATE usuarios
    SET activo = 1
    WHERE id = ? AND rol = 'vendedor'
  `;

  db.query(sql, [userId], callback);
};

exports.desactivarVendedor = (userId, callback) => {
  const sql = `
    UPDATE usuarios
    SET activo = 0
    WHERE id = ? AND rol = 'vendedor'
  `;

  db.query(sql, [userId], callback);
};

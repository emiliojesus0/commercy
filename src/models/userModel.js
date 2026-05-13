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

exports.findUserById = (userId, callback) => {
  const sql = "SELECT id, nombre, email, rol, activo FROM usuarios WHERE id = ?";

  db.query(sql, [userId], callback);
};

exports.findUserAuthById = (userId, callback) => {
  const sql = "SELECT * FROM usuarios WHERE id = ?";

  db.query(sql, [userId], callback);
};

exports.getVendedores = (callback) => {
  const sql = `
    SELECT u.id, u.nombre, u.email, u.rol, u.activo, t.nombre AS tienda_nombre
    FROM usuarios u
    LEFT JOIN tiendas t ON t.usuario_id = u.id
    WHERE u.rol = 'vendedor'
    ORDER BY u.id DESC
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

exports.updateUserProfile = (user, callback) => {
  const sql = `
    UPDATE usuarios
    SET nombre = ?
    WHERE id = ?
  `;

  db.query(sql, [user.nombre, user.id], callback);
};

exports.updateUserPassword = (user, callback) => {
  const sql = `
    UPDATE usuarios
    SET password = ?
    WHERE id = ?
  `;

  db.query(sql, [user.password, user.id], callback);
};

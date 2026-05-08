const db = require("../config/db");

exports.createStore = (store, callback) => {
  const sql = `
  INSERT INTO tiendas (nombre, slug, descripcion, usuario_id)
  VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [store.nombre, store.slug, store.descripcion, store.usuario_id],
    callback,
  );
};

exports.getStoreBySlug = (slug, callback) => {
  const sql = `
    SELECT t.*
    FROM tiendas t
    JOIN usuarios u ON t.usuario_id = u.id
    WHERE t.slug = ? AND u.activo = 1
  `;

  db.query(sql, [slug], callback);
};

exports.getStoreByUserId = (userId, callback) => {
  const sql = "SELECT * FROM tiendas WHERE usuario_id = ?";

  db.query(sql, [userId], callback);
};

exports.getStoreBySlugExact = (slug, callback) => {
  const sql = "SELECT * FROM tiendas WHERE slug = ?";

  db.query(sql, [slug], callback);
};

const db = require("../config/db");

exports.createProduct = (product, callback) => {
  const query = `
    INSERT INTO productos
    (titulo, descripcion, precio, stock, categoria, estado, imagen, tienda_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      product.titulo,
      product.descripcion,
      product.precio,
      product.stock,
      product.categoria,
      product.estado,
      product.imagen,
      product.tienda_id,
    ],
    callback,
  );
};

exports.getProductsByStore = (slug, callback) => {
  const query = `
    SELECT p.*
    FROM productos p
    JOIN tiendas t ON p.tienda_id = t.id
    JOIN usuarios u ON t.usuario_id = u.id
    WHERE t.slug = ? AND u.activo = 1
  `;

  db.query(query, [slug], callback);
};

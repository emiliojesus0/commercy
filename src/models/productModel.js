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

exports.getProductsByStoreId = (tiendaId, callback) => {
  const query = `
    SELECT *
    FROM productos
    WHERE tienda_id = ?
    ORDER BY id DESC
  `;

  db.query(query, [tiendaId], callback);
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

exports.getProductByIdAndStore = (productoId, tiendaId, callback) => {
  const query = `
    SELECT *
    FROM productos
    WHERE id = ? AND tienda_id = ?
  `;

  db.query(query, [productoId, tiendaId], callback);
};

exports.updateProduct = (product, callback) => {
  const query = `
    UPDATE productos
    SET titulo = ?, descripcion = ?, precio = ?, stock = ?, categoria = ?,
        estado = ?, imagen = ?
    WHERE id = ? AND tienda_id = ?
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
      product.id,
      product.tienda_id,
    ],
    callback,
  );
};

exports.deleteProduct = (productId, tiendaId, callback) => {
  const query = `
    DELETE FROM productos
    WHERE id = ? AND tienda_id = ?
  `;

  db.query(query, [productId, tiendaId], callback);
};

exports.updateProductStock = (productoId, nuevoStock, callback) => {
  const query = `
    UPDATE productos
    SET stock = ?
    WHERE id = ?
  `;

  db.query(query, [nuevoStock, productoId], callback);
};

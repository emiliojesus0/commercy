const db = require("../config/db");

exports.createOrder = (order, callback) => {
  const sql = `
    INSERT INTO pedidos (
      tienda_id,
      cliente_nombre,
      cliente_email,
      cliente_telefono,
      direccion,
      notas,
      estado,
      total
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      order.tienda_id,
      order.cliente_nombre,
      order.cliente_email,
      order.cliente_telefono,
      order.direccion,
      order.notas,
      order.estado,
      order.total,
    ],
    callback,
  );
};

exports.createOrderDetail = (detail, callback) => {
  const sql = `
    INSERT INTO detalle_pedidos (
      pedido_id,
      producto_id,
      cantidad,
      precio_unitario,
      subtotal
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      detail.pedido_id,
      detail.producto_id,
      detail.cantidad,
      detail.precio_unitario,
      detail.subtotal,
    ],
    callback,
  );
};

exports.getProductByIdAndStore = (productoId, tiendaId, callback) => {
  const sql = `
    SELECT * FROM productos
    WHERE id = ? AND tienda_id = ?
  `;

  db.query(sql, [productoId, tiendaId], callback);
};

exports.getOrdersByStoreId = (tiendaId, callback) => {
  const sql = `
    SELECT *
    FROM pedidos
    WHERE tienda_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [tiendaId], callback);
};

exports.getOrderDetailsByOrderId = (pedidoId, callback) => {
  const sql = `
    SELECT
      dp.id,
      dp.pedido_id,
      dp.producto_id,
      dp.cantidad,
      dp.precio_unitario,
      dp.subtotal,
      p.titulo
    FROM detalle_pedidos dp
    JOIN productos p ON dp.producto_id = p.id
    WHERE dp.pedido_id = ?
  `;

  db.query(sql, [pedidoId], callback);
};

exports.updateOrderStatus = (pedidoId, estado, callback) => {
  const sql = `
    UPDATE pedidos
    SET estado = ?
    WHERE id = ?
  `;

  db.query(sql, [estado, pedidoId], callback);
};

const storeModel = require("../models/storeModel");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

exports.createOrder = (req, res) => {
  const slug = req.params.slug;

  const cliente_nombre = req.body.cliente_nombre?.trim();
  const cliente_email = req.body.cliente_email?.trim().toLowerCase() || "";
  const cliente_telefono = req.body.cliente_telefono?.trim();
  const direccion = req.body.direccion?.trim();
  const notas = req.body.notas?.trim() || "";
  const productos = req.body.productos;

  if (!cliente_nombre || !cliente_telefono || !direccion) {
    return res.status(400).json({
      message: "Nombre, telefono y direccion son obligatorios",
    });
  }

  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({
      message: "Debes enviar al menos un producto",
    });
  }

  storeModel.getStoreBySlug(slug, (err, storeResult) => {
    if (err) {
      return res.status(500).json({
        message: "Error al buscar la tienda",
      });
    }

    if (storeResult.length === 0) {
      return res.status(404).json({
        message: "Tienda no encontrada",
      });
    }

    const tienda = storeResult[0];
    const productosValidados = [];
    let total = 0;

    orderModel.beginTransaction((transactionErr, connection) => {
      if (transactionErr) {
        return res.status(500).json({
          message: "Error al iniciar la transaccion del pedido",
        });
      }

      const rollbackWithError = (statusCode, message) => {
        orderModel.rollbackTransaction(connection, () => {
          return res.status(statusCode).json({ message });
        });
      };

      const procesarProducto = (index) => {
        if (index >= productos.length) {
          const newOrder = {
            tienda_id: tienda.id,
            cliente_nombre,
            cliente_email,
            cliente_telefono,
            direccion,
            notas,
            estado: "pendiente",
            total,
          };

          return orderModel.createOrderWithConnection(
            connection,
            newOrder,
            (orderErr, orderResult) => {
              if (orderErr) {
                return rollbackWithError(500, "Error al crear el pedido");
              }

              const pedido_id = orderResult.insertId;
              let detallesGuardados = 0;

              for (const producto of productosValidados) {
                const detail = {
                  pedido_id,
                  producto_id: producto.producto_id,
                  cantidad: producto.cantidad,
                  precio_unitario: producto.precio_unitario,
                  subtotal: producto.subtotal,
                };

                orderModel.createOrderDetailWithConnection(
                  connection,
                  detail,
                  (detailErr) => {
                    if (detailErr) {
                      return rollbackWithError(
                        500,
                        "Error al guardar el detalle del pedido",
                      );
                    }

                    detallesGuardados += 1;

                    if (detallesGuardados === productosValidados.length) {
                      return orderModel.commitTransaction(
                        connection,
                        (commitErr) => {
                          if (commitErr) {
                            return res.status(500).json({
                              message: "Error al confirmar el pedido",
                            });
                          }

                          return res.status(201).json({
                            message: "Pedido creado correctamente",
                            pedido: {
                              id: pedido_id,
                              tienda_id: tienda.id,
                              cliente_nombre,
                              cliente_email,
                              cliente_telefono,
                              direccion,
                              notas,
                              estado: "pendiente",
                              total,
                              productos: productosValidados,
                            },
                          });
                        },
                      );
                    }
                  },
                );
              }
            },
          );
        }

        const item = productos[index];
        const producto_id = Number(item.producto_id);
        const cantidad = Number(item.cantidad);

        if (
          Number.isNaN(producto_id) ||
          Number.isNaN(cantidad) ||
          cantidad <= 0 ||
          !Number.isInteger(cantidad)
        ) {
          return rollbackWithError(
            400,
            "Los productos enviados no son validos",
          );
        }

        orderModel.getProductByIdAndStoreWithConnection(
          connection,
          producto_id,
          tienda.id,
          (productErr, productResult) => {
            if (productErr) {
              return rollbackWithError(500, "Error al validar los productos");
            }

            if (productResult.length === 0) {
              return rollbackWithError(
                400,
                `El producto con id ${producto_id} no existe en esta tienda`,
              );
            }

            const producto = productResult[0];

            if (cantidad > producto.stock) {
              return rollbackWithError(
                400,
                `Stock insuficiente para el producto ${producto.titulo}`,
              );
            }

            const subtotal = Number(producto.precio) * cantidad;
            const nuevoStock = producto.stock - cantidad;

            orderModel.updateProductStockWithConnection(
              connection,
              producto.id,
              nuevoStock,
              (stockErr) => {
                if (stockErr) {
                  return rollbackWithError(
                    500,
                    "Error al actualizar el stock del producto",
                  );
                }

                productosValidados.push({
                  producto_id: producto.id,
                  titulo: producto.titulo,
                  cantidad,
                  precio_unitario: Number(producto.precio),
                  subtotal,
                });

                total += subtotal;

                procesarProducto(index + 1);
              },
            );
          },
        );
      };

      procesarProducto(0);
    });
  });
};

exports.getMyStoreOrders = (req, res) => {
  storeModel.getStoreByUserId(req.userId, (err, storeResult) => {
    if (err) {
      return res.status(500).json({
        message: "Error al buscar la tienda del usuario",
      });
    }

    if (storeResult.length === 0) {
      return res.status(404).json({
        message: "No tienes una tienda creada",
      });
    }

    const tienda = storeResult[0];

    orderModel.getOrdersByStoreId(tienda.id, (err, ordersResult) => {
      if (err) {
        return res.status(500).json({
          message: "Error al obtener los pedidos",
        });
      }

      return res.json({
        tienda: {
          id: tienda.id,
          nombre: tienda.nombre,
          slug: tienda.slug,
        },
        pedidos: ordersResult,
      });
    });
  });
};

exports.getMyStoreOrderDetail = (req, res) => {
  const orderId = Number(req.params.orderId);

  if (Number.isNaN(orderId)) {
    return res.status(400).json({
      message: "El id del pedido no es valido",
    });
  }

  storeModel.getStoreByUserId(req.userId, (err, storeResult) => {
    if (err) {
      return res.status(500).json({
        message: "Error al buscar la tienda del usuario",
      });
    }

    if (storeResult.length === 0) {
      return res.status(404).json({
        message: "No tienes una tienda creada",
      });
    }

    const tienda = storeResult[0];

    orderModel.getOrdersByStoreId(tienda.id, (err, ordersResult) => {
      if (err) {
        return res.status(500).json({
          message: "Error al buscar los pedidos",
        });
      }

      const pedido = ordersResult.find((item) => item.id === orderId);

      if (!pedido) {
        return res.status(404).json({
          message: "Pedido no encontrado en tu tienda",
        });
      }

      orderModel.getOrderDetailsByOrderId(orderId, (err, detailResult) => {
        if (err) {
          return res.status(500).json({
            message: "Error al obtener el detalle del pedido",
          });
        }

        return res.json({
          tienda: {
            id: tienda.id,
            nombre: tienda.nombre,
            slug: tienda.slug,
          },
          pedido,
          detalle: detailResult,
        });
      });
    });
  });
};

exports.updateMyStoreOrderStatus = (req, res) => {
  const orderId = Number(req.params.orderId);
  const estado = req.body.estado?.trim().toLowerCase();

  const estadosPermitidos = ["pendiente", "confirmado", "enviado", "entregado"];

  if (Number.isNaN(orderId)) {
    return res.status(400).json({
      message: "El id del pedido no es valido",
    });
  }

  if (!estado || !estadosPermitidos.includes(estado)) {
    return res.status(400).json({
      message: "El estado enviado no es valido",
    });
  }

  storeModel.getStoreByUserId(req.userId, (err, storeResult) => {
    if (err) {
      return res.status(500).json({
        message: "Error al buscar la tienda del usuario",
      });
    }

    if (storeResult.length === 0) {
      return res.status(404).json({
        message: "No tienes una tienda creada",
      });
    }

    const tienda = storeResult[0];

    orderModel.getOrdersByStoreId(tienda.id, (err, ordersResult) => {
      if (err) {
        return res.status(500).json({
          message: "Error al buscar los pedidos",
        });
      }

      const pedido = ordersResult.find((item) => item.id === orderId);

      if (!pedido) {
        return res.status(404).json({
          message: "Pedido no encontrado en tu tienda",
        });
      }

      orderModel.updateOrderStatus(orderId, estado, (err) => {
        if (err) {
          return res.status(500).json({
            message: "Error al actualizar el estado del pedido",
          });
        }

        return res.json({
          message: "Estado del pedido actualizado correctamente",
          pedido: {
            id: orderId,
            estado,
          },
        });
      });
    });
  });
};

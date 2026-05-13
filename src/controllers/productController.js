const productModel = require("../models/productModel");
const db = require("../config/db");
const storeModel = require("../models/storeModel");

const parseProductPayload = (req) => {
  return {
    titulo: req.body.titulo?.trim(),
    descripcion: req.body.descripcion?.trim() || "",
    categoria: req.body.categoria?.trim() || "",
    estado: req.body.estado?.trim() || "",
    precio: Number(req.body.precio),
    stock: Number(req.body.stock),
  };
};

const validateProductPayload = (product) => {
  if (!product.titulo) {
    return "El título del producto es obligatorio";
  }

  if (Number.isNaN(product.precio) || product.precio <= 0) {
    return "El precio debe ser un número mayor a 0";
  }

  if (
    Number.isNaN(product.stock) ||
    product.stock < 0 ||
    !Number.isInteger(product.stock)
  ) {
    return "El stock debe ser un número entero igual o mayor a 0";
  }

  return null;
};

const getSellerStoreId = (userId, callback) => {
  const sql = "SELECT id FROM tiendas WHERE usuario_id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return callback(err);
    }

    if (result.length === 0) {
      return callback(null, null);
    }

    return callback(null, result[0].id);
  });
};

exports.createProduct = (req, res) => {
  const product = parseProductPayload(req);
  const validationError = validateProductPayload(product);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  const imagen = req.file ? req.file.path : null;

  getSellerStoreId(req.userId, (err, tiendaId) => {
    if (err) {
      return res.status(500).json({
        message: "Error al verificar la tienda del usuario",
      });
    }

    if (!tiendaId) {
      return res.status(404).json({
        message: "No tienes una tienda creada",
      });
    }

    const newProduct = {
      ...product,
      imagen,
      tienda_id: tiendaId,
    };

    productModel.createProduct(newProduct, (createErr, result) => {
      if (createErr) {
        return res.status(500).json({
          message: "Error al crear el producto",
        });
      }

      return res.json({
        message: "Producto publicado",
        id: result.insertId,
      });
    });
  });
};

exports.getMyStoreProducts = (req, res) => {
  getSellerStoreId(req.userId, (err, tiendaId) => {
    if (err) {
      return res.status(500).json({
        message: "Error al verificar la tienda del usuario",
      });
    }

    if (!tiendaId) {
      return res.status(404).json({
        message: "No tienes una tienda creada",
      });
    }

    productModel.getProductsByStoreId(tiendaId, (productsErr, products) => {
      if (productsErr) {
        return res.status(500).json({
          message: "Error al obtener los productos de tu tienda",
        });
      }

      return res.json(products);
    });
  });
};

exports.getStoreProducts = (req, res) => {
  const slug = req.params.slug;

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

    productModel.getProductsByStore(slug, (productsErr, productsResult) => {
      if (productsErr) {
        return res.status(500).json({
          message: "Error al obtener los productos",
        });
      }

      return res.json(productsResult);
    });
  });
};

exports.updateMyProduct = (req, res) => {
  const productId = Number(req.params.productId);
  const product = parseProductPayload(req);
  const validationError = validateProductPayload(product);

  if (Number.isNaN(productId)) {
    return res.status(400).json({
      message: "El id del producto no es válido",
    });
  }

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  getSellerStoreId(req.userId, (err, tiendaId) => {
    if (err) {
      return res.status(500).json({
        message: "Error al verificar la tienda del usuario",
      });
    }

    if (!tiendaId) {
      return res.status(404).json({
        message: "No tienes una tienda creada",
      });
    }

    productModel.getProductByIdAndStore(productId, tiendaId, (productErr, rows) => {
      if (productErr) {
        return res.status(500).json({
          message: "Error al buscar el producto",
        });
      }

      if (rows.length === 0) {
        return res.status(404).json({
          message: "Producto no encontrado en tu tienda",
        });
      }

      const existingProduct = rows[0];
      const imagen = req.file ? req.file.path : existingProduct.imagen;

      productModel.updateProduct(
        {
          ...product,
          imagen,
          id: productId,
          tienda_id: tiendaId,
        },
        (updateErr, result) => {
          if (updateErr) {
            return res.status(500).json({
              message: "Error al actualizar el producto",
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "Producto no encontrado en tu tienda",
            });
          }

          return res.json({
            message: "Producto actualizado correctamente",
          });
        },
      );
    });
  });
};

exports.deleteMyProduct = (req, res) => {
  const productId = Number(req.params.productId);

  if (Number.isNaN(productId)) {
    return res.status(400).json({
      message: "El id del producto no es válido",
    });
  }

  getSellerStoreId(req.userId, (err, tiendaId) => {
    if (err) {
      return res.status(500).json({
        message: "Error al verificar la tienda del usuario",
      });
    }

    if (!tiendaId) {
      return res.status(404).json({
        message: "No tienes una tienda creada",
      });
    }

    productModel.deleteProduct(productId, tiendaId, (deleteErr, result) => {
      if (deleteErr) {
        return res.status(500).json({
          message: "Error al eliminar el producto",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Producto no encontrado en tu tienda",
        });
      }

      return res.json({
        message: "Producto eliminado correctamente",
      });
    });
  });
};

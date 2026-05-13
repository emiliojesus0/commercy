const productModel = require("../models/productModel");
const db = require("../config/db");
const storeModel = require("../models/storeModel");

exports.createProduct = (req, res) => {
  const titulo = req.body.titulo?.trim();
  const descripcion = req.body.descripcion?.trim() || "";
  const categoria = req.body.categoria?.trim() || "";
  const estado = req.body.estado?.trim() || "";
  const precio = Number(req.body.precio);
  const stock = Number(req.body.stock);
  if (!titulo) {
    return res.status(400).json({
      message: "El titulo del producto es obligatorio",
    });
  }

  if (Number.isNaN(precio) || precio <= 0) {
    return res.status(400).json({
      message: "El precio debe ser un numero mayor a 0",
    });
  }

  if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    return res.status(400).json({
      message: "El stock debe ser un numero entero igual o mayor a 0",
    });
  }

  const imagen = req.file ? req.file.path : null;

  const sql = "SELECT id FROM tiendas WHERE usuario_id = ?";

  db.query(sql, [req.userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error al verificar la tienda del usuario",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "No tienes una tienda creada",
      });
    }

    const tienda_id = result[0].id;

    const newProduct = {
      titulo,
      descripcion,
      precio,
      stock,
      categoria,
      estado,
      imagen,
      tienda_id,
    };

    productModel.createProduct(newProduct, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Error al verificar la tienda del usuario",
        });
      }

      res.json({
        message: "Producto publicado",
        id: result.insertId,
      });
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

    productModel.getProductsByStore(slug, (err, productsResult) => {
      if (err) {
        return res.status(500).json({
          message: "Error al obtener los productos",
        });
      }

      res.json(productsResult);
    });
  });
};

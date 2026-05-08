const userModel = require("../models/userModel");

exports.getVendedores = (req, res) => {
  userModel.getVendedores((err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error al obtener los vendedores",
      });
    }

    return res.json(result);
  });
};

exports.activarVendedor = (req, res) => {
  const userId = Number(req.params.userId);

  if (Number.isNaN(userId)) {
    return res.status(400).json({
      message: "El id del usuario no es valido",
    });
  }

  userModel.activarVendedor(userId, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error al activar el vendedor",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Vendedor no encontrado",
      });
    }

    return res.json({
      message: "Vendedor activado correctamente",
    });
  });
};

exports.desactivarVendedor = (req, res) => {
  const userId = Number(req.params.userId);

  if (Number.isNaN(userId)) {
    return res.status(400).json({
      message: "El id del usuario no es valido",
    });
  }

  userModel.desactivarVendedor(userId, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error al desactivar el vendedor",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Vendedor no encontrado",
      });
    }

    return res.json({
      message: "Vendedor desactivado correctamente",
    });
  });
};

const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.getUsers = (req, res) => {
  return res.status(501).json({
    message: "Endpoint no implementado",
  });
};

exports.createUser = async (req, res) => {
  const nombre = req.body.nombre?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!nombre || !email || !password) {
    return res.status(400).json({
      message: "Nombre, email y password son obligatorios",
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({
      message: "El email no es valido",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "La password debe tener al menos 6 caracteres",
    });
  }

  userModel.findUserByEmail(email, async (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error al verificar el email",
      });
    }

    if (result.length > 0) {
      return res.status(400).json({
        message: "Ya existe un usuario con ese email",
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        nombre,
        email,
        password: hashedPassword,
        rol: "vendedor",
        activo: 0,
      };

      userModel.createUser(newUser, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Error al crear el usuario",
          });
        }

        res.json({
          message: "Usuario guardado",
          id: result.insertId,
        });
      });
    } catch (error) {
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  });
};

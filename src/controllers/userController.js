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
      message: "El email no es válido",
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

      userModel.createUser(newUser, (createErr, createResult) => {
        if (createErr) {
          return res.status(500).json({
            message: "Error al crear el usuario",
          });
        }

        return res.json({
          message: "Usuario guardado",
          id: createResult.insertId,
        });
      });
    } catch {
      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  });
};

exports.getMyProfile = (req, res) => {
  userModel.findUserById(req.userId, (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Error al obtener la cuenta",
      });
    }

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.json(rows[0]);
  });
};

exports.updateMyProfile = (req, res) => {
  const nombre = req.body.nombre?.trim();

  if (!nombre) {
    return res.status(400).json({
      message: "El nombre es obligatorio",
    });
  }

  userModel.updateUserProfile(
    {
      id: req.userId,
      nombre,
    },
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Error al actualizar la cuenta",
        });
      }

      return res.json({
        message: "Cuenta actualizada correctamente",
      });
    },
  );
};

exports.updateMyPassword = async (req, res) => {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: "La contraseña actual y la nueva son obligatorias",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: "La nueva contraseña debe tener al menos 6 caracteres",
    });
  }

  userModel.findUserAuthById(req.userId, async (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Error al obtener la cuenta",
      });
    }

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(currentPassword, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: "La contraseña actual es incorrecta",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    userModel.updateUserPassword(
      {
        id: req.userId,
        password: hashedPassword,
      },
      (updateErr) => {
        if (updateErr) {
          return res.status(500).json({
            message: "Error al actualizar la contraseña",
          });
        }

        return res.json({
          message: "Contraseña actualizada correctamente",
        });
      },
    );
  });
};

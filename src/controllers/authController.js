const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

exports.login = (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email y password son obligatorios",
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({
      message: "El email no es valido",
    });
  }

  const sql = "SELECT * FROM usuarios WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error al iniciar sesion",
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    const user = result[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        rol: user.rol,
        activo: user.activo,
      },
      env.jwtSecret,
      {
        expiresIn: env.jwtExpiresIn,
      },
    );

    res.json({
      message: "Login exitoso",
      token,
    });
  });
};

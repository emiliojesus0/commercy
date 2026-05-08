const jwt = require("jsonwebtoken");
const env = require("../config/env");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      message: "Token requerido",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      message: "Formato de token invalido",
    });
  }

  const token = parts[1];

  jwt.verify(token, env.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Token invalido",
      });
    }

    req.userId = decoded.id;
    req.userRole = decoded.rol;
    req.userActivo = decoded.activo;

    next();
  });
};

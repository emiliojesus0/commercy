exports.isActiveSeller = (req, res, next) => {
  if (!req.userActivo) {
    return res.status(403).json({
      message: "Tu cuenta esta inactiva. No puedes realizar esta accion",
    });
  }

  next();
};

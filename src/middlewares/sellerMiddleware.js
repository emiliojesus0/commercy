exports.isActiveSeller = (req, res, next) => {
  if (!req.userActivo) {
    return res.status(403).json({
      message: "Tu cuenta está inactiva. No puedes realizar esta acción",
    });
  }

  next();
};

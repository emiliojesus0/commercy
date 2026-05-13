const storeModel = require("../models/storeModel");
const slugify = require("slugify");

exports.createStore = (req, res) => {
  const nombre = req.body.nombre?.trim();
  const descripcion = req.body.descripcion?.trim() || "";
  if (!req.userActivo) {
    return res.status(403).json({
      message: "Tu cuenta aún no ha sido activada por un administrador",
    });
  }

  if (!nombre) {
    return res.status(400).json({
      message: "El nombre de la tienda es obligatorio",
    });
  }

  const slug = slugify(nombre, {
    lower: true,
    strict: true,
  });

  storeModel.getStoreByUserId(req.userId, (err, userStores) => {
    if (err) {
      return res.status(500).json({
        message: "Error al verificar la tienda del usuario",
      });
    }

    if (userStores.length > 0) {
      return res.status(400).json({
        message: "Ya tienes una tienda creada",
      });
    }

    storeModel.getStoreBySlugExact(slug, (err, slugStores) => {
      if (err) {
        return res.status(500).json({
          message: "Error al verificar el nombre de la tienda",
        });
      }

      if (slugStores.length > 0) {
        return res.status(400).json({
          message: "Ya existe una tienda con ese nombre",
        });
      }

      const newStore = {
        nombre,
        slug,
        descripcion,
        usuario_id: req.userId,
      };

      storeModel.createStore(newStore, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Error al crear la tienda",
          });
        }

        res.json({
          message: "Tienda creada",
          slug: slug,
        });
      });
    });
  });
};

exports.getStore = (req, res) => {
  const slug = req.params.slug;

  storeModel.getStoreBySlug(slug, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error al obtener la tienda",
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        message: "Tienda no encontrada",
      });
    }

    res.json(result[0]);
  });
};

exports.getMyStore = (req, res) => {
  storeModel.getStoreByUserId(req.userId, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error al obtener la tienda del usuario",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "No tienes una tienda creada",
      });
    }

    return res.json(result[0]);
  });
};

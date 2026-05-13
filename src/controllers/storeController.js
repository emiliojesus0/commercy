const storeModel = require("../models/storeModel");
const slugify = require("slugify");

const DEFAULT_STORE_COLOR = "#f8fafc";

const sanitizeStoreColor = (value) => {
  const color = value?.trim();

  if (!color) {
    return DEFAULT_STORE_COLOR;
  }

  const isHexColor = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);

  return isHexColor ? color : null;
};

exports.createStore = (req, res) => {
  const nombre = req.body.nombre?.trim();
  const descripcion = req.body.descripcion?.trim() || "";
  const color_fondo = sanitizeStoreColor(req.body.color_fondo);
  const logo = req.file ? req.file.path : null;

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

  if (!color_fondo) {
    return res.status(400).json({
      message: "El color de fondo no es válido",
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

    storeModel.getStoreBySlugExact(slug, (slugErr, slugStores) => {
      if (slugErr) {
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
        color_fondo,
        logo,
        usuario_id: req.userId,
      };

      storeModel.createStore(newStore, (createErr) => {
        if (createErr) {
          return res.status(500).json({
            message: "Error al crear la tienda",
          });
        }

        return res.json({
          message: "Tienda creada",
          slug,
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

    return res.json(result[0]);
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

exports.updateMyStore = (req, res) => {
  const nombre = req.body.nombre?.trim();
  const descripcion = req.body.descripcion?.trim() || "";
  const color_fondo = sanitizeStoreColor(req.body.color_fondo);

  if (!nombre) {
    return res.status(400).json({
      message: "El nombre de la tienda es obligatorio",
    });
  }

  if (!color_fondo) {
    return res.status(400).json({
      message: "El color de fondo no es válido",
    });
  }

  storeModel.getStoreByUserId(req.userId, (err, stores) => {
    if (err) {
      return res.status(500).json({
        message: "Error al obtener la tienda del usuario",
      });
    }

    if (stores.length === 0) {
      return res.status(404).json({
        message: "No tienes una tienda creada",
      });
    }

    const store = stores[0];
    const slug = slugify(nombre, {
      lower: true,
      strict: true,
    });
    const logo = req.file ? req.file.path : store.logo;

    storeModel.getStoreBySlugExactExcludingId(slug, store.id, (slugErr, rows) => {
      if (slugErr) {
        return res.status(500).json({
          message: "Error al validar el nombre de la tienda",
        });
      }

      if (rows.length > 0) {
        return res.status(400).json({
          message: "Ya existe una tienda con ese nombre",
        });
      }

      storeModel.updateStore(
        {
          id: store.id,
          nombre,
          slug,
          descripcion,
          color_fondo,
          logo,
          usuario_id: req.userId,
        },
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({
              message: "Error al actualizar la tienda",
            });
          }

          return res.json({
            message: "Tienda actualizada correctamente",
            slug,
          });
        },
      );
    });
  });
};

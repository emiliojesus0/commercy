const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/adminMiddleware");

router.get("/users", verifyToken, isAdmin, adminController.getVendedores);
router.patch(
  "/users/:userId/activate",
  verifyToken,
  isAdmin,
  adminController.activarVendedor,
);
router.patch(
  "/users/:userId/deactivate",
  verifyToken,
  isAdmin,
  adminController.desactivarVendedor,
);

module.exports = router;

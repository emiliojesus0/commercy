const express = require("express");
const router = express.Router();
const { isActiveSeller } = require("../middlewares/sellerMiddleware");

const productController = require("../controllers/productController");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post(
  "/",
  verifyToken,
  isActiveSeller,
  upload.single("imagen"),
  productController.createProduct,
);

router.get("/store/:slug/products", productController.getStoreProducts);

module.exports = router;

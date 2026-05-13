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

router.get(
  "/my/products",
  verifyToken,
  isActiveSeller,
  productController.getMyStoreProducts,
);
router.patch(
  "/my/products/:productId",
  verifyToken,
  isActiveSeller,
  upload.single("imagen"),
  productController.updateMyProduct,
);
router.delete(
  "/my/products/:productId",
  verifyToken,
  isActiveSeller,
  productController.deleteMyProduct,
);
router.get("/store/:slug/products", productController.getStoreProducts);

module.exports = router;

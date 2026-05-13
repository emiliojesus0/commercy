const express = require("express");
const router = express.Router();
const { isActiveSeller } = require("../middlewares/sellerMiddleware");

const storeController = require("../controllers/storeController");
const authMiddleware = require("../middlewares/authMiddleware");
const orderController = require("../controllers/orderController");

router.post(
  "/",
  authMiddleware.verifyToken,
  isActiveSeller,
  storeController.createStore,
);
router.patch(
  "/my/store",
  authMiddleware.verifyToken,
  isActiveSeller,
  storeController.updateMyStore,
);

router.post("/:slug/orders", orderController.createOrder);
router.get("/my/store", authMiddleware.verifyToken, storeController.getMyStore);
router.get(
  "/my/orders",
  authMiddleware.verifyToken,
  isActiveSeller,
  orderController.getMyStoreOrders,
);

router.get(
  "/my/orders/:orderId",
  authMiddleware.verifyToken,
  isActiveSeller,
  orderController.getMyStoreOrderDetail,
);

router.patch(
  "/my/orders/:orderId/status",
  authMiddleware.verifyToken,
  isActiveSeller,
  orderController.updateMyStoreOrderStatus,
);

router.get("/:slug", storeController.getStore);

module.exports = router;

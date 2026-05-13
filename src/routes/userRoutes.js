const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/me", verifyToken, userController.getMyProfile);
router.patch("/me", verifyToken, userController.updateMyProfile);
router.patch("/me/password", verifyToken, userController.updateMyPassword);
router.get("/", userController.getUsers);
router.post("/", userController.createUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { userController } = require("../controllers/index");

router.get("/users", verifyToken, userController.getAllUsers);
router.get("/user/:id", verifyToken, userController.getUserById);

module.exports = router;

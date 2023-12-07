const express = require("express");
const router = express.Router();
const { authController } = require("../controllers/index");

router.get("/verify/:iv/:token", authController.verifyUser);
router.get("/reset/:iv/:token", authController.resetPassword);

module.exports = router;

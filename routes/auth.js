const express = require("express");
const router = express.Router();
const { authController } = require("../controllers/index");
const validateRegisterUserInput = require("../middlewares/validationRegisterUserInput");

router.post("/login", authController.loginUser);
router.post(
  "/register",
  validateRegisterUserInput,
  authController.registerUser
);
router.get("/forgotPassword", authController.forgotPassword);

module.exports = router;

const dayjs = require("dayjs");
const { decrypt } = require("../lib/auth");
const { authService, userService } = require("../services/index");
const { validationResult } = require("express-validator");

async function registerUser(req, res) {
  const { name, email, password, contact } = req.body;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const response = await authService.createUser({
      name,
      email,
      password,
      contact,
    });

    if (response.success) {
      res.status(201).json({
        status: "success",
        message: "Need to check mail and verify their account",
      });
    } else {
      res.status(400).json({
        status: "error",
        message: response.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const response = await authService.loginUser({ email, password });

    if (response.success) {
      res.status(200).json({
        status: "success",
        token: response.data,
        message: "Login successful",
      });
    } else {
      res.status(401).json({
        status: "error",
        message: response.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

async function verifyUser(req, res) {
  const iv = req.params.iv;
  const encryptedData = req.params.token;
  const token = {
    iv,
    encryptedData,
  };

  let decryptedContent = await decrypt(token);
  let data = JSON.parse(decryptedContent);
  const diffInMinutes = dayjs().diff(data.expireIn, "minute");
  if (data.id && diffInMinutes <= process.env.LINK_EXPIRE_TIME) {
    const result = await authService.updateUserVerificationStatus(data.id);
    if (result.success) {
      res.status(200).json({
        status: "success",
        message: "Verification status updated",
      });
    } else {
      res.status(404).json({ status: "error", message: result.message });
    }
  } else {
    res.status(404).json({ status: "error", message: "Link is expire" });
  }
}

async function forgotPassword(req, res) {
  try {
    const response = await userService.getUserByEmail(req.query.email);
    if (response.success) {
      res.status(200).json({ status: "success", message: response.message });
    } else {
      res.status(500).json({
        status: "error",
        message: response.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

async function resetPassword(req, res) {
  const iv = req.params.iv;
  const encryptedData = req.params.token;
  const token = {
    iv,
    encryptedData,
  };
  const newPassword = req.body.newPassword;

  let decryptedContent = await decrypt(token);
  let data = JSON.parse(decryptedContent);
  const diffInMinutes = dayjs().diff(data.expireIn, "minute");

  if (data.id && diffInMinutes <= process.env.LINK_EXPIRE_TIME) {
    const result = await authService.resetUserPassword(data.id, newPassword);
    if (result.success) {
      res.status(200).json({
        status: "success",
        message: "Updated password successfully",
      });
    } else {
      res.status(404).json({ status: "error", message: result.message });
    }
  } else {
    res.status(404).json({ status: "error", message: "Link is expire" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  forgotPassword,
  resetPassword,
};

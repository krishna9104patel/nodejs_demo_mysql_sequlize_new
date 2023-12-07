const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { ValidationError } = require("sequelize");
const {
  generateEncryptedVerifyLink,
  sendEmailWithLink,
} = require("../lib/auth");

//register user
async function createUser({ name, email, password, contact, status }) {
  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return { success: false, message: "Email is already registered" };
    }

    const hashedPassword = "";
    if (password !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      contact,
      status,
    });

    if (user) {
      const token = await generateEncryptedVerifyLink(user);
      const link = `${process.env.BASE_URL_FOR_WEB}/verify/${token.iv}/${token.encryptedData}`;
      sendEmailWithLink(
        user.email,
        link,
        "Click the following link to complete your registration",
        "Registration Confirmation"
      );
      return { success: true, data: user };
    } else {
      return { success: false, message: "Error in sending mail" };
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const validationErrors = error.errors.map((err) => err.message);
      return {
        success: false,
        message: `Validation failed: ${validationErrors.join(", ")}`,
      };
    }
    return { success: false, message: error.message };
  }
}

//login user
async function loginUser({ email, password }) {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }
    if (user.verification === 0) {
      const token = await generateEncryptedVerifyLink(user);
      const link = `${process.env.BASE_URL_FOR_WEB}/verify/${token.iv}/${token.encryptedData}`;
      sendEmailWithLink(
        user.email,
        link,
        "Click the following link to complete your registration",
        "Registration Confirmation"
      );
      return {
        success: false,
        message:
          "First verify your account. Link sent on mail. Please checked.",
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign(
        {
          userId: user.id,
          name: user.name,
          email: user.email,
          contactNo: user.contact,
        },
        process.env.JWT_SECRET
      );
      return { success: true, data: token };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

//update verification of user
async function updateUserVerificationStatus(id) {
  try {
    const user = await User.findOne({ where: { id } });
    if (user) {
      user.verification = 1;
      await user.save();
      return { success: true, data: user };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    return { success: false, message: "Error updating verification status" };
  }
}

//reset password
async function resetUserPassword(id, newPassword) {
  try {
    const user = await User.findOne({ where: { id } });
    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      return { success: true, message: "Password updated successfully!" };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    return { success: false, message: "Error password updating" };
  }
}

module.exports = {
  createUser,
  loginUser,
  updateUserVerificationStatus,
  resetUserPassword,
};

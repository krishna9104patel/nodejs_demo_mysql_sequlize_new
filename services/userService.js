const {
  generateEncryptedVerifyLink,
  sendEmailWithLink,
} = require("../lib/auth");
const { User } = require("../models");

//get list of users
async function getAllUsers() {
  try {
    const users = await User.findAll();
    return { success: true, data: users };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

//get detail of user by id
async function getUserById(userId) {
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    return { success: true, data: user };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

//get detail of user by email
async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return { success: false, message: "User not found" };
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
    } else {
      const token = await generateEncryptedVerifyLink(user);
      const link = `${process.env.BASE_URL_FOR_WEB}/reset/${token.iv}/${token.encryptedData}`;
      sendEmailWithLink(
        user.email,
        link,
        "Click the following link to reset your password",
        "Reset Password"
      );
      return {
        success: true,
        message: "Please check mail to reset password.",
      };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
};

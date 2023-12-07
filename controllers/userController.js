const { userService } = require("../services/index");

async function getAllUsers(req, res) {
  try {
    const response = await userService.getAllUsers();

    if (response.success) {
      res.status(200).json({ status: "success", data: response.data });
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

async function getUserById(req, res) {
  try {
    const response = await userService.getUserById(req.params.id);

    if (response.success) {
      res.status(200).json({ status: "success", data: response.data });
    } else {
      res.status(404).json({
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

module.exports = {
  getAllUsers,
  getUserById,
};

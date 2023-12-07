const { validationResult } = require("express-validator");
const { categoryService } = require("../services");

async function saveCategory(req, res) {
  const { name } = req.body;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const response = await categoryService.saveCategory({
      name,
    });

    if (response.success) {
      res.status(201).json({
        status: "success",
        message: "Category saved successfully!",
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

async function getCategory(req, res) {
  try {
    const response = await categoryService.getCategory(req.query.id);

    if (response.success) {
      res.status(200).json({
        status: "success",
        token: response.data,
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

async function updateCategory(req, res) {
  try {
    const response = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
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

async function deleteCategory(req, res) {
  try {
    const response = await categoryService.deleteCategory(req.params.id);
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

module.exports = {
  saveCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};

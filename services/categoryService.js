const { ValidationError } = require("sequelize");
const { Category } = require("../models");

//save category
async function saveCategory({ name, status }) {
  try {
    const existingCategory = await Category.findOne({ where: { name } });

    if (existingCategory) {
      return { success: false, message: "Category is already exists" };
    }

    const catgeory = await Category.create({
      name,
      status,
    });

    if (catgeory) {
      return { success: true, data: catgeory };
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

//get all categories or category by id
async function getCategory(id) {
  try {
    if (id) {
      const category = await Category.findOne({ where: { id } });
      if (category) {
        return { success: true, data: category };
      } else {
        return { success: false, message: "Category not found" };
      }
    } else {
      const categories = await Category.findAll();
      if (categories && categories.length > 0) {
        return { success: true, data: categories };
      } else {
        return { success: false, message: "No categories found" };
      }
    }
  } catch (error) {
    return { success: false, message: "Error getting categories" };
  }
}

//update category
async function updateCategory({ id, updatedObj }) {
  try {
    const category = await Category.findOne({ where: { id } });
    if (category) {
      category.name = updatedObj.name;
      category.status = updatedObj.status;
      await category.save();
      return { success: true, data: category };
    } else {
      return { success: false, message: "Category not found" };
    }
  } catch (error) {
    return { success: false, message: "Error updating category" };
  }
}

//delete category
async function deleteCategory(id) {
  try {
    const category = await Category.destroy({ where: { id } });
    if (category) {
      return { success: true, message: "Category deleted successfully" };
    } else {
      return { success: false, message: "Category not found" };
    }
  } catch (error) {
    return { success: false, message: "Error getting categories" };
  }
}

module.exports = {
  saveCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};

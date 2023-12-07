"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
      Product.hasMany(models.ProductImages, {
        foreignKey: "productId",
        as: "images",
      });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      desc: DataTypes.STRING,
      price: DataTypes.FLOAT,
      categoryId: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};

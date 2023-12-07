"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductImages extends Model {
    static associate(models) {
      ProductImages.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }
  ProductImages.init(
    {
      imageSrc: DataTypes.STRING,
      productId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ProductImages",
    }
  );
  return ProductImages;
};

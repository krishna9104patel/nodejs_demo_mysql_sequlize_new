"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "ProductImages",
      "imageSrc",
      "imageName",
      {
        type: Sequelize.STRING,
      }
    );
    await queryInterface.addColumn("ProductImages", "status", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("ProductImages", "status");
    await queryInterface.renameColumn("ProductImages", "imageName", "imageSrc");
  },
};

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Categories", "status", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Categories", "status", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};

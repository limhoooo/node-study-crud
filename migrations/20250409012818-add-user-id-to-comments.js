"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("comments", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      // 외래키 설정이 필요하면 다음 줄도 추가:
      // references: { model: 'users', key: 'id' },
      // onUpdate: 'CASCADE',
      // onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("comments", "user_id");
  },
};

'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      postId: {
        type: Sequelize.UUID,
      },
      userId: {
        type: Sequelize.UUID,
      },
      content: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('Comments', ['id', 'postId', 'userId']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Comments');
    await queryInterface.removeIndex('Comments', ['id', 'postId', 'userId']);
  },
};

'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
      },
      title: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.TEXT,
      },
      cover: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
      },
    });

    await queryInterface.addIndex('Posts', ['id', 'userId']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Posts');
    await queryInterface.removeIndex('Posts', ['id', 'userId']);
  },
};

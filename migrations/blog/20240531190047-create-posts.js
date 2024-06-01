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
        allowNull: true,
      },
      postedBy: {
        type: Sequelize.STRING,
      },
      postedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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

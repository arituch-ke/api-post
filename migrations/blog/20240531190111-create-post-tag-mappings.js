'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PostTagMappings', {
      postId: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      tagId: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
    });

    await queryInterface.addIndex('PostTagMappings', ['postId', 'tagId']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PostTagMappings');
    await queryInterface.removeIndex('PostTagMappings', ['postId', 'tagId']);
  },
};

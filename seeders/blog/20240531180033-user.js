const bcrypt = require('bcryptjs');
const {randomUUID} = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: randomUUID(),
        name: 'John Doe',
        username: null,
        email: 'john@gmail.com',
        password: bcrypt.hashSync('p@ssw0rd@test', bcrypt.genSaltSync()),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};

const { User, sequelize } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await sequelize.transaction();
    try {
      await User.bulkCreate([
        { name: 'John Doe', email: 'john.doe@example.com' },
        { name: 'Jane Smith', email: 'jane.smith@example.com' },
        { name: 'Alice Johnson', email: 'alice.johnson@example.com' },
      ], { transaction: t });
      await t.commit();
      console.log('User seeder executed successfully.');
    } catch (error) {
      await t.rollback();
      console.error('Error executing user seeder:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await sequelize.transaction();
    try {
      await User.destroy({ where: {}, truncate: true, cascade: true, transaction: t });
      await t.commit();
      console.log('User seeder reverted successfully.');
    } catch (error) {
      await t.rollback();
      console.error('Error reverting user seeder:', error);
      throw error;
    }
  }
};
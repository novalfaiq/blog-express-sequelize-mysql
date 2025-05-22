const { Preference, sequelize } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await sequelize.transaction();
    try {
      await Preference.bulkCreate([
        { name: 'Technology' },
        { name: 'Sports' },
        { name: 'Lifestyle' },
        { name: 'Finance' },
        { name: 'Gaming' }
      ], { transaction: t });
      await t.commit();
      console.log('Preference seeder executed successfully.');
    } catch (error) {
      await t.rollback();
      console.error('Error executing preference seeder:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await sequelize.transaction();
    try {
      await Preference.destroy({ where: {}, truncate: true, cascade: true, transaction: t });
      await t.commit();
      console.log('Preference seeder reverted successfully.');
    } catch (error) {
      await t.rollback();
      console.error('Error reverting preference seeder:', error);
      throw error;
    }
  }
};
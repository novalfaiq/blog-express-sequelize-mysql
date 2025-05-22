const { User, Preference, sequelize } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await sequelize.transaction();
    try {
      const users = await User.findAll({ where: { id: [1, 2, 3] }, transaction: t });
      const preferences = await Preference.findAll({ where: { id: [1, 2, 3, 4, 5] }, transaction: t });

      if (users.length < 3 || preferences.length < 5) {
        console.warn('Not enough users or preferences found to seed UserPreferences. Skipping seeder.');
        await t.commit();
        return;
      }

      await users[0].addPreferences([preferences[0], preferences[1]], { transaction: t });
      await users[1].addPreferences([preferences[2], preferences[3]], { transaction: t });
      await users[2].addPreferences([preferences[4], preferences[0]], { transaction: t });

      await t.commit();
      console.log('UserPreference seeder executed successfully.');
    } catch (error) {
      await t.rollback();
      console.error('Error executing UserPreference seeder:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await sequelize.transaction();
    try {
      // Hapus semua entri dari tabel join UserPreference
      // Cara paling mudah adalah dengan mengambil semua user dan menghapus semua preferensi mereka
      const users = await User.findAll({ include: Preference, transaction: t });
      for (const user of users) {
        await user.setPreferences([], { transaction: t }); // Menghapus semua asosiasi preferensi
      }
      await t.commit();
      console.log('UserPreference seeder reverted successfully.');
    } catch (error) {
      await t.rollback();
      console.error('Error reverting UserPreference seeder:', error);
      throw error;
    }
  }
};
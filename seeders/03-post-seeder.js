const { Post, User, sequelize } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await sequelize.transaction();
    try {
      const users = await User.findAll({ where: { id: [1, 2, 3] }, transaction: t });

      if (users.length < 3) {
        console.warn('Not enough users found to seed posts. Skipping post seeder.');
        await t.commit(); // Commit transaksi kosong jika tidak ada operasi
        return;
      }

      await Post.bulkCreate([
        { title: 'First Post by John', content: 'This is the first post by John Doe.', UserId: users[0].id },
        { title: 'Second Post by John', content: 'Another interesting post from John.', UserId: users[0].id },
        { title: 'Jane\'s Thoughts', content: 'A insightful piece by Jane Smith.', UserId: users[1].id },
        { title: 'Alice\'s Discovery', content: 'Alice shares her latest discovery.', UserId: users[2].id },
      ], { transaction: t });

      await t.commit();
      console.log('Post seeder executed successfully.');
    } catch (error) {
      await t.rollback();
      console.error('Error executing post seeder:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await sequelize.transaction();
    try {
      await Post.destroy({ where: {}, truncate: true, cascade: true, transaction: t });
      await t.commit();
      console.log('Post seeder reverted successfully.');
    } catch (error) {
      await t.rollback();
      console.error('Error reverting post seeder:', error);
      throw error;
    }
  }
};
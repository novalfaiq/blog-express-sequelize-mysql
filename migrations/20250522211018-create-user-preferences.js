'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserPreferences', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      PreferenceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Preferences',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserPreferences');
  }
};

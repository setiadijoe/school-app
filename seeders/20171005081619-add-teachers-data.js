'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Teachers', [{
      first_name: 'Bambang',
      last_name: 'Suprapto',
      email: 'bambangsuprapto@sekolah.id'
    }, {
      first_name: 'Rukmana',
      last_name: 'Fatmawati',
      email: 'rukmanafatmawati@sekolah.id'
    }, {
      first_name: 'Butet',
      last_name: 'Naiborhu',
      email: 'butetnaiborhu@sekolah.id'
    }, {
      first_name: 'Yulius',
      last_name: 'Prawiranegara',
      email: 'yuliusprawiranegara@sekolah.id'
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};

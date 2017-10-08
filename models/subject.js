'use strict';
module.exports = function(sequelize, DataTypes) {
  var Subject = sequelize.define('Subject', {
    subject_name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  Subject.associate = function (models) {
    Subject.hasMany(models.Teacher)
    Subject.belongsToMany(models.Student, {through: 'StudentSubject'});
    Subject.hasMany(models.StudentSubject)
  };
  return Subject;
};
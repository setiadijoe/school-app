'use strict';
module.exports = function(sequelize, DataTypes) {
  var StudentSubject = sequelize.define('StudentSubject', {
    StudentId: DataTypes.INTEGER,
    SubjectId: DataTypes.INTEGER,
    score: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  StudentSubject.associate = function (models) {
    StudentSubject.belongsTo(models.Subject);
    StudentSubject.belongsTo(models.Student)
  };
  return StudentSubject;
};
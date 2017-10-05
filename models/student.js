'use strict';
module.exports = function(sequelize, DataTypes) {
  var Student = sequelize.define('Student', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: 
    {
      type: DataTypes.STRING,
      validate: 
      { 
        isEmail: true,
        isUnique: true 
      }
    }
  });
  Student.prototype.getFullName = function () {
    return this.first_name+' '+this.last_name
  }
  return Student;
};
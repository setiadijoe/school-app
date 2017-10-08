'use strict';
const fullname = require('../helper/fullname');
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
        isUnique: function (value, next) {
          // console.log("======================masuk ke cek unik:", this._modelOptions.whereCollection.id);
          Student.find({
            where: {
              email: value, id: { [sequelize.Op.notIn]: [parseInt(this._modelOptions.whereCollection.id)]}
            },
            attributes: ['id']
          })
            .then(user => {
                // console.log("User:", user);

              if (user) {
                // We found a user with this email address.
                // Pass the error to the next method.
                let error = {
                  message: 'Email already in used'
                }
                return next(error);
              }
                
              // If we got this far, the email address hasn't been used yet.
              // Call next with no arguments when validation is successful.
              next();

            })
            .catch(err => {
              // Some unexpected error occured with the find method.
              return next(err);
            });
          }
      }
    }
  });
  Student.prototype.getFullName = function () {
    return fullname(this.first_name, this.last_name)
  }
  Student.associate = function (models) {
    Student.hasMany(models.StudentSubject)
    Student.belongsToMany(models.Subject, {through: 'StudentSubject'})
  };
  return Student;
};
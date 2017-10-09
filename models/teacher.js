'use strict';
const fullname = require('../helper/fullname');
module.exports = function(sequelize, DataTypes) {
  var Teacher = sequelize.define('Teacher', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    email: 
    {
      type: DataTypes.STRING,
      validate:{
        isEmail: true,
        isUnique: function (value, next) {
          Teacher.find({
            where: {
              email: value, id: { [sequelize.Op.notIn]: [parseInt(this._modelOptions.whereCollection.id)] }
            },
            attributes: ['id']
          })
            .then(user => {
              // console.log("User:", user._modelOptions.whereCollection.id);

              if (user) {
                // We found a user with this email address.
                // Pass the error to the next method.
                let error = {
                  args: true,
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
  }, { 
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  Teacher.associate = function (models) {
      Teacher.belongsTo(models.Subject)
  };
  Teacher.prototype.getFullName = function () {
    return fullname(this.first_name, this.last_name)
  }
  return Teacher;
};
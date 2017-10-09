'use strict';
const salty = require('../helper/salty')
const hash = require('../helper/hash')

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
      hooks:{
        beforeCreate: (user)=>{
          let salt = salty()
          user.salt =salt
          user.password = hash(user.password, salt)
        }
      }
    
  });
  return User;
};
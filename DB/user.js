// const sequelize = require('./connection')
// const {  DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
module.exports = (sequelize, DataTypes, Model) => {

  function hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }
  
  function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
  }

class User extends Model {
  checkPassword(password) {
    const hash = hashPassword(password, this.salt);
    return this.password === hash;
  }
}

 User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      // defaultValue: "Renish Kalariya",
      get() {
            return this.getDataValue('name').toUpperCase();
          },
      validate: {
        notNull: {
          msg: 'Please enter your name',
        },
      },
    
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
    },
    salt: {
      type: DataTypes.STRING,
    }
    // fullName: {
    //   type: DataTypes.VIRTUAL,
    //   get() {
    //     return `${this.firstName} ${this.lastName}`;
    //   },
    // },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User', // We need to choose the model name
    hooks: {
      beforeCreate: (user) => {
        user.salt = generateSalt();
        user.password = hashPassword(user.password, user.salt);
      },
      beforeUpdate: (user) => {
        if (user.changed('password')) {
          user.salt = generateSalt();
          user.password = hashPassword(user.password, user.salt);
        }
      }
    },
    // timestamps: false,

    // // don't forget to enable timestamps!
    // timestamps: true,

    // // I don't want createdAt
    // createdAt: false,

    // // I want updatedAt to actually be called updateTimestamp
    // updatedAt: 'updateTimestamp',
  },
);
// the defined model is the class itself
console.log(User === sequelize.models.User); // true

return User;
}
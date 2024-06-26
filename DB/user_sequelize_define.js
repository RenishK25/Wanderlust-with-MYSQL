// const sequelize = require('./connection')
// const {  DataTypes } = require('sequelize');

// module.exports = User = sequelize.define(
//   'User',
//   {
//     // { name: DataTypes.STRING }, // short method
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     //   defaultValue: "Renish Kalariya",
//     },
//     email: {
//       type: DataTypes.STRING,
//       // allowNull defaults to true
//     },
//     password: {
//       type: DataTypes.STRING,
//       // allowNull defaults to true
//     },
    
//   },
//   {
//     tableName: 'Users',
//     // timestamps: false,

//     // // don't forget to enable timestamps!
//     // timestamps: true,

//     // // I don't want createdAt
//     // createdAt: false,

//     // // I want updatedAt to actually be called updateTimestamp
//     // updatedAt: 'updateTimestamp',
//   },
// );


// // `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true
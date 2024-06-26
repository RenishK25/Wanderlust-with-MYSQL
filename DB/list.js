// const sequelize = require('./connection')
// const {  DataTypes, Model } = require('sequelize');

// const User = require("./user");
const db = require("./connection");

module.exports = (sequelize, DataTypes, Model) => {

class List extends Model {
        
}

module.exports = List.init(
  {
    title : {
        type : DataTypes.STRING,
        allowNull: true,
    },
    
    description : DataTypes.STRING,
    
    image : {
        type : DataTypes.JSON,
        allowNull: true,
    },
    
    price : DataTypes.INTEGER,
    
    location : DataTypes.STRING,
    
    country : DataTypes.STRING,
        
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: db.user,
        key: 'id',
      },
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'List', // We need to choose the model name
    timestamps: true, // Enable timestamps (default behavior)

  },
);

List.addHook('afterDestroy', async (listing, options) => {
    if (listing) {
      await Review.destroy({ where: { listId: listing.id } });
    }
  });

console.log(List === sequelize.models.List); // true
return List;
}
const db = require("./connection");

module.exports = (sequelize, DataTypes, Model) => {

class Review extends Model {
        
}

module.exports = Review.init(
  {
    comment : {
      type : DataTypes.STRING,
      allowNull: false,
    },
    rating : {
        type : DataTypes.STRING,
        min : 1,
        max : 5,
    },
    
    authorId : {
      type: DataTypes.INTEGER,
      references: {
        model: db.user,
        key: 'id',
      },
    },
    
    listId : {
      type: DataTypes.INTEGER,
      references: {
        model: db.user,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Review',
    timestamps: true,
  },
);

console.log(Review === sequelize.models.Review); // true
return Review;
}
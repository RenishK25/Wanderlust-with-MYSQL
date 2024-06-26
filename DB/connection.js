const { Sequelize, DataTypes, Model, Op } = require('sequelize');

const sequelize = new Sequelize('apna_colleage', 'root', 'mysql', {
    host: 'localhost',
    dialect: 'mysql',/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
    logging: false,
    operatorsAliases: {
        // $gt: Op.gt,
        $gt: Op.gt,
      },
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

const db ={};
db.Sequelize =Sequelize;
db.sequelize = sequelize;

db.user = require("./user")(sequelize, DataTypes, Model)
db.list = require("./list")(sequelize, DataTypes, Model)
db.review = require("./review")(sequelize, DataTypes, Model)


// db.user.hasOne(db.list, {foreignKey: 'ownerId' }); // A HasOne B

db.user.hasMany(db.list, {foreignKey: 'ownerId' });
db.list.belongsTo(db.user, {foreignKey: 'ownerId',  as: 'owner' });


// db.user.hasMany(db.review, { foreignKey: 'authorId' });
db.review.belongsTo(db.user, { foreignKey: 'authorId', as: 'author' });

db.user.hasMany(db.review, { foreignKey: 'authorId' });
// Review.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

db.list.hasMany(db.review, { foreignKey: 'listId' });
// db.review.belongsTo(db.list, { foreignKey: 'listId' });

// db.user.hasOne(db.list, { foreignKey: 'ownerId' });
// db.list.belongsTo(db.user, { foreignKey: 'ownerId' });
// db.list.hasOne(db.user, { foreignKey: 'ownerId' });


// db.list.addHook('afterDestroy', async (listing, options) => {
//     if (listing.reviews) {
//       await Review.destroy({ where: { id: listing.reviews.map(review => review.id) } });
//     }
// });


// const initData = require("../init/data");
// initData.data = initData.data.map((obj) => ({
//     ...obj,
//     ownerId : 1,
//   }));

// (async () => {
//     await db.sequelize.sync({ force: false }); // Create the tables
//       await db.list.bulkCreate(initData.data);
//   })();


db.sequelize.sync({alter: true});
// db.sequelize.sync();
// db.list.sync({force: true});
module.exports = db;
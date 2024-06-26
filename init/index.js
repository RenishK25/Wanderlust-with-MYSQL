// const mongoose = require('mongoose');
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");
// // const dbUrl = process.env.MONGODB_URL;
// // console.log(dbUrl);
// main().then( () => console.log("DB Connection SuccessFull")).catch(err => console.log(dbUrl+"===="+err));

// async function main() {
//   await mongoose.connect("mongodb+srv://renish:LOMr6dyoOXfClwXf@wanderlust.r5alj6j.mongodb.net/?retryWrites=true&w=majority&appName=wanderlust");
// };

const db = require("../DB/connection");
const initData = require("./data.js");
// const List = db.list;

const initDB = async () => {
  // await Listing.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    ...obj,
    ownerId : 1,
  }));

  await db.list.bulkCreate(initData.data);
  console.log("List Data was initialized");
};
  
  initDB();

// const jane = await User.create({ name: 'Jane', email: 'jane@gmail.com', password: 'Jane' });
// const users = await User.insertMany({ name: 'Jane', email: 'jane@gmail.com', password: 'Jane' });

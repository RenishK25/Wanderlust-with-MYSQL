const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");
// const dbUrl = process.env.MONGODB_URL;
// console.log(dbUrl);
main().then( () => console.log("DB Connection SuccessFull")).catch(err => console.log(dbUrl+"===="+err));

async function main() {
  await mongoose.connect("mongodb+srv://renish:LOMr6dyoOXfClwXf@wanderlust.r5alj6j.mongodb.net/?retryWrites=true&w=majority&appName=wanderlust");
};

const initDB = async () => {
  await Listing.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner : "65f4c59f081fb1f6e1a02b55",
  }));

  await Listing.insertMany(initData.data);
  // console.log(initData.data);
  console.log("List Data was initialized");
};
  
  initDB();
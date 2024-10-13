const mongoose = require("mongoose")

async function Dbconnect() {
    try {
      //"mongodb+srv://afrirewards:Afri12345Rewards@afrirewards.da6lul0.mongodb.net/
     //mongodb+srv://afrirewards:Afri12345Rewards@afrirewards.da6lul0.mongodb.net/
     //"mongodb+srv://afrirewards:Afri12345Rewards@afrirewards.da6lul0.mongodb.net/""
      await mongoose.connect(process.env.DB_URL_LIVE, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Database connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
  }
  module.exports = {Dbconnect}
  // 670adbef01ca5e70f3de3a09
  // { id: '670bf1a8fa7a61854129ee93'
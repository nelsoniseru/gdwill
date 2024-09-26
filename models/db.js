const mongoose = require("mongoose")

async function Dbconnect() {
    try {
      //"mongodb+srv://afrirewards:Afri12345Rewards@afrirewards.da6lul0.mongodb.net/
     //mongodb+srv://afrirewards:Afri12345Rewards@afrirewards.da6lul0.mongodb.net/
     //"mongodb+srv://afrirewards:Afri12345Rewards@afrirewards.da6lul0.mongodb.net/""
      await mongoose.connect(process.env.DB_URL_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Database connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
  }
  module.exports = {Dbconnect}

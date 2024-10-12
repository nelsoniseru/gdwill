const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    full_name: String,
    balance: Number,
    email: String,
    phone: String,
    password:String
  },{
    timestamps:true
});
  
const User = mongoose.model('User', userSchema);
// User.find().then(e=>{
//     console.log(e)
// })
// User.updateMany({role:"BUYER_INVESTOR"},{$set:{is_kyc:false}}).then(e=>{
//     console.log(e)
// })

// async function a(){
//     const saltRounds = 10;
//     const hashedPassword = await new Promise((resolve, reject) => {
//       bcrypt.hash("Admin@2024", saltRounds, (err, hash) => {
//         if (err) reject(err);
//         resolve(hash);
//       });
//     });
//     User.create({
//         email:"admin@ireach.com",
//         password:hashedPassword,
//         verified:true,
//         role:"admin"
//     }).then(e=>{
//         console.log("yes created")
//     })
//     }
//     // a()
module.exports = User
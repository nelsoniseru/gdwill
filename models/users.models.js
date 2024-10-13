const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    full_name: String,
    balance:{
      type:Number,
      default:0
    } ,
    email: String,
    phone: String,
    password:String
  },{
    timestamps:true
});
  
const User = mongoose.model('User', userSchema);
User.find().then(e=>{
    console.log(e)
})
// User.deleteOne({_id:"670b8b96e13fdd3f9d1993e7"}).then(e=>{
//     console.log(e)
// })

User.find({}).then(e=>{
    console.log(e)
})
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
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    gender:{
        type: String,
        enum: ["male", "female"],  
      }, 
    dob:Date,
    pin:String,
    phone:String,
    proof_of_identity:{bank_name:String,bank_number:String,bvn:Number,nin:Number},
    password:String,
    v_code:String,
    img:String,

    referralCode:String,
    is_kyc: { 
      type: Boolean,
      enum: [true,false,],
      default:false,
      },
    verified: { 
        type: Boolean,
        enum: [true,false,],
        default:false,
        },
    role: { 
        type: String,
        enum: ["admin","realtor","buyer_investor"],
        },
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
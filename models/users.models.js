const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    gender:String,
    dob:Date,
    pin:String,
    phone:String,
    proof_of_identity:{nin:String,bvn:Number},
    pwd:String,
    ref_code:String,
    img:String,
    role: { 
        type: String,
        enum: ["ADMIN","REALTOR","BUYER_INVESTOR"],
        default:"BUYER_INVESTOR",
        },
  },{
    timestamps:true
});
  
const User = mongoose.model('User', userSchema);

module.exports = User
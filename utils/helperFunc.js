const bcrypt = require('bcryptjs');
const UserModel = require("../models/users.models")

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
    return hashedPassword;
  };




  const generateNumericOTP = (length) => {
    let otp = '';
    const digits = '0123456789';
    for (let i = 0; i < length; i += 1) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      otp += digits[randomIndex];
    }
    return otp;
  };

  const isAdmin = async(id) => {
    let user =  await UserModel.findOne({_id:id})
    let is_Admin  = user.role == "admin"? true : false
    return is_Admin ;
  };
  module.exports  =  {
    hashPassword,
    generateNumericOTP,
    isAdmin 
  }
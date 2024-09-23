const bcrypt = require('bcryptjs');

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
  module.exports  =  {
    hashPassword,
    generateNumericOTP
  }
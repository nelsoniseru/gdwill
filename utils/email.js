const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config({});


const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
      auth: {
        user: 'nelsoniseru08@gmail.com',
        pass: 'fsfwudxlsgrdypln'
    }
});


const SendMail = async (msg) => {
 const info  = await transporter.sendMail(msg);
 console.log("Message sent: %s", info.messageId);
  return info; 
};

module.exports =  { SendMail };
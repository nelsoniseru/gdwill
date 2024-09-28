const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const {SendMail} = require("../utils/email")

const sendEmailWithTemplate = (to,from,subject,templatePath, replacements) => {
    return new Promise((resolve, reject) => {
      // Read the HTML template file
      fs.readFile(templatePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }
  
        // Replace variables in the template
        let htmlContent = data;
        for (const key in replacements) {
          htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
        }
  
        // Send email using the updated HTML content
        const msg = {
            from: '"From IReach" <nelsoniseru08@gmail.com>',
            to: to,
            subject: subject,
            html:  htmlContent,
          };
      
          // Send verification email
          SendMail(msg).then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  };
  
  module.exports = {
    sendEmailWithTemplate,
  };
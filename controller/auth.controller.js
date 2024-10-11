const {hashPassword,generateNumericOTP} = require("../utils/helperFunc")
const UserModel = require("../models/users.models")
const bcrypt = require("bcryptjs")
const cloudinary = require("../utils/cloudinary")
const {SendMail} = require("../utils/email")
const {generateToken} = require("../middleware/auth.middleware")
const {verifyBvn,getBanks, resolveAccountNumber,getBankCodeByName} = require("../utils/axiosCall")

const {
    validateUserRegisterInput, 
    validateUserLoginInput,
    validateOtpInput,
    validateVEmailInput,
    validateResetPasswordInput,
    validatePinInput,
    validateBvnInput,
    validateAccountInput,
    validateNinInput
    } = require('../validator/validator')
    const path = require("path")
    const { sendEmailWithTemplate } = require('../utils/sendTemp');
    const templatePath = path.join(__dirname, '../utils/ireach.html');
    const templatePath2 = path.join(__dirname, '../utils/forgotpassword.html');
    const templatePath3 = path.join(__dirname, '../utils/resend.html');
    
  
  

class AuthController{
    async Register(req, res) {
        try {
          const { error } = validateUserRegisterInput.validate(req.body);
      
          // If validation fails, return an error response
          if (error) {
            return res.status(400).json({ status: false, data: { message: error.details[0].message } });
          }
      
          const { email, password, first_name,dob,gender,phone,role,last_name, img,referralCode } = req.body;
      
          // Check if the email already exists
          const emailExist = await UserModel.findOne({ email });
          if (emailExist) {
            return res.status(400).json({ status: false, data: { message: "email already exist" } });
          }
      
          // Hash the password
          const hash = await hashPassword(password);
          // Create a new user
          const newUser = await UserModel.create({
            email,
            first_name,
            last_name,
            dob,
            phone,
            gender,
            password: hash,
            img,  
            role,
            referralCode
          });
      
          // Generate OTP code
          let v_code = generateNumericOTP(6);
          const replacements = {
            last_name: last_name,
            v_code: v_code
          };
          
          // Prepare the email message
          sendEmailWithTemplate(email,'','Verification Code', templatePath, replacements)
          .then(async (response) => {
            newUser.v_code = v_code;
            await newUser.save();
            console.log('Email sent successfully:', response);

            return res.status(201).json({ status: true, data: { message: "6 digit verification code has been sent to your email successfully" } });
          })
          .catch(error => {
            console.error('Error sending email:', error);
          })           
      
        } catch (error) {
          console.error(error);
          return res.status(500).json({ status: false, data: { message: "Something went wrong" } });
        }
      
    }
    
    async Login(req, res) {
      try {
        const { error } = validateUserLoginInput.validate(req.body);
    
        // If validation fails, return an error response
        if (error) {
          return res.status(400).json({ status: false, data: { message: error.details[0].message } });
        }
    
        const { email, password, pin } = req.body;
    
        // Find the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
          return res.status(400).json({ status: false, data: { message: "User does not exist." } });
        }
        if(user.is_kyc == false) {
          return res.status(400).json({ status: false, data: { message: "Please complete your kyc." } });
        }
        // Check for password if provided
        const passwordMatch = password && await bcrypt.compare(password, user.password);
        
        // Check for PIN if provided
        const pinMatch = pin && await bcrypt.compare(pin, user.pin ); // Assuming you store the pin in a plain format or hashed. If hashed, use bcrypt.compare()
    
        // Check if either the password or the PIN is correct
        if (!passwordMatch && !pinMatch) {
          return res.status(400).json({ status: false, data: { message: "Invalid credentials." } });
        }
    
        // Uncomment and handle the verification logic if needed
        // if (user.verified == false) {
        //   let code = generateNumericOTP(6);
        //   const msg = {
        //     from: '"From IReach"',
        //     to: `${user.email}`,
        //     subject: 'Verification Code',
        //     html: `<h2>Dear User your verification code: ${code}</h2>`,
        //   };
        //   const mail = await SendMail(msg);
        //   if (mail.messageId) {
        //     user.code = code;
        //     await user.save();
        //     return res.status(400).json({ status: false, data: { message: "Your account is not verified. A 6-digit verification code has been resent to your email successfully." } });
        //   }
        // }
    
        return res.status(200).json({ status: true, data: { message: "User login successful", user: generateToken(user) } });
      } catch (error) {
        return res.status(500).json({ status: false, data: { message: error.message } });
      }
    }
    
    
    async PostResend(req,res){
      try {
      const {email} = req.body
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(404).json({status:false, data:{message:"user not found"}});
      let v_code = generateNumericOTP(6)
      const replacements = {
        last_name: user.last_name,
        v_code: v_code
      };
      sendEmailWithTemplate(email,'','Resend Verification Code', templatePath3, replacements)
      .then(async (response) => {
        user.v_code = v_code;
        await user.save();
        console.log('Email sent successfully:', response);

        return res.status(201).json({ status: true, data: { message: "6 digit verification code has been sent to your email successfully" } });
      })
      .catch(error => {
        console.error('Error sending email:', error);
      }) 
      } catch (error) {
        throw new Error(error);
      }
      
    }
    
    async PostVerifyCode(req,res){
      try {
        const { error } =  validateOtpInput.validate(req.body);
    
        // If validation fails, return an error response
        if (error) {
          return res.status(400).json({status:false,data:{message:error.message}});
        }
       
      const {email,v_code} = req.body
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(404).json({status:false, data:{message:"user not found"}});
      if (user.v_code !== v_code)return res.status(400).json({status:false, data:{message:"verification code is incorrect"}})
      user.v_code= '';
      user.verified=true;
      await user.save();
      return res.status(200).json({status:true, data:{message:"code verified successfully"}});
      } catch (error) {
        throw new Error(error);
      }
      
    }
    
    
    async postResetPassword(req,res) {
      try {
        const { error } = validateResetPasswordInput.validate(req.body);
    
        // If validation fails, return an error response
        if (error) {
          return res.status(400).json({status:false,data:{message:error.message}});
        }
          const {email,new_password, c_password} = req.body

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({status:false, data:{message:"user not found"}});
        if(new_password !== c_password) return res.status(400).json({status:false, data:{message:"password does not match"}})
        const hash = await hashPassword(new_password)
        user.password = hash
        await user.save();
        return res.status(200).json({status:true, data:{message:"password reset successfully"}});
      } catch (err) {
        throw new Error(err);
      }
    }
    
    
    
    async postEditProfile(req,res) {
      try {
        const { error } = validateEditProfileInput.validate(req.body);
    
        // If validation fails, return an error response
        if (error) {
          return res.status(400).json({status:false,data:{message:error.message}});
        }
          const {email,first_name,last_name,phone_number} = req.body
          const { user } = req;
             await UserModel.updateOne({_id:user.id},{$set:{email,first_name,last_name,phone_number}})
    
        return res.status(200).json({status:true, data:{message:"profile updated successfully"}});
      } catch (err) {
        throw new Error(err);
      }
    }
    
    
    async passwordEdit(req,res){
      const { error } = validateEditPasswordInput.validate(req.body);
    try {
      
    
      // If validation fails, return an error response
      if (error) {
        return res.status(400).json({status:false,data:{message:error.message}});
      }
        const { current_password,new_password,c_password } = req.body
        const { user } = req;
         let foundUser = await UserModel.findOne({_id:user.id})
        
          if (!(await bcrypt.compare(current_password, foundUser.password))) return res.status(400).json({status:false, data:{message:"Your current password does not match with your old password"}})
          if(new_password !== c_password) return res.status(400).json({status:false, data:{message:"password does not match"}})
          const hash = await hashPassword(new_password)
          await UserModel.updateOne({_id:user.id},{$set:{password:hash}})
    
      return res.status(200).json({status:true, data:{message:"password updated successfully"}});
    } catch (err) {
      throw new Error(err);
    }
    }
    
    
    async postVerifyMail(req,res) {
    
      try {
        const { error } = validateVEmailInput.validate(req.body);
        if (error) {
          return res.status(400).json({status:false,data:{message:error.message}});
        }
        const {email} = req.body

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({status:false, data:{message:"user not found"}});
        let v_code = generateNumericOTP(6)
    
        const replacements = {
          last_name: user.last_name,
          v_code: v_code
        };

        sendEmailWithTemplate(email,'','Forgot Password', templatePath2, replacements)
        .then(async (response) => {
          user.v_code = v_code;
          await user.save();
          console.log('Email sent successfully:', response);

          return res.status(201).json({ status: true, data: { message: "6 digit verification code has been sent to your email successfully" } });
        })
        .catch(error => {
          console.error('Error sending email:', error);
        }) 
      } catch (err) {
        throw new Error(err);
      }
    
     
    }

    async postSaveUserDetails(req,res) {
      try {
        
        const { error } = validateBvnInput.validate(req.body);
        if (error) {
          return res.status(400).json({status:false,data:{message:error.message}});
        }
        const {bvn,accountNumber,bankName,nin } = req.body;

        if (!bvn) {
            return res.status(400).json({ message: 'BVN is required' });
        }
        try {
            let foundUser = await UserModel.findOne({_id:req.user.id})
            if(!foundUser) return res.status(400).json({ status: false, data: { message: "user not found"} });    
            foundUser.proof_of_identity.bvn = bvn
            foundUser.proof_of_identity.nin = nin
            foundUser.proof_of_identity.bank_name = bankName
            foundUser.proof_of_identity.bank_number = accountNumber
      await foundUser.save()
              return res.status(200).json({ status:true, data:{message:"user details saved successfully"}});
        } catch (error) {
            return res.status(500).json({ status: false, data:{message: error.message} });
        }
      } catch (err) {
        console.log(error)
        throw new Error(err);
      }
    
     
    }
    async getAllBanks(req,res) {
      try {
          const result = await getBanks();
          return res.status(200).json({ status:true, data:{result}});
     
    } catch (err) {
      throw new Error(err);
    }
  
   
  }


  async resolveAccount(req,res){
    const { error } = validateAccountInput.validate(req.body);
    if (error) {
      return res.status(400).json({status:false,data:{message:error.message}});
    }
    const { bankName, accountNumber } = req.body;

    if (!bankName || !accountNumber) {
        return res.status(400).json({ error: 'Bank name and account number are required.' });
    }

    try {
        // Get the bank code using the bank name
        const bankCode = await getBankCodeByName(bankName);

        if (!bankCode) {
            return res.status(404).json({ status: false, data: { message: "bank not found"}});
        }

        // Resolve account number using Paystack's API
        const accountDetails = await resolveAccountNumber(accountNumber, bankCode);
        
        return res.json({
            success: true,
            message: 'Account details retrieved successfully.',
            data: accountDetails,
        });
    } catch (error) {
        return res.status(400).json({status:true, data:{message:error.message }})

    }
  }



  async savePin(req,res){
    const { error } = validatePinInput.validate(req.body);
    console.log(req.body.email)
    if (error) {
      return res.status(400).json({status:false,data:{message:error.details[0].message}});
    }
    let foundUser = await UserModel.findOne({_id:req.user.id})
    if(!foundUser) return res.status(400).json({ status: false, data: { message: "user not found"} });
    const hash = await hashPassword(req.body.pin);
   foundUser.pin = hash
   await foundUser.save()
   return res.status(200).json({status:true, data:{message:"pin created successfully"}})
  }
}

 module.exports = new AuthController()
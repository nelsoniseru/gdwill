const {generateToken,hashPassword,generateNumericOTP} = require("../utils/helperFunc")
const UserModel = require("../models/users.models")
const cloudinary = require("../utils/cloudinary")
const {SendMail} = require("../utils/email")
const {
    validateUserRegisterInput,   
    } = require('../validator/validator')

class AuthController{
    async Register(req, res) {
        try {
            console.log(req.body)
          const { error } = validateUserRegisterInput.validate(req.body);
      
          // If validation fails, return an error response
          if (error) {
            return res.status(400).json({ status: false, data: { message: error.details[0].message } });
          }
      
          const { email, password, first_name,dob,gender,phone, last_name, img } = req.body;
      
          // Check if the email already exists
          const emailExist = await UserModel.findOne({ email });
          if (emailExist) {
            return res.status(400).json({ status: false, data: { message: "email already exist" } });
          }
      
          // Hash the password
          const hash = await hashPassword(password);
      
          // If an image is provided, upload it to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
              folder: "users", 
            });
  
          
      
          // Create a new user
          const newUser = await UserModel.create({
            email,
            first_name,
            last_name,
            dob,
            phone,
            gender,
            password: hash,
            img:result.secure_url,  
          });
      
          // Generate OTP code
          let code = generateNumericOTP(6);
      
          // Prepare the email message
          const msg = {
            from: '"From IReach"',
            to: email,
            subject: 'Verification Code',
            html: `<h2>Dear User, your verification code: ${code} </h2>`,
          };
      
          // Send verification email
          const mail = await SendMail(msg);
          if (mail.messageId) {
            newUser.code = code;
            await newUser.save();
      
            return res.status(201).json({ status: true, data: { message: "6 digit verification code has been sent to your email successfully" } });
          }
      
        } catch (error) {
          console.error(error);
          return res.status(500).json({ status: false, data: { message: "Something went wrong" } });
        }
      
    }
    
    async Login(req,res){
      try {
        const { error } = validateUserLoginInput.validate(req.body);
    
        // If validation fails, return an error response
        if (error) {
          return res.status(400).json({status:false,data:{message:error.details[0].message}});
        }
        const {email, password} = req.body
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(STATUS_CODE_NOT_FOUND).json({status:false,data:{message:UserEmailNotFoundMessage}});
        if (!(await bcrypt.compare(password, user.password))) return res.status(STATUS_CODE_NOT_FOUND).json({status:false, data:{message:UserEmailNotFoundMessage}});
        if(user.verified==false){
          let code = generateNumericOTP(6)
          const msg = {
            from: '"From IReach"',
            to: `${user.email}`, 
            subject: 'Verification Code',
            html: `<h2>Dear User your verification code:${code}</h2>`,
          }
          const mail = await SendMail(msg);
          if (mail.messageId){
            user.code = code
             await user.save()
             return res.status(400).json({status:false, data:{message:"your account is not verified 6 digit verification code has been resent to your email successfully"}});
          }
        }
    
       return res.status(200).json({status:true,data:{message:"user login successfull",user:generateToken(user)}})
      } catch (error) {
        throw new Error(error);
      }  
    }
    
    async PostResend(req,res){
      try {
      const {email} = req.body
      const user = await UserModel.findOne({ email });
      let code = generateNumericOTP(6)
      const msg = {
        from: '"From IReach"',
        to: `${user.email}`, 
        subject: 'Verification Code',
        html: `<h2>Dear User your verification code:${code}</h2>`,
      }
      const mail = await SendMail(msg);
      if (mail.messageId){
        user.code = code
         await user.save()
         return res.status(200).json({status:true, data:{message:"6 digit verification code has been resent to your email successfully"}});
      }
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
       
      const {email,code} = req.body
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(404).json({status:false, data:{message:"user not found"}});
      if (user.code !== code)return res.status(400).json({status:false, data:{message:"verification code is incorrect"}})
      user.code= '';
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
          const {email,password} = req.body
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({status:false, data:{message:"user not found"}});
        const hash = await hashPassword(password)
        user.password =String(hash)
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
        const {email} = req.body
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({status:false, data:{message:"user not found"}});
        let code = generateNumericOTP(6)
        const msg = {
            from: '"From IReach"',
          to: `${email}`, 
          subject: 'Forgot Password',
          html: `<h2>Dear User your otp:${code} </h2>`,
        }
        
        // Send the email
        const mail = await SendMail(msg);
        if (mail.messageId) {
           user.code = code
           await user.save()
           return res.status(200).json({status:true, data:{message:"An otp has been sent to your email successfully"}});
        }
      } catch (err) {
        throw new Error(err);
      }
    
     
    }
}
 module.exports = new AuthController()
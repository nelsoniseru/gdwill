const {hashPassword} = require("../utils/helperFunc")
const UserModel = require("../models/users.models")
const Transaction = require("../models/transaction.models")
const bcrypt = require("bcryptjs")
const {generateToken} = require("../middleware/auth.middleware")


const {
    validateUserRegisterInput, 
    validateUserLoginInput,

    } = require('../validator/validator')

  
  

class AuthController{
    async Register(req, res) {
        try {
          const { error } = validateUserRegisterInput.validate(req.body);
      
          // If validation fails, return an error response
          if (error) {
            return res.status(400).json({ status: false, data: { message: error.details[0].message } });
          }
      
          const { email, password,phone,   full_name } = req.body;
      
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
            full_name,
            phone,
            password: hash,
     
          });
          return res.status(201).json({ status: true, data: { message: "registration was successfully"}});
        } catch (error) {
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
    
        const { email, password} = req.body;
    
        // Find the user by email
        const user = await UserModel.findOne({ email }).select('-password');
        if (!user) {
          return res.status(400).json({ status: false, data: { message: "User does not exist." } });
        }
       
        // Check for password if provided
        const passwordMatch = await bcrypt.compare(password, user.password);
        
            if (!passwordMatch) {
          return res.status(400).json({ status: false, data: { message: "Invalid credentials." } });
        }
        return res.status(200).json({ status: true, data: { message: "User login successful", token: generateToken(user),user } });
      } catch (error) {
        return res.status(500).json({ status: false, data: { message: error.message } });
      }
    }
  
    async getUsers(req, res) {
      const user = await UserModel.find({});
      return res.status(200).json({ status: true, data: { user } });
    }
  async  getBalance(req, res) {
    const total_withdrawal = await Transaction.find({user:req.user.id,transaction_type:"withdrawal"});
    const user = await UserModel.find({_id:req.user.id});
      return res.status(200).json({ status: true, data: { user,total_withdrawal:total_withdrawal.length } });
  }
}

 module.exports = new AuthController()
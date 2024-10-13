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
      
          const { email, password,phone,full_name } = req.body;
      
          // Check if the email already exists
          const emailExist = await UserModel.findOne({ email });
          const phoneExist = await UserModel.findOne({ phone:phone.slice(1) });
          if (emailExist) {
            return res.status(400).json({ status: false, data: { message: "email already exist" } });
          }
          if (phoneExist) {
            return res.status(400).json({ status: false, data: { message: "account already exist" } });
          }
          const formattedPhone = phone.slice(1); 

          // Hash the password
          const hash = await hashPassword(password);
          // Create a new user
          const newUser = await UserModel.create({
            email,
            full_name,
            phone:formattedPhone,
            password: hash,
     
          });
          return res.status(201).json({ status: true, data: { message: "registration was successfully", token: generateToken(newUser),newUser}});
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
        const user = await UserModel.findOne({ email });
        if (!user) {
          return res.status(400).json({ status: false, data: { message: "User does not exist." } });
        }
       
        // Check for password if provided
        const passwordMatch = await bcrypt.compare(password, user.password);
        
            if (!passwordMatch) {
          return res.status(400).json({ status: false, data: { message: "Invalid credentials." } });
        }
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        return res.status(200).json({ status: true, data: { message: "User login successful", token: generateToken(user),user:userWithoutPassword } });
      } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, data: { message: error.message } });
      }
    }
  
    async getUsers(req, res) {
      try {
        const { phone } = req.params; // Capture phone from route params
        let users;
    
        if (phone) {
          // Use RegExp to match phone numbers starting with the provided input
          const phoneRegex = new RegExp(`^${phone}`, 'i'); // 'i' for case-insensitive, '^' ensures it starts with the input
          users = await UserModel.find({
            phone: { $regex: phoneRegex },
            _id: { $ne: req.user.id } // Exclude the current logged-in user
          });
          
          if (users.length === 0) {
            // If no users found with the provided phone number
            return res.status(404).json({ status: false, data: { message: "No users found with the provided phone number" } });
          }
        } else {
          // Return all users except the logged-in user if no phone is provided in params
          users = await UserModel.find({
            _id: { $ne: req.user.id } // Exclude the current logged-in user
          });
        }
    
        // Return the list of users
        return res.status(200).json({ status: true, data: { users } });
        
      } catch (error) {
        // Handle any server-side errors
        return res.status(500).json({ status: false, data: { message: "Something went wrong" } });
      }
    }
    
    
      
    
  async getBalance(req, res){
    const user = await UserModel.findOne({_id:req.user.id});
    return res.status(200).json({ status: true, data:{ user }})
  }

}

 module.exports = new AuthController()
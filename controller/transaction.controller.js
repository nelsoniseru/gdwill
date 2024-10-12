const User = require("../models/users.models")
const Transaction = require("../models/transaction.models")
const bcrypt = require("bcryptjs")


const {
  validateDepositInput,
  validateTransactionInput
    } = require('../validator/validator')
    
  
  

class TransactionController{
    
  async deposit(req, res) {
    try {
      const { error } = validateDepositInput.validate(req.body);
    
      // If validation fails, return an error response
      if (error) {
        return res.status(400).json({ status: false, data: { message: error.details[0].message } });
      }
  

      const { amount } = req.body;
      const userId = req.user.id; 


      const user = await User.findOne({_id:userId});
      if (!user) {
        return res.status(404).json({ status: false, data:{message: "User not found"}});
      }

      // Create a transaction document for the deposit
      const transaction = new Transaction({
        transaction_type: 'deposit',
        account_number:user.account_number,
        account_name:user.account_name,
        amount,
        user: user._id
      });

      // Update user's balance
      user.balance += amount;
      await user.save();
 
      return res.status(200).json({ status: true,data:{message: "Deposit successful", balance: user.balance }});

    } catch (error) {
      return res.status(500).json({ status: false, data:{message: error.message}});
    }
  }
  async history(req, res) {
   let t = await Transaction.find({user:req.user.id});
   return res.status(200).json({ status: true,data:{ history:t }});

  }
  async transaction(req, res) {
 const id = req.query.id
 const { error } = validateTransactionInput.validate(req.body);
    
 // If validation fails, return an error response
 if (error) {
   return res.status(400).json({ status: false, data: { message: error.details[0].message } });
 }
 const {amount,reason,note,password,transaction_type} = req.body
 const user = await User.findOne({_id:id});
 const t_user = await User.findOne({_id:req.user.id});
 const passwordMatch = await bcrypt.compare(password, t_user.password);
 if (!user) {
  return res.status(404).json({ status: false, data:{message: "User not found" }});
}
 if (!passwordMatch) {
return res.status(400).json({ status: false, data: { message: "Invalid password" } });
}
if(t_user < amount){
  return res.status(400).json({ status: false, data: { message: "Insufficient fund" } });
}
 const transaction = new Transaction({
  transaction_type,
  account_number:user.account_number,
  account_name:user.account_name,
  reason,
  note,
  amount,
  user: user._id
});

// Update user's balance
t_user.balance -= amount;
user.balance += amount;
await user.save();
await t_user.save();


}

}
 module.exports = new TransactionController()
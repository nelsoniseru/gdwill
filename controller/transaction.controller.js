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
      await transaction.save()
      return res.status(200).json({ status: true,data:{message: "Deposit successful", balance: user.balance }});

    } catch (error) {
      return res.status(500).json({ status: false, data:{message: error.message}});
    }
  }
  async history(req, res) {
    try {
      const { transaction_type } = req.query; // Capture the transaction_type from query params
      let filter = { user: req.user.id }; // Base filter with user ID
  
      // If transaction_type is provided, add a regex filter for transaction_type
      if (transaction_type) {
        const typeRegex = new RegExp(transaction_type, 'i'); // 'i' makes it case-insensitive
        filter.transaction_type = { $regex: typeRegex };
      }
  
      // Find transactions based on the filter and sort by creation date (latest first)
      let transactions = await Transaction.find(filter).sort({ createdAt: -1 });
  
      return res.status(200).json({ status: true, data: { history: transactions } });
    } catch (error) {
      return res.status(500).json({ status: false, data: { message: "Something went wrong" } });
    }
  }
  

  async transaction(req, res) {
 const id = req.params.id
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
if(t_user.balance < amount){
  return res.status(400).json({ status: false, data: { message: "Insufficient fund" } });
}
 const transaction = await Transaction.create({
  transaction_type,
  account_number:user.account_number,
  account_name:user.account_name,
  reason,
  note,
  amount,
  user: t_user._id
});

// Update user's balance
t_user.balance -= amount;
user.balance += amount;
await user.save();
await t_user.save();
return res.status(400).json({ status:true, data: { message: "transaction successful" } });

}

}
 module.exports = new TransactionController()
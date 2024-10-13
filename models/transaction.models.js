const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transaction_type:{
        type: String,
        enum: ["deposit", "credit", "debit"],  
      },   
    account_number:Number, 
    account_name:String, 
    amount:Number,
    reason:String,
    note:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
      },
  
  },{
    timestamps:true
});
const Transaction = mongoose.model('Transaction', transactionSchema);


module.exports = Transaction
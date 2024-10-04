const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    property_name: String,
    location: String,
    description: String,
    property_type:{
        type: String,
        enum: ["investment", "property"],  
      }, 

    images: [
        {
          img: {
            type: String,
            required: true 
          }
        }
      ],
      investment:{
        investment_amount: {
          type: Number,

        },
        investment_amount_return:{
            type: Number,
         
        },
        property_size:{
            type: Number,
         
        },
        roi_percentage:{
            type: Number,
         
        },
        
        duration:{
            type: Number,
        },
      },
      property:{
        property_features: [
            {
              property_features: {
                type: String,
              }
            }
          ],
        property_module:{price_per_plot:Number,initial_price:Number,property_size:Number},
    
        purchase:{
            purchase_type:{
                type: String,
                enum: ["installment", "one_time"],  
              }, 
            duration:{
                type: Number,
            },
        }
      },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
      },
      status:{
        type: String,
        enum: ["sold_out", "available"],  
      },
      state:{
        type: String,
        enum: ["draft", "publish"],  
        default:"publish"
      },
  },{
    timestamps:true
});
const Property = mongoose.model('Property', propertySchema);

module.exports = Property
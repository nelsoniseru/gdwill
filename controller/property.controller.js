const {hashPassword,generateNumericOTP} = require("../utils/helperFunc")
const Property = require("../models/property.models")
const cloudinary = require("../utils/cloudinary")

const {
    validateUserRegisterInput, 
    validateUserLoginInput,
    validateOtpInput,
    validateVEmailInput,
    validateResetPasswordInput,
    propertyValidationSchema
    } = require('../validator/validator')
    const path = require("path")
    const { sendEmailWithTemplate } = require('../utils/sendTemp');
    const templatePath = path.join(__dirname, '../utils/ireach.html');
    
  
  

class PropertyController{
    
async addProperty(req, res) {
try {
    // Validate incoming data
    const { error } = propertyValidationSchema.validate(req.body);      
          // If validation fails, return an error response
          if (error) {
            return res.status(400).json({ status: false, data: { message: error.details[0].message } });
          }  
    const property = {
        ...req.body,
        user:req.user.id,
        state:"publish",
        investment: req.body.investment
    };
    let newProp = await Property.create(property)
    // Respond with success
    return res.status(201).json({
        data:newProp,
        message: 'Property created successfully',
    });
} catch (error) {
    return res.status(400).json({ error: error.message });
}
}

async getProperties(req, res) {
    try {
      const type = req.query.type
      const properties = await Property.find({property_type:type});
      return res.status(200).json({success:true,data:{ properties}});
    } catch (error) {
      return res.status(400).json({ success:false, data:{message: error.message}});
    }
  }

  // Get Property by ID
  async getPropertyById(req, res) {
    try {
      const property = await Property.findById(req.params.id);
      if (!property) {
        return res.status(404).json({ success:false, data:{message: 'Property not found'}});
      }
      return res.status(200).json({success:true,data:{property}});
    } catch (error) {
      return res.status(400).json({ success:false, data:{message: error.message}});
    }
  }

  // Update Property by ID
  async updateProperty(req, res) {
    try {
      const { error } = propertyValidationSchema.validate(req.body);      
      // If validation fails, return an error response
      if (error) {
        return res.status(400).json({ status: false, data: { message: error.details[0].message } });
      }  

      // Update the property data
      const updatedProperty = await Property.updateOne(
        {_id:req.params.id},
        { ...req.body},
        { new: true }
      );

      if (!updatedProperty) {
        return res.status(404).json({ success:false, data:{message: 'Property not found'}});
      }

      return res.status(200).json({
        success:true,
        data:{
        message: 'Property updated successfully',
        property: updatedProperty,
        }
      });
    } catch (error) {
      return res.status(400).json({ success:false, data:{message: error.message}});

    }
  }

  // Delete Property by ID
  async deleteProperty(req, res) {
    try {
      const deletedProperty = await Property.deleteOne({_id:req.params.id});
      if (!deletedProperty) {
        return res.status(404).json({ success:false, data:{message: 'Property not found'}});
      }

      return res.status(200).json({
        success:true,
        data:{
        message: 'Property deleted successfully',
        }
      });
    } catch (error) {
      return res.status(400).json({ success:false, data:{message: error.message}});
    }
  }
}
 module.exports = new PropertyController()
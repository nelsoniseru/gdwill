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
    console.log(req.user)
    const { error } = propertyValidationSchema.validate(req.body);      
          // If validation fails, return an error response
          if (error) {
            return res.status(400).json({ status: false, data: { message: error.details[0].message } });
          }
    // Handle image uploads to Cloudinary
    const imageUploadPromises = req.files.map(file => {
        return cloudinary.uploader.upload(file.path);
    });

    // Wait for all images to be uploaded
    const imageUploadResults = await Promise.all(imageUploadPromises);
    const imageUrls = imageUploadResults.map(result => ({ img: result.secure_url }));
    // Save `validatedData` and `imageUrls` to your database (mock saving here)
    // You should replace this with actual database logic
    const property = {
        ...validatedData,
        images: imageUrls,
        user:req.user.id,
        state:"publish",
        investment: JSON.parse(req.body.investment)
    };
    let n = await Property.create(property)
    console.log(n)
    // Respond with success
    return res.status(201).json({
        message: 'Property created successfully',
        property,
    });
} catch (error) {
    return res.status(400).json({ error: error.message });
}
}

async getProperties(req, res) {
    try {
      const properties = await PropertyModel.find();
      return res.status(200).json(properties);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get Property by ID
  async getPropertyById(req, res) {
    try {
      const property = await PropertyModel.findById(req.params.id);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      return res.status(200).json(property);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Update Property by ID
  async updateProperty(req, res) {
    try {
      const validatedData = validateProperty(req.body);

      // If new images are uploaded, handle image uploads to Cloudinary
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        const imageUploadPromises = req.files.map(file => {
          return cloudinary.uploader.upload(file.path);
        });
        const imageUploadResults = await Promise.all(imageUploadPromises);
        imageUrls = imageUploadResults.map(result => result.secure_url);
      }

      // Update the property data
      const updatedProperty = await PropertyModel.updateOne(
        req.params.id,
        { ...validatedData, ...(imageUrls.length > 0 && { images: imageUrls }) },
        { new: true }
      );

      if (!updatedProperty) {
        return res.status(404).json({ error: 'Property not found' });
      }

      return res.status(200).json({
        message: 'Property updated successfully',
        property: updatedProperty,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Delete Property by ID
  async deleteProperty(req, res) {
    try {
      const deletedProperty = await PropertyModel.findByIdAndDelete(req.params.id);
      if (!deletedProperty) {
        return res.status(404).json({ error: 'Property not found' });
      }

      return res.status(200).json({
        message: 'Property deleted successfully',
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
 module.exports = new PropertyController()
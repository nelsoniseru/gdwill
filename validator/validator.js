const  Joi = require('joi');
const validateUserLoginInput = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  const validateVEmailInput = Joi.object({
    email: Joi.string().email().required(),
  })

const validateUserRegisterInput = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    img: Joi.string().allow(),
    dob: Joi.date().required(),
    gender: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string()
      .min(8).required().messages({
        'string.min': 'password must be at least 8 characters long',
        'any.required': 'password is required'
      })
      .pattern(new RegExp('[a-z]')).messages({
        'string.pattern.base': 'password must contain at least one lowercase letter'
      })
      .pattern(new RegExp('[A-Z]')).messages({
        'string.pattern.base': 'password must contain at least one uppercase letter'
      })
      .pattern(new RegExp('[0-9]')).messages({
        'string.pattern.base': 'password must contain at least one number'
      })
      .pattern(new RegExp('[!@#$%^&*(),.?":{}|<>]')).messages({
        'string.pattern.base': 'password must contain at least one special character'
      })
    });
const validateResetPasswordInput = Joi.object({
    email: Joi.any().strip(),
     c_password:Joi.string().required(),
     new_password: Joi.string()
      .min(8).required().messages({
        'string.min': 'password must be at least 8 characters long',
        'any.required': 'password is required'
      })
      .pattern(new RegExp('[a-z]')).messages({
        'string.pattern.base': 'password must contain at least one lowercase letter'
      })
      .pattern(new RegExp('[A-Z]')).messages({
        'string.pattern.base': 'password must contain at least one uppercase letter'
      })
      .pattern(new RegExp('[0-9]')).messages({
        'string.pattern.base': 'password must contain at least one number'
      })
      .pattern(new RegExp('[!@#$%^&*(),.?":{}|<>]')).messages({
        'string.pattern.base': 'password must contain at least one special character'
      })
    })

    const propertyValidationSchema = Joi.object({
      property_name: Joi.string().required(),      // Strictly required
      location: Joi.string().required(),           // Strictly required
      description: Joi.string().required(),        // Strictly required
      property_type: Joi.string().valid('investment', 'property').required(),  // Strict enum values
      // Allowing the rest of the fields without strict validation
      images: Joi.array().items(Joi.object({
        img: Joi.string().min(1).required()  // `img` must be a non-empty string
    })).min(1).required(),  // Allows the entire `images` field to be optional or null
      investment: Joi.object({
          investment_amount: Joi.number().allow(null),   // Optional fields, allow null or numbers
          investment_amount_return: Joi.number().allow(null),
          property_size: Joi.number().allow(null),
          roi_percentage: Joi.number().allow(null),
          duration: Joi.number().allow(null),
      }).allow(null),   // Allow the entire `investment` field to be optional or null
      property: Joi.object({
          property_features: Joi.array().items(Joi.object({
              property_features: Joi.string().allow(null, '')   // Optional string
          })).allow(null),   // Optional array of features
          price: Joi.object({
              price_per_plot: Joi.number().allow(null),
              initial_price: Joi.number().allow(null)
          }).allow(null),
          property_size: Joi.number().allow(null),
          purchase: Joi.object({
              purchase_type: Joi.string().valid('installment', 'one_time').allow(null),
              duration: Joi.number().allow(null)
          }).allow(null)
      }).allow(null),
      user: Joi.string().allow(null),    // Allow null or an ObjectId-like string for user reference
      status: Joi.string().valid('sold_out', 'available').required(null),
      state: Joi.string().valid('draft', 'publish').default('publish').allow(null)  // Default value
  });

    const validateOtpInput =Joi.object({
      email: Joi.any().strip(),
      v_code: Joi.string()
        .required()
        .min(6)
        .max(6)
      })
    
 

   module.exports =  {
  validateUserLoginInput,
  validateUserRegisterInput,
  validateOtpInput,
  validateVEmailInput,
  validateResetPasswordInput,
  propertyValidationSchema
};

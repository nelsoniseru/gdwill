const  Joi = require('joi');
const validateUserLoginInput = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().optional(),  // Optional to allow PIN only
  pin: Joi.string()
    .pattern(/^[0-9]{4}$/) // Ensure the PIN is exactly 6 digits
    .optional() // Optional to allow password only
}).custom((value, helpers) => {
  // Custom validation to enforce only one of password or pin is provided
  const { password, pin } = value;

  if (!password && !pin) {
    return helpers.error('any.required'); // No password or PIN provided
  }

  if (password && pin) {
    return helpers.error('object.unknown'); // Both password and PIN provided
  }

  return value; // Return the value if validation is successful
}).messages({
  'any.required': 'Either password or PIN is required.',
  'object.unknown': 'Only one of password or PIN should be provided.',
  'string.pattern.base': 'PIN must be exactly 4 digits and contain only numbers.'
});

  const validateVEmailInput = Joi.object({
    email: Joi.string().email().required(),
  })

const validateUserRegisterInput = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    role:Joi.string().required(),
    email: Joi.string().email().required(),
    img: Joi.string().allow(),
    referralCode: Joi.string().allow(),
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
          property_module: Joi.object({
              price_per_plot: Joi.number().allow(null),
              initial_price: Joi.number().allow(null),
              property_size: Joi.number().allow(null)
          }).allow(null),
    
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


    const validatePinInput = Joi.object({
      email: Joi.any().strip(),
      pin: Joi.string()
      .pattern(/^[0-9]{4}$/) 
      .required()
      .messages({
        'string.pattern.base': 'Pin must be exactly 4 digits and contain only numbers.',
        'string.empty': 'Pin is required.',
        'any.required': 'Pin is required.',
      })
      })

      const validateBvnInput = Joi.object({
        bankName: Joi.string().required(), 
        accountNumber: Joi.string()
        .pattern(/^[0-9]{10}$/) 
        .required()
        .messages({
          'string.pattern.base': 'Bank number must be exactly 10 digits and contain only numbers.',
          'string.empty': 'Bank number required.',
          'any.required': 'Bank number is required.',
        }),
        bvn: Joi.string()
        .pattern(/^[0-9]{11}$/) 
        .required()
        .messages({
          'string.pattern.base': 'BVN must be exactly 11 digits and contain only numbers.',
          'string.empty': 'Bvn is required.',
          'any.required': 'Bvn is required.',
        }),
        nin: Joi.string()
        .pattern(/^[0-9]{11}$/) 
        .required()
        .messages({
          'string.pattern.base': 'Nin must be exactly 11 digits and contain only numbers.',
          'string.empty': 'Nin is required.',
          'any.required': 'Nin is required.',
        })
        })
      
       
        const  validateAccountInput = Joi.object({
         bankName: Joi.string().required(),  
         accountNumber: Joi.string()
          .pattern(/^[0-9]{10}$/) 
          .required()
          .messages({
            'string.pattern.base': 'Bank number must be exactly 10 digits and contain only numbers.',
            'string.empty': 'Bank number is required.',
            'any.required': 'Bank number is required.',
          })
          })
          const validateNinInput= Joi.object({
            email: Joi.any().strip(),
            nin: Joi.string()
             .pattern(/^[0-9]{11}$/) 
             .required()
             .messages({
               'string.pattern.base': 'Nin must be exactly 11 digits and contain only numbers.',
               'string.empty': 'Pin is required.',
               'any.required': 'Pin is required.',
             })
             })

   module.exports =  {
  validateUserLoginInput,
  validateUserRegisterInput,
  validateOtpInput,
  validateVEmailInput,
  validateResetPasswordInput,
  propertyValidationSchema,
  validatePinInput,
  validateBvnInput,
  validateAccountInput,
  validateNinInput
};

const  Joi = require('joi');
const validateUserLoginInput = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),  

})



const validateUserRegisterInput = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
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

    const  validateDepositInput= Joi.object({
      amount: Joi.number().required(),  
     })
      
   const validateTransactionInput= Joi.object({
              amount: Joi.number().required(),  
              reason: Joi.string().allow(),
              note: Joi.string().allow(),
              password: Joi.string().required(),
             })
   module.exports =  {
  validateUserLoginInput,
  validateUserRegisterInput,
  validateDepositInput,
  validateTransactionInput

};

var Joi = require('joi');
// schema validator.
module.exports = {
  schemas: {
    goalSchema: Joi.object().keys({
     
      name: Joi.string().lowercase().required().min(3),
    amount:Joi.number().min(1).required(),
       
    due: Joi.date().required().min('now')
    }),
    
    transactionSchema: Joi.object().keys({
     
      name: Joi.string().lowercase().required().min(3),
    amount:Joi.number().min(1).required(),
    frequency: Joi.string().lowercase().valid(["daily","weekly", "fortnightly", "monthly", "yearly"]).required(),
    isIncome : Joi.boolean().required()
    }),
    loginSchema: Joi.object().keys({
     
      name: Joi.string().lowercase().min(3),
    birthdate: Joi.date().required().max('now'),
    gender: Joi.string().lowercase().valid(["male", "female", "other"])
    })
  }
}
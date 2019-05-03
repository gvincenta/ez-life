var Joi = require('joi');
// schema validator.
module.exports = {
  schemas: {
    goalSchema: Joi.object().keys({
     
      name: Joi.string().lowercase().required().min(3),
    amount:Joi.number().min(1).required(),
       
    due: Joi.date().required().min('now'),
    preference: Joi.number().min(1).max(5).required()
    }),
    
    transactionCreateSchema: Joi.object().keys({
      name: Joi.string().lowercase().min(3).required(),

    realAmount:Joi.number().min(1).required(),
    date: Joi.date().required().max('now')
    }),
    loginSchema: Joi.object().keys({
     
      name: Joi.string().lowercase().min(3),
    birthdate: Joi.date().required().max('now'),
    gender: Joi.string().lowercase().valid(["male", "female", "other"])
    }),

    budgetSchema : Joi.object().keys({
      name: Joi.string().lowercase().required().min(3),
      preference: Joi.number().min(1).max(10).required(),
      isIncome : Joi.string().lowercase().valid(["income", "needs", "wants"]).required()

    }),
    budgetUpdateSchema : Joi.object().keys({
      name: Joi.string().lowercase().required().min(3),
      preference: Joi.number().min(1).max(10).required(),
      budgetedAmount : Joi.number().min(1).required()
    }),
    transactionUpdateSchema: Joi.object().keys({
    realAmount:Joi.number().min(1).required(),
    date: Joi.date().required().max('now')

    })

  }
}
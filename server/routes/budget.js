var router = require("express-promise-router")();
var passport = require("passport");

var budgetController = require('../controllers/budget.js');

/** Creates a new budget for the user for an account that exist for less than 3 months. */ 
router.post('/', passport.authenticate("jwt", {session : false}) , budgetController.createBudget);

/** Creates a suggestion for budgetedAmount of all the budgets . 
  *to be ideally asked for each month after creating reports. */ 
router.get('/suggested', passport.authenticate("jwt", {session : false}) , budgetController.suggestBudget);

/** Checks on 1 budget or all budgets related to 1 user. */  
router.get('/', passport.authenticate("jwt", {session : false}) ,budgetController.getBudget);

/** Updates user's  budget (name/isIncome/preference/budgetedAmount). */  
router.put('/',  passport.authenticate("jwt", {session : false}) , budgetController.updateBudget);

/** Deletes 1 of user's  budgets based on the name.*/  
router.delete('/', passport.authenticate("jwt", {session : false}) ,budgetController.deleteBudget);

module.exports = router
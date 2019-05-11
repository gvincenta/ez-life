var mongoose = require("mongoose");
var Budget = mongoose.model("budget");
var { schemas } = require("../validators/validator");
var Joi = require("joi");
/** Creates a new budget for the user for an account that exist for less than 3 months.
 * @param req.body : all the details of 1 budget inserted as json object. */

var createBudget = function(req, res) {
  if (req.body.isIncome !== "wants"){
      req.body.preference = 1; 
  }
  Joi.validate(req.body, schemas.budgetSchema)
    .then(
      // if validated,
      item => {
        if (item.isIncome !== "wants") {
          {
            item.preference = 1;
          }
        }
        var model = new Budget({
          user: req.user._id,
          name: item.name,

          isIncome: item.isIncome,

          preference: item.preference,
          ignored: false
        });
        model.save();
        res.status(200).json(model);
      }
    )
    .catch(err => {
      res.json(err);
    });
};

/** Creates a suggestion for budgetedAmount of all the budgets .
 *to be ideally asked for each month after creating reports. */

var suggestBudget = function(req, res) {
  //ask for the amountMax, amountMin, and avg of the amount spent on this category, as well as average income.

  var statistic = Budget.aggregate([
    { $match: { user: req.user._id, isIncome: "wants", ignored: false } },
    {
      $lookup: {
        from: "reports",
        localField: "reportID",
        foreignField: "_id",
        as: "data"
      }
    },
    {
      $unwind: "$data"
    },
    {
      $group: {
        _id: {
          name: "$name",
          id: "$_id",
          preference: "$preference",
          isIncome: "$isIncome"
        },
        amountMax: { $max: "$data.amountPerMonth" },
        amountMin: { $min: "$data.amountPerMonth" },
        avg: { $avg: "$data.amountPerMonth" }
      }
    }
  ]);
  var avgIncome = Budget.aggregate([
    { $match: { user: req.user._id, isIncome: "income" } },
    {
      $lookup: {
        from: "reports",
        localField: "reportID",
        foreignField: "_id",
        as: "data"
      }
    },
    {
      $unwind: "$data"
    },
    { $group: { _id: "$name", avg: { $avg: "$data.amountPerMonth" } } }
  ]);
  // sums all preferences on "wants".
  var sumPreference = Budget.aggregate([
    {
      $match: {
        user: req.user._id,
        isIncome: "wants"
      }
    },
    { $group: { _id: "$isIncome", res: { $sum: "$preference" } } }
  ]);
  Promise.all([statistic, sumPreference, avgIncome]).then(function(values) {
    var answer = [];
    var newAvgInc = 0;
    for (var i = 0; i < values[2].length; i++) {
      newAvgInc = newAvgInc + values[2][i].avg;
    }

    // calculate amountPreference for each "wants" category:
    var i;
    for (i = 0; i < values[0].length; i++) {
      //method:  amountPreference = itemPreference/sumPreference * totalIncomeAvg* 80%
      var amountPreference =
        (values[0][i]._id.preference / values[1][0].res) * newAvgInc * 0.8;
      var amount = 0;
      // if amountPreference within amountMax & amountMin of the item:, suggest amountPreference
      if (
        amountPreference < values[0][i].amountMax &&
        amountPreference > values[0][i].amountMin
      ) {
        amount = amountPreference;
      }
      // if amountPreference outside amountMax & amountMin of the item, suggest amountMin:
      else {
        amount = values[0][i].amountMin;
      }

      //push to frontEnd:
      answer.push({
        id: values[0][i]._id.id,
        name: values[0][i]._id.name,
        isIncome: "wants",
        preference: values[0][i]._id.preference,
        budgetedAmount: amount
      });
    }

    res.send(answer);
  });
};

/** Checks on all budgets related to 1 user. */

var getBudget = function(req, res) {
  // gives all user's budgets.

  Budget.find({
    user: req.user._id,
    ignored: false
  })
    .then(doc => {
      res.json(doc);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

/** Updates user's  budget (/preference/budgetedAmount).
 * @param req.body:(required)  updated budget details provided in JSON object.  */

var updateBudget = function(req, res) {
  Joi.validate(req.body, schemas.budgetUpdateSchema).then(item => {
    Budget.findOneAndUpdate(
      {
        name: req.body.name,
        user: req.user._id,
        ignored : false
      },
      {
        name: item.name,
        budgetedAmount: item.budgetedAmount,
        preference: item.preference
      },
      {
        new: true
      }
    )
      .then(doc => {
        res.status(200).json(doc);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
};

/** Deletes 1 of user's  budgets based on the name.
 * @param req.body.name : (required) the budget's name that will be deleted.*/

var deleteBudget = function(req, res) {
  //basically ignore this budget.
  Budget.findOneAndUpdate(
    {
      user: req.user._id,
      name: req.body.name,
      ignored: false
    },
    { ignored: true },
    { new: true }
  )
    .then(doc => {
      res.json(doc);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

module.exports.createBudget = createBudget;
module.exports.suggestBudget = suggestBudget;
module.exports.deleteBudget = deleteBudget;
module.exports.updateBudget = updateBudget;
module.exports.getBudget = getBudget;

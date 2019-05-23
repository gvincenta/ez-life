var mongoose = require("mongoose");
var router = require("express-promise-router")();
var passport = require("passport");
var Goal = mongoose.model("goal");
var { schemas } = require("../validators/validator");
var Joi = require("joi");
var goalController = require("../controllers/goals.js");

/** Creates a new goal for the user.
 * @param req.query : all the details of the goal inserted as queries. */

router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    goalController.addNew
    
);

/** Checks on 1 goal or all goals related to 1 user.
 * @param req.body.name : (optional) if provided, returns 1 user's goal specified by this id.  */

router.get(
    "/",passport.authenticate("jwt", { session: false }),
    goalController.getGoals
);

/** Updates user's  goal (name/due date/amount).
 * @param req.body:(required)  updated goal details provided in JSON object.  */

router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    goalController.updateGoals
);


/** Deletes 1 user's  goal (name/due date/amount).
 * @param req.body:(required)  name of the goal to be deleted.  */

router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    goalController.deleteGoals
);

module.exports = router;

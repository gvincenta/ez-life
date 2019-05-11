var router = require("express-promise-router")();
var passport = require("passport");
var reportController = require("../controllers/report.js");

// aggregates each income & expense category, then put it into report.

router.get(
  "/monthly",
  passport.authenticate("jwt", { session: false }),
  reportController.monthlyTransaction
);
router.get(
  "/graph",
  passport.authenticate("jwt", { session: false }),
  reportController.yearlyTransaction
);

module.exports = router;

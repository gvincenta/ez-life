var router = require("express-promise-router")();
var passport = require("passport");
var transactionController = require("../controllers/transaction.js");

/** Creates a new transaction for the user.  */

router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    transactionController.createNewTransaction
);

/** Checks on 1 transaction or all transactions related to 1 user. */

router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    transactionController.findTransaction
);

/** Updates user's  transaction (date/realAmount).*/
router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    transactionController.updateTransaction
);

/**distinct budget category.*/
router.get(
    "/cat",
    passport.authenticate("jwt", { session: false }),
    transactionController.getDistinctName
);

module.exports = router;

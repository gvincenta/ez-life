var mongoose = require("mongoose");
var schema = mongoose.Schema;

// create a schema to aggregate information monthly
var budgetSchema = mongoose.Schema({
  user: { type: schema.Types.ObjectId, ref: "person", required: true },
  name: {
    type: String,
    lowercase: true,
    required: true
  },
  isIncome: {
    type: String,
    enum: ["income", "needs", "wants"],
    lowercase: true,
    required: true
  },
  preference: {
    type: Number,
    required: true
  },
  budgetedAmount: {
    type: Number
  },
  transactionID: { type: schema.Types.ObjectId, ref: "transaction" },
  reportID: { type: schema.Types.ObjectId, ref: "report" },
  ignored: {
    type: Boolean,
    required: true
  }
});
mongoose.model("budget", budgetSchema);

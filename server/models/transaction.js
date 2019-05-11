var mongoose = require("mongoose");
var schema = mongoose.Schema;

var transactionSchema = mongoose.Schema({
  realAmount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});
mongoose.model("transaction", transactionSchema);

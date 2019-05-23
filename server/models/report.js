var mongoose = require("mongoose");
var schema = mongoose.Schema;

// create a schema to aggregate information monthly
var reportSchema = mongoose.Schema({
    user: { type: schema.Types.ObjectId, ref: "person", required: true },
    amountPerMonth: {
        type: Number,
        required: true
    },
    month: {
        type: Date,
        required: true
    }
});
mongoose.model("report", reportSchema);

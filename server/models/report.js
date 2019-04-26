var mongoose = require('mongoose');
var schema = mongoose.Schema;

// create a schema to aggregate information monthly
var reportSchema = mongoose.Schema({
        
        amountPerMonth:{
            type: Number,
            required : true
        },
        month:{
            type : Date,
            required : true
        }
    }
);
mongoose.model('report',reportSchema);

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var transactionSchema = mongoose.Schema({
        user: { type: schema.Types.ObjectId, 
            ref: 'person',
        required: true 
        },
        name:{
            type: String,
            required: true
        },
        amount:{
            type: Number,
            required : true
        },
        isIncome:{
            type : Boolean,
            required: true
        },
        frequency:{
            type : String,
            enum: [ "daily","weekly", "fortnightly", "monthly", "yearly"],
            lowercase : true,
            required : true
        }
        
    }
);
mongoose.model('transaction',transactionSchema);

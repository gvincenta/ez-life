var mongoose = require('mongoose');
var schema = mongoose.Schema;

//create goal schema 
var goalSchema = mongoose.Schema({
        user: { type: schema.Types.ObjectId, 
            ref: 'person',
        required: true
        },
        name:{
            type: String,
            required: true,
            lowercase : true       
        },
        amount:{
            type: Number,
            required : true
        },
        due: {
            type: Date,
            required : true
        }
    }
);
//exporting...
mongoose.model('goal',goalSchema);

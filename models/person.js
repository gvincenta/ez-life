var mongoose = require('mongoose');

var personSchema = mongoose.Schema(
    {
        id : String,
        email: {
            type : String,
            lowercase : true
        }
    }
);
mongoose.model('person',personSchema);

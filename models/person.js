var mongoose = require('mongoose');
//id : google id, email: gmail account.
var personSchema = mongoose.Schema(
    {
        id : String,
        email: {
            type : String,
            lowercase : true
        }
    }
);
//export
mongoose.model('person',personSchema);

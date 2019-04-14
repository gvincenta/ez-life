var mongoose = require('mongoose');
const schema = mongoose.Schema;

//id : google id, email: gmail account.
//do we have to specify "required"? 
var personSchema = mongoose.Schema(
    {
        id : {
            type: String,
        required : true},
        email: {
            type : String,
            lowercase : true,
            required: true
        },
        name : String, 
        birthdate : Date,
        gender : 
            {
                type : String,
                enum: ["male", "female", "other"],
                lowercase : true
            }
    }
);



//export
mongoose.model('person',personSchema);

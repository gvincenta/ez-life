var mongoose = require('mongoose');
var personSchema = mongoose.Schema(
    {
        "name":String,
        "password":String
    }
);
mongoose.model('person',personSchema);

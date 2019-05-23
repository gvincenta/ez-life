var mongoose = require("mongoose");
var Person = mongoose.model("person");
//code goes here.
var createPerson = function(req, res) {
    var person = new Person({
        name: req.body.name,
        password: req.body.password
    });
    person.save(function(err, newPerson) {
        if (!err) {
            res.send(newPerson);
        } else {
            res.sendStatus(400);
        }
    });
};

var findAllPeople = function(req, res) {
    Person.find(function(err, people) {
        if (!err) {
            res.send(people);
        } else {
            res.sendStatus(404);
        }
    });
};

module.exports.createPerson = createPerson;
module.exports.findAllPeople = findAllPeople;

var mongoose = require("mongoose");
var Person  = mongoose.model("person");
var JWT = require("jsonwebtoken");
var JWT_S = process.env.JWT_SECRET;
//code goes here. 

var signToken = user => {
    return JWT.sign({
        iss : 'ez-life', // optional
        sub : user._id,
        issuedAt :new Date().getTime(), //optional
        exp : new Date().setDate(new Date().getDate() +1 )
    }, JWT_S // important, please be serious. 
    );    
}
var addUser = async function(req,res, next){
    // email, password
    // find user
    var {email, password} = req.value.body;
    var findUser = await Person.findOne({email});
    if (findUser){
        return res.status(403).json({error : "Email is already in use"});
    }
    // need to expand req.value.body
    // create new user
    var newUser =  new Person({ 
        email, 
        password
    });    
    
    await newUser.save();

    //generate token
    var token = signToken(newUser);

    //respond w/ token
    res.status(200).json({token});
};
var getUserData = async function(req,res, next){
    console.log("i\'ve reached here!");


};
var login = async function(req,res, next){
    // make token
    console.log("req.user",req.user);
    var token = signToken(req.user);
    res.status(200).json({token});
};

var getAllUsers =  function(req,res, next){
    Person.find(function(err,people){
        if(!err){
            res.send(people);
        }else{
            res.sendStatus(404);
        }
    });
};

module.exports.addUser = addUser;
module.exports.login = login;
module.exports.getUserData = getUserData;
module.exports.getAllUsers = getAllUsers;

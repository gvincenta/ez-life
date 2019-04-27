var mongoose = require("mongoose");
var Person  = mongoose.model("person");
var JWT = require("jsonwebtoken");
var {schemas}= require('../validators/validator');
var Joi = require('joi');
//code goes here. 
var signUp =  async (req, res, next) => {
    console.log("run");
    const { email, password } = req.body;

    // Check if there is a user with the same email
    const foundUser = await Person.findOne({ "email": email });
    if (foundUser) { 
      return res.status(403).json({ error: 'Email is already in use'});
      console.log("already used");
    }

    // Create a new user
    const newUser = new Person({ 
 
        email: email, 
        password: password
      
    });

    await newUser.save();

    // Generate the token
    const token = signToken(newUser);
    // Respond with token
    res.status(200).json({ token });
  };

var signIn = async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.status(200).json({ token });
};

/**sends token for acces to user. */
var signToken = user => {
    return JWT.sign({
        iss : 'ez-life', // optional
        sub : user._id,
        issuedAt :new Date().getTime(), //optional
        exp : new Date().setDate(new Date().getDate() +1 )
    }, process.env.JWT_SECRET 
    );    
};

/**gets user data
 * @params req.user : user's details given from token. 
 * @return sends user's detail 
 */
var getUserData = async function(req,res, next){
    Person.findById(req.user._id, function(err, data){
        if(err){
          res.send(err);
          return;
        }
        res.send(data);
    });
};



/**adds profile data to 1 user in db. 
 * @params req.body : new details of user in JSON format
 * @params req.user : user's details given by token
 * @return displays user's new details
*/
var addUserData =  async function(req,res, next){
    
    Joi.validate(req.body, schemas.loginSchema)
        .then(item=>{
            Person.findOneAndUpdate(
                {"_id": req.user._id}, 
                {"name":item.name,
                 "birthdate": item.birthdate,
                 "gender": item.gender
                }, 
                {"new": true})
            .then(doc =>{
                    res.json(doc)
            })
            .catch(err =>{
                res.status(500).json(err)
            });
        })
        .catch(err =>{
            res.status(500).json(err)
        });
        

    
}; 



/*exporting.. */
module.exports.signIn = signIn;
module.exports.getUserData = getUserData;
module.exports.addUserData = addUserData;

module.exports.signUp = signUp;

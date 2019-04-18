var mongoose = require("mongoose");
var Person  = mongoose.model("person");
var JWT = require("jsonwebtoken");
var {schemas}= require('../validators/validator');
var Joi = require('joi');
//code goes here. 

/**sends token for acces to user. */
var signToken = user => {
    return JWT.sign({
        iss : 'ez-life', // optional
        sub : user._id,
        issuedAt :new Date().getTime(), //optional
        exp : new Date().setDate(new Date().getDate() +1 )
    }, process.env.JWT_SECRET 
    );    
}

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

/**login existing user
 * 
 */
var login = async function(req,res, next){
    // make token
    var token = signToken(req.user);
    //return token
    res.status(200).json({token});
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
module.exports.login = login;
module.exports.getUserData = getUserData;
module.exports.addUserData = addUserData;

var passport = require("passport");
var JWTStrategy = require("passport-jwt").Strategy;
var ExtractJWT = require("passport-jwt").ExtractJwt;
var GooglePlusTokenStrategy = require("passport-google-plus-token");
var mongoose = require('mongoose');
var Person = mongoose.model('person');

// JSON WEB TOKEN STRATEGY
passport.use(new JWTStrategy({
    jwtFromRequest : ExtractJWT.fromHeader("authorization"),
    secretOrKey : process.env.JWT_SECRET
}, async (payload, done) => {
    try{
        // find user specified in token
        var user = await Person.findById(payload.sub);

        //if user not defined ,handle:
        if (!user){
            return done(null, false);
        }
        // return user
        return done(null, user);
    }
    catch(error){
        done(error, false);
    }
}));
//handle google tokens. 
passport.use("googleToken", new GooglePlusTokenStrategy({
    clientID :process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done)=>{
    try{
        
        // check if user exists
        var existingUser = await Person.findOne({"id" : profile.id});
        if (existingUser){
            console.log("user alr exists in DB ");
            return done(null, existingUser);
        }
        
        // if new account
        console.log("user not exists in DB ");
        var newUser = new Person ({
            id : profile.id,
            email: profile.emails[0].value
        })
        await newUser.save();
        done(null, newUser);
    }
    //catch errors:
    catch(error){
        
        done(error, false, error.message); 
    }
   
}));
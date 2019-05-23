var passport = require("passport");
var JWTStrategy = require("passport-jwt").Strategy;
var ExtractJWT = require("passport-jwt").ExtractJwt;
var mongoose = require("mongoose");
var Person = mongoose.model("person");
var LocalStrategy = require("passport-local").Strategy;

// JSON WEB TOKEN STRATEGY
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromHeader("authorization"),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        // find user specified in token
        var user = await Person.findById(payload.sub);

        //if user not defined ,handle:
        if (!user) {
          return done({ error: "user does not exist, may sign up." }, false);
        }
        // return user
        return done(null, user);
      } catch (err) {
        done({ error: err }, false);
      }
    }
  )
);
// LOCAL STRATEGY
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      try {
        // Find the user given the email
        const user = await Person.findOne({ email: email });

        // If not, handle it
        if (!user) {
          return done(null, false);
        }

        // Check if the password is correct
        const isMatch = await user.isValidPassword(password);
        // If not, handle it
        if (!isMatch) {
          return done(null, false);
        }

        // Otherwise, return the user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

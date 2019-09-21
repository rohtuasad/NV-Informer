var LocalStrategy = require("passport-local").Strategy;

// load up the user model
var User = require("../src/models/user");

// expose this function to our app using module.exports
module.exports = function(passport) {
  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "login",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, login, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
          // find a user whose login is the same as the forms login
          // we are checking to see if the user trying to login already exists
          User.findOne({ "local.login": login }, function(err, user) {
            // if there are any errors, return the error
            if (err) return done(err);

            // check to see if theres already a user with that login
            if (user) {
              return done(
                null,
                false,
                req.flash("signupMessage", "That login is already taken.")
              );
            } else {
              // if there is no user with that login
              // create the user
              var newUser = new User();

              // set the user's local credentials
              newUser.local.login = login;
              newUser.local.password = newUser.generateHash(password);

              // save the user
              newUser.save(function(err) {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );
};

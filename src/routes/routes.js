module.exports = function(app, passport) {
  app.get("/", function(req, res) {
    res.render("index");
  });
  app.get("/signup", function(req, res) {
    res.render("signup", { message: req.flash("signupMessage") });
  });
  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );
};

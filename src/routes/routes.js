var userManager = require("../authorization/userManager");
var connection = require("../mySql/connection");
var bot = require("../vegas-bot/bot");

module.exports = function(app, passport) {
  app.get("/", function(req, res) {
    res.render("index", { message: req.flash("signupMessage") });
  });
  app.get("/signup", function(req, res) {
    res.render("signup", { message: req.flash("signupMessage") });
  });
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
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
  app.get("/profile", isLoggedIn, function(req, res) {
    res.render("profile.ejs", {
      user: req.user // get the user out of session and pass to template
    });
  });
  app.get("/grant", isLoggedIn, function(req, res) {
    userManager.getAllUsers(function(err, users) {
      res.render("grant.ejs", { users: users });
    });
  });
  app.post("/grant", isLoggedIn, function(req, res) {
    userManager.updatePermissions(req.body, function(users) {
      res.render("grant.ejs", { users: users });
    });
  });
  app.get("/gangsters", function(req, res) {
    connection.getGangsters(function(rows) {
      res.render("gangsters.ejs", { gangsters: rows });
    });
  });
  app.get("/manager", function(req, res) {
    connection.getGangstersShort(function(rows) {
      res.render("manager.ejs", { gangsters: rows });
    });
  });
  app.post("/manager", function(req, res) {
    connection.updateGroups(req.body, function(result) {
      res.json(result);
    });
  });
  app.get("/raid", function(req, res) {
    connection.getGangstersShort(function(rows) {
      res.render("raid.ejs", { gangsters: rows });
    });
  });
  app.post("/raid", function(req, res) {
    bot.sendGroupMessage(req.body.num, req.body.message, function(result) {
      res.json(result);
    });
  });
  app.get("/raidtop", function(req, res) {
    connection.getRaidTop(function(rows) {
      res.render("raidtop.ejs", { gangsters: rows });
    });
  });
  // process the login form
  app.post(
    "/",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect them to the home page
    res.redirect("/");
  }
};

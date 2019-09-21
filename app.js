var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var configDB = require("./config/database.js");
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var session = require("express-session");

mongoose.connect(configDB.url);

var app = express();

require("./config/passport")(passport);

// view engine setup
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "ilovescotchscotchyscotchscotch" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require("./src/routes/routes.js")(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

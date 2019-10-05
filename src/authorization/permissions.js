var roles = require("./roles");

module.exports = function(req, res, next) {
  switch (req.url) {
    case "/grant": {
      if (
        !req.user ||
        (req.user && !req.user.local.roles.includes(roles.Grant))
      ) {
        res.redirect("/");
      }
      break;
    }
    case "/gangsters": {
      if (
        !req.user ||
        (req.user && !req.user.local.roles.includes(roles.User))
      ) {
        res.redirect("/");
      }
      break;
    }
    case "/manager": {
      if (
        !req.user ||
        (req.user && !req.user.local.roles.includes(roles.User))
      ) {
        res.redirect("/");
      }
      break;
    }
  }
  next();
};

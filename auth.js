var LocalStrategy = require("passport-local").Strategy;
var database = require("./database");

module.exports = function(db, passport) {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      database.authenticateAdminUser(db, username, password, function(result) {
        if (result.err) {
          return done(err);
        }
        if (!result.document) {
          return done(null, false);
        }
        return done(null, result.document);
      });
    })
  );

  passport.serializeUser(function(adminUser, done) {
    return done(null, adminUser._id);
  });

  passport.deserializeUser(function(adminUserId, done) {
    database.findAdminUser(db, adminUserId, function(result) {
      if (result.err) {
        done(err);
      }
      if (!result.document) {
        return done(null, false);
      }
      return done(null, result.document);
    })
  });
};

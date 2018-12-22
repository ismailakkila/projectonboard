var moment = require("moment");
var multer = require("multer");

var database = require("./database");
var verifyInput = require("./verifyInput");
var sms = require("./sms");
var email = require("./email");

var indexPath = __dirname + "/public";
var adminUsersCollection = "admins";
var usersCollection = "users";
var smsProvidersCollection = "smsProviders";
var emailProvidersCollection = "emailProviders";
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, indexPath + "/images/users");
  },
  filename: function (req, file, cb) {
    cb(null, req.params._id + ".png");
  }
});
var uploadPhoto = multer({
  storage: storage,
  fileFilter: verifyInput.imageFileFilter,
  limits: {
    fileSize: 4096000,
    fields: 0,
    files: 1
  }
}).single("file");

var responseCallback = function(res, action, item) {
  return function(result) {
    if (result.hasOwnProperty("status")) {
      console.log(moment().toISOString() + " - [Node Express] " + result.document);
      res.status(result.status);
      res.send(result.document);
      return;
    }
    if (result.err) {
      console.log(moment().toISOString() + " - [Node Express] Internal Server Error: " + result.err);
      res.status(500);
      res.json({err: "Internal Server Error"});
      return;
    }
    if (!result.document) {
      console.log(moment().toISOString() + " - [Node Express] " + item + " " + action + " failed");
      res.status(404);
      res.json({document: {}});
      return;
    }
    console.log(moment().toISOString() + " - [Node Express] " + item + " " + action + " success");
    res.status(200);
    res.json({document: result.document});
    return;
  }
};

module.exports = function(app, db, passport) {

  app.route("/api/admin/count")
    .get(function(req, res) {
      database.getCollectionCount(
        db,
        adminUsersCollection,
        responseCallback(res, "admin users", "Get count")
      );
    });

  app.route("/api/user/count")
    .get(function(req, res) {
      if (req.isAuthenticated()) {
        database.getCollectionCount(
          db,
          usersCollection,
          responseCallback(res, "users", "Get count")
        );
        return;
      }
      else {
        console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
        res.status(401);
        res.send("Unauthorized");
        return;
      }
    });

    app.route("/api/sms/provider/count")
      .get(function(req, res) {
        if (req.isAuthenticated()) {
          database.getCollectionCount(
            db,
            smsProvidersCollection,
            responseCallback(res, "SMS providers", "Get count")
          );
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      });

    app.route("/api/email/provider/count")
      .get(function(req, res) {
        if (req.isAuthenticated()) {
          database.getCollectionCount(
            db,
            emailProvidersCollection,
            responseCallback(res, "Email providers", "Get count")
          );
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      });

  app.route("/api/admin")
    .post(function(req, res) {
      var input = verifyInput.createAdminUser(req.body);
      verifyInput.getHash(input, "password", function(input) {
        if (input) {
          database.getCollectionCount(
            db,
            adminUsersCollection,
            function(result) {
              if (result.err) {
                responseCallback(res, "admin user", "Create")(result);
                return;
              }
              if (!result.document) {
                responseCallback(res, "admin user", "Create")(result);
                return;
              }
              if (Number(result.document) === 0) {
                database.createAdminUser(db, input, responseCallback(res, "admin user", "Create"));
                return;
              }
              else {
                console.log(moment().toISOString() + " - [Node Express] Not allowed to create user");
                res.status(401);
                res.json({err: "Not Allowed"});
                return;
              }
            }
          );
          return;
        }
        console.log(moment().toISOString() + " - [Node Express] Bad request");
        res.status(400);
        res.json({err: "Bad request"});
        return;
      });
    });

  app.post("/upload/user/photo/:_id", uploadPhoto, function(req, res) {
    if (req.isAuthenticated()) {
      var input = verifyInput.uploadPhoto(req.params);
      if (input && req.file) {
        console.log(moment().toISOString() + " - [Node Express] Upload user photo success");
        res.status(200);
        res.json({document: "Success"});
        return;
      }
      console.log(moment().toISOString() + " - [Node Express] Bad request");
      res.status(400);
      res.json({err: "Bad request"});
      return;
    }
    else {
      console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
      res.status(401);
      res.send("Unauthorized");
      return;
    }
  });

  app.route("/api/user")
    .get(function(req, res) {
      if (req.isAuthenticated()) {
        var query = verifyInput.getUser(req.query);
        if (query) {
          database.getUsersQuery(db, query, responseCallback(res, "Users Query", "Get"));
          return;
        }
        database.getUsers(db, responseCallback(res, "Users", "Get"));
        return;
      }
      else {
        console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
        res.status(401);
        res.send("Unauthorized");
        return;
      }
    })
    .post(function(req, res) {
      if (req.isAuthenticated()) {
        var input = verifyInput.createUser(req.body);
        if (input) {
          database.createUser(db, input, responseCallback(res, "User", "Create"));
          return;
        }
        console.log(moment().toISOString() + " - [Node Express] Bad request");
        res.status(400);
        res.json({err: "Bad request"});
        return;
      }
      else {
        console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
        res.status(401);
        res.send("Unauthorized");
        return;
      }
    });

    app.route("/api/user/:_id")
      .get(function(req, res) {
        if (req.isAuthenticated()) {
          var params = verifyInput.getUser(req.params);
          if (params) {
            database.getUser(db, params, responseCallback(res, "User", "Get"));
            return;
          }
          console.log(moment().toISOString() + " - [Node Express] Bad request");
          res.status(400);
          res.json({err: "Bad request"});
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      })
      .put(function(req, res) {
        if (req.isAuthenticated()) {
          var params = verifyInput.getUser(req.params);
          var query = verifyInput.modifyUser(req.query);
          if (params && query) {
            database.modifyUser(db, params, query, responseCallback(res, "User", "Modify"));
            return;
          }
          console.log(moment().toISOString() + " - [Node Express] Bad request");
          res.status(400);
          res.json({err: "Bad request"});
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      })
      .delete(function(req, res) {
        if (req.isAuthenticated()) {
          var params = verifyInput.deleteUser(req.params);
          if (params) {
            database.deleteUser(db, params, responseCallback(res, "User", "Delete"));
            return;
          }
          console.log(moment().toISOString() + " - [Node Express] Bad request");
          res.status(400);
          res.json({err: "Bad request"});
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      });

    app.route("/api/sms/provider")
      .get(function(req, res) {
        if (req.isAuthenticated()) {
          database.getSmsProviders(db, responseCallback(res, "SMS Provider", "Get"));
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      })
      .post(function(req, res) {
        if (req.isAuthenticated()) {
          verifyInput.createSmsProvider(req.body, function(input) {
            if (input) {
              database.createSmsProvider(db, input, responseCallback(res, "SMS Provider", "Create"));
              return;
            }
            console.log(moment().toISOString() + " - [Node Express] Bad request");
            res.status(400);
            res.json({err: "Bad request"});
            return;
          });
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      });

    app.route("/api/sms/provider/:_id")
      .delete(function(req, res) {
        if (req.isAuthenticated()) {
          var params = verifyInput.deleteSmsProvider(req.params);
          if (params) {
            database.deleteSmsProvider(db, params, responseCallback(res, "Sms Provider", "Delete"));
            return;
          }
          console.log(moment().toISOString() + " - [Node Express] Bad request");
          res.status(400);
          res.json({err: "Bad request"});
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      });

    app.route("/api/sms/template")
      .get(function(req, res) {
        if (req.isAuthenticated()) {
          database.getSmsTemplates(db, responseCallback(res, "SMS Template", "Get"));
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      })
      .post(function(req, res) {
        if (req.isAuthenticated()) {
          var input = verifyInput.createSmsTemplate(req.body);
          if (input) {
            database.createSmsTemplate(db, input, responseCallback(res, "SMS Template", "Create"));
            return;
          }
          console.log(moment().toISOString() + " - [Node Express] Bad request");
          res.status(400);
          res.json({err: "Bad request"});
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      });

    app.route("/api/sms/template/:_id")
      .put(function(req, res) {
        if (req.isAuthenticated()) {
          var input = Object.assign({}, req.params, req.query);
          input = verifyInput.modifySmsTemplate(input);
          if (input) {
            database.modifySmsTemplate(db, input, responseCallback(res, "Sms Template", "Modify"));
            return;
          }
          console.log(moment().toISOString() + " - [Node Express] Bad request");
          res.status(400);
          res.json({err: "Bad request"});
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      })
      .delete(function(req, res) {
        if (req.isAuthenticated()) {
          var params = verifyInput.deleteSmsTemplate(req.params);
          if (params) {
            database.deleteSmsTemplate(db, params, responseCallback(res, "Sms Template", "Delete"));
            return;
          }
          console.log(moment().toISOString() + " - [Node Express] Bad request");
          res.status(400);
          res.json({err: "Bad request"});
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      });

    app.route("/api/sms/send/:_id")
      .get(function(req, res) {
        if (req.isAuthenticated()) {
          var input = Object.assign({}, req.params, req.query);
          input = verifyInput.sendSms(input);
          if (input) {
            sms.sendSms(db, input, responseCallback(res, "SMS Send", "Operation"));
            return;
          }
          console.log(moment().toISOString() + " - [Node Express] Bad request");
          res.status(400);
          res.json({err: "Bad request"});
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      });

    app.route("/api/email/provider")
      .get(function(req, res) {
        if (req.isAuthenticated()) {
          database.getEmailProviders(db, responseCallback(res, "Email Provider", "Get"));
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      })
      .post(function(req, res) {
        if (req.isAuthenticated()) {
          verifyInput.createEmailProvider(req.body, function(input) {
            if (input) {
              database.createEmailProvider(db, input, responseCallback(res, "Email Provider", "Create"));
              return;
            }
            console.log(moment().toISOString() + " - [Node Express] Bad request");
            res.status(400);
            res.json({err: "Bad request"});
            return;
          });
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      });

    app.route("/api/email/provider/:_id")
      .delete(function(req, res) {
        if (req.isAuthenticated()) {
          var params = verifyInput.deleteEmailProvider(req.params);
          if (params) {
            database.deleteEmailProvider(db, params, responseCallback(res, "Email Provider", "Delete"));
            return;
          }
          console.log(moment().toISOString() + " - [Node Express] Bad request");
          res.status(400);
          res.json({err: "Bad request"});
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      });

    app.route("/api/email/template")
      .get(function(req, res) {
        if (req.isAuthenticated()) {
          database.getEmailTemplates(db, responseCallback(res, "Email Template", "Get"));
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      })
      .post(function(req, res) {
        if (req.isAuthenticated()) {
          var input = verifyInput.createEmailTemplate(req.body);
          if (input) {
            database.createEmailTemplate(db, input, responseCallback(res, "Email Template", "Create"));
            return;
          }
          console.log(moment().toISOString() + " - [Node Express] Bad request");
          res.status(400);
          res.json({err: "Bad request"});
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      });

    app.route("/api/email/template/:_id")
      .put(function(req, res) {
        if (req.isAuthenticated()) {
          var input = Object.assign({}, req.params, req.query);
          input = verifyInput.modifyEmailTemplate(input);
          if (input) {
            database.modifyEmailTemplate(db, input, responseCallback(res, "Email Template", "Modify"));
            return;
          }
          console.log(moment().toISOString() + " - [Node Express] Bad request");
          res.status(400);
          res.json({err: "Bad request"});
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      })
      .delete(function(req, res) {
        if (req.isAuthenticated()) {
          var params = verifyInput.deleteEmailTemplate(req.params);
          if (params) {
            database.deleteEmailTemplate(db, params, responseCallback(res, "Email Template", "Delete"));
            return;
          }
          console.log(moment().toISOString() + " - [Node Express] Bad request");
          res.status(400);
          res.json({err: "Bad request"});
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      });

    app.route("/api/email/send/:_id")
      .get(function(req, res) {
        if (req.isAuthenticated()) {
          var input = Object.assign({}, req.params, req.query);
          input = verifyInput.sendEmail(input);
          if (input) {
            email.sendEmail(db, input, responseCallback(res, "Email Send", "Operation"));
            return;
          }
          console.log(moment().toISOString() + " - [Node Express] Bad request");
          res.status(400);
          res.json({err: "Bad request"});
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      });

    app.route("/api/user/reset/:_id")
      .get(function(req, res) {
        if (req.isAuthenticated()) {
          var input = verifyInput.resetUser(req.params);
          if (input) {
            var params = {_id: input._id};
            var query = {initialToken: input.initialToken};
            database.modifyUser(db, params, query, responseCallback(res, "User", "Reset"));
            return;
          }
          console.log(moment().toISOString() + " - [Node Express] Bad request");
          res.status(400);
          res.json({err: "Bad request"});
          return;
        }
        else {
          console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
          res.status(401);
          res.send("Unauthorized");
          return;
        }
      });

    app.route("/admin/login")
      .get(function(req, res) {
        if (req.isAuthenticated()) {
          console.log(moment().toISOString() + " - [Node Express] Admin user: " + req.user.username + " is authenticated");
          res.status(200);
          res.json({authenticated: true, adminUser: req.user, validCredentials: true});
          return;
        }
        console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
        res.status(401);
        res.send("Unauthorized");
        return;
      })
      .post(
        passport.authenticate("local"),
        function(req, res) {
          console.log(moment().toISOString() + " - [Node Express] Admin user: " + req.user.username + " is authenticated");
          res.status(200);
          res.json({authenticated: true, adminUser: req.user, validCredentials: true});
          return;
        }
      );

    app.route("/admin/logout")
      .get(function(req, res) {
        if (req.user) {
          console.log(moment().toISOString() + " - [Node Express] Admin user: " + req.user.username + " is logged out");
          req.logout();
        }
        res.status(200);
        res.json({authenticated: false, adminUser: null, validCredentials: null});
        return;
      });

    app.get("*", function(req, res) {
      if (req.isAuthenticated()) {
        var splitPath = req.path.split("/");
        if (splitPath[1] === "images" && splitPath[2] === "users") {
          res.status(200);
          var avatarFile = "avatar" + String(Math.floor(7 * Math.random()) + 1) + ".png";
          console.log(moment().toISOString() + " - [Node Express] Get user photo failed. Serving alternative: " + avatarFile);
          res.sendFile(indexPath + "/images/users/" + avatarFile);
          return;
        }
        console.log(moment().toISOString() + " - [Node Express] Webpage not found!");
        res.status(404);
        res.json({document: {}});
        return;
      }
      console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
      res.status(401);
      res.send("Unauthorized");
      return;
    });

    app.post("*", function(req, res) {
      if (req.isAuthenticated()) {
        console.log(moment().toISOString() + " - [Node Express] Webpage not found!");
        res.status(404);
        res.json({document: {}});
        return;
      }
      console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
      res.status(401);
      res.send("Unauthorized");
      return;
    });

    app.delete("*", function(req, res) {
      if (req.isAuthenticated()) {
        console.log(moment().toISOString() + " - [Node Express] Webpage not found!");
        res.status(404);
        res.json({document: {}});
        return;
      }
      console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
      res.status(401);
      res.send("Unauthorized");
      return;
    });

    app.put("*", function(req, res) {
      if (req.isAuthenticated()) {
        console.log(moment().toISOString() + " - [Node Express] Webpage not found!");
        res.status(404);
        res.json({document: {}});
        return;
      }
      console.log(moment().toISOString() + " - [Node Express] Not Authenticated");
      res.status(401);
      res.send("Unauthorized");
      return;
    });
};

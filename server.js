var express = require("express");
var session = require("express-session");
var passport = require("passport");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var dotenv = require("dotenv");
var moment = require("moment");
var helmet = require("helmet");

var database = require("./database");
var auth = require("./auth");
var routes = require("./routes");

dotenv.config();
var indexPath = __dirname + "/public";
var databaseCollections = ["admins", "users", "smsProviders", "smsTemplates", "emailProviders", "emailTemplates"];

var app = express();

mongodb.MongoClient.connect(process.env.DATABASEURI, { useNewUrlParser: true }, function(err, client) {
  if (err) {
    console.log(moment().toISOString() + " - [MongoDB] Failed to connect to MongoDB Database: " + process.env.DATABASEURI);
    console.log(moment().toISOString() + " - [MongoDB] Error: " + err);
    return;
  }
  console.log(moment().toISOString() + " - [MongoDB] Successfully connected to database instance: " + process.env.DATABASEURI);
  var databaseName = process.env.DATABASENAME || "project-onboard";
  var db = client.db(databaseName);

  var checkCollections = databaseCollections.map(function(collection) {
    return db.createCollection(collection);
  });

  Promise.all(checkCollections).then(function(result) {
    console.log(moment().toISOString() + " - [MongoDB] Successfully verified database collections");
  },
  function(err) {
    console.log(moment().toISOString() + " - [MongoDB] Failed to verify database collections");
    console.log(moment().toISOString() + " - [MongoDB] Error: " + err);
    return;
  });

  var port = process.env.PORT || 3000;
  app.listen(port, function(err) {
    if (err) {
      console.log(moment().toISOString() + " - [Node Express] Failed to start server on TCP: " + port);
      console.log(moment().toISOString() + " - [Node Express] Error: " + err);
      return;
    }
    console.log(moment().toISOString() + " - [Node Express] Successfully started server on TCP: " + port);

    app.use(helmet());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(express.static(indexPath));

    app.use(session({
      secret: process.env.SHARED_SECRET,
      resave: true,
      saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function(req, res, next) {
      console.log(moment().toISOString() + " - [Node Express] " + req.method + " - " + req.path + " - " + req.ip);
      return next();
    });

    auth(db, passport);
    routes(app, db, passport);
  });
});

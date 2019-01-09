var Nexmo = require("nexmo");
var Messagebird = require('messagebird');
var lodash = require("lodash");
var database = require("./database");

var boolTestSmsMode = false;

var smsSender = "PROJONBOARD";
var smsSubstitutions = {
  "{username}": "username",
  "{firstName}": "firstName",
  "{lastName}": "lastName",
  "{email}": "email",
  "{mobileNumber}": "mobileNumber",
  "{initialToken}": "initialToken"
};
var capitalizeKeys = ["{firstName}", "{lastName}"];

var sendSms = function(db, input, cb) {
  var userId = input._id;
  var smsProviderId = input.smsProviderId;
  database.getUser(db, {_id: userId}, function(userResult) {
    if (userResult.err) {
      return cb({
        err: err,
        document: null
      });
    }
    if (!userResult.document) {
      return cb({
        err: null,
        document: null
      });
    }
    if (!userResult.document.enabled) {
      return cb({
        err: null,
        document: null
      });
    }
    var destMobileNumber = userResult.document.mobileNumber;
    database.getSmsTemplates(db, function(smsTemplateResult) {
      if (smsTemplateResult.err) {
        return cb({
          err: err,
          document: null
        });
      }
      if (smsTemplateResult.document.length === 0) {
        return cb({
          err: null,
          document: null
        });
      }
      var defaultSmsTemplate = smsTemplateResult.document.filter(function(smsTemplate) {
        return smsTemplate.isDefault === true;
      });
      if (defaultSmsTemplate.length === 1) {
        var smsContent = defaultSmsTemplate[0].smsContent;
        var smsKeywords = Object.keys(smsSubstitutions);
        smsKeywords.forEach(function(keyword) {
          if (capitalizeKeys.indexOf(keyword) != -1) {
            var replacement = lodash.startCase(userResult.document[smsSubstitutions[keyword]]);
          }
          else {
            var replacement = userResult.document[smsSubstitutions[keyword]];
          }
          smsContent = smsContent.replace(keyword, replacement);
        });
        database.getSmsProviders(db, function(smsProviderResult) {
          if (smsProviderResult.err) {
            return cb({
              err: err,
              document: null
            });
          }
          if (smsProviderResult.document.length === 0) {
            return cb({
              err: null,
              document: null
            });
          }
          if (smsProviderResult.document.length > 0) {
            var smsProviderType = smsProviderResult.document[0].type;
            switch(boolTestSmsMode) {
              case true:
                var testResult = ({
                  type: "smsTest",
                  userId: userId,
                  success: true,
                  smsSender: smsSender,
                  destMobileNumber: destMobileNumber,
                  smsContent: smsContent,
                  messageCount: 1
                });
                return cb({
                  err: null,
                  document: testResult
                });
                break;
              default:
                switch(smsProviderType) {
                  case "nexmo":
                    var nexmo = new Nexmo({
                      apiKey: smsProviderResult.document[0].apiKey,
                      apiSecret: smsProviderResult.document[0].apiSecret
                    });
                    nexmo.message.sendSms(smsSender, destMobileNumber, smsContent, function(err, nexmoResult) {
                      if (err) {
                        return cb({
                          err: err,
                          document: null
                        });
                      }
                      if (nexmoResult) {
                        return cb({
                          err: null,
                          document: Object.assign({}, nexmoResult, {
                            type: "nexmo",
                            userId: userId
                          })
                        });
                      }
                    });
                    break;
                  case "messagebird":
                    var messageBird = Messagebird(smsProviderResult.document[0].accessKey);
                    var messageParams = {
                      originator: smsSender,
                      recipients: [destMobileNumber],
                      body: smsContent
                    };
                    messageBird.messages.create(messageParams, function(err, messageBirdResult) {
                      if (err) {
                        return cb({
                          err: err,
                          document: null
                        });
                      }
                      if (messageBirdResult) {
                        return cb({
                          err: null,
                          document: Object.assign({}, messageBirdResult, {
                            type: "messagebird",
                            userId: userId
                          })
                        });
                      }
                    });
                    break;
              }
            }

          }
        });
      }
      else {
        return cb({
          err: null,
          document: null
        });
      }
    });
  });
}

module.exports = {
  sendSms: sendSms
};

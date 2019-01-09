var nodemailer = require("nodemailer");
var qrCode = require("qrcode");
var lodash = require("lodash");
var database = require("./database");
var generateHtmlFromTemplate = require("./generateHtmlFromTemplate");

var boolTestSmtpMode = true;

var emailSubstitutions = {
  "{username}": "username",
  "{firstName}": "firstName",
  "{lastName}": "lastName",
  "{email}": "email",
  "{mobileNumber}": "mobileNumber",
  "{initialToken}": "initialToken"
};
var capitalizeKeys = ["{firstName}", "{lastName}"];

var generateHtml = function(user, emailTemplate, cb) {
  if (emailTemplate.logoUrlRequired) {
    var logoUrlHtml = '<img src="' + emailTemplate.logoUrl + '" style="max-height:200px; max-width:200px; display: block; margin: 0 auto;">';
  }
  else {
    var logoUrlHtml = "";
  }
  if (emailTemplate.qrCodeRequired) {
    generateQrCodeHtml(user.initialToken, function(qrCodeHtml) {
      var emailContentHtml = '<p style="white-space: pre-line; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">' + emailTemplate.emailContent + '</p>';
      cb(generateHtmlFromTemplate(logoUrlHtml, qrCodeHtml, emailContentHtml));
    });
  }
  else {
    var qrCodeHtml = "";
    var emailContentHtml = '<p style="white-space: pre-line; font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">' + emailTemplate.emailContent + '</p>';
    cb(generateHtmlFromTemplate(logoUrlHtml, qrCodeHtml, emailContentHtml));
  }
};

var generateQrCodeHtml = function(data, cb) {
  qrCode.toDataURL(data, function (err, url) {
    if (err) {
      return cb("");
    }
    if (url) {
      return cb('<img src="' + url + '" style="max-height:200px; max-width:200px; display: block; margin: 0 auto;">');
    }
  });
};

var sendSmtp = function(userId, emailProvider, mailOptions, cb) {
  var smtpConfig = {
    host: emailProvider.serverHost,
    port: emailProvider.serverPort,
    secure: false
  };
  if (emailProvider.authRequired) {
    smtpConfig = Object.assign(
      {},
      smtpConfig,
      {
        auth: {
          user: emailProvider.authUsername,
          pass: emailProvider.authPassword
        }
      }
    );
  }
  var transporter = nodemailer.createTransport(smtpConfig);
  transporter.sendMail(mailOptions, function(err, smtpResult) {
    if (err) {
      return cb({
        err: err,
        document: null
      });
    }
    if (smtpResult) {
      return cb({
        err: null,
        document: Object.assign({}, smtpResult, {
          type: "smtp",
          userId: userId
        })
      });
    }
  });
};

var sendTestSmtp = function(userId, mailOptions, cb) {
  nodemailer.createTestAccount((err, account) => {
      let transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
              user: account.user, // generated ethereal user
              pass: account.pass // generated ethereal password
          }
      });
      transporter.sendMail(mailOptions, function(err, smtpResult) {
        if (err) {
          return cb({
            err: err,
            document: null
          });
        }
        if (smtpResult) {
          return cb({
            err: null,
            document: {
              type: "smtpTest",
              userId: userId,
              previewUrl: nodemailer.getTestMessageUrl(smtpResult)
            }
          });
        }
      });
  });
};

var sendEmail = function(db, input, cb) {
  var userId = input._id;
  var emailProviderId = input.emailProviderId;
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
    var user = userResult.document;
    var destEmailAddress = userResult.document.email;
    var initialToken = userResult.document.initialToken;
    database.getEmailTemplates(db, function(emailTemplateResult) {
      if (emailTemplateResult.err) {
        return cb({
          err: err,
          document: null
        });
      }
      if (emailTemplateResult.document.length === 0) {
        return cb({
          err: null,
          document: null
        });
      }
      var defaultEmailTemplate = emailTemplateResult.document.filter(function(emailTemplate) {
        return emailTemplate.isDefault === true;
      });
      if (defaultEmailTemplate.length === 1) {
        var emailTemplate = defaultEmailTemplate[0];
        var emailContent = defaultEmailTemplate[0].emailContent;
        var emailSender = defaultEmailTemplate[0].emailFrom;
        var emailSubject = defaultEmailTemplate[0].emailSubject;
        var emailKeywords = Object.keys(emailSubstitutions);
        emailKeywords.forEach(function(keyword) {
          if (capitalizeKeys.indexOf(keyword) !== -1) {
            var replacement = lodash.startCase(userResult.document[emailSubstitutions[keyword]]);
          }
          else {
            var replacement = userResult.document[emailSubstitutions[keyword]];
          }
          emailContent = emailContent.replace(keyword, replacement);
        });
        emailTemplate = Object.assign({}, emailTemplate, {emailContent: emailContent});
        database.getEmailProviders(db, function(emailProviderResult) {
          if (emailProviderResult.err) {
            return cb({
              err: err,
              document: null
            });
          }
          if (emailProviderResult.document.length === 0) {
            return cb({
              err: null,
              document: null
            });
          }
          if (emailProviderResult.document.length > 0) {
            var emailProviderType = emailProviderResult.document[0].type;
            switch(emailProviderType) {
              case "smtp":
                generateHtml(user, emailTemplate, function(html) {
                  var mailOptions = {
                    from: emailSender,
                    to: destEmailAddress,
                    subject: emailSubject,
                    text: emailContent,
                    html: html
                  };
                  switch(boolTestSmtpMode) {
                    case true:
                      sendTestSmtp(userId, mailOptions, cb);
                      break;
                    default:
                      var emailProvider = emailProviderResult.document[0];
                      sendSmtp(userId, emailProvider, mailOptions, cb);
                  }
                });
                break;
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
  sendEmail: sendEmail
};

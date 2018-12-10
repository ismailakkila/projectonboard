var dotenv = require("dotenv");
dotenv.config();

var apiUrl = "/api";
var adminUrl = "/admin";
var uploadUrl = "/upload";


var generateQueryString = function(input) {
  var keyPairs = [];
  for (var key in input) {
    keyPairs.push(key + "=" + encodeURIComponent(input[key]));
  }
  return keyPairs.join("&");
}

var apiClient = function(method, url, input, cb) {
  switch(method) {
    case "GET":
      var req = new XMLHttpRequest();
      if (input) {
        url = url + "?" + generateQueryString(input);
      }
      req.open("GET", url, true);
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          var message;
          try {
            message = JSON.parse(req.responseText);
          }
          catch(e) {
            message = "";
          }
          return cb({
            status: req.status,
            message: message
          });
        }
      };
      req.send();
      break;
    case "POST":
      var req = new XMLHttpRequest();
      if (input) {
        input = generateQueryString(input);
      }
      else {
        input = "";
      }
      req.open("POST", url, true);
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          var message;
          try {
            message = JSON.parse(req.responseText);
          }
          catch(e) {
            message = "";
          }
          return cb({
            status: req.status,
            message: message
          });
        }
      };
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      req.send(input);
      break;
    case "PUT":
      var req = new XMLHttpRequest();
      if (input) {
        url = url + "?" + generateQueryString(input);
      }
      req.open("PUT", url, true);
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          var message;
          try {
            message = JSON.parse(req.responseText);
          }
          catch(e) {
            message = "";
          }
          return cb({
            status: req.status,
            message: message
          });
        }
      };
      req.send();
      break;
    case "DELETE":
      var req = new XMLHttpRequest();
      if (input) {
        url = url + "?" + generateQueryString(input);
      }
      req.open("DELETE", url, true);
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          var message;
          try {
            message = JSON.parse(req.responseText);
          }
          catch(e) {
            message = "";
          }
          return cb({
            status: req.status,
            message: message
          });
        }
      };
      req.send();
      break;
    case "POST-FILE":
      var fd = new FormData();
      fd.append("file", input);
      var req = new XMLHttpRequest();
      req.open("POST", url, true);
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          var message;
          try {
            message = JSON.parse(req.responseText);
          }
          catch(e) {
            message = "";
          }
          return cb({
            status: req.status,
            message: message
          });
        }
      };
      req.send(fd);
      break;
  }
};

var getAdminCount = function(cb) {
  apiClient("GET", apiUrl + "/admin/count", null, cb);
};

var createAdminUser = function(input, cb) {
  apiClient("POST", apiUrl + "/admin", input, cb);
};

var loginAdminUser = function(input, cb) {
  apiClient("POST", adminUrl + "/login", input, cb);
};

var logoutAdminUser = function(cb) {
  apiClient("GET", adminUrl + "/logout", null, cb);
};

var getAdminUserLoginStatus = function(cb) {
  apiClient("GET", adminUrl + "/login", null, cb);
};

var getUsers = function(cb) {
  apiClient("GET", apiUrl + "/user", null, cb);
};

var createUser = function(input, cb) {
  apiClient("POST", apiUrl + "/user", input, cb);
};

var uploadPhoto = function(userId, file, cb) {
  apiClient("POST-FILE", uploadUrl + "/user/photo/" + userId, file, cb);
};

var deleteUser = function(input, cb) {
  apiClient("DELETE", apiUrl + "/user/" + input, null, cb);
};

var modifyUser = function(userId, input, cb) {
  apiClient("PUT", apiUrl + "/user/" + userId, input, cb);
};

var getSmsProviderCount = function(cb) {
  apiClient("GET", apiUrl + "/sms/provider/count", null, cb);
};

var getSmsProviders = function(cb) {
  apiClient("GET", apiUrl + "/sms/provider", null, cb);
};

var createSmsProvider = function(input, cb) {
  apiClient("POST", apiUrl + "/sms/provider", input, cb);
};

var deleteSmsProvider = function(input, cb) {
  apiClient("DELETE", apiUrl + "/sms/provider/" + input, null, cb);
};

var getSmsTemplates = function(cb) {
  apiClient("GET", apiUrl + "/sms/template", null, cb);
};

var createSmsTemplate = function(input, cb) {
  apiClient("POST", apiUrl + "/sms/template", input, cb);
};

var deleteSmsTemplate = function(input, cb) {
  apiClient("DELETE", apiUrl + "/sms/template/" + input, null, cb);
};

var modifySmsTemplate = function(input, cb) {
  var smsTemplateId = String(input._id);
  var modifyInput = Object.assign({}, input, {});
  delete modifyInput._id;
  apiClient("PUT", apiUrl + "/sms/template/" + smsTemplateId, modifyInput, cb);
};

var sendSms = function(userId, query, cb) {
  apiClient("GET", apiUrl + "/sms/send/" + userId, query, cb);
};

var getEmailProviderCount = function(cb) {
  apiClient("GET", apiUrl + "/email/provider/count", null, cb);
};

var getEmailProviders = function(cb) {
  apiClient("GET", apiUrl + "/email/provider", null, cb);
};

var createEmailProvider = function(input, cb) {
  apiClient("POST", apiUrl + "/email/provider", input, cb);
};

var deleteEmailProvider = function(input, cb) {
  apiClient("DELETE", apiUrl + "/email/provider/" + input, null, cb);
};

var getEmailTemplates = function(cb) {
  apiClient("GET", apiUrl + "/email/template", null, cb);
};

var createEmailTemplate = function(input, cb) {
  apiClient("POST", apiUrl + "/email/template", input, cb);
};

var deleteEmailTemplate = function(input, cb) {
  apiClient("DELETE", apiUrl + "/email/template/" + input, null, cb);
};

var modifyEmailTemplate = function(input, cb) {
  var emailTemplateId = String(input._id);
  var modifyInput = Object.assign({}, input, {});
  delete modifyInput._id;
  apiClient("PUT", apiUrl + "/email/template/" + emailTemplateId, modifyInput, cb);
};

var sendEmail = function(userId, query, cb) {
  apiClient("GET", apiUrl + "/email/send/" + userId, query, cb);
};

module.exports = {
  getAdminCount: getAdminCount,
  createAdminUser: createAdminUser,
  loginAdminUser: loginAdminUser,
  logoutAdminUser: logoutAdminUser,
  getAdminUserLoginStatus: getAdminUserLoginStatus,
  getUsers: getUsers,
  createUser: createUser,
  uploadPhoto: uploadPhoto,
  deleteUser: deleteUser,
  modifyUser: modifyUser,
  getSmsProviderCount: getSmsProviderCount,
  getSmsProviders: getSmsProviders,
  createSmsProvider: createSmsProvider,
  deleteSmsProvider: deleteSmsProvider,
  getSmsTemplates: getSmsTemplates,
  createSmsTemplate: createSmsTemplate,
  deleteSmsTemplate: deleteSmsTemplate,
  modifySmsTemplate: modifySmsTemplate,
  sendSms: sendSms,
  getEmailProviderCount: getEmailProviderCount,
  getEmailProviders: getEmailProviders,
  createEmailProvider: createEmailProvider,
  deleteEmailProvider: deleteEmailProvider,
  getEmailTemplates: getEmailTemplates,
  createEmailTemplate: createEmailTemplate,
  deleteEmailTemplate: deleteEmailTemplate,
  modifyEmailTemplate: modifyEmailTemplate,
  sendEmail: sendEmail
};

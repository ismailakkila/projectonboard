var ObjectId = require("mongodb").ObjectId;
var createAdminUserInputKeys = ["username", "password"];
var loginAdminUserInputKeys = ["username", "password"];
var createUserInputKeys = ["firstName", "lastName", "username", "email", "mobileNumber"];
var getUserInputKeys = ["username", "firstName", "lastName", "email", "mobileNumber", "_id", "enabled"];
var modifyUserInputKeys = ["enabled", "username", "firstName", "lastName", "email", "mobileNumber"];
var deleteUserInputKeys = ["_id"];
var nexmoSmsProviderInputKeys = ["type", "apiKey", "apiSecret"];
var messageBirdSmsProviderInputKeys = ["type", "accessKey"];
var keepCase = ["password", "apiSecret", "accessKey", "authPassword", "name", "initialToken", "smsContent", "emailSubject", "emailContent", "logoUrl"];
var deleteSmsProviderInputKeys = ["_id"];
var createSmsTemplateInputKeys = ["name", "smsContent"];
var deleteSmsTemplateInputKeys = ["_id"];
var modifySmsTemplateInputKeys = ["_id", "isDefault"];
var sendSmsInputKeys = ["_id", "smsProviderId"];
var deleteEmailProviderInputKeys = ["_id"];
var createEmailTemplateInputKeys = ["name", "emailFrom", "emailSubject", "emailContent", "logoUrl", "qrCodeRequired", "logoUrlRequired"];
var deleteEmailTemplateInputKeys = ["_id"];
var modifyEmailTemplateInputKeys = ["_id", "isDefault"];
var smtpEmailProviderInputKeys = ["type", "serverHost" ,"serverPort", "authRequired", "authUsername", "authPassword"];
var sendEmailInputKeys = ["_id", "emailProviderId"];

var usernameRegex = /^[-\w\.\$@\*\!]{5,30}$/;
var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
var telephoneRegex = /^\+[1-9]\d{4,14}$/;
var smsRegex = /^[{}A-Za-z0-9@$_\/.,"():;\-=+&%#!?<>' \n]+$/;
var urlRegex = /^(https?):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/i;

var checkStringFormat = function(input, key, regex) {
  if (!input.hasOwnProperty(key)) {
    return false;
  }
  if (!input[key]) {
    return false;
  }
  if (typeof(input[key]) !== "string") {
    return false;
  }
  if (regex.test(input[key])) {
    return input
  }
  return false;
};

var checkIdFormat = function(input, idKey) {
  if (!input.hasOwnProperty(idKey)) {
    return false;
  }
  if (!input[idKey]) {
    return false;
  }
  if (typeof(input[idKey]) !== "string") {
    return false;
  }
  try {
    var id = new ObjectId(input[idKey]);
    input[idKey] = id;
    return input;
  }
  catch(err) {
    return false;
  }
};

var checkBooleanFormat = function(input, booleanKey) {
  if (!input.hasOwnProperty(booleanKey)) {
    return false;
  }
  if (!input[booleanKey]) {
    return false;
  }
  if (typeof(input[booleanKey]) !== "string") {
    return false;
  }
  if (input[booleanKey] === "true") {
    input[booleanKey] = true;
    return input;
  }
  else if (input[booleanKey] === "false") {
    input[booleanKey] = false;
    return input;
  }
  else {
    return false;
  }
};

var checkTcpUdpPortFormat = function(input, portKey) {
  if (!input.hasOwnProperty(portKey)) {
    return false;
  }
  if (!input[portKey]) {
    return false;
  }
  if (typeof(input[portKey]) !== "string") {
    return false;
  }
  var serverPort = Number(input[portKey]);
  switch(true) {
    case typeof(serverPort) !== "number":
      return false;
    case Number.isInteger(serverPort) === false:
      return false;
    case serverPort < 1 || serverPort > 65535:
      return false;
  }
  return Object.assign({}, input, {serverPort: serverPort});
};

var checkObject = function(object, allowedKeys, requireAllKeys=true) {
  var object = Object.assign({}, object);
  var keys = Object.keys(object);
  if (keys.length > 0) {
    for (var key in object) {
      if (!object.hasOwnProperty(key)) {
        return false;
      }
      if (!object[key]) {
        return false;
      }
      if (typeof(object[key]) !== "string") {
        return false;
      }
      if (allowedKeys.indexOf(key) === -1) {
        return false;
      }
      if (keepCase.indexOf(key) === -1) {
        object[key] = object[key].toLowerCase();
      }
    }
    if (requireAllKeys) {
      if (keys.length === allowedKeys.length) {
        return object;
      }
      return false;
    }
    return object;
  }
  return false;
};

var createAdminUser = function(input) {
  return checkObject(input, createAdminUserInputKeys);
};

var loginAdminUser = function(input) {
  return checkObject(input, loginAdminUserInputKeys);
};

var createUser = function(input) {
  var resultObject = checkObject(input, createUserInputKeys);
  if (!resultObject) {
    return false;
  }
  var resultUsernameString = checkStringFormat(resultObject, "username", usernameRegex);
  if (!resultUsernameString) {
    return false;
  }
  var resultTelephoneString = checkStringFormat(resultObject, "mobileNumber", telephoneRegex);
  if (!resultTelephoneString) {
    return false;
  }
  var resultEmailString = checkStringFormat(resultObject, "email", emailRegex);
  if (!resultEmailString) {
    return false;
  }
  return resultObject;
};

var getUser = function(input) {
  var resultObject = checkObject(input, getUserInputKeys, false);
  if (!resultObject) {
    return false;
  }
  if (resultObject.hasOwnProperty("_id")) {
    var resultId = checkIdFormat(resultObject, "_id");
    if (!resultId) {
      return false;
    }
  }
  if (resultObject.hasOwnProperty("enabled")) {
    var resultEnabled = checkBooleanFormat(resultObject, "enabled");
    if (!resultEnabled) {
      return false;
    }
  }
  return resultObject;
};

var modifyUser = function(input) {
  var resultObject = checkObject(input, modifyUserInputKeys, false);
  if (!resultObject) {
    return false;
  }
  if (resultObject.hasOwnProperty("enabled")) {
    var resultObject = checkBooleanFormat(resultObject, "enabled");
    if (!resultObject) {
      return false;
    }
  }
  if (resultObject.hasOwnProperty("username")) {
    var resultUsernameString = checkStringFormat(resultObject, "username", usernameRegex);
    if (!resultUsernameString) {
      return false;
    }
  }
  if (resultObject.hasOwnProperty("mobileNumber")) {
    var resultTelephoneString = checkStringFormat(resultObject, "mobileNumber", telephoneRegex);
    if (!resultTelephoneString) {
      return false;
    }
  }
  if (resultObject.hasOwnProperty("email")) {
    var resultEmailString = checkStringFormat(resultObject, "email", emailRegex);
    if (!resultEmailString) {
      return false;
    }
  }
  return resultObject;
};

var deleteUser = function(input) {
  var resultObject = checkObject(input, deleteUserInputKeys);
  if (!resultObject) {
    return false;
  }
  var resultId = checkIdFormat(resultObject, "_id");
  return resultId;
};

var createSmsProvider = function(input) {
  input = Object.assign({}, input);
  if (input.hasOwnProperty("type") && input.type && typeof(input.type) === "string") {
    switch(input.type) {
      case "nexmo":
        return checkObject(input, nexmoSmsProviderInputKeys);
      case "messagebird":
        return checkObject(input, messageBirdSmsProviderInputKeys);
      default:
        return false;
    }
  }
  return false;
};

var deleteSmsProvider = function(input) {
  var resultObject = checkObject(input, deleteSmsProviderInputKeys);
  if (!resultObject) {
    return false;
  }
  var resultId = checkIdFormat(resultObject, "_id");
  return resultId;
};

var createSmsTemplate = function(input) {
  var resultObject = checkObject(input, createSmsTemplateInputKeys);
  if (!resultObject) {
    return false;
  }
  if (resultObject.smsContent.length > 0 && resultObject.smsContent.length <= 160) {
    var resultSmsString = checkStringFormat(resultObject, "smsContent", smsRegex);
    if (!resultSmsString) {
      return false;
    }
  }
  else {
    return false;
  }
  return resultObject;
};

var deleteSmsTemplate = function(input) {
  var resultObject = checkObject(input, deleteSmsTemplateInputKeys);
  if (!resultObject) {
    return false;
  }
  var resultId = checkIdFormat(resultObject, "_id");
  return resultId;
};

var modifySmsTemplate = function(input) {
  var resultObject = checkObject(input, modifySmsTemplateInputKeys);
  if (!resultObject) {
    return false;
  }
  var resultSmsTemplateId = checkIdFormat(resultObject, "_id");
  if (!resultSmsTemplateId) {
    return false;
  }
  var resultSmsTemplate = checkBooleanFormat(resultSmsTemplateId, "isDefault");
  if (!resultSmsTemplate) {
    return false;
  }
  return resultSmsTemplate;
};

var sendSms = function(input) {
  var resultObject = checkObject(input, sendSmsInputKeys);
  if (!resultObject) {
    return false;
  }
  var resultUserId = checkIdFormat(resultObject, "_id");
  if (!resultUserId) {
    return false;
  }
  var resultSmsProviderId = checkIdFormat(resultUserId, "smsProviderId");
  if (!resultSmsProviderId) {
    return false;
  }
  return resultSmsProviderId;
};

var createEmailProvider = function(input) {
  input = Object.assign({}, input);
  if (input.hasOwnProperty("type") && input.type && typeof(input.type) === "string") {
    switch(input.type) {
      case "smtp":
        var resultObject = checkObject(input, smtpEmailProviderInputKeys);
        if (resultObject) {
          var resultObjectBoolean = checkBooleanFormat(resultObject, "authRequired");
          if (resultObjectBoolean) {
            return checkTcpUdpPortFormat(resultObjectBoolean, "serverPort");
          }
        }
        return false;
      default:
        return false;
    }
  }
  else {
    return false;
  }
};

var deleteEmailProvider = function(input) {
  var resultObject = checkObject(input, deleteEmailProviderInputKeys);
  if (!resultObject) {
    return false;
  }
  var resultId = checkIdFormat(resultObject, "_id");
  return resultId;
};

var createEmailTemplate = function(input) {
  var resultObject = checkObject(input, createEmailTemplateInputKeys);
  if (!resultObject) {
    return false;
  }
  var resultBool = checkBooleanFormat(resultObject, "qrCodeRequired") && checkBooleanFormat(resultObject, "logoUrlRequired");
  if (!resultBool) {
    return false;
  }
  if (resultBool.logoUrlRequired) {
    var resultUrlString = checkStringFormat(resultBool, "logoUrl", urlRegex);
  }
  else {
    var resultUrlString = resultBool;
  }
  if (!resultUrlString) {
    return false;
  }
  var resultFromEmailString = checkStringFormat(resultUrlString, "emailFrom", emailRegex);
  if (!resultFromEmailString) {
    return false;
  }
  if (resultFromEmailString.emailContent.length > 0 && resultFromEmailString.emailContent.length <= 1000) {
    var resultEmailString = resultFromEmailString;
    return resultEmailString;
  }
  else {
    return false;
  }
};

var deleteEmailTemplate = function(input) {
  var resultObject = checkObject(input, deleteEmailTemplateInputKeys);
  if (!resultObject) {
    return false;
  }
  var resultId = checkIdFormat(resultObject, "_id");
  return resultId;
};

var modifyEmailTemplate = function(input) {
  var resultObject = checkObject(input, modifyEmailTemplateInputKeys);
  if (!resultObject) {
    return false;
  }
  var resultEmailTemplateId = checkIdFormat(resultObject, "_id");
  if (!resultEmailTemplateId) {
    return false;
  }
  var resultEmailTemplate = checkBooleanFormat(resultEmailTemplateId, "isDefault");
  if (!resultEmailTemplate) {
    return false;
  }
  return resultEmailTemplate;
};

var sendEmail = function(input) {
  var resultObject = checkObject(input, sendEmailInputKeys);
  if (!resultObject) {
    return false;
  }
  var resultUserId = checkIdFormat(resultObject, "_id");
  if (!resultUserId) {
    return false;
  }
  var resultEmailProviderId = checkIdFormat(resultUserId, "emailProviderId");
  if (!resultEmailProviderId) {
    return false;
  }
  return resultEmailProviderId;
};

module.exports = {
  checkIdFormat: checkIdFormat,
  createAdminUser: createAdminUser,
  loginAdminUser: loginAdminUser,
  createUser: createUser,
  getUser: getUser,
  modifyUser: modifyUser,
  deleteUser: deleteUser,
  createSmsProvider: createSmsProvider,
  deleteSmsProvider: deleteSmsProvider,
  createSmsTemplate: createSmsTemplate,
  deleteSmsTemplate: deleteSmsTemplate,
  modifySmsTemplate: modifySmsTemplate,
  sendSms: sendSms,
  createEmailProvider: createEmailProvider,
  deleteEmailProvider: deleteEmailProvider,
  createEmailTemplate: createEmailTemplate,
  deleteEmailTemplate: deleteEmailTemplate,
  modifyEmailTemplate: modifyEmailTemplate,
  sendEmail: sendEmail
};

var bcrypt = require("bcrypt");
var ObjectId = require("mongodb").ObjectId;
var fs = require("fs");
var moment = require("moment");

var imageUserpath = __dirname + "/public/images/users/";
var adminUsersCollection = "admins";
var usersCollection = "users";
var smsProvidersCollection = "smsProviders";
var smsTemplatesCollection = "smsTemplates";
var emailProvidersCollection = "emailProviders";
var emailTemplatesCollection = "emailTemplates";

var insertOne = function(db, collection, insertObject, cb) {
  db.collection(collection).insertOne(insertObject, function(err, document) {
    if (err) {
      return cb({
        err: err,
        document: null
      });
    }
    if (!document) {
      return cb({
        err: null,
        document: null
      });
    }
    return cb({
      err: null,
      document: document.ops[0]
    });
  });
};

var findOne = function(db, collection, findObject, cb) {
  db.collection(collection).findOne(findObject, function(err, document) {
    if (err) {
      return cb({
        err: err,
        document: null
      });
    }
    if (!document) {
      return cb({
        err: null,
        document: null
      });
    }
    return cb({
      err: null,
      document: document
    });
  });
};

var findMany = function(db, collection, optionParams, cb) {
  db.collection(collection).aggregate(optionParams).toArray(function(err, document) {
    if (err) {
      return cb({
        err: err,
        document: null
      });
    }
    if (!document) {
      return cb({
        err: null,
        document: null
      });
    }
    return cb({
      err: null,
      document: document
    });
  });
};

var updateOne = function(db, collection, queryObject, updateObject, optionsObject, cb) {
  db.collection(collection).findAndModify(
    queryObject,
    {},
    updateObject,
    optionsObject,
    function(err, document) {
      if (err) {
        return cb({
          err: err,
          document: null
        });
      }
      if (!document) {
        return cb({
          err: null,
          document: null
        });
      }
      return cb({
        err: null,
        document: document.value
      });
    }
  );
};

var deleteOne = function(db, collection, deleteObject, cb) {
  db.collection(collection).deleteOne(deleteObject, function(err, document) {
    if (err) {
      return cb({
        err: err,
        document: null
      });
    }
    if (!document) {
      return cb({
        err: null,
        document: null
      });
    }
    if (document.result.n === 1) {
      return cb({
        err: null,
        document: {
          result: "success"
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
};

var getCollectionCount = function(db, collection, cb) {
  db.collection(collection).countDocuments(function(err, count) {
    if (err) {
      return cb({
        err: err,
        document: null
      });
    }
    if (count >= 0) {
      return cb({
        err: null,
        document: String(count)
      });
    }
    else {
      return cb({
        err: null,
        document: null
      });
    }
  });
};

var authenticateAdminUser = function(db, username, password, cb) {
  findOne(db, adminUsersCollection, {username: username}, function(result) {
    if (result.err) {
      return cb(result);
    }
    if (!result.document) {
      return cb(result);
    }
    bcrypt.compare(password, result.document.password, function(err, res) {
      if (err) {
        return cb({
          err: err,
          document: null
        });
      }
      if (!res) {
        return cb({
          err: null,
          document: null
        });
      }
      if (res) {
        return cb({
          err: null,
          document: {
            _id: result.document._id,
            username: result.document.username
          }
        });
      }
    });
  });
};

var findAdminUser = function(db, userId, cb) {
  findOne(db, adminUsersCollection, {_id: new ObjectId(userId)}, cb);
};

var createAdminUser = function(db, adminUserInput, cb) {
  insertOne(db, adminUsersCollection, adminUserInput, cb);
}

var createUser = function(db, userInput, cb) {
  findOne(db, usersCollection, {username: userInput.username}, function(result) {
    if (result.err) {
      return cb(result);
    }
    if (result.document) {
      return cb({
        err: null,
        status: 409,
        document: "Resource already exists"
      });
    }
    userInput.enabled = true;
    userInput.password = null;
    userInput.createdAt = Date.now();
    userInput.lastLoginAt = null;
    insertOne(db, usersCollection, userInput, cb);
  });
};

var getUsers = function(db, cb) {
  var optionParams = [
    {
      $match: {}
    },
    {
      $sort: {
        lastName: 1
      }
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        username: 1,
        email: 1,
        mobileNumber: 1,
        enabled: 1,
        _id: 1,
        createdAt: 1,
        lastLoginAt: 1
      }
    }
  ];
  findMany(db, usersCollection, optionParams, cb);
};

var getUsersQuery = function(db, userInput, cb) {
  var optionParams = [
    {
      $match: userInput
    },
    {
      $sort: {
        lastName: 1
      }
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        username: 1,
        email: 1,
        mobileNumber: 1,
        enabled: 1,
        _id: 1,
        createdAt: 1,
        lastLoginAt: 1
      }
    }
  ];
  findMany(db, usersCollection, optionParams, cb);
};

var getUser = function(db, userInput, cb) {
  findOne(db, usersCollection, userInput, cb);
};

var modifyUser = function(db, findQuery, modifyParams, cb) {
  if (modifyParams.hasOwnProperty("username")) {
    findOne(db, usersCollection, {username: modifyParams.username}, function(result) {
      if (result.err) {
        return cb(result);
      }
      if (result.document) {
        return cb({
          err: null,
          status: 409,
          document: "Resource already exists"
        });
      }
      var updateParams = {
        $set: modifyParams
      };
      updateOne(db, usersCollection, findQuery, updateParams, {new: true}, cb);
    });
  }
  else {
    var updateParams = {
      $set: modifyParams
    };
    updateOne(db, usersCollection, findQuery, updateParams, {new: true}, cb);
  }
};

var deleteUser = function(db, userInput, cb) {
  var id = userInput._id;
  fs.unlink(imageUserpath + id + ".png", function(err) {
    if (err) {
      if (err.code === "ENOENT") {
        console.log(moment().toISOString() + " - [Filesystem] User image cannot be deleted. File does not exist");
      }
      else {
        console.log(moment().toISOString() + " - [Filesystem] User image cannot be deleted due to an error: " + err.code);
      }
    }
    else {
      console.log(moment().toISOString() + " - [Filesystem] User image deleted");
    }
    deleteOne(db, usersCollection, userInput, cb);
  });
};

var getSmsProviders = function(db, cb) {
  var optionParams = [
    {
      $match: {}
    }
  ];
  findMany(db, smsProvidersCollection, optionParams, cb);
};

var createSmsProvider = function(db, createSmsProviderInput, cb) {
  insertOne(db, smsProvidersCollection, createSmsProviderInput, cb);
};

var deleteSmsProvider = function(db, smsProviderInput, cb) {
  deleteOne(db, smsProvidersCollection, smsProviderInput, cb);
};

var getSmsTemplates = function(db, cb) {
  var optionParams = [
    {
      $match: {}
    }
  ];
  findMany(db, smsTemplatesCollection, optionParams, cb);
};

var modifyTemplate = function(db, templateType, modifyTemplateInput, cb) {
  var templateId = modifyTemplateInput._id;
  if (modifyTemplateInput.hasOwnProperty("isDefault") && modifyTemplateInput.isDefault === true) {
    switch(templateType) {
      case "email":
        var getTemplates = getEmailTemplates;
        var templatesCollection = emailTemplatesCollection;
        break;
      case "SMS":
        var getTemplates = getSmsTemplates;
        var templatesCollection = smsTemplatesCollection;
        break;
    }
    getTemplates(db, function(templates) {
      var filterTemplates = templates.document.filter(function(template) {
        return template.isDefault === true && template._id !== templateId;
      });
      if (filterTemplates.length >= 1) {
        var modifyParams = Object.assign({}, modifyTemplateInput, {});
        delete modifyParams._id;
        var updateParams = {
          $set: modifyParams
        };
        updateOne(db, templatesCollection, {_id: templateId}, updateParams, {new: true}, function(newTemplateModifyResult) {
          if (newTemplateModifyResult.err) {
            return cb({
              err: newTemplateModifyResult.err,
              document: null
            });
          }
          if (!newTemplateModifyResult.document) {
            return cb({
              err: null,
              document: null
            });
          }
          var updateParams = {
            $set: {
              isDefault: false
            }
          };
          filterTemplates.forEach(function(template) {
            var originalTemplateId = template._id;
            var updateParams = {
              $set: {
                isDefault: false
              }
            };
            updateOne(db, templatesCollection, {_id: originalTemplateId}, updateParams, {new: true}, function(originalTemplateModifyResult) {
              if (originalTemplateModifyResult.err) {
                console.log(moment().toISOString() + " - [MongoDB] Error: Could not update " + templateType + " Template Id: " + originalTemplateId);
              }
              else if (!originalTemplateModifyResult.document) {
                console.log(moment().toISOString() + " - [MongoDB] Could not find " + templateType + " Template Id: " + originalTemplateId);
              }
              else {
                console.log(moment().toISOString() + " - [MongoDB] Updated " + templateType + " Template Id: " + originalTemplateId + " - " + JSON.stringify(updateParams));
              }
            });
          });
          return cb({
            err: null,
            document: newTemplateModifyResult.document
          });
        });
      }
      else {
        var modifyParams = Object.assign({}, modifyTemplateInput, {});
        delete modifyParams._id;
        var updateParams = {
          $set: modifyParams
        };
        updateOne(db, templatesCollection, {_id: templateId}, updateParams, {new: true}, cb);
      }
    });
  }
};

var createSmsTemplate = function(db, createSmsTemplateInput, cb) {
  getSmsTemplates(db, function(result) {
    if (result.err) {
      return cb({
        err: err,
        document: null
      });
    }
    if (!result.document) {
      return cb({
        err: null,
        document: null
      });
    }
    if (result.document.length === 0) {
      createSmsTemplateInput.isDefault = true;
      createSmsTemplateInput.createdAt = Date.now();
      insertOne(db, smsTemplatesCollection, createSmsTemplateInput, cb);
      return;
    }
    else {
      createSmsTemplateInput.isDefault = false;
      createSmsTemplateInput.createdAt = Date.now();
      insertOne(db, smsTemplatesCollection, createSmsTemplateInput, cb);
      return;
    }
  });
};

var deleteSmsTemplate = function(db, smsTemplateInput, cb) {
  deleteOne(db, smsTemplatesCollection, smsTemplateInput, cb);
};

var modifySmsTemplate = function(db, modifySmsTemplateInput, cb) {
  modifyTemplate(db, "SMS", modifySmsTemplateInput, cb);
};

var getEmailProviders = function(db, cb) {
  var optionParams = [
    {
      $match: {}
    }
  ];
  findMany(db, emailProvidersCollection, optionParams, cb);
};

var createEmailProvider = function(db, createEmailProviderInput, cb) {
  insertOne(db, emailProvidersCollection, createEmailProviderInput, cb);
};

var deleteEmailProvider = function(db, emailProviderInput, cb) {
  deleteOne(db, emailProvidersCollection, emailProviderInput, cb);
};

var getEmailTemplates = function(db, cb) {
  var optionParams = [
    {
      $match: {}
    }
  ];
  findMany(db, emailTemplatesCollection, optionParams, cb);
};

var createEmailTemplate = function(db, createEmailTemplateInput, cb) {
  getEmailTemplates(db, function(result) {
    if (result.err) {
      return cb({
        err: err,
        document: null
      });
    }
    if (!result.document) {
      return cb({
        err: null,
        document: null
      });
    }
    if (result.document.length === 0) {
      createEmailTemplateInput.isDefault = true;
      createEmailTemplateInput.createdAt = Date.now();
      insertOne(db, emailTemplatesCollection, createEmailTemplateInput, cb);
      return;
    }
    else {
      createEmailTemplateInput.isDefault = false;
      createEmailTemplateInput.createdAt = Date.now();
      insertOne(db, emailTemplatesCollection, createEmailTemplateInput, cb);
      return;
    }
  });
};

var deleteEmailTemplate = function(db, emailTemplateInput, cb) {
  deleteOne(db, emailTemplatesCollection, emailTemplateInput, cb);
};

var modifyEmailTemplate = function(db, modifyEmailTemplateInput, cb) {
  modifyTemplate(db, "email", modifyEmailTemplateInput, cb);
};

module.exports = {
  getCollectionCount: getCollectionCount,
  authenticateAdminUser: authenticateAdminUser,
  findAdminUser: findAdminUser,
  createAdminUser: createAdminUser,
  createUser: createUser,
  getUsers: getUsers,
  getUsersQuery: getUsersQuery,
  getUser: getUser,
  modifyUser: modifyUser,
  deleteUser: deleteUser,
  getSmsProviders: getSmsProviders,
  createSmsProvider: createSmsProvider,
  deleteSmsProvider: deleteSmsProvider,
  getSmsTemplates: getSmsTemplates,
  createSmsTemplate: createSmsTemplate,
  deleteSmsTemplate: deleteSmsTemplate,
  modifySmsTemplate: modifySmsTemplate,
  getEmailProviders: getEmailProviders,
  createEmailProvider: createEmailProvider,
  deleteEmailProvider: deleteEmailProvider,
  getEmailTemplates: getEmailTemplates,
  createEmailTemplate: createEmailTemplate,
  deleteEmailTemplate: deleteEmailTemplate,
  modifyEmailTemplate: modifyEmailTemplate
};

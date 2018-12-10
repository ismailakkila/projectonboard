var apiClient = require("./apiClient");
var verifyInput = require("./verifyInput");
var updateAddEmailProviderActionCreator = require("./addEmailProviderViewReducer").updateAddEmailProviderActionCreator;
var updateAddEmailTemplateActionCreator = require("./addEmailTemplateViewReducer").updateAddEmailTemplateActionCreator;

var UPDATEEMAILPROVIDERS = "UPDATEEMAILPROVIDERS";
var UPDATEEMAILTEMPLATES = "UPDATEEMAILTEMPLATES";
var UPDATESENDEMAIL = "UPDATESENDEMAIL";

var createEmailProviderCallback = function(dispatch) {
  return function(createEmailProviderResult) {
    dispatch(updateAddEmailProviderActionCreator(createEmailProviderResult));
    if (createEmailProviderResult.status === 200) {
      apiClient.getEmailProviders(function(getEmailProvidersResult) {
        if (getEmailProvidersResult.status === 200) {
          dispatch(updateEmailProvidersActionCreator(getEmailProvidersResult.message.document));
        }
      });
    }
  }
};

var deleteEmailProviderCallback = function(dispatch) {
  return function(deleteEmailProviderResult) {
    if (deleteEmailProviderResult.status === 200) {
      apiClient.getEmailProviders(function(getEmailProvidersResult) {
        if (getEmailProvidersResult.status === 200) {
          dispatch(updateEmailProvidersActionCreator(getEmailProvidersResult.message.document));
        }
      });
    }
  }
};

var createEmailTemplateCallback = function(dispatch) {
  return function(createEmailTemplateResult) {
    dispatch(updateAddEmailTemplateActionCreator(createEmailTemplateResult));
    if (createEmailTemplateResult.status === 200) {
      apiClient.getEmailTemplates(function(getEmailTemplatesResult) {
        if (getEmailTemplatesResult.status === 200) {
          dispatch(updateEmailTemplatesActionCreator(getEmailTemplatesResult.message.document));
        }
      });
    }
  }
};

var deleteEmailTemplateCallback = function(dispatch) {
  return function(deleteEmailTemplateResult) {
    if (deleteEmailTemplateResult.status === 200) {
      apiClient.getEmailTemplates(function(getEmailTemplatesResult) {
        if (getEmailTemplatesResult.status === 200) {
          dispatch(updateEmailTemplatesActionCreator(getEmailTemplatesResult.message.document));
        }
      });
    }
  }
};

var modifyEmailTemplateCallback = function(dispatch) {
  return function(modifyEmailTemplateResult) {
    if (modifyEmailTemplateResult.status === 200) {
      apiClient.getEmailTemplates(function(getEmailTemplatesResult) {
        if (getEmailTemplatesResult.status === 200) {
          dispatch(updateEmailTemplatesActionCreator(getEmailTemplatesResult.message.document));
        }
      });
    }
  }
};

var sendEmailCallback = function(dispatch) {
  return function(sendEmailResult) {
    if (sendEmailResult.status === 200) {
      dispatch(updateEmailSendResultActionCreator(sendEmailResult.message.document));
      setTimeout(function() {
        dispatch(updateEmailSendResultActionCreator(sendEmailResult.message.document));
      }, 5000);
    }
  }
};

var updateEmailProvidersActionCreator = function(emailProviders) {
  return {
    type: UPDATEEMAILPROVIDERS,
    emailProviders: emailProviders
  };
};

var updateEmailTemplatesActionCreator = function(emailTemplates) {
  return {
    type: UPDATEEMAILTEMPLATES,
    emailTemplates: emailTemplates
  };
};

var updateEmailSendResultActionCreator = function(emailSendResult) {
  return {
    type: UPDATESENDEMAIL,
    emailSendResult: emailSendResult
  };
};

var emailReducer = function(state={emailProviders: [], emailTemplates: [], emailSendResult: []}, action) {
  switch(action.type) {
    case UPDATEEMAILPROVIDERS:
      return Object.assign({}, state, {emailProviders: action.emailProviders});
    case UPDATEEMAILTEMPLATES:
      return Object.assign({}, state, {emailTemplates: action.emailTemplates});
    case UPDATESENDEMAIL:
      var indexResult;
      var emailSendResult = state.emailSendResult.filter(function(result, index) {
        if (result.userId === action.emailSendResult.userId) {
          indexResult = index;
          return true;
        }
      });
      if (emailSendResult.length === 0) {
        return Object.assign({}, state, {emailSendResult: state.emailSendResult.concat([action.emailSendResult])});
      }
      if (emailSendResult.length === 1) {
        var newEmailSendResult = state.emailSendResult.slice(0, indexResult).concat(state.emailSendResult.slice(indexResult + 1,));
        return Object.assign({}, state, {emailSendResult: newEmailSendResult});
      }
    default:
      return state;
  }
};

var getEmailProviders = function() {
  return function(dispatch) {
    apiClient.getEmailProviders(function(result) {
      if (result.status === 200) {
        dispatch(updateEmailProvidersActionCreator(result.message.document));
      }
    });
  };
};

var createEmailProvider = function(input) {
  return function(dispatch) {
    input = verifyInput.createEmailProvider(input);
    if (input) {
      apiClient.createEmailProvider(input, createEmailProviderCallback(dispatch));
    }
  }
};

var deleteEmailProvider = function(input) {
  return function(dispatch) {
    input = verifyInput.deleteEmailProvider(input);
    if (input) {
      var id = input._id;
      apiClient.deleteEmailProvider(id, deleteEmailProviderCallback(dispatch));
    }
  };
};

var getEmailTemplates = function() {
  return function(dispatch) {
    apiClient.getEmailTemplates(function(result) {
      if (result.status === 200) {
        dispatch(updateEmailTemplatesActionCreator(result.message.document));
      }
    });
  };
};

var createEmailTemplate = function(input) {
  return function(dispatch) {
    input = verifyInput.createEmailTemplate(input);
    if (input) {
      apiClient.createEmailTemplate(input, createEmailTemplateCallback(dispatch));
    }
  }
};

var deleteEmailTemplate = function(input) {
  return function(dispatch) {
    input = verifyInput.deleteEmailTemplate(input);
    if (input) {
      var id = input._id;
      apiClient.deleteEmailTemplate(id, deleteEmailTemplateCallback(dispatch));
    }
  };
};

var modifyEmailTemplate = function(input) {
  return function(dispatch) {
    input = verifyInput.modifyEmailTemplate(input);
    if (input) {
      apiClient.modifyEmailTemplate(input, modifyEmailTemplateCallback(dispatch));
    }
  }
};

var sendEmail = function(input) {
  return function(dispatch) {
    input = verifyInput.sendEmail(input);
    if (input) {
      var userId = input._id;
      var emailProviderId = input.emailProviderId;
      apiClient.sendEmail(String(userId), {emailProviderId: emailProviderId}, sendEmailCallback(dispatch));
    }
  }
};

module.exports = {
  emailReducer: emailReducer,
  getEmailProviders: getEmailProviders,
  createEmailProvider: createEmailProvider,
  deleteEmailProvider: deleteEmailProvider,
  getEmailTemplates: getEmailTemplates,
  createEmailTemplate: createEmailTemplate,
  deleteEmailTemplate: deleteEmailTemplate,
  modifyEmailTemplate: modifyEmailTemplate,
  sendEmail: sendEmail
};

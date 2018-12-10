var apiClient = require("./apiClient");
var verifyInput = require("./verifyInput");
var updateAddSmsProviderActionCreator = require("./addSmsProviderViewReducer").updateAddSmsProviderActionCreator;
var updateAddSmsTemplateActionCreator = require("./addSmsTemplateViewReducer").updateAddSmsTemplateActionCreator;

var UPDATESMSPROVIDERS = "UPDATESMSPROVIDERS";
var UPDATESMSTEMPLATES = "UPDATESMSTEMPLATES";
var UPDATESENDSMS = "UPDATESENDSMS";

var createSmsProviderCallback = function(dispatch) {
  return function(createSmsProviderResult) {
    dispatch(updateAddSmsProviderActionCreator(createSmsProviderResult));
    if (createSmsProviderResult.status === 200) {
      apiClient.getSmsProviders(function(getSmsProvidersResult) {
        if (getSmsProvidersResult.status === 200) {
          dispatch(updateSmsProvidersActionCreator(getSmsProvidersResult.message.document));
        }
      });
    }
  }
};

var deleteSmsProviderCallback = function(dispatch) {
  return function(deleteSmsProviderResult) {
    if (deleteSmsProviderResult.status === 200) {
      apiClient.getSmsProviders(function(getSmsProvidersResult) {
        if (getSmsProvidersResult.status === 200) {
          dispatch(updateSmsProvidersActionCreator(getSmsProvidersResult.message.document));
        }
      });
    }
  }
};

var createSmsTemplateCallback = function(dispatch) {
  return function(createSmsTemplateResult) {
    dispatch(updateAddSmsTemplateActionCreator(createSmsTemplateResult));
    if (createSmsTemplateResult.status === 200) {
      apiClient.getSmsTemplates(function(getSmsTemplatesResult) {
        if (getSmsTemplatesResult.status === 200) {
          dispatch(updateSmsTemplatesActionCreator(getSmsTemplatesResult.message.document));
        }
      });
    }
  }
};

var deleteSmsTemplateCallback = function(dispatch) {
  return function(deleteSmsTemplateResult) {
    if (deleteSmsTemplateResult.status === 200) {
      apiClient.getSmsTemplates(function(getSmsTemplatesResult) {
        if (getSmsTemplatesResult.status === 200) {
          dispatch(updateSmsTemplatesActionCreator(getSmsTemplatesResult.message.document));
        }
      });
    }
  }
};

var modifySmsTemplateCallback = function(dispatch) {
  return function(modifySmsTemplateResult) {
    if (modifySmsTemplateResult.status === 200) {
      apiClient.getSmsTemplates(function(getSmsTemplatesResult) {
        if (getSmsTemplatesResult.status === 200) {
          dispatch(updateSmsTemplatesActionCreator(getSmsTemplatesResult.message.document));
        }
      });
    }
  }
};

var sendSmsCallback = function(dispatch) {
  return function(sendSmsResult) {
    if (sendSmsResult.status === 200) {
      dispatch(updateSmsSendResultActionCreator(sendSmsResult.message.document));
      setTimeout(function() {
        dispatch(updateSmsSendResultActionCreator(sendSmsResult.message.document));
      }, 5000);
    }
  }
};

var updateSmsProvidersActionCreator = function(smsProviders) {
  return {
    type: UPDATESMSPROVIDERS,
    smsProviders: smsProviders
  };
};

var updateSmsTemplatesActionCreator = function(smsTemplates) {
  return {
    type: UPDATESMSTEMPLATES,
    smsTemplates: smsTemplates
  };
};

var updateSmsSendResultActionCreator = function(smsSendResult) {
  return {
    type: UPDATESENDSMS,
    smsSendResult: smsSendResult
  };
};

var smsReducer = function(state={smsProviders: [], smsTemplates: [], smsSendResult: []}, action) {
  switch(action.type) {
    case UPDATESMSPROVIDERS:
      return Object.assign({}, state, {smsProviders: action.smsProviders});
    case UPDATESMSTEMPLATES:
      return Object.assign({}, state, {smsTemplates: action.smsTemplates});
    case UPDATESENDSMS:
      var indexResult;
      var smsSendResult = state.smsSendResult.filter(function(result, index) {
        if (result.userId === action.smsSendResult.userId) {
          indexResult = index;
          return true;
        }
      });
      if (smsSendResult.length === 0) {
        return Object.assign({}, state, {smsSendResult: state.smsSendResult.concat([action.smsSendResult])});
      }
      if (smsSendResult.length === 1) {
        var newSmsSendResult = state.smsSendResult.slice(0, indexResult).concat(state.smsSendResult.slice(indexResult + 1));
        return Object.assign({}, state, {smsSendResult: newSmsSendResult});
      }
    default:
      return state;
  }
};

var getSmsProviders = function() {
  return function(dispatch) {
    apiClient.getSmsProviders(function(result) {
      if (result.status === 200) {
        dispatch(updateSmsProvidersActionCreator(result.message.document));
      }
    });
  };
};

var createSmsProvider = function(input) {
  return function(dispatch) {
    input = verifyInput.createSmsProvider(input);
    if (input) {
      apiClient.createSmsProvider(input, createSmsProviderCallback(dispatch));
    }
  }
};

var deleteSmsProvider = function(input) {
  return function(dispatch) {
    input = verifyInput.deleteSmsProvider(input);
    if (input) {
      var id = input._id;
      apiClient.deleteSmsProvider(id, deleteSmsProviderCallback(dispatch));
    }
  };
};

var getSmsTemplates = function() {
  return function(dispatch) {
    apiClient.getSmsTemplates(function(result) {
      if (result.status === 200) {
        dispatch(updateSmsTemplatesActionCreator(result.message.document));
      }
    });
  };
};

var createSmsTemplate = function(input) {
  return function(dispatch) {
    input = verifyInput.createSmsTemplate(input);
    if (input) {
      apiClient.createSmsTemplate(input, createSmsTemplateCallback(dispatch));
    }
  }
};

var deleteSmsTemplate = function(input) {
  return function(dispatch) {
    input = verifyInput.deleteSmsTemplate(input);
    if (input) {
      var id = input._id;
      apiClient.deleteSmsTemplate(id, deleteSmsTemplateCallback(dispatch));
    }
  };
};

var modifySmsTemplate = function(input) {
  return function(dispatch) {
    input = verifyInput.modifySmsTemplate(input);
    if (input) {
      apiClient.modifySmsTemplate(input, modifySmsTemplateCallback(dispatch));
    }
  }
};

var sendSms = function(input) {
  return function(dispatch) {
    input = verifyInput.sendSms(input);
    if (input) {
      var userId = input._id;
      var smsProviderId = input.smsProviderId;
      apiClient.sendSms(String(userId), {smsProviderId: smsProviderId}, sendSmsCallback(dispatch));
    }
  }
};

module.exports = {
  smsReducer: smsReducer,
  getSmsProviders: getSmsProviders,
  createSmsProvider: createSmsProvider,
  deleteSmsProvider: deleteSmsProvider,
  getSmsTemplates: getSmsTemplates,
  createSmsTemplate: createSmsTemplate,
  deleteSmsTemplate: deleteSmsTemplate,
  modifySmsTemplate: modifySmsTemplate,
  sendSms: sendSms
};

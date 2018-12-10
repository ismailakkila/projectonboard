var apiClient = require("./apiClient");
var verifyInput = require("./verifyInput");

var UPDATEAUTH = "UPDATEAUTH";

var updateAuthActionCreator = function(authStatus) {
  return {
    type: UPDATEAUTH,
    authStatus: authStatus
  };
};

var authReducer = function(state={authenticated: null, adminUser: null, validCredentials: null}, action) {
  switch(action.type) {
    case UPDATEAUTH:
      return Object.assign({}, state, action.authStatus);
    default:
      return state;
  }
};

var loginAdminUser = function(input) {
  return function(dispatch) {
    input = verifyInput.loginAdminUser(input);
    if (input) {
      apiClient.loginAdminUser(input, function(result) {
        if (result.status === 200) {
          dispatch(updateAuthActionCreator(result.message));
          return;
        }
        else if (result.status === 401) {
          dispatch(updateAuthActionCreator({authenticated: false, adminUser: null, validCredentials: false}));
          return;
        }
      });
    }
  };
};

var logoutAdminUser = function() {
  return function(dispatch) {
    apiClient.logoutAdminUser(function(result) {
      if (result.status === 200) {
        dispatch(updateAuthActionCreator(result.message));
        return;
      }
    });
  };
};

var getAdminUserLoginStatus = function() {
  return function(dispatch) {
    apiClient.getAdminUserLoginStatus(function(result) {
      if (result.status === 200) {
        dispatch(updateAuthActionCreator(result.message));
        return;
      }
      else if (result.status === 401) {
        dispatch(updateAuthActionCreator({authenticated: false, adminUser: null, validCredentials: null}));
        return;
      }
    });
  };
};

module.exports = {
  authReducer: authReducer,
  loginAdminUser: loginAdminUser,
  logoutAdminUser: logoutAdminUser,
  getAdminUserLoginStatus: getAdminUserLoginStatus
};

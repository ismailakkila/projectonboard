var apiClient = require("./apiClient");
var verifyInput = require("./verifyInput");

var RESETADMIN = "RESETADMIN";
var DISABLERESETADMIN = "DISABLERESETADMIN";

var resetAdminActionCreator = function() {
  return {
    type: RESETADMIN
  };
};

var disableResetAdminActionCreator = function() {
  return {
    type: DISABLERESETADMIN
  };
};

var resetAdminReducer = function(state=null, action) {
  switch(action.type) {
    case RESETADMIN:
      return true;
    case DISABLERESETADMIN:
      return false;
    default:
      return state;
  }
};

var getAdminCount = function() {
  return function(dispatch) {
    apiClient.getAdminCount(function(result) {
      if (result.status === 200) {
        var count = Number(result.message.document);
        if (count === 0) {
          dispatch(resetAdminActionCreator());
          return;
        }
        else if (count > 0) {
          dispatch(disableResetAdminActionCreator());
          return;
        }
      }
    });
  };
};

var createAdminUser = function(input) {
  return function(dispatch) {
    input = verifyInput.createAdminUser(input);
    if (input) {
      apiClient.createAdminUser(input, function(result) {
        if (result.status === 200) {
          dispatch(disableResetAdminActionCreator());
          return;
        }
      });
    }
  };
};


module.exports = {
  resetAdminReducer: resetAdminReducer,
  getAdminCount: getAdminCount,
  createAdminUser: createAdminUser
};

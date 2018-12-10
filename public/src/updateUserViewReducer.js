var UPDATEMODIFYUSER = "UPDATEMODIFYUSER";

var updateModifyUserActionCreator = function(result) {
  return {
    type: UPDATEMODIFYUSER,
    result: result
  }
};

var updateUserViewReducer = function(state=null, action) {
  switch(action.type) {
    case UPDATEMODIFYUSER:
      return action.result;
    default:
      return state;
  }
};

var resetUpdateUserView = function() {
  return function(dispatch) {
    dispatch(updateModifyUserActionCreator(null));
  }
};

module.exports = {
  updateUserViewReducer: updateUserViewReducer,
  updateModifyUserActionCreator: updateModifyUserActionCreator,
  resetUpdateUserView: resetUpdateUserView
};

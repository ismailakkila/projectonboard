var UPDATEADDUSER = "UPDATEADDUSER";

var updateAddUserActionCreator = function(result) {
  return {
    type: UPDATEADDUSER,
    result: result
  }
};

var addUserViewReducer = function(state=null, action) {
  switch(action.type) {
    case UPDATEADDUSER:
      return action.result;
    default:
      return state;
  }
};

var resetAddUserView = function() {
  return function(dispatch) {
    dispatch(updateAddUserActionCreator(null));
  }
};

module.exports = {
  addUserViewReducer: addUserViewReducer,
  updateAddUserActionCreator: updateAddUserActionCreator,
  resetAddUserView: resetAddUserView
};

var UPDATEADDSMSPROVIDER = "UPDATEADDSMSPROVIDER";

var updateAddSmsProviderActionCreator = function(result) {
  return {
    type: UPDATEADDSMSPROVIDER,
    result: result
  }
};

var addSmsProviderViewReducer = function(state=null, action) {
  switch(action.type) {
    case UPDATEADDSMSPROVIDER:
      return action.result;
    default:
      return state;
  }
};

var resetAddSmsProviderView = function() {
  return function(dispatch) {
    dispatch(updateAddSmsProviderActionCreator(null));
  }
};

module.exports = {
  addSmsProviderViewReducer: addSmsProviderViewReducer,
  updateAddSmsProviderActionCreator: updateAddSmsProviderActionCreator,
  resetAddSmsProviderView: resetAddSmsProviderView
};

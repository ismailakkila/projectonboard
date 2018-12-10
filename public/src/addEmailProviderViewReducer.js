var UPDATEADDEMAILPROVIDER = "UPDATEADDEMAILPROVIDER";

var updateAddEmailProviderActionCreator = function(result) {
  return {
    type: UPDATEADDEMAILPROVIDER,
    result: result
  }
};

var addEmailProviderViewReducer = function(state=null, action) {
  switch(action.type) {
    case UPDATEADDEMAILPROVIDER:
      return action.result;
    default:
      return state;
  }
};

var resetAddEmailProviderView = function() {
  return function(dispatch) {
    dispatch(updateAddEmailProviderActionCreator(null));
  }
};

module.exports = {
  addEmailProviderViewReducer: addEmailProviderViewReducer,
  updateAddEmailProviderActionCreator: updateAddEmailProviderActionCreator,
  resetAddEmailProviderView: resetAddEmailProviderView
};

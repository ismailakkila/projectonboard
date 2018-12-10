var UPDATEADDEMAILTEMPLATE = "UPDATEADDEMAILTemplate";

var updateAddEmailTemplateActionCreator = function(result) {
  return {
    type: UPDATEADDEMAILTEMPLATE,
    result: result
  }
};

var addEmailTemplateViewReducer = function(state=null, action) {
  switch(action.type) {
    case UPDATEADDEMAILTEMPLATE:
      return action.result;
    default:
      return state;
  }
};

var resetAddEmailTemplateView = function() {
  return function(dispatch) {
    dispatch(updateAddEmailTemplateActionCreator(null));
  }
};

module.exports = {
  addEmailTemplateViewReducer: addEmailTemplateViewReducer,
  updateAddEmailTemplateActionCreator: updateAddEmailTemplateActionCreator,
  resetAddEmailTemplateView: resetAddEmailTemplateView
};

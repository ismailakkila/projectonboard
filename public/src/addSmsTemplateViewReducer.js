var UPDATEADDSMSTEMPLATE = "UPDATEADDSMSTemplate";

var updateAddSmsTemplateActionCreator = function(result) {
  return {
    type: UPDATEADDSMSTEMPLATE,
    result: result
  }
};

var addSmsTemplateViewReducer = function(state=null, action) {
  switch(action.type) {
    case UPDATEADDSMSTEMPLATE:
      return action.result;
    default:
      return state;
  }
};

var resetAddSmsTemplateView = function() {
  return function(dispatch) {
    dispatch(updateAddSmsTemplateActionCreator(null));
  }
};

module.exports = {
  addSmsTemplateViewReducer: addSmsTemplateViewReducer,
  updateAddSmsTemplateActionCreator: updateAddSmsTemplateActionCreator,
  resetAddSmsTemplateView: resetAddSmsTemplateView
};

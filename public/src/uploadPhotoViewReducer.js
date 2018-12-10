var UPDATEUPLOADPHOTO = "UPDATEUPLOADPHOTO";

var updateUploadPhotoActionCreator = function(result) {
  return {
    type: UPDATEUPLOADPHOTO,
    result: result
  }
};

var uploadPhotoViewReducer = function(state=null, action) {
  switch(action.type) {
    case UPDATEUPLOADPHOTO:
      return action.result;
    default:
      return state;
  }
};

var resetUploadPhotoView = function() {
  return function(dispatch) {
    dispatch(updateUploadPhotoActionCreator(null));
  }
};

module.exports = {
  uploadPhotoViewReducer: uploadPhotoViewReducer,
  updateUploadPhotoActionCreator: updateUploadPhotoActionCreator,
  resetUploadPhotoView: resetUploadPhotoView
};

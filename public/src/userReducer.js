var verifyInput = require("./verifyInput");
var apiClient = require("./apiClient");
var updateAddUserActionCreator = require("./addUserViewReducer").updateAddUserActionCreator;
var updateUploadPhotoActionCreator = require("./uploadPhotoViewReducer").updateUploadPhotoActionCreator;
var updateModifyUserActionCreator = require("./updateUserViewReducer").updateModifyUserActionCreator;

var UPDATEUSERS = "UPDATEUSERS";

var getUsersCallback = function(dispatch) {
  return function(getUsersResult) {
    if (getUsersResult.status === 200) {
      dispatch(updateUsersActionCreator(getUsersResult.message.document));
    }
    else {
      dispatch(updateUsersActionCreator(null));
    }

  }
};

var createUserCallback = function(dispatch) {
  return function(createUserResult) {
    if (createUserResult.status === 200) {
      dispatch(updateAddUserActionCreator(createUserResult));
      apiClient.getUsers(function(getUsersResult) {
        if (getUsersResult.status === 200) {
          dispatch(updateUsersActionCreator(getUsersResult.message.document));
        }
        else {
          dispatch(updateUsersActionCreator(null));
        }
      });
    }
    else {
      dispatch(updateAddUserActionCreator(createUserResult));
    }
  };
};

var uploadPhotoCallback = function(dispatch) {
  return function(uploadPhotoResult) {
    if (uploadPhotoResult.status === 200) {
      dispatch(updateUploadPhotoActionCreator(uploadPhotoResult));
      apiClient.getUsers(function(getUsersResult) {
        if (getUsersResult.status === 200) {
          dispatch(updateUsersActionCreator(getUsersResult.message.document));
        }
        else {
          dispatch(updateUsersActionCreator(null));
        }
      });
    }
    else {
      dispatch(updateUploadPhotoActionCreator(uploadPhotoResult));
    }
  }
};

var deleteUserCallback = function(dispatch) {
  return function(deleteUserResult) {
    if (deleteUserResult.status === 200) {
      apiClient.getUsers(function(getUsersResult) {
        if (getUsersResult.status === 200) {
          dispatch(updateUsersActionCreator(getUsersResult.message.document));
        }
        else {
          dispatch(updateUsersActionCreator(null));
        }
      });
    }
  }
};

var modifyUserCallback = function(dispatch) {
  return function(modifyUserResult) {
    if (modifyUserResult.status === 200) {
      dispatch(updateModifyUserActionCreator(modifyUserResult));
      apiClient.getUsers(function(getUsersResult) {
        if (getUsersResult.status === 200) {
          dispatch(updateUsersActionCreator(getUsersResult.message.document));
        }
        else {
          dispatch(updateUsersActionCreator(null));
        }
      });
    }
    else {
      dispatch(updateModifyUserActionCreator(modifyUserResult));
    }
  };
};

var updateUsersActionCreator = function(users) {
  return  {
    type: UPDATEUSERS,
    users: users
  };
};

var userReducer = function(state=[], action) {
  switch(action.type) {
    case UPDATEUSERS:
      return action.users;
    default:
      return state;
  }
}

var getUsers = function() {
  return function(dispatch) {
    apiClient.getUsers(getUsersCallback(dispatch));
  };
};

var createUser = function(input) {
  return function(dispatch) {
    input = verifyInput.createUser(input);
    if (input) {
      apiClient.createUser(input, createUserCallback(dispatch));
    }
  };
};

var uploadPhoto = function(userId, photo) {
  return function(dispatch) {
    apiClient.uploadPhoto(userId, photo, uploadPhotoCallback(dispatch));
  };
};

var deleteUser = function(input) {
  return function(dispatch) {
    input = verifyInput.deleteUser(input);
    if (input) {
      var id = input._id;
      apiClient.deleteUser(id, deleteUserCallback(dispatch));
    }
  };
};

var modifyUser = function(userId, input) {
  return function(dispatch) {
    userId = verifyInput.getUser({_id: userId});
    input = verifyInput.modifyUser(input);
    if (userId && input) {
      apiClient.modifyUser(userId._id, input, modifyUserCallback(dispatch));
    }
  };
};

var searchResults = function(input) {
  return function(dispatch) {
    dispatch(updateUsersActionCreator(input));
  };
};

module.exports = {
  userReducer: userReducer,
  getUsers: getUsers,
  createUser: createUser,
  uploadPhoto: uploadPhoto,
  deleteUser: deleteUser,
  modifyUser: modifyUser,
  searchResults: searchResults
};

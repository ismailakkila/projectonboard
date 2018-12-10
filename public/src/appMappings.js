var combineReducers = require("redux").combineReducers;
var bindActionCreators = require("redux").bindActionCreators;

var resetAdminReducer = require("./resetAdminReducer").resetAdminReducer;
var getAdminCount = require("./resetAdminReducer").getAdminCount;
var createAdminUser = require("./resetAdminReducer").createAdminUser;

var authReducer = require("./authReducer").authReducer;
var loginAdminUser = require("./authReducer").loginAdminUser;
var logoutAdminUser = require("./authReducer").logoutAdminUser;
var getAdminUserLoginStatus = require("./authReducer").getAdminUserLoginStatus;

var userReducer = require("./userReducer").userReducer;
var getUsers = require("./userReducer").getUsers;
var createUser = require("./userReducer").createUser;
var uploadPhoto = require("./userReducer").uploadPhoto;
var deleteUser = require("./userReducer").deleteUser;
var modifyUser = require("./userReducer").modifyUser;
var searchResults = require("./userReducer").searchResults;

var addUserViewReducer = require("./addUserViewReducer").addUserViewReducer;
var resetAddUserView = require("./addUserViewReducer").resetAddUserView;

var uploadPhotoViewReducer = require("./uploadPhotoViewReducer").uploadPhotoViewReducer;
var resetUploadPhotoView = require("./uploadPhotoViewReducer").resetUploadPhotoView;

var updateUserViewReducer = require("./updateUserViewReducer").updateUserViewReducer;
var resetUpdateUserView = require("./updateUserViewReducer").resetUpdateUserView;

var smsReducer = require("./smsReducer").smsReducer;
var getSmsProviders = require("./smsReducer").getSmsProviders;
var createSmsProvider = require("./smsReducer").createSmsProvider;
var deleteSmsProvider = require("./smsReducer").deleteSmsProvider;
var getSmsTemplates = require("./smsReducer").getSmsTemplates;
var createSmsTemplate = require("./smsReducer").createSmsTemplate;
var deleteSmsTemplate = require("./smsReducer").deleteSmsTemplate;
var modifySmsTemplate = require("./smsReducer").modifySmsTemplate;
var sendSms = require("./smsReducer").sendSms;

var addSmsProviderViewReducer = require("./addSmsProviderViewReducer").addSmsProviderViewReducer;
var resetAddSmsProviderView = require("./addSmsProviderViewReducer").resetAddSmsProviderView;

var addSmsTemplateViewReducer = require("./addSmsTemplateViewReducer").addSmsTemplateViewReducer;
var resetAddSmsTemplateView = require("./addSmsTemplateViewReducer").resetAddSmsTemplateView;

var emailReducer = require("./emailReducer").emailReducer;
var getEmailProviders = require("./emailReducer").getEmailProviders;
var createEmailProvider = require("./emailReducer").createEmailProvider;
var deleteEmailProvider = require("./emailReducer").deleteEmailProvider;
var getEmailTemplates = require("./emailReducer").getEmailTemplates;
var createEmailTemplate = require("./emailReducer").createEmailTemplate;
var deleteEmailTemplate = require("./emailReducer").deleteEmailTemplate;
var modifyEmailTemplate = require("./emailReducer").modifyEmailTemplate;
var sendEmail = require("./emailReducer").sendEmail;

var addEmailProviderViewReducer = require("./addEmailProviderViewReducer").addEmailProviderViewReducer;
var resetAddEmailProviderView = require("./addEmailProviderViewReducer").resetAddEmailProviderView;

var addEmailTemplateViewReducer = require("./addEmailTemplateViewReducer").addEmailTemplateViewReducer;
var resetAddEmailTemplateView = require("./addEmailTemplateViewReducer").resetAddEmailTemplateView;

var rootReducer = combineReducers({
  resetAdmin: resetAdminReducer,
  auth: authReducer,
  user: userReducer,
  sms: smsReducer,
  email: emailReducer,
  addUserView: addUserViewReducer,
  updateUserView: updateUserViewReducer,
  uploadPhotoView: uploadPhotoViewReducer,
  addSmsProviderView: addSmsProviderViewReducer,
  addSmsTemplateView: addSmsTemplateViewReducer,
  addEmailProviderView: addEmailProviderViewReducer,
  addEmailTemplateView: addEmailTemplateViewReducer
});

var mapStateToProps = function(state) {
  return {
    resetAdmin: state.resetAdmin,
    auth: state.auth,
    user: state.user,
    sms: state.sms,
    email: state.email,
    addUserView: state.addUserView,
    updateUserView: state.updateUserView,
    uploadPhotoView: state.uploadPhotoView,
    addSmsProviderView: state.addSmsProviderView,
    addSmsTemplateView: state.addSmsTemplateView,
    addEmailProviderView: state.addEmailProviderView,
    addEmailTemplateView: state.addEmailTemplateView
  };
};

var mapDispatchToProps = function(dispatch) {
  return bindActionCreators({
    getAdminCount: getAdminCount,
    createAdminUser: createAdminUser,
    loginAdminUser: loginAdminUser,
    logoutAdminUser: logoutAdminUser,
    getAdminUserLoginStatus: getAdminUserLoginStatus,
    getUsers: getUsers,
    createUser: createUser,
    uploadPhoto: uploadPhoto,
    deleteUser: deleteUser,
    modifyUser: modifyUser,
    searchResults: searchResults,
    getSmsProviders: getSmsProviders,
    createSmsProvider: createSmsProvider,
    deleteSmsProvider: deleteSmsProvider,
    getSmsTemplates: getSmsTemplates,
    createSmsTemplate: createSmsTemplate,
    deleteSmsTemplate: deleteSmsTemplate,
    modifySmsTemplate: modifySmsTemplate,
    sendSms: sendSms,
    getEmailProviders: getEmailProviders,
    createEmailProvider: createEmailProvider,
    deleteEmailProvider: deleteEmailProvider,
    getEmailTemplates: getEmailTemplates,
    createEmailTemplate: createEmailTemplate,
    deleteEmailTemplate: deleteEmailTemplate,
    modifyEmailTemplate: modifyEmailTemplate,
    sendEmail: sendEmail,
    resetAddUserView: resetAddUserView,
    resetUpdateUserView: resetUpdateUserView,
    resetUploadPhotoView: resetUploadPhotoView,
    resetAddSmsProviderView: resetAddSmsProviderView,
    resetAddSmsTemplateView: resetAddSmsTemplateView,
    resetAddEmailProviderView: resetAddEmailProviderView,
    resetAddEmailTemplateView: resetAddEmailTemplateView
  }, dispatch);
};

module.exports = {
  rootReducer: rootReducer,
  mapStateToProps: mapStateToProps,
  mapDispatchToProps: mapDispatchToProps
};

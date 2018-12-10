var React = require("react");

var LoginAdmin = require("./LoginAdmin");
var FullPageLoading = require("./FullPageLoading");
var Main = require("./Main");

class AuthAdmin extends React.Component {
  constructor(props) {
    super(props);
    props.getAdminUserLoginStatus();
  }

  render() {
    var authenticated = this.props.auth.authenticated;
    if (authenticated === null) {
      return (
        <FullPageLoading />
      );
    }
    if (authenticated === true) {
      return (
        <Main
          adminUser={this.props.auth.adminUser}
          user={this.props.user}
          sms={this.props.sms}
          email={this.props.email}
          addUserView={this.props.addUserView}
          updateUserView={this.props.updateUserView}
          logoutAdminUser={this.props.logoutAdminUser}
          getUsers={this.props.getUsers}
          createUser={this.props.createUser}
          uploadPhoto={this.props.uploadPhoto}
          deleteUser={this.props.deleteUser}
          modifyUser={this.props.modifyUser}
          searchResults={this.props.searchResults}
          resetAddUserView={this.props.resetAddUserView}
          resetUpdateUserView={this.props.resetUpdateUserView}
          uploadPhotoView={this.props.uploadPhotoView}
          resetUploadPhotoView={this.props.resetUploadPhotoView}
          getSmsProviders={this.props.getSmsProviders}
          createSmsProvider={this.props.createSmsProvider}
          deleteSmsProvider={this.props.deleteSmsProvider}
          modifySmsTemplate={this.props.modifySmsTemplate}
          sendSms={this.props.sendSms}
          addSmsProviderView={this.props.addSmsProviderView}
          resetAddSmsProviderView={this.props.resetAddSmsProviderView}
          getSmsTemplates={this.props.getSmsTemplates}
          addSmsTemplateView={this.props.addSmsTemplateView}
          createSmsTemplate={this.props.createSmsTemplate}
          deleteSmsTemplate={this.props.deleteSmsTemplate}
          resetAddSmsTemplateView={this.props.resetAddSmsTemplateView}
          getEmailProviders={this.props.getEmailProviders}
          addEmailProviderView={this.props.addEmailProviderView}
          createEmailProvider={this.props.createEmailProvider}
          deleteEmailProvider={this.props.deleteEmailProvider}
          modifyEmailTemplate={this.props.modifyEmailTemplate}
          sendEmail={this.props.sendEmail}
          resetAddEmailProviderView={this.props.resetAddEmailProviderView}
          getEmailTemplates={this.props.getEmailTemplates}
          addEmailTemplateView={this.props.addEmailTemplateView}
          createEmailTemplate={this.props.createEmailTemplate}
          deleteEmailTemplate={this.props.deleteEmailTemplate}
          resetAddEmailTemplateView={this.props.resetAddEmailTemplateView}
        />
      );
    }
    else {
      return (
        <LoginAdmin
          validCredentials={this.props.auth.validCredentials}
          loginAdminUser={this.props.loginAdminUser}
        />
      );
    }
  }
}

module.exports = AuthAdmin;

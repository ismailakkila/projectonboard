var React = require("react");
var { Container } = require("semantic-ui-react");

var FullPageLoading = require("./FullPageLoading");
var AuthAdmin = require("./AuthAdmin");
var ResetAdmin = require("./ResetAdmin");

class ProjectOnboard extends React.Component {
  constructor(props) {
    super(props);
    props.getAdminCount();
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.setState({loading: false});
  }

  render() {
    var loading = this.state.loading;
    var resetAdmin = this.props.resetAdmin
    return (
      <Container>
        {
          loading
            ? (<FullPageLoading />)
            : (
                resetAdmin
                  ? (<ResetAdmin createAdminUser={this.props.createAdminUser}/>)
                  : (
                      <AuthAdmin
                        auth={this.props.auth}
                        user={this.props.user}
                        sms={this.props.sms}
                        email={this.props.email}
                        addUserView={this.props.addUserView}
                        updateUserView={this.props.updateUserView}
                        getAdminUserLoginStatus={this.props.getAdminUserLoginStatus}
                        loginAdminUser={this.props.loginAdminUser}
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
                        addSmsProviderView={this.props.addSmsProviderView}
                        createSmsProvider={this.props.createSmsProvider}
                        deleteSmsProvider={this.props.deleteSmsProvider}
                        modifySmsTemplate={this.props.modifySmsTemplate}
                        sendSms={this.props.sendSms}
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
                    )
              )
          }
      </Container>
    );
  }
}

module.exports = ProjectOnboard;

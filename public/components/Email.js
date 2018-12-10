var React = require("react");
var EmailPreferences = require("./EmailPreferences");
var AddEmailProvider = require("./AddEmailProvider");

class Email extends React.Component {
  constructor(props) {
    super(props);
    this.props.getEmailProviders();
    this.state = {enableEmailPreferences: false};
    this.handleToggleEmailPreferences = this.handleToggleEmailPreferences.bind(this);
  }

  handleToggleEmailPreferences() {
    this.setState({enableEmailPreferences: !this.state.enableEmailPreferences});
  }

  render() {
    var enableEmailPreferences = this.state.enableEmailPreferences;
    var emailProviders = this.props.email.emailProviders;
    var emailTemplates = this.props.email.emailTemplates;
    return  (
      emailProviders.length > 0
        ?
          (
            <EmailPreferences
              toggleEmailPreferences={this.handleToggleEmailPreferences}
              enableEmailPreferences={enableEmailPreferences}
              emailProvider={emailProviders[0]}
              emailTemplates={emailTemplates}
              deleteEmailProvider={this.props.deleteEmailProvider}
              getEmailTemplates={this.props.getEmailTemplates}
              addEmailTemplateView={this.props.addEmailTemplateView}
              createEmailTemplate={this.props.createEmailTemplate}
              deleteEmailTemplate={this.props.deleteEmailTemplate}
              modifyEmailTemplate={this.props.modifyEmailTemplate}
              resetAddEmailTemplateView={this.props.resetAddEmailTemplateView}
            />
          )
        :
          (
            <AddEmailProvider
              toggleEmailPreferences={this.handleToggleEmailPreferences}
              addEmailProviderView={this.props.addEmailProviderView}
              resetAddEmailProviderView={this.props.resetAddEmailProviderView}
              createEmailProvider={this.props.createEmailProvider}
            />
          )
    );
  }
}

module.exports = Email;

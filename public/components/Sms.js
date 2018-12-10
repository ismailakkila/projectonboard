var React = require("react");
var SmsPreferences = require("./SmsPreferences");
var AddSmsProvider = require("./AddSmsProvider");

class Sms extends React.Component {
  constructor(props) {
    super(props);
    this.props.getSmsProviders();
    this.state = {enableSmsPreferences: false};
    this.handleToggleSmsPreferences = this.handleToggleSmsPreferences.bind(this);
  }

  handleToggleSmsPreferences() {
    this.setState({enableSmsPreferences: !this.state.enableSmsPreferences});
  }

  render() {
    var enableSmsPreferences = this.state.enableSmsPreferences;
    var smsProviders = this.props.sms.smsProviders;
    var smsTemplates = this.props.sms.smsTemplates;
    return  (
      smsProviders.length > 0
        ?
          (
            <SmsPreferences
              toggleSmsPreferences={this.handleToggleSmsPreferences}
              enableSmsPreferences={enableSmsPreferences}
              smsProvider={smsProviders[0]}
              smsTemplates={smsTemplates}
              deleteSmsProvider={this.props.deleteSmsProvider}
              getSmsTemplates={this.props.getSmsTemplates}
              addSmsTemplateView={this.props.addSmsTemplateView}
              createSmsTemplate={this.props.createSmsTemplate}
              deleteSmsTemplate={this.props.deleteSmsTemplate}
              modifySmsTemplate={this.props.modifySmsTemplate}
              resetAddSmsTemplateView={this.props.resetAddSmsTemplateView}
            />
          )
        :
          (
            <AddSmsProvider
              toggleSmsPreferences={this.handleToggleSmsPreferences}
              addSmsProviderView={this.props.addSmsProviderView}
              resetAddSmsProviderView={this.props.resetAddSmsProviderView}
              createSmsProvider={this.props.createSmsProvider}
            />
          )
    );
  }
}

module.exports = Sms;

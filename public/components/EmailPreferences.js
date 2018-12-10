var React = require("react");
var { TextArea, Dropdown, Form, Message, Modal, Button, Icon, Header, Image, Divider, Menu, Popup, Checkbox } = require("semantic-ui-react");

var logoUrlRegex = /^(https?):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/i;
var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

class EmailPreferences extends React.Component {
  constructor(props) {
    super(props);
    props.getEmailTemplates();
    this.state = {
      enableTemplateMakeDefault: false,
      enableTemplateDelete: false,
      selectedTemplate: null,
      templateName: "",
      templateLogoUrl: "",
      templateFrom: "",
      templateSubject: "",
      templateContent: "",
      templateLogoUrlRequired: false,
      templateQrCodeRequired: false,
      templateFromWarning: false,
      templateContentWarning: false,
      templateLogoUrlWarning: false,
      openModal: false
    };
    this.resetState = this.resetState.bind(this);
    this.generateTemplateOptions = this.generateTemplateOptions.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleDeleteEmailProvider = this.handleDeleteEmailProvider.bind(this);
    this.handleDeleteEmailTemplate = this.handleDeleteEmailTemplate.bind(this);
    this.handleModifyEmailTemplate = this.handleModifyEmailTemplate.bind(this);
    this.handleChangeTemplateName = this.handleChangeTemplateName.bind(this);
    this.handleChangeTemplateLogoUrl = this.handleChangeTemplateLogoUrl.bind(this);
    this.handleChangeTemplateFrom = this.handleChangeTemplateFrom.bind(this);
    this.handleChangeTemplateSubject = this.handleChangeTemplateSubject.bind(this);
    this.handleChangeTemplateContent = this.handleChangeTemplateContent.bind(this);
    this.handleToggleLogoUrl = this.handleToggleLogoUrl.bind(this);
    this.handleToggleGenerateQrCode = this.handleToggleGenerateQrCode.bind(this);
    this.handleTemplateNameChange = this.handleTemplateNameChange.bind(this);
  }

  generateTemplateOptions() {
    var emailTemplates = this.props.emailTemplates;
    var templateOptions = emailTemplates.map(function(emailTemplate) {
      if (emailTemplate.isDefault) {
        var content = <Header icon='circle' content={emailTemplate.name} subheader={"Created: " + new Date(emailTemplate.createdAt).toDateString()}/>
      }
      else {
        var content = <Header icon='circle outline' content={emailTemplate.name} subheader={"Created: " + new Date(emailTemplate.createdAt).toDateString()}/>
      }
      return {
        key: emailTemplate._id,
        text: emailTemplate.name,
        value: emailTemplate._id,
        content: content
      };
    });
    return templateOptions;
  }

  resetState() {
    this.setState({
      enableTemplateMakeDefault: false,
      enableTemplateDelete: false,
      selectedTemplate: null,
      templateName: "",
      templateLogoUrl: "",
      templateFrom: "",
      templateSubject: "",
      templateContent: "",
      templateLogoUrlRequired: false,
      templateQrCodeRequired: false,
      templateFromWarning: false,
      templateContentWarning: false,
      templateLogoUrlWarning: false,
      openModal: false
    });
  }

  handleOpenModal() {
    this.setState({
      openModal: true
    });
  }

  handleCloseModal() {
    this.resetState();
  }

  handleDeleteEmailProvider(input) {
    this.props.deleteEmailProvider(input);
  }

  handleDeleteEmailTemplate(input) {
    this.props.deleteEmailTemplate(input);
    this.setState({
      selectedTemplate: null,
      enableTemplateMakeDefault: false,
      enableTemplateDelete: false,
    });
  }

  handleModifyEmailTemplate(input) {
    this.props.modifyEmailTemplate(input);
    this.setState({
      selectedTemplate: null,
      enableTemplateMakeDefault: false,
      enableTemplateDelete: false,
    });
  }

  handleAddEmailTemplate(input) {
    var boolTemplateFrom = this.state.templateFrom &&
      emailRegex.test(this.state.templateFrom);
    var boolTemplateContent = this.state.templateContent &&
      this.state.templateContent.length <= 1000;
    if (!this.state.templateLogoUrlRequired) {
      input = Object.assign({}, input, {logoUrl: "null"});
      var boolTemplateLogoUrl = true;
    }
    else {
      var boolTemplateLogoUrl = this.state.templateLogoUrl &&
        logoUrlRegex.test(this.state.templateLogoUrl);
    }
    if (!boolTemplateFrom) {
      this.setState({
        templateFromWarning: true
      });
    }
    if (!boolTemplateContent) {
      this.setState({
        templateContentWarning: true
      });
    }
    if (!boolTemplateLogoUrl) {
      this.setState({
        templateLogoUrlWarning: true
      });
    }
    else if (this.state.templateName && this.state.templateSubject && boolTemplateFrom && boolTemplateContent && boolTemplateLogoUrl) {
      var input = Object.assign({}, input, {
        logoUrlRequired: String(input.logoUrlRequired),
        qrCodeRequired: String(input.qrCodeRequired)
      });
      this.props.createEmailTemplate(input);
      console.log(input);
      this.setState({
        templateName: "",
        templateFrom: "",
        templateContent: "",
        templateSubject: "",
        templateLogoUrl: "",
        templateLogoUrlRequired: false,
        templateQrCodeRequired: false,
        templateLogoUrlWarning: false,
        templateFromWarning: false,
        templateContentWarning: false
      });
    }
  }

  handleChangeTemplateName(e) {
    this.setState({templateName: e.target.value});
  }

  handleChangeTemplateLogoUrl(e) {
    this.setState({templateLogoUrl: e.target.value});
  }

  handleChangeTemplateFrom(e) {
    this.setState({templateFrom: e.target.value});
  }

  handleChangeTemplateSubject(e) {
    this.setState({templateSubject: e.target.value});
  }

  handleChangeTemplateContent(e) {
    this.setState({templateContent: e.target.value});
  }

  handleToggleGenerateQrCode(e, props) {
    this.setState({templateQrCodeRequired: props.checked});
  }

  handleToggleLogoUrl(e, props) {
    console.log(props);
    this.setState({templateLogoUrlRequired: props.checked});
  }

  handleTemplateNameChange(e, props) {
    var key = props.value;
    var selectedEmailTemplateArray = this.props.emailTemplates.filter(function(emailTemplate) {
      return emailTemplate._id === key;
    });
    if (selectedEmailTemplateArray.length === 1) {
      if (selectedEmailTemplateArray[0].isDefault) {
        this.setState({
          enableTemplateMakeDefault: false,
          enableTemplateDelete: true,
          selectedTemplate: selectedEmailTemplateArray[0]
        });
      }
      else {
        this.setState({
          enableTemplateMakeDefault: true,
          enableTemplateDelete: true,
          selectedTemplate: selectedEmailTemplateArray[0]
        });
      }
    }
  }

  componentWillMount() {
    var enableEmailPreferences = this.props.enableEmailPreferences;
    var openModal = this.state.openModal;
    if (enableEmailPreferences && !openModal) {
      this.setState({openModal: true});
      this.props.toggleEmailPreferences();
    }
  }

  componentWillUnmount() {
    this.resetState();
  }

  render() {
    var emailProvider = this.props.emailProvider
    var emailTemplates = this.props.emailTemplates;
    return (
      <Modal
        onClose={this.handleCloseModal}
        open={this.state.openModal}
        trigger={<Dropdown.Item onClick={this.handleOpenModal}>Email</Dropdown.Item>}
      >
        <Modal.Header>
          <Icon name="mail" />
            Email Preferences
        </Modal.Header>
        <Modal.Content>
          <Menu.Item name={emailProvider.type} style={{textAlign: "center"}}>
            <Image  size='small' style={{display: "block", margin: "0 auto"}} src={"/images/emailProviders/" + emailProvider.type + ".png"} />
            <Button onClick={()=>this.handleDeleteEmailProvider({_id: emailProvider._id})}>Delete</Button>
          </Menu.Item>
          <Divider />
          <Form>
            <Form.Field>
              <label>Default Template</label>
              <Dropdown
                onChange={this.handleTemplateNameChange}
                placeholder='Select Template'
                fluid
                selection
                options={this.generateTemplateOptions()}
              />
            </Form.Field>
            <Button
              primary
              onClick={()=>this.handleModifyEmailTemplate({_id: this.state.selectedTemplate._id, isDefault: "true"})}
              disabled={!this.state.enableTemplateMakeDefault}
            >
              Make Default
            </Button>
            <Popup
              trigger={<Button disabled={this.state.selectedTemplate === null}>Preview Template</Button>}
              on="click"
              wide
            >
              <Popup.Content style={{whiteSpace: "pre-line"}}>
                {this.state.selectedTemplate === null ? null : this.state.selectedTemplate.emailContent}
              </Popup.Content>
            </Popup>
            <Button
              onClick={()=>this.handleDeleteEmailTemplate({_id: this.state.selectedTemplate._id})}
              disabled={!this.state.enableTemplateDelete}
            >
            Delete
            </Button>

          </Form>
          <Divider />
          <Form>
            <Form.Field>
              <label>Email Template Name</label>
              <input
                onChange={this.handleChangeTemplateName}
                placeholder='Name'
                value={this.state.templateName}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                onChange={this.handleToggleLogoUrl}
                checked={this.state.templateLogoUrlRequired}
                label="Include Logo"
              />
            </Form.Field>
            {
              this.state.templateLogoUrlRequired
                ?
                  (
                    <Form.Field>
                      <label>Logo URL</label>
                      <input
                        onChange={this.handleChangeTemplateLogoUrl}
                        placeholder='http(s)://...'
                        value={this.state.templateLogoUrl}
                      />
                    </Form.Field>
                  )
                : null
            }
            <Form.Field>
              <label>Email From Address</label>
              <input
                onChange={this.handleChangeTemplateFrom}
                placeholder='Email Address'
                value={this.state.templateFrom}
              />
            </Form.Field>
            <Form.Field>
              <label>Email Subject Line</label>
              <input
                onChange={this.handleChangeTemplateSubject}
                placeholder='Subject'
                value={this.state.templateSubject}
              />
            </Form.Field>
            <Form.Field>
              <label>
                Email Content
                <Popup
                  trigger={<Icon link={true} name="info" />}
                  on="click"
                  wide
                >
                  <Popup.Content style={{whiteSpace: "pre-line"}}>
                    {"You can use the following substitutions:\n\n" +
                    "Username: {username}\n" +
                    "First Name: {firstName}\n" +
                    "Last Name: {lastName}\n" +
                    "Email Address: {email}\n" +
                    "Mobile Number: {mobileNumber}\n" +
                    "Initial Token: {initialToken}\n"}
                  </Popup.Content>
                </Popup>
              </label>
              <TextArea
                onChange={this.handleChangeTemplateContent}
                placeholder='1000 Character Limit'
                value={this.state.templateContent}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                onChange={this.handleToggleGenerateQrCode}
                checked={this.state.templateQrCodeRequired}
                label="Generate Login QR Code"
              />
            </Form.Field>
            <Button
              onClick={()=>this.handleAddEmailTemplate({
                  name: this.state.templateName,
                  emailFrom: this.state.templateFrom,
                  emailSubject: this.state.templateSubject,
                  emailContent: this.state.templateContent,
                  logoUrl: this.state.templateLogoUrl,
                  qrCodeRequired: this.state.templateQrCodeRequired,
                  logoUrlRequired: this.state.templateLogoUrlRequired
                })}
              disabled={
                !(Boolean(this.state.templateName) &&
                Boolean(this.state.templateSubject) &&
                Boolean(this.state.templateFrom) &&
                Boolean(this.state.templateContent) &&
                (Boolean(this.state.templateLogoUrlRequired && this.state.templateLogoUrl) || !this.state.templateLogoUrlRequired))
              }
              primary
            >
              Add Template
            </Button>
          </Form>
          {
            this.state.templateFromWarning
            ?
              (
                <Message warning>
                  <Message.Header>Email From Address must be in Email Address Format!</Message.Header>
                </Message>
              )
            : null
          }
          {
            this.state.templateContentWarning
            ?
              (
                <Message warning>
                  <Message.Header>Email Body Characters Not Allowed!</Message.Header>
                </Message>
              )
            : null
          }
          {
            this.state.templateLogoUrlWarning
            ?
              (
                <Message warning>
                  <Message.Header>Please enter a correct Logo URL!</Message.Header>
                </Message>
              )
            : null
          }
        </Modal.Content>
      </Modal>
    );
  }
}

module.exports = EmailPreferences;

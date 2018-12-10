var React = require("react");
var { TextArea, Dropdown, Form, Message, Modal, Button, Icon, Header, Image, Divider, Menu, Popup } = require("semantic-ui-react");
var smsRegex = /^[{}A-Za-z0-9@$_\/.,"():;\-=+&%#!?<>' \n]+$/;

class SmsPreferences extends React.Component {
  constructor(props) {
    super(props);
    props.getSmsTemplates();
    this.state = {
      enableTemplateMakeDefault: false,
      enableTemplateDelete: false,
      selectedTemplate: null,
      templateName: "",
      templateContent: "",
      templateContentWarning: false,
      openModal: false
    };
    this.resetState = this.resetState.bind(this);
    this.generateTemplateOptions = this.generateTemplateOptions.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleDeleteSmsProvider = this.handleDeleteSmsProvider.bind(this);
    this.handleDeleteSmsTemplate = this.handleDeleteSmsTemplate.bind(this);
    this.handleModifySmsTemplate = this.handleModifySmsTemplate.bind(this);
    this.handleChangeTemplateName = this.handleChangeTemplateName.bind(this);
    this.handleChangeTemplateContent = this.handleChangeTemplateContent.bind(this);
    this.handleTemplateNameChange = this.handleTemplateNameChange.bind(this);
  }

  generateTemplateOptions() {
    var smsTemplates = this.props.smsTemplates;
    var templateOptions = smsTemplates.map(function(smsTemplate) {
      if (smsTemplate.isDefault) {
        var content = <Header icon='circle' content={smsTemplate.name} subheader={"Created: " + new Date(smsTemplate.createdAt).toDateString()}/>
      }
      else {
        var content = <Header icon='circle outline' content={smsTemplate.name} subheader={"Created: " + new Date(smsTemplate.createdAt).toDateString()}/>
      }
      return {
        key: smsTemplate._id,
        text: smsTemplate.name,
        value: smsTemplate._id,
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
      templateContent: "",
      templateContentWarning: false,
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

  handleDeleteSmsProvider(input) {
    this.props.deleteSmsProvider(input);
  }

  handleDeleteSmsTemplate(input) {
    this.props.deleteSmsTemplate(input);
    this.setState({
      selectedTemplate: null,
      enableTemplateMakeDefault: false,
      enableTemplateDelete: false,
    });
  }

  handleModifySmsTemplate(input) {
    this.props.modifySmsTemplate(input);
    this.setState({
      selectedTemplate: null,
      enableTemplateMakeDefault: false,
      enableTemplateDelete: false,
    });
  }

  handleAddSmsTemplate(input) {
    var boolTemplateContent = this.state.templateContent &&
      this.state.templateContent.length <= 160 &&
      smsRegex.test(this.state.templateContent);
    if (this.state.templateName && boolTemplateContent) {
      this.props.createSmsTemplate(input);
      this.setState({
        templateName: "",
        templateContent: "",
        templateContentWarning: false
      });
    }
    else {
      this.setState({
        templateContentWarning: true
      });
    }
  }

  handleChangeTemplateName(e) {
    this.setState({templateName: e.target.value});
  }

  handleChangeTemplateContent(e) {
    this.setState({templateContent: e.target.value});
  }

  handleTemplateNameChange(e, props) {
    var key = props.value;
    var selectedSmsTemplateArray = this.props.smsTemplates.filter(function(smsTemplate) {
      return smsTemplate._id === key;
    });
    if (selectedSmsTemplateArray.length === 1) {
      if (selectedSmsTemplateArray[0].isDefault) {
        this.setState({
          enableTemplateMakeDefault: false,
          enableTemplateDelete: true,
          selectedTemplate: selectedSmsTemplateArray[0]
        });
      }
      else {
        this.setState({
          enableTemplateMakeDefault: true,
          enableTemplateDelete: true,
          selectedTemplate: selectedSmsTemplateArray[0]
        });
      }
    }
  }

  componentWillMount() {
    var enableSmsPreferences = this.props.enableSmsPreferences;
    var openModal = this.state.openModal;
    if (enableSmsPreferences && !openModal) {
      this.setState({openModal: true});
      this.props.toggleSmsPreferences();
    }
  }

  render() {
    var smsProvider = this.props.smsProvider
    var smsTemplates = this.props.smsTemplates;
    return (
      <Modal
        onClose={this.handleCloseModal}
        open={this.state.openModal}
        trigger={<Dropdown.Item onClick={this.handleOpenModal}>SMS</Dropdown.Item>}
      >
        <Modal.Header>
          <Icon name="text telephone" />
            SMS Preferences
        </Modal.Header>
        <Modal.Content>
          <Menu.Item name="nexmo" style={{textAlign: "center"}}>
            <Image  size='small' style={{display: "block", margin: "0 auto"}} src={"/images/smsProviders/" + smsProvider.type + ".png"} />
            <Button onClick={()=>this.handleDeleteSmsProvider({_id: smsProvider._id})}>Delete</Button>
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
              onClick={()=>this.handleModifySmsTemplate({_id: this.state.selectedTemplate._id, isDefault: "true"})}
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
                {this.state.selectedTemplate === null ? null : this.state.selectedTemplate.smsContent}
              </Popup.Content>
            </Popup>
            <Button
              onClick={()=>this.handleDeleteSmsTemplate({_id: this.state.selectedTemplate._id})}
              disabled={!this.state.enableTemplateDelete}
            >
            Delete
            </Button>

          </Form>
          <Divider />
          <Form>
            <Form.Field>
              <label>SMS Template Name</label>
              <input
                onChange={this.handleChangeTemplateName}
                placeholder='Name'
                value={this.state.templateName}
              />
            </Form.Field>
            <Form.Field>
              <label>
                SMS Content
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
                placeholder='160 Character Limit'
                value={this.state.templateContent}
              />
            </Form.Field>
            <Button
              onClick={()=>this.handleAddSmsTemplate({
                  name: this.state.templateName,
                  smsContent: this.state.templateContent
                })}
              disabled={!(Boolean(this.state.templateName) && Boolean(this.state.templateContent))}
              primary
            >
              Add Template
            </Button>
          </Form>
          {
            this.state.templateContentWarning
            ?
              (
                <Message warning>
                  <Message.Header>SMS Characters Not Allowed!</Message.Header>
                </Message>
              )
            : null
          }
        </Modal.Content>
      </Modal>
    );
  }
}

module.exports = SmsPreferences;

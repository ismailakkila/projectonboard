var React = require("react");
var { Message, Modal, Button, Icon, Header, Input, Divider, Form } = require("semantic-ui-react");

var ImageDrop = require("./ImageDrop");
var lodash = require("lodash");

var stringRegex = /^[a-z ,.'-]+$/i;
var usernameRegex = /^[-\w\.\$@\*\!]{5,30}$/;
var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
var telephoneRegex = /^\+[1-9]\d{4,14}$/;

var checkStringFormat = function(input, key, regex) {
  if (!input.hasOwnProperty(key)) {
    return false;
  }
  if (!input[key]) {
    return false;
  }
  if (typeof(input[key]) !== "string") {
    return false;
  }
  if (regex.test(input[key])) {
    return input
  }
  return false;
};

class ModifyUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.user.username,
      usernameError: false,
      firstName: lodash.startCase(props.user.firstName),
      firstNameError: false,
      lastName: lodash.startCase(props.user.lastName),
      lastNameError: false,
      email: props.user.email,
      emailError: false,
      mobileNumber: props.user.mobileNumber,
      mobileNumberError: false,
      messageWarning: null,
      messagePositive: null,
      messageContent: null,
      modifyInput: {}
    };
    this.resetState = this.resetState.bind(this);
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
  }

  resetState() {
    this.setState({
      username: this.props.user.username,
      usernameError: false,
      firstName: lodash.startCase(this.props.user.firstName),
      firstNameError: false,
      lastName: lodash.startCase(this.props.user.lastName),
      lastNameError: false,
      email: this.props.user.email,
      emailError: false,
      mobileNumber: this.props.user.mobileNumber,
      mobileNumberError: false,
      messageWarning: null,
      messagePositive: null,
      messageContent: null,
      modifyInput: {}
    });
  }

  handleUsername(e) {
    var input = e.target.value;
    var modifyInput = this.state.modifyInput;
    if (this.props.user.username !== input.toLowerCase()) {
      modifyInput.username = input;
    }
    else {
      delete modifyInput.username;
    }
    if (input.length > 0) {
      var checkInput = checkStringFormat({username: input}, "username", usernameRegex);
      if (checkInput) {
        this.setState({
          username: input,
          usernameError: false,
          modifyInput: modifyInput
        });
      }
      else {
        this.setState({
          username: input,
          usernameError: true,
          modifyInput: modifyInput
        });
      }
    }
    else {
      this.setState({
        username: input,
        usernameError: null,
        modifyInput: modifyInput
      });
    }
  }

  handleFirstName(e) {
    var input = e.target.value;
    var modifyInput = this.state.modifyInput;
    if (this.props.user.firstName !== input.toLowerCase()) {
      modifyInput.firstName = input;
    }
    else {
      delete modifyInput.firstName;
    }
    if (input.length > 0) {
      var checkInput = checkStringFormat({firstName: input}, "firstName", stringRegex);
      if (checkInput) {
        this.setState({
          firstName: input,
          firstNameError: false,
          modifyInput: modifyInput
        });
      }
      else {
        this.setState({
          firstName: input,
          firstNameError: true,
          modifyInput: modifyInput
        });
      }
    }
    else {
      this.setState({
        firstName: input,
        firstNameError: null,
        modifyInput: modifyInput
      });
    }
  }

  handleLastName(e) {
    var input = e.target.value;
    var modifyInput = this.state.modifyInput;
    if (this.props.user.lastName !== input.toLowerCase()) {
      modifyInput.lastName = input;
    }
    else {
      delete modifyInput.lastName;
    }
    if (input.length > 0) {
      var checkInput = checkStringFormat({lastName: input}, "lastName", stringRegex);
      if (checkInput) {
        this.setState({
          lastName: input,
          lastNameError: false,
          modifyInput: modifyInput
        });
      }
      else {
        this.setState({
          lastName: input,
          lastNameError: true,
          modifyInput: modifyInput
        });
      }
    }
    else {
      this.setState({
        lastName: input,
        lastNameError: null,
        modifyInput: modifyInput
      });
    }
  }

  handleEmail(e) {
    var input = e.target.value;
    var modifyInput = this.state.modifyInput;
    if (this.props.user.email !== input.toLowerCase()) {
      modifyInput.email = input;
    }
    else {
      delete modifyInput.email;
    }
    if (input.length > 0) {
      var checkInput = checkStringFormat({email: input}, "email", emailRegex);
      if (checkInput) {
        this.setState({
          email: input,
          emailError: false,
          modifyInput: modifyInput
        });
      }
      else {
        this.setState({
          email: input,
          emailError: true,
          modifyInput: modifyInput
        });
      }
    }
    else {
      this.setState({
        email: input,
        emailError: null,
        modifyInput: modifyInput
      });
    }
  }

  handleMobileNumber(e) {
    var input = e.target.value;
    var modifyInput = this.state.modifyInput;
    if (this.props.user.mobileNumber !== input.toLowerCase()) {
      modifyInput.mobileNumber = input;
    }
    else {
      delete modifyInput.mobileNumber;
    }
    if (input.length > 0) {
      var checkInput = checkStringFormat({mobileNumber: input}, "mobileNumber", telephoneRegex);
      if (checkInput) {
        this.setState({
          mobileNumber: input,
          mobileNumberError: false,
          modifyInput: modifyInput
        });
      }
      else {
        this.setState({
          mobileNumber: input,
          mobileNumberError: true,
          modifyInput: modifyInput
        });
      }
    }
    else {
      this.setState({
        mobileNumber: input,
        mobileNumberError: null,
        modifyInput: modifyInput
      });
    }
  }

  handleUpdateUser() {
    var checkInput = this.state.usernameError === false &&
    this.state.firstNameError === false &&
    this.state.lastNameError === false &&
    this.state.emailError === false &&
    this.state.mobileNumberError === false &&
    Object.keys(this.state.modifyInput).length > 0;
    if (checkInput) {
      this.props.modifyUser(this.props.user._id, this.state.modifyInput);
    }
  }

  componentDidUpdate() {
    var result = this.props.updateUserView;
    if (result) {
      setTimeout(function() {
        this.props.resetUpdateUserView();
        switch(result.status) {
          case 200:
            if (!this.closed) {
              this.resetState();
            }
            break;
          case 409:
            if (!this.closed) {
              this.setState({
                usernameError: true
              });
            }
            break;
          default:
            return;
        }
      }.bind(this), 3000);
    }
  }

  componentWillUnmount() {
    this.closed = true;
  }

  render() {
    var result = this.props.updateUserView;
    if (result) {
      var status = result.status;
      switch(status) {
        case 200:
          var user = result.message.document;
          var messageContent = "Updated User!";
          var messageWarning = false;
          var messagePositive = true;
          break;
        case 409:
          var messageContent = "Username Already Exists!";
          var messageWarning = true;
          var messagePositive = false;
          break;
        default:
          var messageContent = "Something Went Wrong!";
          var messageWarning = true;
          var messagePositive = false;
      }
    }
    return (
      <Modal
        onClose={() => this.resetState()}
        trigger={
          <Button
            size="mini"
            floated="right"
            animated
          >
            <Button.Content visible>
              <Icon name='edit' />
            </Button.Content>
            <Button.Content hidden>Edit</Button.Content>
          </Button>
        }
      >
        <Modal.Header>
          <Icon name="user circle" />
          Update a User
        </Modal.Header>
        <Modal.Content image>
          <ImageDrop
            user={result === null ? null : user}
            uploadPhoto={this.props.uploadPhoto}
            uploadPhotoView={this.props.uploadPhotoView}
            resetUploadPhotoView={this.props.resetUploadPhotoView}
          />
          <Modal.Description style={{padding: "10px"}}>
            <Header>User Information</Header>
            <p>Please enter the below details.</p>
            <Form>
              <Form.Field
                onChange={(e) => this.handleUsername(e)}
                id='form-input-control-user-name'
                control={Input}
                label='Username'
                value={this.state.username}
                placeholder='Username'
                error={Boolean(this.state.username) && this.state.usernameError}
              />
              <Form.Group widths='equal'>
                <Form.Field
                  onChange={(e) => this.handleFirstName(e)}
                  id='form-input-control-first-name'
                  control={Input}
                  label='First name'
                  value={this.state.firstName}
                  placeholder='First name'
                  error={Boolean(this.state.firstName) && this.state.firstNameError}
                />
                <Form.Field
                  onChange={(e) => this.handleLastName(e)}
                  id='form-input-control-last-name'
                  control={Input}
                  label='Last name'
                  value={this.state.lastName}
                  placeholder='Last name'
                  error={Boolean(this.state.lastName) && this.state.lastNameError}
                />
              </Form.Group>
              <Divider />
              <Form.Group widths='equal'>
                <Form.Field
                  onChange={(e) => this.handleEmail(e)}
                  id='form-input-control-email'
                  control={Input}
                  label='Email'
                  value={this.state.email}
                  placeholder='Email'
                  error={Boolean(this.state.email) && this.state.emailError}
                />
                <Form.Field
                  onChange={(e) => this.handleMobileNumber(e)}
                  id='form-input-control-mobile-phone'
                  control={Input}
                  label='Mobile Phone'
                  value={this.state.mobileNumber}
                  placeholder='Mobile Phone'
                  error={Boolean(this.state.mobileNumber) && this.state.mobileNumberError}
                />
              </Form.Group>
              <Button
                onClick={() => this.handleUpdateUser()}
                type='submit'
                disabled={
                  !(this.state.usernameError === false &&
                  this.state.firstNameError === false &&
                  this.state.lastNameError === false &&
                  this.state.emailError === false &&
                  this.state.mobileNumberError === false &&
                  Object.keys(this.state.modifyInput).length > 0)
                }
              >
                Update User
              </Button>
            </Form>
            {
              result === null
              ? null
              :
                (
                  <Message
                    positive={messagePositive}
                    negative={messageWarning}
                    header={messageContent}
                  />
                )
            }
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

module.exports = ModifyUser;

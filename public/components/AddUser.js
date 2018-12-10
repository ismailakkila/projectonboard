var React = require("react");
var { Message, Modal, Button, Input, Divider, Form, Icon, Header } = require("semantic-ui-react");
var ImageDrop = require("./ImageDrop");

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

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      usernameError: null,
      firstName: "",
      firstNameError: null,
      lastName: "",
      lastNameError: null,
      email: "",
      emailError: null,
      mobileNumber: "",
      mobileNumberError: null,
      messageWarning: null,
      messagePositive: null,
      messageContent: null
    };
    this.resetState = this.resetState.bind(this);
    this.handleAddUser = this.handleAddUser.bind(this);
  }

  resetState() {
    this.setState({
      username: "",
      usernameError: null,
      firstName: "",
      firstNameError: null,
      lastName: "",
      lastNameError: null,
      email: "",
      emailError: null,
      mobileNumber: "",
      mobileNumberError: null,
      messageWarning: null,
      messagePositive: null,
      messageContent: null
    });
  }

  handleUsername(e) {
    var input = e.target.value;
    if (input.length > 0) {
      var checkInput = checkStringFormat({username: input}, "username", usernameRegex);
      if (checkInput) {
        this.setState({
          username: input,
          usernameError: false
        });
      }
      else {
        this.setState({
          username: input,
          usernameError: true
        });
      }
    }
    else {
      this.setState({
        username: input,
        usernameError: null
      });
    }
  }

  handleFirstName(e) {
    var input = e.target.value;
    if (input.length > 0) {
      var checkInput = checkStringFormat({firstName: input}, "firstName", stringRegex);
      if (checkInput) {
        this.setState({
          firstName: input,
          firstNameError: false
        });
      }
      else {
        this.setState({
          firstName: input,
          firstNameError: true
        });
      }
    }
    else {
      this.setState({
        firstName: input,
        firstNameError: null
      });
    }
  }

  handleLastName(e) {
    var input = e.target.value;
    if (input.length > 0) {
      var checkInput = checkStringFormat({lastName: input}, "lastName", stringRegex);
      if (checkInput) {
        this.setState({
          lastName: input,
          lastNameError: false
        });
      }
      else {
        this.setState({
          lastName: input,
          lastNameError: true
        });
      }
    }
    else {
      this.setState({
        lastName: input,
        lastNameError: null
      });
    }
  }

  handleEmail(e) {
    var input = e.target.value;
    if (input.length > 0) {
      var checkInput = checkStringFormat({email: input}, "email", emailRegex);
      if (checkInput) {
        this.setState({
          email: input,
          emailError: false
        });
      }
      else {
        this.setState({
          email: input,
          emailError: true
        });
      }
    }
    else {
      this.setState({
        email: input,
        emailError: null
      });
    }
  }

  handleMobileNumber(e) {
    var input = e.target.value;
    if (input.length > 0) {
      var checkInput = checkStringFormat({mobileNumber: input}, "mobileNumber", telephoneRegex);
      if (checkInput) {
        this.setState({
          mobileNumber: input,
          mobileNumberError: false
        });
      }
      else {
        this.setState({
          mobileNumber: input,
          mobileNumberError: true
        });
      }
    }
    else {
      this.setState({
        mobileNumber: input,
        mobileNumberError: null
      });
    }
  }

  handleAddUser() {
    var checkInput = this.state.usernameError === false &&
    this.state.firstNameError === false &&
    this.state.lastNameError === false &&
    this.state.emailError === false &&
    this.state.mobileNumberError === false;
    if (checkInput) {
      this.props.createUser({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        username: this.state.username,
        email: this.state.email,
        mobileNumber: this.state.mobileNumber
      });
    }
  }

  componentDidUpdate() {
    var result = this.props.addUserView;
    if (result) {
      setTimeout(function() {
        this.props.resetAddUserView();
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
    var result = this.props.addUserView;
    if (result) {
      var status = result.status;
      switch(status) {
        case 200:
          var user = result.message.document;
          var messageContent = "Added User!";
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
          <Button icon as='a' inverted style={{marginLeft: "0.5em"}}>
            <Icon name="add user"/>
          </Button>
        }
      >
        <Modal.Header>
          <Icon name="user circle" />
          Add a User
        </Modal.Header>
        <Modal.Content image>
          <ImageDrop
            uploadPhoto={this.props.uploadPhoto}
            user={result === null ? null : user}
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
                onClick={() => this.handleAddUser()}
                type='submit'
                disabled={
                  !(this.state.usernameError === false &&
                  this.state.firstNameError === false &&
                  this.state.lastNameError === false &&
                  this.state.emailError === false &&
                  this.state.mobileNumberError === false)
                }
              >
                Add User
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

module.exports = AddUser;

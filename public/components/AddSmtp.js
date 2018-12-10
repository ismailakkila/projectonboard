var React = require("react");
var { Form, Message, Button, Header, Input, Segment } = require("semantic-ui-react");


class AddSmtp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serverHost: "",
      serverHostValidInput: false,
      serverPort: "",
      serverPortValidInput: false,
      showAuth: false,
      authUsername: "",
      authUsernameValidInput: false,
      authPassword: "",
      authPasswordValidInput: false,
      allowSubmit: false,
      loading: false,
      resultSuccess: null
    };
    this.resetState = this.resetState.bind(this);
    this.validateSubmit = this.validateSubmit.bind(this);
    this.handleServerHost = this.handleServerHost.bind(this);
    this.handleServerPort = this.handleServerPort.bind(this);
    this.handleAuthToggle = this.handleAuthToggle.bind(this);
    this.handleAuthUsername = this.handleAuthUsername.bind(this);
    this.handleAuthPassword = this.handleAuthPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  resetState() {
    this.setState({
      serverHost: "",
      serverHostValidInput: false,
      serverPort: "",
      serverPortValidInput: false,
      allowSubmit: false,
      loading: false,
      resultSuccess: null
    });
  }
  validateInput(input) {
    if (typeof(input) === "string" && input) {
      return true
    }
    else {
      return false;
    }
  }

  validateSubmit(inputs) {
    var result = inputs.reduce(function(result, input) {
      return result && input;
    }, true);
    if (this.state.allowSubmit !== result) {
      this.setState({allowSubmit: result});
    }
  }

  handleServerHost(e) {
    if (this.validateInput(e.target.value)) {
      this.setState({
        serverHost: e.target.value,
        serverHostValidInput: true
      });
      return;
    }
    this.setState({
      serverHost: e.target.value,
      serverHostValidInput: false
    });
  }

  handleServerPort(e) {
    if (this.validateInput(e.target.value)) {
      var serverPort = Number(e.target.value);
      switch(true) {
        case typeof(serverPort) !== "number":
          this.setState({
            serverPort: e.target.value,
            serverPortValidInput: false
          });
          return;
        case Number.isInteger(serverPort) === false:
          this.setState({
            serverPort: e.target.value,
            serverPortValidInput: false
          });
          return;
        case serverPort < 1 || serverPort > 65535:
          this.setState({
            serverPort: e.target.value,
            serverPortValidInput: false
          });
          return;
      }
      this.setState({
        serverPort: e.target.value,
        serverPortValidInput: true
      });
      return;
    }
    this.setState({
      serverPort: e.target.value,
      serverPortValidInput: false
    });
  }

  handleAuthToggle(e, data) {
    var checked = data.checked;
    if (checked) {
      this.setState({showAuth: true});
    }
    else {
      this.setState({
        showAuth: false,
        authUsername: "",
        authPassword: ""
      });
    }
  }

  handleAuthUsername(e) {
    if (this.validateInput(e.target.value)) {
      this.setState({
        authUsername: e.target.value,
        authUsernameValidInput: true
      });
      return;
    }
    this.setState({
      authUsername: e.target.value,
      authUsernameValidInput: false
    });
  }

  handleAuthPassword(e) {
    if (this.validateInput(e.target.value)) {
      this.setState({
        authPassword: e.target.value,
        authPasswordValidInput: true
      });
      return;
    }
    this.setState({
      authPassword: e.target.value,
      authPasswordValidInput: false
    });
  }

  handleSubmit() {
    if (this.state.allowSubmit) {
      this.setState({
        loading: true
      });
      this.props.createEmailProvider({
        type: "smtp",
        serverHost: this.state.serverHost,
        serverPort: this.state.serverPort,
        authRequired: String(this.state.showAuth),
        authUsername: this.state.authUsername || String(null),
        authPassword: this.state.authPassword || String(null)
      });
    }
  }

  componentDidUpdate() {
    if (!this.closed) {
      if (this.state.showAuth) {
        this.validateSubmit([
          this.state.serverHostValidInput,
          this.state.serverPortValidInput,
          this.state.authUsernameValidInput,
          this.state.authPasswordValidInput
        ]);
      }
      else {
        this.validateSubmit([
          this.state.serverHostValidInput,
          this.state.serverPortValidInput
        ]);
      }
      var addEmailProviderView = this.props.addEmailProviderView;
      if (addEmailProviderView !== null) {
        if (addEmailProviderView.status === 200) {
          this.setState({
            loading: false,
            resultSuccess: true
          });
          this.props.resetAddEmailProviderView();
          this.props.toggleEmailPreferences();
        }
        else {
          this.setState({
            loading: false,
            resultSuccess: false
          });
          this.props.resetAddEmailProviderView();
        }
      }
      else {
        if (this.state.resultSuccess !== null) {
          setTimeout(function() {
            if (!this.closed) {
              this.resetState();
            }
          }.bind(this), 2000);
        }
      }
    }
  }

  componentWillUnmount() {
    this.closed = true;
  }

  render() {
    //console.log(this.state);
    return (
      <Segment style={{width: "50%"}} padded={true}>
        <Header>SMTP Server Information</Header>
        <p>Please enter the below details.</p>
        <Form>
          <Form.Group widths='equal'>
            <Form.Field
              onChange={this.handleServerHost}
              id='form-input-control-serverHost'
              control={Input}
              label='Server Host'
              value={this.state.serverHost}
              placeholder='Server Host'
              error={!this.state.serverHostValidInput}
            />
            <Form.Field
              onChange={this.handleServerPort}
              id='form-input-control-serverPort'
              control={Input}
              label='Server Port'
              value={this.state.serverPort}
              placeholder='Server Port'
              error={!this.state.serverPortValidInput}
            />
          </Form.Group>
          <Form.Checkbox
            label='Enable SMTP Authentication'
            onChange={this.handleAuthToggle}
          />
          {
            this.state.showAuth
              ?
                 (
                   <Form.Group widths='equal'>
                     <Form.Field
                       onChange={this.handleAuthUsername}
                       id='form-input-control-authUsername'
                       control={Input}
                       label='Username'
                       value={this.state.authUsername}
                       placeholder='Username'
                       error={!this.state.authUsernameValidInput}
                     />
                     <Form.Field
                       onChange={this.handleAuthPassword}
                       id='form-input-control-authPassword'
                       control={Input}
                       label='Password'
                       value={this.state.authPassword}
                       placeholder='Password'
                       error={!this.state.authPasswordValidInput}
                     />
                   </Form.Group>
                 )
              :
                (null)
          }
          <Button
            loading={this.state.loading}
            onClick={this.handleSubmit}
            disabled={!this.state.allowSubmit}
            type='submit'
          >
            Setup
          </Button>
          {
            this.state.resultSuccess === null
            ? null
            :
              this.state.resultSuccess === true
              ?
                (
                  <Message
                    positive={true}
                    header={"Email Provider Added!"}
                  />
                )
              :
                (
                  <Message
                    negative={true}
                    header={"Cannot Add! Check Email Provider Details"}
                  />
                )
          }
        </Form>
      </Segment>
    )
  }
}

module.exports = AddSmtp;

var React = require("react");
var { Form, Message, Button, Header, Input, Segment } = require("semantic-ui-react");


class AddNexmo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiKey: "",
      apiKeyValidInput: false,
      apiSecret: "",
      apiSecretValidInput: false,
      allowSubmit: false,
      loading: false,
      resultSuccess: null
    };
    this.resetState = this.resetState.bind(this);
    this.validateSubmit = this.validateSubmit.bind(this);
    this.handleApiKey = this.handleApiKey.bind(this);
    this.handleApiSecret = this.handleApiSecret.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  resetState() {
    this.setState({
      apiKey: "",
      apiKeyValidInput: false,
      apiSecret: "",
      apiSecretValidInput: false,
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

  handleApiKey(e) {
    if (this.validateInput(e.target.value)) {
      this.setState({
        apiKey: e.target.value,
        apiKeyValidInput: true
      });
      return;
    }
    this.setState({
      apiKey: e.target.value,
      apiKeyValidInput: false
    });
  }

  handleApiSecret(e) {
    if (this.validateInput(e.target.value)) {
      this.setState({
        apiSecret: e.target.value,
        apiSecretValidInput: true
      });
      return;
    }
    this.setState({
      apiSecret: e.target.value,
      apiSecretValidInput: false
    });
  }

  handleSubmit() {
    if (this.state.allowSubmit) {
      this.setState({
        loading: true
      });
      this.props.createSmsProvider({
        type: "nexmo",
        apiKey: this.state.apiKey,
        apiSecret: this.state.apiSecret
      });
    }
  }

  componentDidUpdate() {
    if (!this.closed) {
      this.validateSubmit([this.state.apiKeyValidInput, this.state.apiSecretValidInput]);
      var addSmsProviderView = this.props.addSmsProviderView;
      if (addSmsProviderView !== null) {
        if (addSmsProviderView.status === 200) {
          this.setState({
            loading: false,
            resultSuccess: true
          });
          this.props.resetAddSmsProviderView();
          this.props.toggleSmsPreferences();
        }
        else {
          this.setState({
            loading: false,
            resultSuccess: false
          });
          this.props.resetAddSmsProviderView();
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
    return (
      <Segment style={{width: "50%"}} padded={true}>
        <Header>API Access Information</Header>
        <p>Please enter the below details.</p>
        <Form>
          <Form.Group widths='equal'>
            <Form.Field
              onChange={this.handleApiKey}
              id='form-input-control-apiKey'
              control={Input}
              label='API Key'
              value={this.state.apiKey}
              placeholder='API Key'
              error={!this.state.apiKeyValidInput}
            />
            <Form.Field
              onChange={this.handleApiSecret}
              id='form-input-control-apiSecret'
              control={Input}
              label='API Secret'
              value={this.state.apiSecret}
              placeholder='API Secret'
              error={!this.state.apiSecretValidInput}
            />
          </Form.Group>
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
                    header={"SMS Provider Added!"}
                  />
                )
              :
                (
                  <Message
                    negative={true}
                    header={"Cannot Add! Check SMS Provider Details"}
                  />
                )
          }
        </Form>
      </Segment>
    )
  }
}

module.exports = AddNexmo;

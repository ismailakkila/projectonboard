var React = require("react");
var { Form, Message, Button, Header, Input, Segment } = require("semantic-ui-react");


class AddMessageBird extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessKey: "",
      accessKeyValidInput: false,
      allowSubmit: false,
      loading: false,
      resultSuccess: null
    };
    this.handleAccessKey = this.handleAccessKey.bind(this);
    this.resetState = this.resetState.bind(this);
    this.validateSubmit = this.validateSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  resetState() {
    this.setState({
      accessKey: "",
      accessKeyValidInput: false,
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

  handleAccessKey(e) {
    if (this.validateInput(e.target.value)) {
      this.setState({
        accessKey: e.target.value,
        accessKeyValidInput: true
      });
      return;
    }
    this.setState({
      accessKey: e.target.value,
      accessKeyValidInput: false
    });
  }

  handleSubmit() {
    if (this.state.allowSubmit) {
      this.setState({
        loading: true
      });
      this.props.createSmsProvider({
        type: "messagebird",
        accessKey: this.state.accessKey
      });
    }
  }

  componentDidUpdate() {
    if (!this.closed) {
      this.validateSubmit([this.state.accessKey]);
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
              onChange={this.handleAccessKey}
              id='form-input-control-accessKey'
              control={Input}
              label='Access Key'
              value={this.state.accessKey}
              placeholder='Access Key'
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

module.exports = AddMessageBird;

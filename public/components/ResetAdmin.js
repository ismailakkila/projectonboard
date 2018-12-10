var React = require("react");
var { Popup, Button, Form, Grid, Header, Image, Segment } = require("semantic-ui-react");

var passwordValidator = require('password-validator');

class ResetAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      retypePassword: "",
      validUsername: null,
      validPassword: null
    };
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleRetypePassword = this.handleRetypePassword.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  validateUsername(username) {
    var schema = new passwordValidator();
    schema
      .is().min(4)
      .has().not().spaces();
    return schema.validate(username);
  }

  validatePassword(password) {
    var schema = new passwordValidator();
    schema
      .is().min(8)
      .is().max(64)
      .has().uppercase()
      .has().lowercase()
      .has().digits()
      .has().not().spaces();
    return schema.validate(password);
  }

  handleUsername(e) {
    if (e.target.value) {
      var validUsername = this.validateUsername(e.target.value);
      this.setState({validUsername: validUsername});
    }
    else {
      this.setState({validUsername: null});
    }
    this.setState({username: e.target.value});
  }

  handlePassword(e) {
    if (e.target.value) {
      var validPassword = this.validatePassword(e.target.value);
      this.setState({validPassword: validPassword});
    }
    else {
      this.setState({validPassword: null});
    }
    this.setState({password: e.target.value});
  }

  handleRetypePassword(e) {
    this.setState({retypePassword: e.target.value});
  }

  handleCreate() {
    this.props.createAdminUser({
      username: this.state.username,
      password: this.state.password
    });
    this.setState({
      username: "",
      password: "",
      retypePassword: "",
      validUsername: null,
      validPassword: null
    });
  }

  render() {
    return (
      <div className='login-form'>
      <style>{`
        body > div,
        body > div > div,
        body > div > div > div.login-form {
          height: 100%;
        }
      `}</style>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
              <Image src='/images/logo.png' /> Create an admin account
            </Header>
            <Form size='large'>
              <Segment stacked>
                <Form.Input
                  onChange={(e)=>this.handleUsername(e)}
                  error={this.state.validUsername === false}
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder='Username'
                  value={this.state.username}
                />
                <Popup
                  trigger={<Form.Input
                    onChange={(e)=>this.handlePassword(e)}
                    error={this.state.validPassword === false  || this.state.password !== this.state.retypePassword}
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Password'
                    type='password'
                    value={this.state.password}
                  />}
                  position="right center"
                  style={{color: "black", height: "150px"}}
                >
                  <div>
                    Password Criteria:
                      <ul>
                        <li>8 Characters Minimum</li>
                        <li>At Least 1 Uppercase and 1 Lowercase Letter</li>
                        <li>At Least 1 Digit</li>
                        <li>No Spaces</li>
                      </ul>
                  </div>
                </Popup>
                <Form.Input
                  onChange={(e)=>this.handleRetypePassword(e)}
                  error={this.state.validPassword === false || this.state.password !== this.state.retypePassword}
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Retype Password'
                  type='password'
                  value={this.state.retypePassword}
                />
                <Button
                  onClick={()=>this.handleCreate()}
                  disabled={!this.state.validUsername || !this.state.validPassword || this.state.password !== this.state.retypePassword}
                  color='teal'
                  fluid size='large'
                >
                  Create
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

module.exports = ResetAdmin;

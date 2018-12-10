var React = require("react");
var { Button, Form, Grid, Header, Image, Message, Segment } = require("semantic-ui-react");

var FullPageLoading = require("./FullPageLoading");

class LoginAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleUsername(e) {
    this.setState({username: e.target.value});
  }

  handlePassword(e) {
    this.setState({password: e.target.value});
  }

  handleLogin() {
    this.props.loginAdminUser({
      username: this.state.username,
      password: this.state.password
    });
    this.setState({
      username: "",
      password: ""
    });
  }

  render() {
    var validCredentials = this.props.validCredentials;
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
              <Image src='/images/logo.png' /> Login to your account
            </Header>
            <Form size='large'>
              <Segment stacked>
                <Form.Input
                  onChange={(e)=>this.handleUsername(e)}
                  value={this.state.username}
                  fluid icon='user'
                  iconPosition='left'
                  placeholder='Username'
                />
                <Form.Input
                  onChange={(e)=>this.handlePassword(e)}
                  value={this.state.password}
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                />
                <Button
                  onClick={()=>this.handleLogin()}
                  color='teal'
                  fluid
                  size='large'
                >
                  Login
                </Button>
              </Segment>
            </Form>
            {
              validCredentials === false
                ?
                  (
                    <Message color='red'>
                      Invalid Credentials!
                    </Message>
                  )
                : null
            }
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

module.exports = LoginAdmin;

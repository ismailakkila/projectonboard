var React = require("react");
var { Item, Container, Icon, Button, Dropdown, Image, Menu, Segment, Message, Pagination } = require("semantic-ui-react");

var FullPageLoading = require("./FullPageLoading");
var User = require("./User");
var SearchUsers = require("./SearchUsers");
var AddUser = require("./AddUser");
var Sms = require("./Sms");
var Email = require("./Email");

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, activePage: 1, openSms: false};
    props.getUsers();
    this.handleLogout = this.handleLogout.bind(this);
    this.handleOnPageChange = this.handleOnPageChange.bind(this);
  }

  handleLogout() {
    this.props.logoutAdminUser();
  }

  handleOnPageChange(e, props) {
    this.setState({activePage: props.activePage});
  }

  componentDidMount() {
    setTimeout(function() {
      this.setState({loading: false});
    }.bind(this), 300);
  }

  render() {
    var loading = this.state.loading;
    var users = this.props.user;
    var deleteUser = this.props.deleteUser;
    var modifyUser = this.props.modifyUser;
    var searchResults = this.props.searchResults;
    var getUsers = this.props.getUsers;
    var updateUserView = this.props.updateUserView;
    var resetUpdateUserView = this.props.resetUpdateUserView;
    var uploadPhoto = this.props.uploadPhoto;
    var uploadPhotoView = this.props.uploadPhotoView;
    var resetUploadPhotoView = this.props.resetUploadPhotoView;
    var sendSms = this.props.sendSms;
    var sendEmail = this.props.sendEmail;
    var sms = this.props.sms;
    var email = this.props.email;
    var usersJsx;
    if (users !== null) {
      usersJsx = users.map(function(user) {
        return (
          <User
            key={user._id}
            user={user}
            deleteUser={deleteUser}
            modifyUser={modifyUser}
            updateUserView={updateUserView}
            resetUpdateUserView={resetUpdateUserView}
            uploadPhoto={uploadPhoto}
            uploadPhotoView={uploadPhotoView}
            resetUploadPhotoView={resetUploadPhotoView}
            sendSms={sendSms}
            sendEmail={sendEmail}
            sms={sms}
            email={email}
          />
        );
      });
    }
    if (loading) {
      return (
        <FullPageLoading />
      );
    }
    else {
      return (
        <div>
          <Menu fixed='top' inverted>
            <Container>
              <Menu.Item as='a' href="/" header>
                <Image size='mini' src='/images/logo.png' style={{ marginRight: '1.5em' }} />
                Project Onboard
              </Menu.Item>
              <Menu.Item>
                <SearchUsers
                  getUsers={getUsers}
                  searchResults={searchResults}
                  users={users}
                />
              </Menu.Item>
              <Menu.Item position='right'>
                <AddUser
                  addUserView={this.props.addUserView}
                  createUser={this.props.createUser}
                  uploadPhoto={this.props.uploadPhoto}
                  resetAddUserView={this.props.resetAddUserView}
                  uploadPhotoView={this.props.uploadPhotoView}
                  resetUploadPhotoView={this.props.resetUploadPhotoView}
                />
                <Dropdown item simple text='Settings'>
                  <Dropdown.Menu>
                    <Email
                      email={this.props.email}
                      addEmailProviderView={this.props.addEmailProviderView}
                      resetAddEmailProviderView={this.props.resetAddEmailProviderView}
                      getEmailProviders={this.props.getEmailProviders}
                      createEmailProvider={this.props.createEmailProvider}
                      deleteEmailProvider={this.props.deleteEmailProvider}
                      getEmailTemplates={this.props.getEmailTemplates}
                      addEmailTemplateView={this.props.addEmailTemplateView}
                      createEmailTemplate={this.props.createEmailTemplate}
                      deleteEmailTemplate={this.props.deleteEmailTemplate}
                      modifyEmailTemplate={this.props.modifyEmailTemplate}
                      resetAddEmailTemplateView={this.props.resetAddEmailTemplateView}
                    />
                    <Sms
                      sms={this.props.sms}
                      addSmsProviderView={this.props.addSmsProviderView}
                      resetAddSmsProviderView={this.props.resetAddSmsProviderView}
                      getSmsProviders={this.props.getSmsProviders}
                      createSmsProvider={this.props.createSmsProvider}
                      deleteSmsProvider={this.props.deleteSmsProvider}
                      getSmsTemplates={this.props.getSmsTemplates}
                      addSmsTemplateView={this.props.addSmsTemplateView}
                      createSmsTemplate={this.props.createSmsTemplate}
                      deleteSmsTemplate={this.props.deleteSmsTemplate}
                      modifySmsTemplate={this.props.modifySmsTemplate}
                      resetAddSmsTemplateView={this.props.resetAddSmsTemplateView}
                    />
                  </Dropdown.Menu>
                </Dropdown>
                <Button onClick={()=>this.handleLogout()}as='a' inverted style={{marginLeft: "0.5em"}}>
                  Logout
                </Button>
              </Menu.Item>
            </Container>
          </Menu>
          <Container text style={{ marginTop: '7em' }}>
            <Segment raised>
              <Item.Group style={{backgroundColor: "white"}} divided>
                {
                  usersJsx
                    ?
                      users.length === 0
                        ?
                          (
                            <Message
                              icon='user outline'
                              header='No users found.'
                            />
                          )
                        : (usersJsx.slice((this.state.activePage * 10) - 10, this.state.activePage * 10))
                    :
                      (
                        <Message style={{width: "100%"}} icon warning>
                          <Icon name="warning circle" />
                          <Message.Header>Something Went Wrong!</Message.Header>
                        </Message>
                      )
                }
              </Item.Group>
            </Segment>
            <div style={{textAlign: "center"}}>
              <Pagination
                onPageChange={this.handleOnPageChange}
                defaultActivePage={1}
                totalPages={Math.ceil(usersJsx.length/ 10)}
              />
            </div>
          </Container>
        </div>
      );
    }
  }
}

module.exports = Main;

var React = require("react");
var { SemanticToastContainer, toast } = require("react-semantic-toasts");
var { Item, Button, Icon, Modal } = require("semantic-ui-react");

var lodash = require("lodash");

var UserCard = require("./UserCard");
var ModifyUser = require("./ModifyUser");

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDelete: false,
      sendSmsLoading: false,
      sendEmailLoading: false,
      activatedSmsNotification: false,
      activatedEmailNotification: false,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEnableDisableUser = this.handleEnableDisableUser.bind(this);
    this.handleOnboard = this.handleOnboard.bind(this);
  }

  handleEnableDisableUser() {
    this.props.modifyUser(this.props.user._id, {enabled: String(!this.props.user.enabled)});
  }

  handleDelete(input) {
    this.props.deleteUser(input);
    this.setState({openDelete: false});
  }

  handleOnboard() {
    var sms = this.props.sms;
    if (sms.smsProviders.length > 0 && sms.smsTemplates.length > 0) {
      var smsProviderId = sms.smsProviders[0]._id;
      var input = {
        _id: this.props.user._id,
        smsProviderId: smsProviderId
      };
      this.props.sendSms(input);
      this.setState({
        sendSmsLoading: true
      });
    }
    var email = this.props.email;
    if (email.emailProviders.length > 0 && email.emailTemplates.length > 0) {
      var emailProviderId = email.emailProviders[0]._id;
      var input = {
        _id: this.props.user._id,
        emailProviderId: emailProviderId
      };
      this.props.sendEmail(input);
      this.setState({
        sendEmailLoading: true
      });
    }
  }

  componentDidUpdate() {
    var sms = this.props.sms;
    var email = this.props.email;

    var smsSendResult = sms.smsSendResult.filter(function(result) {
      return result.userId === this.props.user._id;
    }.bind(this));
    if (smsSendResult.length === 1 && !this.state.activatedSmsNotification && this.state.sendSmsLoading) {
      toast({
          title: "SMS Sent!",
          description: this.props.user.mobileNumber,
          type: "success",
          time: 10000
        });
      this.setState({sendSmsLoading: false});
    }
    if (smsSendResult.length === 0 && !this.state.activatedSmsNotification && this.state.sendSmsLoading) {
      setTimeout(function() {
        this.setState({sendSmsLoading: false});
      }.bind(this), 10000);
    }
    if (smsSendResult.length === 0 && this.state.activatedSmsNotification) {
      this.setState({
        activatedSmsNotification: false
      });
    }

    var emailSendResult = email.emailSendResult.filter(function(result) {
      return result.userId === this.props.user._id;
    }.bind(this));
    if (emailSendResult.length === 1 && !this.state.activatedEmailNotification && this.state.sendEmailLoading) {
      switch(emailSendResult[0].type) {
        case "smtpTest":
          toast({
              title: "Preview Sent Email",
              description: emailSendResult[0].previewUrl,
              type: "success",
              time: 10000
            });
          this.setState({sendEmailLoading: false});
          break;
        default:
          toast({
              title: "Email Sent!",
              description: this.props.user.email,
              type: "success",
              time: 10000
            });
          this.setState({sendEmailLoading: false});
          break;
      }
    }
    if (emailSendResult.length === 0 && !this.state.activatedEmailNotification && this.state.sendEmailLoading) {
      setTimeout(function() {
        this.setState({sendEmailLoading: false});
      }.bind(this), 10000);
    }
    if (emailSendResult.length === 0 && this.state.activatedEmailNotification) {
      this.setState({
        activatedEmailNotification: false
      });
    }
  }

  render() {
    var openDelete = this.state.openDelete;
    var user = this.props.user;
    var modifyUser = this.props.modifyUser;
    var updateUserView = this.props.updateUserView;
    var resetUpdateUserView = this.props.resetUpdateUserView;
    var uploadPhoto = this.props.uploadPhoto;
    var uploadPhotoView = this.props.uploadPhotoView;
    var resetUploadPhotoView = this.props.resetUploadPhotoView;

    var sms = this.props.sms;
    var email = this.props.email;

    var smsTemplates = sms.smsTemplates;
    var defaultSmsTemplate = smsTemplates.filter(function(smsTemplate) {
      return smsTemplate.isDefault === true;
    });
    var emailTemplates = email.emailTemplates;
    var defaultEmailTemplate = emailTemplates.filter(function(emailTemplate) {
      return emailTemplate.isDefault === true;
    });

    var smsSendResult = sms.smsSendResult.filter(function(result) {
      return result.userId === user._id;
    });
    var smsSendReport = null;
    if (smsSendResult.length === 1) {
      smsSendReport = smsSendResult[0];
    }

    var emailSendResult = email.emailSendResult.filter(function(result) {
      return result.userId === user._id;
    });
    var emailSendReport = null;
    if (emailSendResult.length === 1) {
      emailSendReport = emailSendResult[0];
    }

    return (
      <Item style={{filter: blur("20px")}}>
        <Item.Image
          style={user.enabled ? null : {opacity: "0.2"}}
          size="tiny"
          src={'/images/users/' + user._id + ".png"}
        />
        <Item.Content verticalAlign="middle">
          <Item.Meta style={{color: "black"}}>{lodash.startCase(user.firstName + " " + user.lastName)}</Item.Meta>
          <Item.Meta>{user.email}</Item.Meta>
          <Item.Extra>
            <Button
              onClick={()=>this.setState({openDelete: true})}
              size="mini"
              floated="right"
              animated
            >
              <Button.Content
                visible>
                <Icon name='delete' />
              </Button.Content>
              <Button.Content hidden>Delete</Button.Content>
            </Button>
            <ModifyUser
              user={user}
              modifyUser={modifyUser}
              updateUserView={updateUserView}
              resetUpdateUserView={resetUpdateUserView}
              uploadPhoto={uploadPhoto}
              uploadPhotoView={uploadPhotoView}
              resetUploadPhotoView={resetUploadPhotoView}
            />
            <UserCard user={user} />
            <Button
              active={user.enabled}
              compact
              size="mini"
              color={user.enabled ? 'teal' : null}
              icon='user outline'
              content={user.enabled ? "Enabled" : "Disabled"}
              onClick={()=>this.handleEnableDisableUser()}
            />
            <Button
              disabled={
                !user.enabled ||
                (sms.smsProviders.length === 0 && email.emailProviders.length === 0) ||
                (defaultSmsTemplate.length !== 1 && defaultEmailTemplate.length !== 1)
              }
              compact
              size="mini"
              color={user.enabled ? 'teal' : null}
              icon={
                smsSendReport !== null && emailSendReport !== null
                  ? "check"
                  : "mail"
              }
              loading={this.state.sendSmsLoading || this.state.sendEmailLoading}
              content="Onboard"
              onClick={()=>this.handleOnboard()}
            />
            <SemanticToastContainer />
            <Modal
              open={openDelete}
              onClose={()=>this.setState({openDelete: false})}
            >
              <Modal.Header>Delete This User</Modal.Header>
              <Modal.Content>
                <p>Are you sure you want to delete this user?</p>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={()=>this.setState({openDelete: false})} negative>
                  No
                </Button>
                <Button
                  onClick={() => this.handleDelete({_id: user._id})}
                  positive
                  labelPosition='right'
                  icon='checkmark'
                  content='Yes'
                />
              </Modal.Actions>
            </Modal>
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }
}

module.exports = User;

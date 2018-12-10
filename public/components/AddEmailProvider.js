var React = require("react");
var AddSmtp = require("./AddSmtp");
var { Dropdown, Container, Modal, Icon, Image, Menu } = require("semantic-ui-react");

class AddEmailProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: null,
    };
    this.handleEmailTypeClick = this.handleEmailTypeClick.bind(this);
  }

  resetState() {
    this.setState({
      activeItem: null
    });
  }

  handleEmailTypeClick(e, props) {
    this.setState({activeItem: props.name});
  }

  render() {
    var activeItem =  this.state.activeItem;
    return (
      <Modal
        onClose={() => this.resetState()}
        trigger={<Dropdown.Item>Email</Dropdown.Item>}
      >
        <Modal.Header>
          <Icon name="mail" />
          Add an Email Provider
        </Modal.Header>
        <Container style={{display: "inline-block"}}>
          <Menu style={{display: "block", margin: "0 auto"}}>
            <Menu.Item onClick={this.handleEmailTypeClick} name="smtp" as='a'>
              <Image size='small' style={{display: "block", margin: "0 auto"}} src='/images/emailProviders/smtp.png' />
              {
                activeItem === "smtp"
                ?
                  <AddSmtp
                    toggleEmailPreferences={this.props.toggleEmailPreferences}
                    addEmailProviderView={this.props.addEmailProviderView}
                    resetAddEmailProviderView={this.props.resetAddEmailProviderView}
                    createEmailProvider={this.props.createEmailProvider}
                  />
                : null
              }
            </Menu.Item>
          </Menu>
        </Container>
      </Modal>
    );
  }
}

module.exports = AddEmailProvider;

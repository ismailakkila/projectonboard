var React = require("react");
var AddNexmo = require("./AddNexmo");
var AddMessageBird = require("./AddMessageBird");
var { Dropdown, Container, Modal, Icon, Image, Divider, Menu } = require("semantic-ui-react");

class AddSmsProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: null,
    };
    this.handleSmsTypeClick = this.handleSmsTypeClick.bind(this);
  }

  resetState() {
    this.setState({
      activeItem: null
    });
  }

  handleSmsTypeClick(e, props) {
    this.setState({activeItem: props.name});
  }

  render() {
    var activeItem =  this.state.activeItem;
    return (
      <Modal
        onClose={() => this.resetState()}
        trigger={<Dropdown.Item>SMS</Dropdown.Item>}
      >
        <Modal.Header>
          <Icon name="text telephone" />
          Add an SMS Provider
        </Modal.Header>
        <Container style={{display: "inline-block"}}>
          <Menu style={{display: "block", margin: "0 auto"}}>
            <Menu.Item onClick={this.handleSmsTypeClick} name="nexmo" as='a'>
              <Image  size='small' style={{display: "block", margin: "0 auto"}} src='/images/smsProviders/nexmo.png' />
              {
                activeItem === "nexmo"
                ?
                  <AddNexmo
                    toggleSmsPreferences={this.props.toggleSmsPreferences}
                    addSmsProviderView={this.props.addSmsProviderView}
                    resetAddSmsProviderView={this.props.resetAddSmsProviderView}
                    createSmsProvider={this.props.createSmsProvider}
                  />
                : null
              }
            </Menu.Item>
            <Divider />
            <Menu.Item onClick={this.handleSmsTypeClick} name="messageBird" as='a'>
              <Image size='small' style={{display: "block", margin: "0 auto"}} src='/images/smsProviders/messagebird.png' />
              {
                activeItem === "messageBird"
                ?
                  <AddMessageBird
                    toggleSmsPreferences={this.props.toggleSmsPreferences}
                    addSmsProviderView={this.props.addSmsProviderView}
                    resetAddSmsProviderView={this.props.resetAddSmsProviderView}
                    createSmsProvider={this.props.createSmsProvider}
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

module.exports = AddSmsProvider;

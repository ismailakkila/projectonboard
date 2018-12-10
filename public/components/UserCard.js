var React = require("react");
var { Modal, Image, Button, Icon, Card } = require("semantic-ui-react");

var lodash = require("lodash");

class UserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var user = this.props.user;
    return (
      <Modal
        size="mini"
        trigger={
          <Button size="mini" floated="right" animated>
            <Button.Content visible>
              <Icon name='info circle' />
            </Button.Content>
            <Button.Content hidden>Info</Button.Content>
          </Button>
        }>
        <Modal.Content style={{textAlign: "center"}}>
          <Card style={{display: "inline-block"}}>
            <Image
              style={{display: "block", margin: "0 auto"}}
              src={'/images/users/' + user._id + ".png"} />
            <Card.Content style={{textAlign: "left"}}>
              <Card.Header>{lodash.startCase(user.firstName + " " + user.lastName)}</Card.Header>
              <Card.Meta>
                <span>
                  <p>Account created: {new Date(user.createdAt).toDateString()}</p>
                  <p>Last Login: {user.lastLoginAt === null ? "Never" : new Date(user.lastLoginAt).toDateString()}</p>
                </span>
              </Card.Meta>
              <Card.Description>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>Mobile Phone: {user.mobileNumber}</p>
              </Card.Description>
            </Card.Content>
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}

module.exports = UserCard;

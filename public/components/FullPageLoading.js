var React = require("react");
var Dimmer = require("semantic-ui-react").Dimmer;
var Loader = require("semantic-ui-react").Loader;
var Container = require("semantic-ui-react").Container;

var FullPageLoading = function(props) {
  return (
    <Container>
      <Dimmer active>
        <Loader />
      </Dimmer>
    </Container>
  );
};

module.exports = FullPageLoading;

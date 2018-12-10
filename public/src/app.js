var React = require("react");
var ReactDOM = require("react-dom");
var createStore = require("redux").createStore;
var applyMiddleware = require("redux").applyMiddleware;
var connect = require("react-redux").connect;
var Provider = require("react-redux").Provider;
var thunk = require("redux-thunk").default;

var rootReducer = require("./appMappings").rootReducer;
var mapStateToProps = require("./appMappings").mapStateToProps;
var mapDispatchToProps = require("./appMappings").mapDispatchToProps;
var ProjectOnboard = require("../components/ProjectOnboard");

var store = createStore(rootReducer, applyMiddleware(thunk));
var Container = connect(mapStateToProps, mapDispatchToProps)(ProjectOnboard);

var App = function() {
  return (
    <Provider store={store}>
      <Container />
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

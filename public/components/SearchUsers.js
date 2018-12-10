var React = require("react");
var { Search, Grid } = require("semantic-ui-react");

var lodash = require("lodash");

class SearchUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearching: false,
      searchValue: ""
    };
    this.resetState = this.resetState.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  resetState() {
    this.setState({
      isSearching: false,
      searchValue: ""
    });
  }

  handleSearchChange(e, data) {
    var input = e.target.value;
    this.setState({isSearching: true, searchValue: input});
    setTimeout(() => {
      if (this.state.searchValue.length < 1) {
        this.resetState();
        this.props.getUsers();
        return;
      }
      var re = new RegExp(lodash.escapeRegExp(this.state.searchValue), 'i');
      var isMatch = function(user) {
        return re.test(user.firstName) ||
          re.test(user.lastname) ||
          re.test(user.username) ||
          re.test(user.email) ||
          re.test(user.mobileNumber);
      };
      var results = lodash.filter(this.props.users, isMatch);
      this.props.searchResults(results);
      this.setState({
        isSearching: false
      });
    }, 300);
  }

  render() {
    return (
      <Grid>
        <Grid.Column width={6}>
          <Search
            placeholder={"Search.."}
            loading={this.state.isSearching}
            onResultSelect={()=>this.handleResultSelect}
            onSearchChange={lodash.debounce(this.handleSearchChange, 500, {leading: true})}
            value={this.state.searchValue}
            open={false}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

module.exports = SearchUsers;

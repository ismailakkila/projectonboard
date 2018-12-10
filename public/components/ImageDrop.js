var React = require("react");
var { Segment, Message, Icon, Image } = require("semantic-ui-react");
var FileDrop = require("./FileDrop");

class ImageDrop extends React.Component {
  constructor(props) {
    super(props);
    this.closed = false;
    this.state = {
      dragBoxColor: "grey",
      imageURI: null,
      imageRawFile: null,
      imageWarning: false,
      uploadState: null
    };
    this.resetState = this.resetState.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleOnDragOver = this.handleOnDragOver.bind(this);
    this.handleOnDragLeave = this.handleOnDragLeave.bind(this);
  }

  resetState() {
    this.setState({
      dragBoxColor: "grey",
      imageURI: null,
      imageRawFile: null,
      imageWarning: false,
      uploadState: null
    });
  }

  handleDrop(files, e) {
    if (files.length === 1) {
      var fileSize =  files[0].size;
      var fileType = files[0].type;
      if (fileType.split("/")[0] === "image" && fileSize > 0 && fileSize <= 4096000) {
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = function(event) {
          this.setState({
            imageURI: event.target.result,
            imageRawFile: files[0],
            imageWarning: false,
            dragBoxColor: "green",
            uploadState: null
          });
          return;
        }.bind(this);
      }
    }
    this.setState({
      imageURI: null,
      imageRawFile: null,
      imageWarning: true,
      dragBoxColor: "grey",
      uploadState: null
    });
  }

  handleOnDragOver() {
    this.setState({dragBoxColor: "blue"});
  }

  handleOnDragLeave() {
    this.setState({dragBoxColor: "grey"});
  }

  componentDidUpdate() {
    var user = this.props.user;
    var photoUploadResult = this.props.uploadPhotoView;
    var uploadState = this.state.uploadState;
    //Start Photo Upload
    if (user && !photoUploadResult && !uploadState && (this.state.imageRawFile && !this.state.imageWarning)) {
      this.props.uploadPhoto(user._id, this.state.imageRawFile);
      this.setState({uploadState: "in-progress"});
      return;
    }
    //Photo Upload Started. Need to check result
    if (user && photoUploadResult && uploadState === "in-progress" && (this.state.imageRawFile && !this.state.imageWarning)) {
      var status = photoUploadResult.status;
      switch(status) {
        case 200:
          this.setState({uploadState: "success"});
          setTimeout(function() {
            this.props.resetUploadPhotoView();
            if (!this.closed) {
              this.resetState();
            }
            return;
          }.bind(this), 3000);
          return;
        default:
          this.setState({uploadState: "failed"});
          setTimeout(function() {
            this.props.resetUploadPhotoView();
            if (!this.closed) {
              this.resetState();
            }
            return;
          }.bind(this), 3000);
      }
    }
  }

  componentWillUnmount() {
    this.closed = true;
  }

  render() {
    return (
      <FileDrop
        style={{padding: "15px"}}
        onDrop={this.handleDrop}
        onDragOver={this.handleOnDragOver}
        onDragLeave={this.handleOnDragLeave}
      >
        <Segment>
          {
            this.state.imageURI !== null
              ?
                (
                  <Image src={this.state.imageURI} size='medium' />
                )
              :
               (
                 <Message
                   color={this.state.dragBoxColor}
                   style={{height: "200px"}}
                   icon
                 >
                  <Icon name='file image' size="massive" />
                  <Message.Content>
                    <Message.Header>User Photo</Message.Header>
                      Drag a photo here for this user.
                    </Message.Content>
                  </Message>
                )
          }
          {this.state.imageWarning
            ?
              (
                <Message icon color="red">
                  <Icon name='warning' />
                  <Message.Content>
                    <Message.Header>Bad Image! Select an image less than 4MB</Message.Header>
                  </Message.Content>
                </Message>
              )
            : this.state.imageURI !== null
              ? this.state.uploadState === null
                ?
                  (
                    <Message icon color="green">
                      <Icon name='check' />
                      <Message.Content>
                        <Message.Header>Valid Image!</Message.Header>
                      </Message.Content>
                    </Message>
                  )
                : this.state.uploadState === "in-progress"
                  ?
                    (
                      <Message icon color="green">
                        <Icon name='check' />
                        <Message.Content>
                          <Message.Header>Uploading Image!</Message.Header>
                        </Message.Content>
                      </Message>
                    )
                  : this.state.uploadState === "success"
                    ?
                      (
                        <Message icon color="green">
                          <Icon name='check' />
                          <Message.Content>
                            <Message.Header>Uploaded Image!</Message.Header>
                          </Message.Content>
                        </Message>
                      )
                    :
                      (
                        <Message icon color="red">
                          <Icon name='warning' />
                          <Message.Content>
                            <Message.Header>Failed to Upload Image!</Message.Header>
                          </Message.Content>
                        </Message>
                      )
              :
                (
                  <Message icon color="grey">
                    <Icon name='upload' />
                    <Message.Content>
                      <Message.Header>Image Upload</Message.Header>
                    </Message.Content>
                  </Message>
                )
          }
        </Segment>
      </FileDrop>
    );
  }
}

module.exports = ImageDrop;

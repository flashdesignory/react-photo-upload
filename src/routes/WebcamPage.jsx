import React, { Component } from 'react';
import './WebcamPage.scss';

class WebcamPage extends Component{
  constructor(props){
    super(props);
    this.checkSupport();
    this.state = {
      imageData:null,
      isAvailable:false,
      error: ""
    }
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnPlay = this.handleOnPlay.bind(this);
    this.handleOnPause = this.handleOnPause.bind(this);
  }
  checkSupport(){
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.webcamSupported = true;
    }else{
      this.webcamSupported = false;
    }
  }
  displayVideo(){
    let video = this.refs.videoElement;
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(err => {
      console.log("error: " + err)
      this.setState({
        error: err.message
      })
    });
  }
  takePicture(){
    let video = this.refs.videoElement;
    let scale = 1;

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    let context = canvas.getContext('2d');
    context.translate(video.videoWidth, 0);
    context.scale(-1,1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    let data = canvas.toDataURL();
    let image = new Image();
    image.src = data;

    this.props.setImageData(image);
    this.setState({imageData : image})
  }
  handleOnPlay(e){
    console.log("handleOnPlay()");
    this.setState({
      isAvailable:true
    })
  }
  handleOnPause(e){
    console.log("handleOnPause()");
    this.setState({
      isAvailable:false
    })
  }
  handleOnClick(e){
    console.log('handleOnClick()');
    switch(e.target.id){
      case "snap-button":
        this.takePicture();
        break;
      case "retake-button":
        this.setState({
          imageData:null,
          error: ""
        }, this.displayVideo);
        break;
      case "next-button":
        this.props.history.push('/edit');
        break;
    }
  }
  componentDidMount(){
    this.displayVideo();
  }
  displayActionButton(){
    if(this.state.imageData){
      return (
        <button className="button wide retake"
          id="retake-button"
          onClick={this.handleOnClick}>
          <span className="icon-refresh button-icon"></span>
          <span className="button-text">retake picture</span>
        </button>
      )
    }else{
      return (
        <button className={ this.state.isAvailable ? "button wide snap" : "button wide snap disabled"}
          id="snap-button"
          onClick={this.handleOnClick}>
          <span className="icon-camera button-icon"></span>
          <span className="button-text">snap picture</span>
        </button>
      )
    }
  }
  render(){
    return (
      <div className="page webcam">
        <div className="buttons-container">
          <div className="action-buttons">
            {this.displayActionButton()}
          </div>
          <div className="navigation-buttons">
            <button className={ this.state.imageData ? "button wide next" : "button wide next disabled"}
              id="next-button"
              onClick={this.handleOnClick}>
              <span className="icon-arrow-right button-icon"></span>
              <span className="button-text">next</span>
            </button>
          </div>
        </div>
        <div className="image-container">
          <div className="image-content">
            {
              this.state.imageData ?
              <img src={ this.state.imageData.src }/> :
                <video id="video" ref="videoElement"
                  width="1280" height="720"
                  autoPlay
                  onPlaying={this.handleOnPlay}
                  onPause={this.handleOnPause}></video>
              }
            </div>
            <div className="error">{ this.state.error }</div>
          </div>
        </div>
      )
    }
  }
  export default WebcamPage;

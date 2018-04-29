import React, { Component } from 'react';
import './WebcamPage.scss';

class WebcamPage extends Component{
  constructor(props){
    super(props);
    this.checkSupport();
    this.state = {
      imageData:null,
      error: ""
    }
    this.handleOnClick = this.handleOnClick.bind(this);
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
        canvas.getContext('2d')
              .drawImage(video, 0, 0, canvas.width, canvas.height);

    this.setState({
      imageData : canvas.toDataURL()
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
          <span className="icon-camera button-icon"></span>
          <span className="button-text">retake picture</span></button>
      )
    }else{
      return (
        <button className="button wide snap"
          id="snap-button"
          onClick={this.handleOnClick}>
          <span className="icon-camera button-icon"></span>
          <span className="button-text">snap picture</span></button>
      )
    }
  }
  render(){
    return (
      <div className="page webcam">
        {this.displayActionButton()}

          <div className="image-container">
            <div className="image-content">
              {
                this.state.imageData ?
                <img src={ this.state.imageData }/> :
                <video id="video" ref="videoElement" width="100%" height="100%" autoPlay></video>
              }
            </div>
            <div className="error">{ this.state.error }</div>
          </div>

      </div>
    )
  }
}
export default WebcamPage;

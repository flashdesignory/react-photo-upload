import React, { Component } from 'react';
import './SplashPage.scss';

class SplashPage extends Component{
  constructor(props){
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(e){
    e.preventDefault();
    let id=e.target.id;
    console.log("handleOnClick(" + id + ", " + this.props.location + ")")
    switch(id){
      case "upload-button":
        this.props.history.push('/upload');
        break;
      case "webcam-button":
        this.props.history.push('/webcam');
        break;
    }
  }

  render(){
    return (
      <div className="page splash">
        <button className="button wide upload"
          id="upload-button"
          onClick={this.handleOnClick}>
          <span className="icon-picture button-icon"></span>
          <span className="button-text">upload image</span></button>
        <button className="button wide webcam"
          id="webcam-button"
          onClick={this.handleOnClick}>
          <span className="icon-camera button-icon"></span>
          <span className="button-text">use webcam</span></button>
      </div>
    )
  }
}

export default SplashPage;

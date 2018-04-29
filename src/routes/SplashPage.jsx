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
        <button className="button block upload" id="upload-button" onClick={this.handleOnClick}>upload image</button>
        <button className="button block webcam" id="webcam-button" onClick={this.handleOnClick}>use webcam</button>
      </div>
    )
  }
}

export default SplashPage;

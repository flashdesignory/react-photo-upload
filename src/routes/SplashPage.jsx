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
    }
  }

  render(){
    return (
      <div className="page splash">
        <div className="buttons-container">
          <div className="navigation-buttons">
            <button className="button wide upload"
              id="upload-button"
              onClick={this.handleOnClick}>
              <span className="button-text">Start</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default SplashPage;

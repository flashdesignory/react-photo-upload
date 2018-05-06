import React, { Component } from 'react';
import './ResultPage.scss';

class ResultPage extends Component{
  constructor(props){
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }
  componentDidMount(){
    //console.log(this.props.imageData);
  }
  handleOnClick(e){
    console.log('handleOnClick()');
    switch(e.target.id){
      case "next-button":
        this.props.history.push('/');
        break;
      case "save-button":
        e.target.href = this.props.imageData.src;
        e.target.download = "myphoto.png";
        break;
    }
  }
  render(){
    return (
      <div className="page result">
        <div className="buttons-container">
          <div className="action-buttons">
            <a className={ this.props.imageData ? "button wide save" : "button wide save disabled" }
              id="save-button"
              onClick={this.handleOnClick}>
              <span className="icon-folder-download button-icon"></span>
              <span className="button-text">save</span>
            </a>
          </div>
          <div className="navigation-buttons">
            <button className={ this.props.imageData ? "button wide next" : "button wide next disabled" }
              id="next-button"
              onClick={this.handleOnClick}>
              <span className="icon-arrow-right button-icon"></span>
              <span className="button-text">restart</span>
            </button>
          </div>
        </div>
      <div className="image-container">
        <div className="image-content">
          {this.props.imageData ? <img src={ this.props.imageData.src }/> : null}
        </div>
      </div>
    </div>
    )
  }
}

export default ResultPage;

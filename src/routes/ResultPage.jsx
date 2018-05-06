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
    }
  }
  render(){
    return (
      <div className="page result">
        <div className="buttons-container">
          <div className="action-buttons">
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

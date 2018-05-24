import React, { Component } from 'react';
import './ResultPage.scss';

class ResultPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      currentFilter: ""
    }
    this.handleOnClick = this.handleOnClick.bind(this);
  }
  componentDidMount(){
    this.drawUserCanvas();
  }
  handleOnClick(e){
    console.log('handleOnClick()');
    switch(e.target.id){
      case "prev-button":
        this.props.setImageData('result', null);
        this.props.history.goBack();
        break;
      case "next-button":
        this.props.setImageData('', null);
        this.props.history.push('/upload');
        break;
      case "save-button":
        //e.target.href = this.props.imageData.image.src;
        e.target.href = this.refs.inputCanvas.toDataURL('image/png');
        e.target.download = "myphoto.png";
        break;
    }
  }
  drawUserCanvas(type = ""){
    console.log("drawUserCanvas()");
    let inputCanvas = this.refs.inputCanvas;
    let inputContext = inputCanvas.getContext("2d");
    let imageData = this.props.imageData.image;
    let inputWidth = imageData.width;
    let inputHeight = imageData.height;
    inputContext.canvas.width = inputWidth;
    inputContext.canvas.height = inputHeight;
    inputContext.clearRect(0, 0, inputWidth, inputHeight)
    inputContext.drawImage(imageData, 0, 0);
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
          <div className="navigation-buttons row">
            <button className="button half prev"
              id="prev-button"
              onClick={this.handleOnClick}>
              <span className="icon-arrow-left button-icon"></span>
              <span className="button-text">prev</span>
            </button>
            <button className="button half next"
              id="next-button"
              onClick={this.handleOnClick}>
              <span className="button-text">again</span>
              <span className="icon-arrow-right button-icon"></span>
            </button>
          </div>
        </div>
      <div className="image-container">
        <div className="image-content">
          {this.props.imageData ? <img src={ this.props.imageData.image.src } className="image-invisible"/> : null}
          <canvas id="input-canvas" ref="inputCanvas"></canvas>
        </div>
      </div>
    </div>
    )
  }
}

export default ResultPage;

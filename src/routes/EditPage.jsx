import React, { Component } from 'react';
import Preloader from '../modules/preloader/Preloader';
import './EditPage.scss';

const ROTATION_STEP = 5;
const SCALE_STEP = 0.1;
const MIN_SCALE = 0.2;
const MAX_SCALE = 1.5;
const TO_RADIANS = Math.PI/180;

class EditPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      editing: false,
      processing: false,
      completed: false,
      isMoving: false
    }

    this.rotation = 0;
    this.scale = 1;

    this.startX = 0;
    this.startY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.currentX = 0;
    this.currentY = 0;

    this.handleOnClick = this.handleOnClick.bind(this);

    this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
    this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
    this.handleOnMouseUp = this.handleOnMouseUp.bind(this);
  }
  componentDidMount(){
    console.log(this.props.imageData.width, this.props.imageData.height);
    this.rotation = 0;
    this.drawUserCanvas();
    this.setState({
      editing: true
    })
  }
  handleOnMouseDown(e){
    console.log("handleOnMouseDown()");
    console.log(e.target);
    if(e.touches){
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
    }else{
      this.startX = e.pageX;
      this.startY = e.pageY;
    }
    this.setState({
      isMoving: true
    }, this.handleOnMouseMove(e));
  }
  handleOnMouseMove(e){
    if(!this.state.isMoving){
      e.preventDefault();
      return;
    }

    if(e.touches){
      this.offsetX = e.touches[0].pageX - this.startX;
      this.offsetY = e.touches[0].pageY - this.startY;
    }else{
      this.offsetX = e.pageX - this.startX;
      this.offsetY = e.pageY - this.startY;
    }

    this.drawUserCanvas();
  }
  handleOnMouseUp(e){
    console.log("handleOnMouseUp()");
    this.currentX += this.offsetX;
    this.currentY += this.offsetY;
    this.offsetX = 0;
    this.offsetY = 0;

    this.setState({
      isMoving: false
    })
  }
  handleOnClick(e){
    console.log('handleOnClick(' + e.target.id + ')');
    switch(e.target.id){
      case "prev-button":
        this.props.history.goBack();
        break;
      case "next-button":
        this.props.history.push('/result');
        break;
      case "rotate-left-button":
        this.rotation -= ROTATION_STEP;
        this.drawUserCanvas();
        break;
      case "rotate-right-button":
        this.rotation += ROTATION_STEP;
        this.drawUserCanvas();
        break;
      case "zoom-in-button":
        this.scale += SCALE_STEP;
        if(this.scale > MAX_SCALE) this.scale = MAX_SCALE;
        this.drawUserCanvas();
        break;
      case "zoom-out-button":
        this.scale -= SCALE_STEP;
        if(this.scale < MIN_SCALE) this.scale = MIN_SCALE;
        this.drawUserCanvas();
        break;
    }
  }
  drawUserCanvas(){
    var inputCanvas = this.refs.inputCanvas;
    var inputContext = inputCanvas.getContext("2d");

    inputContext.canvas.width = this.props.imageData.width;
    inputContext.canvas.height = this.props.imageData.height;

    inputContext.translate(
      (this.props.imageData.width/2)+this.currentX + this.offsetX,
      (this.props.imageData.height/2)+this.currentY+this.offsetY
    );

    inputContext.scale(this.scale, this.scale);
    inputContext.rotate(this.rotation * TO_RADIANS);

    inputContext.drawImage(
      this.props.imageData,
      -(this.props.imageData.width/2),
      -(this.props.imageData.height/2),
      this.props.imageData.width,
      this.props.imageData.height
    );
  }
  displayCanvas(){
    const { processing, completed } = this.state;
    return (
      <div className="image-content"
        onMouseDown={ this.handleOnMouseDown }
        onMouseMove={ this.handleOnMouseMove }
        onMouseUp={ this.handleOnMouseUp }
        onTouchStart={ this.handleOnMouseDown }
        onTouchMove={ this.handleOnMouseMove }
        onTouchEnd={ this.handleOnMouseUp }
        ref="imageContainer">
        <canvas id="input-canvas" ref="inputCanvas"
          className={processing || completed ? "canvas-hidden" : "canvas-visible"}>
        </canvas>
        <canvas id="output-canvas" ref="outputCanvas"
          className={completed ? "canvas-visible" : "canvas-hidden"}>
        </canvas>
        <canvas id="buffer-canvas" ref="bufferCanvas"
          className="canvas-hidden">
        </canvas>
        <img src="files/images/head.png" id="image-outline" ref="imageOutline"
          className={ processing || completed ? "image-hidden" : "image-visible"}/>
        {processing && <Preloader />}
      </div>
    )
  }
  render(){
    return (
      <div className="page edit">
        <div className="buttons-container">
          <div className="action-buttons">
            <button className={ !this.state.processing ? "button zoom-in" : "button zoom-in disabled" }
              id="zoom-in-button"
              onClick={this.handleOnClick}>
              <span className="icon-zoom-in button-icon"></span>
            </button>
            <button className={ !this.state.processing ? "button zoom-out" : "button zoom-out disabled" }
              id="zoom-out-button"
              onClick={this.handleOnClick}>
              <span className="icon-zoom-out button-icon"></span>
            </button>
            <button className={ !this.state.processing ? "button rotate-left" : "button rotate-left disabled" }
              id="rotate-left-button"
              onClick={this.handleOnClick}>
              <span className="icon-rotate-left button-icon"></span>
            </button>
            <button className={ !this.state.processing ? "button rotate-right" : "button rotate-right disabled" }
              id="rotate-right-button"
              onClick={this.handleOnClick}>
              <span className="icon-repeat button-icon"></span>
            </button>
          </div>
          <div className="navigation-buttons row">
            <button className="button half prev"
              id="prev-button"
              onClick={this.handleOnClick}>
              <span className="icon-arrow-left button-icon"></span>
              <span className="button-text">prev</span>
            </button>
            <button className={ this.state.completed ? "button half next" : "button half next disabled" }
              id="next-button"
              onClick={this.handleOnClick}>
              <span className="button-text">next</span>
              <span className="icon-arrow-right button-icon"></span>
            </button>
          </div>
        </div>
        <div className="image-container" ref="imageContainer">
          {this.displayCanvas()}
        </div>
      </div>
    )
  }
}

export default EditPage;

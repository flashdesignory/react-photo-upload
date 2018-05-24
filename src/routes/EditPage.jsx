import React, { Component } from 'react';
import './EditPage.scss';

const ROTATION_STEP = 5;
const SCALE_STEP = 0.05;
const MIN_SCALE = 0.2;
const MAX_SCALE = 1.5;
const TO_RADIANS = Math.PI/180;

class EditPage extends Component{
  constructor(props){
    super(props);

    this.state = {
      isMoving: false,
      selectedTool: ""
    }

    this.resizeTime = new Date();
    this.resizeDelta = 200;
    this.resizeTimeout = false;
    this.isResizing = false;
    this.settings = {};
    this.reset();

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
    this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
    this.handleOnMouseUp = this.handleOnMouseUp.bind(this);
    this.handleOnTouchMove = this.handleOnTouchMove.bind(this);
    this.handleOnResize = this.handleOnResize.bind(this);
    this.handleOnResizeComplete = this.handleOnResizeComplete.bind(this);
    this.handleOnOrientationChange = this.handleOnOrientationChange.bind(this);
  }
  reset(){
    this.settings.rotation = 0;
    this.settings.scale = 1;
    this.settings.offsetX = 0;
    this.settings.offsetY = 0;
    this.settings.currentX = 0;
    this.settings.currentY = 0;

    this.startX = this.startY = 0;
    this.localX = this.localY = 0;
    this.prevX = this.prevY = 0;
  }
  setCanvasReferences(){
    this.containerRect = this.refs.imageContainer.getBoundingClientRect();
    this.canvasRect = this.refs.canvasContainer.getBoundingClientRect();
  }
  updateRectangles(){
    this.scrollYOffset = window.pageYOffset || (document.documentElement.scrollTop - document.documentElement.clientTop) || 0;
  }
  componentDidMount(){
    if(this.props.editData){
      this.settings = Object.assign({}, this.props.editData.settings);
      this.startX = this.startY = 0;
      this.localX = this.localY = 0;
      this.prevX = this.prevY = 0;
    }else{
      this.reset();
    }

    this.setCanvasReferences();
    this.drawUserCanvas();
    this.captureResult();
    this.refs.imageContainer.addEventListener('touchmove', this.handleOnTouchMove, { passive: false });
    window.addEventListener("resize", this.handleOnResize);
    window.addEventListener("orientationchange", this.handleOnOrientationChange);
  }
  componentWillUnmount(){
    this.refs.imageContainer.removeEventListener('touchmove', this.handleOnTouchMove);
    window.removeEventListener("resize", this.handleOnResize);
    window.removeEventListener("orientationchange", this.handleOnOrientationChange);
  }
  handleOnTouchMove(e){
    e.preventDefault();
  }
  handleOnOrientationChange(e){
    console.log("handleOnOrientationChange()");
    setTimeout(()=> {
      this.handleOnResize();
    }, 750);
  }
  handleOnResize(e){
    this.isResizing = true;
    this.resizeTime = new Date();
    if(this.resizeTimeout === false){
      this.resizeTimeout = true;
      setTimeout(() => {
        this.handleOnResizeComplete();
      }, this.resizeDelta);
    }

  }
  handleOnResizeComplete(){
    if (new Date() - this.resizeTime < this.resizeDelta) {
      setTimeout(() => {
        this.handleOnResizeComplete();
      }, this.resizeDelta);
    } else {
        this.resizeTimeout = false;
        this.isResizing = false;
        this.updateRectangles();
    }
  }
  handleOnMouseDown(e){
    this.updateRectangles();

    e.persist();
    if(e.touches){
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY - this.scrollYOffset;
    }else{
      this.startX = e.pageX;
      this.startY = e.pageY - this.scrollYOffset;
    }

    this.setState({ isMoving: true }, () => {
      this.handleOnMouseMove(e);
      e = null;
    });
  }
  handleOnMouseMove(e){
    if(!this.state.isMoving){
      e.preventDefault();
      return;
    }

    if(e.touches){
      this.settings.offsetX = e.touches[0].pageX - this.startX;
      this.settings.offsetY = e.touches[0].pageY - this.startY - this.scrollYOffset;
    }else{
      this.settings.offsetX = e.pageX - this.startX;
      this.settings.offsetY = e.pageY - this.startY - this.scrollYOffset;
    }

    this.handleMouseEvent();
  }
  handleOnMouseUp(e){
    console.log("handleOnMouseUp()");

    this.settings.currentX += this.settings.offsetX;
    this.settings.currentY += this.settings.offsetY;
    this.settings.offsetX = 0;
    this.settings.offsetY = 0;

    this.captureResult();

    this.setState({isMoving: false});
    if(e.touches){e.preventDefault();}
  }
  evaluateMouseEvent(e){
    let point = {};
    if(e.touches){
      point.x = (e.touches[0].pageX - this.maskRect.left);
      point.y = (e.touches[0].pageY - this.maskRect.top - this.scrollYOffset);
    }else{
      point.x = (e.pageX - this.maskRect.left);
      point.y = (e.pageY - this.maskRect.top - this.scrollYOffset);
    }
    return point;
  }
  handleMouseEvent(){
    this.drawUserCanvas();
  }
  handleOnClick(e){
    console.log('handleOnClick(' + e.target.id + ')');
    switch(e.target.id){
      case "prev-button":
        this.props.setImageData('edit', null);
        this.props.history.goBack();
        break;
      case "next-button":
        this.props.history.push('/result')
        break;
      case "rotate-left-button":
        this.settings.rotation -= ROTATION_STEP;
        this.drawUserCanvas();
        this.captureResult();
        break;
      case "rotate-right-button":
        this.settings.rotation += ROTATION_STEP;
        this.drawUserCanvas();
        this.captureResult();
        break;
      case "zoom-in-button":
        this.settings.scale += SCALE_STEP;
        if(this.settings.scale > MAX_SCALE) this.settings.scale = MAX_SCALE;
        this.drawUserCanvas();
        this.captureResult();
        break;
      case "zoom-out-button":
        this.settings.scale -= SCALE_STEP;
        if(this.settings.scale < MIN_SCALE) this.settings.scale = MIN_SCALE;
        this.drawUserCanvas();
        this.captureResult();
        break;
    }
  }
  drawUserCanvas(){
    console.log("drawUserCanvas()");
    let inputCanvas = this.refs.editCanvas;
    let inputContext = inputCanvas.getContext("2d");
    let imageData = this.props.imageData.image;

    inputContext.canvas.width = imageData.width;
    inputContext.canvas.height = imageData.height;

    inputContext.translate(
      (imageData.width/2)+this.settings.currentX + this.settings.offsetX,
      (imageData.height/2)+this.settings.currentY+this.settings.offsetY
    );

    inputContext.scale(this.settings.scale, this.settings.scale);
    inputContext.rotate(this.settings.rotation * TO_RADIANS);

    inputContext.drawImage(
      imageData,
      -(imageData.width/2),
      -(imageData.height/2),
      imageData.width,
      imageData.height
    );
    //this.captureResult();
  }
  captureResult(){
    console.log("captureResult()")
    let data, image, settings;
    data = this.refs.editCanvas.toDataURL();
    image = new Image();
    image.src = data;
    settings = Object.assign({}, this.settings);
    this.props.setImageData('edit', {image, settings});
  }
  displayCanvas(){
    return (
      <div className={ `image-content ${this.state.selectedTool}` }
        onMouseDown={ this.handleOnMouseDown }
        onMouseMove={ this.handleOnMouseMove }
        onMouseUp={ this.handleOnMouseUp }
        onTouchStart={ this.handleOnMouseDown }
        onTouchMove={ this.handleOnMouseMove }
        onTouchEnd={ this.handleOnMouseUp }
        ref="canvasContainer">
        <canvas id="input-canvas" ref="editCanvas"
          className="canvas-visible"></canvas>
      </div>
    )
  }
  render(){
    return (
      <div className="page edit">
        <div className="buttons-container">
          <div className="action-buttons">
            <button className="button zoom-in"
              id="zoom-in-button"
              onClick={this.handleOnClick}>
              <span className="icon-zoom-in button-icon"></span>
            </button>
            <button className="button zoom-out"
              id="zoom-out-button"
              onClick={this.handleOnClick}>
              <span className="icon-zoom-out button-icon"></span>
            </button>
            <button className="button rotate-left"
              id="rotate-left-button"
              onClick={this.handleOnClick}>
              <span className="icon-rotate-left button-icon"></span>
            </button>
            <button className="button rotate-right"
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
            <button className="button half next"
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

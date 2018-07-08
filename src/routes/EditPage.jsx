import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './EditPage.scss';

const ROTATION_STEP = 5;
const SCALE_STEP = 0.05;
const MIN_SCALE = 0.2;
const MAX_SCALE = 1.5;
const TO_RADIANS = Math.PI / 180;

class EditPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMoving: false,
      selectedTool: '',
    };

    this.canvasContainer = React.createRef();
    this.imageContainer = React.createRef();
    this.editCanvas = React.createRef();

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

  componentDidMount() {
    const { editData } = this.props;
    if (editData) {
      const { settings } = editData;
      this.settings = Object.assign({}, settings);
      this.startX = 0;
      this.startY = 0;
      this.localX = 0;
      this.localY = 0;
      this.prevX = 0;
      this.prevY = 0;
    } else {
      this.reset();
    }

    this.setCanvasReferences();
    this.drawUserCanvas();
    this.captureResult();
    this.imageContainer.current.addEventListener('touchmove', this.handleOnTouchMove, { passive: false });
    window.addEventListener('resize', this.handleOnResize);
    window.addEventListener('orientationchange', this.handleOnOrientationChange);
  }

  componentWillUnmount() {
    this.imageContainer.current.removeEventListener('touchmove', this.handleOnTouchMove);
    window.removeEventListener('resize', this.handleOnResize);
    window.removeEventListener('orientationchange', this.handleOnOrientationChange);
  }

  setCanvasReferences() {
    this.containerRect = this.imageContainer.current.getBoundingClientRect();
    this.canvasRect = this.canvasContainer.current.getBoundingClientRect();
  }

  reset() {
    this.settings.rotation = 0;
    this.settings.scale = 1;
    this.settings.offsetX = 0;
    this.settings.offsetY = 0;
    this.settings.currentX = 0;
    this.settings.currentY = 0;

    this.startX = 0;
    this.startY = 0;
    this.localX = 0;
    this.localY = 0;
    this.prevX = 0;
    this.prevY = 0;
  }

  updateRectangles() {
    this.scrollYOffset = window.pageYOffset
    || (document.documentElement.scrollTop - document.documentElement.clientTop)
    || 0;
  }

  handleOnTouchMove(e) {
    this.funcName = 'handleOnTouchMove'; // hack... doesn't feel right...
    e.preventDefault();
  }

  handleOnOrientationChange() {
    setTimeout(() => {
      this.handleOnResize();
    }, 750);
  }

  handleOnResize() {
    this.isResizing = true;
    this.resizeTime = new Date();
    if (this.resizeTimeout === false) {
      this.resizeTimeout = true;
      setTimeout(() => {
        this.handleOnResizeComplete();
      }, this.resizeDelta);
    }
  }

  handleOnResizeComplete() {
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

  handleOnMouseDown(e) {
    this.updateRectangles();

    e.persist();
    if (e.touches) {
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY - this.scrollYOffset;
    } else {
      this.startX = e.pageX;
      this.startY = e.pageY - this.scrollYOffset;
    }

    this.setState({ isMoving: true }, () => {
      this.handleOnMouseMove(e);
      // e = null;
    });
  }

  handleOnMouseMove(e) {
    const { isMoving } = this.state;
    if (!isMoving) {
      e.preventDefault();
      return;
    }

    if (e.touches) {
      this.settings.offsetX = e.touches[0].pageX - this.startX;
      this.settings.offsetY = e.touches[0].pageY - this.startY - this.scrollYOffset;
    } else {
      this.settings.offsetX = e.pageX - this.startX;
      this.settings.offsetY = e.pageY - this.startY - this.scrollYOffset;
    }

    this.handleMouseEvent();
  }

  handleOnMouseUp(e) {
    this.settings.currentX += this.settings.offsetX;
    this.settings.currentY += this.settings.offsetY;
    this.settings.offsetX = 0;
    this.settings.offsetY = 0;

    this.captureResult();

    this.setState({ isMoving: false });
    if (e.touches) { e.preventDefault(); }
  }

  evaluateMouseEvent(e) {
    const point = {};
    if (e.touches) {
      point.x = (e.touches[0].pageX - this.maskRect.left);
      point.y = (e.touches[0].pageY - this.maskRect.top - this.scrollYOffset);
    } else {
      point.x = (e.pageX - this.maskRect.left);
      point.y = (e.pageY - this.maskRect.top - this.scrollYOffset);
    }
    return point;
  }

  handleMouseEvent() {
    this.drawUserCanvas();
  }

  handleOnClick(e) {
    // console.log(`handleOnClick(${e.target.id})`);
    const { history, setImageData } = this.props;
    switch (e.target.id) {
      case 'prev-button':
        setImageData('edit', null);
        history.goBack();
        break;
      case 'next-button':
        history.push('/result');
        break;
      case 'rotate-left-button':
        this.settings.rotation -= ROTATION_STEP;
        this.drawUserCanvas();
        this.captureResult();
        break;
      case 'rotate-right-button':
        this.settings.rotation += ROTATION_STEP;
        this.drawUserCanvas();
        this.captureResult();
        break;
      case 'zoom-in-button':
        this.settings.scale += SCALE_STEP;
        if (this.settings.scale > MAX_SCALE) this.settings.scale = MAX_SCALE;
        this.drawUserCanvas();
        this.captureResult();
        break;
      case 'zoom-out-button':
        this.settings.scale -= SCALE_STEP;
        if (this.settings.scale < MIN_SCALE) this.settings.scale = MIN_SCALE;
        this.drawUserCanvas();
        this.captureResult();
        break;
      default:
    }
  }

  drawUserCanvas() {
    // console.log('drawUserCanvas()');
    const { imageData: { image } } = this.props;
    const inputCanvas = this.editCanvas.current;
    const inputContext = inputCanvas.getContext('2d');
    const imageData = image;

    inputContext.canvas.width = imageData.width;
    inputContext.canvas.height = imageData.height;

    inputContext.translate(
      (imageData.width / 2) + this.settings.currentX + this.settings.offsetX,
      (imageData.height / 2) + this.settings.currentY + this.settings.offsetY,
    );

    inputContext.scale(this.settings.scale, this.settings.scale);
    inputContext.rotate(this.settings.rotation * TO_RADIANS);

    inputContext.drawImage(
      imageData,
      -(imageData.width / 2),
      -(imageData.height / 2),
      imageData.width,
      imageData.height,
    );
    // this.captureResult();
  }

  captureResult() {
    //  console.log('captureResult()');
    const { setImageData } = this.props;
    const data = this.editCanvas.current.toDataURL();
    const settings = Object.assign({}, this.settings);
    const image = new Image();
    image.src = data;
    setImageData('edit', { image, settings });
  }

  displayCanvas() {
    const { selectedTool } = this.state;
    return (
      <div
        className={`image-content ${selectedTool}`}
        onMouseDown={this.handleOnMouseDown}
        onMouseMove={this.handleOnMouseMove}
        onMouseUp={this.handleOnMouseUp}
        onTouchStart={this.handleOnMouseDown}
        onTouchMove={this.handleOnMouseMove}
        onTouchEnd={this.handleOnMouseUp}
        ref={this.canvasContainer}
        role="button"
        tabIndex={0}
      >
        <canvas
          id="input-canvas"
          ref={this.editCanvas}
          className="canvas-visible"
        />
      </div>
    );
  }

  render() {
    return (
      <div className="page edit">
        <div className="buttons-container">
          <div className="action-buttons">
            <button
              className="button zoom-in"
              type="button"
              id="zoom-in-button"
              onClick={this.handleOnClick}
            >
              <span className="icon-zoom-in button-icon" />
            </button>
            <button
              className="button zoom-out"
              type="button"
              id="zoom-out-button"
              onClick={this.handleOnClick}
            >
              <span className="icon-zoom-out button-icon" />
            </button>
            <button
              className="button rotate-left"
              type="button"
              id="rotate-left-button"
              onClick={this.handleOnClick}
            >
              <span className="icon-rotate-left button-icon" />
            </button>
            <button
              className="button rotate-right"
              type="button"
              id="rotate-right-button"
              onClick={this.handleOnClick}
            >
              <span className="icon-repeat button-icon" />
            </button>
          </div>
          <div className="navigation-buttons row">
            <button
              className="button half prev"
              type="button"
              id="prev-button"
              onClick={this.handleOnClick}
            >
              <span className="icon-arrow-left button-icon" />
              <span className="button-text">
                prev
              </span>
            </button>
            <button
              className="button half next"
              type="button"
              id="next-button"
              onClick={this.handleOnClick}
            >
              <span className="button-text">
                next
              </span>
              <span className="icon-arrow-right button-icon" />
            </button>
          </div>
        </div>
        <div className="image-container" ref={this.imageContainer}>
          {this.displayCanvas()}
        </div>
      </div>
    );
  }
}

EditPage.defaultProps = {
  editData: null,
  imageData: null,
  history: {},
  setImageData: () => {},
};

EditPage.propTypes = {
  editData: PropTypes.shape({
    settings: PropTypes.object,
  }),
  imageData: PropTypes.shape({
    image: PropTypes.object,
  }),
  history: PropTypes.object,
  setImageData: PropTypes.func,
};

export default EditPage;

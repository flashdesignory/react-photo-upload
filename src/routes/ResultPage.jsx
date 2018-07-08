import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ResultPage.scss';

class ResultPage extends Component {
  constructor(props) {
    super(props);

    this.inputCanvas = React.createRef();

    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentDidMount() {
    this.drawUserCanvas();
  }

  handleOnClick(e) {
    console.log('handleOnClick()');
    const { history, setImageData } = this.props;
    switch (e.target.id) {
      case 'prev-button':
        setImageData('result', null);
        history.goBack();
        break;
      case 'next-button':
        setImageData('', null);
        history.push('/upload');
        break;
      case 'save-button':
        e.target.href = this.inputCanvas.current.toDataURL('image/png');
        e.target.download = 'myphoto.png';
        break;
      default:
    }
  }

  drawUserCanvas() {
    console.log('drawUserCanvas()');
    const { imageData: { image } } = this.props;
    const inputContext = this.inputCanvas.current.getContext('2d');
    const imageData = image;
    const inputWidth = imageData.width;
    const inputHeight = imageData.height;
    inputContext.canvas.width = inputWidth;
    inputContext.canvas.height = inputHeight;
    inputContext.clearRect(0, 0, inputWidth, inputHeight);
    inputContext.drawImage(imageData, 0, 0);
  }

  render() {
    const { imageData: { image }, imageData } = this.props;
    return (
      <div className="page result">
        <div className="buttons-container">
          <div className="action-buttons">
            <button
              className={imageData ? 'button wide save' : 'button wide save disabled'}
              type="button"
              id="save-button"
              onClick={this.handleOnClick}
            >
              <span className="icon-folder-download button-icon" />
              <span className="button-text">
                save
              </span>
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
                again
              </span>
              <span className="icon-arrow-right button-icon" />
            </button>
          </div>
        </div>
        <div className="image-container">
          <div className="image-content">
            {imageData ? <img src={image.src} alt="result" className="image-invisible" /> : null}
            <canvas id="input-canvas" ref={this.inputCanvas} />
          </div>
        </div>
      </div>
    );
  }
}

ResultPage.defaultProps = {
  imageData: null,
  history: {},
  setImageData: () => {},
};

ResultPage.propTypes = {
  imageData: PropTypes.shape({
    image: PropTypes.object,
  }),
  history: PropTypes.object,
  setImageData: PropTypes.func,
};

export default ResultPage;

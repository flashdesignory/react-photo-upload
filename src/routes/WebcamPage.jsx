import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './WebcamPage.scss';

class WebcamPage extends Component {
  constructor(props) {
    super(props);
    this.checkSupport();
    this.state = {
      imageData: null,
      isAvailable: false,
      error: '',
    };

    this.videoElement = React.createRef();

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnPlay = this.handleOnPlay.bind(this);
    this.handleOnPause = this.handleOnPause.bind(this);
  }

  componentDidMount() {
    this.displayVideo();
  }

  componentWillUnmount() {
    if (WebcamPage.track) WebcamPage.track.stop();
  }

  checkSupport() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.webcamSupported = true;
    } else {
      this.webcamSupported = false;
    }
  }

  displayVideo() {
    const video = this.videoElement.current;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        const { track } = stream.getTracks();
        WebcamPage.track = track;
      })
      .catch((err) => {
        console.log(`error: ${err}`);
        this.setState({
          error: err.message,
        });
      });
  }

  takePicture() {
    const { setImageData, history } = this.props;
    const video = this.videoElement.current;
    const scale = 1;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    const context = canvas.getContext('2d');
    context.translate(video.videoWidth, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const data = canvas.toDataURL();
    const image = new Image();
    image.src = data;

    setImageData('image', { image }, () => {
      console.log('image assigned to app');
    });

    this.setState({ imageData: image }, () => {
      console.log('done with image');
      setTimeout(() => history.push('/edit'), 50);
    });
  }

  handleOnPlay() {
    console.log('handleOnPlay()');
    this.setState({
      isAvailable: true,
    });
  }

  handleOnPause() {
    console.log('handleOnPause()');
    this.setState({
      isAvailable: false,
    });
  }

  handleOnClick(e) {
    console.log('handleOnClick()');
    const { history } = this.props;
    this.setState({
      error: '',
    });
    switch (e.target.id) {
      case 'snap-button':
        this.takePicture();
        break;
      case 'retake-button':
        this.setState({
          imageData: null,
          error: '',
        }, this.displayVideo);
        break;
      case 'next-button':
        history.push('/edit');
        break;
      default:
    }
  }

  displayActionButton() {
    const { imageData, isAvailable } = this.state;
    if (imageData) {
      return (
        <button
          className="button wide retake"
          type="button"
          id="retake-button"
          onClick={this.handleOnClick}
        >
          <span className="icon-refresh button-icon" />
          <span className="button-text">
            retake picture
          </span>
        </button>
      );
    }
    return (
      <button
        className={isAvailable ? 'button wide snap' : 'button wide snap disabled'}
        type="button"
        id="snap-button"
        onClick={this.handleOnClick}
      >
        <span className="icon-camera button-icon" />
        <span className="button-text">
          snap picture
        </span>
      </button>
    );
  }

  render() {
    const { imageData, error } = this.state;
    return (
      <div className="page webcam">
        <div className="buttons-container">
          <div className="action-buttons">
            {this.displayActionButton()}
          </div>
          <div className="navigation-buttons">
            <button
              className={imageData ? 'button wide next' : 'button wide next disabled'}
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
        <div className="image-container">
          <div className="image-content">
            {
              imageData
                ? <img alt="result" src={imageData.src} />
                : (
                  <video // eslint-disable-line jsx-a11y/media-has-caption
                    id="video"
                    ref={this.videoElement}
                    width="1280"
                    height="720"
                    autoPlay
                    onPlaying={this.handleOnPlay}
                    onPause={this.handleOnPause}
                  />
                )
              }
            <div className={error !== '' ? 'error-container error-visible' : 'error-container error-hidden'}>
              <div className="error-message">
                { error }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WebcamPage.defaultProps = {
  history: {},
  setImageData: () => {},
};

WebcamPage.propTypes = {
  history: PropTypes.object,
  setImageData: PropTypes.func,
};

export default WebcamPage;

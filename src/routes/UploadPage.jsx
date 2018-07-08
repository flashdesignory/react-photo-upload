import React, { Component } from 'react';
import PropTypes from 'prop-types';
import loadImage from 'blueimp-load-image';
import Preloader from '../modules/preloader/preloader';
import { isMobile } from '../utils/mobile';
import './UploadPage.scss';

const IMAGE_SCALE = 1.1;

class UploadPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageData: null,
      processing: false,
      error: '',
    };

    this.inputElement = React.createRef();
    this.imageContainer = React.createRef();
    this.userImage = React.createRef();

    this.maxFilesize = 4000000;
    this.checkSupport();
    this.reader = null;
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  checkSupport() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      this.fileUploadSupported = true;
    } else {
      this.fileUploadSupported = false;
    }
  }

  processFiles(files) {
    var selectedFiles = [];
    console.log('processFiles()');
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > this.maxFilesize) return this.showError('size');
      if (files[i].type.match('image.*')) {
        selectedFiles.push(files[i]);
      }
    }

    this.showError('');

    if (selectedFiles.length > 0) {
      this.setState(
        { processing: true }, () => this.readImage(selectedFiles[0]),
      );
    }

    return selectedFiles;
  }

  readImage(file) {
    console.log('readImage()');
    const { setImageData, history } = this.props;
    loadImage(file, (img) => {
      const data = img.toDataURL();
      const image = new Image();
      image.src = data;

      setImageData('image', { image }, () => {
        console.log('image assigned to app');
      });

      this.setState({
        imageData: image,
        processing: false,
      }, () => {
        console.log('done with image');
        setTimeout(() => history.push('/edit'), 50);
      });
    }, {
      maxWidth: this.imageContainer.current.offsetWidth * IMAGE_SCALE,
      maxHeight: this.imageContainer.current.offsetHeight * IMAGE_SCALE,
      cover: true,
      canvas: true,
      downsamplingRatio: 0.5,
      orientation: true,
    });
  }

  showError(type) {
    let message = '';
    switch (type) {
      case 'size':
        message = 'Image should be less than 4MB';
        break;
      default:
        message = '';
    }
    this.setState({
      error: message,
    });
  }

  handleDragEnter(e) {
    console.log('handleDragEnter()');
    this.setState({
      error: '',
    });
    e.stopPropagation();
    e.preventDefault();
  }

  handleDragLeave(e) {
    console.log('handleDragLeave()');
    this.funcName = 'handleDragLeave'; // hack... doesn't feel right...
    e.stopPropagation();
    e.preventDefault();
  }

  handleDragOver(e) {
    console.log('handleDragOver()');
    this.funcName = 'handleDragOver'; // hack... doesn't feel right...
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  handleDrop(e) {
    const { files } = e.dataTransfer;
    console.log('handleDrop()');
    e.stopPropagation();
    e.preventDefault();
    this.processFiles(files);
  }

  handleOnChange(e) {
    const { files } = e.target;
    console.log('handleOnChange()');
    this.processFiles(files);
  }

  handleOnClick(e) {
    const { history } = this.props;
    console.log('handleOnClick()');
    switch (e.target.id) {
      case 'next-button':
        history.push('/edit');
        break;
      case 'webcam-button':
        history.push('/webcam');
        break;
      default:
    }
  }

  render() {
    const { imageData, processing, error } = this.state;
    return (
      <div className="page upload">
        <div className="buttons-container">
          <div className="action-buttons">
            <form className="upload-form">
              <input className="input input-file" ref={this.inputElement} type="file" id="fileElem" accept="image/*" onChange={this.handleOnChange} />
              <label className="button wide input-label" id="upload-field" htmlFor="fileElem">
                <span className="icon-folder-upload button-icon" />
                <span className="button-text">
Choose a file
                </span>
              </label>
            </form>
            {!isMobile() ? (
              <button
                className="button webcam"
                id="webcam-button"
                type="button"
                onClick={this.handleOnClick}
                style={{ marginLeft: '20px' }}
              >
                <span className="icon-camera button-icon" />
              </button>
            ) : null}
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
        <div
          className="image-container"
          onDragEnter={this.handleDragEnter}
          onDragLeave={this.handleDragLeave}
          onDragOver={this.handleDragOver}
          onDrop={this.handleDrop}
          ref={this.imageContainer}
        >
          <div className="image-content">
            {imageData ? <img src={imageData.src} alt="result" id="user-image" ref={this.userImage} /> : null}
            {processing && <Preloader />}
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

UploadPage.defaultProps = {
  history: {},
  setImageData: () => {},
};

UploadPage.propTypes = {
  history: PropTypes.object,
  setImageData: PropTypes.func,
};

export default UploadPage;

import React, { Component } from 'react';
import loadImage from 'blueimp-load-image';
import Preloader from '../modules/preloader/Preloader';
import { formatBytes } from '../utils/utils';
import { isMobile } from '../utils/mobile';
import './UploadPage.scss';

const IMAGE_SCALE = 1.1;

class UploadPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      imageData:null,
      imageId:"",
      imageWidth:0,
      imageHeight:0,
      processing:false,
      error: ""
    }
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
  checkSupport(){
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      this.fileUploadSupported = true;
    } else {
      this.fileUploadSupported = false;
    }
  }
  processFiles(files){
    console.log("processFiles()");
    var selectedFiles = [];
    for(let i = 0; i<files.length; i++){
      if(files[i].size > this.maxFilesize) return this.showError("size");
      if(files[i].type.match('image.*')){
        selectedFiles.push(files[i]);
      }
    }

    this.showError("");

    if(selectedFiles.length > 0){
      this.setState({imageId:selectedFiles[0].name, processing:true}, () => this.readImage(selectedFiles[0]))
    }
  }
  readImage(file){
    console.log("readImage()");
    loadImage(file, (img) => {
      let data = img.toDataURL();
      let image = new Image();
      image.src = data;

      this.props.setImageData('image', {image}, () => {
        console.log("image assigned to app");
      });

      this.setState({
        imageData : image,
        imageWidth:img.width,
        imageHeight:img.height,
        processing: false
      }, () => {
        console.log("done with image");
        setTimeout(() => this.props.history.push('/edit'), 50);
      });
    }, {
      maxWidth: this.refs.imageContainer.offsetWidth * IMAGE_SCALE,
      maxHeight: this.refs.imageContainer.offsetHeight * IMAGE_SCALE,
      cover:true,
      canvas: true,
      downsamplingRatio: 0.5,
      orientation: true
    })
  }
  showError(type){
    let message = "";
    switch(type){
      case "size":
        message = "Image should be less than 4MB";
        break;
      default:
        message = ""
    }
    this.setState({
      error: message
    })
  }
  handleDragEnter(e){
    console.log("handleDragEnter()");
    this.setState({
      error: ""
    })
    e.stopPropagation();
		e.preventDefault();
  }
  handleDragLeave(e){
    console.log("handleDragLeave()");
    e.stopPropagation();
		e.preventDefault();
  }
  handleDragOver(e){
    console.log("handleDragOver()");
    e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
  }
  handleDrop(e){
    console.log("handleDrop()");
    e.stopPropagation();
		e.preventDefault();
		var files = e.dataTransfer.files;
    this.processFiles(files);
  }
  handleOnChange(e){
    console.log("handleOnChange()");
    var files = e.target.files;
    this.processFiles(files);
  }
  handleOnClick(e){
    console.log('handleOnClick()');
    switch(e.target.id){
      case "next-button":
        this.props.history.push('/edit');
        break;
      case "webcam-button":
        this.props.history.push('/webcam');
        break;
    }
  }
  render(){
    return (
      <div className="page upload">
        <div className="buttons-container">
          <div className="action-buttons">
            <form className="upload-form">
              <input className="input input-file" ref="inputElement" type="file" id="fileElem" accept="image/*" onChange={this.handleOnChange}/>
              <label className="button wide input-label" htmlFor="fileElem">
                <span className="icon-folder-upload button-icon"></span>
                <span className="button-text">Choose a file</span>
              </label>
            </form>
            {!isMobile() ? (
              <button className="button webcam"
                id="webcam-button"
                onClick={this.handleOnClick}
                style={{marginLeft: "20px"}}>
                <span className="icon-camera button-icon"></span>
              </button>
            ):null}
          </div>
          <div className="navigation-buttons">
            <button className={ this.state.imageData ? "button wide next" : "button wide next disabled" }
              id="next-button"
              onClick={this.handleOnClick}>
              <span className="button-text">next</span>
              <span className="icon-arrow-right button-icon"></span>
            </button>
          </div>
        </div>
        <div className="image-container"
          onDragEnter={this.handleDragEnter}
          onDragLeave={this.handleDragLeave}
          onDragOver={this.handleDragOver}
          onDrop={this.handleDrop}
          ref="imageContainer">
          <div className="image-content">
            {this.state.imageData ? <img src={ this.state.imageData.src } id="user-image" ref="userImage"/> : null}
            {this.state.processing && <Preloader />}
            <div className={this.state.error !== "" ? "error-container error-visible" : "error-container error-hidden"}><div className="error-message">{ this.state.error }</div></div>
          </div>
        </div>
      </div>
    )
  }
}

export default UploadPage;

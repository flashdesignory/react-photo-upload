import React, { Component } from 'react';
import { formatBytes } from '../utils/utils';
import './UploadPage.scss';

class UploadPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      imageData:null
    }
    this.maxFilesize = 4000000;
    this.checkSupport();
    this.reader = null;
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnLoaded = this.handleOnLoaded.bind(this);
    this.handleOnAbort = this.handleOnAbort.bind(this);
    this.handleOnError = this.handleOnError.bind(this);
    this.handleOnProgress = this.handleOnProgress.bind(this);
    this.handleOnStart = this.handleOnStart.bind(this);

    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
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

    if(selectedFiles.length > 0) this.readImage(selectedFiles[0]);
  }
  readImage(file){
    console.log("readImage()");
    this.reader = new FileReader()
    this.reader.addEventListener("loadend", this.handleOnLoaded);
    this.reader.addEventListener("error", this.handleOnError);
    this.reader.addEventListener("abort", this.handleOnAbort);
    this.reader.addEventListener("loadstart", this.handleOnStart);
    this.reader.addEventListener("progress", this.handleOnProgress);
    this.reader.readAsDataURL(file)
  }
  showError(type){
    let message = "";
    switch(type){
      case "size":
        message = "image is too big";
        break;
    }
    console.log(message);
  }
  handleOnLoaded(e){
    console.log(e.target.result);
    this.setState({
      imageData : e.target.result
    })
  }
  handleOnAbort(e){
    console.log("handleOnAbort()");
  }
  handleOnError(e){
    switch(e.target.error.code) {
      case e.target.error.NOT_FOUND_ERR:
        console.log('File Not Found!');
        break;
      case e.target.error.NOT_READABLE_ERR:
        console.log('File is not readable');
        break;
      case e.target.error.ABORT_ERR:
        break;
      default:
        console.log('An error occurred reading this file.');
    };
  }
  handleOnProgress(e){
    if (e.lengthComputable) {
      let percentLoaded = Math.round((e.loaded / e.total) * 100);
      if (percentLoaded < 100) {
        console.log(percentLoaded + '%');
      }
    }
  }
  handleOnStart(e){
    console.log("handleOnStart()");
  }
  handleDragEnter(e){
    console.log("handleDragEnter()");
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
  render(){
    return (
      <div className="page upload">
        <form className="upload-form">
          <input className="input input-file" type="file" id="fileElem" accept="image/*" onChange={this.handleOnChange}/>
          <label className="button wide input-label" htmlFor="fileElem">
            <span className="icon-arrow-up button-icon"></span>
            <span className="button-text">Choose a file</span>
          </label>
        </form>
        <div className="image-container"
          onDragEnter={this.handleDragEnter}
          onDragLeave={this.handleDragLeave}
          onDragOver={this.handleDragOver}
          onDrop={this.handleDrop}>
          <div className="image-content">
            {this.state.imageData ? <img src={ this.state.imageData }/> : null}
          </div>
        </div>
      </div>
    )
  }
}

export default UploadPage;

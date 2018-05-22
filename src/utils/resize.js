import {isMobile } from './utils';

var resizeTime;
var resizeDelta = 200;
var changeDelta = 750;
var resizeTimeout = false;
var isResizing = false;
var windowWidth, windowHeight;
var body;

function handleOnResize(e){
	isResizing = true;
	windowWidth = window.innerWidth||document.documentElement.clientWidth||body.clientWidth;
	windowHeight = window.innerHeight||document.documentElement.clientHeight||body.clientHeight;

	if(windowHeight > windowWidth){
		body.classList.add("portrait");
		body.classList.remove("landscape");
	}else{
		body.classList.add("landscape");
		body.classList.remove("portrait");
	}

	resizeTime = new Date();
	if(resizeTimeout === false){
		resizeTimeout = true;
		setTimeout(() => {
			handleOnResizeComplete();
		}, resizeDelta);
	}
}

function handleOnResizeComplete(){
	if (new Date() - resizeTime < resizeDelta) {
		setTimeout(() => {
			handleOnResizeComplete();
		}, resizeDelta);
	} else {
      console.log("done resizing");
			resizeTimeout = false;
			isResizing = false;
	}
}

function handleOnOrientationChange(e){
	setTimeout(()=> {
		handleOnResize();
	}, changeDelta);
}

export default function(){
  console.log("initResize()");
  resizeTime = new Date();
  body = document.getElementsByTagName('body')[0];
  isMobile() ? body.classList.add("mobile") : body.classList.add("desktop");
  window.addEventListener("resize", handleOnResize);
  window.addEventListener("orientationchange", handleOnOrientationChange);
  handleOnResize();
}

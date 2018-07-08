var resizeTime;
var resizeDelta = 200;
var changeDelta = 750;
var resizeTimeout = false;
// var isResizing = false;
var windowWidth;
var windowHeight;
var body;

function handleOnResizeComplete() {
  if (new Date() - resizeTime < resizeDelta) {
    setTimeout(() => {
      handleOnResizeComplete();
    }, resizeDelta);
  } else {
    resizeTimeout = false;
    // isResizing = false;
  }
}

function handleOnResize() {
  // isResizing = true;
  windowWidth = window.innerWidth || document.documentElement.clientWidth || body.clientWidth;
  windowHeight = window.innerHeight || document.documentElement.clientHeight || body.clientHeight;

  if (windowHeight > windowWidth) {
    body.classList.add('portrait');
    body.classList.remove('landscape');
  } else {
    body.classList.add('landscape');
    body.classList.remove('portrait');
  }

  resizeTime = new Date();
  if (resizeTimeout === false) {
    resizeTimeout = true;
    setTimeout(() => {
      handleOnResizeComplete();
    }, resizeDelta);
  }
}

function handleOnOrientationChange() {
  setTimeout(() => {
    handleOnResize();
  }, changeDelta);
}

export default function () {
  resizeTime = new Date();
  ([body] = document.getElementsByTagName('body'));
  window.addEventListener('resize', handleOnResize);
  window.addEventListener('orientationchange', handleOnOrientationChange);
  handleOnResize();
}

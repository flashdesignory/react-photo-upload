import { isMobile } from './mobile';

let hasHoverClass = false;
let container;
let lastTouchTime = 0;

function enableHover() {
  if (new Date() - lastTouchTime < 500) return;
  if (hasHoverClass) return;
  container.classList.add('hasHover');
  hasHoverClass = true;
}

function disableHover() {
  if (!hasHoverClass) return;
  container.classList.remove('hasHover');
  hasHoverClass = false;
}

function updateLastTouchTime() {
  lastTouchTime = new Date();
}

function addListeners() {
  document.addEventListener('touchstart', updateLastTouchTime, true);
  document.addEventListener('touchstart', disableHover, true);
  document.addEventListener('mousemove', enableHover, true);
}

export default function () {
  container = document.body;
  if (!isMobile()) {
    addListeners();
    enableHover();
  }
}

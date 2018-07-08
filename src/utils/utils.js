export function getParameterByName(value) {
  var name = value.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]'); // eslint-disable-line no-useless-escape
  var regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
  var results = regex.exec(window.location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export function formatTime(secs) {
  var seconds = Math.round(secs);
  var minutes = Math.floor(seconds / 60);
  minutes = (minutes >= 10) ? minutes : `0${minutes}`;
  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : `0${seconds}`;
  return `${minutes}:${seconds}`;
}

export function formatBytes(a, b) {
  var c = 1024;
  var d = b || 2;
  var e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var f = Math.floor(Math.log(a) / Math.log(c));
  var g = c ** f;
  if (a === 0) return '0 Bytes';
  return `${parseFloat((a / g).toFixed(d))} ${e[f]}`;
}

export function shuffle(arr) {
  const array = arr.slice(0);
  for (let j, x, i = array.length; i; j = Math.floor(Math.random() * i),
  x = array[--i], array[i] = array[j], array[j] = x); // eslint-disable-line no-plusplus
  return array;
}

export function sortByKey(array, key) {
  return array.sort((a, b) => {
    var x = a[key]; var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0)); // eslint-disable-line no-nested-ternary
  });
}

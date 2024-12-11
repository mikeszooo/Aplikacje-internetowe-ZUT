/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


var msg = "Hello!";
alert(msg);
function changeStyle(stylePath) {
  var link = document.getElementById('dynamic-style');
  if (link) {
    link.href = stylePath;
  }
}
var styles = {
  ciemny: 'css/page1.css',
  jasny: 'css/page2.css',
  trzeci: 'css/page3.css'
};
document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('style-links');
  if (container) {
    Object.keys(styles).forEach(function (styleName) {
      var link = document.createElement('a');
      link.href = '#';
      link.textContent = "Zmie\u0144 na motyw ".concat(styleName, " ");
      link.addEventListener('click', function (event) {
        event.preventDefault();
        changeStyle(styles[styleName]);
      });
      container.appendChild(link);
    });
  }
});
/******/ })()
;
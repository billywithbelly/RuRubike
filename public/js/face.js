$(document).ready(function(){
    $('#screenShotBut').click(screenShotButHendler);
    videoInit();
});

var video;
var canvas;
var height;
var streaming;

function videoInit() {

  navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia ||  navigator.mozGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      { audio: false, video: true },
      function(stream) {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        video.src = window.URL.createObjectURL(stream);
        video.onloadedmetadata = function(e) {
          video.play();
        };
        video.addEventListener('canplay', function(ev){
          video.setAttribute('width', video.videoWidth);
          video.setAttribute('height', video.videoheight);
          canvas.setAttribute('width', video.videoWidth);
          canvas.setAttribute('height', video.videoheight);
        }, false);
      },
      function(err) {
        console.log("The following error occurred: " + err.name);
      }
    );
  } 
  else {
    console.log("getUserMedia not supported");
  }
}

function screenShotButHendler(){
  var context = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
}
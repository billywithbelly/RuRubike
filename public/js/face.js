$(document).ready(function(){
    $('#screenShotBut').click(screenShotButHendler);
    videoInit();
});

function videoInit() {

  navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia ||  navigator.mozGetUserMedia;

  if (navigator.getUserMedia) {
    var rect = document.getElementById('faceDetectVideo').getBoundingClientRect();
    navigator.getUserMedia(
      { audio: false, video: { width: rect.width, height: rect.height } },
      function(stream) {
        var video = document.querySelector('video');
        video.src = window.URL.createObjectURL(stream);
        video.onloadedmetadata = function(e) {
          video.play();
        };
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
  var canvas = document.getElementById('screenShotVideo');
  var ctx = canvas.getContext('2d');
  var rect = document.getElementById('screenShotVideo').getBoundingClientRect();
  var video = document.querySelector('video');
  console.log(rect);
  ctx.drawImage(video, 0, 0);
}
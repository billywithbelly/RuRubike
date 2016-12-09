$(document).ready(function(){
    videoInit();
});

function videoInit() {

  navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia ||  navigator.mozGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      { audio: false, video: true },
      function(stream) {
        var video = document.querySelector('video');
        video.src = window.URL.createObjectURL(stream);
        video.onloadedmetadata = function(e) {
          video.play();
        };
        canvasFeetVideo();
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

function canvasFeetVideo(){
  console.log($('#faceDetectVideo')[0].width());
  $('#screenShotVideo')[0].width = $('#faceDetectVideo').width();
}
$(document).ready(function(){
    $('screenShotBut').click(screenShotButHendler);
    videoInit();
});

function videoInit() {

  navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia ||  navigator.mozGetUserMedia;

  if (navigator.getUserMedia) {
    var rect = document.getElementById('faceDetectVideo').getBoundingClientRect();
    navigator.getUserMedia(
      { audio: false, video: { width: rect.height, height: rect.height } },
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
  
}

function screenShotButHendler(){

}
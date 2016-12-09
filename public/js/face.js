$(document).ready(function(){
    $('#screenShotBut').click(screenShotButHendler);
    $('#sendFaceBut').click(sendFaceButHendler);
    videoInit();
});

var video;
var canvas;
var width;
var streaming;

function videoInit() {

  navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia ||  navigator.mozGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      { audio: false, video: true },
      function(stream) {
        video = document.querySelector('video');
        video.src = window.URL.createObjectURL(stream);
        video.onloadedmetadata = function(e) {
          video.play();
        };
        video.addEventListener('canplay', function(ev){
          canvas = document.getElementById('screenShotVideo');
          width = video.videoWidth;
          video.setAttribute('width', width);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', video.videoHeight );
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
  console.log(width);
  context.drawImage(video, 0, 0, width, canvas.height);
}

function sendFaceButHendler(){
  var data = canvas.toDataURL('image/jpeg');
  var img = data.split(',')[1];
  $.ajax({
    url: 'https://api.imgur.com/3/image',
    type: 'post',
    headers: {
        Authorization: 'c482b7cba1c2d17'
    },
    data: {
        image: img
    },
    dataType: 'json',
    success: function(response) {
        if(response.success) {
            window.location = response.data.link;
        }
    }
  });
}
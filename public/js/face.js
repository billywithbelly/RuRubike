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
  $("#Console").val("Uploading...");
  var data = canvas.toDataURL('image/jpeg',0.5);
  var img = data.replace("data:image/jpeg;base64,","");
  $.post('/upload',{url:img},function(res){
    $("#Console").val("Detecting...");
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false"
    };
      
    $.ajax({
        url: "https://api.projectoxford.ai/face/v1.0/detect?" + $.param(params),
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","8f7a031e5133417aa8b1f1ab525efec1");
        },
        type: "POST",
        data: "{url:\""+res+"\"}",
    })
    .done(function(data) {
        console.log(data);
    })
    .fail(function() {
        console.log("Error");
    });
  });
}
$(document).ready(function(){
    $('.modal').modal();
    $('#screenShotBut').click(screenShotButHendler);
    $('#sendFaceBut').click(sendFaceButHendler);
    videoInit();
    getFaceList();
});

var video;
var canvas;
var width;
var streaming;
var FaceMap={};

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
  $("#Console").val("上傳圖片...");
  var data = canvas.toDataURL('image/jpeg',0.5);
  var img = data.replace("data:image/jpeg;base64,","");
  $.post('/upload',{url:img},function(res){
    $("#Console").val("正在推測...");
    faceDetect(res);
  });
}

function faceDetect(url){
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false"
    };

    var body = {
      url:url
    };
      
    $.ajax({
        url: "https://api.projectoxford.ai/face/v1.0/detect?" + $.param(params),
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","8f7a031e5133417aa8b1f1ab525efec1");
        },
        type: "POST",
        data: JSON.stringify(body)
    })
    .done(function(data) {
        $("#Console").val("搜尋圖庫...");
        var faceId = data[0].faceId;
        findSimilar(faceId);
    })
    .fail(function() {
        console.log("Error");
    });
}

function findSimilar(faceId){
  var params = {
  };
  var body = {    
    "faceId":faceId,
    "faceListId":"findjobexhibit2017",  
    "maxNumOfCandidatesReturned":5,
    "mode": "matchFace"
  }
  $.ajax({
      url: "https://api.projectoxford.ai/face/v1.0/findsimilars?" + $.param(params),
      beforeSend: function(xhrObj){
          // Request headers
          xhrObj.setRequestHeader("Content-Type","application/json");
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","8f7a031e5133417aa8b1f1ab525efec1");
      },
      type: "POST",
      // Request body
      data: JSON.stringify(body)
  })
  .done(function(data) {
      $("#Console").val("已完成");
      var persistedFaceId = data[0].persistedFaceId;
      OutputConclusion(persistedFaceId);
  })
  .fail(function() {
      alert("error");
  });
}

function getFaceList(){
  var params = {
      // Request parameters
  };
  $.ajax({
      url: "https://api.projectoxford.ai/face/v1.0/facelists/findjobexhibit2017?" + $.param(params),
      beforeSend: function(xhrObj){
          // Request headers
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","8f7a031e5133417aa8b1f1ab525efec1");
      },
      type: "GET",
      // Request body
      data: "{}",
  })
  .done(function(data) {
      var persistedFaces = data.persistedFaces;
      for(var i in persistedFaces){
        var temp = persistedFaces[i];
        FaceMap[temp.persistedFaceId] = eval("("+temp.userData+")");
      }
      console.log(FaceMap);
  })
  .fail(function() {
      alert("error");
  });
}

function OutputConclusion(persistedFaceId){
  var data = FaceMap[persistedFaceId];
  console.log(data);
  var url = data.url;
  var img = document.createElement('img');
  img.src = url;
  img.width = 500;
  img.onload = function(){
    $("#OutputFaceImg").html("");
    $("#OutputFaceImg").append(img);
    $('#OutputModal').modal('open');
  }
}
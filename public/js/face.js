var FaceDatas = {
  '1':{
    'isHide':false,
    'name':'莎夏·菲佛',
    'movie':'驚爆焦點',
    'industry':'傳播',
    'suggest':['壹傳媒(C-4) '],
    'job':'記者',
    'gender':'female'
  },
  '2':{
    'isHide':true,
    'name':'森山美栗',
    'movie':'月薪嬌妻',
    'industry':'',
    'suggest':[],
    'job':'派遣幫傭',
    'gender':'female'
  },
  '3':{
    'isHide':false,
    'name':'祖克伯',
    'movie':'社群網戰',
    'industry':'科技',
    'suggest':['微軟(A-1)','Acer(C-3)'],
    'job':'工程師',
    'gender':'male'
  },
  '4':{
    'isHide':false,
    'name':'亞當',
    'movie':'天菜大廚',
    'industry':'餐飲',
    'suggest':['王品(A-2)','春水堂(B-1)'],
    'job':'廚師',
    'gender':'male'
  },
  '5':{
    'isHide':false,
    'name':'阿不思',
    'movie':'等一個人咖啡',
    'industry':'餐飲',
    'suggest':['王品(A-2)','春水堂(B-1)'],
    'job':'咖啡師',
    'gender':'female'
  },
  '6':{
    'isHide':true,
    'name':'紐特．斯卡曼德',
    'movie':'怪獸與他們的產地',
    'industry':'',
    'suggest':[],
    'job':'魔法師',
    'gender':'male'
  },
  '7':{
    'isHide':false,
    'name':'安德莉亞',
    'movie':'穿著prada的惡魔',
    'industry':'服飾/時尚/美妝/出版',
    'suggest':['屈臣氏(C-1)','86小舖(C-5)'],
    'job':'助理',
    'gender':'female'
  },
  '8':{
    'isHide':true,
    'name':'蘇珊',
    'movie':'麻辣間諜',
    'industry':'',
    'suggest':[],
    'job':'特務',
    'gender':'female'
  },
  '9':{
    'isHide':true,
    'name':'夏洛克．福爾摩斯',
    'movie':'新世紀福爾摩斯',
    'industry':'',
    'suggest':[],
    'job':'特務',
    'gender':'male'
  },
  '10':{
    'isHide':false,
    'name':'半澤直樹',
    'movie':'半澤直樹',
    'industry':'金融',
    'suggest':['台新金控(A-5)','康健人壽(C-2)'],
    'job':'銀行員',
    'gender':'male'
  }
};
console.log(FaceDatas);
$(document).ready(function(){
    $('.modal').modal();
    $('#screenShotBut').click(screenShotButHendler);
    $('#sendFaceBut').click(sendFaceButHendler);
    $("#sendFaceBut").hide();
    videoInit();
    getFaceList();
});

var video;
var canvas;
var width;
var streaming;
var FaceMap={};
var gender;

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
  $("#sendFaceBut").show();
}

function sendFaceButHendler(){
  canvas.toBlob(function(blob){
      console.log(blob);
      $("#Console").val("正在推測...");
      faceDetect(blob);
  }, "image/jpeg", 0.5);
}

function faceDetect(blob){
    var oReq = new XMLHttpRequest();
      oReq.open("POST", 'https://api.projectoxford.ai/face/v1.0/detect?returnFaceAttributes=age,gender', true);
      oReq.setRequestHeader("Content-Type", "application/octet-stream");
      oReq.setRequestHeader("Ocp-Apim-Subscription-Key", "8f7a031e5133417aa8b1f1ab525efec1");
      oReq.onload = function (oEvent) {
        // Uploaded.
        var data = JSON.parse(oEvent.target.responseText);
        console.log(data);
        var faceId = data[0].faceId;
        gender = data[0].faceAttributes.gender;
        findSimilar(faceId);
      };
      oReq.send(blob);
}

function findSimilar(faceId){
  var params = {
  };
  var body = {    
    "faceId":faceId,
    "faceListId":"findjobexhibit2017",  
    "maxNumOfCandidatesReturned":10,
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
      //var persistedFaceId = data[0].persistedFaceId;
      for(var i in data){
        var row = data[i];
        var row_persistedFaceId = row.persistedFaceId;
        var face_to_id = FaceMap[row_persistedFaceId].id;
        var row_gender = FaceDatas[face_to_id]['gender'];
        console.log(gender,row_gender);
        if(gender==row_gender){
          break;
        }
      }
      OutputConclusion(row_persistedFaceId);
  })
  .fail(function(e) {
      console.log(e);
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
  .fail(function(e) {
      console.log(e);
  });
}

function OutputConclusion(persistedFaceId){
  var data = FaceMap[persistedFaceId];
  console.log(data);
  var url = data.url;
  var img = document.createElement('img');
  img.src = url;
  img.id = "inputAImg";
  img.style = "width:100%;";
  img.onload = function(){
    $("#OutputFaceImg").html("");
    $("#OutputFaceImg").append(img);
    $('#OutputModal').modal('open');
  }

  var inputUrl = canvas.toDataURL();
  var inputImg = document.createElement('img');
  inputImg.src = inputUrl;
  inputImg.id = "inputImg";
  inputImg.style = "width:100%;";
  inputImg.onload = function(){
    $("#InputFaceImg").html("");
    $("#InputFaceImg").append(inputImg);
  }
  $('#OutputName').html("");
  $('#OutputSuggest').html("");
  var id = data.id;
  var sid = ""+id;
  var manData = FaceDatas[sid];
  var h2 = document.createElement('h3');
  h2.innerHTML = manData['job']+"  "+manData['name']+'('+manData['movie']+')';
  $('#OutputName').append(h2);
  if(manData.isHide){
    var h4 = document.createElement('h4');
    h4.innerHTML = "也許你可以取櫃檯領一杯咖啡喝喔(恭喜中獎) :)";
    $('#OutputSuggest').append( h4);
  }
  else{
    var h4 = document.createElement('h4');
    h4.innerHTML = "也許你可以來這些攤位看看";
    $('#OutputSuggest').append(h4);
    for(var i in manData.suggest){
      var vand = manData.suggest[i];
      var h5 = document.createElement('h5');
      h5.innerHTML = vand;
      $('#OutputSuggest').append( h5);
    }
  }
}
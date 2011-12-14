onload = function() {
  init();
};
function init() {
  var canvas = document.getElementsByTagName('canvas')[0];
  var codeElm = document.getElementById('processing-code');
  var code = codeElm.textContent || codeElm.innerText;
  new Processing(canvas, code);
}
var context = new webkitAudioContext();
var gainNode = context.createGainNode();		//音量変えるノード
var analyserNode = context.createAnalyser();
var analyzedData = new Uint8Array(analyserNode.frequencyBinCount);
var source = context.createBufferSource();
var request = new XMLHttpRequest();
(function() {
  $(function() {
    gainNode.gain.value = 0.5;
    
    source.connect(gainNode);
    gainNode.connect(analyserNode);		//destinationが最終的な出力
    analyserNode.connect(context.destination);	
    
    play = function(){
      source.buffer = context.createBuffer(request.response, false);
      source.noteOn(0);
      source.loop = true;
      setInterval(function(){
        socket.send(analyzedData);
        analyserNode.getByteTimeDomainData(analyzedData);
      },60);
    };
    $("form").submit(function () {
      //var url = "http://localhost:3000/images/xmas-jinglebell2-short.ogg";
      var url = $("#url").val();
      var encodedUrl = encodeURI(url);
      request.open("POST", '/req', true);
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
      request.responseType = "arraybuffer";
      $("#status").text("ready...");	
      console.log($("#url").val());
      request.onload = function() {
    	$("#status").text("OK!");
    	play();
      };
      request.send('url=' + encodedUrl);
      
      $("#url").val("").blur();
      return false;
    });
  });
}).call(this);

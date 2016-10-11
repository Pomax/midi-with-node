var socket = io();

socket.on('connected', function(msg){
  console.log(msg);
  drawKeyboard();
  document.addEventListener('keydown', (evt) => { checkSpecialDown(evt); keydown(evt); });
  document.addEventListener('keyup', (evt) => { checkSpecialDown(evt); keyup(evt); });
  setupArpeggiator();
});

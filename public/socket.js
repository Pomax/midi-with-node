var socket = io();

socket.on('connected', function(msg){
  console.log(msg);

  drawKeyboard();

  document.addEventListener('keydown', keydown);
  document.addEventListener('keyup', keyup);
});

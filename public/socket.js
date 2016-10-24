function bootstrap() {
	drawKeyboard();
	document.addEventListener('keydown', (evt) => { checkSpecialDown(evt); keydown(evt); });
	document.addEventListener('keyup', (evt) => { checkSpecialDown(evt); keyup(evt); });
	setupArpeggiator();
}

if (typeof io !== "undefined") {
	var socket = io();
	socket.on('connected', function(msg){
    console.log(msg);
		bootstrap();
	});
}

else { bootstrap(); }

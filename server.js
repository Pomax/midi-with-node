var path = require('path'),
    express = require('express'),
    app = express(),
    socketio = require('socket.io'),
    easymidi  = require('easymidi'),
    deviceName = 'NodeJS MIDI out',
    verbose = process.argv.indexOf("--verbose")>-1;

if (process.platform === "win32") {
  // find the loopmidi 'NodeJS MIDI out' virtual port
  var outputs = easymidi.getOutputs();
  outputs.some(name => {
    console.log(name, deviceName);
    if (name.toLowerCase().indexOf(deviceName.toLowerCase()) > -1) {
      out = new easymidi.Output(name);
      return true;
    }
    return false;
  });
} else {
  out = new easymidi.Output(deviceName, true);
}

app.use(express.static(path.join(__dirname,'public')));

app.get('/socket.io.js', function(req, res) {
  res.sendFile('socket.io.js', {
    root: path.join(__dirname, 'node_modules', 'socket.io-client', 'dist')
  });
});

var http = require('http'),
   server = http.Server(app),
   io = socketio(server);

io.sockets.on('connection', function(socket) {
  console.log("User Connected");

  socket.emit('connected', 'you are now connected.');

  socket.on('noteon', function(data) {
    if (verbose) {
      console.log('emitting noteon:',data);
    }
    out.send('noteon', data);
  });

  socket.on('noteoff', function(data) {
    if (verbose) {
      console.log('emitting noteoff:',data);
    }
    out.send('noteoff', data);
  });
});

server.listen(process.env.PORT || 8080, function(){
  console.log('listening on *:8080');
});

var path = require('path'),
    express = require('express'),
    app = express(),
    socketio = require('socket.io'),
    em  = require('easymidi'),
    out = new em.Output('NodeJS MIDI out', true);

app.use(express.static(path.join(__dirname,'public')));

app.get('/socket.io.js', function(req, res) {
  res.sendFile('socket.io.js', {
    root: path.join(__dirname, 'node_modules', 'socket.io-client')
  });
});

var http = require('http'),
   server = http.Server(app),
   io = socketio(server);

io.sockets.on('connection', function(socket) {
  console.log("User Connected");

  socket.emit('connected', 'you are now connected.');
 
  socket.on('noteon', function(data) {
    console.log('noteon:',data);
    out.send('noteon', data);
  });

  socket.on('noteoff', function(data) {
    console.log('noteoff:',data);
    out.send('noteoff', data);
  });
});

server.listen(process.env.PORT || 8080, function(){
  console.log('listening on *:8080');
});

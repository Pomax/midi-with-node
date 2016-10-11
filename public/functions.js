function getKey(key) {
  if (!map[key]) return false;
  var base = Object.assign({}, map[key]);
  base.pitch += updown;
  base.note += updown * 12;
  return base;
}

function makeClass(name, pitch) {
  return [
    name.substring(0,2).replace('♯','-sharp'),
    `pitch${pitch}`
  ].join(' ');
}

function makeQS(name, pitch) {
  let cls = makeClass(name, pitch);
  return '.' + cls.replace(/ +/g,'.');
}

function highlight(key) {
  document.querySelector(makeQS(key.name, key.pitch)).classList.add('active');
}

function release(key) {
  document.querySelector(makeQS(key.name, key.pitch)).classList.remove('active');
}

function checkSpecialDown(evt) {
  if (evt.altKey || evt.ctrlKey || evt.shiftKey || evt.metaKey) {
    SpecialKeyInstruction = true;
  }
}

function checkSpecialUp(evt) {
  if (evt.altKey || evt.ctrlKey || evt.shiftKey || evt.metaKey) {
    SpecialKeyInstruction = false;
  }
}

function keydown(evt) {
  if (SpecialKeyInstruction) return;

  // pitch control
  if (evt.keyCode === 37 || evt.keyCode === 39) {
    evt.preventDefault();
    if(evt.keyCode===37) {
      --updown;
    } else if (evt.keyCode===39) {
      ++updown;
    }
    if (updown<-2) { updown = -2; }
    if (updown>4) { updown = 4; }
    relabelKeys();
  }

  // playable key
  var key = getKey(evt.key);
  if (!key) return;
  let note = key.note;
  if (note<0 || note > 127) return;

  if (down[note]) return
  down[note] = key;

  let data = {
    note: note,
    velocity: 100,
    channel: 1
  };
  
  socket.emit('noteon', data);
  highlight(key);
}

function keyup(evt) {
  if (SpecialKeyInstruction) return;

  var key = getKey(evt.key);
  if (!key) return;
  let note = key.note;
  if (note<0 || note > 127) return;

  down[note] = false;

  let data = {
    note: note,
    velocity: 100,
    channel: 1
  };
  
  socket.emit('noteoff', data);
  release(key);
}

function keepLocal(evt) {
  evt.stopPropagation();
}

function addOctave(pitch, container) {
  Object.keys(octave).forEach(name => {
    let div = document.createElement('div');
    let cls = makeClass(name, pitch);
    div.setAttribute('class',`${octave[name]} key ${cls}`);
    container.appendChild(div);
  });
}

function drawKeyboard() {
  let d = document.querySelector('#keys');
  c1 = 41
  for(let pitch = -1; pitch<7; pitch++) {
    addOctave(pitch, d);
  }
  relabelKeys();
}

function relabelKeys() {
  let keys = document.querySelectorAll('.key');
  Array.from(keys).forEach(e => e.textContent='');
  Object.keys(map).forEach(letter => {
    let key = getKey(letter);
    let qs = makeQS(key.name, key.pitch);
    let e = document.querySelector(qs);
    if (e) {
      e.textContent = letter;
    }
  });
}

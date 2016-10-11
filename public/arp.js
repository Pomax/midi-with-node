function setupArpeggiator() {
  let arp = document.querySelector('#arp');
  new Arpeggiator(6, 16, arp);
}


/**
 * ...
 * ...
 * ...
 */
function Arpeggiator(tracks, columns, container) {
  this.tracks = tracks;
  this.columns = columns;
  this.container = container || document.createElement("div");
  this.container.setAttribute("class", "arpeggiator");
  this.setBPM(140);
  this.setSwing(0);
  this.setup();
}

Arpeggiator.prototype = {
  setup: function() {
    for(let i=0; i<this.columns; i++) {
      let column = new ArpColumn(i, this.tracks, this);
      this[i] = column;
      this.container.appendChild(column.element);
    }
    this.addButtons();
  },
  selectCell: function(row, col) {
    if (col < this.columns) {
      this[col].selectCell(row, col);
    }
  },
  addButtons: function() {
    var ctrls = document.createElement("div");
    ctrls.setAttribute("class", "controls");
    ctrls.innerHTML = "";
    ctrls.innerHTML += "<p>BPM</p><input type='number' class='bpm' step='1' value='"+this.bpm+"'>";
    ctrls.innerHTML += "<p>swing</p><input type='number' class='swing' step='0.01' value='"+this.swing+"'>";
    this.container.appendChild(ctrls);

    let bpm = ctrls.querySelector('.bpm');
    bpm.addEventListener("change", evt => {
      let val = parseInt(bpm.value);
      if (val < 1 || val > 500) {
        if (val < 1) val = 1;
        if (val > 500) val = 500;
        bpm.value = val;
      }
      this.setBPM(val);
    });
    bpm.addEventListener("keydown", keepLocal);
    bpm.addEventListener("keyup", keepLocal);

    var swing = ctrls.querySelector('.swing');
    swing.addEventListener("change", evt => {
      let val = parseFloat(swing.value);
      if (val < 0 || val > 1) {
        if (val < 0) val = 0;
        if (val > 1) val = 1;
        swing.value = val;
      }
      this.setSwing(val);
    });
    swing.addEventListener("keydown", keepLocal);
    swing.addEventListener("keyup", keepLocal);

    var play = document.createElement("button");
    play.setAttribute("class","play");
    play.textContent = "play";
    play.addEventListener("click", () => this.play());
    this.container.appendChild(play);

    var stop = document.createElement("button");
    stop.setAttribute("class","stop");
    stop.textContent = "stop";
    stop.addEventListener("click", () => this.stop());
    this.container.appendChild(stop);
  },

  setBPM: function(val) {
    this.bpm = val;
    this.interval = 60000 / val / 4; 
  },

  setSwing: function(val) {
    this.swing = val;
  },

  play: function() {
    this.playing = 0;

    let playColumn = () => {
      if (this.playing === false) return;

      // figure out the timeout based on the BMP-derived
      // interval and the swing offset for this column.
      let swingDirection = (this.playing % 2 == 0) ? 1 : -1;
      let swingOffset = this.interval * this.swing * swingDirection;
      let interval = this.interval + swingOffset;

      setTimeout(() => playColumn(), interval);

      this.clearArpHighlight();
      this[this.playing].play(this.interval);
      this.playing++;
      if (this.playing >= this.columns) {
        this.playing = 0;
      }
    };

    playColumn();
  },

  stop: function() {
    this.playing = false;
    this.clearArpHighlight();
  },

  clearArpHighlight: function() {
    Array.from(document.querySelectorAll('.arp-cell.active')).forEach(c => c.classList.remove('active'));
  }
};


/**
 * ...
 * ...
 * ...
 */
function ArpColumn(column, tracks, owner) {
  this.column = column;
  this.tracks = tracks;
  this.owner = owner;

  this.element = document.createElement("div");
  this.element.setAttribute("class","arp-column");
  this.setup();
}

ArpColumn.prototype = {
  setup: function() {
    for(let i=0; i<this.tracks; i++) {
      this[i] = new ArpCell(i, this.column, this);
      this.element.appendChild(this[i].element);
    }
  },
  play: function(duration) {
    for(let i=0; i<this.tracks; i++) {
      this[i].play(duration);
    }
  },
  selectCell: function(row, col) {
    if (col===this.column) {
      if (row < this.element.children.length) {
        this[row].element.focus();
      }
    } else {
      this.owner.selectCell(row, col);
    }
  }
};


/**
 * ...
 * ...
 * ...
 */
function ArpCell(row, column, owner) {
  this.row = row;
  this.column = column;
  this.owner = owner;

  this.key = false;
  this.element = document.createElement("div");
  this.element.setAttribute("class", "arp-cell");
  this.element.setAttribute("tabindex", 0);
  this.setup();
}

ArpCell.prototype = {
  setup: function() {
    this.element.addEventListener("focus", e => this.element.classList.add('selected'));
    this.element.addEventListener("blur", e => this.element.classList.remove('selected'));
    this.element.addEventListener("keydown", e => this.input(e));
  },
  input: function(evt) {

    let key = evt.key;
    let keyCode = evt.keyCode;

    // left, up, right, down
    if (keyCode >= 37 && keyCode <=40) {
      keepLocal(evt);
      evt.preventDefault();
      if (keyCode === 37 && this.column>0) { this.owner.selectCell(this.row, this.column - 1); }
      if (keyCode === 38 && this.row>0) { this.owner.selectCell(this.row - 1, this.column); }
      if (keyCode === 39) { this.owner.selectCell(this.row, this.column + 1); }
      if (keyCode === 40) { this.owner.selectCell(this.row + 1, this.column); }
      return;
    }

    if (key !== null) {
      if (!key.trim()) {
        this.key = false;
        this.element.textContent = '';
      } else {
        this.key = getKey(key);
        if (!this.key) {
          this.key = false;
          this.element.textContent = '';
        } else {
          this.key.velocity = 100;
          this.element.innerHTML = "<span class='arp-cell-label'>" + this.key.note + "</span>";
       }
      }
    }
  },
  play: function(duration) {
    this.element.classList.add('active');
    if (this.key) {
      socket.emit('noteon', this.key);
      highlight(this.key);
      setTimeout(() => {
        socket.emit('noteoff', this.key);
        release(this.key);
      }, duration);
    }
  }
};

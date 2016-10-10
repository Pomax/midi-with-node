function setupArpeggiator() {
  let arp = document.querySelector('#arp');
  new Arpeggiator(6, 16, arp);
}

function Arpeggiator(tracks, columns, container) {
  this.tracks = tracks;
  this.columns = columns;
  this.container = container || document.createElement("div");
  this.container.setAttribute("class", "arpeggiator");
  this.interval = 250;
  this.matrix = [];
  this.setup();
}

Arpeggiator.prototype = {
  setup: function() {
    for(let i=0; i<this.columns; i++) {
      let column = new ArpColumn(this.tracks);
      this.matrix[i] = column;
      this.container.appendChild(column.element);
    }

    this.addButtons();
  },
  addButtons: function() {
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

  play: function() {
    this.playing = 0;

    let playColumn = () => {
      if (this.playing === false) return;

      setTimeout(() => playColumn(), this.interval);
      this.matrix[this.playing].play();
      this.playing++;
      if (this.playing >= this.columns) {
        this.playing = 0;
      }
    };

    playColumn();
  },

  stop: function() {
    this.playing = false;
  }
};

function ArpColumn(tracks) {
  this.tracks = tracks;
  this.element = document.createElement("div");
  this.element.setAttribute("class","arp-column");
  this.setup();
}

ArpColumn.prototype = {
  setup: function() {
    for(let i=0; i<this.tracks; i++) {
      this[i] = new ArpCell();
      this.element.appendChild(this[i].element);
    }
  },
  play: function() {
    for(let i=0; i<this.tracks; i++) {
      this[i].play();
    }
  }
};

function ArpCell() {
  this.key = false;
  this.duration = 250;
  this.element = document.createElement("div");
  this.element.setAttribute("class", "arp-cell");
  this.setup();
}

ArpCell.prototype = {
  setup: function() {
    this.element.addEventListener("click", () => {
      var key = prompt("press a key on the keyboard");
      if (key !== null) {
        if (!key.trim()) {
          this.key = false;
          this.element.textContent = '';
        } else {
          this.key = getKey(key);
          this.key.velocity = 100;
          this.element.innerHTML = "<span class='arp-cell-label'>" + this.key.note + "</span>";
        }
      }
    });
  },
  play: function() {
    if (this.key) {
      socket.emit('noteon', this.key);
      setTimeout(() => {
        socket.emit('noteoff', this.key);
      }, this.duration);
    }
  }
};

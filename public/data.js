let octave = {
  'C': 'white',
  'C♯/D♭': 'black',
  'D': 'white',
  'D♯/E♭': 'black',
  'E': 'white',
  'F': 'white',
  'F♯/G♭': 'black',
  'G': 'white',
  'G♯/A♭': 'black',
  'A': 'white',
  'A♯/B♭': 'black',
  'B' : 'white'
};

var SpecialKeyInstruction = false;

var down = {};

var updown = 0;

var map = {
  'z': { note:41, pitch: 1, name:'C'},
  's': { note:42, pitch: 1, name:'C♯/D♭'},
  'x': { note:43, pitch: 1, name:'D'},
  'd': { note:44, pitch: 1, name:'D♯/E♭'},
  'c': { note:45, pitch: 1, name:'E'},
  'v': { note:46, pitch: 1, name:'F'},
  'g': { note:47, pitch: 1, name:'F♯/G♭'},
  'b': { note:48, pitch: 1, name:'G'},
  'h': { note:49, pitch: 1, name:'G♯/A♭'},
  'n': { note:50, pitch: 1, name:'A'},
  'j': { note:51, pitch: 1, name:'A♯/B♭'},
  'm': { note:52, pitch: 1, name:'B'},
  'q': { note:53, pitch: 2, name:'C'},
  '2': { note:54, pitch: 2, name:'C♯/D♭'},
  'w': { note:55, pitch: 2, name:'D'},
  '3': { note:56, pitch: 2, name:'D♯/E♭'},
  'e': { note:57, pitch: 2, name:'E'},
  'r': { note:58, pitch: 2, name:'F'},
  '5': { note:59, pitch: 2, name:'F♯/G♭'},
  't': { note:60, pitch: 2, name:'G'},
  '6': { note:61, pitch: 2, name:'G♯/A♭'},
  'y': { note:62, pitch: 2, name:'A'},
  '7': { note:63, pitch: 2, name:'A♯/B♭'},
  'u': { note:64, pitch: 2, name:'B'},
  'i': { note:65, pitch: 3, name:'C'},
  '9': { note:66, pitch: 3, name:'C♯/D♭'},
  'o': { note:67, pitch: 3, name:'D'},
  '0': { note:68, pitch: 3, name:'D♯/E♭'},
  'p': { note:69, pitch: 3, name:'E'}
};

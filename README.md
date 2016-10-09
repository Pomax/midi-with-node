# A simple browser-as-MIDI-keyboard thing

This code relies on `node` with `easymidi` to set up a virtual MIDI device, `express` for acting as a simple server, and `socket.io` to let a browser communicate keyup/keydown to the node server so that it can generate the corresponding MIDI events.

The MIDI devide will show up as "Nodejs MIDI out" in any DAW (digital audio workstation) with MIDI device capabilities (for instance, [Reaper](http://www.reaper.fm) or [FL Studio](https://www.image-line.com/flstudio)), so simply select and/or enable it in the list of MIDI inut devices, and start typing in the browser with your keyboard. Load up a virtual instrument for infinite fun (I'm currently messing around with [Eighty Eight Ensemble](http://sonivoxmi.com/products/details/eighty-eight-ensemble-2) by [SONiVOX](http://sonivoxmi.com), which is a 9' steinway piano).

The following keyboard bindings are supported:

```
 2 3   5 6 7   9 0
q w e r t y u i o p
| | | | | | | | | |
C D E F G A B C D E
3             4

 s d   g h j
z x c v b n m
| | | | | | |
C D E F G A B
2
```

Use your up/down arrow keys to shift the input by entire octaves.

# How-to-"this"

Clone and install:

```
$> git clone https://github.com/Pomax/midi-with-node
$> cd midi-with-node
$> npm i
```

Then in order to use things, first run the server to set up the virtual MIDI keyboard:

```
$> node server
```

This also lets you open [http://localhost:8080](http://localhost:8080) in the browser for generating MIDI events.

Then in your DAW, go to the MIDI device options and find the "Nodejs MIDI out" device and either enable it or add it to your list of active MIDI inputs.

At this point you can do whatever you want in your DAW to set up tracks that are bound to MIDI input, and typing keys in the browser tab for the virtual MIDI device will send MIDI events to your DAW.

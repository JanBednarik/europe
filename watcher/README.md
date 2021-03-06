Demonstration of WebSocker communication between server side code connected 
directly to gate hardware and frontend Javascript code in browser.

This is not final version of watcher application. There are still commented
parts in code, because there are still plenty work in progress. But core 
functionality is working (websocket communication between browser/server,
communication with boards through ModBus).

# Setup

You will need NUC minipc with Ubuntu, ModBus adapter, few gates connected
together and http access to NUC.

Then follow this steps:

1) Build Docker image:

        docker build -t msgre/common:europe-watcher.latest .

2) Run Docker image:

        docker run -ti --rm --name watcher --device /dev/ttyUSB0 -p 8082:8082 msgre/common:europe-watcher.latest

   You must provide access to physical ModBus adapter usualy mounted to 
   `/dev/ttyUSBX` and expose port 8082 to HTML demo page.

   There is also DEBUG mode in case you have no access to physical devices:

        docker run -ti --rm --name watcher -e DEBUG=1 -v $PWD/gates:/root/gates -p 8082:8082 msgre/common:europe-watcher.latest

   For details about DEBUG mode see below.

3) Open web browser
   Put there URL of NUC (in my case something like http://192.168.0.113:8082/).
   Open web developer javascript console and try press some button on keyboard
   gate (you should see published events from watcher). If you run
   `window.eu_session.publish('com.europe.start', [1]);` command in console
   you will enable gates. From now you should see also events about ball passing
   gates.

# Data format

Messages from `watcher`:

* `com.europe.keyboard`
  - you will receive code with button pressed
  - keyboard gate is technically same as normal gate; it's up to you how you
    configure physical buttons -- each button have own bit (see bellow)
* `com.europe.gate`
  - you will receiver object
  - keys represent gate code (1-16)
  - value represent crossed gates, each bit represent individual gate (see bellow)

Messages for `watcher`:

* `com.europe.effect`
  - turn on some of the LED effect on main gamebord
  - you must provide code representing mode
  - TODO: describe modes
* `com.europe.light`
  - switch on particular LED on main gamebord
  - you must provide 2 parameters: LED order number and color
  - addressed LED will blink 3 times and then stay in switch on state
* `com.europe.start`
  - start watching of game gates (from this time `com.europe.gate` events will 
    be published)
  - provide any value (it is ignored)
* `com.europe.stop`
  - stop watching of game gates
  - provide any value (it is ignored)

# DEBUG mode

For easier debugging of websockets communication, you could turn on DEBUG mode 
on watcher script. In this mode, container will be watching directory ~/gates
and looking for structure like:

    ~/gates/<GATE_NUMBER>/<GATE_STATUS>

Where:

    <GATE_NUMBER> is directory in form of integer number, defining specific gate
    <GATE_STATUS> is empty file which filename represent gate status

For example file on path `~/gates/14/1` will be emited as ball passing gate
`1` on board `14`.

You could map directory `~/gates` into container from your host machine, and
then simulate traffic on gameboard by invoking simple touch commands:

    touch ~/gates/14/1

After each read over `~/gate` directory, all founded files will be deleted.

## Gate mapping

Each gate is capable of watching 6 gates. If you look on board from above,
you will see 6 connectors. They are mapped to individual bits of 16 bit value:
        
        [04] [08]
     [01] [02] [10] [20]

For example when ball pass gate 01, you will get value 1. When ball pass gate 20,
you will get value 32.
Board could give you combined value, for example if 2 mentioned gates are crossed 
in nearly same time, you will get value 33 (it is nonsense from game perspective,
but technically it is possible).

# Behaviour of Neopixel's LED

In normal mode, Neopixel's LEDs are controlled during the game (effects on
intro page, countdown, during the game, etc).

Neopixels have noticeable current consumption, which leads time to time to
unstability of clustered boards. There is "emergency" environment variable
for situations like this.

Run container with variable LED_OFF=1 and all Neopixels effects will be disabled.

## Demos

For debugging purposes, all Neopixels effects are available through neopixels.py
library. Just run:

    python neopixels.py <EFFECT> <COM> <SLAVE>

where:

    <EFFECT> is name of Neopixels effect you want to see
    <COM> is path to USB ModBus device
    <SLAVE> is number of gate controlling neopixels

For example:

    python neopixels.py rainbow /dev/ttyUSB0 13


# Issues

On OSX Docker run inside Virtualbox machine, so there is one more layer to beat.
If you connect ModBus adapter into USB on Mac, you will see device like
`/dev/tty.usbserial-AJ03KXCG`. When I provide access for docker container
through `--device` switch, this device will be mapped to `/dev/ttyUSBX` in 
docker machine (to be sure, go into docker machine and check it: 
`docker-machine ssh` and `ls -l /dev | grep -i usb`), but you must allow access 
to USB device in VirtualBox IDE.

Even after this arrangement code was unstable (even with `--privileged` switch). 
For me it was easier move to physical NUC and develop code directly on production
hardware.

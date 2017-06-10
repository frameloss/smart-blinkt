# smart-blinkt
Tools that can be used for using a Raspberry Pi and a Blinkt LED hat as an alarm status indicator in Smartthings.

What is it?
-----------

*This is very much not ready for general use, just setting up the repository for now, check back soon.*

The [blinkt](https://shop.pimoroni.com/products/blinkt) is a LED hat for the [Raspberry Pi](https://www.raspberrypi.org/). There are three parts: 

 * A very simple SmartApp that exposes the status of Smart Home monitor, and monitors an alarm device (it's not possible to determine if there is an active intrusion alarm from the SHM api, but we *can* query the state of an alarm.)
 * A Python script that consumes the REST enpoint from the SmartApp and controls the LEDs (in development; it works ... but needs some changes before releasing.)
 * [A simple JQuery/HTML page](https://frameloss.github.io/smartthings/) to ease the process of generating an access token for accessing the SmartApp. 

Limitations:
------------

 * It uses the SmartThings REST API. Which requires Internet access. No Internet? No status can be displayed.
 * Very limited functionality: blinking purple when communication isn't working, solid green when disarmed, pulsing orange when in stay, solid red when in away, flashing blue and red when in alarm. 
 * No options to change patterns etc (planned for future.) 
 
Plans:
------

 * Add visual notifications for water sensors, smoke/CO detectors, and motion detectors.
 * Allow using different colors / patterns / brightness for different states
 * Detailed install / setup instructions.
 
Setup:
------

 1) Buy a Raspberry Pi (a Zero W should work, but requires a header and I haven't tested. If it works let me know!)
 1) Get a blinkt. There are several places that sell these, and they are inexpensive. I paid $7 at microcenter, but adafruit, pimonori, and others offer them.
 1) Install the Smartapp in the [SmartThings IDE](https://graph.api.smartthings.com/), be sure to enable OAuth before publishing.
 1) [Get a token and find the application's REST endpoint.](https://frameloss.github.io/smartthings/) and if that doesn't work, use the instructions [here](https://github.com/LXXero/DSCAlarm/blob/master/RESTAPISetup.md)
 1) Install the [Pimonori Python Libraries](https://learn.pimoroni.com/tutorial/sandyj/getting-started-with-blinkt)
 1) Copy the Python script to your Pi, and update the settings to use the correct token and endpoint.
 1) Setup the Pi to start the script at boot time.
 1) Enjoy your blinking lights.


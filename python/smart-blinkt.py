#!/usr/bin/python

 #  Blinkt Alarm Status
 #
 #  Copyright 2017 Todd Garrison
 #
 #  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 #  in compliance with the License. You may obtain a copy of the License at:
 #
 #      http://www.apache.org/licenses/LICENSE-2.0
 #
 #  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 #  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License
 #  for the specific language governing permissions and limitations under the License

import time
import json
import requests
import threading
import os
from datetime import datetime
from blinkt import set_clear_on_exit, set_pixel, show, set_brightness

# Set the following values in config.py
with open( os.path.dirname(os.path.realpath(__file__)) + '/settings.json') as settings:
    data = json.load(settings)

ENDPOINT = data['endpoint'] + "/mode"
TOKEN = data['token']
VERBOSE = data['verbose']


SHOW = "unknown"
LAST = "unknown"

def update_status():
    global ENDPOINT
    global TOKEN
    global LAST
    global SHOW
    global VERBOSE
    state = { 'mode': 'unknown', 'alarm': 'off' }
    h = {"authorization": "Bearer " + TOKEN}
    try:
        r = requests.get(ENDPOINT, headers=h)
        if r.ok:
            state['mode'] = r.json()['state']['value'] or "unknown"
            state['alarm'] = r.json()['alarm'] or "off"
            if VERBOSE:
                print "%s: SHM is %s and alarm is %s" % ( str(datetime.now()), state['mode'], state['alarm'] ) 
            return state
        else:
            print "%s something went wrong, could not parse result, trying again in 15 seconds" % (str(datetime.now()))
            time.sleep(10)
            return state
    except:
       print "%s something went wrong, exception caught, trying again in 60 seconds" % (str(datetime.now()))
       time.sleep(55)
       return state

def set_state():
    global SHOW
    global LAST
    global VERBOSE
    while True:
        state = update_status()
        if (state['alarm'] != "off"):
            SHOW = 'alarm'
        elif state['mode'] == "away":
            SHOW = 'red'
        elif state['mode'] == "stay":
            SHOW = 'yellow'
        elif state['mode'] == "off":
            SHOW = 'green'
        else:
            SHOW = 'unknown'
        LAST = SHOW
        time.sleep(10)

def off():
    for i in range(8):
        set_pixel(i, 0, 0, 0)
    show()

def green():
    set_brightness(0.1)
    for i in range(1):
        set_pixel(i, 0, 32, 0)
    show()
    time.sleep(2)

### This was too obnoxious, maybe make it a config option later ...
#def green():
#    set_brightness(0.4)
#    set_pixel(7, 0, 16, 0)
#    for o in range(2):
#        last = 0
#        for i in range(7):
#            set_pixel(last, 0, 0, 0)
#            set_pixel(i, 0, 16, 0)
#            last = i
#            show()
#            time.sleep(0.1)

def yellow():
    for i in range(8):
        set_brightness(.05 * i / 3 )
        set_pixel(i, 255, 32, 0)
        show()
        time.sleep(0.04)
    time.sleep(1)
    for i in range(8):
        set_pixel(i, 0, 0, 0)
        show()
        time.sleep(0.04)
    time.sleep(1)

def alarm():
    for o in range(10):
        set_brightness(1)
        for i in range(8):
            set_pixel(i, 255, 0, 0)
            show()
            #time.sleep(0.05)
        time.sleep(0.2)
        for i in range(8):
            set_pixel(i, 0, 0, 255)
            show()
        time.sleep(0.2)
    off()

def red():
    set_brightness(0.3)
    for i in range(8):
        set_pixel(i, 255, 0, 0)
    show()
    time.sleep(2)

def unknown():
    set_brightness(1)
    last = 0
    for i in range(8):
        if i % 3 == 0:
            set_pixel(last, 0, 0, 0)
            last = i
            set_pixel(i, 255, 0, 255)
            show()
            time.sleep(0.5)
    for i in range(8):
        set_pixel(i, 0, 0, 0)
        show()

def notify():
    global LAST
    global SHOW
    set_brightness(1)
    for o in range(2):
        for i in range(8):
            set_pixel(i, 0, 0, 255)
        show()
        time.sleep(0.3)
        for i in range(8):
            set_pixel(i, 0, 255, 255)
        show()
        time.sleep(0.3)
        for i in range(8):
            set_pixel(i, 255, 0, 255)
        show()
        time.sleep(0.3)
        off()
    SHOW = LAST
    LAST = "notify"

def blink():
    global SHOW
    while True:
        if SHOW == "green":
            green()
        elif SHOW == "yellow":
            yellow()
        elif SHOW == "red":
            red()
        elif SHOW == "off":
            off()
        elif SHOW == "alarm":
            alarm()
        elif SHOW == "notify":
            notify()
        else:
            unknown()
        time.sleep(0.5)

# Update the LEDs in a thread:
blink = threading.Thread(target=blink)
blink.setDaemon(True)
blink.start()
set_state()
blink.stop()
off()


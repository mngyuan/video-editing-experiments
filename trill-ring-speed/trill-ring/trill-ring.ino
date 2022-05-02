 /*
 ____  _____ _        _
| __ )| ____| |      / \
|  _ \|  _| | |     / _ \
| |_) | |___| |___ / ___ \
|____/|_____|_____/_/   \_\
http://bela.io

\example ring-print

Trill Ring Print
================

This is an example of how to communicate with the Trill Ring
sensor using the Trill Arduino library.

The sensor is set to Centroid mode and touch location and size
printed to the serial port for each of the 5 different simultaneous
touches (prepended by the character 'T').

The values of the 2 buttons on the back of the sensor are also printed
to the serial port whenever their state changes with the following format:
  'B buttonIndex buttonReading'
*/

#include <Trill.h>

#define CROSSOVER_THRESHOLD 200
#define DUMMY_TOUCH_LOCATION 3601

Trill trillSensor;
boolean touchActive = false;
int prevButtonState[2] = { 0 , 0 };
int lastTouchLocation = DUMMY_TOUCH_LOCATION;
int boundaryCrossings = 0;
int currentTouchStart = DUMMY_TOUCH_LOCATION;

void setup() {
  // Initialise serial and touch sensor
  Serial.begin(115200);
  int ret = trillSensor.setup(Trill::TRILL_RING);
  if(ret != 0) {
    Serial.println("failed to initialise trillSensor");
    Serial.print("Error code: ");
    Serial.println(ret);
  }
}

void loop() {
  // Read ~24 times per second
  delay(40);
  trillSensor.read();

  if(trillSensor.getNumTouches() > 0) {
    int largestTouch = 0;
    int largestTouchIdx = 0;
    for(int i = 0; i < trillSensor.getNumTouches(); i++) {
      if (trillSensor.touchSize(i) > largestTouch) {
        largestTouchIdx = i;
        largestTouch = trillSensor.touchSize(i);
      }
    }
    
    int touchLocation = trillSensor.touchLocation(largestTouchIdx);
    if (lastTouchLocation == DUMMY_TOUCH_LOCATION) {
      // initialize on first use
      lastTouchLocation = touchLocation;
    }
    if (touchActive == false) {
      currentTouchStart = touchLocation;
    }
    if (touchLocation < CROSSOVER_THRESHOLD
        && lastTouchLocation > 3600 - CROSSOVER_THRESHOLD) {
      // just crossed CW over 0 boundary
      boundaryCrossings += 1;
    } else if (touchLocation > 3600 - CROSSOVER_THRESHOLD
                && lastTouchLocation < CROSSOVER_THRESHOLD) {
      // just crossed CCW over 0 boundary
      boundaryCrossings -= 1;
    }

//    Serial.print(touchLocation + 3600 * boundaryCrossings); Serial.print(' ');
//    Serial.print(touchLocation); Serial.print(' ');
//    Serial.print(lastTouchLocation); Serial.print(' ');
//    Serial.print(boundaryCrossings); Serial.print(' ');

    Serial.print(touchLocation + 3600 * boundaryCrossings - currentTouchStart);
    Serial.println("");
    touchActive = true;
    lastTouchLocation = touchLocation;
  }
  else if(touchActive) {
    // Print a single line when touch goes off
    Serial.println("null");
    touchActive = false;
    lastTouchLocation = DUMMY_TOUCH_LOCATION;
    boundaryCrossings = 0;
    currentTouchStart = DUMMY_TOUCH_LOCATION;
  }

}

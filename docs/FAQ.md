---
id: FAQ
title: FAQ
---

## Running on Simulator

- iOS simulators currently have **no support** for sensors. In order to retrieve any sensor output, you **must develop on a real device**
- Android simulators offer support for some sensors. [This article](https://developer.android.com/studio/run/emulator#extended) documents how to use them (see "Virtual Sensors" section)

## The Accelerometer always shows a positive value

The Accelerometer will always show a positive z value, because this includes the gravitation from earth.

---
id: FAQ
title: FAQ
---

## Running on Simulator

- iOS simulators currently have **no support** for sensors. In order to retrieve any sensor output, you **must develop on a real device**
- Android simulators offer support for some sensors. [This article](https://developer.android.com/studio/run/emulator#extended) documents how to use them (see "Virtual Sensors" section)

## The Accelerometer always shows a positive value

The Accelerometer will always show a positive z value, because this includes the gravitation from earth.

## Testing with Jest

The library provides a mock implementation for Jest via the following line:

```js
jest.mock('react-native-sensors', () => require('react-native-sensors/mock'))
```

If not done already, create a file named `jestSetup.js` for instance, provide its path to Jest configuration [`setupFiles`](https://jestjs.io/docs/en/configuration.html#setupfiles-array) entry and add the aforementioned line to that setup file.

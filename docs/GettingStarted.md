---
id: GettingStarted
title: Getting Started with React Native Sensors
sidebar_label: Getting Started
---

## Usage

```javascript
import {
  Accelerometer,
  Gyroscope,
  setUpdateIntervalForType
} from "react-native-sensors";

setUpdateIntervalForType("Accelerometer", 400); // defaults to 100ms
const accelerationObservable = new Accelerometer();

// Normal RxJS functions
const subscription = accelerationObservable
  .map(({ x, y, z }) => x + y + z)
  .filter(speed => speed > 20)
  .subscribe(
    speed => console.log(`You moved your phone with ${speed}`),
    error => {
      console.log("The sensor is not available");
    }
  );

setTimeout(() => {
  // If it's the last reference to an Accelerometer
  // we will stop the native API
  subscription.unsubscribe();
}, 1000);
```

For more details see [the usage doc](Usage.Default.md) and if you prefer the decorator syntax, take a look [here](Usage.Decorator.md).

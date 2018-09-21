---
id: Usage.RxJS
title: The RxJS Syntax of React Native Sensors
sidebar_label: RxJS Syntax
---

You can access your sensor data through a [RxJS Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html). This way you have the maximum of control over your data stream. You can add the values up, filter them, only react if a certain value is reached: You have the choice. Here is a small example showing the relatively small API interface. If you would like to learn more, please see the [API specification](/docs/API.html).

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

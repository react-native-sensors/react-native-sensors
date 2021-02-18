---
id: Usage
title: Usage
sidebar_label: General
---

You can access your sensor data through a [RxJS Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html). This way you have the maximum of control over your data stream. You can add the values up, filter them, only react if a certain value is reached: You have the choice. Here is a small example showing the relatively small API interface. If you would like to learn more, please see the [API specification](/docs/API.html).

```javascript
import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
import { map, filter } from "rxjs/operators";

setUpdateIntervalForType(SensorTypes.accelerometer, 400); // defaults to 100ms

const subscription = accelerometer
  .pipe(
    map(({ x, y, z }) => x + y + z),
    filter((speed) => speed > 20)
  )
  .subscribe(
    (speed) => console.log(`You moved your phone with ${speed}`),
    (error) => {
      console.log("The sensor is not available");
    }
  );

setTimeout(() => {
  // If it's the last subscription to accelerometer it will stop polling in the native API
  subscription.unsubscribe();
}, 1000);
```

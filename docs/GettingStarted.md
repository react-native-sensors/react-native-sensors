---
id: GettingStarted
title: Getting Started with React Native Sensors
sidebar_label: Getting Started
---

## Usage

```javascript
import { Accelerometer, Gyroscope } from "react-native-sensors";

let accelerationObservable = null;
new Accelerometer({
  updateInterval: 400 // defaults to 100ms
})
  .then(observable => {
    accelerationObservable = observable;

    // Normal RxJS functions
    accelerationObservable
      .map(({ x, y, z }) => x + y + z)
      .filter(speed => speed > 20)
      .subscribe(speed => console.log(`You moved your phone with ${speed}`));
  })
  .catch(error => {
    console.log("The sensor is not available");
  });

setTimeout(() => {
  accelerationObservable.stop();
}, 1000);
```

For more details see [the usage doc](Usage.Default.md) and if you prefer the decorator syntax, take a look [here](Usage.Decorator.md).

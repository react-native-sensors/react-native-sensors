---
id: API
title: API
---

We decided to use [RxJS](https://github.com/ReactiveX/rxjs) as basis for our implementation.
This means, to use a sensor you simply subscribe to it and you get updates with all emitted values.

If this is too much for you to handle you can either use `setUpdateIntervalForType` to set down the interval in which you get updates or you can use common RxJS operators to throttle down the rate you get updates at on the JS side. In general you should prefer to set the update interval as this will put less stress on you React Native Bridge.

## accelerometer: Observable<{x: number, y: number, z: number, timestamp: string}>

```js
import { accelerometer } from "react-native-sensors";

const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) =>
  console.log({ x, y, z, timestamp })
);
```

It might be interesting to note that the gravity of the earth is not removed from the sensoric values.
Dependening on the position of the phone you will need to substract this from the values if you are interested in the raw values.

## gyroscope: Observable<{x: number, y: number, z: number, timestamp: string}>

```js
import { gyroscope } from "react-native-sensors";

const subscription = gyroscope.subscribe(({ x, y, z, timestamp }) =>
  console.log({ x, y, z, timestamp })
);
```

## magnetometer: Observable<{x: number, y: number, z: number, timestamp: string}>

```js
import { magnetometer } from "react-native-sensors";

const subscription = magnetometer.subscribe(({ x, y, z, timestamp }) =>
  console.log({ x, y, z, timestamp })
);
```

## barometer: Observable<{pressure: number}>

```js
import { barometer } from "react-native-sensors";

const subscription = barometer.subscribe(({ pressure, relativeAltitude }) =>
  console.log({ pressure, relativeAltitude })
);
```

Please note that this sensor has no option to set the update rate and `relativeAltitude` is only available on iOS.

## setUpdateIntervalForType(type: string, interval: number)

As the sensors are global we can only set the rate in which the hardware is read globally.
Please note that the native platforms treat this more as a recommendation than an exact value.

```js
import { setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
setUpdateIntervalForType(SensorTypes.accelerometer, 100);
```

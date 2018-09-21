---
id: API
title: API
---

We have two different APIs to provide the same functionality, one is **Default**, which is more verbose, the other one is **Decorator** which is a bit more elegant, but might be harder to read.

Supported sensors:

* Accelerometer
* Gyroscope
* Magnetometer

The API of each of them is the same, therefore you will just see Accelerometer in the docs:

## General

### setUpdateIntervalForType(type: string, interval: number)

```js
import { setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
setUpdateIntervalForType(SensorTypes.Accelerometer, 100);
```

## RxJS

```js
import { Accelerometer } from "react-native-sensors";
```

### async constructor(options: Object) => SensorObservable

#### options.updateInterval

`number` indicating how often updates should be polled, defaults to 100ms.

### SensorObservable

This is an [RxJS Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html) and when **every observable of this type is** unsubscribed it will automatically stop the sensor from polling.

## Decorator

```js
import { decorator } from "react-native-sensors";
```

### decorator({ [sensorName: string]: (options: Object | Boolean) }) => Function(ReactComponent)

```js
export default sensors({
  Accelerometer: {
    updateInterval: 300
  },
  Gyroscope: true
})(MyComponent);
```

#### options.updateInterval

`number` indicating how often updates should be polled, defaults to 100ms.

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

## Default

```js
import { Accelerometer } from "react-native-sensors";
```

### async constructor(options: Object) => Promise<SensorObservable>

#### options.updateInterval

`number` indicating how often updates should be polled, defaults to 100ms.

### SensorObservable

This is an [RxJS Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html), extended by these functions:

#### stop

Destroys the event creator and closes the observable.

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

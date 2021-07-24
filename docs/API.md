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

const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) => console.log({ x, y, z, timestamp }));
```

It might be interesting to note that the gravity of the earth is not removed from the sensoric values.
Dependening on the position of the phone you will need to substract this from the values if you are interested in the raw values.
See example : [device acceleration](https://react-native-sensors.github.io/docs/Usage.html#Raw-device-acceleration)

## gravity: Observable<{x: number, y: number, z: number, timestamp: string}>

```js
import { gravity } from "react-native-sensors";

const subscription = gravity.subscribe(({ x, y, z, timestamp }) => console.log({ x, y, z, timestamp }));
```

## gyroscope: Observable<{x: number, y: number, z: number, timestamp: string}>

```js
import { gyroscope } from "react-native-sensors";

const subscription = gyroscope.subscribe(({ x, y, z, timestamp }) => console.log({ x, y, z, timestamp }));
```

## magnetometer: Observable<{x: number, y: number, z: number, timestamp: string}>

```js
import { magnetometer } from "react-native-sensors";

const subscription = magnetometer.subscribe(({ x, y, z, timestamp }) => console.log({ x, y, z, timestamp }));
```

## barometer: Observable<{pressure: number}>

```js
import { barometer } from "react-native-sensors";

const subscription = barometer.subscribe(({ pressure }) => console.log({ pressure }));
```

Please note that this sensor has no option to set the update rate.

## orientation: Observable<{qx: number, qy: number, qz: number, qw: number, pitch: number, roll: number, yaw: number, timestamp: string}>

```js
import { orientation } from "react-native-sensors";

const subscription = orientation.subscribe(({ qx, qy, qz, qw, pitch, roll, yaw, timestamp }) =>
  console.log({ qx, qy, qz, qw, pitch, roll, yaw, timestamp })
);
```

qx, qy, qz, qw are quaternion values.
pitch, roll, yaw are calculated by iOS/Android. (Yaw is called Azimuth in Android documentation)

Note: reference frame for iOS is different from Android. Check Apple's and Google documentation.

[iOS - Understanding Reference Frames and Device Attitude](https://developer.apple.com/documentation/coremotion/getting_processed_device-motion_data/understanding_reference_frames_and_device_attitude?language=objc)

[Android - Use the rotation vector sensor](https://developer.android.com/guide/topics/sensors/sensors_motion#sensors-motion-rotate)

[Quaternion](https://en.wikipedia.org/wiki/Quaternion)

[Quaternions and spatial rotation](https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation)

Example how to convert quaternion to Euler angles:

```js
export function quaternionToAngles(q) {
  let data = q;

  let ysqr = data.y * data.y;
  let t0 = -2.0 * (ysqr + data.z * data.z) + 1.0;
  let t1 = +2.0 * (data.x * data.y + data.w * data.z);
  let t2 = -2.0 * (data.x * data.z - data.w * data.y);
  let t3 = +2.0 * (data.y * data.z + data.w * data.x);
  let t4 = -2.0 * (data.x * data.x + ysqr) + 1.0;

  t2 = t2 > 1.0 ? 1.0 : t2;
  t2 = t2 < -1.0 ? -1.0 : t2;

  const toDeg = 180 / Math.PI;

  const euler = {};
  euler.pitch = Math.asin(t2) * toDeg;
  euler.roll = Math.atan2(t3, t4) * toDeg;
  euler.yaw = Math.atan2(t1, t0) * toDeg;

  return euler;
}
```

## setUpdateIntervalForType(type: string, interval: number)

As the sensors are global we can only set the rate in which the hardware is read globally.
Please note that the native platforms treat this more as a recommendation than an exact value.

```js
import { setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
setUpdateIntervalForType(SensorTypes.accelerometer, 100);
```

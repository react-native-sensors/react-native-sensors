---
id: Changelog
title: Changelog
---

## Version 5

### 5.0.0

In this release we defined a whole new API that does not rely on promises anymore.

#### RxJS

To migrate see the following diff:

```diff
import { Accelerometer, Gyroscope } from "react-native-sensors";

- let accelerationObservable = null;
- new Accelerometer({
+ const accelerationObservable = new Accelerometer({
  updateInterval: 400 // defaults to 100ms
})
-  .then(observable => {
-    accelerationObservable = observable;

    // Normal RxJS functions
-    accelerationObservable
+   const subscription = accelerationObservable
      .map(({ x, y, z }) => x + y + z)
      .filter(speed => speed > 20)
-      .subscribe(speed => console.log(`You moved your phone with ${speed}`));
+      .subscribe(speed => console.log(`You moved your phone with ${speed}`), error => {
+        console.log("The sensor is not available");
+      });
-  })
-  .catch(error => {
-    console.log("The sensor is not available");
-  });

setTimeout(() => {
-   accelerationObservable.stop();
+   subscription.unsubscribe();
}, 1000);
```

#### Decorator

```diff
import React, { Component } from "react";
import { Text, View } from "react-native";
import {
  decorator as sensors,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";

setUpdateIntervalForType(SensorTypes.Accelerometer, 400);

function MyComponent({ sensorsFound, Accelerometer, Gyroscope }) {
  if (!Accelerometer || !Gyroscope) {
    // One of the sensors is still initializing
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        {(sensorsFound["Accelerometer"] &&
          `Acceleration has value: ${Accelerometer}`) ||
          "Acceleration is not available"}
        {(sensorsFound["Gyroscope"] && `Gyro has value: ${Gyroscope}`) ||
          "Gyro is not available"}
      </Text>
    </View>
  );
}

export default sensors({
-  Accelerometer: {
-    updateInterval: 400
-  },
+ Accelerometer: true,
  Gyroscope: true
})(MyComponent);
```

## Version 4

* [Do not convert errors to return values](https://github.com/react-native-sensors/react-native-sensors/pull/157)
* [Do not crash iOS Simulator](https://github.com/react-native-sensors/react-native-sensors/pull/151)

## Version 3

### 3.1.0

* Add Semantic Release

### 3.0.0

* [Magnetometer](https://github.com/react-native-sensors/react-native-sensors/pull/62) support
* [Add linking failure message](https://github.com/react-native-sensors/react-native-sensors/pull/61): If you forget to link the native dependencies you now get `"Native modules for sensors not available. Did react-native link run successfully?"` as an error
* [Fix sensor availability checks](https://github.com/react-native-sensors/react-native-sensors/pull/60)
* [Fix startup API](https://github.com/react-native-sensors/react-native-sensors/pull/56)
* BREAKING: [removed windows support](https://github.com/react-native-sensors/react-native-sensors/commit/2c347ae93db97274f14f8d2b3fb15daf72c6eebe) We had to remove the windows support as there was no one maintaining it. If you have interest in using this library on a windows phone, please leave an issue. We would be very happy to revert this commit and get windows up to speed again.
* BREAKING: [Check if sensor is supported](https://github.com/react-native-sensors/react-native-sensors/issues/28) You can now check if a sensor is available on the device. This changed the API, therefore it's a breaking change. Special thanks to @dabit1 for introducing this much needed functionality.

### 3.0.0-2

* [Magnetometer](https://github.com/react-native-sensors/react-native-sensors/pull/62) support

### 3.0.0-1

* [Add linking failure message](https://github.com/react-native-sensors/react-native-sensors/pull/61): If you forget to link the native dependencies you now get `"Native modules for sensors not available. Did react-native link run successfully?"` as an error
* [Fix sensor availability checks](https://github.com/react-native-sensors/react-native-sensors/pull/60)
* [Fix startup API](https://github.com/react-native-sensors/react-native-sensors/pull/56)

### 3.0.0-0

* BREAKING: [removed windows support](https://github.com/react-native-sensors/react-native-sensors/commit/2c347ae93db97274f14f8d2b3fb15daf72c6eebe) We had to remove the windows support as there was no one maintaining it. If you have interest in using this library on a windows phone, please leave an issue. We would be very happy to revert this commit and get windows up to speed again.
* BREAKING: [Check if sensor is supported](https://github.com/react-native-sensors/react-native-sensors/issues/28) You can now check if a sensor is available on the device. This changed the API, therefore it's a breaking change. Special thanks to @dabit1 for introducing this much needed functionality.

## Version 2

### 2.4.1

* [Restore the original api](https://github.com/react-native-sensors/react-native-sensors/pull/36) <- fix for unintentional change of our API by @epeli

### 2.4.0

* [Move from `React.PropTypes` to `prop-types`](https://github.com/react-native-sensors/react-native-sensors/pull/33)
* [Throw error instead of crash if a certain sensor is missing](https://github.com/react-native-sensors/react-native-sensors/pull/32) <- This caused an unintenional change in our API

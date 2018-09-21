---
id: Usage.Decorator
title: The Decorator Syntax of React Native Sensors
sidebar_label: Decorator Syntax
---

This is your option if you would like to have just the sensor data and nothing more. You loose some control you would have had with the RxJS usage, but you gain a lot of convenience. This example shows how you can use the decorator effectively:

```javascript
import React, { Component } from "react";
import { Text, View } from "react-native";
import {
  decorator as sensors,
  setUpdateIntervalForType
} from "react-native-sensors";

setUpdateIntervalForType("Accelerometer", 400);

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
  Accelerometer: true,
  Gyroscope: true
})(MyComponent);
```

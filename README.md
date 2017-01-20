
# react-native-sensors

## Getting started

`$ npm install react-native-sensors --save`

### Mostly automatic installation

`$ react-native link react-native-sensors`

### Manual installation

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-sensors` and add `RNSensors.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNSensors.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNSensorsPackage;` to the imports at the top of the file
  - Add `new RNSensorsPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-sensors'
  	project(':react-native-sensors').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-sensors/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-sensors')
  	```

## Usage

### Sensor API

```javascript
import { Accelerometer, Gyroscope } from 'react-native-sensors';
const accelerationObservable = new Accelerometer({
  updateInterval: 0.1, // defaults to 100ms
});

// Normal RxJS functions
accelerationObservable
  .map(({ x, y, z }) => x + y + z)
  .filter(speed => speed > 20)
  .subscribe(speed => console.log(`You moved your phone with ${speed}`));

setTimeout(() => {
  accelerationObservable.stop();
}, 1000);
```

### Decorator usage

```javascript
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { decorator as sensors } from 'react-native-sensors';

class MyComponent { // no lifecycle needed
  render() {
    const {
      Accelerometer,
      Gyroscope,
    } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Acceleration has value: {Accelerometer}
          Gyro has value: {Gyroscope}
        </Text>
      </View>
    );
  }
}

export default sensors({
  Accelerometer: {
    updateInterval: 0.3, // optional
  },
  Gyroscope: true,
  Magnetometer: false, // disabled
})(MyComponent);
```

## Credits

This project is inspired by the [react-native-sensor-manager](https://github.com/kprimice/react-native-sensor-manager) and by the [react-native-motion-manager](https://github.com/pwmckenna/react-native-motion-manager). Both have similar solutions with a non-uniform interface and this project aims to unify both.

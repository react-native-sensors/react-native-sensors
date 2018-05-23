# react-native-sensors [![Build Status](https://travis-ci.org/react-native-sensors/react-native-sensors.svg?branch=master)](https://travis-ci.org/react-native-sensors/react-native-sensors) [![codebeat badge](https://codebeat.co/badges/9661e295-3793-4d58-9161-4d0471a68b0c)](https://codebeat.co/projects/github-com-react-native-sensors-react-native-sensors-master) [![BCH compliance](https://bettercodehub.com/edge/badge/react-native-sensors/react-native-sensors?branch=master)](https://bettercodehub.com/) [![All Contributors](https://img.shields.io/badge/all_contributors-18-orange.svg?style=flat-square)](#contributors)

## Supported React Native Versions

| React Native Version | react-native-sensors Version |
| -------------------- | ---------------------------- |
| <= 39                | < 1.0                        |
| >= 40                | >= 1.0                       |

## Cool Projects using `react-native-sensors`

* [react-native-live-translator](https://github.com/agrcrobles/react-native-live-translator)
* [imagination-react-native](https://github.com/Matzielab/imagination-react-native)
* [react-native-game-engine-handbook](https://github.com/bberak/react-native-game-engine-handbook)
* [react-native-iridescent](https://github.com/elevenfooteleven/react-native-iridescent)

Do you want your project listed here? Just send a PR.

## Getting started

`$ npm install react-native-sensors --save`

### Automatic installation

`$ react-native link react-native-sensors`

Option: With CocoaPods (iOS only)

Add the following to your Podfile and run `$ pod install`:

`pod 'RNSensors', :path => '../node_modules/react-native-sensors'`

### Manual installation

#### iOS

1.  In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2.  Go to `node_modules` ➜ `react-native-sensors` and add `RNSensors.xcodeproj`
3.  In XCode, in the project navigator, select your project. Add `libRNSensors.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4.  Run your project (`Cmd+R`)<

#### Android

1.  Open up `android/app/src/main/java/[...]/MainApplication.java`

* Add `import com.sensors.RNSensorsPackage;` to the imports at the top of the file
* Add `new RNSensorsPackage()` to the list returned by the `getPackages()` method

2.  Append the following lines to `android/settings.gradle`:
    ```
    include ':react-native-sensors'
    project(':react-native-sensors').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-sensors/android')
    ```
3.  Insert the following lines inside the dependencies block in `android/app/build.gradle`:
    ```
      compile project(':react-native-sensors')
    ```

## Usage

### Sensor API

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

### Decorator usage

```javascript
import React, { Component } from "react";
import { Text, View } from "react-native";
import { decorator as sensors } from "react-native-sensors";

class MyComponent {
  // no lifecycle needed
  render() {
    const { sensorsFound, Accelerometer, Gyroscope } = this.props;

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
}

export default sensors({
  Accelerometer: {
    updateInterval: 300 // optional
  },
  Gyroscope: true
})(MyComponent);
```

## Changelog

[Please see the changelog here](docs/Changelog.md)

## Credits

This project is inspired by the [react-native-sensor-manager](https://github.com/kprimice/react-native-sensor-manager) and by the [react-native-motion-manager](https://github.com/pwmckenna/react-native-motion-manager). Both have similar solutions with a non-uniform interface and this project aims to unify both.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/1337046?v=4" width="100px;"/><br /><sub><b>Daniel Schmidt</b></sub>](http://danielmschmidt.de/)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=DanielMSchmidt "Code") | [<img src="https://avatars0.githubusercontent.com/u/6372489?v=4" width="100px;"/><br /><sub><b>Noitidart</b></sub>](http://noitidart.github.io/)<br />[📖](https://github.com/react-native-sensors/react-native-sensors/commits?author=Noitidart "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/6213682?v=4" width="100px;"/><br /><sub><b>Christophe Lemonnier</b></sub>](https://github.com/tontonrally)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=tontonrally "Code") | [<img src="https://avatars2.githubusercontent.com/u/12188900?v=4" width="100px;"/><br /><sub><b>Gennady</b></sub>](http://belogortsev.ru/)<br />[📖](https://github.com/react-native-sensors/react-native-sensors/commits?author=Greeny7 "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/1251301?v=4" width="100px;"/><br /><sub><b>Jiaming Lu</b></sub>](https://github.com/jiaminglu)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=jiaminglu "Code") | [<img src="https://avatars1.githubusercontent.com/u/4612947?v=4" width="100px;"/><br /><sub><b>Alex Wasner</b></sub>](https://github.com/alexwasner)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=alexwasner "Code") | [<img src="https://avatars1.githubusercontent.com/u/9479593?v=4" width="100px;"/><br /><sub><b>Nam Đàm</b></sub>](https://github.com/namqdam)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=namqdam "Code") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars1.githubusercontent.com/u/103593?v=4" width="100px;"/><br /><sub><b>Mike Knapp</b></sub>](http://www.twitter.com/mikeee)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=mikeknapp "Code") | [<img src="https://avatars1.githubusercontent.com/u/10956848?v=4" width="100px;"/><br /><sub><b>Kevin Gonnord</b></sub>](https://github.com/Lleios)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=Lleios "Code") | [<img src="https://avatars3.githubusercontent.com/u/7541319?v=4" width="100px;"/><br /><sub><b>ImAtome</b></sub>](https://github.com/ImAtome)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=ImAtome "Code") | [<img src="https://avatars0.githubusercontent.com/u/3603130?v=4" width="100px;"/><br /><sub><b>Lisa Huynh</b></sub>](https://github.com/lisamai)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=lisamai "Code") | [<img src="https://avatars0.githubusercontent.com/u/7315?v=4" width="100px;"/><br /><sub><b>Cory Smith</b></sub>](http://bullish.io)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=corymsmith "Code") | [<img src="https://avatars3.githubusercontent.com/u/225712?v=4" width="100px;"/><br /><sub><b>Esa-Matti Suuronen</b></sub>](https://medium.com/@esamatti)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=epeli "Code") | [<img src="https://avatars1.githubusercontent.com/u/19377299?v=4" width="100px;"/><br /><sub><b>Viet Nguyen</b></sub>](https://openbeta.io)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=vietnugent "Code") |
| [<img src="https://avatars3.githubusercontent.com/u/3586691?v=4" width="100px;"/><br /><sub><b>Simon Bengtsson</b></sub>](http://simonbengtsson.com)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=simonbengtsson "Code") | [<img src="https://avatars0.githubusercontent.com/u/7002833?v=4" width="100px;"/><br /><sub><b>maxkomarychev</b></sub>](https://github.com/maxkomarychev)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=maxkomarychev "Code") | [<img src="https://avatars3.githubusercontent.com/u/6882605?v=4" width="100px;"/><br /><sub><b>Alexander Baygeldin</b></sub>](http://baygeldin.name)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=baygeldin "Code") | [<img src="https://avatars1.githubusercontent.com/u/17160720?v=4" width="100px;"/><br /><sub><b>Noane Dan</b></sub>](https://github.com/NoaneDan)<br />[💻](https://github.com/react-native-sensors/react-native-sensors/commits?author=NoaneDan "Code") |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

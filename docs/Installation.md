---
id: Installation
title: Install React Native Sensors
sidebar_label: Installation
---

## Installation

`$ npm install react-native-sensors --save`

### Automatic installation

#### RN >=0.60.0
CocoaPods is not the recommended method to adding libraries to react-native.

Add the following to your Podfile and run `$ pod install`:

`pod 'RNSensors', :path => '../node_modules/react-native-sensors'`

then from your project directory run:

`$ cd ios`
`pod install`

DO NOT RUN `react-native link react-native-sensors` this is no longer required with RN 0.60 or above.

#### RN <=0.59.10

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
      implementation project(':react-native-sensors')
    ```

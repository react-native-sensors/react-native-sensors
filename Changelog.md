# Changelog

# Version 3

## 3.0.0-2

* [Magnetometer](https://github.com/react-native-sensors/react-native-sensors/pull/62) support

## 3.0.0-1

* [Add linking failure message](https://github.com/react-native-sensors/react-native-sensors/pull/61): If you forget to link the native dependencies you now get `"Native modules for sensors not available. Did react-native link run successfully?"` as an error
* [Fix sensor availability checks](https://github.com/react-native-sensors/react-native-sensors/pull/60)
* [Fix startup API](https://github.com/react-native-sensors/react-native-sensors/pull/56)

## 3.0.0-0

* BREAKING: [removed windows support](https://github.com/react-native-sensors/react-native-sensors/commit/2c347ae93db97274f14f8d2b3fb15daf72c6eebe) We had to remove the windows support as there was no one maintaining it. If you have interest in using this library on a windows phone, please leave an issue. We would be very happy to revert this commit and get windows up to speed again.
* BREAKING: [Check if sensor is supported](https://github.com/react-native-sensors/react-native-sensors/issues/28) You can now check if a sensor is available on the device. This changed the API, therefore it's a breaking change. Special thanks to @dabit1 for introducing this much needed functionality.

# Version 2

## 2.4.1

* [Restore the original api](https://github.com/react-native-sensors/react-native-sensors/pull/36) <- fix for unintentional change of our API by @epeli

## 2.4.0

* [Move from `React.PropTypes` to `prop-types`](https://github.com/react-native-sensors/react-native-sensors/pull/33)
* [Throw error instead of crash if a certain sensor is missing](https://github.com/react-native-sensors/react-native-sensors/pull/32) <- This caused an unintenional change in our API

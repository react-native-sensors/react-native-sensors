import { NativeModules } from "react-native";
const {
  Gyroscope: GyroNative,
  Accelerometer: AccNative,
  Magnetometer: MagnNative,
  Barometer: BarNative
} = NativeModules;

if (!GyroNative && !AccNative && !MagnNative && !BarNative) {
  throw new Error(
    "Native modules for sensors not available. Did react-native link run successfully?"
  );
}

const nativeApis = new Map([
  ["accelerometer", AccNative],
  ["gyroscope", GyroNative],
  ["magnetometer", MagnNative],
  ["barometer", BarNative]
]);

// Cache the availability of sensors
const availableSensors = {};

const RNSensors = {
  start: function(type) {
    const api = nativeApis.get(type.toLocaleLowerCase());
    api.startUpdates();
  },

  isAvailable: function(type) {
    if (availableSensors[type]) {
      return availableSensors[type];
    }

    const api = nativeApis.get(type.toLocaleLowerCase());
    const promise = api.isAvailable();
    availableSensors[type] = promise;

    return promise;
  },

  stop: function(type) {
    const api = nativeApis.get(type.toLocaleLowerCase());
    api.stopUpdates();
  },

  setUpdateInterval(type, updateInterval) {
    const api = nativeApis.get(type.toLocaleLowerCase());
    api.setUpdateInterval(updateInterval);
  }
};

export default RNSensors;

import { NativeModules } from "react-native";
const {
  Gyroscope: GyroNative,
  Accelerometer: AccNative,
  Magnetometer: MagnNative
} = NativeModules;

if (!GyroNative && !AccNative && !MagnNative) {
  throw new Error(
    "Native modules for sensors not available. Did react-native link run successfully?"
  );
}

const handle = {
  Accelerometer: AccNative,
  Gyroscope: GyroNative,
  Magnetometer: MagnNative
};

// Cache the availability of sensors
const availableSensors = {};

const RNSensors = {
  start: function(type) {
    const api = handle[type];
    api.startUpdates();
  },

  isAvailable: function(type) {
    const api = handle[type];
    const promise = availableSensors[type] || api.isAvailable();
    availableSensors[type] = promise;

    return promise;
  },

  stop: function(type) {
    const api = handle[type];
    api.stopUpdates();
  },

  setUpdateInterval(type, updateInterval) {
    const api = handle[type];
    api.setUpdateInterval(updateInterval);
  }
};

export default RNSensors;

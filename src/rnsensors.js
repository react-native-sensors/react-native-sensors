import { NativeModules, DeviceEventEmitter } from "react-native";
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

const RNSensors = {
  start: function(type, updateInterval) {
    const api = handle[type];
    api.setUpdateInterval(updateInterval);
    api.startUpdates();
  },

  isAvailable: function(type) {
    const api = handle[type];
    return api.isAvailable();
  },

  stop: function(type) {
    const api = handle[type];
    api.stopUpdates();
  }
};

export default RNSensors;

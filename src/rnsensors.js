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

function getApi(type) {
  switch (type.toLocaleLowerCase()) {
    case "accelerometer":
      return AccNative;
    case "gyroscope":
      return GyroNative;
    case "magnetometer":
      return MagnNative;
    default:
      throw new Error("unknown api requested: " + type);
  }
}

// Cache the availability of sensors
const availableSensors = {};

const RNSensors = {
  start: function(type) {
    getApi(type).startUpdates();
  },

  isAvailable: function(type) {
    const promise = availableSensors[type] || getApi(type).isAvailable();
    availableSensors[type] = promise;

    return promise;
  },

  stop: function(type) {
    getApi(type).stopUpdates();
  },

  setUpdateInterval(type, updateInterval) {
    getApi(type).setUpdateInterval(updateInterval);
  }
};

export default RNSensors;

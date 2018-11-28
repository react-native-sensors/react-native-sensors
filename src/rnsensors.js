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
  const lowercasedType = type.toLocaleLowerCase();

  switch (lowercasedType) {
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
    const api = getApi(type);
    api.startUpdates();
  },

  isAvailable: function(type) {
    if (availableSensors[type]) {
      return availableSensors[type];
    }

    const api = getApi(type);
    const promise = api.isAvailable();
    availableSensors[type] = promise;

    return promise;
  },

  stop: function(type) {
    const api = getApi(type);
    api.stopUpdates();
  },

  setUpdateInterval(type, updateInterval) {
    const api = getApi(type);
    api.setUpdateInterval(updateInterval);
  }
};

export default RNSensors;

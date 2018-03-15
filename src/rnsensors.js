import { NativeModules, DeviceEventEmitter } from "react-native";
const { Gyroscope: GyroNative, Accelerometer: AccNative, Magnetometer: MagnNative  } = NativeModules;

const handle = {
	Accelerometer: AccNative,
	Gyroscope: GyroNative,
  Magnetometer: MagnNative
};

const RNSensors = {
	start: function(type, updateInterval) {
		const api = handle[type];
		api.setUpdateInterval(updateInterval);
		// A promise is returned in Android, since it can fail with an exception
		return api.startUpdates() || Promise.resolve();
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

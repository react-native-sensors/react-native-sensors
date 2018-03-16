import { NativeModules, DeviceEventEmitter } from "react-native";
const { Gyroscope: GyroNative, Accelerometer: AccNative } = NativeModules;

if (!GyroNative && !AccNative) {
	throw new Error(
		"Native modules for sensors not available. Did react-native link run successfully?"
	);
}

const handle = {
	Accelerometer: AccNative,
	Gyroscope: GyroNative
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

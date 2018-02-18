import { NativeModules, DeviceEventEmitter } from "react-native";
import * as Rx from "rxjs/Rx";
const { Gyroscope: GyroNative, Accelerometer: AccNative } = NativeModules;

const handle = {
	Accelerometer: AccNative,
	Gyroscope: GyroNative
};

const RNSensors = {
	start: function(type, updateInterval) {
		const api = handle[type];
		api.setUpdateInterval(updateInterval);
		// A promise is returned in Android, since it can fail with an exception
		return api.startUpdates() || Promise.resolve();
	},

	stop: function(type) {
		const api = handle[type];
		api.stopUpdates();
	}
};

function createSensorMonitorCreator(sensorType) {
	function Creator(options = {}) {
		const {
			updateInterval = 100 // time in ms
		} =
			options || {};

		let observer;

		// Instanciate observable
		const observable = Rx.Observable.create(function(obs) {
			observer = obs;
			// Start the sensor manager
			RNSensors.start(sensorType, updateInterval).then(
				() => {
					DeviceEventEmitter.addListener(sensorType, function(data) {
						observer.next(data);
					});
				},
				error => {
					observer.error(error);
				}
			);
		});

		// Stop the sensor manager
		observable.stop = () => {
			RNSensors.stop(sensorType);
			observer.complete();
		};

		return observable;
	}

	return Creator;
}

// TODO: lazily intialize them (maybe via getter)
const Accelerometer = createSensorMonitorCreator("Accelerometer");
const Gyroscope = createSensorMonitorCreator("Gyroscope");
// Not yet implemented
// const Magnetometer = createSensorMonitorCreator('Magnetometer');

export default {
	Accelerometer,
	Gyroscope
};

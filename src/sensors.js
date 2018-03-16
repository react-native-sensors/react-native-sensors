import { DeviceEventEmitter } from "react-native";
import * as Rx from "rxjs/Rx";
import RNSensors from "./rnsensors";

function createSensorMonitorCreator(sensorType) {
	function Creator(options = {}) {
		return RNSensors.isAvailable(sensorType)
			.then(() => {
				const {
					updateInterval = 100 // time in ms
				} =
					options || {};

				let observer;

				// Instanciate observable
				const observable = Rx.Observable.create(function(obs) {
					observer = obs;

					DeviceEventEmitter.addListener(sensorType, function(data) {
						observer.next(data);
					});

					// Start the sensor manager
					RNSensors.start(sensorType, updateInterval);
				});

				// Stop the sensor manager
				observable.stop = () => {
					RNSensors.stop(sensorType);
					observer.complete();
				};
				return observable;
			})
			.catch(error => {
				return error;
			});
	}

	return Creator;
}

// TODO: lazily intialize them (maybe via getter)
const Accelerometer = createSensorMonitorCreator("Accelerometer");
const Gyroscope = createSensorMonitorCreator("Gyroscope");
// const Magnetometer = createSensorMonitorCreator('Magnetometer');

export default {
	Accelerometer,
	Gyroscope
};

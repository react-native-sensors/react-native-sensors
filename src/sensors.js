import { DeviceEventEmitter } from "react-native";
import { Observable } from "rxjs";
import RNSensors from "./rnsensors";

// Let's make sure that we stop the sensor once no one listens
const refCountByType = {
  Gyroscope: 0,
  Accelerometer: 0,
  Magnetometer: 0
};

function createSensorMonitorCreator(sensorType) {
  return function Creator(options = {}) {
    return Observable.create(function subscribe(observer) {
      this.unsubscribeCallback = () => {};

      RNSensors.isAvailable(sensorType).then(
        () => {
          DeviceEventEmitter.addListener(sensorType, data => {
            observer.next(data);
          });

          // Register the unsubscribe handler
          this.unsubscribeCallback = () => {
            refCountByType[sensorType] -= 1;

            if (refCountByType[sensorType] === 0) {
              RNSensors.stop(sensorType);
            }
          };

          // Start the sensor manager
          RNSensors.start(sensorType);
          refCountByType[sensorType] += 1;
        },
        () => {
          observer.error(new Error(`Sensor ${sensorType} is not available`));
        }
      );

      return () => this.unsubscribeCallback();
    });
  };
}

const Accelerometer = createSensorMonitorCreator("Accelerometer");
const Gyroscope = createSensorMonitorCreator("Gyroscope");
const Magnetometer = createSensorMonitorCreator("Magnetometer");

export default {
  Gyroscope,
  Accelerometer,
  Magnetometer
};

import { NativeModules, DeviceEventEmitter } from 'react-native';
import { Observable } from 'rxjs/Observable';
const { Gyroscope: GyroNative, Accelerometer: AccNative } = NativeModules;

const handle = {
  Accelerometer: AccNative,
  Gyroscope: GyroNative,
};

const RNSensors = {
  start(type, updateInterval) {
    const api = handle[type];
    api.setUpdateInterval(updateInterval);
    api.startUpdates();
  }

  stop(type) {
    const api = handle[type];
    api.stopUpdates();
  }
}

function createSensorMonitorCreator(sensorType) {
  function Creator(options) {
    const {
      updateInterval = 100, // time in ms
    } = options;

    // Start the sensor manager
    RNSensors.start(sensorType, updateInterval);

    // Instanciate observable
    const observable = Observable.bindCallback(DeviceEventEmitter.addListener(sensorType));

    // Stop the sensor manager
    observable.stop = () => {
      RNSensors.stop(sensorType);
    };

    return observable;
  }

  return Creator;
}

// TODO: lazily intialize them (maybe via getter)
const Accelerometer = createSensorMonitorCreator('Accelerometer');
const Gyroscope = createSensorMonitorCreator('Gyroscope');
const Magnetometer = createSensorMonitorCreator('Magnetometer');

export default {
  Accelerometer,
  Gyroscope,
  Magnetometer,
};

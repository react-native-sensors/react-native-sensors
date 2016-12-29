import { NativeModules, DeviceEventEmitter } from 'react-native';
import Rx from 'rxjs/Rx';
const { Gyroscope: GyroNative, Accelerometer: AccNative } = NativeModules;

const handle = {
  Accelerometer: AccNative,
  Gyroscope: GyroNative,
};

const RNSensors = {
  start: function (type, updateInterval) {
    const api = handle[type];
    api.setUpdateInterval(updateInterval);
    api.startUpdates();
  },

  stop: function (type) {
    const api = handle[type];
    api.stopUpdates();
  },
};

function createSensorMonitorCreator(sensorType) {
  function Creator(options) {
    const {
      updateInterval = 100, // time in ms
    } = options;
    let observer;
    // Start the sensor manager
    RNSensors.start(sensorType, updateInterval);

    // Instanciate observable
    const observable = Rx.Observable.create(function (obs) {
      observer = obs;
      DeviceEventEmitter.addListener(sensorType, function(data) {
        observer.next(data);
      });
    })

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
const Accelerometer = createSensorMonitorCreator('Accelerometer');
const Gyroscope = createSensorMonitorCreator('Gyroscope');
const Magnetometer = createSensorMonitorCreator('Magnetometer');

export default {
  Accelerometer,
  Gyroscope,
  Magnetometer,
};

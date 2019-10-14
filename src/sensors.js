import { DeviceEventEmitter, NativeModules, NativeEventEmitter } from "react-native";
import { Observable } from "rxjs";
import { publish, refCount } from "rxjs/operators";
import * as RNSensors from "./rnsensors";

const {
  Gyroscope: GyroNative,
  Accelerometer: AccNative,
  Magnetometer: MagnNative,
  Barometer: BarNative
} = NativeModules;

const nativeApis = new Map([
  ["accelerometer", AccNative],
  ["gyroscope", GyroNative],
  ["magnetometer", MagnNative],
  ["barometer", BarNative]
]);

const listenerKeys = new Map([
  ["accelerometer", "Accelerometer"],
  ["gyroscope", "Gyroscope"],
  ["magnetometer", "Magnetometer"],
  ["barometer", "Barometer"]
]);

function createSensorObservable(sensorType) {
  return Observable.create(function subscribe(observer) {
    this.isSensorAvailable = false;

    this.unsubscribeCallback = () => {
      if (!this.isSensorAvailable) return;
      // stop the sensor
      RNSensors.stop(sensorType);
    };

    RNSensors.isAvailable(sensorType).then(
      () => {
        let event = new NativeEventEmitter(nativeApis.get(sensorType))
        event.addListener(listenerKeys.get(sensorType), data => {
          observer.next(data);
        });
        // DeviceEventEmitter.addListener(listenerKeys.get(sensorType), data => {
        //   observer.next(data);
        // });

        this.isSensorAvailable = true;

        // Start the sensor manager
        RNSensors.start(sensorType);
      },
      () => {
        observer.error(`Sensor ${sensorType} is not available`);
      }
    );

    return this.unsubscribeCallback;
  }).pipe(makeSingleton());
}

// As we only have one sensor we need to share it between the different consumers
function makeSingleton() {
  return source => source.pipe(publish(), refCount());
}

const accelerometer = createSensorObservable("accelerometer");
const gyroscope = createSensorObservable("gyroscope");
const magnetometer = createSensorObservable("magnetometer");
const barometer = createSensorObservable("barometer");

export default {
  gyroscope,
  accelerometer,
  magnetometer,
  barometer
};

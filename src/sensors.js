import { NativeEventEmitter, NativeModules } from "react-native";
import { Observable } from "rxjs";
import { publish, refCount } from "rxjs/operators";
import * as RNSensors from "./rnsensors";

const {
  Gyroscope: GyroNative,
  Accelerometer: AccNative,
  Magnetometer: MagnNative,
  Barometer: BarNative
} = NativeModules;

const listenerKeys = new Map([
  ["accelerometer", "Accelerometer"],
  ["gyroscope", "Gyroscope"],
  ["magnetometer", "Magnetometer"],
  ["barometer", "Barometer"]
]);

const nativeApis = new Map([
  ["accelerometer", AccNative],
  ["gyroscope", GyroNative],
  ["magnetometer", MagnNative],
  ["barometer", BarNative]
]);

const eventEmitterSubscription = new Map([
  ["accelerometer", null],
  ["gyroscope", null],
  ["magnetometer", null],
  ["barometer", null]
]);

function createSensorObservable(sensorType) {
  return Observable.create(function subscribe(observer) {
    this.isSensorAvailable = false;

    this.unsubscribeCallback = () => {
      if (!this.isSensorAvailable) return;
      if (eventEmitterSubscription.get(sensorType))
        eventEmitterSubscription.get(sensorType).remove();
      // stop the sensor
      RNSensors.stop(sensorType);
    };

    RNSensors.isAvailable(sensorType).then(
      () => {
        this.isSensorAvailable = true;

        const emitter = new NativeEventEmitter(nativeApis.get(sensorType));

        eventEmitterSubscription.set(
          sensorType,
          emitter.addListener(listenerKeys.get(sensorType), data => {
            observer.next(data);
          })
        );

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

import { NativeModules, NativeEventEmitter } from "react-native";
const {
  Gyroscope: GyroNative,
  Accelerometer: AccNative,
  Magnetometer: MagnNative,
  Barometer: BarNative
} = NativeModules;

if (!GyroNative && !AccNative && !MagnNative && !BarNative) {
  throw new Error(
    "Native modules for sensors not available. Did react-native link run successfully?"
  );
}

const nativeApis = new Map([
  ["accelerometer", AccNative],
  ["gyroscope", GyroNative],
  ["magnetometer", MagnNative],
  ["barometer", BarNative]
]);

const eventEmitters = new Map([
  ["accelerometer", new NativeEventEmitter(AccNative)],
  ["gyroscope", new NativeEventEmitter(GyroNative)],
  ["magnetometer", new NativeEventEmitter(MagnNative)],
  ["barometer", new NativeEventEmitter(BarNative)]
]);

const eventEmitterSubsciption = new Map([
  ["accelerometer", null],
  ["gyroscope", null],
  ["magnetometer", null],
  ["barometer", null]
]);

// Cache the availability of sensors
const availableSensors = {};

export function start(type) {
  eventEmitterSubsciption.set(type, 
    eventEmitters.get(type).addListener(listenerKeys.get(type), data => {
      observer.next(data);
    })
  );
  const api = nativeApis.get(type.toLocaleLowerCase());
  api.startUpdates();
}

export function isAvailable(type) {
  if (availableSensors[type]) {
    return availableSensors[type];
  }

  const api = nativeApis.get(type.toLocaleLowerCase());
  const promise = api.isAvailable();
  availableSensors[type] = promise;

  return promise;
}

export function stop(type) {
  if (eventEmitterSubsciption.get(type)) eventEmitterSubsciption.get(type).remove()
  const api = nativeApis.get(type.toLocaleLowerCase());
  api.stopUpdates();
}

export function setUpdateInterval(type, updateInterval) {
  const api = nativeApis.get(type.toLocaleLowerCase());
  api.setUpdateInterval(updateInterval);
}

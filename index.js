import sensors from "./src/sensors";
export { isAvailable, setUpdateInterval as setUpdateIntervalForType } from "./src/rnsensors";

export const SensorTypes = {
  accelerometer: "accelerometer",
  gyroscope: "gyroscope",
  magnetometer: "magnetometer",
  barometer: "barometer"
};

export const { accelerometer, gyroscope, magnetometer, barometer } = sensors;
export default sensors;

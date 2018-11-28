import sensors from "./src/sensors";
export { setUpdateInterval as setUpdateIntervalForType } from "./src/rnsensors";

export const SensorTypes = {
  accelerometer: "accelerometer",
  gyroscope: "gyroscope",
  magnetometer: "magnetometer"
};

export const { accelerometer, gyroscope, magnetometer } = sensors;
export default sensors;

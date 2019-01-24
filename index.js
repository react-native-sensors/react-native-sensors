import sensors from "./src/sensors";
export { setUpdateInterval as setUpdateIntervalForType } from "./src/rnsensors";

export const SensorTypes = {
  accelerometer: "accelerometer",
  gyroscope: "gyroscope",
  magnetometer: "magnetometer",
  barometer: "barometer", 
  deviceMotion: "deviceMotion"
};

export const { accelerometer, gyroscope, magnetometer, barometer,deviceMotion } = sensors;
export default sensors;

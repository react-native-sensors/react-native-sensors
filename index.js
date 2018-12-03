import sensors from "./src/sensors";
import RNSensors from "./src/rnsensors";

export const setUpdateIntervalForType = RNSensors.setUpdateInterval;
export const SensorTypes = {
  accelerometer: "accelerometer",
  gyroscope: "gyroscope",
  magnetometer: "magnetometer",
  barometer: "barometer"
};

export const { accelerometer, gyroscope, magnetometer, barometer } = sensors;
export default sensors;

import sensors from "./src/sensors";
export {
  setUpdateInterval as setUpdateIntervalForType,
  setLogLevelForType
} from "./src/rnsensors";

export const SensorTypes = {
  accelerometer: "accelerometer",
  gyroscope: "gyroscope",
  magnetometer: "magnetometer",
  barometer: "barometer"
};

export const { accelerometer, gyroscope, magnetometer, barometer } = sensors;
export default sensors;

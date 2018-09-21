import Sensors from "./src/sensors";
import decorator from "./src/decorator";
import { setUpdateInterval } from "./src/rnsensors";

export const { Accelerometer, Gyroscope, Magnetometer } = { ...Sensors };
export { decorator };

export const SensorTypes = {
  Accelerometer: "Accelerometer",
  Gyroscope: "Gyroscope",
  Magnetometer: "Magnetometer"
};

export default {
  ...Sensors,
  decorator,
  setUpdateIntervalForType: setUpdateInterval
};

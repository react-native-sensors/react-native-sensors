import Sensors from "./src/sensors";
import decorator from "./src/decorator";

export const { Accelerometer, Gyroscope, Magnetometer, Barometer } = { ...Sensors };
export { decorator };

export default {
	...Sensors,
	decorator
};

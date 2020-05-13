declare module "react-native-sensors" {
  import { Observable } from "rxjs";

  type Sensors = {
    accelerometer: "accelerometer";
    gyroscope: "gyroscope";
    magnetometer: "magnetometer";
    barometer: "barometer";
  };

  export const SensorTypes: Sensors;

  export const setUpdateIntervalForType: (
    type: keyof Sensors,
    updateInterval: number
  ) => void;

  export interface SensorData {
    x: number;
    y: number;
    z: number;
    timestamp: string;
  }

  export interface BarometerData {
    pressure: number;
    timestamp: string;
  }

  type SensorsBase = {
    accelerometer: Observable<SensorData>;
    gyroscope: Observable<SensorData>;
    magnetometer: Observable<SensorData>;
    barometer: Observable<BarometerData>;
  };

  export const {
    accelerometer,
    gyroscope,
    magnetometer,
    barometer
  }: SensorsBase;

  const sensors: SensorsBase;

  export default sensors;
}

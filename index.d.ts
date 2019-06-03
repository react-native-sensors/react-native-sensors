declare module "react-native-sensors" {
  export const SensorTypes: {
    accelerometer: "accelerometer";
    gyroscope: "gyroscope";
    magnetometer: "magnetometer";
    barometer: "barometer";
  };

  export const setUpdateIntervalForType: (
    type: "accelerometer" | "gyroscope" | "magnetometer" | "barometer",
    updateInterval: number
  ) => void;

  export interface RNSensorObservable {
    unsubscribe: () => void;
  }

  interface SensorData {
    x: number;
    y: number;
    z: number;
    timestamp: string;
  }

  export interface RNSensor {
    subscribe: (
      observer: ({ x, y, z, timestamp }: SensorData) => SensorData
    ) => RNSensorObservable;
  }

  export const {
    accelerometer,
    gyroscope,
    magnetometer,
    barometer
  }: {
    accelerometer: RNSensor;
    gyroscope: RNSensor;
    magnetometer: RNSensor;
    barometer: RNSensor;
  };

  const sensors: {
    accelerometer: RNSensor;
    gyroscope: RNSensor;
    magnetometer: RNSensor;
    barometer: RNSensor;
  };

  export default sensors;
}

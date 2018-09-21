import { observe } from "rxjs-marbles/jest";

// const AVAILABLE_SENSORS = ["Accelerometer", "Gyroscope", "Magnetometer"]
const AVAILABLE_SENSORS = ["Accelerometer"];

function wait(time = 50) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function createSensorMock() {
  return {
    isAvailable: jest.fn().mockReturnValue(Promise.resolve()),
    setUpdateInterval: jest.fn(),
    startUpdates: jest.fn(),
    stopUpdates: jest.fn()
  };
}

const mockGyro = createSensorMock();
const mockAcc = createSensorMock();
const mockMagn = createSensorMock();
const mockDeviceEvents = jest.fn();
const mockSensors = {
  Gyroscope: mockGyro,
  Accelerometer: mockAcc,
  Magnetometer: mockMagn
};

jest.mock("react-native", () => ({
  NativeModules: mockSensors,
  DeviceEventEmitter: {
    addListener: mockDeviceEvents
  }
}));

const RNSensors = require("../../").default;

describe("sensors", () => {
  beforeEach(() => {
    mockGyro.setUpdateInterval.mockReset();
    mockGyro.startUpdates.mockReset();
    mockGyro.stopUpdates.mockReset();

    mockAcc.setUpdateInterval.mockReset();
    mockAcc.startUpdates.mockReset();
    mockAcc.stopUpdates.mockReset();

    mockMagn.setUpdateInterval.mockReset();
    mockMagn.startUpdates.mockReset();
    mockMagn.stopUpdates.mockReset();

    mockDeviceEvents.mockReset();
  });

  it("should be mocked", () => {
    const { NativeModules } = require("react-native");
    const { Gyroscope, Accelerometer, Magnetometer } = NativeModules;
    Gyroscope.setUpdateInterval();
    Gyroscope.startUpdates();
    Gyroscope.stopUpdates();
    Gyroscope.isAvailable();
    Accelerometer.setUpdateInterval();
    Accelerometer.startUpdates();
    Accelerometer.stopUpdates();
    Accelerometer.isAvailable();
    Magnetometer.setUpdateInterval();
    Magnetometer.startUpdates();
    Magnetometer.stopUpdates();
    Magnetometer.isAvailable();

    expect(Gyroscope.setUpdateInterval).toHaveBeenCalled();
    expect(Gyroscope.startUpdates).toHaveBeenCalled();
    expect(Gyroscope.stopUpdates).toHaveBeenCalled();
    expect(Gyroscope.isAvailable).toHaveBeenCalled();
    expect(Accelerometer.setUpdateInterval).toHaveBeenCalled();
    expect(Accelerometer.startUpdates).toHaveBeenCalled();
    expect(Accelerometer.stopUpdates).toHaveBeenCalled();
    expect(Accelerometer.isAvailable).toHaveBeenCalled();
    expect(Magnetometer.setUpdateInterval).toHaveBeenCalled();
    expect(Magnetometer.startUpdates).toHaveBeenCalled();
    expect(Magnetometer.stopUpdates).toHaveBeenCalled();
    expect(Magnetometer.isAvailable).toHaveBeenCalled();
  });

  AVAILABLE_SENSORS.forEach(type => {
    describe(type, () => {
      const Sensor = RNSensors[type];
      const sensorMock = mockSensors[type];

      it("should expose a constructor", () => {
        expect(Sensor).toBeInstanceOf(Function);
      });

      it("should not start the sensor before there is a listener", () => {
        const sensor$ = new Sensor();

        expect(sensorMock.startUpdates).not.toHaveBeenCalled();
      });

      it("should start a sensor after subscription", () => {
        sensorMock.isAvailable.mockReturnValueOnce(Promise.resolve());
        const sensor$ = new Sensor();

        return new Promise(async (resolve, reject) => {
          const sub = sensor$.subscribe(
            () => {
              expect(sensorMock.startUpdates).toHaveBeenCalled();
              resolve();
            },
            err => {
              reject(err);
            }
          );

          // We need to wait so that this callback is available
          await wait();
          mockDeviceEvents.mock.calls[0][1]({});
          sub.unsubscribe();
        });
      });

      it("should error the stream if the sensor is not present", () => {
        sensorMock.isAvailable.mockReturnValueOnce(Promise.reject());
        const sensor$ = new Sensor();
        return new Promise(async (resolve, reject) => {
          sensor$.subscribe(
            () => {
              reject();
            },
            () => {
              expect(sensorMock.startUpdates).not.toHaveBeenCalled();
              expect(sensorMock.setUpdateInterval).not.toHaveBeenCalledWith(
                100
              );
              resolve();
            }
          );

          // We need to wait so that this callback is available
          await wait();
          mockDeviceEvents.mock.calls[0][1]({});
        });
      });

      it("should stop a sensor on unsubscribe", async () => {
        sensorMock.isAvailable.mockReturnValue(Promise.resolve());

        const sensor$ = new Sensor();

        const subscription = sensor$.subscribe();

        // We need to wait so that this callback is available
        await wait();
        expect(sensorMock.stopUpdates).not.toHaveBeenCalled();
        subscription.unsubscribe();
        await wait();
        expect(sensorMock.stopUpdates).toHaveBeenCalled();
      });

      it("should stop a sensor on unsubscribe", async () => {
        sensorMock.isAvailable.mockReturnValue(Promise.resolve());

        const sensor$ = new Sensor();
        const sensor2$ = new Sensor();

        const subscription = sensor$.subscribe();
        const subscription2 = sensor2$.subscribe();

        // We need to wait so that this callback is available
        await wait();
        expect(sensorMock.stopUpdates).not.toHaveBeenCalled();
        subscription.unsubscribe();
        await wait();
        expect(sensorMock.stopUpdates).not.toHaveBeenCalled();
        subscription2.unsubscribe();
        await wait();
        expect(sensorMock.stopUpdates).toHaveBeenCalled();
      });

      describe("events", () => {
        it("should register a device event callback", async () => {
          const { DeviceEventEmitter } = require("react-native");

          sensorMock.isAvailable.mockReturnValueOnce(Promise.resolve());
          const sensor$ = new Sensor();

          sensor$.subscribe();

          await wait();
          expect(DeviceEventEmitter.addListener).toHaveBeenCalled();
        });

        it("should add a value to the observable if an event was triggered", async () => {
          const { DeviceEventEmitter } = require("react-native");
          sensorMock.isAvailable.mockReturnValueOnce(Promise.resolve());
          const sensor$ = new Sensor();
          const data = {
            x: 0,
            y: 0,
            z: 0,
            timestamp: 1514196009536
          };

          return new Promise(async (resolve, reject) => {
            sensor$.subscribe(
              value => {
                expect(value).toEqual(data);
                resolve();
              },
              err => {
                reject(err);
              }
            );

            // We need to wait so that this callback is available
            await wait();
            mockDeviceEvents.mock.calls[0][1](data);
          });
        });
      });
    });
  });
});

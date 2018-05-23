jest.unmock("rxjs/Rx");

function createSensorMock() {
  return {
    isAvailable: () => new Promise(resolve => resolve()),
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
    Accelerometer.setUpdateInterval();
    Accelerometer.startUpdates();
    Accelerometer.stopUpdates();
    Magnetometer.setUpdateInterval();
    Magnetometer.startUpdates();
    Magnetometer.stopUpdates();

    expect(Gyroscope.setUpdateInterval).toHaveBeenCalled();
    expect(Gyroscope.startUpdates).toHaveBeenCalled();
    expect(Gyroscope.stopUpdates).toHaveBeenCalled();
    expect(Accelerometer.setUpdateInterval).toHaveBeenCalled();
    expect(Accelerometer.startUpdates).toHaveBeenCalled();
    expect(Accelerometer.stopUpdates).toHaveBeenCalled();
    expect(Magnetometer.setUpdateInterval).toHaveBeenCalled();
    expect(Magnetometer.startUpdates).toHaveBeenCalled();
    expect(Magnetometer.stopUpdates).toHaveBeenCalled();
  });

  ["Accelerometer", "Gyroscope", "Magnetometer"].forEach(type => {
    describe(type, () => {
      const Sensor = RNSensors[type];
      const sensorMock = mockSensors[type];

      it("should expose a constructor", () => {
        expect(Sensor).toBeInstanceOf(Function);
      });

      it("should start a sensor on creation", async () => {
        await new Sensor().then(instance => {
          // If no one subscribes the observable is not invoked
          instance.subscribe(value => {});
          expect(instance.stop).toBeInstanceOf(Function);

          expect(sensorMock.startUpdates).toHaveBeenCalled();
          expect(sensorMock.setUpdateInterval).toHaveBeenCalledWith(100);
        });
      });

      it("should pass the correct update interval", async () => {
        await new Sensor({
          updateInterval: 20
        }).then(instance => {
          // If no one subscribes the observable is not invoked
          instance.subscribe(value => {});
          expect(sensorMock.setUpdateInterval).toHaveBeenCalledWith(20);
        });
      });

      it("should stop a sensor on command", async () => {
        await new Sensor().then(instance => {
          instance.subscribe(value => {});
          instance.stop();

          expect(sensorMock.stopUpdates).toHaveBeenCalled();
        });
      });

      describe("events", () => {
        it("should register a device event callback", async () => {
          const { DeviceEventEmitter } = require("react-native");

          await Sensor().then(instance => {
            instance.subscribe(value => {});
            expect(sensorMock.startUpdates).toHaveBeenCalled();

            expect(DeviceEventEmitter.addListener).toHaveBeenCalled();
          });
        });

        it("should add a value to the observable if an event was triggered", async () => {
          const { DeviceEventEmitter } = require("react-native");
          await new Sensor().then(instance => {
            const data = {
              x: 0,
              y: 0,
              z: 0,
              timestamp: 1514196009536
            };

            let lastValue;
            instance.subscribe(value => {
              lastValue = value;
            });

            expect(DeviceEventEmitter.addListener.mock.calls[0][0]).toBe(type);
            const emitEvent = DeviceEventEmitter.addListener.mock.calls[0][1];
            emitEvent(data);

            expect(lastValue).toEqual(data);
          });
        });
      });
    });
  });
});

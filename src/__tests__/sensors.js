jest.unmock('rxjs/Rx');
function createSensorMock() {
  return {
    setUpdateInterval: jest.fn(),
    startUpdates: jest.fn(() => Promise.resolve()),
    stopUpdates: jest.fn()
  };
}
const mockGyro = createSensorMock();
const mockAcc = createSensorMock();
const mockSensors = {
  Gyroscope: mockGyro,
  Accelerometer: mockAcc
};
jest.mock('react-native', () => ({
  NativeModules: mockSensors,
  DeviceEventEmitter: ({
    addListener: jest.fn()
  })
}));

const RNSensors = require('../../').default;
describe("sensors", () => {
  beforeEach(() => {
    mockGyro.setUpdateInterval.mockReset();
    mockGyro.startUpdates.mockReset();
    mockGyro.stopUpdates.mockReset();
    mockAcc.setUpdateInterval.mockReset();
    mockAcc.startUpdates.mockReset();
    mockAcc.stopUpdates.mockReset();
  });

  it("should be mocked", () => {
    const { NativeModules } = require('react-native');
    const { Gyroscope, Accelerometer } = NativeModules;
    Gyroscope.setUpdateInterval();
    Gyroscope.startUpdates();
    Gyroscope.stopUpdates();
    Accelerometer.setUpdateInterval();
    Accelerometer.startUpdates();
    Accelerometer.stopUpdates();


    expect(Gyroscope.setUpdateInterval).toHaveBeenCalled();
    expect(Gyroscope.startUpdates).toHaveBeenCalled();
    expect(Gyroscope.stopUpdates).toHaveBeenCalled();
    expect(Accelerometer.setUpdateInterval).toHaveBeenCalled();
    expect(Accelerometer.startUpdates).toHaveBeenCalled();
    expect(Accelerometer.stopUpdates).toHaveBeenCalled();
  });

  ['Accelerometer', 'Gyroscope'].forEach(type => {
    describe(`Basic Interface: ${type}`, () => {
      const Sensor = RNSensors[type];
      const sensorMock = mockSensors[type];

      it('should expose a constructor', () => {
        expect(Sensor).toBeInstanceOf(Function);
      });

      it('should start a sensor on creation', () => {
        const instance = new Sensor();
        // If no one subscribes the observable is not invoked
        instance.subscribe(value => {});
        expect(instance.stop).toBeInstanceOf(Function);
        
        expect(sensorMock.startUpdates).toHaveBeenCalled();
        expect(sensorMock.setUpdateInterval).toHaveBeenCalledWith(100);
      });

      it('should stop a sensor on command', () => {
        const instance = new Sensor();
        instance.subscribe(value => { });
        instance.stop();

        expect(sensorMock.stopUpdates).toHaveBeenCalled();
      });
    });
  });
});
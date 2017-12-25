function createSensorMock() {
  return {
    setUpdateInterval: jest.fn(),
    startUpdates: jest.fn(() => Promise.resolve()),
    stopUpdates: jest.fn()
  };
}
const mockGyro = createSensorMock();
const mockAcc = createSensorMock();
jest.mock('react-native', () => ({
  NativeModules: ({
    Gyroscope: mockGyro,
    Accelerometer: mockAcc
  })
}));

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
});
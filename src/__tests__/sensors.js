jest.mock("NativeModules", () => ({
  Accelerometer: {
    setUpdateInterval: jest.fn(),
    startUpdates: jest.fn(() => Promise.resolve()),
    stopUpdates: jest.fn()
  },
  Gyroscope: {
    setUpdateInterval: jest.fn(),
    startUpdates: jest.fn(() => Promise.resolve()),
    stopUpdates: jest.fn()
  }
}));

describe("sensors", () => {
  it("should return a stopable object");
  it("should get events for a sensor");
  it("should ignore events of other typed sensors");
});

describe("Gyroscope", () => {
  const sensorName = "gyroscope";

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("gyroscope x should be up to date", async () => {
    console.log("setting")
    await connection.exec("sensor set gyroscope 5.1:0:0");
    console.log("set")
    await expect(element(by.id(`${sensorName}-x`))).toHaveText("5");

    await connection.exec("sensor set gyroscope 9:0:0");
    await expect(element(by.id(`${sensorName}-x`))).toHaveText("9");
  });

  it("gyroscope y should be up to date", async () => {
    await connection.exec("sensor set gyroscope 0:7.8:0");
    await expect(element(by.id(`${sensorName}-y`))).toHaveText("8");

    await connection.exec("sensor set gyroscope 0:5.8:0");
    await expect(element(by.id(`${sensorName}-y`))).toHaveText("6");
  });

  it("gyroscope z should be up to date", async () => {
    await connection.exec("sensor set gyroscope 0:0:3.3");
    await expect(element(by.id(`${sensorName}-z`))).toHaveText("3");

    await connection.exec("sensor set gyroscope 0:0:1.1");
    await expect(element(by.id(`${sensorName}-z`))).toHaveText("1");
  });
});

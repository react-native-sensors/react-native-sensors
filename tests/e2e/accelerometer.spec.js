describe("Accelerometer", () => {
  const sensorName = "accelerometer";

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("accelerometer x should be up to date", async () => {
    await connection.exec("sensor set acceleration 5.1:0:0");
    await expect(element(by.id(`${sensorName}-x`))).toHaveText("5");

    await connection.exec("sensor set acceleration 9:0:0");
    await expect(element(by.id(`${sensorName}-x`))).toHaveText("9");
  });

  it("accelerometer y should be up to date", async () => {
    await connection.exec("sensor set acceleration 0:7.8:0");
    await expect(element(by.id(`${sensorName}-y`))).toHaveText("8");

    await connection.exec("sensor set acceleration 0:5.8:0");
    await expect(element(by.id(`${sensorName}-y`))).toHaveText("6");
  });

  it("accelerometer z should be up to date", async () => {
    await connection.exec("sensor set acceleration 0:0:3.3");
    await expect(element(by.id(`${sensorName}-z`))).toHaveText("3");

    await connection.exec("sensor set acceleration 0:0:1.1");
    await expect(element(by.id(`${sensorName}-z`))).toHaveText("1");
  });
});

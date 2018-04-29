describe('Renders', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });
  
  it('has a welcome message', async () => {
    await expect(element(by.text('Welcome to React Native!'))).toBeVisible();
  });
})
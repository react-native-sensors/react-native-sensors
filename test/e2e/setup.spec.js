describe('Setup', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });
  
  it('Main screen', async () => {
    await expect(element(by.id('headline-main'))).toBeVisible();
    await expect(element(by.id('nav-default'))).toBeVisible();
    await expect(element(by.id('nav-decorator'))).toBeVisible();
  });

  it('Default screen', async () => {
    await element(by.id('nav-default')).tap();
    await expect(element(by.id('headline-default'))).toBeVisible();
  });

  it('Decorator screen', async () => {
    await element(by.id('nav-decorator')).tap();
    await expect(element(by.id('headline-decorator'))).toBeVisible();
  });
});

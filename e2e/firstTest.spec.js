describe("Root testing suite", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should have todolist screen", async () => {
    await expect(element(by.text("TODO List"))).toBeVisible();
  });
});

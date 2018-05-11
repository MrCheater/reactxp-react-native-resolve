describe("Root testing suite", () => {
  function timeout(ms) {
    console.log("wait " + ms + " ms");
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should have todolist screen", async () => {
    await expect(element(by.text("TODO List"))).toBeVisible();
  });

  it("should type text", async () => {
    const text = "TEST TEST";
    await expect(element(by.text("New TODO"))).toBeVisible();
    await element(by.text("New TODO")).typeText(text + "\n");
    await timeout(1000);
    await expect(element(by.text(text))).toBeVisible();
  });
});

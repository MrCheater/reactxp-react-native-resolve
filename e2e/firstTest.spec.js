const { blacklistLiveReloadUrl, getAppUrl } = require("detox-expo-helpers");

describe("Root testing suite", () => {
  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const delay = 100000;
  beforeEach(async () => {
    await timeout(delay);
    let url = await getAppUrl();
    device.launchApp({
      newInstance: true,
      url,
      sourceApp: "host.exp.exponent",
      launchArgs: { EXKernelDisableNuxDefaultsKey: true }
    });
    console.log("wait " + delay + " ms");
    await timeout(delay);
    await blacklistLiveReloadUrl();
  });

  it("should have todolist screen", async () => {
    await expect(element(by.text("TODO List"))).toBeVisible();
  });
});

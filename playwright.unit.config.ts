import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: /sanity-policy\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
});

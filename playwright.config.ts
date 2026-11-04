import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: "http://localhost:4317",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --port 4317",
    url: "http://localhost:4317/",
    reuseExistingServer: false,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});

import { expect, test, type Page } from "@playwright/test";

async function mockWeatherApis(page: Page) {
  await page.route("https://geocoding-api.open-meteo.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        results: [
          {
            id: 2643743,
            name: "London",
            admin1: "England",
            country: "United Kingdom",
            latitude: 51.5,
            longitude: -0.12,
          },
          {
            id: 6058560,
            name: "London",
            admin1: "Ontario",
            country: "Canada",
            latitude: 42.9834,
            longitude: -81.233,
          },
        ],
      }),
    });
  });

  await page.route("https://api.open-meteo.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        timezone: "Europe/London",
        timezone_abbreviation: "GMT",
        current: {
          time: "2026-11-04T10:00",
          temperature_2m: 54,
          relative_humidity_2m: 62,
          apparent_temperature: 52,
          weather_code: 2,
          is_day: 1,
          wind_speed_10m: 10,
          wind_direction_10m: 260,
        },
        hourly: {
          time: Array.from({ length: 24 }, (_, i) => `2026-11-04T${String(i).padStart(2, "0")}:00`),
          temperature_2m: Array.from({ length: 24 }, (_, i) => 50 + (i % 4)),
          weather_code: Array.from({ length: 24 }, () => 2),
          precipitation_probability: Array.from({ length: 24 }, () => 20),
          is_day: Array.from({ length: 24 }, () => 1),
        },
        daily: {
          time: Array.from({ length: 10 }, (_, i) => `2026-11-${String(i + 4).padStart(2, "0")}`),
          weather_code: Array.from({ length: 10 }, () => 3),
          temperature_2m_min: Array.from({ length: 10 }, () => 43),
          temperature_2m_max: Array.from({ length: 10 }, () => 61),
          precipitation_probability_max: Array.from({ length: 10 }, () => 30),
          uv_index_max: Array.from({ length: 10 }, () => 3),
          sunrise: Array.from({ length: 10 }, () => "2026-11-04T06:45"),
          sunset: Array.from({ length: 10 }, () => "2026-11-04T17:11"),
          daylight_duration: Array.from({ length: 10 }, () => 37200),
        },
      }),
    });
  });

  await page.route("https://air-quality-api.open-meteo.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        hourly: {
          us_aqi: [42],
          pm2_5: [11],
          pm10: [18],
          ozone: [63],
        },
      }),
    });
  });
}

test("renders desktop dashboard and supports keyboard search selection", async ({ page }) => {
  await mockWeatherApis(page);
  await page.goto("/");
  await expect(page.getByText("Hourly forecast")).toBeVisible();
  await expect(page.getByText("10-day forecast")).toBeVisible();
  await expect(page.getByText("Weather for Chicago, Illinois, United States")).toBeVisible();

  const input = page.locator('input[role="combobox"]:visible').first();
  await input.fill("London");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("listbox")).toBeHidden();

  await expect(page.getByText("Weather for London, England, United Kingdom")).toBeVisible();
  await expect(page.getByText("42 AQI")).toBeVisible();
});

test("mobile keeps hero visible and avoids page horizontal scroll", async ({ page }) => {
  await mockWeatherApis(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByText("Weather for Chicago, Illinois, United States")).toBeVisible();
  await expect(page.getByText("Hourly forecast")).toBeVisible();
  await expect(page.locator('input[role="combobox"]:visible').first()).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
  });
  expect(hasHorizontalOverflow).toBe(false);
});

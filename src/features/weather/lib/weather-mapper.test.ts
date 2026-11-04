import { describe, expect, it } from "vitest";
import { mapWeatherReport } from "@/features/weather/lib/weather-mapper";
import type { AirQualityResponse, ForecastResponse } from "@/features/weather/schemas";
import type { WeatherLocation } from "@/features/weather/types";

const location: WeatherLocation = {
  id: 1,
  name: "Chicago",
  region: "Illinois",
  country: "United States",
  latitude: 41.88,
  longitude: -87.63,
};

const forecast: ForecastResponse = {
  timezone: "America/Chicago",
  timezone_abbreviation: "CST",
  current: {
    time: "2026-11-04T10:00",
    temperature_2m: 52,
    relative_humidity_2m: 55,
    apparent_temperature: 49.2,
    weather_code: 2,
    is_day: 1,
    wind_speed_10m: 12,
    wind_direction_10m: 270,
  },
  hourly: {
    time: Array.from({ length: 40 }, (_, index) => {
      const day = index < 24 ? "04" : "05";
      const hour = String(index % 24).padStart(2, "0");
      return `2026-11-${day}T${hour}:00`;
    }),
    temperature_2m: Array.from({ length: 40 }, () => 52),
    weather_code: Array.from({ length: 40 }, () => 2),
    precipitation_probability: Array.from({ length: 40 }, () => 25),
    is_day: Array.from({ length: 40 }, () => 1),
  },
  daily: {
    time: Array.from({ length: 10 }, (_, index) => `2026-11-${String(index + 4).padStart(2, "0")}`),
    weather_code: Array.from({ length: 10 }, () => 3),
    temperature_2m_min: Array.from({ length: 10 }, (_, index) => 40 + index),
    temperature_2m_max: Array.from({ length: 10 }, (_, index) => 55 + index),
    precipitation_probability_max: Array.from({ length: 10 }, () => 30),
    uv_index_max: Array.from({ length: 10 }, () => 4),
    sunrise: Array.from({ length: 10 }, () => "2026-11-04T06:45"),
    sunset: Array.from({ length: 10 }, () => "2026-11-04T17:11"),
    daylight_duration: Array.from({ length: 10 }, () => 37200),
  },
};

describe("mapWeatherReport", () => {
  it("maps report and trims to 24 hours", () => {
    const mapped = mapWeatherReport(location, forecast, { unit: "fahrenheit", windSpeedUnit: "mph" });
    expect(mapped.hourly).toHaveLength(24);
    expect(mapped.current.temperature).toBe(52);
    expect(mapped.daily).toHaveLength(10);
    expect(mapped.details.find((item) => item.label === "Sunrise")?.value).toBe("06:45");
  });

  it("maps optional air quality", () => {
    const air: AirQualityResponse = {
      hourly: {
        us_aqi: [42],
        pm2_5: [13],
        pm10: [18],
        ozone: [72],
      },
    };
    const mapped = mapWeatherReport(location, forecast, { unit: "fahrenheit", windSpeedUnit: "mph", airQuality: air });
    expect(mapped.airQuality?.usAqi).toBe(42);
  });
});

import { requestJson } from "@/features/weather/api/http";
import { AirQualityResponseSchema } from "@/features/weather/schemas";
import type { WeatherLocation } from "@/features/weather/types";

export async function fetchAirQuality(location: WeatherLocation, signal?: AbortSignal) {
  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: "auto",
    hourly: "us_aqi,pm2_5,pm10,ozone",
    forecast_days: "1",
  }).toString();

  return requestJson(url, AirQualityResponseSchema, signal);
}


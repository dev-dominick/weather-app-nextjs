import { requestJson } from "@/features/weather/api/http";
import { ForecastResponseSchema } from "@/features/weather/schemas";
import type { TemperatureUnit, WeatherLocation, WindSpeedUnit } from "@/features/weather/types";

type ForecastOptions = {
  unit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  signal?: AbortSignal;
};

export async function fetchForecast(
  location: WeatherLocation,
  { unit, windSpeedUnit, signal }: ForecastOptions,
) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: "auto",
    forecast_days: "10",
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,is_day,wind_speed_10m,wind_direction_10m",
    hourly: "temperature_2m,weather_code,precipitation_probability,is_day",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset,daylight_duration",
    temperature_unit: unit,
    wind_speed_unit: windSpeedUnit,
  }).toString();

  return requestJson(url, ForecastResponseSchema, signal);
}


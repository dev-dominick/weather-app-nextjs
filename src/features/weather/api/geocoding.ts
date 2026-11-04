import { requestJson } from "@/features/weather/api/http";
import { GeocodingResponseSchema } from "@/features/weather/schemas";
import type { WeatherLocation } from "@/features/weather/types";

const RESULTS_LIMIT = 8;

export async function searchCities(query: string, signal?: AbortSignal): Promise<WeatherLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.search = new URLSearchParams({
    name: trimmed,
    count: String(RESULTS_LIMIT),
    language: "en",
    format: "json",
  }).toString();

  const response = await requestJson(url, GeocodingResponseSchema, signal);
  return (response.results ?? []).map((result) => ({
    id: result.id,
    name: result.name,
    region: result.admin1,
    country: result.country,
    countryCode: result.country_code,
    timezone: result.timezone,
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}


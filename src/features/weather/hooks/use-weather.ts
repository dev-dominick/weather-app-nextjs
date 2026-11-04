"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAirQuality } from "@/features/weather/api/air-quality";
import { fetchForecast } from "@/features/weather/api/open-meteo";
import { mapWeatherReport } from "@/features/weather/lib/weather-mapper";
import type { TemperatureUnit, WeatherLocation } from "@/features/weather/types";

function windSpeedUnitFor(unit: TemperatureUnit) {
  return unit === "fahrenheit" ? "mph" : "kmh";
}

export function useWeather(location: WeatherLocation | null, unit: TemperatureUnit) {
  return useQuery({
    queryKey: ["weather", location?.id, unit],
    enabled: Boolean(location),
    queryFn: async ({ signal }) => {
      if (!location) {
        throw new Error("Location is required.");
      }

      const windSpeedUnit = windSpeedUnitFor(unit);
      const [forecastResult, airQualityResult] = await Promise.allSettled([
        fetchForecast(location, { unit, windSpeedUnit, signal }),
        fetchAirQuality(location, signal),
      ]);

      if (forecastResult.status === "rejected") {
        throw forecastResult.reason;
      }

      const airQuality = airQualityResult.status === "fulfilled" ? airQualityResult.value : undefined;
      return mapWeatherReport(location, forecastResult.value, { unit, windSpeedUnit, airQuality });
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchInterval: 1000 * 60 * 15,
    retry: 2,
  });
}


"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CurrentWeather } from "@/features/weather/components/current-weather";
import { DailyForecast } from "@/features/weather/components/daily-forecast";
import { HourlyForecast } from "@/features/weather/components/hourly-forecast";
import { LocationSearch } from "@/features/weather/components/location-search";
import { MobileControls } from "@/features/weather/components/mobile-controls";
import { PrecipitationChart } from "@/features/weather/components/precipitation-chart";
import { WeatherBackground } from "@/features/weather/components/weather-background";
import { WeatherDetailCard } from "@/features/weather/components/weather-detail-card";
import { CitySidebar } from "@/features/weather/components/city-sidebar";
import { useSavedCities } from "@/features/weather/hooks/use-saved-cities";
import { useWeather } from "@/features/weather/hooks/use-weather";
import { formatLocationLabel } from "@/features/weather/lib/weather-formatters";
import type { WeatherLocation } from "@/features/weather/types";

const DEFAULT_LOCATION: WeatherLocation = {
  id: 4887398,
  name: "Chicago",
  region: "Illinois",
  country: "United States",
  countryCode: "US",
  latitude: 41.8781,
  longitude: -87.6298,
};

export function WeatherDashboard() {
  const [query, setQuery] = useState(DEFAULT_LOCATION.name);
  const { savedCities, saveCity, removeCity, unit, setUnit } = useSavedCities();
  const [activeLocation, setActiveLocation] = useState<WeatherLocation | null>(DEFAULT_LOCATION);
  const [geoError, setGeoError] = useState<string | null>(null);
  const weatherQuery = useWeather(activeLocation, unit);

  const statusText = useMemo(() => {
    if (weatherQuery.isPending) return "Loading latest weather...";
    if (weatherQuery.isFetching) return "Refreshing weather in the background...";
    return null;
  }, [weatherQuery.isFetching, weatherQuery.isPending]);

  function onSelectLocation(location: WeatherLocation) {
    setActiveLocation(location);
    setQuery(location.name);
    saveCity(location);
  }

  function onUseMyLocation() {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is unavailable in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoError(null);
        const location: WeatherLocation = {
          id: Number(`${Math.round(position.coords.latitude * 1000)}${Math.round(position.coords.longitude * 1000)}`),
          name: "Current location",
          region: "",
          country: "",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        onSelectLocation(location);
      },
      () => {
        setGeoError("Location permission was denied or timed out.");
      },
      { timeout: 10000 },
    );
  }

  const weather = weatherQuery.data;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-weather-canvas text-weather-foreground">
      {weather && <WeatherBackground condition={weather.current.conditionKey} isDay={weather.current.isDay} />}
      <div className="relative z-10 mx-auto grid w-full max-w-[1380px] grid-cols-1 gap-4 px-3 py-4 md:px-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6 lg:px-8 lg:py-8">
        <div className="hidden lg:block">
          <CitySidebar
            activeLocationId={activeLocation?.id ?? null}
            locations={savedCities}
            onSelect={onSelectLocation}
            onRemove={removeCity}
            onUseMyLocation={onUseMyLocation}
            unit={unit}
            onUnitChange={setUnit}
            searchSlot={<LocationSearch value={query} onValueChange={setQuery} onSelect={onSelectLocation} />}
          />
        </div>

        <section className="min-w-0 space-y-4 lg:space-y-6">
          {statusText && <p className="text-sm text-weather-muted">{statusText}</p>}
          {geoError && (
            <Card className="border-amber-200/30 bg-amber-500/15 py-3">
              <p className="text-sm text-amber-100">{geoError}</p>
            </Card>
          )}

          {weatherQuery.isError && (
            <Card className="flex items-start gap-3 border-rose-300/35 bg-rose-500/20">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-100" />
              <div>
                <p className="font-medium text-rose-100">Couldn&apos;t load weather data.</p>
                <p className="text-sm text-rose-100/90">Try a different city, or check your internet connection and retry.</p>
              </div>
            </Card>
          )}

          {weatherQuery.isPending && (
            <Card className="space-y-3 p-6">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-16 w-32" />
              <Skeleton className="h-4 w-56" />
            </Card>
          )}

          {weather && (
            <>
              <CurrentWeather weather={weather} />
              <div className="space-y-3 lg:hidden">
                <LocationSearch value={query} onValueChange={setQuery} onSelect={onSelectLocation} />
                <MobileControls
                  activeLocationId={activeLocation?.id ?? null}
                  locations={savedCities}
                  onSelect={onSelectLocation}
                  onUseMyLocation={onUseMyLocation}
                  unit={unit}
                  onUnitChange={setUnit}
                />
              </div>

              <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <HourlyForecast hourly={weather.hourly} unit={unit} />
                <PrecipitationChart hourly={weather.hourly} />
              </div>

              <DailyForecast daily={weather.daily} unit={unit} />

              <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {weather.details.map((detail) => (
                  <WeatherDetailCard key={detail.label} label={detail.label} value={detail.value} helper={detail.helper} />
                ))}
                <WeatherDetailCard
                  label="Air Quality"
                  value={weather.airQuality?.usAqi ? `${Math.round(weather.airQuality.usAqi)} AQI` : "Unavailable"}
                  helper={
                    weather.airQuality?.pm25
                      ? `PM2.5 ${Math.round(weather.airQuality.pm25)} · PM10 ${Math.round(weather.airQuality.pm10 ?? 0)}`
                      : "Air quality feed unavailable"
                  }
                />
              </section>

              <footer className="pt-2 text-xs text-weather-muted">
                Weather for {formatLocationLabel(weather.location)} · Data by Open-Meteo
              </footer>
            </>
          )}

          {!weather && (
            <div className="space-y-3 lg:hidden">
              <LocationSearch value={query} onValueChange={setQuery} onSelect={onSelectLocation} />
              <MobileControls
                activeLocationId={activeLocation?.id ?? null}
                locations={savedCities}
                onSelect={onSelectLocation}
                onUseMyLocation={onUseMyLocation}
                unit={unit}
                onUnitChange={setUnit}
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

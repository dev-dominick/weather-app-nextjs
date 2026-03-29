"use client";

import { FormEvent, useMemo, useState } from "react";

type WeatherCode = number;

type GeocodeResponse = {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    admin1?: string;
    country: string;
    timezone: string;
  }>;
};

type ForecastResponse = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: WeatherCode;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: WeatherCode[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

type Location = {
  displayName: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

type ForecastDay = {
  date: string;
  weatherCode: WeatherCode;
  maxTemp: number;
  minTemp: number;
  precipitationChance: number;
};

type WeatherData = {
  location: Location;
  current: ForecastResponse["current"];
  daily: ForecastDay[];
};

function getWeatherLabel(code: WeatherCode): string {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown";
}

function formatWeekday(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  const geocodeParams = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json",
  });

  const geocodeResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${geocodeParams.toString()}`,
  );

  if (!geocodeResponse.ok) {
    throw new Error("Unable to geocode city right now.");
  }

  const geocodeData = (await geocodeResponse.json()) as GeocodeResponse;
  const match = geocodeData.results?.[0];

  if (!match) {
    throw new Error("No city found for that search.");
  }

  const forecastParams = new URLSearchParams({
    latitude: String(match.latitude),
    longitude: String(match.longitude),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
  });

  const forecastResponse = await fetch(`https://api.open-meteo.com/v1/forecast?${forecastParams.toString()}`);
  if (!forecastResponse.ok) {
    throw new Error("Unable to load forecast right now.");
  }

  const forecast = (await forecastResponse.json()) as ForecastResponse;
  const daily = forecast.daily.time.slice(0, 5).map((time, index) => ({
    date: time,
    weatherCode: forecast.daily.weather_code[index],
    maxTemp: forecast.daily.temperature_2m_max[index],
    minTemp: forecast.daily.temperature_2m_min[index],
    precipitationChance: forecast.daily.precipitation_probability_max[index],
  }));

  return {
    location: {
      displayName: [match.name, match.admin1, match.country].filter(Boolean).join(", "),
      latitude: match.latitude,
      longitude: match.longitude,
      timezone: match.timezone,
    },
    current: forecast.current,
    daily,
  };
}

export default function Home() {
  const [query, setQuery] = useState("Chicago");
  const [submittedQuery, setSubmittedQuery] = useState("Chicago");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentSummary = useMemo(() => {
    if (!weather) return null;
    return getWeatherLabel(weather.current.weather_code);
  }, [weather]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const city = query.trim();
    if (!city) {
      setError("Please enter a city.");
      return;
    }

    setSubmittedQuery(city);
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchWeatherByCity(city);
      setWeather(result);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Unexpected error.";
      setError(message);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8">
      <header className="rounded-3xl border border-cyan-200 bg-[linear-gradient(120deg,#0f172a,#0ea5e9)] px-6 py-8 text-slate-50 shadow-xl sm:px-10">
        <p className="text-sm uppercase tracking-[0.16em] text-cyan-200">Weather App Next.js</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Forecast search with static export support</h1>
        <p className="mt-3 max-w-2xl text-sm text-cyan-100 sm:text-base">
          Search by city to load current conditions and a five-day outlook from Open-Meteo.
        </p>

        <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search city (e.g. Denver, Austin, Berlin)"
            className="h-12 w-full rounded-xl border border-cyan-300/50 bg-white px-4 text-slate-900 outline-none ring-cyan-200 transition focus:ring-2"
            aria-label="City search"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="h-12 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "Search"}
          </button>
        </form>
      </header>

      <section className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Current Conditions</p>
          {weather ? (
            <>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{weather.location.displayName}</h2>
              <p className="mt-1 text-sm text-slate-600">{weather.location.timezone}</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Temperature</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{Math.round(weather.current.temperature_2m)}°F</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Feels Like</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{Math.round(weather.current.apparent_temperature)}°F</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Humidity</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{weather.current.relative_humidity_2m}%</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Wind Speed</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{Math.round(weather.current.wind_speed_10m)} mph</p>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-5 text-slate-600">Search for a city to load weather details.</p>
          )}
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Status</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">
            {isLoading ? "Fetching latest forecast..." : currentSummary ?? "Waiting for search"}
          </h3>
          <p className="mt-2 text-sm text-slate-600">Request: {submittedQuery}</p>
          {error ? <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
          {!error && weather ? (
            <p className="mt-4 rounded-lg bg-cyan-50 p-3 text-sm text-cyan-800">
              Coordinates: {weather.location.latitude.toFixed(3)}, {weather.location.longitude.toFixed(3)}
            </p>
          ) : null}
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">5-Day Forecast</p>
        {weather ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {weather.daily.map((day) => (
              <article key={day.date} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{formatWeekday(day.date)}</p>
                <p className="mt-1 text-sm text-slate-600">{getWeatherLabel(day.weatherCode)}</p>
                <p className="mt-3 text-sm text-slate-700">High: {Math.round(day.maxTemp)}°F</p>
                <p className="text-sm text-slate-700">Low: {Math.round(day.minTemp)}°F</p>
                <p className="mt-2 text-xs uppercase tracking-[0.1em] text-slate-500">
                  Rain chance {day.precipitationChance}%
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-slate-600">Forecast cards appear after a successful search.</p>
        )}
      </section>
    </main>
  );
}

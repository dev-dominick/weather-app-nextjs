"use client";

import { FormEvent, useMemo, useState } from "react";

type Hourly = { hour: string; icon: string; temp: number; rain?: number };
type Daily = { day: string; icon: string; low: number; high: number; rain: number };
type Detail = { label: string; value: string; helper: string };
type CityWeather = {
  city: string;
  condition: string;
  temp: number;
  high: number;
  low: number;
  hourly: Hourly[];
  daily: Daily[];
  details: Detail[];
};

const MOCK_WEATHER: Record<string, CityWeather> = {
  chicago: {
    city: "Chicago",
    condition: "Partly Cloudy",
    temp: 63,
    high: 68,
    low: 54,
    hourly: [
      { hour: "Now", icon: "⛅", temp: 63 },
      { hour: "3 PM", icon: "☀️", temp: 65 },
      { hour: "4 PM", icon: "☀️", temp: 66 },
      { hour: "5 PM", icon: "⛅", temp: 64 },
      { hour: "6 PM", icon: "🌥️", temp: 62 },
      { hour: "7 PM", icon: "🌧️", temp: 59, rain: 35 },
      { hour: "8 PM", icon: "🌧️", temp: 58, rain: 40 },
      { hour: "9 PM", icon: "☁️", temp: 57 },
    ],
    daily: [
      { day: "Today", icon: "⛅", low: 54, high: 68, rain: 35 },
      { day: "Sun", icon: "🌤️", low: 56, high: 71, rain: 15 },
      { day: "Mon", icon: "☀️", low: 58, high: 73, rain: 5 },
      { day: "Tue", icon: "🌦️", low: 55, high: 69, rain: 40 },
      { day: "Wed", icon: "🌧️", low: 52, high: 63, rain: 65 },
      { day: "Thu", icon: "☁️", low: 50, high: 61, rain: 20 },
      { day: "Fri", icon: "🌤️", low: 53, high: 67, rain: 10 },
      { day: "Sat", icon: "☀️", low: 57, high: 72, rain: 0 },
      { day: "Sun", icon: "🌧️", low: 55, high: 66, rain: 55 },
      { day: "Mon", icon: "⛅", low: 54, high: 68, rain: 25 },
    ],
    details: [
      { label: "UV INDEX", value: "4", helper: "Moderate" },
      { label: "WIND", value: "14 mph", helper: "WNW" },
      { label: "HUMIDITY", value: "61%", helper: "Dew point 49°" },
      { label: "VISIBILITY", value: "9 mi", helper: "Clear" },
    ],
  },
  seattle: {
    city: "Seattle",
    condition: "Rain",
    temp: 52,
    high: 57,
    low: 46,
    hourly: [
      { hour: "Now", icon: "🌧️", temp: 52, rain: 80 },
      { hour: "3 PM", icon: "🌧️", temp: 52, rain: 80 },
      { hour: "4 PM", icon: "🌦️", temp: 51, rain: 65 },
      { hour: "5 PM", icon: "🌦️", temp: 50, rain: 60 },
      { hour: "6 PM", icon: "☁️", temp: 49, rain: 30 },
      { hour: "7 PM", icon: "☁️", temp: 48, rain: 20 },
      { hour: "8 PM", icon: "🌧️", temp: 48, rain: 55 },
      { hour: "9 PM", icon: "🌧️", temp: 47, rain: 60 },
    ],
    daily: Array.from({ length: 10 }, (_, i) => ({
      day: ["Today", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"][i] ?? `Day ${i + 1}`,
      icon: i % 2 === 0 ? "🌧️" : "☁️",
      low: 44 + (i % 3),
      high: 54 + (i % 5),
      rain: 45 + ((i * 7) % 40),
    })),
    details: [
      { label: "UV INDEX", value: "1", helper: "Low" },
      { label: "WIND", value: "9 mph", helper: "SSE" },
      { label: "HUMIDITY", value: "84%", helper: "Very Humid" },
      { label: "VISIBILITY", value: "5 mi", helper: "Mist" },
    ],
  },
  austin: {
    city: "Austin",
    condition: "Sunny",
    temp: 81,
    high: 89,
    low: 68,
    hourly: [
      { hour: "Now", icon: "☀️", temp: 81 },
      { hour: "3 PM", icon: "☀️", temp: 84 },
      { hour: "4 PM", icon: "☀️", temp: 86 },
      { hour: "5 PM", icon: "☀️", temp: 87 },
      { hour: "6 PM", icon: "🌤️", temp: 85 },
      { hour: "7 PM", icon: "🌤️", temp: 82 },
      { hour: "8 PM", icon: "🌙", temp: 79 },
      { hour: "9 PM", icon: "🌙", temp: 76 },
    ],
    daily: Array.from({ length: 10 }, (_, i) => ({
      day: ["Today", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"][i] ?? `Day ${i + 1}`,
      icon: i % 4 === 0 ? "⛅" : "☀️",
      low: 67 + (i % 4),
      high: 87 + (i % 5),
      rain: i % 4 === 0 ? 20 : 5,
    })),
    details: [
      { label: "UV INDEX", value: "9", helper: "Very High" },
      { label: "WIND", value: "12 mph", helper: "SE" },
      { label: "HUMIDITY", value: "43%", helper: "Comfortable" },
      { label: "VISIBILITY", value: "10 mi", helper: "Excellent" },
    ],
  },
};

const DEFAULT_CITY_KEY = "chicago";

function resolveCityKey(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (normalized.includes("seattle")) return "seattle";
  if (normalized.includes("austin")) return "austin";
  return DEFAULT_CITY_KEY;
}

export default function Home() {
  const [query, setQuery] = useState("Chicago");
  const [cityKey, setCityKey] = useState(DEFAULT_CITY_KEY);
  const [loading, setLoading] = useState(false);

  const weather = useMemo(() => MOCK_WEATHER[cityKey], [cityKey]);
  const minLow = Math.min(...weather.daily.map((day) => day.low));
  const maxHigh = Math.max(...weather.daily.map((day) => day.high));

  async function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const resolved = resolveCityKey(query);
    await new Promise((resolve) => setTimeout(resolve, 380));
    setCityKey(resolved);
    setLoading(false);
  }

  return (
    <main className="weather-screen">
      <div className="weather-aurora weather-aurora-top" />
      <div className="weather-aurora weather-aurora-bottom" />

      <section className="glass-card search-card">
        <form onSubmit={onSearchSubmit} className="search-row">
          <span className="search-icon" aria-hidden>
            ⌕
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for a city"
            aria-label="Search for city"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Loading" : "Search"}
          </button>
        </form>
      </section>

      <section className="hero-panel glass-card">
        <p className="hero-city">{weather.city}</p>
        <p className="hero-temp">{weather.temp}°</p>
        <p className="hero-condition">{weather.condition}</p>
        <p className="hero-range">H:{weather.high}°  L:{weather.low}°</p>
      </section>

      <section className="glass-card panel">
        <h2>Hourly Forecast</h2>
        <div className="hourly-scroll">
          {weather.hourly.map((hour) => (
            <article key={hour.hour} className="hourly-item">
              <p>{hour.hour}</p>
              <p className="hourly-icon">{hour.icon}</p>
              {hour.rain ? <p className="rain">{hour.rain}%</p> : <p className="rain rain-hidden">0%</p>}
              <p className="hourly-temp">{hour.temp}°</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-card panel">
        <h2>10-Day Forecast</h2>
        <div className="daily-list">
          {weather.daily.map((day) => {
            const left = ((day.low - minLow) / (maxHigh - minLow || 1)) * 100;
            const width = ((day.high - day.low) / (maxHigh - minLow || 1)) * 100;

            return (
              <article key={`${day.day}-${day.low}-${day.high}`} className="daily-row">
                <p className="daily-day">{day.day}</p>
                <p className="daily-icon">{day.icon}</p>
                <p className="daily-rain">{day.rain}%</p>
                <p className="daily-low">{day.low}°</p>
                <div className="daily-bar-track">
                  <span className="daily-bar-range" style={{ left: `${left}%`, width: `${Math.max(width, 8)}%` }} />
                </div>
                <p className="daily-high">{day.high}°</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="details-grid">
        {weather.details.map((detail) => (
          <article key={detail.label} className="glass-card detail-tile">
            <p className="detail-label">{detail.label}</p>
            <p className="detail-value">{detail.value}</p>
            <p className="detail-helper">{detail.helper}</p>
          </article>
        ))}
      </section>

      <section className="glass-card panel">
        <h2>Saved Cities</h2>
        <div className="city-chip-row">
          {Object.values(MOCK_WEATHER).map((city) => (
            <button key={city.city} className="city-chip" onClick={() => setCityKey(resolveCityKey(city.city))}>
              <span>{city.city}</span>
              <span>{city.temp}°</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

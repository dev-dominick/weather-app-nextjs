import type { TemperatureUnit, WeatherLocation, WindSpeedUnit } from "@/features/weather/types";

export function formatLocationLabel(location: WeatherLocation): string {
  return [location.name, location.region, location.country].filter(Boolean).join(", ");
}

export function formatHourLabel(timestamp: string, isFirst: boolean): string {
  if (isFirst) return "Now";
  const hour = Number.parseInt(timestamp.slice(11, 13), 10);
  if (Number.isNaN(hour)) return "--";
  return `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`;
}

export function formatDayLabel(date: string, isToday: boolean): string {
  if (isToday) return "Today";
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
}

export function formatTemperature(value: number, unit: TemperatureUnit): string {
  const symbol = unit === "fahrenheit" ? "°F" : "°C";
  return `${Math.round(value)}${symbol}`;
}

export function formatWindDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(degrees / 45) % directions.length] ?? "N";
}

export function formatWind(value: number, unit: WindSpeedUnit): string {
  return `${Math.round(value)} ${unit}`;
}

export function formatTime(timestamp: string): string {
  const match = timestamp.match(/T(\d{2}):(\d{2})/);
  if (!match) return "--:--";
  return `${match[1]}:${match[2]}`;
}


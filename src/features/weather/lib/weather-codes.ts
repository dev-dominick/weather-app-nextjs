import type { WeatherConditionKey } from "@/features/weather/types";

type WeatherCodeDefinition = {
  key: WeatherConditionKey;
  dayLabel: string;
  nightLabel: string;
};

const WEATHER_CODES: Array<{ codes: number[]; value: WeatherCodeDefinition }> = [
  { codes: [0], value: { key: "clear", dayLabel: "Clear sky", nightLabel: "Clear night" } },
  { codes: [1, 2], value: { key: "partly-cloudy", dayLabel: "Partly cloudy", nightLabel: "Partly cloudy" } },
  { codes: [3], value: { key: "cloudy", dayLabel: "Overcast", nightLabel: "Overcast" } },
  { codes: [45, 48], value: { key: "fog", dayLabel: "Fog", nightLabel: "Fog" } },
  { codes: [51, 53, 55, 56, 57], value: { key: "drizzle", dayLabel: "Drizzle", nightLabel: "Drizzle" } },
  { codes: [61, 63, 65, 66, 67, 80, 81, 82], value: { key: "rain", dayLabel: "Rain", nightLabel: "Rain" } },
  { codes: [71, 73, 75, 77, 85, 86], value: { key: "snow", dayLabel: "Snow", nightLabel: "Snow" } },
  { codes: [95, 96, 99], value: { key: "storm", dayLabel: "Thunderstorms", nightLabel: "Thunderstorms" } },
];

export function getWeatherInfo(code: number, isDay: boolean): { key: WeatherConditionKey; label: string } {
  const match = WEATHER_CODES.find((entry) => entry.codes.includes(code));
  if (!match) {
    return { key: "unknown", label: "Variable weather" };
  }

  return {
    key: match.value.key,
    label: isDay ? match.value.dayLabel : match.value.nightLabel,
  };
}


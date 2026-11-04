import { Card } from "@/components/ui/card";
import { formatTemperature } from "@/features/weather/lib/weather-formatters";
import { WeatherSymbol } from "@/features/weather/components/weather-symbol";
import type { WeatherReport } from "@/features/weather/types";

type CurrentWeatherProps = {
  weather: WeatherReport;
};

export function CurrentWeather({ weather }: CurrentWeatherProps) {
  const updatedTime = weather.current.updatedAt.replace("T", " ");

  return (
    <Card className="relative overflow-hidden p-6 lg:p-8">
      <div className="relative z-10">
        <p className="text-sm text-weather-muted">{weather.location.name}</p>
        <p className="text-sm text-weather-muted">
          {[weather.location.region, weather.location.country].filter(Boolean).join(", ")}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <WeatherSymbol condition={weather.current.conditionKey} className="h-10 w-10 text-weather-accent" />
          <p className="text-xl font-medium text-weather-foreground">{weather.current.condition}</p>
        </div>
        <p className="mt-2 text-7xl font-light tracking-tight text-weather-foreground">
          {formatTemperature(weather.current.temperature, weather.unit)}
        </p>
        <p className="text-base text-weather-muted">
          H: {formatTemperature(weather.current.high, weather.unit)} · L: {formatTemperature(weather.current.low, weather.unit)}
        </p>
        <p className="mt-4 text-xs text-weather-muted">
          Updated {updatedTime} ({weather.timezoneAbbreviation ?? weather.timezone})
        </p>
      </div>
    </Card>
  );
}


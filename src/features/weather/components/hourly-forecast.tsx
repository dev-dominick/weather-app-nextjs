import { Card } from "@/components/ui/card";
import { formatTemperature } from "@/features/weather/lib/weather-formatters";
import { RainSymbol, WeatherSymbol } from "@/features/weather/components/weather-symbol";
import type { TemperatureUnit, WeatherReport } from "@/features/weather/types";

type HourlyForecastProps = {
  hourly: WeatherReport["hourly"];
  unit: TemperatureUnit;
};

export function HourlyForecast({ hourly, unit }: HourlyForecastProps) {
  return (
    <Card className="min-w-0">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-weather-muted">Hourly forecast</h2>
      <div className="grid auto-cols-[minmax(4.8rem,1fr)] grid-flow-col gap-3 overflow-x-auto pb-1">
        {hourly.map((item) => (
          <article
            key={item.timestamp}
            className="rounded-weather-md border border-weather-border bg-weather-surface-elevated p-3 text-center"
          >
            <p className="text-xs text-weather-muted">{item.label}</p>
            <WeatherSymbol condition={item.conditionKey} className="mx-auto my-2 h-5 w-5 text-weather-accent" />
            <p className="text-base font-semibold text-weather-foreground">{formatTemperature(item.temperature, unit)}</p>
            <p className="mt-2 flex items-center justify-center gap-1 text-xs text-sky-200">
              <RainSymbol className="h-3.5 w-3.5" />
              {item.precipitationProbability}%
            </p>
          </article>
        ))}
      </div>
    </Card>
  );
}

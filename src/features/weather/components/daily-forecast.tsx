import { Card } from "@/components/ui/card";
import { formatTemperature } from "@/features/weather/lib/weather-formatters";
import { WeatherSymbol } from "@/features/weather/components/weather-symbol";
import type { DailyForecast as DailyItem, TemperatureUnit } from "@/features/weather/types";

type DailyForecastProps = {
  daily: DailyItem[];
  unit: TemperatureUnit;
};

export function DailyForecast({ daily, unit }: DailyForecastProps) {
  const min = Math.min(...daily.map((day) => day.low));
  const max = Math.max(...daily.map((day) => day.high));
  const span = Math.max(1, max - min);

  return (
    <Card>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-weather-muted">10-day forecast</h2>
      <div className="space-y-2">
        {daily.map((day) => {
          const left = ((day.low - min) / span) * 100;
          const width = Math.max(4, ((day.high - day.low) / span) * 100);
          return (
            <article key={day.date} className="grid grid-cols-[4rem_1.5rem_2.5rem_2.8rem_minmax(7rem,1fr)_2.8rem] items-center gap-2 py-1.5 text-sm">
              <p className="font-semibold text-weather-foreground">{day.label}</p>
              <WeatherSymbol condition={day.conditionKey} className="h-4 w-4 text-weather-accent" />
              <p className="text-right text-xs text-sky-200">{day.precipitationProbability}%</p>
              <p className="text-weather-muted">{formatTemperature(day.low, unit)}</p>
              <span className="relative h-1.5 rounded-full bg-white/15">
                <span
                  className="absolute top-0 h-1.5 rounded-full bg-gradient-to-r from-sky-300 to-amber-200"
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
              </span>
              <p className="text-right text-weather-foreground">{formatTemperature(day.high, unit)}</p>
            </article>
          );
        })}
      </div>
    </Card>
  );
}


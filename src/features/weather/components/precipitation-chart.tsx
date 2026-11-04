import { Card } from "@/components/ui/card";
import type { HourlyForecast } from "@/features/weather/types";

type PrecipitationChartProps = {
  hourly: HourlyForecast[];
};

export function PrecipitationChart({ hourly }: PrecipitationChartProps) {
  const points = hourly.slice(0, 12);
  return (
    <Card>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-weather-muted">Precipitation next 12 hours</h2>
      <div className="grid grid-cols-12 items-end gap-2">
        {points.map((hour) => (
          <div key={hour.timestamp} className="flex flex-col items-center gap-2">
            <div className="flex h-24 w-full items-end">
              <div
                className="w-full rounded-t-sm bg-weather-accent/80"
                style={{ height: `${Math.max(6, hour.precipitationProbability)}%` }}
              />
            </div>
            <span className="text-[11px] text-weather-muted">{hour.label === "Now" ? "Now" : hour.label.replace(" ", "")}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}


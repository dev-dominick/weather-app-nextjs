import { cn } from "@/lib/utils";
import type { WeatherConditionKey } from "@/features/weather/types";

type WeatherBackgroundProps = {
  condition: WeatherConditionKey;
  isDay: boolean;
};

const conditionClasses: Record<WeatherConditionKey, string> = {
  clear: "from-sky-500/40 to-blue-700/30",
  "partly-cloudy": "from-cyan-400/35 to-blue-800/35",
  cloudy: "from-slate-400/35 to-slate-900/35",
  fog: "from-stone-300/35 to-slate-700/35",
  drizzle: "from-cyan-300/35 to-blue-900/35",
  rain: "from-blue-400/35 to-indigo-900/35",
  snow: "from-slate-100/30 to-slate-500/30",
  storm: "from-violet-500/35 to-indigo-950/45",
  unknown: "from-sky-500/35 to-slate-900/35",
};

export function WeatherBackground({ condition, isDay }: WeatherBackgroundProps) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={cn("absolute -top-32 right-[-8rem] h-72 w-72 rounded-full blur-3xl", conditionClasses[condition])} />
      <div
        className={cn(
          "absolute bottom-[-8rem] left-[-8rem] h-72 w-72 rounded-full blur-3xl",
          isDay ? "bg-cyan-200/20" : "bg-indigo-800/35",
        )}
      />
    </div>
  );
}


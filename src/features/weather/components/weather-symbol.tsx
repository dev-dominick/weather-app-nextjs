import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudRain,
  CloudSun,
  Cloudy,
  Snowflake,
  Sun,
  Umbrella,
  Zap,
} from "lucide-react";
import type { WeatherConditionKey } from "@/features/weather/types";

type WeatherSymbolProps = {
  condition: WeatherConditionKey;
  className?: string;
};

export function WeatherSymbol({ condition, className }: WeatherSymbolProps) {
  switch (condition) {
    case "clear":
      return <Sun className={className} />;
    case "partly-cloudy":
      return <CloudSun className={className} />;
    case "cloudy":
      return <Cloudy className={className} />;
    case "fog":
      return <CloudFog className={className} />;
    case "drizzle":
      return <CloudDrizzle className={className} />;
    case "rain":
      return <CloudRain className={className} />;
    case "snow":
      return <Snowflake className={className} />;
    case "storm":
      return <Zap className={className} />;
    default:
      return <Cloud className={className} />;
  }
}

export function RainSymbol({ className }: { className?: string }) {
  return <Umbrella className={className} />;
}

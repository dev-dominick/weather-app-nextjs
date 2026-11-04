import { Card } from "@/components/ui/card";

type WeatherDetailCardProps = {
  label: string;
  value: string;
  helper: string;
};

export function WeatherDetailCard({ label, value, helper }: WeatherDetailCardProps) {
  return (
    <Card className="space-y-2">
      <p className="text-xs uppercase tracking-[0.16em] text-weather-muted">{label}</p>
      <p className="text-2xl font-semibold text-weather-foreground">{value}</p>
      <p className="text-sm text-weather-muted">{helper}</p>
    </Card>
  );
}


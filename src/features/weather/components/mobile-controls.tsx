"use client";

import { Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatLocationLabel } from "@/features/weather/lib/weather-formatters";
import type { TemperatureUnit, WeatherLocation } from "@/features/weather/types";

type MobileControlsProps = {
  activeLocationId: number | null;
  locations: WeatherLocation[];
  onSelect: (location: WeatherLocation) => void;
  onUseMyLocation: () => void;
  unit: TemperatureUnit;
  onUnitChange: (unit: TemperatureUnit) => void;
};

export function MobileControls({
  activeLocationId,
  locations,
  onSelect,
  onUseMyLocation,
  unit,
  onUnitChange,
}: MobileControlsProps) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-2">
        <Button variant={unit === "fahrenheit" ? "primary" : "secondary"} className="min-h-11 flex-1" onClick={() => onUnitChange("fahrenheit")} type="button">
          °F
        </Button>
        <Button variant={unit === "celsius" ? "primary" : "secondary"} className="min-h-11 flex-1" onClick={() => onUnitChange("celsius")} type="button">
          °C
        </Button>
        <Button variant="secondary" className="min-h-11 gap-2 px-3" onClick={onUseMyLocation} type="button" aria-label="Use my location">
          <Crosshair className="h-4 w-4" />
        </Button>
      </div>
      {locations.length > 0 && (
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-0 gap-2">
            {locations.map((city) => (
              <Button
                key={city.id}
                variant={activeLocationId === city.id ? "primary" : "secondary"}
                className="min-h-11 shrink-0 justify-start px-3"
                onClick={() => onSelect(city)}
                type="button"
                title={formatLocationLabel(city)}
              >
                {city.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}


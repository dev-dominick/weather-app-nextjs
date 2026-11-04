"use client";

import type { ReactNode } from "react";
import { Crosshair, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatLocationLabel } from "@/features/weather/lib/weather-formatters";
import type { TemperatureUnit, WeatherLocation } from "@/features/weather/types";

type CitySidebarProps = {
  activeLocationId: number | null;
  locations: WeatherLocation[];
  onSelect: (location: WeatherLocation) => void;
  onRemove: (id: number) => void;
  onUseMyLocation: () => void;
  unit: TemperatureUnit;
  onUnitChange: (unit: TemperatureUnit) => void;
  searchSlot?: ReactNode;
};

export function CitySidebar({
  activeLocationId,
  locations,
  onSelect,
  onRemove,
  onUseMyLocation,
  unit,
  onUnitChange,
  searchSlot,
}: CitySidebarProps) {
  return (
    <aside className="sticky top-4 space-y-4">
      {searchSlot}
      <Card>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-weather-muted">Units</h2>
        <div className="grid grid-cols-2 gap-2">
          <Button variant={unit === "fahrenheit" ? "primary" : "secondary"} onClick={() => onUnitChange("fahrenheit")} type="button">
            °F
          </Button>
          <Button variant={unit === "celsius" ? "primary" : "secondary"} onClick={() => onUnitChange("celsius")} type="button">
            °C
          </Button>
        </div>
      </Card>

      <Card>
        <Button variant="secondary" className="w-full justify-center gap-2" onClick={onUseMyLocation} type="button">
          <Crosshair className="h-4 w-4" /> Use my location
        </Button>
      </Card>

      <Card>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-weather-muted">Saved locations</h2>
        {locations.length === 0 ? (
          <p className="text-sm text-weather-muted">Search and save cities to pin them here.</p>
        ) : (
          <ul className="max-h-[44vh] space-y-2 overflow-y-auto">
            {locations.map((city) => {
              const selected = activeLocationId === city.id;
              return (
                <li key={city.id} className="flex items-center gap-2">
                  <Button
                    variant={selected ? "primary" : "secondary"}
                    className="h-auto flex-1 justify-start px-3 py-2 text-left"
                    onClick={() => onSelect(city)}
                    type="button"
                  >
                    {formatLocationLabel(city)}
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-10 w-10 rounded-weather-md p-0"
                    onClick={() => onRemove(city.id)}
                    type="button"
                    aria-label={`Remove ${city.name}`}
                  >
                    <Trash2 className="h-4 w-4 text-weather-muted" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </aside>
  );
}

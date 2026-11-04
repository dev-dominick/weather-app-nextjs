"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatLocationLabel } from "@/features/weather/lib/weather-formatters";
import { useCitySearch } from "@/features/weather/hooks/use-city-search";
import type { WeatherLocation } from "@/features/weather/types";

type LocationSearchProps = {
  value: string;
  onValueChange: (value: string) => void;
  onSelect: (location: WeatherLocation) => void;
};

const MAX_VISIBLE_RESULTS = 6;

function rankLocation(result: WeatherLocation, query: string): number {
  const q = query.trim().toLowerCase();
  const name = result.name.toLowerCase();
  const region = (result.region ?? "").toLowerCase();
  const country = (result.country ?? "").toLowerCase();
  const full = formatLocationLabel(result).toLowerCase();

  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  if (full.startsWith(q)) return 2;
  if (region.startsWith(q) || country.startsWith(q)) return 3;
  if (name.includes(q)) return 4;
  if (full.includes(q)) return 5;
  return 6;
}

export function LocationSearch({ value, onValueChange, onSelect }: LocationSearchProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const search = useCitySearch(value);
  const results = useMemo(() => {
    if (!search.data) return [];
    return [...search.data]
      .sort((a, b) => rankLocation(a, value) - rankLocation(b, value))
      .slice(0, MAX_VISIBLE_RESULTS);
  }, [search.data, value]);
  const shouldShowEmpty = results.length === 0 && value.trim().length >= 2 && !search.isLoading && !search.isError;
  const shouldShowDropdown = isOpen && value.trim().length >= 2;

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  function commitSelection(city: WeatherLocation) {
    onSelect(city);
    onValueChange(city.name);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!shouldShowDropdown || results.length === 0) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      commitSelection(results[activeIndex] as WeatherLocation);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div ref={rootRef}>
      <Card className="relative">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-weather-muted" htmlFor="city-search">
        Search city
      </label>
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-weather-muted" aria-hidden />
        <Input
          id="city-search"
          value={value}
          onChange={(event) => {
            onValueChange(event.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={onInputKeyDown}
          placeholder="Search cities worldwide"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="city-search-suggestions"
          aria-expanded={shouldShowDropdown}
          aria-activedescendant={activeIndex >= 0 ? `city-option-${results[activeIndex]?.id}` : undefined}
          autoComplete="off"
        />
      </div>
      {shouldShowDropdown && (
        <div
          id="city-search-suggestions"
          role="listbox"
          className="absolute left-3 right-3 top-[calc(100%+0.4rem)] z-30 overflow-hidden rounded-weather-md border border-weather-border bg-weather-surface-elevated/95 shadow-weather-card backdrop-blur-md"
        >
          {search.isLoading && (
            <div className="space-y-2 p-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
          {search.isError && (
            <p role="alert" className="m-2 rounded-weather-md border border-rose-300/40 bg-rose-500/20 px-3 py-2 text-sm text-rose-100">
              Couldn&apos;t search cities right now. Please try again.
            </p>
          )}
          {results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto p-2">
              {results.map((city, index) => (
                <li key={city.id}>
                  <Button
                    id={`city-option-${city.id}`}
                    role="option"
                    aria-selected={activeIndex === index}
                    variant="ghost"
                    className="h-auto w-full justify-start rounded-weather-md px-3 py-2 text-left"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => commitSelection(city)}
                    onMouseEnter={() => setActiveIndex(index)}
                    type="button"
                  >
                    {formatLocationLabel(city)}
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {shouldShowEmpty && <p className="p-3 text-sm text-weather-muted">No locations found for that query.</p>}
        </div>
      )}
      </Card>
    </div>
  );
}

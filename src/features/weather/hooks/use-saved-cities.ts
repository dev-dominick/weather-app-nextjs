"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { UserSettingsSchema } from "@/features/weather/schemas";
import type { TemperatureUnit, WeatherLocation } from "@/features/weather/types";

const STORAGE_KEY = "weather-app:settings:v2";
const DEFAULT_UNIT: TemperatureUnit = "fahrenheit";

type SavedCitiesState = {
  unit: TemperatureUnit;
  savedCities: WeatherLocation[];
};

function readSettings(): SavedCitiesState {
  if (typeof window === "undefined") {
    return { unit: DEFAULT_UNIT, savedCities: [] };
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { unit: DEFAULT_UNIT, savedCities: [] };
  }

  let json: unknown;
  try {
    json = JSON.parse(raw) as unknown;
  } catch {
    return { unit: DEFAULT_UNIT, savedCities: [] };
  }

  const parsed = UserSettingsSchema.safeParse(json);
  if (!parsed.success) {
    return { unit: DEFAULT_UNIT, savedCities: [] };
  }

  return {
    unit: parsed.data.unit,
    savedCities: parsed.data.savedCities,
  };
}

export function useSavedCities() {
  const [state, setState] = useState<SavedCitiesState>({ unit: DEFAULT_UNIT, savedCities: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setState(readSettings());
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const saveCity = useCallback((city: WeatherLocation) => {
    setState((current) => ({
      ...current,
      savedCities: [city, ...current.savedCities.filter((item) => item.id !== city.id)].slice(0, 8),
    }));
  }, []);

  const removeCity = useCallback((cityId: number) => {
    setState((current) => ({
      ...current,
      savedCities: current.savedCities.filter((city) => city.id !== cityId),
    }));
  }, []);

  const setUnit = useCallback((unit: TemperatureUnit) => {
    setState((current) => ({ ...current, unit }));
  }, []);

  return useMemo(
    () => ({
      hydrated,
      unit: state.unit,
      savedCities: state.savedCities,
      saveCity,
      removeCity,
      setUnit,
    }),
    [hydrated, removeCity, saveCity, setUnit, state.savedCities, state.unit],
  );
}

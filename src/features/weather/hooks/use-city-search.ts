"use client";

import { useQuery } from "@tanstack/react-query";
import { searchCities } from "@/features/weather/api/geocoding";

export function useCitySearch(query: string) {
  return useQuery({
    queryKey: ["city-search", query],
    queryFn: ({ signal }) => searchCities(query, signal),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 0,
  });
}

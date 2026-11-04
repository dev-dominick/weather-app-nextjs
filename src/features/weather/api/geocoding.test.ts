import { beforeEach, describe, expect, it, vi } from "vitest";
import { searchCities } from "@/features/weather/api/geocoding";

describe("searchCities", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty list for short query", async () => {
    expect(await searchCities("a")).toEqual([]);
  });

  it("maps geocoding response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      results: [
        { id: 1, name: "London", admin1: "England", country: "United Kingdom", country_code: "GB", timezone: "Europe/London", latitude: 51.5, longitude: -0.12 },
      ],
    })));

    const cities = await searchCities("London");
    expect(cities[0]).toMatchObject({ name: "London", region: "England", countryCode: "GB" });
  });

  it("throws for malformed API response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      results: [{ id: "wrong-id", name: "Broken", latitude: "x", longitude: "y" }],
    })));
    await expect(searchCities("London")).rejects.toThrow("malformed");
  });
});

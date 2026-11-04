import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSavedCities } from "@/features/weather/hooks/use-saved-cities";

describe("useSavedCities", () => {
  it("hydrates settings and persists updates", async () => {
    localStorage.setItem("weather-app:settings:v2", JSON.stringify({
      unit: "celsius",
      savedCities: [{ id: 1, name: "London", latitude: 1, longitude: 2 }],
    }));

    const { result } = renderHook(() => useSavedCities());

    await waitFor(() => expect(result.current.hydrated).toBe(true));
    expect(result.current.unit).toBe("celsius");
    expect(result.current.savedCities[0]?.name).toBe("London");

    act(() => {
      result.current.setUnit("fahrenheit");
    });
    await waitFor(() => {
      const raw = localStorage.getItem("weather-app:settings:v2");
      expect(raw).toContain("fahrenheit");
    });
  });
});

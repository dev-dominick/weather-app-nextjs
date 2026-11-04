import { describe, expect, it } from "vitest";
import { getWeatherInfo } from "@/features/weather/lib/weather-codes";

describe("getWeatherInfo", () => {
  it("maps clear day and night", () => {
    expect(getWeatherInfo(0, true)).toEqual({ key: "clear", label: "Clear sky" });
    expect(getWeatherInfo(0, false)).toEqual({ key: "clear", label: "Clear night" });
  });

  it("maps storm weather", () => {
    expect(getWeatherInfo(99, true).key).toBe("storm");
  });

  it("falls back to unknown", () => {
    expect(getWeatherInfo(999, true)).toEqual({ key: "unknown", label: "Variable weather" });
  });
});


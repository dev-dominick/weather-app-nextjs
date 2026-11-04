import { z } from "zod";

export const WeatherLocationSchema = z.object({
  id: z.number(),
  name: z.string(),
  region: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  timezone: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
});

export const GeocodingResponseSchema = z.object({
  results: z.array(z.object({
    id: z.number(),
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    admin1: z.string().optional(),
    country: z.string().optional(),
    country_code: z.string().optional(),
    timezone: z.string().optional(),
  })).optional(),
});

export const ForecastResponseSchema = z.object({
  timezone: z.string(),
  timezone_abbreviation: z.string().optional(),
  current: z.object({
    time: z.string(),
    temperature_2m: z.number(),
    relative_humidity_2m: z.number(),
    apparent_temperature: z.number(),
    weather_code: z.number(),
    is_day: z.number(),
    wind_speed_10m: z.number(),
    wind_direction_10m: z.number(),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number()),
    weather_code: z.array(z.number()),
    precipitation_probability: z.array(z.number().nullable()).optional(),
    is_day: z.array(z.number()),
  }),
  daily: z.object({
    time: z.array(z.string()),
    weather_code: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
    temperature_2m_max: z.array(z.number()),
    precipitation_probability_max: z.array(z.number().nullable()).optional(),
    uv_index_max: z.array(z.number().nullable()).optional(),
    sunrise: z.array(z.string()),
    sunset: z.array(z.string()),
    daylight_duration: z.array(z.number()),
  }),
});

export const AirQualityResponseSchema = z.object({
  hourly: z.object({
    us_aqi: z.array(z.number().nullable()).optional(),
    pm2_5: z.array(z.number().nullable()).optional(),
    pm10: z.array(z.number().nullable()).optional(),
    ozone: z.array(z.number().nullable()).optional(),
  }),
});

export const UserSettingsSchema = z.object({
  unit: z.enum(["fahrenheit", "celsius"]),
  savedCities: z.array(WeatherLocationSchema).max(8).default([]),
});

export type GeocodingResponse = z.infer<typeof GeocodingResponseSchema>;
export type ForecastResponse = z.infer<typeof ForecastResponseSchema>;
export type AirQualityResponse = z.infer<typeof AirQualityResponseSchema>;

import type { AirQualityResponse, ForecastResponse } from "@/features/weather/schemas";
import { formatDayLabel, formatHourLabel, formatTemperature, formatTime, formatWind, formatWindDirection } from "@/features/weather/lib/weather-formatters";
import { getWeatherInfo } from "@/features/weather/lib/weather-codes";
import type { TemperatureUnit, WeatherDetail, WeatherLocation, WeatherReport, WindSpeedUnit } from "@/features/weather/types";

function pickArrayValue(values: Array<number | null> | undefined, index: number): number | undefined {
  const value = values?.[index];
  return value === null || value === undefined ? undefined : value;
}

export function mapWeatherReport(
  location: WeatherLocation,
  forecast: ForecastResponse,
  options: { unit: TemperatureUnit; windSpeedUnit: WindSpeedUnit; airQuality?: AirQualityResponse },
): WeatherReport {
  const currentInfo = getWeatherInfo(forecast.current.weather_code, forecast.current.is_day === 1);
  const currentHourKey = forecast.current.time.slice(0, 13);
  const firstHourIndex = Math.max(
    0,
    forecast.hourly.time.findIndex((time) => time.slice(0, 13) >= currentHourKey),
  );

  const hourly = forecast.hourly.time.slice(firstHourIndex, firstHourIndex + 24).map((time, offset) => {
    const index = firstHourIndex + offset;
    const weather = getWeatherInfo(forecast.hourly.weather_code[index] ?? 0, forecast.hourly.is_day[index] === 1);
    return {
      timestamp: time,
      label: formatHourLabel(time, offset === 0),
      temperature: Math.round(forecast.hourly.temperature_2m[index] ?? 0),
      weatherCode: forecast.hourly.weather_code[index] ?? 0,
      condition: weather.label,
      conditionKey: weather.key,
      precipitationProbability: Math.round(forecast.hourly.precipitation_probability?.[index] ?? 0),
      isDay: forecast.hourly.is_day[index] === 1,
    };
  });

  const daily = forecast.daily.time.slice(0, 10).map((date, index) => {
    const weather = getWeatherInfo(forecast.daily.weather_code[index] ?? 0, true);
    return {
      date,
      label: formatDayLabel(date, index === 0),
      weatherCode: forecast.daily.weather_code[index] ?? 0,
      condition: weather.label,
      conditionKey: weather.key,
      low: Math.round(forecast.daily.temperature_2m_min[index] ?? 0),
      high: Math.round(forecast.daily.temperature_2m_max[index] ?? 0),
      precipitationProbability: Math.round(forecast.daily.precipitation_probability_max?.[index] ?? 0),
      sunrise: forecast.daily.sunrise[index] ?? "",
      sunset: forecast.daily.sunset[index] ?? "",
      daylightDurationSeconds: Math.round(forecast.daily.daylight_duration[index] ?? 0),
    };
  });

  const details: WeatherDetail[] = [
    {
      label: "Feels Like",
      value: formatTemperature(forecast.current.apparent_temperature, options.unit),
      helper: "Apparent temperature",
    },
    {
      label: "Humidity",
      value: `${Math.round(forecast.current.relative_humidity_2m)}%`,
      helper: "Relative humidity",
    },
    {
      label: "Wind",
      value: formatWind(forecast.current.wind_speed_10m, options.windSpeedUnit),
      helper: formatWindDirection(forecast.current.wind_direction_10m),
    },
    {
      label: "UV Index",
      value: `${Math.round(forecast.daily.uv_index_max?.[0] ?? 0)}`,
      helper: "Daily maximum",
    },
    {
      label: "Sunrise",
      value: formatTime(forecast.daily.sunrise[0] ?? ""),
      helper: forecast.timezone_abbreviation ?? forecast.timezone,
    },
    {
      label: "Sunset",
      value: formatTime(forecast.daily.sunset[0] ?? ""),
      helper: `Daylight ${Math.round((forecast.daily.daylight_duration[0] ?? 0) / 60 / 60 * 10) / 10}h`,
    },
  ];

  const airQuality = options.airQuality?.hourly
    ? {
      usAqi: pickArrayValue(options.airQuality.hourly.us_aqi, 0),
      pm25: pickArrayValue(options.airQuality.hourly.pm2_5, 0),
      pm10: pickArrayValue(options.airQuality.hourly.pm10, 0),
      ozone: pickArrayValue(options.airQuality.hourly.ozone, 0),
    }
    : undefined;

  return {
    location,
    timezone: forecast.timezone,
    timezoneAbbreviation: forecast.timezone_abbreviation,
    unit: options.unit,
    windSpeedUnit: options.windSpeedUnit,
    current: {
      temperature: Math.round(forecast.current.temperature_2m),
      apparentTemperature: Math.round(forecast.current.apparent_temperature),
      weatherCode: forecast.current.weather_code,
      condition: currentInfo.label,
      conditionKey: currentInfo.key,
      isDay: forecast.current.is_day === 1,
      high: Math.round(forecast.daily.temperature_2m_max[0] ?? 0),
      low: Math.round(forecast.daily.temperature_2m_min[0] ?? 0),
      humidity: Math.round(forecast.current.relative_humidity_2m),
      windSpeed: Math.round(forecast.current.wind_speed_10m),
      windDirection: Math.round(forecast.current.wind_direction_10m),
      uvIndex: Math.round(forecast.daily.uv_index_max?.[0] ?? 0),
      updatedAt: forecast.current.time,
    },
    hourly,
    daily,
    details,
    airQuality,
  };
}


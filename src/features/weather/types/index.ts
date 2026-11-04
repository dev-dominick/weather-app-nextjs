export type TemperatureUnit = "fahrenheit" | "celsius";
export type WindSpeedUnit = "mph" | "kmh";

export type WeatherLocation = {
  id: number;
  name: string;
  region?: string;
  country?: string;
  countryCode?: string;
  timezone?: string;
  latitude: number;
  longitude: number;
};

export type WeatherConditionKey =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm"
  | "unknown";

export type CurrentWeather = {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  condition: string;
  conditionKey: WeatherConditionKey;
  isDay: boolean;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  updatedAt: string;
};

export type HourlyForecast = {
  timestamp: string;
  label: string;
  temperature: number;
  weatherCode: number;
  condition: string;
  conditionKey: WeatherConditionKey;
  precipitationProbability: number;
  isDay: boolean;
};

export type DailyForecast = {
  date: string;
  label: string;
  weatherCode: number;
  condition: string;
  conditionKey: WeatherConditionKey;
  low: number;
  high: number;
  precipitationProbability: number;
  sunrise: string;
  sunset: string;
  daylightDurationSeconds: number;
};

export type WeatherDetail = {
  label: string;
  value: string;
  helper: string;
};

export type AirQuality = {
  usAqi?: number;
  pm25?: number;
  pm10?: number;
  ozone?: number;
};

export type WeatherReport = {
  location: WeatherLocation;
  timezone: string;
  timezoneAbbreviation?: string;
  unit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  details: WeatherDetail[];
  airQuality?: AirQuality;
};

export type UserWeatherSettings = {
  unit: TemperatureUnit;
  savedCities: WeatherLocation[];
};

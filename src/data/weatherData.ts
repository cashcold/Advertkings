export interface CityWeatherData {
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  region: string;
  lat: number;
  lon: number;
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  tempMaxC: number;
  tempMinC: number;
  condition: string;
  conditionIcon: string;
  humidity: number;
  windSpeedKmh: number;
  uvIndex: number;
  airQuality: string;
  weatherCode: number;
  isDay: boolean;
  forecastSummary: string;
}

export interface UserLocationInfo {
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  timezone: string;
  isAutoDetected: boolean;
}

// Preset worldwide database of countries & major cities
export const WORLD_CITIES_WEATHER_DATABASE: CityWeatherData[] = [
  // North America
  {
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    region: 'North America',
    lat: 40.7128,
    lon: -74.006,
    tempC: 22,
    tempF: 72,
    feelsLikeC: 22,
    feelsLikeF: 72,
    tempMaxC: 25,
    tempMinC: 17,
    condition: 'Sunny & Clear',
    conditionIcon: '☀️',
    humidity: 55,
    windSpeedKmh: 14,
    uvIndex: 6,
    airQuality: 'Good (AQI 32)',
    weatherCode: 0,
    isDay: true,
    forecastSummary: 'Warm sunny afternoon with clear skies into the evening.',
  },
  {
    city: 'Los Angeles',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    region: 'North America',
    lat: 34.0522,
    lon: -118.2437,
    tempC: 26,
    tempF: 79,
    feelsLikeC: 26,
    feelsLikeF: 79,
    tempMaxC: 28,
    tempMinC: 18,
    condition: 'Pleasant Sunshine',
    conditionIcon: '☀️',
    humidity: 48,
    windSpeedKmh: 12,
    uvIndex: 8,
    airQuality: 'Moderate (AQI 54)',
    weatherCode: 0,
    isDay: true,
    forecastSummary: 'Mild coastal breeze with sunny blue skies all day.',
  },
  {
    city: 'Toronto',
    country: 'Canada',
    countryCode: 'CA',
    flag: '🇨🇦',
    region: 'North America',
    lat: 43.6532,
    lon: -79.3832,
    tempC: 20,
    tempF: 68,
    feelsLikeC: 19,
    feelsLikeF: 66,
    tempMaxC: 23,
    tempMinC: 14,
    condition: 'Partly Cloudy',
    conditionIcon: '⛅',
    humidity: 58,
    windSpeedKmh: 18,
    uvIndex: 5,
    airQuality: 'Good (AQI 28)',
    weatherCode: 2,
    isDay: true,
    forecastSummary: 'Scattered clouds with comfortable temperate winds.',
  },

  // Europe
  {
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    region: 'Europe',
    lat: 51.5074,
    lon: -0.1278,
    tempC: 18,
    tempF: 64,
    feelsLikeC: 18,
    feelsLikeF: 64,
    tempMaxC: 20,
    tempMinC: 13,
    condition: 'Mild & Breezy',
    conditionIcon: '🌤️',
    humidity: 62,
    windSpeedKmh: 16,
    uvIndex: 4,
    airQuality: 'Good (AQI 29)',
    weatherCode: 1,
    isDay: true,
    forecastSummary: 'Comfortable seasonal breeze with sunny intervals.',
  },
  {
    city: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    flag: '🇩🇪',
    region: 'Europe',
    lat: 52.52,
    lon: 13.405,
    tempC: 19,
    tempF: 66,
    feelsLikeC: 19,
    feelsLikeF: 66,
    tempMaxC: 22,
    tempMinC: 13,
    condition: 'Passing Clouds',
    conditionIcon: '⛅',
    humidity: 59,
    windSpeedKmh: 15,
    uvIndex: 5,
    airQuality: 'Good (AQI 25)',
    weatherCode: 2,
    isDay: true,
    forecastSummary: 'Dry and pleasant with occasional bright sun breaks.',
  },
  {
    city: 'Paris',
    country: 'France',
    countryCode: 'FR',
    flag: '🇫🇷',
    region: 'Europe',
    lat: 48.8566,
    lon: 2.3522,
    tempC: 21,
    tempF: 70,
    feelsLikeC: 21,
    feelsLikeF: 70,
    tempMaxC: 24,
    tempMinC: 14,
    condition: 'Fair Skies',
    conditionIcon: '🌤️',
    humidity: 54,
    windSpeedKmh: 13,
    uvIndex: 6,
    airQuality: 'Good (AQI 35)',
    weatherCode: 1,
    isDay: true,
    forecastSummary: 'Warm afternoon light with gentle northern airflow.',
  },
  {
    city: 'Amsterdam',
    country: 'Netherlands',
    countryCode: 'NL',
    flag: '🇳🇱',
    region: 'Europe',
    lat: 52.3676,
    lon: 4.9041,
    tempC: 17,
    tempF: 63,
    feelsLikeC: 16,
    feelsLikeF: 61,
    tempMaxC: 19,
    tempMinC: 12,
    condition: 'Breezy & Fresh',
    conditionIcon: '🌬️',
    humidity: 68,
    windSpeedKmh: 22,
    uvIndex: 4,
    airQuality: 'Good (AQI 22)',
    weatherCode: 2,
    isDay: true,
    forecastSummary: 'Crisp canal breeze with variable cloud cover.',
  },
  {
    city: 'Madrid',
    country: 'Spain',
    countryCode: 'ES',
    flag: '🇪🇸',
    region: 'Europe',
    lat: 40.4168,
    lon: -3.7038,
    tempC: 28,
    tempF: 82,
    feelsLikeC: 28,
    feelsLikeF: 82,
    tempMaxC: 31,
    tempMinC: 18,
    condition: 'Warm Sunshine',
    conditionIcon: '☀️',
    humidity: 38,
    windSpeedKmh: 11,
    uvIndex: 7,
    airQuality: 'Good (AQI 38)',
    weatherCode: 0,
    isDay: true,
    forecastSummary: 'Golden Mediterranean sun with clear dry evening.',
  },
  {
    city: 'Rome',
    country: 'Italy',
    countryCode: 'IT',
    flag: '🇮🇹',
    region: 'Europe',
    lat: 41.9028,
    lon: 12.4964,
    tempC: 26,
    tempF: 79,
    feelsLikeC: 27,
    feelsLikeF: 80,
    tempMaxC: 29,
    tempMinC: 17,
    condition: 'Sunny & Warm',
    conditionIcon: '☀️',
    humidity: 49,
    windSpeedKmh: 10,
    uvIndex: 7,
    airQuality: 'Good (AQI 41)',
    weatherCode: 0,
    isDay: true,
    forecastSummary: 'Bright sunny skies across the historic center.',
  },

  // Africa
  {
    city: 'Accra',
    country: 'Ghana',
    countryCode: 'GH',
    flag: '🇬🇭',
    region: 'Africa',
    lat: 5.6037,
    lon: -0.187,
    tempC: 29,
    tempF: 84,
    feelsLikeC: 33,
    feelsLikeF: 91,
    tempMaxC: 31,
    tempMinC: 25,
    condition: 'Warm & Tropical',
    conditionIcon: '🌤️',
    humidity: 78,
    windSpeedKmh: 14,
    uvIndex: 9,
    airQuality: 'Moderate (AQI 62)',
    weatherCode: 1,
    isDay: true,
    forecastSummary: 'Warm tropical ocean breeze with gentle coastal sunshine.',
  },
  {
    city: 'Lagos',
    country: 'Nigeria',
    countryCode: 'NG',
    flag: '🇳🇬',
    region: 'Africa',
    lat: 6.5244,
    lon: 3.3792,
    tempC: 30,
    tempF: 86,
    feelsLikeC: 35,
    feelsLikeF: 95,
    tempMaxC: 32,
    tempMinC: 26,
    condition: 'Humid Sunshine',
    conditionIcon: '⛅',
    humidity: 82,
    windSpeedKmh: 12,
    uvIndex: 9,
    airQuality: 'Moderate (AQI 70)',
    weatherCode: 2,
    isDay: true,
    forecastSummary: 'Warm tropical climate with coastal clouds and sun.',
  },
  {
    city: 'Johannesburg',
    country: 'South Africa',
    countryCode: 'ZA',
    flag: '🇿🇦',
    region: 'Africa',
    lat: -26.2041,
    lon: 28.0473,
    tempC: 23,
    tempF: 73,
    feelsLikeC: 23,
    feelsLikeF: 73,
    tempMaxC: 26,
    tempMinC: 13,
    condition: 'Highveld Sun',
    conditionIcon: '☀️',
    humidity: 42,
    windSpeedKmh: 15,
    uvIndex: 7,
    airQuality: 'Good (AQI 36)',
    weatherCode: 0,
    isDay: true,
    forecastSummary: 'Crisp clear plateau air with radiant sunshine.',
  },
  {
    city: 'Nairobi',
    country: 'Kenya',
    countryCode: 'KE',
    flag: '🇰🇪',
    region: 'Africa',
    lat: -1.2921,
    lon: 36.8219,
    tempC: 24,
    tempF: 75,
    feelsLikeC: 24,
    feelsLikeF: 75,
    tempMaxC: 26,
    tempMinC: 15,
    condition: 'Pleasant & Mild',
    conditionIcon: '🌤️',
    humidity: 58,
    windSpeedKmh: 11,
    uvIndex: 8,
    airQuality: 'Good (AQI 30)',
    weatherCode: 1,
    isDay: true,
    forecastSummary: 'High altitude mountain breeze with sunny afternoon.',
  },
  {
    city: 'Cairo',
    country: 'Egypt',
    countryCode: 'EG',
    flag: '🇪🇬',
    region: 'Africa',
    lat: 30.0444,
    lon: 31.2357,
    tempC: 33,
    tempF: 91,
    feelsLikeC: 34,
    feelsLikeF: 93,
    tempMaxC: 36,
    tempMinC: 24,
    condition: 'Sunny & Dry',
    conditionIcon: '☀️',
    humidity: 34,
    windSpeedKmh: 16,
    uvIndex: 8,
    airQuality: 'Moderate (AQI 68)',
    weatherCode: 0,
    isDay: true,
    forecastSummary: 'Clear Nile valley skies with warm desert winds.',
  },

  // Middle East & Asia
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    region: 'Middle East',
    lat: 25.2048,
    lon: 55.2708,
    tempC: 38,
    tempF: 100,
    feelsLikeC: 44,
    feelsLikeF: 111,
    tempMaxC: 41,
    tempMinC: 31,
    condition: 'Hot & Sunny',
    conditionIcon: '☀️',
    humidity: 45,
    windSpeedKmh: 16,
    uvIndex: 10,
    airQuality: 'Moderate (AQI 58)',
    weatherCode: 0,
    isDay: true,
    forecastSummary: 'Intense Gulf sunshine with warm coastal breezes.',
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    flag: '🇸🇬',
    region: 'Asia',
    lat: 1.3521,
    lon: 103.8198,
    tempC: 31,
    tempF: 88,
    feelsLikeC: 37,
    feelsLikeF: 99,
    tempMaxC: 32,
    tempMinC: 26,
    condition: 'Scattered Showers',
    conditionIcon: '🌦️',
    humidity: 84,
    windSpeedKmh: 10,
    uvIndex: 8,
    airQuality: 'Good (AQI 32)',
    weatherCode: 61,
    isDay: true,
    forecastSummary: 'Equatorial warmth with brief tropical shower passings.',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    region: 'Asia',
    lat: 35.6762,
    lon: 139.6503,
    tempC: 26,
    tempF: 79,
    feelsLikeC: 27,
    feelsLikeF: 81,
    tempMaxC: 28,
    tempMinC: 21,
    condition: 'Clear Sky',
    conditionIcon: '☀️',
    humidity: 64,
    windSpeedKmh: 11,
    uvIndex: 6,
    airQuality: 'Good (AQI 26)',
    weatherCode: 0,
    isDay: true,
    forecastSummary: 'Crisp Pacific breeze with bright sunny intervals.',
  },
  {
    city: 'Mumbai',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    region: 'Asia',
    lat: 19.076,
    lon: 72.8777,
    tempC: 31,
    tempF: 88,
    feelsLikeC: 36,
    feelsLikeF: 97,
    tempMaxC: 33,
    tempMinC: 27,
    condition: 'Coastal Humid',
    conditionIcon: '⛅',
    humidity: 79,
    windSpeedKmh: 14,
    uvIndex: 8,
    airQuality: 'Moderate (AQI 75)',
    weatherCode: 2,
    isDay: true,
    forecastSummary: 'Arabian Sea coastal breeze with humid bright sky.',
  },
  {
    city: 'Bangkok',
    country: 'Thailand',
    countryCode: 'TH',
    flag: '🇹🇭',
    region: 'Asia',
    lat: 13.7563,
    lon: 100.5018,
    tempC: 32,
    tempF: 90,
    feelsLikeC: 38,
    feelsLikeF: 100,
    tempMaxC: 34,
    tempMinC: 27,
    condition: 'Tropical Haze',
    conditionIcon: '🌤️',
    humidity: 76,
    windSpeedKmh: 9,
    uvIndex: 9,
    airQuality: 'Moderate (AQI 66)',
    weatherCode: 1,
    isDay: true,
    forecastSummary: 'Warm tropical sunshine with light monsoon clouds.',
  },
  {
    city: 'Manila',
    country: 'Philippines',
    countryCode: 'PH',
    flag: '🇵🇭',
    region: 'Asia',
    lat: 14.5995,
    lon: 120.9842,
    tempC: 31,
    tempF: 88,
    feelsLikeC: 37,
    feelsLikeF: 99,
    tempMaxC: 33,
    tempMinC: 26,
    condition: 'Passing Clouds',
    conditionIcon: '⛅',
    humidity: 81,
    windSpeedKmh: 12,
    uvIndex: 8,
    airQuality: 'Moderate (AQI 55)',
    weatherCode: 2,
    isDay: true,
    forecastSummary: 'Warm island sea breezes with afternoon cloud cover.',
  },

  // Oceania & South America
  {
    city: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    region: 'Oceania',
    lat: -33.8688,
    lon: 151.2093,
    tempC: 19,
    tempF: 66,
    feelsLikeC: 19,
    feelsLikeF: 66,
    tempMaxC: 22,
    tempMinC: 13,
    condition: 'Sunny Coastal',
    conditionIcon: '☀️',
    humidity: 56,
    windSpeedKmh: 18,
    uvIndex: 6,
    airQuality: 'Good (AQI 22)',
    weatherCode: 0,
    isDay: true,
    forecastSummary: 'Clear coastal sky with breezy harbor conditions.',
  },
  {
    city: 'Melbourne',
    country: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    region: 'Oceania',
    lat: -37.8136,
    lon: 144.9631,
    tempC: 17,
    tempF: 63,
    feelsLikeC: 16,
    feelsLikeF: 61,
    tempMaxC: 19,
    tempMinC: 11,
    condition: 'Partly Cloudy',
    conditionIcon: '⛅',
    humidity: 61,
    windSpeedKmh: 20,
    uvIndex: 5,
    airQuality: 'Good (AQI 20)',
    weatherCode: 2,
    isDay: true,
    forecastSummary: 'Crisp southern ocean air with moving cloud formations.',
  },
  {
    city: 'São Paulo',
    country: 'Brazil',
    countryCode: 'BR',
    flag: '🇧🇷',
    region: 'South America',
    lat: -23.5505,
    lon: -46.6333,
    tempC: 24,
    tempF: 75,
    feelsLikeC: 24,
    feelsLikeF: 75,
    tempMaxC: 27,
    tempMinC: 17,
    condition: 'Pleasant & Clear',
    conditionIcon: '🌤️',
    humidity: 59,
    windSpeedKmh: 12,
    uvIndex: 7,
    airQuality: 'Moderate (AQI 45)',
    weatherCode: 1,
    isDay: true,
    forecastSummary: 'Mild plateau sunshine with dry cool evening.',
  },
];

// Timezone to default Country & City mapping
export const TIMEZONE_MAPPING: Record<string, { city: string; country: string; countryCode: string; flag: string }> = {
  // Africa
  'Africa/Accra': { city: 'Accra', country: 'Ghana', countryCode: 'GH', flag: '🇬🇭' },
  'Africa/Lagos': { city: 'Lagos', country: 'Nigeria', countryCode: 'NG', flag: '🇳🇬' },
  'Africa/Johannesburg': { city: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', flag: '🇿🇦' },
  'Africa/Nairobi': { city: 'Nairobi', country: 'Kenya', countryCode: 'KE', flag: '🇰🇪' },
  'Africa/Cairo': { city: 'Cairo', country: 'Egypt', countryCode: 'EG', flag: '🇪🇬' },
  'Africa/Casablanca': { city: 'Casablanca', country: 'Morocco', countryCode: 'MA', flag: '🇲🇦' },
  'Africa/Addis_Ababa': { city: 'Addis Ababa', country: 'Ethiopia', countryCode: 'ET', flag: '🇪🇹' },

  // Americas
  'America/New_York': { city: 'New York', country: 'United States', countryCode: 'US', flag: '🇺🇸' },
  'America/Detroit': { city: 'Detroit', country: 'United States', countryCode: 'US', flag: '🇺🇸' },
  'America/Chicago': { city: 'Chicago', country: 'United States', countryCode: 'US', flag: '🇺🇸' },
  'America/Los_Angeles': { city: 'Los Angeles', country: 'United States', countryCode: 'US', flag: '🇺🇸' },
  'America/Phoenix': { city: 'Phoenix', country: 'United States', countryCode: 'US', flag: '🇺🇸' },
  'America/Denver': { city: 'Denver', country: 'United States', countryCode: 'US', flag: '🇺🇸' },
  'America/Toronto': { city: 'Toronto', country: 'Canada', countryCode: 'CA', flag: '🇨🇦' },
  'America/Vancouver': { city: 'Vancouver', country: 'Canada', countryCode: 'CA', flag: '🇨🇦' },
  'America/Sao_Paulo': { city: 'São Paulo', country: 'Brazil', countryCode: 'BR', flag: '🇧🇷' },
  'America/Buenos_Aires': { city: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', flag: '🇦🇷' },
  'America/Bogota': { city: 'Bogota', country: 'Colombia', countryCode: 'CO', flag: '🇨🇴' },
  'America/Mexico_City': { city: 'Mexico City', country: 'Mexico', countryCode: 'MX', flag: '🇲🇽' },

  // Europe
  'Europe/London': { city: 'London', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧' },
  'Europe/Berlin': { city: 'Berlin', country: 'Germany', countryCode: 'DE', flag: '🇩🇪' },
  'Europe/Paris': { city: 'Paris', country: 'France', countryCode: 'FR', flag: '🇫🇷' },
  'Europe/Rome': { city: 'Rome', country: 'Italy', countryCode: 'IT', flag: '🇮🇹' },
  'Europe/Madrid': { city: 'Madrid', country: 'Spain', countryCode: 'ES', flag: '🇪🇸' },
  'Europe/Amsterdam': { city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱' },
  'Europe/Brussels': { city: 'Brussels', country: 'Belgium', countryCode: 'BE', flag: '🇧🇪' },
  'Europe/Zurich': { city: 'Zurich', country: 'Switzerland', countryCode: 'CH', flag: '🇨🇭' },
  'Europe/Stockholm': { city: 'Stockholm', country: 'Sweden', countryCode: 'SE', flag: '🇸🇪' },
  'Europe/Oslo': { city: 'Oslo', country: 'Norway', countryCode: 'NO', flag: '🇳🇴' },
  'Europe/Warsaw': { city: 'Warsaw', country: 'Poland', countryCode: 'PL', flag: '🇵🇱' },
  'Europe/Athens': { city: 'Athens', country: 'Greece', countryCode: 'GR', flag: '🇬🇷' },
  'Europe/Istanbul': { city: 'Istanbul', country: 'Turkey', countryCode: 'TR', flag: '🇹🇷' },

  // Asia & Middle East
  'Asia/Dubai': { city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', flag: '🇦🇪' },
  'Asia/Riyadh': { city: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA', flag: '🇸🇦' },
  'Asia/Qatar': { city: 'Doha', country: 'Qatar', countryCode: 'QA', flag: '🇶🇦' },
  'Asia/Singapore': { city: 'Singapore', country: 'Singapore', countryCode: 'SG', flag: '🇸🇬' },
  'Asia/Tokyo': { city: 'Tokyo', country: 'Japan', countryCode: 'JP', flag: '🇯🇵' },
  'Asia/Kolkata': { city: 'Mumbai', country: 'India', countryCode: 'IN', flag: '🇮🇳' },
  'Asia/Bangkok': { city: 'Bangkok', country: 'Thailand', countryCode: 'TH', flag: '🇹🇭' },
  'Asia/Manila': { city: 'Manila', country: 'Philippines', countryCode: 'PH', flag: '🇵🇭' },
  'Asia/Jakarta': { city: 'Jakarta', country: 'Indonesia', countryCode: 'ID', flag: '🇮🇩' },
  'Asia/Hong_Kong': { city: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', flag: '🇭🇰' },
  'Asia/Seoul': { city: 'Seoul', country: 'South Korea', countryCode: 'KR', flag: '🇰🇷' },
  'Asia/Kuala_Lumpur': { city: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', flag: '🇲🇾' },

  // Oceania
  'Australia/Sydney': { city: 'Sydney', country: 'Australia', countryCode: 'AU', flag: '🇦🇺' },
  'Australia/Melbourne': { city: 'Melbourne', country: 'Australia', countryCode: 'AU', flag: '🇦🇺' },
  'Pacific/Auckland': { city: 'Auckland', country: 'New Zealand', countryCode: 'NZ', flag: '🇳🇿' },
};

/**
 * Weather condition helper based on WMO code
 */
export const getConditionFromWmoCode = (code: number, isDay = true): { condition: string; icon: string } => {
  switch (code) {
    case 0:
      return { condition: isDay ? 'Sunny & Clear' : 'Clear Night', icon: isDay ? '☀️' : '🌙' };
    case 1:
      return { condition: 'Mainly Clear', icon: isDay ? '🌤️' : '✨' };
    case 2:
      return { condition: 'Partly Cloudy', icon: '⛅' };
    case 3:
      return { condition: 'Overcast Skies', icon: '☁️' };
    case 45:
    case 48:
      return { condition: 'Foggy & Misty', icon: '🌫️' };
    case 51:
    case 53:
    case 55:
      return { condition: 'Light Drizzle', icon: '🌦️' };
    case 61:
    case 63:
    case 65:
      return { condition: 'Rain Showers', icon: '🌧️' };
    case 71:
    case 73:
    case 75:
      return { condition: 'Snow Showers', icon: '🌨️' };
    case 80:
    case 81:
    case 82:
      return { condition: 'Heavy Rain', icon: '⛈️' };
    case 95:
    case 96:
    case 99:
      return { condition: 'Thunderstorm', icon: '🌩️' };
    default:
      return { condition: 'Fair Weather', icon: '🌤️' };
  }
};

/**
 * Detects user's country and city from browser environment, timezone and saved preferences
 */
export const detectUserLocation = (): UserLocationInfo => {
  // Check local storage for manually saved preference
  try {
    const saved = localStorage.getItem('adkings_user_weather_pref');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.country && parsed.city) {
        return {
          city: parsed.city,
          country: parsed.country,
          countryCode: parsed.countryCode || 'US',
          flag: parsed.flag || '🌍',
          timezone: parsed.timezone || 'auto',
          isAutoDetected: false,
        };
      }
    }
  } catch (e) {
    // Ignore storage issues
  }

  // Detect via browser timezone
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_MAPPING[tz]) {
      const info = TIMEZONE_MAPPING[tz];
      return {
        city: info.city,
        country: info.country,
        countryCode: info.countryCode,
        flag: info.flag,
        timezone: tz,
        isAutoDetected: true,
      };
    }

    // Partial prefix matching for timezones like "America/...", "Europe/..."
    if (tz) {
      const matchingKey = Object.keys(TIMEZONE_MAPPING).find((key) => {
        const [, keyCity] = key.split('/');
        const [, userCity] = tz.split('/');
        return keyCity && userCity && (keyCity.includes(userCity) || userCity.includes(keyCity));
      });
      if (matchingKey) {
        const info = TIMEZONE_MAPPING[matchingKey];
        return {
          city: info.city,
          country: info.country,
          countryCode: info.countryCode,
          flag: info.flag,
          timezone: tz,
          isAutoDetected: true,
        };
      }
    }
  } catch (e) {
    // Fallback to default
  }

  // Default fallback
  return {
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    timezone: 'America/New_York',
    isAutoDetected: true,
  };
};

/**
 * Fetches real live weather data for a city using Open-Meteo or fallback database
 */
export const fetchLiveWeatherData = async (cityData: CityWeatherData): Promise<CityWeatherData> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityData.lat}&longitude=${cityData.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.current) {
        const tempC = Math.round(data.current.temperature_2m);
        const tempF = Math.round((tempC * 9) / 5 + 32);
        const feelsLikeC = Math.round(data.current.apparent_temperature);
        const feelsLikeF = Math.round((feelsLikeC * 9) / 5 + 32);
        const isDay = data.current.is_day === 1;
        const code = data.current.weather_code ?? 0;
        const { condition, icon } = getConditionFromWmoCode(code, isDay);

        const tempMaxC = data.daily?.temperature_2m_max?.[0]
          ? Math.round(data.daily.temperature_2m_max[0])
          : tempC + 3;
        const tempMinC = data.daily?.temperature_2m_min?.[0]
          ? Math.round(data.daily.temperature_2m_min[0])
          : tempC - 4;

        return {
          ...cityData,
          tempC,
          tempF,
          feelsLikeC,
          feelsLikeF,
          tempMaxC,
          tempMinC,
          condition,
          conditionIcon: icon,
          humidity: Math.round(data.current.relative_humidity_2m ?? cityData.humidity),
          windSpeedKmh: Math.round(data.current.wind_speed_10m ?? cityData.windSpeedKmh),
          weatherCode: code,
          isDay,
        };
      }
    }
  } catch (err) {
    // Graceful fallback to rich local city data
  }

  return cityData;
};

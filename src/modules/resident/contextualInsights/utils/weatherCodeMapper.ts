import type { WeatherConditionCode } from '../data/residentContextualInsights.types';

export function mapWmoCodeToCondition(wmoCode: number): WeatherConditionCode {
  if (wmoCode === 0) return 'clear';
  if (wmoCode >= 1 && wmoCode <= 2) return 'partlyCloudy';
  if (wmoCode === 3) return 'cloudy';
  if (wmoCode === 45 || wmoCode === 48) return 'fog';
  if (wmoCode >= 51 && wmoCode <= 55) return 'drizzle';
  if (wmoCode >= 61 && wmoCode <= 65) return 'rain';
  if (wmoCode >= 80 && wmoCode <= 82) return 'heavyRain';
  if (wmoCode >= 95) return 'thunderstorm';
  return 'unknown';
}

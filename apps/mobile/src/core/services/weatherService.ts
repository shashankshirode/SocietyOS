import Ionicons from '@expo/vector-icons/Ionicons';
export interface WeatherInfo {
    temp: number;
    suggestion: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
}
interface CacheEntry extends WeatherInfo {
    lastFetched: number;
}
const CACHE_DURATION_MS = 2 * 60 * 60 * 1000;
const AREA_COORDINATES: Record<string, {
    lat: number;
    lon: number;
}> = {
    tathawade: { lat: 18.6186, lon: 73.7516 },
    nashik: { lat: 19.9975, lon: 73.7898 },
};
const DEFAULT_COORDINATES = { lat: 19.9975, lon: 73.7898 };
const weatherCache: Record<string, CacheEntry> = {};
export async function fetchWeatherForArea(area: string): Promise<WeatherInfo> {
    const normalizedArea = area.toLowerCase().trim();
    const coords = AREA_COORDINATES[normalizedArea] ?? DEFAULT_COORDINATES;
    const cached = weatherCache[normalizedArea];
    if (cached && Date.now() - cached.lastFetched < CACHE_DURATION_MS) {
        return {
            temp: cached.temp,
            suggestion: cached.suggestion,
            icon: cached.icon,
            iconColor: cached.iconColor,
        };
    }
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Weather API request failed');
        }
        const data = await response.json();
        const temp = Math.round(data?.current_weather?.temperature ?? 25);
        const code = data?.current_weather?.weathercode ?? 0;
        let suggestion = '';
        let icon: keyof typeof Ionicons.glyphMap = 'sunny-outline';
        let iconColor = '#FDE047';
        if (code === 0) {
            suggestion = `Clear skies & ${temp}°C in ${area}. Perfect weather for outdoors!`;
            icon = 'sunny-outline';
            iconColor = '#FDE047';
        }
        else if (code >= 1 && code <= 3) {
            suggestion = `Partly cloudy & ${temp}°C in ${area}. Nice day to step out.`;
            icon = 'cloudy-outline';
            iconColor = '#CBD5E1';
        }
        else if (code === 45 || code === 48) {
            suggestion = `Foggy & ${temp}°C in ${area}. Drive carefully with fog lights.`;
            icon = 'eye-off-outline';
            iconColor = '#94A3B8';
        }
        else if (code >= 51 && code <= 55) {
            suggestion = `Light drizzle & ${temp}°C in ${area}. Carry an umbrella today.`;
            icon = 'rainy-outline';
            iconColor = '#93C5FD';
        }
        else if (code >= 61 && code <= 65) {
            suggestion = `Rainy & ${temp}°C in ${area}. Better to use a car or umbrella.`;
            icon = 'rainy-outline';
            iconColor = '#60A5FA';
        }
        else if (code >= 80 && code <= 82) {
            suggestion = `Showers & ${temp}°C in ${area}. Keep an umbrella handy.`;
            icon = 'rainy-outline';
            iconColor = '#3B82F6';
        }
        else if (code >= 95) {
            suggestion = `Thunderstorms & ${temp}°C in ${area}. Stay safe indoors.`;
            icon = 'thunderstorm-outline';
            iconColor = '#EF4444';
        }
        else {
            suggestion = `Current weather in ${area}: ${temp}°C. Have a great day!`;
            icon = 'partly-sunny-outline';
            iconColor = '#FDE047';
        }
        const result: WeatherInfo = { temp, suggestion, icon, iconColor };
        weatherCache[normalizedArea] = {
            ...result,
            lastFetched: Date.now(),
        };
        return result;
    }
    catch {
        const temp = 24;
        const result: WeatherInfo = {
            temp,
            suggestion: `Weather in ${area} is around ${temp}°C. Carry an umbrella just in case.`,
            icon: 'partly-sunny-outline',
            iconColor: '#FDE047',
        };
        return result;
    }
}

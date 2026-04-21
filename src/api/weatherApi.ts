import type { GeoResponse, ForecastResponse, AirPollutionResponse } from "./types";

const API_KEY = '4af81f1d5c223163c511122479330934';

export const geocodingApi = async (country: string): Promise<GeoResponse[]> => {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(country)}&limit=5&appid=${API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch geocoding data');
    return response.json();
}

export const forecastApi = async (lat: number, lon: number): Promise<ForecastResponse> => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch forecast data');
    return response.json();
}

export const airPollutionApi = async (lat: number, lon: number): Promise<AirPollutionResponse> => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch air pollution data');
    return response.json();
}

export const getIconUrl = (iconCode: string, size: '2x' | '4x' = '4x') => {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}
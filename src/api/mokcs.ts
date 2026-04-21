import type {
  AirPollutionResponse,
  ForecastItem,
  ForecastResponse,
} from './types';

const generatedForecast: ForecastItem[] = Array.from({ length: 38 }, (_, i) => ({
  dt: 1711836000 + i * 10800,
  main: {
    temp: 20 + Math.random() * 10,
    feels_like: 21,
    temp_min: 19,
    temp_max: 31,
    pressure: 1010,
    humidity: 70,
  },
  weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }],
  wind: { speed: 3, deg: 160 },
  dt_txt: `2024-03-31 ${String(i % 24).padStart(2, '0')}:00:00`,
}));

export const mockForecast: ForecastResponse = {
  list: [
    {
      dt: 1711814400,
      main: {
        temp: 27,
        feels_like: 28,
        temp_min: 25,
        temp_max: 29,
        pressure: 1012,
        humidity: 80,
      },
      weather: [{ id: 500, main: 'Rain', description: 'легкий дождь', icon: '10d' }],
      wind: { speed: 5, deg: 180 },
      dt_txt: '2024-03-30 16:00:00',
    },
    {
      dt: 1711825200,
      main: {
        temp: 28,
        feels_like: 29,
        temp_min: 26,
        temp_max: 30,
        pressure: 1011,
        humidity: 75,
      },
      weather: [{ id: 801, main: 'Clouds', description: 'переменная облачность', icon: '02d' }],
      wind: { speed: 4, deg: 170 },
      dt_txt: '2024-03-30 19:00:00',
    },
    ...generatedForecast,
  ],
  city: {
    name: 'Moscow',
    coord: { lat: 55.7558, lon: 37.6173 },
    country: 'RU',
    population: 12000000,
    timezone: 10800,
    sunrise: 1711765000,
    sunset: 1711812000,
  },
};

export const mockAirPollution: AirPollutionResponse = {
  list: [
    {
      dt: 1605182400,
      main: {
        aqi: 1,
      },
      components: {
        co: 201,
        no: 0.3,
        no2: 0.7,
        o3: 68.6,
        so2: 0.6,
        pm2_5: 0.5,
        pm10: 0.5,
        nh3: 0.12,
      },
    },
  ],
};

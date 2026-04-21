import '@testing-library/jest-dom/vitest';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as weatherApi from './api/weatherApi';

vi.mock('./api/weatherApi', () => ({
  geocodingApi: vi.fn(),
  forecastApi: vi.fn(),
  airPollutionApi: vi.fn(),
  getIconUrl: vi.fn(() => 'https://example.com/icon.png'),
}));

const geocodingApiMock = vi.mocked(weatherApi.geocodingApi);
const forecastApiMock = vi.mocked(weatherApi.forecastApi);
const airPollutionApiMock = vi.mocked(weatherApi.airPollutionApi);

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('Вывод погоды после поиска', async () => {
    geocodingApiMock.mockResolvedValue([
      { name: 'Tomsk', lat: 56.4977, lon: 84.9744, country: 'RU' },
    ]);

    forecastApiMock.mockResolvedValue({
      list: [
        {
          dt: 1711814400,
          main: {
            temp: 12,
            feels_like: 10,
            temp_min: 11,
            temp_max: 13,
            pressure: 1012,
            humidity: 75,
          },
          weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }],
          wind: { speed: 4, deg: 160 },
          dt_txt: '2024-03-30 12:00:00',
        },
      ],
      city: {
        name: 'Tomsk',
        coord: { lat: 56.4977, lon: 84.9744 },
        country: 'RU',
        population: 500000,
        timezone: 25200,
        sunrise: 1711765000,
        sunset: 1711812000,
      },
    });

    airPollutionApiMock.mockResolvedValue({
      list: [
        {
          dt: 1711814400,
          main: { aqi: 2 },
          components: {
            co: 200,
            no: 0.1,
            no2: 3,
            o3: 40,
            so2: 1,
            pm2_5: 7,
            pm10: 11,
            nh3: 0.2,
          },
        },
      ],
    });

    render(<App />);

    await userEvent.type(screen.getByPlaceholderText('Введите город'), 'Tomsk');
    await userEvent.click(screen.getByRole('button', { name: 'Найти' }));

    expect(await screen.findByText('Tomsk, RU')).toBeInTheDocument();
    expect(await screen.findByText('AQI: 2')).toBeInTheDocument();
    expect(forecastApiMock).toHaveBeenCalledWith(56.4977, 84.9744);
    expect(airPollutionApiMock).toHaveBeenCalledWith(56.4977, 84.9744);
  });

  it('Тест ошибки когда город не найден', async () => {
    geocodingApiMock.mockResolvedValue([]);

    render(<App />);

    await userEvent.type(screen.getByPlaceholderText('Введите город'), 'UnknownCity');
    await userEvent.click(screen.getByRole('button', { name: 'Найти' }));

    expect(await screen.findByText('Город не найден')).toBeInTheDocument();
  });
});

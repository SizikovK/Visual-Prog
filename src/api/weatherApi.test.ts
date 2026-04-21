import { describe, it, expect, vi, afterEach } from 'vitest';
import { geocodingApi, forecastApi, airPollutionApi, getIconUrl } from './weatherApi';
import { mockForecast, mockAirPollution } from './mokcs';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Тесты WeatherApi', () => {
  it('тест получения широты и долготы по апи', async () => {
    const geoData = [{ name: 'Moscow', lat: 55.7558, lon: 37.6173, country: 'RU' }];
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: true, json: async () => geoData } as Response);

    const result = await geocodingApi('Moscow');

    expect(result).toEqual(geoData);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain('/geo/1.0/direct?q=Moscow');
  });

  it('Тест апи прогноза погоды', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockForecast,
    } as Response);

    const result = await forecastApi(55.7558, 37.6173);

    expect(result.city.name).toBe('Moscow');
    expect(result.list.length).toBeGreaterThan(0);
  });

  it('Тест апи загрязнения воздуха', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockAirPollution,
    } as Response);

    const result = await airPollutionApi(55.7558, 37.6173);

    expect(result.list[0].main.aqi).toBe(1);
  });

  it('Парсинг Иконок', () => {
    expect(getIconUrl('10d')).toBe('https://openweathermap.org/img/wn/10d@4x.png');
    expect(getIconUrl('10d', '2x')).toBe(
      'https://openweathermap.org/img/wn/10d@2x.png',
    );
  });  
});

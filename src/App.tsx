import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import './App.css';
import { airPollutionApi, forecastApi, geocodingApi, getIconUrl} from './api/weatherApi';
import type { AirPollutionResponse, ForecastItem } from './api/types';

const UPDATE_EVERY_3_HOURS = 3 * 60 * 60 * 1000;

const getAqiText = (aqi?: number) => {
  if (aqi === 1) return 'Хорошее';
  if (aqi === 2) return 'Нормальное';
  if (aqi === 3) return 'Умеренное';
  if (aqi === 4) return 'Плохое';
  if (aqi === 5) return '💀💀💀';
  return 'Нет данных';
};

const getThemeClass = (item?: ForecastItem) => {
  if (!item) return 'theme-clear-day';

  const weather = item.weather[0]?.main.toLowerCase() ?? '';
  const isNight = item.weather[0]?.icon.endsWith('n');

  if (weather.includes('rain') || weather.includes('drizzle')) {
    return isNight ? 'theme-rain-night' : 'theme-rain-day';
  }
  if (weather.includes('snow')) {
    return isNight ? 'theme-snow-night' : 'theme-snow-day';
  }
  if (weather.includes('cloud')) {
    return isNight ? 'theme-clouds-night' : 'theme-clouds-day';
  }
  return isNight ? 'theme-clear-night' : 'theme-clear-day';
};

const formatDate = (dateText: string) => {
  return new Date(dateText).toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });
};

function App() {
  const [search, setSearch] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [cityLabel, setCityLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forecastList, setForecastList] = useState<ForecastItem[]>([]);
  const [air, setAir] = useState<AirPollutionResponse | null>(null);
  const [updatedAt, setUpdatedAt] = useState('');

  const loadData = async (cityName: string) => {
    try {
      setLoading(true);
      setError('');

      const geo = await geocodingApi(cityName);
      const first = geo[0];

      if (!first) {
        throw new Error('Город не найден');
      }

      const [forecast, airPollution] = await Promise.all([
        forecastApi(first.lat, first.lon),
        airPollutionApi(first.lat, first.lon),
      ]);

      setCityLabel(`${first.name}, ${first.country}`);
      setForecastList(forecast.list);
      setAir(airPollution);
      setUpdatedAt(new Date().toLocaleString('ru-RU'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cityQuery) return;
    loadData(cityQuery);
  }, [cityQuery]);

  useEffect(() => {
    if (!cityQuery) return;
    const timerId = setInterval(() => {
      loadData(cityQuery);
    }, UPDATE_EVERY_3_HOURS);

    return () => clearInterval(timerId);
  }, [cityQuery]);

  const current = forecastList[0];
  const nextItems = useMemo(() => forecastList.slice(1, 6), [forecastList]);
  const nextDays = useMemo(() => {
    const byDate = new Map<string, ForecastItem>();

    for (const item of forecastList) {
      const date = item.dt_txt.slice(0, 10);
      if (!byDate.has(date)) {
        byDate.set(date, item);
      }
    }

    return Array.from(byDate.values()).slice(1, 5);
  }, [forecastList]);
  const aqi = air?.list[0]?.main.aqi;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const value = search.trim();
    if (!value) return;
    setCityQuery(value);
  };

  return (
    <main className={`app ${getThemeClass(current)}`}>
      <section className="weather-card">
        <form className="search" onSubmit={onSubmit}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Введите город"
          />
          <button type="submit">Найти</button>
        </form>

        {loading && <p className="status">Загрузка...</p>}
        {error && <p className="status error">{error}</p>}

        {!loading && !error && current && (
          <>
            <h1>{cityLabel}</h1>
            <div className="now">
              <img
                src={getIconUrl(current.weather[0].icon)}
                alt={current.weather[0].description}
              />
              <div>
                <p className="temp">{Math.round(current.main.temp)}°C</p>
                <p>{current.weather[0].description}</p>
                <p>Ощущается как {Math.round(current.main.feels_like)}°C</p>
              </div>
            </div>

            <div className="air">
              <p>Качество воздуха: {getAqiText(aqi)}</p>
              <p>AQI: {aqi ?? 'Нет данных'}</p>
            </div>

            <div className="hours">
              {nextItems.map((item) => (
                <article key={item.dt} className="hour-item">
                  <p>{item.dt_txt.slice(11, 16)}</p>
                  <img
                    src={getIconUrl(item.weather[0].icon, '2x')}
                    alt={item.weather[0].description}
                  />
                  <p>{Math.round(item.main.temp)}°C</p>
                </article>
              ))}
            </div>

            <h2 className="days-title">На несколько дней</h2>
            <div className="days">
              {nextDays.map((item) => (
                <article key={item.dt} className="day-item">
                  <p>{formatDate(item.dt_txt)}</p>
                  <img
                    src={getIconUrl(item.weather[0].icon, '2x')}
                    alt={item.weather[0].description}
                  />
                  <p>{Math.round(item.main.temp)}°C</p>
                </article>
              ))}
            </div>

            <p className="updated">Обновлено: {updatedAt}</p>
          </>
        )}
      </section>
    </main>
  );
}

export default App;

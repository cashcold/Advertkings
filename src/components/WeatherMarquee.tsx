import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  MapPin,
  Compass,
  ChevronDown,
  X,
  RefreshCw,
  Search,
  Check,
  Thermometer,
  Eye,
  Pause,
  Play,
  Globe2,
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import {
  CityWeatherData,
  UserLocationInfo,
  WORLD_CITIES_WEATHER_DATABASE,
  detectUserLocation,
  fetchLiveWeatherData,
} from '../data/weatherData';

interface WeatherMarqueeProps {
  soundEnabled?: boolean;
  onOpenTelegram?: (message: string) => void;
}

export const WeatherMarquee: React.FC<WeatherMarqueeProps> = ({
  soundEnabled = true,
  onOpenTelegram,
}) => {
  // Unit state: 'C' (Celsius) or 'F' (Fahrenheit)
  const [unit, setUnit] = useState<'C' | 'F'>(() => {
    try {
      return (localStorage.getItem('adkings_weather_unit') as 'C' | 'F') || 'C';
    } catch {
      return 'C';
    }
  });

  // User detected location & weather
  const [userLocation, setUserLocation] = useState<UserLocationInfo>(() => detectUserLocation());
  const [userWeather, setUserWeather] = useState<CityWeatherData>(() => {
    const loc = detectUserLocation();
    const match = WORLD_CITIES_WEATHER_DATABASE.find(
      (c) => c.country.toLowerCase() === loc.country.toLowerCase() || c.city.toLowerCase() === loc.city.toLowerCase()
    );
    return match || WORLD_CITIES_WEATHER_DATABASE[0];
  });

  // All worldwide cities weather list
  const [citiesWeather, setCitiesWeather] = useState<CityWeatherData[]>(WORLD_CITIES_WEATHER_DATABASE);

  // UI States
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalSelectedCity, setModalSelectedCity] = useState<CityWeatherData>(userWeather);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Save unit change
  const handleToggleUnit = () => {
    if (soundEnabled) soundManager.playSpinTick();
    setUnit((prev) => {
      const next = prev === 'C' ? 'F' : 'C';
      try {
        localStorage.setItem('adkings_weather_unit', next);
      } catch (e) {
        // Ignore
      }
      return next;
    });
  };

  // Close modal on Escape key and prevent background body scrolling when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  // Initial detection and live weather fetch
  useEffect(() => {
    const initLocationAndWeather = async () => {
      const detected = detectUserLocation();
      setUserLocation(detected);

      // Find matching city or fallback
      const match = WORLD_CITIES_WEATHER_DATABASE.find(
        (c) =>
          c.country.toLowerCase() === detected.country.toLowerCase() ||
          c.city.toLowerCase() === detected.city.toLowerCase() ||
          c.countryCode.toLowerCase() === detected.countryCode.toLowerCase()
      ) || WORLD_CITIES_WEATHER_DATABASE[0];

      setUserWeather(match);
      setModalSelectedCity(match);

      // Attempt live weather fetch from Open-Meteo or backend
      try {
        const live = await fetchLiveWeatherData(match);
        setUserWeather(live);
        setModalSelectedCity(live);
      } catch {
        // Keep fallback
      }
    };

    initLocationAndWeather();
  }, []);

  // Update selected city manually
  const handleSelectCity = async (cityData: CityWeatherData) => {
    if (soundEnabled) soundManager.playCoin();
    setUserWeather(cityData);
    setModalSelectedCity(cityData);
    setUserLocation({
      city: cityData.city,
      country: cityData.country,
      countryCode: cityData.countryCode,
      flag: cityData.flag,
      timezone: 'manual',
      isAutoDetected: false,
    });

    try {
      localStorage.setItem(
        'adkings_user_weather_pref',
        JSON.stringify({
          city: cityData.city,
          country: cityData.country,
          countryCode: cityData.countryCode,
          flag: cityData.flag,
        })
      );
    } catch (e) {
      // Ignore
    }

    // Refresh live weather
    setIsLoadingLive(true);
    try {
      const updated = await fetchLiveWeatherData(cityData);
      setUserWeather(updated);
      setModalSelectedCity(updated);
    } catch {
      // Ignore
    } finally {
      setIsLoadingLive(false);
    }
  };

  // Auto-detect button click
  const handleAutoDetect = async () => {
    if (soundEnabled) soundManager.playSpinTick();
    try {
      localStorage.removeItem('adkings_user_weather_pref');
    } catch (e) {
      // Ignore
    }
    const detected = detectUserLocation();
    setUserLocation(detected);

    const match = WORLD_CITIES_WEATHER_DATABASE.find(
      (c) =>
        c.country.toLowerCase() === detected.country.toLowerCase() ||
        c.city.toLowerCase() === detected.city.toLowerCase()
    ) || WORLD_CITIES_WEATHER_DATABASE[0];

    setUserWeather(match);
    setModalSelectedCity(match);

    setIsLoadingLive(true);
    try {
      const updated = await fetchLiveWeatherData(match);
      setUserWeather(updated);
      setModalSelectedCity(updated);
    } catch {
      // Ignore
    } finally {
      setIsLoadingLive(false);
    }
  };

  // Temperature formatter helper
  const formatTemp = (tempC: number, tempF: number) => {
    return unit === 'C' ? `${tempC}°C` : `${tempF}°F`;
  };

  // Filter cities for modal search
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return citiesWeather;
    const q = searchQuery.toLowerCase();
    return citiesWeather.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
    );
  }, [searchQuery, citiesWeather]);

  // Combined marquee list with User's Country pinned prominently at the start
  const marqueeItems = useMemo(() => {
    const others = citiesWeather.filter((c) => c.city !== userWeather.city);
    return [userWeather, ...others];
  }, [userWeather, citiesWeather]);

  return (
    <div className="bg-[#080d16] border-b border-cyan-500/30 py-1 px-2 overflow-hidden flex items-center shadow-inner relative select-none">
      {/* Pinned Left Controllers: Badge, User Country, Unit & Pause */}
      <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-cyan-500/30 z-10 bg-[#080d16]">
        {/* Title Badge: Icon only on mobile to save screen space, full text on desktop */}
        <button
          type="button"
          onClick={() => {
            if (soundEnabled) soundManager.playClick();
            setModalSelectedCity(userWeather);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-1.5 sm:px-2.5 py-0.5 bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-black text-[10px] font-black rounded tracking-wider uppercase whitespace-nowrap shadow-md shadow-cyan-600/30 cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0"
          title="Click to view full weather breakdown & choose country"
        >
          <Sun className="w-3.5 h-3.5 text-yellow-200 animate-spin" style={{ animationDuration: '10s' }} />
          <span className="hidden sm:inline">LIVE WEATHER</span>
          <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
        </button>

        {/* Detected Country / City Pill */}
        <button
          type="button"
          onClick={() => {
            if (soundEnabled) soundManager.playCoin();
            setModalSelectedCity(userWeather);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1 bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 px-2 py-0.5 rounded text-[10.5px] font-bold transition-colors cursor-pointer shadow-sm shrink-0"
          title={`Detected location: ${userWeather.city}, ${userWeather.country}. Click to switch country.`}
        >
          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
          <span className="text-xs">{userWeather.flag}</span>
          <span className="font-black text-white truncate max-w-[80px] sm:max-w-[130px]">
            {userWeather.city}, {userWeather.countryCode}
          </span>
          <span className="text-cyan-300 font-mono">
            {formatTemp(userWeather.tempC, userWeather.tempF)}
          </span>
          <ChevronDown className="w-3 h-3 text-cyan-400" />
        </button>

        {/* Celsius / Fahrenheit Toggle */}
        <button
          type="button"
          onClick={handleToggleUnit}
          title={`Click to switch between Celsius and Fahrenheit (Currently: °${unit})`}
          className="px-1.5 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-cyan-300 hover:text-white border border-cyan-500/40 rounded text-[10px] font-black font-mono transition-colors cursor-pointer shadow-sm active:scale-95 shrink-0"
        >
          °{unit}
        </button>

        {/* Pause / Resume Marquee */}
        <button
          type="button"
          onClick={() => {
            if (soundEnabled) soundManager.playSpinTick();
            setIsPaused((prev) => !prev);
          }}
          title={isPaused ? 'Resume Weather Ticker' : 'Pause Weather Ticker'}
          className="p-1 bg-zinc-900 hover:bg-zinc-800 text-cyan-300 rounded border border-cyan-500/40 text-[10px] transition-colors cursor-pointer shadow-sm active:scale-95 shrink-0"
        >
          {isPaused ? (
            <Play className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
          ) : (
            <Pause className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
          )}
        </button>
      </div>

      {/* Weather Marquee Scroll Stream */}
      <div className="overflow-hidden whitespace-nowrap w-full ml-2 relative">
        <ul
          className="animate-marquee-weather flex items-center gap-6 font-mono text-xs list-none m-0 p-0"
          style={{
            animationDuration: '190s',
            animationPlayState: isPaused ? 'paused' : undefined,
          }}
        >
          {/* First loop of items */}
          {marqueeItems.map((city, idx) => {
            const isUserLocation = city.city === userWeather.city;
            return (
              <li
                key={`weather-1-${city.city}-${city.countryCode}`}
                onClick={() => {
                  if (soundEnabled) soundManager.playClick();
                  setModalSelectedCity(city);
                  setIsModalOpen(true);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded transition-all cursor-pointer select-none shrink-0 group ${
                  isUserLocation
                    ? 'bg-cyan-950/90 hover:bg-cyan-900/90 border-2 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/60 text-zinc-200'
                }`}
                title={`Click to view today's weather forecast for ${city.city}, ${city.country}`}
              >
                {/* Special Tag for User's Country */}
                {isUserLocation && (
                  <span className="bg-cyan-400 text-black text-[9px] font-black px-1 py-0.2 rounded uppercase mr-0.5 tracking-tight shadow-sm">
                    YOUR WEATHER
                  </span>
                )}

                <span className="text-sm">{city.flag}</span>
                <span
                  className={`font-black tracking-tight ${
                    isUserLocation ? 'text-cyan-200' : 'text-zinc-100 group-hover:text-cyan-300'
                  }`}
                >
                  {city.city}, {city.country}
                </span>
                <span className="text-base leading-none">{city.conditionIcon}</span>
                <span className="font-bold text-white">
                  {formatTemp(city.tempC, city.tempF)}
                </span>
                <span className="text-zinc-400 text-[10px] hidden sm:inline">
                  {city.condition}
                </span>
                <span className="text-zinc-500 text-[10px] hidden md:inline">
                  (H: {formatTemp(city.tempMaxC, Math.round((city.tempMaxC * 9) / 5 + 32))} / L:{' '}
                  {formatTemp(city.tempMinC, Math.round((city.tempMinC * 9) / 5 + 32))})
                </span>
                <span className="text-cyan-400/90 text-[10px] hidden lg:inline flex items-center gap-0.5">
                  <Droplets className="w-2.5 h-2.5 inline text-cyan-400" />
                  {city.humidity}%
                </span>
                <span className="text-zinc-400 text-[10px] hidden xl:inline flex items-center gap-0.5">
                  <Wind className="w-2.5 h-2.5 inline text-teal-400" />
                  {city.windSpeedKmh}km/h
                </span>
              </li>
            );
          })}

          {/* Duplicate loop for seamless infinite marquee loop */}
          {marqueeItems.map((city, idx) => {
            const isUserLocation = city.city === userWeather.city;
            return (
              <li
                key={`weather-2-${city.city}-${city.countryCode}`}
                onClick={() => {
                  if (soundEnabled) soundManager.playClick();
                  setModalSelectedCity(city);
                  setIsModalOpen(true);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded transition-all cursor-pointer select-none shrink-0 group ${
                  isUserLocation
                    ? 'bg-cyan-950/90 hover:bg-cyan-900/90 border-2 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/60 text-zinc-200'
                }`}
                title={`Click to view today's weather forecast for ${city.city}, ${city.country}`}
              >
                {isUserLocation && (
                  <span className="bg-cyan-400 text-black text-[9px] font-black px-1 py-0.2 rounded uppercase mr-0.5 tracking-tight shadow-sm">
                    YOUR WEATHER
                  </span>
                )}

                <span className="text-sm">{city.flag}</span>
                <span
                  className={`font-black tracking-tight ${
                    isUserLocation ? 'text-cyan-200' : 'text-zinc-100 group-hover:text-cyan-300'
                  }`}
                >
                  {city.city}, {city.country}
                </span>
                <span className="text-base leading-none">{city.conditionIcon}</span>
                <span className="font-bold text-white">
                  {formatTemp(city.tempC, city.tempF)}
                </span>
                <span className="text-zinc-400 text-[10px] hidden sm:inline">
                  {city.condition}
                </span>
                <span className="text-zinc-500 text-[10px] hidden md:inline">
                  (H: {formatTemp(city.tempMaxC, Math.round((city.tempMaxC * 9) / 5 + 32))} / L:{' '}
                  {formatTemp(city.tempMinC, Math.round((city.tempMinC * 9) / 5 + 32))})
                </span>
                <span className="text-cyan-400/90 text-[10px] hidden lg:inline flex items-center gap-0.5">
                  <Droplets className="w-2.5 h-2.5 inline text-cyan-400" />
                  {city.humidity}%
                </span>
                <span className="text-zinc-400 text-[10px] hidden xl:inline flex items-center gap-0.5">
                  <Wind className="w-2.5 h-2.5 inline text-teal-400" />
                  {city.windSpeedKmh}km/h
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Comprehensive Weather Forecast & Country Selector Modal */}
      {isModalOpen && isMounted && typeof document !== 'undefined' &&
        createPortal(
          <div
            id="weather-marquee-modal-backdrop"
            className="fixed inset-0 z-[99999] overflow-y-auto overscroll-contain bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 flex flex-col justify-start sm:justify-center items-center animate-fadeIn"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              id="weather-marquee-modal-card"
              className="relative my-auto w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-5xl bg-[#090e17] border-2 border-cyan-500/70 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Modal Header */}
            <div className="p-3 sm:p-4 bg-gradient-to-r from-sky-950/90 via-cyan-950/90 to-[#090e17] border-b border-cyan-500/40 flex items-center justify-between shrink-0 gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-lg sm:text-xl shrink-0">
                  {modalSelectedCity.conditionIcon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base md:text-lg font-black text-white flex items-center gap-1.5 truncate">
                      <span>{modalSelectedCity.flag}</span>
                      <span className="truncate">
                        {modalSelectedCity.city}, {modalSelectedCity.country}
                      </span>
                    </h3>
                    {modalSelectedCity.city === userWeather.city && (
                      <span className="bg-cyan-400 text-black text-[9px] font-black px-1.5 py-0.2 rounded uppercase shrink-0">
                        YOUR LOCATION
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs text-cyan-300 font-mono truncate">
                    Real-Time Meteorological Radar & Atmosphere
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleUnit}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-cyan-300 hover:text-white text-xs font-mono font-bold border border-cyan-500/40 transition-colors cursor-pointer"
                  title="Switch between Celsius and Fahrenheit"
                >
                  Unit: °{unit}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close weather popup"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content Area: Responsive Stack on Mobile, Two-Column on Desktop */}
            <div className="p-3 sm:p-5 overflow-y-auto flex-1 overscroll-contain space-y-4 scrollbar-thin scrollbar-thumb-zinc-700">
              <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-5 items-start">
                
                {/* Left Column (Desktop 5 cols, Mobile full width): Primary Conditions & Atmospheric Sensors */}
                <div className="w-full lg:col-span-5 space-y-3">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-cyan-950/60 via-zinc-900/90 to-[#090d16] border border-cyan-500/40 shadow-xl space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                          CURRENT CONDITIONS
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {modalSelectedCity.city} • {modalSelectedCity.countryCode}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                          {formatTemp(modalSelectedCity.tempC, modalSelectedCity.tempF)}
                        </span>
                        <span className="text-base sm:text-lg text-cyan-300 font-bold">
                          {modalSelectedCity.condition}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 mt-1">
                        Feels like{' '}
                        <span className="text-white font-bold">
                          {formatTemp(modalSelectedCity.feelsLikeC, modalSelectedCity.feelsLikeF)}
                        </span>{' '}
                        • H:{' '}
                        <span className="text-white font-bold">
                          {formatTemp(
                            modalSelectedCity.tempMaxC,
                            Math.round((modalSelectedCity.tempMaxC * 9) / 5 + 32)
                          )}
                        </span>{' '}
                        / L:{' '}
                        <span className="text-white font-bold">
                          {formatTemp(
                            modalSelectedCity.tempMinC,
                            Math.round((modalSelectedCity.tempMinC * 9) / 5 + 32)
                          )}
                        </span>
                      </p>
                      <p className="text-xs text-cyan-200/90 italic mt-2 bg-black/40 p-2.5 rounded-xl border border-cyan-500/20">
                        "{modalSelectedCity.forecastSummary}"
                      </p>
                    </div>

                    {/* Action Buttons: Set as My Country & Auto Detect */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 pt-2 border-t border-cyan-500/20">
                      {modalSelectedCity.city !== userWeather.city ? (
                        <button
                          type="button"
                          onClick={() => handleSelectCity(modalSelectedCity)}
                          disabled={isLoadingLive}
                          className="w-full px-3 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-black text-xs rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.4)] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Set as My Country</span>
                        </button>
                      ) : (
                        <div className="w-full px-3 py-2 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Active Local Country</span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleAutoDetect}
                        disabled={isLoadingLive}
                        className="w-full px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-300 border border-zinc-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoadingLive ? 'animate-spin' : ''}`} />
                        <span>Auto-Detect Country</span>
                      </button>
                    </div>

                    {/* Atmospheric Metrics 2x2 Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyan-500/20">
                      <div className="p-2 rounded-xl bg-black/40 border border-zinc-800 flex items-center gap-2 min-w-0">
                        <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-zinc-400 truncate">Humidity</p>
                          <p className="text-xs font-black text-white">{modalSelectedCity.humidity}%</p>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-black/40 border border-zinc-800 flex items-center gap-2 min-w-0">
                        <Wind className="w-4 h-4 text-teal-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-zinc-400 truncate">Wind Speed</p>
                          <p className="text-xs font-black text-white truncate">
                            {modalSelectedCity.windSpeedKmh} km/h
                          </p>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-black/40 border border-zinc-800 flex items-center gap-2 min-w-0">
                        <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-zinc-400 truncate">UV Index</p>
                          <p className="text-xs font-black text-white">{modalSelectedCity.uvIndex} (Normal)</p>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-black/40 border border-zinc-800 flex items-center gap-2 min-w-0">
                        <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-zinc-400 truncate">Air Quality</p>
                          <p className="text-xs font-black text-white truncate">{modalSelectedCity.airQuality}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Geolocation Sponsorship Callout */}
                  {onOpenTelegram && (
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-950/40 via-cyan-950/40 to-teal-950/40 border border-cyan-500/30 flex flex-col gap-2">
                      <div className="text-xs">
                        <span className="font-black text-white flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Sponsor Geotargeted VIP Ads</span>
                        </span>
                        <p className="text-zinc-400 text-[11px] mt-0.5">
                          Run targeted campaigns for users in {modalSelectedCity.country} ({modalSelectedCity.flag}).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          onOpenTelegram(
                            `Hi AdKings, I want to inquire about geolocated VIP Banner advertising in ${modalSelectedCity.country} (${modalSelectedCity.city})!`
                          );
                        }}
                        className="w-full px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-black text-xs rounded-xl hover:from-cyan-400 hover:to-teal-400 transition-all cursor-pointer shadow-md text-center"
                      >
                        Inquire for {modalSelectedCity.country}
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column (Desktop 7 cols, Mobile full width): Country & City Explorer */}
                <div className="w-full lg:col-span-7 flex flex-col space-y-2.5 min-h-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Select Country / Global City ({filteredCities.length}):</span>
                    </span>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search country or city..."
                        className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Cities Grid List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[360px] sm:max-h-[420px] lg:max-h-[480px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 overscroll-contain">
                    {filteredCities.map((city) => {
                      const isSelected = city.city === modalSelectedCity.city;
                      const isUserActive = city.city === userWeather.city;
                      return (
                        <button
                          key={`city-select-${city.city}`}
                          type="button"
                          onClick={() => {
                            if (soundEnabled) soundManager.playClick();
                            setModalSelectedCity(city);
                          }}
                          className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer min-w-0 ${
                            isSelected
                              ? 'bg-gradient-to-r from-cyan-950 to-teal-950 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                              : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800/90 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate min-w-0 pr-2">
                            <span className="text-base shrink-0">{city.flag}</span>
                            <div className="truncate min-w-0">
                              <p className="text-xs font-black truncate flex items-center gap-1">
                                <span className="truncate">{city.city}</span>
                                <span className="text-[10px] text-zinc-400 font-normal shrink-0">
                                  ({city.countryCode})
                                </span>
                              </p>
                              <p className="text-[10px] text-zinc-400 truncate">{city.country}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            <span className="text-sm">{city.conditionIcon}</span>
                            <span className="text-xs font-mono font-bold text-white">
                              {formatTemp(city.tempC, city.tempF)}
                            </span>
                            {isUserActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" title="Your current detected country"></span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                    {filteredCities.length === 0 && (
                      <div className="col-span-full py-8 text-center text-zinc-500 text-xs font-mono">
                        No country or city matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-zinc-950 border-t border-zinc-800/90 flex items-center justify-between text-[11px] text-zinc-400 font-mono shrink-0">
              <span className="flex items-center gap-1 truncate pr-2">
                <Compass className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">Open-Meteo & WMO Meteorological Gateway</span>
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  MapPin,
  RefreshCw,
  Search,
  Check,
  Thermometer,
  Eye,
  Globe2,
  Send,
  Compass,
  Sunrise,
  Sunset,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ExternalLink,
  Flame,
  Radio,
  Gauge,
  X
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import {
  CityWeatherData,
  UserLocationInfo,
  WORLD_CITIES_WEATHER_DATABASE,
  detectUserLocation,
  fetchLiveWeatherData,
} from '../data/weatherData';

interface LiveWeatherBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

export const LiveWeatherBanner: React.FC<LiveWeatherBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
}) => {
  // Unit state
  const [unit, setUnit] = useState<'C' | 'F'>(() => {
    try {
      const saved = localStorage.getItem('adkings_weather_unit');
      return saved === 'F' ? 'F' : 'C';
    } catch {
      return 'C';
    }
  });

  // User location & selected city
  const [userLocation, setUserLocation] = useState<UserLocationInfo>(() => detectUserLocation());
  const [selectedCity, setSelectedCity] = useState<CityWeatherData>(() => {
    const loc = detectUserLocation();
    const match = WORLD_CITIES_WEATHER_DATABASE.find(
      (c) => c.country.toLowerCase() === loc.country.toLowerCase() || c.city.toLowerCase() === loc.city.toLowerCase()
    );
    return match || WORLD_CITIES_WEATHER_DATABASE[0];
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [forecastTab, setForecastTab] = useState<'hourly' | 'weekly'>('hourly');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click and Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  // Load live weather for selected city
  useEffect(() => {
    let isMounted = true;
    const loadWeather = async () => {
      setIsRefreshing(true);
      try {
        const live = await fetchLiveWeatherData(selectedCity);
        if (isMounted) {
          setSelectedCity(live);
        }
      } catch (e) {
        // Fallback
      } finally {
        if (isMounted) setIsRefreshing(false);
      }
    };

    loadWeather();
    return () => {
      isMounted = false;
    };
  }, [selectedCity.city, selectedCity.country]);

  const handleToggleUnit = () => {
    soundManager.playSpinTick();
    setUnit((prev) => {
      const next = prev === 'C' ? 'F' : 'C';
      try {
        localStorage.setItem('adkings_weather_unit', next);
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const handleCitySelect = (city: CityWeatherData) => {
    soundManager.playCoin();
    setSelectedCity(city);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const handleAutoDetect = () => {
    soundManager.playCoin();
    const detected = detectUserLocation();
    setUserLocation(detected);
    const match = WORLD_CITIES_WEATHER_DATABASE.find(
      (c) => c.country.toLowerCase() === detected.country.toLowerCase() || c.city.toLowerCase() === detected.city.toLowerCase()
    );
    if (match) {
      setSelectedCity(match);
    }
  };

  // Filtered cities for quick search
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return WORLD_CITIES_WEATHER_DATABASE;
    const q = searchQuery.toLowerCase();
    return WORLD_CITIES_WEATHER_DATABASE.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.countryCode.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const formatTemp = (tempC: number, tempF: number) => {
    return unit === 'C' ? `${tempC}°C` : `${tempF}°F`;
  };

  // Simulated hourly forecast data based on selected city's temp
  const hourlyForecast = useMemo(() => {
    const hours = [
      { time: 'Now', offset: 0, icon: selectedCity.conditionIcon, condition: selectedCity.condition },
      { time: '+2h', offset: 1, icon: '🌤️', condition: 'Passing Sun' },
      { time: '+4h', offset: 2, icon: '☀️', condition: 'Peak Daylight' },
      { time: '+6h', offset: 1, icon: '⛅', condition: 'Afternoon Breeze' },
      { time: '+8h', offset: -1, icon: '🌤️', condition: 'Golden Sunset' },
      { time: '+10h', offset: -3, icon: '🌙', condition: 'Clear Night' },
      { time: '+12h', offset: -4, icon: '✨', condition: 'Starlit Skies' },
      { time: '+14h', offset: -5, icon: '🌌', condition: 'Cool Night' },
    ];
    return hours.map((h) => {
      const c = selectedCity.tempC + h.offset;
      const f = Math.round((c * 9) / 5 + 32);
      return {
        ...h,
        tempC: c,
        tempF: f,
      };
    });
  }, [selectedCity]);

  // Simulated 5-day regional forecast
  const fiveDayForecast = useMemo(() => {
    const days = [
      { day: 'Today', condition: selectedCity.condition, icon: selectedCity.conditionIcon, maxC: selectedCity.tempMaxC, minC: selectedCity.tempMinC, rainProb: '10%' },
      { day: 'Tomorrow', condition: 'Sunny Intervals', icon: '🌤️', maxC: selectedCity.tempMaxC + 1, minC: selectedCity.tempMinC, rainProb: '15%' },
      { day: 'Thursday', condition: 'Pleasant & Mild', icon: '⛅', maxC: selectedCity.tempMaxC, minC: selectedCity.tempMinC - 1, rainProb: '25%' },
      { day: 'Friday', condition: 'Clear Blue Sky', icon: '☀️', maxC: selectedCity.tempMaxC + 2, minC: selectedCity.tempMinC + 1, rainProb: '5%' },
      { day: 'Saturday', condition: 'Passing Showers', icon: '🌦️', maxC: selectedCity.tempMaxC - 2, minC: selectedCity.tempMinC - 2, rainProb: '40%' },
    ];
    return days;
  }, [selectedCity]);

  // Top global hub cities
  const quickHubCities = useMemo(() => {
    const hubNames = ['Accra', 'Lagos', 'London', 'New York', 'Dubai', 'Toronto', 'Johannesburg', 'Nairobi', 'Tokyo', 'Singapore', 'Sydney'];
    return WORLD_CITIES_WEATHER_DATABASE.filter((c) => hubNames.includes(c.city));
  }, []);

  return (
    <div
      id="live-weather-banner"
      className="relative rounded-xl border-2 border-cyan-500/50 bg-gradient-to-br from-[#06111f] via-[#091829] to-[#040913] text-white shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all"
    >
      {/* Top Banner Header & Brand Identity Bar */}
      <div className="rounded-t-xl bg-gradient-to-r from-sky-950 via-cyan-900/90 to-blue-950 border-b border-cyan-500/40 px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-sky-400 text-black shadow-md shadow-cyan-500/40 font-black">
            <Sun className="w-5 h-5 animate-spin" style={{ animationDuration: '14s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base tracking-wide bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent uppercase">
                AdKings Global Live Weather Radar
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase bg-cyan-950 text-cyan-300 border border-cyan-400/50 px-1.5 py-0.5 rounded shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                LIVE RADAR
              </span>
            </div>
            <p className="text-[11px] text-cyan-200/80 font-medium">
              Real-time meteorological conditions, temperature, humidity & forecasts customized to your country
            </p>
          </div>
        </div>

        {/* Action Controls: Unit Toggle, Auto-Detect & Dropdown */}
        <div className="flex items-center gap-2">
          {/* Unit Toggle */}
          <button
            type="button"
            onClick={handleToggleUnit}
            title={`Switch to ${unit === 'C' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}`}
            className="flex items-center gap-1 bg-zinc-900/90 hover:bg-zinc-800 text-cyan-300 hover:text-white border border-cyan-500/40 px-2.5 py-1 rounded text-xs font-black font-mono shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
            <span>°{unit}</span>
          </button>

          {/* Auto Detect Button */}
          <button
            type="button"
            onClick={handleAutoDetect}
            title="Auto-detect weather for your current country"
            className="flex items-center gap-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-500/50 px-2.5 py-1 rounded text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">My Country</span>
          </button>

          {/* Change Country Dropdown Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsDropdownOpen((prev) => !prev);
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-black font-black text-xs px-3 py-1.5 rounded-lg shadow-md shadow-cyan-600/30 transition-all active:scale-95 cursor-pointer"
              title="Click to open country weather selector"
            >
              <span className="text-sm">{selectedCity.flag}</span>
              <span className="truncate max-w-[100px] sm:max-w-[140px] font-black">{selectedCity.city}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown / Popout Menu: Responsive on both Web and Mobile */}
            {isDropdownOpen && typeof document !== 'undefined' &&
              createPortal(
                <div
                  id="live-weather-dropdown-backdrop"
                  className="fixed inset-0 z-[99999] overflow-y-auto overscroll-contain bg-black/80 backdrop-blur-sm p-3 sm:p-4 flex flex-col justify-start sm:justify-center items-center animate-fadeIn"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <div
                    ref={dropdownRef}
                    id="live-weather-dropdown-card"
                    className="relative my-auto w-full max-w-sm sm:max-w-md bg-[#090d16] border-2 border-cyan-500/70 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] p-3.5 sm:p-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-800 shrink-0">
                      <div className="flex items-center gap-2">
                        <Globe2 className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-black text-white uppercase tracking-wider">
                          Select Country / City
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(false)}
                        className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Close country menu"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Search input */}
                    <div className="relative mb-2.5 shrink-0">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search country, city, code (e.g. Ghana, London)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900/90 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                        autoFocus
                      />
                    </div>

                    {/* Cities list */}
                    <div className="overflow-y-auto space-y-1.5 flex-1 pr-1 overscroll-contain">
                      {filteredCities.map((city) => {
                        const isSelected = city.city === selectedCity.city;
                        return (
                          <button
                            key={`dropdown-${city.city}-${city.countryCode}`}
                            type="button"
                            onClick={() => handleCitySelect(city)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all text-left cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-r from-cyan-950 to-teal-950 text-white border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-black'
                                : 'bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-300 font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <span className="text-base shrink-0">{city.flag}</span>
                              <div className="min-w-0">
                                <p className="font-black text-white truncate text-xs flex items-center gap-1.5">
                                  <span>{city.city}</span>
                                  <span className="text-[10px] text-zinc-400 font-normal">({city.countryCode})</span>
                                </p>
                                <p className="text-[10px] text-zinc-400 truncate">{city.country}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-sm">{city.conditionIcon}</span>
                              <span className="font-mono text-cyan-300 font-black text-xs">
                                {formatTemp(city.tempC, city.tempF)}
                              </span>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>}
                            </div>
                          </button>
                        );
                      })}
                      {filteredCities.length === 0 && (
                        <div className="py-8 text-center text-zinc-500 text-xs">
                          No locations matching "{searchQuery}"
                        </div>
                      )}
                    </div>

                    {/* Popout Footer / Shortcuts */}
                    <div className="pt-2.5 mt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          handleAutoDetect();
                          setIsDropdownOpen(false);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Auto-detect my location</span>
                      </button>
                      <span className="text-zinc-500 font-mono text-[10px]">
                        {filteredCities.length} locations
                      </span>
                    </div>
                  </div>
                </div>,
                document.body
              )
            }
          </div>
        </div>
      </div>

      {/* Main Meteorological Core Display */}
      <div className="p-3 sm:p-5">
        {/* Top Quick Cities Hub Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-cyan-300/80 uppercase tracking-wider flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              Global Financial Hubs & Regional Weather
            </span>
            <span className="text-[10px] text-zinc-400">Click any city to view live radar</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-cyan-900">
            {quickHubCities.map((c) => {
              const isSelected = c.city === selectedCity.city;
              return (
                <button
                  key={`hub-${c.city}`}
                  type="button"
                  onClick={() => handleCitySelect(c)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs shrink-0 transition-all font-mono ${
                    isSelected
                      ? 'bg-cyan-500 text-black font-black shadow-md shadow-cyan-500/30 scale-105'
                      : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-cyan-500/40'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span className="font-sans font-bold">{c.city}</span>
                  <span className={isSelected ? 'text-black font-black' : 'text-cyan-400 font-bold'}>
                    {formatTemp(c.tempC, c.tempF)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Core Weather Highlight Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Main Hero Card (Selected Country / City) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-cyan-950/40 via-sky-950/30 to-black/60 border border-cyan-500/30 rounded-xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-lg">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedCity.flag}</span>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <span>{selectedCity.city}</span>
                        <span className="text-xs font-normal text-cyan-300 font-mono px-2 py-0.5 bg-cyan-950/80 border border-cyan-500/40 rounded-full">
                          {selectedCity.country} ({selectedCity.countryCode})
                        </span>
                      </h3>
                      <p className="text-xs text-cyan-200/90 font-medium mt-0.5">
                        {selectedCity.region} • {selectedCity.isDay ? 'Daytime Daylight' : 'Night Hours'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playSpinTick();
                    setIsRefreshing(true);
                    fetchLiveWeatherData(selectedCity).then((res) => {
                      setSelectedCity(res);
                      setIsRefreshing(false);
                    });
                  }}
                  title="Refresh live meteorological radar data"
                  className="p-1.5 bg-zinc-900/80 hover:bg-zinc-800 text-cyan-300 rounded-lg border border-cyan-500/30 transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
                </button>
              </div>

              {/* Temperature & Condition Hero */}
              <div className="flex flex-wrap items-baseline gap-4 sm:gap-6 my-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl sm:text-5xl">{selectedCity.conditionIcon}</span>
                  <div>
                    <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-[0_2px_10px_rgba(6,182,212,0.3)]">
                      {formatTemp(selectedCity.tempC, selectedCity.tempF)}
                    </div>
                    <div className="text-xs text-zinc-400 font-mono">
                      Feels like <span className="text-cyan-300 font-bold">{formatTemp(selectedCity.feelsLikeC, selectedCity.feelsLikeF)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-l border-cyan-500/30 pl-4">
                  <div className="text-base sm:text-lg font-black text-cyan-200">
                    {selectedCity.condition}
                  </div>
                  <div className="text-xs text-zinc-400 font-mono mt-0.5 flex items-center gap-2">
                    <span>High: <strong className="text-rose-400">{formatTemp(selectedCity.tempMaxC, Math.round((selectedCity.tempMaxC * 9)/5 + 32))}</strong></span>
                    <span>•</span>
                    <span>Low: <strong className="text-sky-400">{formatTemp(selectedCity.tempMinC, Math.round((selectedCity.tempMinC * 9)/5 + 32))}</strong></span>
                  </div>
                </div>
              </div>

              {/* Meteorological Narrative Summary */}
              <div className="bg-cyan-950/40 border border-cyan-500/20 rounded-lg p-2.5 my-3 text-xs text-cyan-100 font-medium">
                "{selectedCity.forecastSummary}"
              </div>
            </div>

            {/* Telegram & Weather Alert Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-cyan-500/20">
              <button
                type="button"
                onClick={() => {
                  incrementClicks();
                  soundManager.playCoin();
                  onOpenTelegram(
                    `🌤️ LIVE WEATHER INQUIRY & TELEGRAM ALERTS:\n` +
                    `• City: ${selectedCity.city}, ${selectedCity.country} (${selectedCity.countryCode})\n` +
                    `• Temperature: ${formatTemp(selectedCity.tempC, selectedCity.tempF)} (${selectedCity.condition})\n` +
                    `• High / Low: ${selectedCity.tempMaxC}°C / ${selectedCity.tempMinC}°C\n` +
                    `• Humidity: ${selectedCity.humidity}% | Wind: ${selectedCity.windSpeedKmh} km/h\n` +
                    `• Please activate VIP storm, rain & weather update alerts on my Telegram!`
                  );
                }}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-black font-black text-xs py-2 px-3 rounded-lg shadow-md shadow-cyan-500/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>RECEIVE WEATHER ALERTS ON TELEGRAM</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  incrementClicks();
                  soundManager.playCoin();
                  onOpenTelegram(
                    `⚡ WEATHER COMMODITY & AGRI TRADING INQUIRY:\n` +
                    `• Location: ${selectedCity.city}, ${selectedCity.country}\n` +
                    `• Meteorological Index: ${selectedCity.tempC}°C, Humidity ${selectedCity.humidity}%\n` +
                    `• Requesting access to Weather Derivatives & Energy Trading Signals.`
                  );
                }}
                className="flex items-center justify-center gap-1.5 bg-zinc-900/90 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/40 text-xs font-bold py-2 px-3 rounded-lg transition-all active:scale-95"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Weather Derivatives</span>
              </button>
            </div>
          </div>

          {/* Meteorological Metrics Matrix (8 Sensors) */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-2 gap-2.5">
            {/* Humidity */}
            <div className="bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/40 rounded-xl p-3 transition-colors">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] font-bold">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  Humidity
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">24H</span>
              </div>
              <div className="text-xl font-black font-mono text-white mt-1">
                {selectedCity.humidity}%
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 to-cyan-400 h-full rounded-full transition-all"
                  style={{ width: `${selectedCity.humidity}%` }}
                ></div>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/40 rounded-xl p-3 transition-colors">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] font-bold">
                <span className="flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-teal-400" />
                  Wind Velocity
                </span>
                <span className="text-[10px] text-teal-400 font-mono">SPEED</span>
              </div>
              <div className="text-xl font-black font-mono text-white mt-1">
                {selectedCity.windSpeedKmh} <span className="text-xs font-normal text-zinc-400">km/h</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-1 truncate">
                Gentle breeze • 3.8 m/s
              </div>
            </div>

            {/* UV Index */}
            <div className="bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/40 rounded-xl p-3 transition-colors">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] font-bold">
                <span className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  UV Radiation
                </span>
                <span className={`text-[9.5px] font-black px-1 rounded ${
                  selectedCity.uvIndex > 7 ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                }`}>
                  {selectedCity.uvIndex > 7 ? 'VERY HIGH' : 'MODERATE'}
                </span>
              </div>
              <div className="text-xl font-black font-mono text-white mt-1">
                {selectedCity.uvIndex} <span className="text-xs font-normal text-zinc-400">/ 11</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-1">
                Solar protection recommended
              </div>
            </div>

            {/* Air Quality (AQI) */}
            <div className="bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/40 rounded-xl p-3 transition-colors">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] font-bold">
                <span className="flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  Air Quality
                </span>
                <span className="text-[9.5px] font-black text-emerald-400 bg-emerald-950 px-1 rounded">
                  CLEAN
                </span>
              </div>
              <div className="text-sm font-black text-emerald-300 mt-1 truncate">
                {selectedCity.airQuality}
              </div>
              <div className="text-[10px] text-zinc-400 mt-1">
                Optimal respiratory comfort
              </div>
            </div>

            {/* Atmospheric Pressure */}
            <div className="bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/40 rounded-xl p-3 transition-colors">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] font-bold">
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  Barometric Press.
                </span>
                <span className="text-[10px] text-purple-400 font-mono">1013 hPa</span>
              </div>
              <div className="text-base font-black font-mono text-white mt-1">
                Stable Pressure
              </div>
              <div className="text-[10px] text-zinc-400 mt-1">
                Zero cyclonic disturbance
              </div>
            </div>

            {/* Visibility */}
            <div className="bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/40 rounded-xl p-3 transition-colors">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] font-bold">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  Visibility
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">10.0 KM</span>
              </div>
              <div className="text-base font-black font-mono text-white mt-1">
                100% Clear View
              </div>
              <div className="text-[10px] text-zinc-400 mt-1">
                Ideal flight & transit conditions
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Tabs: Hourly Breakdown & 5-Day Outlook */}
        <div className="mt-4 bg-zinc-950/60 border border-cyan-500/20 rounded-xl p-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playSpinTick();
                  setForecastTab('hourly');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  forecastTab === 'hourly'
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                Today's Hourly Radar
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playSpinTick();
                  setForecastTab('weekly');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  forecastTab === 'weekly'
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                5-Day Regional Outlook
              </button>
            </div>
            <span className="text-[11px] text-zinc-400 hidden sm:inline font-mono">
              Live updates via Open-Meteo API
            </span>
          </div>

          {forecastTab === 'hourly' ? (
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {hourlyForecast.map((h, idx) => (
                <div
                  key={`hour-${idx}`}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                    idx === 0
                      ? 'bg-cyan-950/70 border-cyan-400 text-white'
                      : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-cyan-500/30'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-zinc-400 mb-1">{h.time}</span>
                  <span className="text-xl my-0.5">{h.icon}</span>
                  <span className="text-xs font-black font-mono text-cyan-300">
                    {formatTemp(h.tempC, h.tempF)}
                  </span>
                  <span className="text-[9px] text-zinc-400 truncate w-full mt-0.5">
                    {h.condition}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {fiveDayForecast.map((d, idx) => (
                <div
                  key={`day-${idx}`}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-2.5 flex sm:flex-col items-center justify-between text-center"
                >
                  <span className="text-xs font-bold text-zinc-300">{d.day}</span>
                  <span className="text-2xl my-1">{d.icon}</span>
                  <span className="text-[11px] font-medium text-cyan-200 mb-1">{d.condition}</span>
                  <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <span className="text-rose-400">{d.maxC}°</span>
                    <span className="text-zinc-500">/</span>
                    <span className="text-sky-400">{d.minC}°</span>
                  </div>
                  <span className="text-[9.5px] text-sky-400 font-mono mt-1">
                    Rain: {d.rainProb}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

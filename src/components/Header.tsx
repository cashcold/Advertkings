import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Zap, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  Flame, 
  Trophy, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Ticket, 
  Wallet, 
  CreditCard, 
  ShoppingBag, 
  Gift, 
  Heart, 
  Crown,
  Grid,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Layers,
  Smartphone,
  Phone,
  MessageCircle,
  Package,
  Gamepad2,
  Edit3,
  User,
  Code2,
  Play,
  Pause,
  TrendingDown,
  RefreshCw,
  Coins,
  MailCheck,
  CloudSun
} from 'lucide-react';
import { BannerCategory, BannerSize, AuthUser } from '../types';
import { soundManager } from '../utils/audio';
import { LIVE_ADS_100_FEED } from '../data/liveAdsFeed';
import { INITIAL_CRYPTO_RATES, CryptoRate } from '../data/cryptoRates';
import kingRobeImg from '../assets/images/king_royal_robe_1788100992454.jpg';
import { UserPlus, UserCheck, LogOut, Lock, Shield, Users, ExternalLink } from 'lucide-react';
import { WeatherMarquee } from './WeatherMarquee';

interface HeaderProps {
  category: BannerCategory;
  setCategory: (c: BannerCategory) => void;
  bannerSize: BannerSize;
  setBannerSize: (s: BannerSize) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  blinkIntensity: 'mild' | 'extreme' | 'hyper';
  setBlinkIntensity: (b: 'mild' | 'extreme' | 'hyper') => void;
  onOpenTelegram: (msg?: string) => void;
  totalClicks: number;
  currentUser?: AuthUser | null;
  onOpenAuth: (mode?: 'register' | 'login') => void;
  onLogout?: () => void;
  onOpenAdminPortal?: () => void;
  onOpenUserReload?: () => void;
  onOpenEditProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  category,
  setCategory,
  bannerSize,
  setBannerSize,
  soundEnabled,
  setSoundEnabled,
  blinkIntensity,
  setBlinkIntensity,
  onOpenTelegram,
  totalClicks,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAdminPortal,
  onOpenUserReload,
  onOpenEditProfile,
}) => {
  const [onlineUsers, setOnlineUsers] = useState<number>(492);
  const [isCategoryToggleOpen, setIsCategoryToggleOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isMobileActionsOpen, setIsMobileActionsOpen] = useState<boolean>(false);
  const [isMarqueePaused, setIsMarqueePaused] = useState<boolean>(false);
  const [isCryptoPaused, setIsCryptoPaused] = useState<boolean>(false);
  const [cryptoRates, setCryptoRates] = useState<CryptoRate[]>(INITIAL_CRYPTO_RATES);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Subtle real-time price fluctuation simulation for high vibrancy
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoRates((prevRates) => {
        // Pick 2-3 random assets to nudge slightly
        const updated = [...prevRates];
        const numToUpdate = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numToUpdate; i++) {
          const randomIndex = Math.floor(Math.random() * updated.length);
          const current = updated[randomIndex];
          // Minor nudge between -0.3% and +0.3%
          const pctNudge = (Math.random() - 0.49) * 0.006;
          const newPrice = current.price * (1 + pctNudge);
          const newChange = +(current.change24h + (pctNudge * 50)).toFixed(2);
          
          updated[randomIndex] = {
            ...current,
            price: current.price < 1 ? +newPrice.toFixed(6) : current.price < 10 ? +newPrice.toFixed(4) : +newPrice.toFixed(2),
            change24h: newChange,
          };
        }
        return updated;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Close user dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryToggleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const CATEGORY_ITEMS = [
    { id: 'developers', label: '💻 Full-Stack & Android Devs', icon: Code2, tag: 'AVAILABLE' },
    { id: 'hyip', label: '⚡ HYIP 300%', icon: Zap, tag: 'HOURLY' },
    { id: 'forex', label: '📈 Forex Trading', icon: TrendingUp, tag: 'VIP' },
    { id: 'casino', label: '🎰 Casino', icon: Trophy, tag: '777' },
    { id: 'aviator', label: '✈️ Aviator', icon: Flame, tag: 'SIGNAL' },
    { id: 'virtual-phone', label: '📱 Virtual Phone (SMS/Call)', icon: Smartphone, tag: 'FREE' },
    { id: 'gift-card', label: '🎁 Gift Cards', icon: Gift, tag: 'INSTANT' },
    { id: 'live-weather', label: '🌤️ Live Weather', icon: CloudSun, tag: 'GLOBAL' },
    { id: 'shopping', label: '🛍️ Shopping Cards', icon: ShoppingBag, tag: '$500' },
    { id: 'football', label: '⚽ Football VVIP', icon: Ticket, tag: '98%' },
    { id: 'virtual-games', label: '🎮 Virtue Games VIP', icon: Gamepad2, tag: 'LIVE' },
    { id: 'crypto-loan', label: '🏦 Crypto Loans', icon: Wallet, tag: '0% KYC' },
    { id: 'paypal', label: '💳 PayPal Reload', icon: CreditCard, tag: '60s' },
    { id: 'gaming', label: '🎮 Cyber Gaming', icon: ShieldAlert, tag: 'XP' },
    { id: 'lottery', label: '🎟️ Lottery 777', icon: Sparkles, tag: 'WIN' },
    { id: 'dropshipping', label: '📦 E-Com Dropshipping', icon: Package, tag: 'PROFIT' },
    { id: 'email-verification', label: '✉️ Email Verifier & Temp Mail', icon: MailCheck, tag: 'INBOX' },
    { id: 'hookup-dating', label: '🔥 Hookup & Casual Meet', icon: Flame, tag: 'TONIGHT' },
    { id: 'sugar-mummy', label: '👑 Sugar Mummy (37-78)', icon: Heart, tag: 'HOT' },
  ];

  const currentCategoryObj = CATEGORY_ITEMS.find((c) => c.id === category);

  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineUsers((prev) => prev + 3);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    if (next) soundManager.playCoin();
  };

  const handleSelectCategoryItem = (catId: BannerCategory) => {
    setCategory(catId);
    setIsCategoryToggleOpen(false);
    if (soundEnabled) soundManager.playSpinTick();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070709]/95 backdrop-blur-md text-white border-b-2 border-yellow-500/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      {/* Top Scrolling Hyper Marquee */}
      <div className="bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-black font-black text-xs sm:text-sm py-1.5 px-2 overflow-hidden border-b border-black flex items-center shadow-inner">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-0.5 bg-black text-yellow-400 text-[11px] font-black rounded tracking-wider uppercase whitespace-nowrap shadow-inner border border-yellow-500/40">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            LIVE ADS FEED
          </div>

          {/* Pause / Resume Feed Toggle */}
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) soundManager.playSpinTick();
              setIsMarqueePaused((prev) => !prev);
            }}
            title={isMarqueePaused ? "Resume Live Feed" : "Pause Live Feed"}
            className="flex items-center justify-center p-1 bg-black/85 hover:bg-black text-white rounded border border-yellow-500/40 text-[10px] transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            {isMarqueePaused ? (
              <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            ) : (
              <Pause className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            )}
          </button>
        </div>

        <div className="overflow-hidden whitespace-nowrap w-full ml-2">
          <ul
            className="animate-marquee-long flex items-center gap-8 font-black uppercase tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] list-none m-0 p-0"
            style={{
              animationDuration: '1100s',
              animationPlayState: isMarqueePaused ? 'paused' : undefined,
            }}
          >
            {LIVE_ADS_100_FEED.map((item) => (
              <li
                key={`feed-1-${item.id}`}
                onClick={() => {
                  if (soundEnabled) soundManager.playCoin();
                  onOpenTelegram(`Inquiry from Live Ads Feed (#${item.id}): ${item.text}`);
                }}
                className={`${item.colorClass} cursor-pointer hover:underline hover:scale-105 transition-transform shrink-0 flex items-center gap-1.5`}
              >
                {item.text}
              </li>
            ))}
            {/* Duplicate for seamless infinite marquee loop */}
            {LIVE_ADS_100_FEED.map((item) => (
              <li
                key={`feed-2-${item.id}`}
                onClick={() => {
                  if (soundEnabled) soundManager.playCoin();
                  onOpenTelegram(`Inquiry from Live Ads Feed (#${item.id}): ${item.text}`);
                }}
                className={`${item.colorClass} cursor-pointer hover:underline hover:scale-105 transition-transform shrink-0 flex items-center gap-1.5`}
              >
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Crypto Rates Currency Live Marquee (Directly under LIVE ADS FEED) */}
      <div className="bg-[#0b0e14] border-b border-yellow-500/30 py-1 px-2 overflow-hidden flex items-center shadow-md">
        <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-yellow-500/30 z-10 bg-[#0b0e14]">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-600 to-yellow-600 text-black text-[10px] font-black rounded tracking-wider uppercase whitespace-nowrap shadow-sm">
            <Coins className="w-3 h-3 text-black animate-spin" style={{ animationDuration: '6s' }} />
            CRYPTO RATES
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            LIVE 24H
          </span>

          {/* Pause / Resume Toggle for Crypto Rates */}
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) soundManager.playSpinTick();
              setIsCryptoPaused((prev) => !prev);
            }}
            title={isCryptoPaused ? "Resume Crypto Rates Marquee" : "Pause Crypto Rates Marquee"}
            className="p-1 bg-zinc-900 hover:bg-zinc-800 text-yellow-400 rounded border border-yellow-500/40 text-[10px] transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            {isCryptoPaused ? (
              <Play className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
            ) : (
              <Pause className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
            )}
          </button>
        </div>

        <div className="overflow-hidden whitespace-nowrap w-full ml-2 relative">
          <ul 
            className="animate-marquee-crypto flex items-center gap-6 font-mono text-xs list-none m-0 p-0"
            style={{
              animationDuration: '180s',
              animationPlayState: isCryptoPaused ? 'paused' : undefined,
            }}
          >
            {cryptoRates.map((coin) => {
              const isUp = coin.change24h >= 0;
              return (
                <li
                  key={`rate-1-${coin.symbol}`}
                  onClick={() => {
                    if (soundEnabled) soundManager.playCoin();
                    onOpenTelegram(`Inquiry about ${coin.name} (${coin.pair}) rate: $${coin.price.toLocaleString()} (${isUp ? '+' : ''}${coin.change24h}%)`);
                  }}
                  className="flex items-center gap-1.5 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/60 px-2 py-0.5 rounded transition-all cursor-pointer select-none shrink-0 group"
                  title={`Click to inquire or trade ${coin.name} (${coin.pair})`}
                >
                  <span className="text-sm">{coin.icon}</span>
                  <span className="font-black text-zinc-100 group-hover:text-yellow-400 transition-colors">
                    {coin.symbol}
                  </span>
                  <span className="text-zinc-400 text-[10px]">/USDT</span>
                  <span className="font-bold text-white ml-0.5">
                    ${coin.price < 0.01 
                      ? coin.price.toFixed(6) 
                      : coin.price < 1 
                        ? coin.price.toFixed(4) 
                        : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 text-[10.5px] font-bold px-1 rounded ${
                      isUp 
                        ? 'text-emerald-400 bg-emerald-950/60' 
                        : 'text-rose-400 bg-rose-950/60'
                    }`}
                  >
                    {isUp ? (
                      <TrendingUp className="w-2.5 h-2.5" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5" />
                    )}
                    {isUp ? '+' : ''}{coin.change24h}%
                  </span>
                </li>
              );
            })}
            {/* Duplicate for seamless infinite loop */}
            {cryptoRates.map((coin) => {
              const isUp = coin.change24h >= 0;
              return (
                <li
                  key={`rate-2-${coin.symbol}`}
                  onClick={() => {
                    if (soundEnabled) soundManager.playCoin();
                    onOpenTelegram(`Inquiry about ${coin.name} (${coin.pair}) rate: $${coin.price.toLocaleString()} (${isUp ? '+' : ''}${coin.change24h}%)`);
                  }}
                  className="flex items-center gap-1.5 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/60 px-2 py-0.5 rounded transition-all cursor-pointer select-none shrink-0 group"
                  title={`Click to inquire or trade ${coin.name} (${coin.pair})`}
                >
                  <span className="text-sm">{coin.icon}</span>
                  <span className="font-black text-zinc-100 group-hover:text-yellow-400 transition-colors">
                    {coin.symbol}
                  </span>
                  <span className="text-zinc-400 text-[10px]">/USDT</span>
                  <span className="font-bold text-white ml-0.5">
                    ${coin.price < 0.01 
                      ? coin.price.toFixed(6) 
                      : coin.price < 1 
                        ? coin.price.toFixed(4) 
                        : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 text-[10.5px] font-bold px-1 rounded ${
                      isUp 
                        ? 'text-emerald-400 bg-emerald-950/60' 
                        : 'text-rose-400 bg-rose-950/60'
                    }`}
                  >
                    {isUp ? (
                      <TrendingUp className="w-2.5 h-2.5" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5" />
                    )}
                    {isUp ? '+' : ''}{coin.change24h}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Today's Weather Live Marquee (Based on Person's Country) */}
      <WeatherMarquee soundEnabled={soundEnabled} onOpenTelegram={onOpenTelegram} />

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Logo & Slogan */}
        <div className="flex items-center justify-between md:justify-start gap-2 sm:gap-3 w-full md:w-auto">
          <div
            onClick={() => {
              setCategory('all');
              setBannerSize('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              if (soundEnabled) soundManager.playCoin();
            }}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none"
            title="Return to Home Feed"
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-yellow-500 via-red-600 to-purple-800 flex items-center justify-center text-lg sm:text-xl shadow-[0_0_12px_rgba(234,179,8,0.4)] border border-yellow-300/60 animate-pulse group-hover:scale-105 transition-transform">
                
                {/* 3D King in Royal Robes Icon in Middle */}
                  <span className="relative inline-flex items-center justify-center mx-1 p-0.5 rounded-full bg-gradient-to-b from-yellow-300 via-amber-500 to-amber-800 border-2 border-yellow-200 shadow-[0_2px_8px_rgba(245,158,11,0.7),inset_0_1px_2px_rgba(255,255,255,0.8)] transform -rotate-2 hover:rotate-0 hover:scale-110 transition-all">
                    <img
                      src={kingRobeImg}
                      alt="King with Royal Robe"
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover object-top shadow-inner"
                    />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-200 rounded-full animate-ping opacity-75"></span>
                  </span>
              </div>
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black px-1 py-0.2 rounded-full border border-yellow-300 shadow-md group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                VIP
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                <h1 className="text-sm sm:text-lg font-black tracking-tight flex items-center gap-1 group-hover:opacity-95 transition-all whitespace-nowrap">
                  <span className="bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    AdvKings
                  </span>
                  
                  
                </h1>
              </div>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-bold flex items-center gap-1.5 mt-0.5">
                <span className="text-green-400 font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-ping"></span>
                  {onlineUsers.toLocaleString()} ONLINE
                </span>
                <span>•</span>
                <span className="text-amber-300 flex items-center gap-1 font-extrabold">
                  <Eye className="w-3 h-3 inline text-yellow-400" /> {totalClicks.toLocaleString()} Ad Clicks
                </span>
              </p>
            </div>
          </div>

          {/* Mobile Quick Action Toggle (Leaves phone screen completely uncluttered) */}
          <button
            id="mobile-actions-toggle-btn"
            onClick={() => {
              setIsMobileActionsOpen(!isMobileActionsOpen);
              if (soundEnabled) soundManager.playSpinTick();
            }}
            className={`md:hidden min-h-[40px] px-3 py-1.5 rounded-xl border font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer select-none shrink-0 ${
              isMobileActionsOpen
                ? 'bg-amber-400 text-black border-yellow-200 shadow-[0_0_12px_rgba(234,179,8,0.6)]'
                : 'bg-zinc-900 hover:bg-zinc-800 text-yellow-400 border-yellow-500/50 shadow-[0_0_8px_rgba(234,179,8,0.2)]'
            }`}
            aria-expanded={isMobileActionsOpen}
            aria-label="Toggle VIP Actions and Chat Controls"
          >
            {currentUser ? (
              <span className="flex items-center gap-1">
                <span className="text-sm">{currentUser.avatar || '👑'}</span>
                <span className="text-white max-w-[65px] truncate font-bold">${currentUser.balance.toFixed(0)}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-yellow-400" />
                <span>VIP Menu</span>
              </span>
            )}
            {isMobileActionsOpen ? (
              <ChevronUp className="w-4 h-4 text-current" />
            ) : (
              <ChevronDown className="w-4 h-4 text-yellow-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Responsive Action Controls: Collapsed by Default on Mobile, Always Flex on Desktop */}
        <div className={`${isMobileActionsOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto pt-2 md:pt-0 border-t border-zinc-800/80 md:border-t-0 animate-fadeIn`}>
          {/* Blink Intensity selector on large screens */}
          <div className="hidden lg:flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 rounded-lg p-0.5 text-xs">
            <span className="text-zinc-400 text-[10px] px-1 font-bold">Blink:</span>
            {(['mild', 'extreme', 'hyper'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setBlinkIntensity(lvl)}
                className={`px-1.5 py-0.5 rounded font-black uppercase text-[9px] transition-all ${
                  blinkIntensity === lvl
                    ? 'bg-red-600 text-white shadow-[0_0_6px_#ef4444]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Action Row 1 on Mobile: FX ON/OFF and LIVE CHAT */}
          <div className="grid grid-cols-2 gap-2 md:flex md:items-center">
            {/* Sound FX Toggle Button */}
            <button
              id="sound-toggle-btn"
              onClick={toggleSound}
              className={`min-h-[44px] w-full md:w-auto px-3 py-2 rounded-xl border font-black text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer select-none ${
                soundEnabled
                  ? 'bg-amber-400 text-black border-yellow-200 hover:bg-yellow-300 shadow-[0_0_8px_rgba(234,179,8,0.5)]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
              }`}
              title={soundEnabled ? 'Mute Arcade FX' : 'Enable Arcade FX'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-black shrink-0" /> : <VolumeX className="w-4 h-4 text-zinc-400 shrink-0" />}
              <span className="whitespace-nowrap font-black">{soundEnabled ? 'FX ON' : 'FX OFF'}</span>
            </button>

            {/* Live Chat Jump Button */}
            <button
              id="header-live-chat-btn"
              onClick={() => {
                const el = document.getElementById('live-community-chatroom');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
                setIsMobileActionsOpen(false);
                if (soundEnabled) soundManager.playCoin();
              }}
              className="min-h-[44px] w-full md:w-auto px-3 py-2 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-black font-black text-xs rounded-xl border border-yellow-200 shadow-[0_0_12px_rgba(234,179,8,0.5)] flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap cursor-pointer select-none"
              title="Jump to Live Winners & Cashout Chatroom"
            >
              <MessageSquare className="w-4 h-4 text-black shrink-0" />
              <span>LIVE CHAT</span>
              <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                HOT
              </span>
            </button>

            {/* User Deposit / Withdraw Button */}
            <button
              id="header-user-reload-action-btn"
              onClick={() => {
                if (onOpenUserReload) onOpenUserReload();
                setIsMobileActionsOpen(false);
                if (soundEnabled) soundManager.playCoin();
              }}
              className="min-h-[44px] w-full md:w-auto px-3 py-2 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-white font-black text-xs rounded-xl border border-emerald-500/50 hover:border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.25)] flex items-center justify-center gap-1.5 transition-all shrink-0 whitespace-nowrap cursor-pointer select-none"
              title="Deposit / Withdraw VIP Balance"
            >
              <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>DEPOSIT / WITHDRAW</span>
            </button>

            {/* Admin Financial Portal & Balance Approvals Button (Admins Only) */}
            {currentUser?.role === 'admin' && (
              <button
                id="header-admin-portal-action-btn"
                onClick={() => {
                  if (onOpenAdminPortal) onOpenAdminPortal();
                  setIsMobileActionsOpen(false);
                  if (soundEnabled) soundManager.playCoin();
                }}
                className="min-h-[44px] w-full md:w-auto px-3 py-2 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:bg-yellow-500/30 text-yellow-300 hover:text-white font-black text-xs rounded-xl border border-yellow-500/50 hover:border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.25)] flex items-center justify-center gap-1.5 transition-all shrink-0 whitespace-nowrap cursor-pointer select-none"
                title="Admin Financial Portal: Approve reload requests & manage balances"
              >
                <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>ADMIN PORTAL</span>
              </button>
            )}
          </div>

          {/* Action Row 2 on Mobile: SIGN IN & REGISTER VIP (or VIP Profile when logged in) */}
          {currentUser ? (
            <div className="w-full md:w-auto relative" ref={userMenuRef}>
              <button
                id="header-user-profile-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="min-h-[44px] w-full md:w-auto px-3 py-2 bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/60 rounded-xl flex items-center justify-center gap-2 transition-all text-xs font-black text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.3)] cursor-pointer"
              >
                <span className="text-base">{currentUser.avatar || '👑'}</span>
                <span className="truncate max-w-[130px] font-bold text-white">
                  {currentUser.fullName || currentUser.email.split('@')[0]}
                </span>
                <span className="bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                  ${currentUser.balance.toFixed(0)}
                </span>
                <ChevronDown className="w-4 h-4 text-yellow-400" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-full sm:w-64 bg-[#0d0d12] border border-yellow-500/70 rounded-xl shadow-2xl p-3 z-50 animate-fadeIn backdrop-blur-xl">
                  <div className="flex items-center gap-2.5 pb-2.5 mb-2.5 border-b border-zinc-800">
                    <div className="w-9 h-9 rounded-lg bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-lg">
                      {currentUser.avatar || '👑'}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-white truncate">{currentUser.fullName}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{currentUser.email}</p>
                      <p className="text-[10px] text-yellow-400 font-semibold">{currentUser.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs font-bold mb-2.5">
                    <div className="flex items-center justify-between p-1.5 rounded bg-zinc-950/80 border border-zinc-800">
                      <span className="text-zinc-400">VIP Balance:</span>
                      <span className="text-green-400 font-black">${currentUser.balance.toLocaleString()} USD</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-zinc-950/80 border border-zinc-800">
                      <span className="text-zinc-400">Member Status:</span>
                      <span className="text-yellow-300 font-black flex items-center gap-1">
                        <Crown className="w-3 h-3 text-yellow-400" /> VERIFIED VIP
                      </span>
                    </div>
                  </div>

                  {/* Edit Profile Action */}
                  <button
                    id="header-edit-profile-btn"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsMobileActionsOpen(false);
                      if (onOpenEditProfile) onOpenEditProfile();
                      if (soundEnabled) soundManager.playCoin();
                    }}
                    className="w-full mb-1.5 py-2 px-2.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 hover:bg-yellow-500/25 text-yellow-300 hover:text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-yellow-500/40"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Edit Profile (Email, Phone, Name)</span>
                  </button>

                  {/* User Deposit / Withdraw Action */}
                  <button
                    id="header-user-reload-dropdown-btn"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsMobileActionsOpen(false);
                      if (onOpenUserReload) onOpenUserReload();
                      if (soundEnabled) soundManager.playCoin();
                    }}
                    className="w-full mb-1.5 py-2 px-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition cursor-pointer border border-emerald-400"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Deposit / Withdraw</span>
                  </button>

                  {/* Admin Portal Balance Reload Action (Only visible to admin accounts) */}
                  {currentUser.role === 'admin' && (
                    <button
                      id="header-admin-portal-dropdown-btn"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsMobileActionsOpen(false);
                        if (onOpenAdminPortal) onOpenAdminPortal();
                        if (soundEnabled) soundManager.playCoin();
                      }}
                      className="w-full mb-2 py-2 px-2.5 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 hover:from-yellow-400 hover:to-amber-300 text-black font-black rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(234,179,8,0.4)] transition cursor-pointer border border-yellow-200"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin Financial Portal</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsMobileActionsOpen(false);
                      if (onLogout) onLogout();
                      if (soundEnabled) soundManager.playSpinTick();
                    }}
                    className="w-full py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white border border-red-800/60 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 md:flex md:items-center">
              <button
                id="header-login-btn"
                onClick={() => {
                  onOpenAuth('login');
                  setIsMobileActionsOpen(false);
                  if (soundEnabled) soundManager.playSpinTick();
                }}
                className="min-h-[44px] w-full md:w-auto px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-yellow-400 hover:text-yellow-300 font-black text-xs rounded-xl border border-yellow-500/40 shadow-sm flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap cursor-pointer select-none"
                title="Sign in with existing VIP Account"
              >
                <Lock className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>SIGN IN</span>
              </button>

              <button
                id="header-register-btn"
                onClick={() => {
                  onOpenAuth('register');
                  setIsMobileActionsOpen(false);
                  if (soundEnabled) soundManager.playCoin();
                }}
                className="min-h-[44px] w-full md:w-auto px-3 py-2 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-white font-black text-xs rounded-xl border border-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.6)] flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap animate-pulse cursor-pointer select-none"
                title="Create VIP Account (Email & Phone)"
              >
                <UserPlus className="w-4 h-4 text-yellow-200 shrink-0" />
                <span>REGISTER VIP</span>
                <span className="bg-black text-yellow-300 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-yellow-300/40">
                  +$50
                </span>
              </button>
            </div>
          )}

          {/* Action Row 3 on Mobile: Direct Telegram & WhatsApp Contact Button & Join Telegram Group */}
          <button
            id="header-contact-telegram-btn"
            onClick={() => {
              setIsMobileActionsOpen(false);
              onOpenTelegram('Hi AdKings Support, I want to rent a VIP Banner slot or claim bonuses!');
            }}
            className="min-h-[44px] w-full md:w-auto px-3.5 py-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-600 hover:from-cyan-400 hover:to-emerald-500 text-white font-black text-xs rounded-xl border border-yellow-300 shadow-[0_0_12px_rgba(6,182,212,0.5)] flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap cursor-pointer select-none"
          >
            <div className="flex items-center -space-x-1">
              <Send className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <MessageCircle className="w-3.5 h-3.5 text-emerald-200 fill-emerald-200" />
            </div>
            <span>TELEGRAM & WHATSAPP SUPPORT</span>
          </button>

          <a
            id="header-join-telegram-group-btn"
            href="https://t.me/+7Ish7gfkoxw3NjM8"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setIsMobileActionsOpen(false);
              if (soundEnabled) soundManager.playCoin();
            }}
            className="min-h-[44px] w-full md:w-auto px-3.5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs rounded-xl border border-cyan-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap cursor-pointer select-none"
            title="Join Official Telegram VIP Group"
          >
            <Users className="w-3.5 h-3.5 text-yellow-300" />
            <span>JOIN TELEGRAM GROUP</span>
            <ExternalLink className="w-3 h-3 text-cyan-200" />
          </a>
        </div>
      </div>

      {/* Category Navigation Bar with Toggle Icon */}
      <div className="bg-[#0c0c0e] border-t border-zinc-800/80 px-2 sm:px-6 py-1.5 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-1.5">
          
          {/* Main Toggle Controller & Quick Category Bar */}
          <div className="flex items-center gap-1.5 flex-wrap md:flex-nowrap flex-1" ref={dropdownRef}>
            
            {/* Primary Toggle Icon Button */}
            <button
              id="category-toggle-menu-btn"
              onClick={() => {
                setIsCategoryToggleOpen(!isCategoryToggleOpen);
                if (soundEnabled) soundManager.playSpinTick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-tight flex items-center gap-2 transition-all border shrink-0 ${
                isCategoryToggleOpen
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.6)] scale-[1.02]'
                  : 'bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 hover:from-zinc-800 hover:to-zinc-700 text-yellow-400 border-yellow-500/50 shadow-md'
              }`}
              title="Click to toggle full category list"
            >
              <span className="p-1 rounded bg-black/40 text-yellow-300">
                <Grid className="w-3.5 h-3.5" />
              </span>
              <span className="flex items-center gap-1">
                <span>CATEGORIES</span>
                <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  {CATEGORY_ITEMS.length}
                </span>
              </span>
              {isCategoryToggleOpen ? (
                <ChevronUp className="w-4 h-4 text-black" />
              ) : (
                <ChevronDown className="w-4 h-4 text-yellow-400 animate-bounce" />
              )}
            </button>

            {/* Currently Active Indicator Pill */}
            <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-bold bg-zinc-950/80 px-2 py-1 rounded-md border border-zinc-800 shrink-0">
              <span className="text-[9px] text-zinc-500 uppercase">Active:</span>
              <span className="text-yellow-400 font-black truncate max-w-[130px] sm:max-w-none">
                {category === 'all' ? '🔥 ALL ADS' : currentCategoryObj?.label || category}
              </span>
            </div>

            {/* Quick Filter Reset (Show All) */}
            {category !== 'all' && (
              <button
                onClick={() => handleSelectCategoryItem('all')}
                className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tight bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors shrink-0"
              >
                Reset to All
              </button>
            )}

            {/* Toggled Full Categories Dropdown List */}
            {isCategoryToggleOpen && (
              <div className="absolute top-full left-2 sm:left-6 right-2 sm:right-auto sm:w-[650px] mt-1.5 z-50 bg-[#0c0c10] border-2 border-yellow-500/80 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.95)] p-3 sm:p-4 backdrop-blur-xl animate-fadeIn">
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wide">
                      Select Category / VIP Service
                    </span>
                  </div>
                  <button
                    onClick={() => setIsCategoryToggleOpen(false)}
                    className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 13 Categories Grid List as requested */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 max-h-[60vh] overflow-y-auto pr-1">
                  
                  {/* Option to View All */}
                  <button
                    onClick={() => handleSelectCategoryItem('all')}
                    className={`p-2 rounded-xl text-xs font-black text-left flex items-center justify-between transition-all border ${
                      category === 'all'
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black border-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                        : 'bg-zinc-900/80 text-zinc-200 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🔥</span>
                      <span>ALL CATEGORIES</span>
                    </div>
                    {category === 'all' && <Check className="w-4 h-4 text-black" />}
                  </button>

                  {/* 12 Core Ad Categories */}
                  {CATEGORY_ITEMS.map((item) => {
                    const isSelected = category === item.id;
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        id={`toggle-cat-${item.id}`}
                        onClick={() => handleSelectCategoryItem(item.id as BannerCategory)}
                        className={`p-2 rounded-xl text-xs font-black text-left flex items-center justify-between transition-all border ${
                          isSelected
                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-yellow-200 shadow-[0_0_12px_rgba(234,179,8,0.5)]'
                            : 'bg-zinc-900/80 text-zinc-200 border-zinc-800 hover:bg-zinc-800 hover:border-yellow-500/50 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <IconComp className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-black' : 'text-yellow-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-black shrink-0 ml-1" />
                        ) : (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/50 text-zinc-400 shrink-0 ml-1">
                            {item.tag}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {/* 13th Item: Winners Chat */}
                  <button
                    id="toggle-cat-winners-chat"
                    onClick={() => {
                      setIsCategoryToggleOpen(false);
                      const el = document.getElementById('live-community-chatroom');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                      if (soundEnabled) soundManager.playCoin();
                    }}
                    className="p-2 rounded-xl text-xs font-black text-left flex items-center justify-between transition-all border bg-gradient-to-r from-green-950/80 via-zinc-900 to-green-950/80 text-green-300 border-green-500/50 hover:bg-green-500 hover:text-black sm:col-span-2 lg:col-span-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
                      <span className="font-black">💬 Winners Chat (Live Community & Proofs)</span>
                    </div>
                    <span className="bg-green-500/20 text-green-400 text-[9px] px-1.5 py-0.5 rounded border border-green-500/30">
                      ONLINE
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Ad Size Formats Switcher (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-1 self-end md:self-auto text-[10px] overflow-x-auto pt-1 md:pt-0">
            <span className="text-zinc-400 text-[10px] font-bold mr-0.5">Format:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'leaderboard', label: '728x90' },
              { id: 'billboard', label: '970x250' },
              { id: 'medium-rect', label: '300x250' },
              { id: 'half-page', label: '300x600' },
            ].map((size) => (
              <button
                key={size.id}
                id={`size-filter-${size.id}`}
                onClick={() => {
                  setBannerSize(size.id as BannerSize);
                  if (soundEnabled) soundManager.playSpinTick();
                }}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all border ${
                  bannerSize === size.id
                    ? 'bg-red-600 text-white border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)] font-black'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

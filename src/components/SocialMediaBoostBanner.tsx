import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  Users,
  MessageCircle,
  TrendingUp,
  Zap,
  Send,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Flame,
  Radio,
  Share2,
  Eye,
  Activity,
  Award,
  Crown,
  Play,
  RotateCw,
  ChevronRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SocialMediaBoostBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

type SocialPlatform = 'instagram' | 'tiktok' | 'youtube' | 'telegram' | 'twitter' | 'facebook';
type BoostService = 'followers' | 'likes' | 'comments' | 'views_shares';

interface LiveDeliveryItem {
  id: string;
  user: string;
  platform: string;
  service: string;
  qty: string;
  speed: string;
  time: string;
}

const PLATFORM_CONFIGS: Record<SocialPlatform, {
  name: string;
  iconEmoji: string;
  badge: string;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  defaultHandle: string;
}> = {
  instagram: {
    name: 'Instagram High-Engagement Boost',
    iconEmoji: '📸',
    badge: 'INSTA VIRAL',
    accentColor: '#ec4899',
    borderColor: 'border-pink-500',
    bgGradient: 'from-[#510c28] via-[#2d0516] to-[#0d0106]',
    defaultHandle: '@your_instagram_user',
  },
  tiktok: {
    name: 'TikTok FYP Algo Accelerator',
    iconEmoji: '🎵',
    badge: 'FYP VIRAL 10K/H',
    accentColor: '#06b6d4',
    borderColor: 'border-cyan-400',
    bgGradient: 'from-[#082a38] via-[#05171f] to-[#02080a]',
    defaultHandle: '@your_tiktok_creator',
  },
  youtube: {
    name: 'YouTube Subscribers & Watch Time',
    iconEmoji: '▶️',
    badge: 'YT MONETIZE',
    accentColor: '#ef4444',
    borderColor: 'border-red-500',
    bgGradient: 'from-[#450a0a] via-[#260303] to-[#0f0101]',
    defaultHandle: 'youtube.com/@yourchannel',
  },
  telegram: {
    name: 'Telegram Channel Members & Post Views',
    iconEmoji: '✈️',
    badge: 'TG 10K MEMBERS',
    accentColor: '#38bdf8',
    borderColor: 'border-sky-400',
    bgGradient: 'from-[#072738] via-[#03151f] to-[#01080d]',
    defaultHandle: 't.me/your_community',
  },
  twitter: {
    name: 'X (Twitter) Followers & Retweet Engine',
    iconEmoji: '🐦',
    badge: 'X TRENDING',
    accentColor: '#e2e8f0',
    borderColor: 'border-slate-300',
    bgGradient: 'from-[#1e293b] via-[#0f172a] to-[#020617]',
    defaultHandle: '@your_x_handle',
  },
  facebook: {
    name: 'Facebook Page Likes & Real Interactions',
    iconEmoji: '📘',
    badge: 'FB PAGE BOOST',
    accentColor: '#3b82f6',
    borderColor: 'border-blue-500',
    bgGradient: 'from-[#172554] via-[#0b132b] to-[#030611]',
    defaultHandle: 'facebook.com/yourpage',
  },
};

const BOOST_AMOUNTS = [
  { qty: '1,000', label: 'Starter Kick', timeEst: '~6 Mins', badge: 'FAST' },
  { qty: '2,500', label: 'Popular Growth', timeEst: '~15 Mins', badge: 'POPULAR' },
  { qty: '5,000', label: 'Influencer Surge', timeEst: '~30 Mins', badge: 'HOT' },
  { qty: '10,000', label: '10K Max Turbo', timeEst: '~58 Mins', badge: '⚡ 10K/HOUR' },
];

const INITIAL_DELIVERIES: LiveDeliveryItem[] = [
  { id: '1', user: '@jordan_viral', platform: 'Instagram', service: 'Followers', qty: '+10,000', speed: '9,850/hr', time: 'Just now' },
  { id: '2', user: '@mia_creator', platform: 'TikTok', service: 'Likes & Views', qty: '+5,000', speed: '10,000/hr', time: '18s ago' },
  { id: '3', user: '@crypto_kings', platform: 'Telegram', service: 'Members', qty: '+10,000', speed: '9,920/hr', time: '39s ago' },
];

export const SocialMediaBoostBanner: React.FC<SocialMediaBoostBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [selectedService, setSelectedService] = useState<BoostService>('followers');
  const [selectedQty, setSelectedQty] = useState<string>('10,000');
  const [targetUsername, setTargetUsername] = useState<string>('');
  const [liveCounter, setLiveCounter] = useState<number>(8420);
  const [liveDeliveries, setLiveDeliveries] = useState<LiveDeliveryItem[]>(INITIAL_DELIVERIES);
  const [isBoosting, setIsBoosting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const activePlatform = PLATFORM_CONFIGS[selectedPlatform];

  // Dynamic live counter ticking upwards at high speed (simulating 10k/hr)
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveCounter((prev) => prev + Math.floor(Math.random() * 8) + 3);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Live rotating deliveries stream
  useEffect(() => {
    const interval = setInterval(() => {
      const users = [
        { user: '@sarah_model', platform: 'Instagram', service: 'Followers', qty: '+10,000' },
        { user: '@alex_beats', platform: 'TikTok', service: 'Likes & Saves', qty: '+5,000' },
        { user: '@tech_reviews', platform: 'YouTube', service: 'Subscribers', qty: '+2,500' },
        { user: '@crypto_signals_vip', platform: 'Telegram', service: 'Real Members', qty: '+10,000' },
        { user: '@dj_marcus', platform: 'Instagram', service: 'Reel Comments', qty: '+1,000' },
        { user: '@viral_reels_daily', platform: 'TikTok', service: 'Followers', qty: '+10,000' },
      ];
      const randomItem = users[Math.floor(Math.random() * users.length)];

      const newEntry: LiveDeliveryItem = {
        id: String(Date.now()),
        user: randomItem.user,
        platform: randomItem.platform,
        service: randomItem.service,
        qty: randomItem.qty,
        speed: `${(9800 + Math.floor(Math.random() * 200)).toLocaleString()}/hr`,
        time: 'Just now',
      };

      setLiveDeliveries((prev) => {
        const updated = prev.slice(0, 2).map((item, idx) => ({
          ...item,
          time: idx === 0 ? '12s ago' : '34s ago',
        }));
        return [newEntry, ...updated];
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleStartBoost = () => {
    incrementClicks();
    soundManager.playWinFanfare();
    setIsBoosting(true);

    setTimeout(() => {
      setIsBoosting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 4000);

      const msg =
        `🚀 SOCIAL MEDIA ALGO BOOST ACTIVATION (UP TO 10,000/HR):\n` +
        `• Target Platform: ${activePlatform.name}\n` +
        `• Service Package: ${selectedQty} ${selectedService.toUpperCase()} (High Retention / Non-Drop)\n` +
        `• Delivery Speed: Turbo Algorithm (Up to 10k/Hour in Minutes)\n` +
        `• Target Profile/Link: ${targetUsername || activePlatform.defaultHandle}\n` +
        `• Quality: Real Active Profiles • Zero Password Required • 100% Safe\n` +
        `Please initiate my social media boost queue on Telegram immediately!`;

      onOpenTelegram(msg);
    }, 500);
  };

  return (
    <section
      id="social-media-boost-banner"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#180826] via-[#0e0417] to-[#040108] border-2 border-fuchsia-500 p-4 sm:p-5 shadow-[0_0_40px_rgba(217,70,239,0.35)] transition-all duration-300"
    >
      {/* Background Glows */}
      <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-pink-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

      {/* Top Banner Header & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-fuchsia-500/30 pb-3 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(236,72,153,0.7)] flex items-center gap-1.5 animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300 inline" /> SOCIAL MEDIA BOOST: UP TO 10K/HOUR 🚀
            </span>
            <span className="bg-yellow-400 text-black font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded uppercase tracking-tight flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-black inline" /> BOOST LIKES & FOLLOWERS IN MINUTES
            </span>
            <span className="text-[11px] text-fuchsia-300 font-bold hidden sm:inline flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" /> No Password Required • Non-Drop Guaranteed
            </span>
          </div>
          <p className="text-[11px] text-zinc-300 font-medium pt-0.5 max-w-2xl leading-relaxed">
            Accelerate your social growth with high-speed delivery up to <strong className="text-yellow-300 font-black">10,000 real active followers, likes, comments & views per hour</strong> across Instagram, TikTok, YouTube, Telegram, X & Facebook.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-black text-cyan-300 bg-black/80 border border-cyan-400/50 px-2.5 py-1 rounded-lg shadow flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> 10K/HR TURBO ENGINE
          </span>
        </div>
      </div>

      {/* Social Platform Selection Carousel */}
      <div className="mb-4">
        <div className="text-[11px] font-bold text-zinc-300 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1 text-fuchsia-300">
            <Users className="w-3.5 h-3.5 text-pink-400" /> Select Social Platform:
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">Instant Algorithm Push</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {(Object.keys(PLATFORM_CONFIGS) as SocialPlatform[]).map((key) => {
            const p = PLATFORM_CONFIGS[key];
            const isSelected = selectedPlatform === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedPlatform(key);
                  soundManager.playCoin();
                }}
                className={`py-2 px-2 rounded-xl text-center border transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-950 via-purple-950 to-indigo-950 border-pink-400 text-white shadow-[0_0_14px_rgba(236,72,153,0.6)] scale-[1.03]'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-pink-500/40 hover:text-zinc-200'
                }`}
              >
                <span className="text-lg">{p.iconEmoji}</span>
                <span className="font-extrabold text-xs truncate">{p.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Dynamic 10K Live Speedometer Card (5 cols) + Right Customizer (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Column: Live 10K Speedometer & Live Growth Card */}
        <div className="lg:col-span-5 space-y-3">
          <div
            className={`relative rounded-2xl bg-gradient-to-br ${activePlatform.bgGradient} border-2 ${activePlatform.borderColor} p-4 sm:p-5 text-white shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300`}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activePlatform.iconEmoji}</span>
                <div>
                  <span className="text-[10px] font-mono text-pink-300 uppercase tracking-wider block font-bold">REAL-TIME ALGORITHM</span>
                  <h4 className="text-sm font-black text-white">{activePlatform.name}</h4>
                </div>
              </div>
              <span className="bg-yellow-400 text-black text-[9px] font-black px-2 py-0.5 rounded uppercase shadow">
                10K / HOUR SPEED
              </span>
            </div>

            {/* Giant Live Growth Counter */}
            <div className="my-3 bg-black/70 border border-white/20 rounded-xl p-3.5 text-center">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">LIVE DELIVERED IN LAST 60 MINS</span>
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight bg-gradient-to-r from-yellow-300 via-pink-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(236,72,153,0.7)] flex items-center justify-center gap-1">
                <span>+{liveCounter.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-1.5 text-[11px] font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-bounce" /> 166 Delivery/Min
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-cyan-300 font-bold">10,000/hr Capacity</span>
              </div>
            </div>

            {/* Target Package Specs */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono pt-1">
              <div className="bg-black/50 border border-white/10 p-2 rounded-lg">
                <span className="text-[9px] text-zinc-400 block font-bold">SELECTED TARGET</span>
                <strong className="text-yellow-300 font-black text-[12px]">+{selectedQty} {selectedService.toUpperCase()}</strong>
              </div>
              <div className="bg-black/50 border border-white/10 p-2 rounded-lg">
                <span className="text-[9px] text-zinc-400 block font-bold">COMPLETION TIME</span>
                <strong className="text-emerald-300 font-black text-[12px]">In ~{selectedQty === '10,000' ? '58 Mins' : selectedQty === '5,000' ? '30 Mins' : '15 Mins'}</strong>
              </div>
            </div>
          </div>

          {/* Live Deliveries Stream Ticker */}
          <div className="bg-black/60 border border-pink-500/20 rounded-xl p-2.5 space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-pink-400 animate-pulse" /> Live 10K Algorithm Deliveries:
            </span>
            <div className="space-y-1 font-mono text-[10px]">
              {liveDeliveries.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-zinc-950/80 px-2 py-1 rounded border border-pink-500/10 text-zinc-300">
                  <div className="flex items-center gap-1 truncate">
                    <span className="text-pink-300 font-bold truncate">{item.user}</span>
                    <span className="text-zinc-400 text-[9px]">({item.platform})</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-yellow-300 font-black">{item.qty} {item.service}</span>
                    <span className="text-emerald-400 text-[9px]">⚡ {item.speed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Custom Boost Service, Quantity & Telegram Concierge Push */}
        <div className="lg:col-span-7 bg-zinc-950/90 border border-fuchsia-500/30 rounded-2xl p-4 space-y-4 shadow-xl">
          
          {/* Section Heading */}
          <div className="flex items-center justify-between border-b border-fuchsia-500/20 pb-2">
            <span className="text-xs font-black text-fuchsia-300 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Configure 10K Algorithm Boost
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Starts in 60 Seconds
            </span>
          </div>

          {/* Service Selector (Followers vs Likes vs Comments vs Views) */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1.5">
              Select Boost Service Type:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedService('followers');
                  soundManager.playCoin();
                }}
                className={`p-2 rounded-xl border text-center transition-all ${
                  selectedService === 'followers'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-yellow-300 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-pink-500/40'
                }`}
              >
                <Users className="w-4 h-4 mx-auto mb-1 text-pink-300" />
                <div className="text-xs font-black">Followers / Subs</div>
                <div className="text-[9px] text-emerald-400 font-bold">100% Non-Drop</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedService('likes');
                  soundManager.playCoin();
                }}
                className={`p-2 rounded-xl border text-center transition-all ${
                  selectedService === 'likes'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-yellow-300 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-pink-500/40'
                }`}
              >
                <Heart className="w-4 h-4 mx-auto mb-1 text-red-400 fill-red-400" />
                <div className="text-xs font-black">Post & Reel Likes</div>
                <div className="text-[9px] text-yellow-300 font-bold">High Speed</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedService('comments');
                  soundManager.playCoin();
                }}
                className={`p-2 rounded-xl border text-center transition-all ${
                  selectedService === 'comments'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-yellow-300 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-pink-500/40'
                }`}
              >
                <MessageCircle className="w-4 h-4 mx-auto mb-1 text-sky-400" />
                <div className="text-xs font-black">Custom Comments</div>
                <div className="text-[9px] text-cyan-300 font-bold">Relevant Emojis</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedService('views_shares');
                  soundManager.playCoin();
                }}
                className={`p-2 rounded-xl border text-center transition-all ${
                  selectedService === 'views_shares'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-yellow-300 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-pink-500/40'
                }`}
              >
                <Share2 className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                <div className="text-xs font-black">Views & Shares</div>
                <div className="text-[9px] text-emerald-400 font-bold">FYP Algorithm</div>
              </button>
            </div>
          </div>

          {/* Amount / Boost Volume Selector */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1.5 flex items-center justify-between">
              <span>Choose Boost Volume:</span>
              <span className="text-yellow-300 font-mono font-black">{selectedQty} Boost in Minutes</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BOOST_AMOUNTS.map((amt) => {
                const isSelected = selectedQty === amt.qty;
                return (
                  <button
                    key={amt.qty}
                    type="button"
                    onClick={() => {
                      setSelectedQty(amt.qty);
                      soundManager.playCoin();
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-900 to-pink-900 border-pink-400 text-white shadow-[0_0_12px_rgba(236,72,153,0.6)]'
                        : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-pink-500/40'
                    }`}
                  >
                    <div className="font-mono font-black text-sm text-yellow-300">+{amt.qty}</div>
                    <div className="text-[9px] text-zinc-300 font-bold mt-0.5">{amt.timeEst}</div>
                    <span className="text-[8px] font-black uppercase text-cyan-300 bg-cyan-950/80 px-1 py-0.2 rounded mt-1 inline-block">
                      {amt.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Profile or Post Link Input */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1 flex items-center justify-between">
              <span>Profile Username or Post Link:</span>
              <span className="text-[10px] text-emerald-400 font-mono">🔒 Zero Password Needed</span>
            </label>
            <input
              type="text"
              value={targetUsername}
              onChange={(e) => setTargetUsername(e.target.value)}
              placeholder={`e.g. ${activePlatform.defaultHandle}`}
              className="w-full bg-black/60 border border-fuchsia-500/30 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-400"
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleStartBoost}
            disabled={isBoosting}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 hover:from-pink-400 hover:to-cyan-300 text-white font-black text-sm rounded-xl border-2 border-yellow-200 shadow-[0_0_25px_rgba(236,72,153,0.7)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] pulse-cta"
          >
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span>
              {isSuccess
                ? '✓ BOOST QUEUED! OPENING TELEGRAM ACCELERATOR...'
                : isBoosting
                ? 'INITIALIZING 10K/HR TURBO ENGINE...'
                : `BOOST +${selectedQty} ${selectedService.toUpperCase()} (10K/HR) ON TELEGRAM`}
            </span>
            <Send className="w-4 h-4 text-white" />
          </button>

          {/* Safety & Performance Guarantees */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 font-mono pt-1">
            <div className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% Non-Drop & Safe</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-300 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>10k/Hour Speed Engine</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

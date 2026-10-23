import React, { useState, useMemo, useEffect } from 'react';
import { 
  Wifi, 
  Smartphone, 
  Zap, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Globe, 
  Activity,
  Infinity,
  Radio,
  QrCode,
  Check,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface FreeInternetDataBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

type NetworkCarrier = 'mtn' | 'telecel' | 'airtel' | 'att_verizon' | 'orange' | 'global_esim';
type SimType = 'esim' | 'physical_sim' | 'instant_topup';

interface LiveDataClaim {
  id: string;
  user: string;
  carrier: string;
  package: string;
  time: string;
}

const CARRIER_CONFIGS: Record<NetworkCarrier, { name: string; badge: string; color: string; bgGradient: string; border: string }> = {
  mtn: {
    name: 'MTN 5G High-Speed Network',
    badge: 'MTN 5G TURBO',
    color: '#eab308',
    bgGradient: 'from-yellow-950 via-amber-950 to-zinc-950',
    border: 'border-yellow-400',
  },
  telecel: {
    name: 'Telecel / Vodafone 5G Ultra',
    badge: 'TELECEL SPEED',
    color: '#ef4444',
    bgGradient: 'from-red-950 via-rose-950 to-zinc-950',
    border: 'border-red-400',
  },
  airtel: {
    name: 'Airtel / AirtelTigo 4G+ Uncapped',
    badge: 'AIRTEL PLUS',
    color: '#f97316',
    bgGradient: 'from-orange-950 via-amber-950 to-zinc-950',
    border: 'border-orange-400',
  },
  att_verizon: {
    name: 'AT&T / Verizon / T-Mobile USA',
    badge: 'USA 5G ULTRA',
    color: '#06b6d4',
    bgGradient: 'from-cyan-950 via-blue-950 to-zinc-950',
    border: 'border-cyan-400',
  },
  orange: {
    name: 'Orange / O2 / Vodafone Europe',
    badge: 'EU UNLIMITED',
    color: '#8b5cf6',
    bgGradient: 'from-purple-950 via-indigo-950 to-zinc-950',
    border: 'border-purple-400',
  },
  global_esim: {
    name: 'Global Roaming eSIM (180+ Countries)',
    badge: 'GLOBAL eSIM',
    color: '#10b981',
    bgGradient: 'from-emerald-950 via-teal-950 to-zinc-950',
    border: 'border-emerald-400',
  },
};

const DATA_TIERS = [
  { amount: '500 GB', label: 'Recommended', bonus: '500,000 MB Uncapped', expiry: 'NO EXPIRATION (LIFETIME)' },
  { amount: '250 GB', label: 'Express', bonus: '250,000 MB Fast', expiry: 'NO EXPIRATION (LIFETIME)' },
  { amount: '1,000 GB', label: 'VIP Unlimited', bonus: '1 TB High-Speed', expiry: 'NO EXPIRATION (LIFETIME)' },
];

const USERS_STREAM_POOL = [
  { user: '@Kwame_Tech', carrier: 'MTN 5G', pack: '500 GB' },
  { user: '@Chloe_Stream', carrier: 'Global eSIM', pack: '500 GB' },
  { user: '@David_Dev', carrier: 'Telecel 5G', pack: '500 GB' },
  { user: '@Amina_Vibe', carrier: 'AirtelTigo 4G+', pack: '500 GB' },
  { user: '@Marcus_NYC', carrier: 'T-Mobile 5G', pack: '1,000 GB' },
  { user: '@Elena_Euro', carrier: 'Orange 5G', pack: '500 GB' },
  { user: '@Kofi_Stream', carrier: 'MTN 5G', pack: '500 GB' },
  { user: '@Liam_London', carrier: 'O2 5G', pack: '500 GB' },
];

const INITIAL_CLAIMS: LiveDataClaim[] = [
  { id: '1', user: '@Kwame_Tech', carrier: 'MTN 5G', package: '500 GB Lifetime', time: 'Just now' },
  { id: '2', user: '@Chloe_Stream', carrier: 'Global eSIM', package: '500 GB Lifetime', time: '14s ago' },
  { id: '3', user: '@David_Dev', carrier: 'Telecel 5G', package: '500 GB Lifetime', time: '38s ago' },
];

export const FreeInternetDataBanner: React.FC<FreeInternetDataBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
}) => {
  const [selectedCarrier, setSelectedCarrier] = useState<NetworkCarrier>('mtn');
  const [selectedDataTier, setSelectedDataTier] = useState<string>('500 GB');
  const [simType, setSimType] = useState<SimType>('instant_topup');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+233');
  const [liveClaims, setLiveClaims] = useState<LiveDataClaim[]>(INITIAL_CLAIMS);
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const activeCarrier = CARRIER_CONFIGS[selectedCarrier];

  // Dynamic live stream of claiming users
  useEffect(() => {
    const interval = setInterval(() => {
      const randomItem = USERS_STREAM_POOL[Math.floor(Math.random() * USERS_STREAM_POOL.length)];
      const newEntry: LiveDataClaim = {
        id: String(Date.now()),
        user: randomItem.user,
        carrier: randomItem.carrier,
        package: `${randomItem.pack} Lifetime`,
        time: 'Just now',
      };

      setLiveClaims((prev) => {
        const updated = prev.slice(0, 2).map((item, idx) => ({
          ...item,
          time: idx === 0 ? '8s ago' : '26s ago',
        }));
        return [newEntry, ...updated];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleClaimData = () => {
    incrementClicks();
    soundManager.playWinFanfare();
    setIsActivating(true);

    setTimeout(() => {
      setIsActivating(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 4000);

      const msg = 
        `🌐 FREE 500GB NO-EXPIRATION INTERNET DATA APPLICATION:\n` +
        `• Data Allocation: ${selectedDataTier} (0 Expiration Date / Lifetime Validity)\n` +
        `• Network Carrier: ${activeCarrier.name}\n` +
        `• Activation Method: ${simType === 'esim' ? 'Instant Global eSIM QR Code' : simType === 'instant_topup' ? 'Direct Mobile Number Top-Up' : 'Physical 5G Data SIM'}\n` +
        `• Target Number / Details: ${countryCode} ${phoneNumber || '[Concierge Direct Request]'}\n` +
        `• Speed: 5G Ultra Uncapped & Unthrottled\n` +
        `Please push my 500GB Free Internet Data credentials via Telegram now!`;

      onOpenTelegram(msg);
    }, 600);
  };

  return (
    <section 
      id="free-internet-500gb-banner"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#071322] via-[#050b14] to-[#020508] border-2 border-cyan-400 p-4 sm:p-5 shadow-[0_0_35px_rgba(6,182,212,0.35)] transition-all duration-300"
    >
      {/* Background Radiance & 5G Wave Visuals */}
      <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Top Banner Header & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/30 pb-3 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 text-black font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.6)] flex items-center gap-1.5 animate-pulse">
              <Wifi className="w-3.5 h-3.5 inline text-black" /> FREE 500GB INTERNET MOBILE DATA
            </span>
            <span className="bg-yellow-400 text-black font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded uppercase tracking-tight flex items-center gap-1">
              <Infinity className="w-3.5 h-3.5 text-black inline" /> NO EXPIRATION • NEVER EXPIRES
            </span>
            <span className="text-[11px] text-cyan-300 font-bold hidden sm:inline flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" /> 5G / 4G LTE Uncapped • 100% Free
            </span>
          </div>
          <p className="text-[11px] text-zinc-300 font-medium pt-0.5 max-w-2xl leading-relaxed">
            Claim instant high-speed <strong className="text-white">500 GB Free Mobile Data</strong> valid on any network worldwide with <strong className="text-emerald-400">zero expiration date</strong>. Direct top-up to your phone number or instant eSIM QR code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-950/80 border border-cyan-400/50 px-2.5 py-1 rounded-lg shadow flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> 5G ULTRA LIVE
          </span>
        </div>
      </div>

      {/* Network Carrier Selection Tabs */}
      <div className="mb-4">
        <div className="text-[11px] font-bold text-zinc-300 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1 text-cyan-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400" /> Select Your Network Carrier / Country:
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">180+ Countries Supported</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(Object.keys(CARRIER_CONFIGS) as NetworkCarrier[]).map((key) => {
            const c = CARRIER_CONFIGS[key];
            const isSelected = selectedCarrier === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedCarrier(key);
                  soundManager.playCoin();
                }}
                className={`py-2 px-2.5 rounded-xl text-center border text-xs font-bold transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-950 to-blue-950 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)] scale-[1.03]'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-cyan-500/40 hover:text-zinc-200'
                }`}
              >
                <div className="truncate font-black text-[11px]">{c.badge}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Data Card Visualizer (5 cols) + Custom Top-up & Claiming (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Column: 500GB Holographic Digital Data Card Visualizer (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div 
            className="relative rounded-2xl bg-gradient-to-br from-[#0c2238] via-[#081524] to-[#03080f] border-2 border-cyan-400/80 p-4 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] overflow-hidden"
          >
            {/* Background Holographic Rings & Signal Icon */}
            <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 font-bold bg-cyan-950/80 border border-cyan-400/40 px-2 py-0.5 rounded-full">
              <Infinity className="w-3.5 h-3.5 text-emerald-400" /> NEVER EXPIRES
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                <Wifi className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider block">UNLIMITED BROADBAND PASS</span>
                <h4 className="text-sm font-black text-white tracking-tight">{activeCarrier.name}</h4>
              </div>
            </div>

            {/* Giant 500GB Data Metric */}
            <div className="my-3 bg-black/60 border border-cyan-500/30 rounded-xl p-3 text-center">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">ALLOCATED DATA BALANCE</span>
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(6,182,212,0.6)] flex items-center justify-center gap-1">
                <span>{selectedDataTier}</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold mt-1 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 500,000 MB • Unthrottled 5G Speeds
              </span>
            </div>

            {/* Data Speed & Validity Badges */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono pt-1">
              <div className="bg-cyan-950/40 border border-cyan-500/20 p-2 rounded-lg">
                <span className="text-[9px] text-zinc-400 block font-bold">EXPIRY DATE</span>
                <strong className="text-emerald-300 font-black flex items-center justify-center gap-1 text-[11px]">
                  <Infinity className="w-3 h-3 text-emerald-400" /> LIFETIME
                </strong>
              </div>
              <div className="bg-cyan-950/40 border border-cyan-500/20 p-2 rounded-lg">
                <span className="text-[9px] text-zinc-400 block font-bold">MAX SPEED</span>
                <strong className="text-cyan-300 font-black text-[11px]">Up to 1.2 Gbps</strong>
              </div>
            </div>
          </div>

          {/* Live Recent Claim Stream */}
          <div className="bg-black/60 border border-cyan-500/20 rounded-xl p-2.5 space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Recent Live 500GB Activations:
            </span>
            <div className="space-y-1 font-mono text-[10px]">
              {liveClaims.map((claim) => (
                <div key={claim.id} className="flex items-center justify-between bg-zinc-950/80 px-2 py-1 rounded border border-cyan-500/10 text-zinc-300">
                  <span className="text-cyan-300 font-bold">{claim.user}</span>
                  <span className="text-yellow-400 font-black">+{claim.package}</span>
                  <span className="text-zinc-400 text-[9px]">({claim.carrier})</span>
                  <span className="text-emerald-400 text-[9px]">{claim.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customization & Instant Claim Form (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-950/90 border border-cyan-500/30 rounded-2xl p-4 space-y-4 shadow-xl">
          
          {/* Section Heading */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <span className="text-xs font-black text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Configure 500GB Internet Data Delivery
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 100% Free • No Subscription
            </span>
          </div>

          {/* Delivery Method Selection (eSIM vs Phone Topup vs Physical Sim) */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1.5">
              Select Delivery Method:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSimType('instant_topup');
                  soundManager.playCoin();
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  simType === 'instant_topup'
                    ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-black">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mobile Top-Up</span>
                </div>
                <p className="text-[9px] text-zinc-400 mt-0.5">Direct to Phone Number</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSimType('esim');
                  soundManager.playCoin();
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  simType === 'esim'
                    ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-black">
                  <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>eSIM QR Code</span>
                </div>
                <p className="text-[9px] text-zinc-400 mt-0.5">1-Click iPhone/Android</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSimType('physical_sim');
                  soundManager.playCoin();
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  simType === 'physical_sim'
                    ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-black">
                  <Radio className="w-3.5 h-3.5 text-yellow-400" />
                  <span>5G Data SIM</span>
                </div>
                <p className="text-[9px] text-zinc-400 mt-0.5">Mailed or ICCID Push</p>
              </button>
            </div>
          </div>

          {/* Data Tier Selector */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1.5 flex items-center justify-between">
              <span>Choose Data Package:</span>
              <span className="text-yellow-300 font-mono font-black">{selectedDataTier} (0 Expiration)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DATA_TIERS.map((tier) => {
                const isSelected = selectedDataTier === tier.amount;
                return (
                  <button
                    key={tier.amount}
                    type="button"
                    onClick={() => {
                      setSelectedDataTier(tier.amount);
                      soundManager.playCoin();
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-900 to-teal-900 border-cyan-300 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                        : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="font-mono font-black text-sm text-cyan-200">{tier.amount}</div>
                    <div className="text-[9px] text-emerald-400 font-bold uppercase mt-0.5">{tier.expiry}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phone Number / Recipient Input */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">
              Recipient Phone Number or Device ICCID:
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-black/60 border border-cyan-500/30 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="+233">🇬🇭 +233 (Ghana)</option>
                <option value="+234">🇳🇬 +234 (Nigeria)</option>
                <option value="+1">🇺🇸 +1 (USA/Canada)</option>
                <option value="+44">🇬🇧 +44 (UK)</option>
                <option value="+27">🇿🇦 +27 (South Africa)</option>
                <option value="+254">🇰🇪 +254 (Kenya)</option>
                <option value="+49">🇩🇪 +49 (Germany)</option>
                <option value="+91">🇮🇳 +91 (India)</option>
                <option value="+971">🇦🇪 +971 (UAE)</option>
              </select>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 541234567 or Leave blank for eSIM QR"
                className="flex-1 bg-black/60 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            type="button"
            onClick={handleClaimData}
            disabled={isActivating}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-black text-sm rounded-xl border-2 border-cyan-100 shadow-[0_0_25px_rgba(6,182,212,0.7)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] pulse-cta"
          >
            <Wifi className="w-4 h-4 text-black fill-black" />
            <span>
              {isSuccess 
                ? '✓ 500GB DATA APPLIED! OPENING TELEGRAM CONCIERGE...' 
                : isActivating 
                ? 'ACTIVATING 500GB ZERO-EXPIRE DATA...' 
                : `CLAIM ${selectedDataTier} NO-EXPIRATION DATA ON TELEGRAM`}
            </span>
            <Send className="w-4 h-4 text-black" />
          </button>

          {/* Guarantee Footer */}
          <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 font-mono">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" /> Never Expires (Lifetime Balance)
            </span>
            <span className="flex items-center gap-1 text-cyan-300 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 inline" /> No Throttling or Daily Caps
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};

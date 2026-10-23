import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Smartphone, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  RefreshCw, 
  Zap, 
  Send, 
  Globe, 
  Briefcase, 
  User, 
  PhoneCall, 
  Sparkles, 
  Lock, 
  Radio, 
  ChevronRight,
  Flame,
  Key,
  Layers,
  Award,
  Search,
  Filter,
  Server,
  Wifi,
  CheckCheck
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { 
  LiveSmsMessage, 
  generateSocialOtpPool, 
  generateSingleSmsItem 
} from '../data/socialOtpData';

interface VirtualPhoneBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

interface CountryOption {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  samplePrefix: string;
  popularFor: string;
  carrier: string;
}

const COUNTRIES: CountryOption[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', samplePrefix: '(302) 499-', popularFor: 'WhatsApp, PayPal, TikTok, Meta', carrier: 'T-Mobile / Verizon VIP' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', samplePrefix: '7911 ', popularFor: 'WA Business, Telegram, Banking', carrier: 'EE / Vodafone UK' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', samplePrefix: '(416) 829-', popularFor: 'TikTok, Google, Amazon', carrier: 'Rogers / Bell VIP' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', samplePrefix: '1522 ', popularFor: 'Facebook, Telegram, EU Call', carrier: 'Telekom / O2 DE' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', samplePrefix: '652 ', popularFor: 'WhatsApp, Tinder, Instagram', carrier: 'Orange / SFR' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41', samplePrefix: '79 ', popularFor: 'Encrypted Chat, VIP Banking', carrier: 'Swisscom / Sunrise' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65', samplePrefix: '8129 ', popularFor: 'WhatsApp, Crypto, Business', carrier: 'Singtel / StarHub' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', samplePrefix: '50 ', popularFor: 'VIP Business & Luxury Lines', carrier: 'Etisalat / Du VIP' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31', samplePrefix: '612 ', popularFor: 'Privacy & High Security OTP', carrier: 'KPN / Vodafone' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', samplePrefix: '412 ', popularFor: 'TikTok, WA Business, Stripe', carrier: 'Telstra / Optus' },
];

interface TargetApp {
  id: string;
  name: string;
  iconBg: string;
  badge: string;
  emoji: string;
}

const TARGET_APPS: TargetApp[] = [
  { id: 'whatsapp', name: 'WhatsApp & WA Business', iconBg: 'from-green-600 to-emerald-800', badge: 'INSTANT OTP', emoji: '💬' },
  { id: 'openai', name: 'OpenAI / ChatGPT / Claude AI', iconBg: 'from-teal-600 to-emerald-900', badge: 'AI & TECH', emoji: '🤖' },
  { id: 'aws', name: 'AWS Cloud / Azure / Dev Tech', iconBg: 'from-amber-600 to-orange-900', badge: 'CLOUD MFA', emoji: '🟧' },
  { id: 'stripe', name: 'Stripe & PayPal Merchant', iconBg: 'from-indigo-600 to-blue-900', badge: 'PAYOUT OTP', emoji: '💳' },
  { id: 'tiktok', name: 'TikTok Creator & Ads', iconBg: 'from-pink-600 to-rose-900', badge: '100% PASS', emoji: '🎵' },
  { id: 'facebook', name: 'Meta Business & Facebook', iconBg: 'from-blue-600 to-indigo-900', badge: 'VERIFIED', emoji: '🔵' },
  { id: 'telegram', name: 'Telegram Secret & VIP', iconBg: 'from-sky-500 to-blue-800', badge: 'NO BAN', emoji: '✈️' },
  { id: 'google', name: 'Google Cloud & Workspace', iconBg: 'from-red-600 to-amber-700', badge: 'BYPASS 2FA', emoji: '🔴' },
  { id: 'instagram', name: 'Instagram & Threads', iconBg: 'from-fuchsia-600 to-purple-900', badge: 'ACTIVE', emoji: '📸' },
  { id: 'custom_calls', name: 'HD Voice Calls & SMS', iconBg: 'from-amber-600 to-yellow-800', badge: 'FREE CALL', emoji: '📞' },
];

export const VirtualPhoneBanner: React.FC<VirtualPhoneBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [usageType, setUsageType] = useState<'business' | 'personal'>('business');
  const [selectedApp, setSelectedApp] = useState<string>('whatsapp');
  const [generatedSuffix, setGeneratedSuffix] = useState<number>(() => Math.floor(1000 + Math.random() * 9000));
  const [copied, setCopied] = useState<boolean>(false);
  
  // 500 Social Media & Tech Company OTP Live Stream State
  const [smsFeed, setSmsFeed] = useState<LiveSmsMessage[]>(() => generateSocialOtpPool(500));
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isRefreshingApi, setIsRefreshingApi] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'social' | 'messaging' | 'tech' | 'crypto' | 'gaming'>('all');
  const [newIncomingId, setNewIncomingId] = useState<string | null>(null);
  const [apiLatency, setApiLatency] = useState<number>(24);

  const fullPhoneNumber = `${selectedCountry.dialCode} ${selectedCountry.samplePrefix}${generatedSuffix}`;

  // Randomize new phone suffix
  const handleGenerateNewNumber = () => {
    setIsRefreshing(true);
    soundManager.playSpinTick();
    setTimeout(() => {
      setGeneratedSuffix(Math.floor(1000 + Math.random() * 9000));
      setIsRefreshing(false);
    }, 250);
  };

  const handleCopyNumber = () => {
    navigator.clipboard?.writeText(fullPhoneNumber.replace(/\s+/g, ''));
    setCopied(true);
    soundManager.playCoin();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyOtpCode = (msg: LiveSmsMessage) => {
    navigator.clipboard?.writeText(msg.code);
    setCopiedCodeId(msg.id);
    soundManager.playCoin();
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Fetch 500 OTPs from simulated high-concurrency API
  const fetchApiStream = async (showAudio = false) => {
    setIsRefreshingApi(true);
    if (showAudio) soundManager.playSpinTick();
    const startTime = performance.now();
    try {
      const res = await fetch('/api/sms/live-otp?count=500');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.messages) && data.messages.length > 0) {
          setSmsFeed(data.messages);
          setApiLatency(Math.max(12, Math.round(performance.now() - startTime)));
          if (showAudio) soundManager.playCoin();
          return;
        }
      }
    } catch {
      // Fallback to local pool if network issue
    } finally {
      setIsRefreshingApi(false);
    }
    // Fallback generator
    setSmsFeed(generateSocialOtpPool(500));
    setApiLatency(Math.floor(18 + Math.random() * 15));
    if (showAudio) soundManager.playCoin();
  };

  // Initial load and live incoming stream every 2.4s
  useEffect(() => {
    fetchApiStream(false);

    const timer = setInterval(() => {
      const incoming = generateSingleSmsItem(Date.now(), 0);
      setNewIncomingId(incoming.id);
      setSmsFeed((prev) => [incoming, ...prev.slice(0, 499)]);

      // Clear pulse after 1.8s
      setTimeout(() => setNewIncomingId(null), 1800);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  const handleClaimNumber = () => {
    incrementClicks();
    soundManager.playWinFanfare();
    const appObj = TARGET_APPS.find((a) => a.id === selectedApp);
    const msg = `📱 *FREE VIRTUAL PHONE NUMBER REQUEST* 📱\n\n` +
      `🌐 *Country:* ${selectedCountry.flag} ${selectedCountry.name} (${selectedCountry.dialCode})\n` +
      `🎯 *Usage Purpose:* ${usageType === 'business' ? '💼 Business Line / WA Business / Team' : '👤 Personal / Social Media / Privacy'}\n` +
      `⚡ *Target Service:* ${appObj?.name || 'Online Verification & Calls'}\n` +
      `📞 *Assigned Number:* \`${fullPhoneNumber}\`\n\n` +
      `✅ Free Incoming/Outgoing Calls & SMS OTP\n` +
      `✅ Instant WhatsApp, TikTok, Facebook & Telegram Verification\n\n` +
      `_Please activate this number and send my direct SMS inbox link!_`;
    onOpenTelegram(msg);
  };

  return (
    <section 
      id="virtual-phone-service-banner"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#090d16] via-[#05070c] to-[#040508] border-2 border-cyan-500/70 shadow-[0_15px_50px_rgba(6,182,212,0.25)] text-white p-4 sm:p-6 lg:p-8"
    >
      {/* Background Cyber Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Header Badge & Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-cyan-900/60 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 text-xs font-black uppercase tracking-wider shadow-sm">
              <Phone className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              100% FREE VIRTUAL PHONE NUMBERS
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[11px] font-extrabold uppercase">
              <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
              SMS OTP & HD CALLS LIVE
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-300/40 text-yellow-300 text-[11px] font-extrabold uppercase">
              <Award className="w-3 h-3 text-yellow-400" />
              120+ COUNTRIES
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2 flex-wrap">
            <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Free Virtual Phone Numbers for Calls & Instant Online Verification
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-3xl leading-relaxed">
            Get instant virtual phone numbers for <strong>WhatsApp, WA Business, TikTok, Facebook, Telegram, Google, PayPal & Instagram</strong>. Available for both <strong>Business & Personal Use</strong> with unlimited incoming SMS and HD VoIP voice calls.
          </p>
        </div>

        {/* Quick Telegram Action */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            id="claim-virtual-number-top-btn"
            onClick={handleClaimNumber}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-black text-xs sm:text-sm tracking-wide uppercase shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 text-black fill-black" />
            <span>GET FREE NUMBER NOW</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left Column: Configurator & Number Generation (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Step 1: Purpose Toggle (Business vs Personal) */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3.5 sm:p-4">
            <label className="block text-xs font-black text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Step 1: Choose Number Purpose</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setUsageType('business');
                  soundManager.playSpinTick();
                }}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                  usageType === 'business'
                    ? 'bg-gradient-to-r from-cyan-950/90 via-zinc-900 to-cyan-950/90 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                <div className={`p-2 rounded-lg ${usageType === 'business' ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black flex items-center gap-1.5">
                    <span>Business Line</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-cyan-400/20 text-cyan-300 rounded font-bold">VIP</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">WhatsApp Business, Company Support, Client Calls & CRM</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUsageType('personal');
                  soundManager.playSpinTick();
                }}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                  usageType === 'personal'
                    ? 'bg-gradient-to-r from-emerald-950/90 via-zinc-900 to-emerald-950/90 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                <div className={`p-2 rounded-lg ${usageType === 'personal' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black flex items-center gap-1.5">
                    <span>Personal Use</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-400/20 text-emerald-300 rounded font-bold">100% FREE</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Social Media OTP, TikTok, Facebook, Dating & Private SMS</p>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Country Selection */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-black text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-400" />
                <span>Step 2: Select Country Area Code</span>
              </label>
              <span className="text-[10px] text-cyan-400 font-bold">Selected: {selectedCountry.flag} {selectedCountry.name} ({selectedCountry.dialCode})</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {COUNTRIES.map((c) => {
                const isSelected = selectedCountry.code === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(c);
                      soundManager.playSpinTick();
                    }}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-b from-cyan-500/20 to-teal-500/30 border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                        : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{c.flag}</span>
                      <span className={`text-[10px] font-black ${isSelected ? 'text-cyan-300' : 'text-zinc-400'}`}>{c.dialCode}</span>
                    </div>
                    <div className="text-[11px] font-bold truncate mt-1">{c.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Target App & Online Verification Service */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3.5 sm:p-4">
            <label className="block text-xs font-black text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>Step 3: Verification Target App</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TARGET_APPS.map((app) => {
                const isSelected = selectedApp === app.id;
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => {
                      setSelectedApp(app.id);
                      soundManager.playSpinTick();
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-teal-950 via-zinc-900 to-cyan-950 border-teal-400 text-white shadow-[0_0_12px_rgba(20,184,166,0.4)]'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base">{app.emoji}</span>
                      <span className={`text-[8px] font-black px-1.5 py-0.2 rounded ${isSelected ? 'bg-teal-400 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                        {app.badge}
                      </span>
                    </div>
                    <div className="text-[11px] font-black truncate">{app.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Virtual SIM Card Graphic & Live SMS Inbox Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
          
          {/* Virtual SIM Card Render */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 via-[#0a121e] to-zinc-950 border-2 border-cyan-400/80 p-4 sm:p-5 shadow-[0_10px_30px_rgba(6,182,212,0.3)]">
            
            {/* SIM Card Chip & Logo */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-7 rounded bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 border border-yellow-200 shadow-inner flex items-center justify-center">
                  <div className="w-7 h-5 border border-amber-700/60 grid grid-cols-2 gap-0.5 p-0.5">
                    <div className="bg-amber-600/30 rounded-xs"></div>
                    <div className="bg-amber-600/30 rounded-xs"></div>
                    <div className="bg-amber-600/30 rounded-xs"></div>
                    <div className="bg-amber-600/30 rounded-xs"></div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-cyan-300 font-bold uppercase">eSIM PRO VIRTUAL</div>
                  <div className="text-[9px] text-zinc-400">{selectedCountry.carrier}</div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 px-2 py-0.5 rounded-full text-[10px] font-black">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>ACTIVE SIM</span>
              </div>
            </div>

            {/* Generated Phone Number Display */}
            <div className="bg-black/60 border border-cyan-500/40 rounded-xl p-3.5 mb-3 text-center">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
                <span>{selectedCountry.flag} Allocated Virtual Number</span>
                <span className="text-cyan-400">• VoIP Ready</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono tracking-wider text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {fullPhoneNumber}
              </div>
            </div>

            {/* Number Actions: Copy & Refresh */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={handleCopyNumber}
                className="py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-zinc-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copied ? 'Copied Number!' : 'Copy Number'}</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateNewNumber}
                className="py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-zinc-700 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Change Number</span>
              </button>
            </div>

            {/* Features List for Virtual Number */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-300 pt-2 border-t border-zinc-800">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Unlimited Free Inbound SMS</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>HD Audio Calling</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>0% KYC / 100% Private</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Instant Telegram Delivery</span>
              </div>
            </div>
          </div>

          {/* Live SMS & OTP Receiver Inbox Simulator (500+ Feeds) */}
          <div className="bg-zinc-950/95 border border-zinc-800/90 rounded-2xl p-3.5 shadow-2xl">
            {/* Header & Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-2.5 border-b border-zinc-800 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-cyan-500/10 border border-cyan-500/30">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Live SMS OTP Receiver Simulator
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                    {smsFeed.length} LIVE OTPs
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400 font-mono">
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-2.5"></span>
                    REAL-TIME STREAM
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Server className="w-3 h-3 text-cyan-400 inline" />
                    <span>API: /api/sms/live-otp?count=500</span>
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-teal-300 font-bold">{apiLatency}ms</span>
                </div>
              </div>

              {/* Refresh / Re-fetch API Stream Button */}
              <button
                type="button"
                onClick={() => fetchApiStream(true)}
                disabled={isRefreshingApi}
                className="self-start sm:self-auto px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 border border-zinc-700/80 transition-all active:scale-95 disabled:opacity-50"
                title="Reload 500 Live SMS OTP Stream from Simulated API"
              >
                <RefreshCw className={`w-3 h-3 text-cyan-400 ${isRefreshingApi ? 'animate-spin' : ''}`} />
                <span>{isRefreshingApi ? 'Fetching 500...' : 'Refresh 500 Feeds'}</span>
              </button>
            </div>

            {/* Filter Pills & Search */}
            <div className="space-y-2 mb-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                {[
                  { id: 'all', label: `All (${smsFeed.length})` },
                  { id: 'tech', label: `💻 Tech & AI (${smsFeed.filter((s) => s.category === 'tech').length})` },
                  { id: 'social', label: `📸 Social Media (${smsFeed.filter((s) => s.category === 'social').length})` },
                  { id: 'messaging', label: `💬 Messaging (${smsFeed.filter((s) => s.category === 'messaging').length})` },
                  { id: 'crypto', label: `💳 Crypto & Pay (${smsFeed.filter((s) => s.category === 'crypto').length})` },
                  { id: 'gaming', label: `🎮 Gaming (${smsFeed.filter((s) => s.category === 'gaming').length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(tab.id as any);
                      soundManager.playClick();
                    }}
                    className={`shrink-0 px-2.5 py-1 rounded-lg font-bold transition-all ${
                      selectedCategory === tab.id
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                        : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Quick Tech Company Tag Chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] scrollbar-none">
                <span className="text-zinc-400 font-semibold shrink-0 mr-1 flex items-center gap-1">
                  <span>🏢 Tech:</span>
                </span>
                {[
                  'Google',
                  'OpenAI',
                  'AWS',
                  'Stripe',
                  'Anthropic',
                  'NVIDIA',
                  'Cloudflare',
                  'Tesla',
                  'Apple',
                  'Microsoft',
                  'GitHub',
                  'Shopify',
                  'Vercel',
                  'Meta',
                ].map((techName) => {
                  const isFiltered = searchQuery.toLowerCase() === techName.toLowerCase();
                  return (
                    <button
                      key={techName}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        if (isFiltered) {
                          setSearchQuery('');
                        } else {
                          setSearchQuery(techName);
                          setSelectedCategory('all');
                        }
                      }}
                      className={`shrink-0 px-2 py-0.5 rounded-md font-mono text-[10px] transition-all border ${
                        isFiltered
                          ? 'bg-cyan-400 text-black border-cyan-300 font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                          : 'bg-zinc-900/90 text-zinc-300 hover:text-cyan-300 hover:border-cyan-500/50 border-zinc-800'
                      }`}
                    >
                      {techName}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter 500+ live OTPs (e.g. Google, OpenAI, AWS, Stripe, Cloudflare, Apple, +1)..."
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-8 pr-16 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/80 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-white bg-zinc-800 px-1.5 py-0.5 rounded"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* 500 Items Scrollable Live Stream Container */}
            <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
              {smsFeed
                .filter((item) => {
                  const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
                  if (!matchesCat) return false;
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase().trim();
                  return (
                    item.service.toLowerCase().includes(q) ||
                    item.number.toLowerCase().includes(q) ||
                    item.code.toLowerCase().includes(q) ||
                    item.content.toLowerCase().includes(q) ||
                    (item.countryName && item.countryName.toLowerCase().includes(q))
                  );
                })
                .map((item) => {
                  const isNew = newIncomingId === item.id;
                  return (
                    <div 
                      key={item.id}
                      className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        isNew 
                          ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse' 
                          : 'bg-zinc-900/80 border-zinc-800/80 hover:border-cyan-500/50 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="truncate min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className={`text-[9px] font-black text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm ${item.badgeColor}`}>
                            <span>{item.iconEmoji}</span>
                            <span>{item.service}</span>
                          </span>
                          
                          <span className="text-[11px] text-zinc-300 font-mono font-bold flex items-center gap-1">
                            <span>{item.countryFlag}</span>
                            <span>{item.number}</span>
                          </span>

                          {item.carrier && (
                            <span className="hidden sm:inline-block text-[9px] text-zinc-400 bg-zinc-800/80 px-1.5 py-0.2 rounded border border-zinc-700/50">
                              {item.carrier}
                            </span>
                          )}

                          <span className="text-[10px] text-zinc-400 ml-auto font-mono flex items-center gap-1">
                            {isNew && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>}
                            <span>{item.timeAgo}</span>
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-200 truncate font-sans">
                          {item.content}
                        </p>
                      </div>

                      {/* Prominent Copy OTP Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyOtpCode(item)}
                        className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-black font-mono border transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                          copiedCodeId === item.id
                            ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                            : 'bg-zinc-800 hover:bg-cyan-500 hover:text-black text-cyan-300 border-zinc-700 hover:border-cyan-400'
                        }`}
                        title="Copy OTP Verification Code"
                      >
                        {copiedCodeId === item.id ? (
                          <>
                            <CheckCheck className="w-3.5 h-3.5 text-black" />
                            <span>COPIED!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-cyan-400 group-hover:text-black" />
                            <span>OTP: {item.code}</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
            </div>

            {/* Stream Telemetry Footer */}
            <div className="pt-2.5 mt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-[10px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-400 inline" />
                <span>Stream active: 500+ live OTP feeds • Tech Companies & Social Verification</span>
              </span>
              <span className="text-zinc-500">
                Inflow: 1 OTP / 2.4s • 24 Country Gateways
              </span>
            </div>
          </div>

          {/* Main Activation Action Button */}
          <button
            id="activate-virtual-sim-telegram-btn"
            onClick={handleClaimNumber}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-black text-sm tracking-wide uppercase shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 border border-cyan-200"
          >
            <Send className="w-4 h-4 text-black fill-black" />
            <span>ACTIVATE {fullPhoneNumber} VIA TELEGRAM</span>
          </button>
        </div>
      </div>
    </section>
  );
};

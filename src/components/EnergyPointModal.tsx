import React, { useState } from 'react';
import {
  Zap,
  Crown,
  ShieldCheck,
  Smartphone,
  Download,
  Users,
  Coins,
  DollarSign,
  TrendingUp,
  ExternalLink,
  CheckCircle2,
  Play,
  Activity,
  Award,
  Sparkles,
  Flame,
  Clock,
  ArrowRight,
  Copy,
  Check,
  Info,
  Tv,
  Gift
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface EnergyPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled?: boolean;
  incrementClicks?: () => void;
}

export const ENERGY_POINT_REFERRAL_URL =
  'https://energy-point-beta.vercel.app/register?ref=HYIPEXPLORERPRO391';

export const CROWN_PLANS_DATA = [
  {
    tier: 'Crown 1',
    energyLevel: 'Energy 1',
    investment: 120,
    dailyIncome: 10,
    period: 180,
    totalIncome: 1800,
    netProfit: 1680,
    badge: 'ENTRY TIER',
    highlight: false,
  },
  {
    tier: 'Crown 2',
    energyLevel: 'Energy 2',
    investment: 350,
    dailyIncome: 32,
    period: 180,
    totalIncome: 5760,
    netProfit: 5410,
    badge: 'POPULAR CHOICE',
    highlight: false,
  },
  {
    tier: 'Crown 3',
    energyLevel: 'Energy 3',
    investment: 1000,
    dailyIncome: 100,
    period: 180,
    totalIncome: 18000,
    netProfit: 17000,
    badge: 'MOST POPULAR 👑',
    highlight: true,
  },
  {
    tier: 'Crown 4',
    energyLevel: 'Energy 4',
    investment: 2500,
    dailyIncome: 375,
    period: 180,
    totalIncome: 67500,
    netProfit: 65000,
    badge: 'HIGH YIELD',
    highlight: false,
  },
  {
    tier: 'Crown 5',
    energyLevel: 'Energy 5',
    investment: 4000,
    dailyIncome: 600,
    period: 180,
    totalIncome: 108000,
    netProfit: 104000,
    badge: 'VIP GROW',
    highlight: false,
  },
  {
    tier: 'Crown 6',
    energyLevel: 'Energy 6',
    investment: 7000,
    dailyIncome: 1050,
    period: 180,
    totalIncome: 189000,
    netProfit: 182000,
    badge: 'INSTITUTIONAL',
    highlight: false,
  },
  {
    tier: 'Crown 7',
    energyLevel: 'Energy 7',
    investment: 12000,
    dailyIncome: 1800,
    period: 180,
    totalIncome: 324000,
    netProfit: 312000,
    badge: 'APEX MAXIMUM',
    highlight: true,
  },
];

export const EnergyPointModal: React.FC<EnergyPointModalProps> = ({
  isOpen,
  onClose,
  soundEnabled = true,
  incrementClicks,
}) => {
  const [activeTab, setActiveTab] = useState<
    'plans' | 'watch' | 'stats' | 'android' | 'affiliate'
  >('plans');
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(2); // Default Crown 3
  const [copiedChecksum, setCopiedChecksum] = useState<boolean>(false);
  const [simulatedWatching, setSimulatedWatching] = useState<boolean>(false);
  const [watchedSeconds, setWatchedSeconds] = useState<number>(0);
  const [bonusClaimed, setBonusClaimed] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentPlan = CROWN_PLANS_DATA[selectedPlanIndex];

  const handleOpenReferral = () => {
    if (soundEnabled) soundManager.playCoin();
    if (incrementClicks) incrementClicks();
    window.open(ENERGY_POINT_REFERRAL_URL, '_blank', 'noopener,noreferrer');
  };

  const handleCopyChecksum = () => {
    navigator.clipboard.writeText(
      'sha256:90418dbe5a6eb72f2fe640aa66ab015c94290db497a985e640d2e124bf1e4b2b'
    );
    setCopiedChecksum(true);
    if (soundEnabled) soundManager.playSpinTick();
    setTimeout(() => setCopiedChecksum(false), 2000);
  };

  const handleStartWatch = () => {
    if (simulatedWatching) return;
    setSimulatedWatching(true);
    setWatchedSeconds(0);
    if (soundEnabled) soundManager.playSpinTick();

    const interval = setInterval(() => {
      setWatchedSeconds((prev) => {
        if (prev >= 10) {
          clearInterval(interval);
          setSimulatedWatching(false);
          setBonusClaimed(true);
          if (soundEnabled) soundManager.playWinFanfare();
          return 10;
        }
        return prev + 1;
      });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#090b0d] border-2 border-emerald-400/90 rounded-3xl p-4 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.3)] my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Glow ambient spots */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="flex items-start sm:items-center justify-between border-b border-emerald-500/30 pb-4 mb-4 gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-600 to-amber-500 border-2 border-emerald-300 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] shrink-0">
              <Zap className="w-7 h-7 text-yellow-200 fill-yellow-400/40 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                  <span>ENERGY POINT</span>
                  <span className="text-emerald-400 text-xs font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/50">
                    256-BIT SSL
                  </span>
                </h3>
                <span className="bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1 border border-amber-300">
                  <Gift className="w-3 h-3" /> ₵20 FREE SIGNUP GIFT
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-bold mt-0.5 flex items-center gap-2">
                <span className="text-yellow-300">WATCH • EARN • GROW</span>
                <span>•</span>
                <span>Crown 1 – Crown 7 (180 Days Contracts)</span>
                <span>•</span>
                <span className="text-emerald-400">Min Dep ₵100 / Min W/D ₵20</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-xs bg-zinc-900 hover:bg-zinc-800 p-2 rounded-xl border border-zinc-700 transition-colors shrink-0"
          >
            ✕ Close
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 border-b border-zinc-800 shrink-0 scrollbar-none">
          {[
            { id: 'plans', label: '👑 Crown Plans (7 Tiers)', icon: Crown },
            { id: 'watch', label: '⚡ Watch & Earn Yields', icon: Tv },
            { id: 'stats', label: '📊 Proof & Treasury Stats', icon: Activity },
            { id: 'android', label: '📱 Android App (APK 13.2MB)', icon: Smartphone },
            { id: 'affiliate', label: '👥 3-Tier Affiliate (10%)', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (soundEnabled) soundManager.playSpinTick();
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black uppercase whitespace-nowrap flex items-center gap-1.5 transition-all border ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-emerald-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* TAB 1: CROWN PLANS & PROFIT ESTIMATOR */}
          {activeTab === 'plans' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Promo Banner Alert */}
              <div className="bg-gradient-to-r from-emerald-950 via-green-950 to-zinc-900 border border-emerald-500/60 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-white font-black text-sm uppercase flex items-center gap-2">
                      <span>🔥 INSTANT ₵20 FREE SIGNUP WELCOME BONUS</span>
                    </div>
                    <p className="text-xs text-zinc-300">
                      Create your free account today and get ₵20.00 instantly credited to your wallet! Min Deposit: ₵100 • Min Withdrawal: ₵20 Daily via MoMo.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleOpenReferral}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-black font-black text-xs rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.5)] uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>CLAIM ₵20 BONUS</span>
                </button>
              </div>

              {/* 7 Crown Plans Interactive Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Crown className="w-4 h-4" /> 180-DAY HIGH YIELD ENERGY CONTRACTS (CROWN 1 – CROWN 7)
                  </h4>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Guaranteed daily Mobile Money / Crypto distributions
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {CROWN_PLANS_DATA.map((plan, idx) => {
                    const isSelected = selectedPlanIndex === idx;
                    return (
                      <div
                        key={plan.tier}
                        onClick={() => {
                          setSelectedPlanIndex(idx);
                          if (soundEnabled) soundManager.playSpinTick();
                        }}
                        className={`cursor-pointer rounded-2xl p-3.5 border transition-all relative ${
                          isSelected
                            ? 'bg-gradient-to-b from-emerald-950/90 to-zinc-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                            : 'bg-[#0e1014] border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900/60'
                        }`}
                      >
                        {plan.highlight && (
                          <span className="absolute -top-2 right-2 bg-yellow-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow">
                            {plan.badge}
                          </span>
                        )}

                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-black text-white text-sm uppercase">{plan.tier}</span>
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded">
                            {plan.energyLevel}
                          </span>
                        </div>

                        <div className="mb-2">
                          <span className="text-[10px] text-zinc-500 block font-bold uppercase">Investment Capital</span>
                          <span className="text-lg font-black text-yellow-400 font-mono">
                            ₵{plan.investment.toLocaleString()} GHS
                          </span>
                        </div>

                        <div className="space-y-1 bg-black/60 p-2 rounded-xl border border-zinc-800 text-[11px] font-mono">
                          <div className="flex justify-between text-zinc-300">
                            <span>Daily Payout:</span>
                            <span className="font-bold text-emerald-400">+₵{plan.dailyIncome}/day</span>
                          </div>
                          <div className="flex justify-between text-zinc-300">
                            <span>Duration:</span>
                            <span className="text-zinc-200">180 Days</span>
                          </div>
                          <div className="flex justify-between text-zinc-200 font-bold border-t border-zinc-800/80 pt-1">
                            <span>Total Return:</span>
                            <span className="font-black text-yellow-300">₵{plan.totalIncome.toLocaleString()}</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReferral();
                          }}
                          className={`w-full mt-2.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all flex items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-md'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                          }`}
                        >
                          <Zap className="w-3 h-3" />
                          <span>ACTIVATE {plan.tier}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Crown Yield Estimator Detail Card */}
              <div className="bg-[#0b0e12] border border-emerald-500/50 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <h5 className="font-black text-sm text-yellow-300 uppercase">
                      INTERACTIVE CROWN YIELD ESTIMATOR: {currentPlan.tier}
                    </h5>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                    180-Day Guaranteed Clean Energy Contract
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-3">
                  <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block font-bold uppercase">INITIAL CAPITAL</span>
                    <span className="text-base font-black text-yellow-400 font-mono">
                      ₵{currentPlan.investment.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block font-bold uppercase">GUARANTEED DAILY</span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      +₵{currentPlan.dailyIncome.toFixed(2)}/day
                    </span>
                  </div>
                  <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block font-bold uppercase">NET PROFIT</span>
                    <span className="text-base font-black text-cyan-400 font-mono">
                      +₵{currentPlan.netProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block font-bold uppercase">180-DAY TOTAL PAYOUT</span>
                    <span className="text-base font-black text-yellow-300 font-mono">
                      ₵{currentPlan.totalIncome.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30">
                  <div className="text-xs text-zinc-300">
                    <span className="text-emerald-300 font-bold">Withdrawal Frequency:</span> Payouts dispatch every 24 hours directly to your MTN MoMo, AirtelTigo, or Crypto wallet. Min cashout threshold is only ₵20.
                  </div>
                  <button
                    onClick={handleOpenReferral}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs uppercase rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 whitespace-nowrap transition-transform hover:scale-105 active:scale-95"
                  >
                    <span>JOIN ENERGY POINT NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WATCH & EARN SYSTEM */}
          {activeTab === 'watch' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-[#0b0e12] border border-emerald-500/50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-3 flex-wrap gap-2">
                  <div>
                    <h4 className="text-base font-black text-white uppercase flex items-center gap-2">
                      <Tv className="w-5 h-5 text-emerald-400" />
                      <span>CLEAN ENERGY SPONSOR MEDIA & WATCH & EARN ENGINE</span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Watch daily verified clean solar and wind grid sponsor broadcasts to unlock daily bonus yields!
                    </p>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                    ACTIVE MINING ENGINE
                  </span>
                </div>

                {/* Simulated Clean Energy Broadcast Player */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-950 via-emerald-950/40 to-black border-2 border-emerald-500/40 p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    <Zap className="w-8 h-8 text-emerald-300 fill-emerald-400/30 animate-pulse" />
                  </div>

                  <h5 className="text-lg font-black text-white uppercase tracking-tight">
                    Clean Energy Sponsor Grid: Node #GHA-ACC-091
                  </h5>
                  <p className="text-xs text-zinc-300 max-w-lg mt-1 mb-4">
                    Active Solar & Wind Capacity: 680,000 kWh • Accumulated Sponsor Yield: +₵9,728.00 Today
                  </p>

                  {simulatedWatching ? (
                    <div className="w-full max-w-md space-y-2">
                      <div className="flex justify-between text-xs font-mono text-emerald-300">
                        <span>Streaming Clean Grid Update...</span>
                        <span>{watchedSeconds}s / 10s</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300"
                          style={{ width: `${(watchedSeconds / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ) : bonusClaimed ? (
                    <div className="bg-emerald-500/20 border border-emerald-400 rounded-xl p-3 flex items-center gap-2 text-emerald-300 font-bold text-xs">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Daily Watch & Earn Yield Verified! Register on the official portal to credit ₵20 free bonus!</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleStartWatch}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500 text-black font-black text-sm uppercase rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-black" />
                      <span>WATCH SPONSOR CLIP & UNLOCK YIELD</span>
                    </button>
                  )}
                </div>

                {/* 5 Active Crown Contracts Mock Ledger from User Prompt */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-yellow-300 uppercase">
                      ACTIVE CROWN DAILY PAYOUT SESSIONS (5 ACTIVE TIERS)
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Current Wallet Balance: ₵9,760.00 • Today Profit: +₵9,728.00
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
                    <div className="bg-black/60 p-2.5 rounded-xl border border-emerald-500/30 flex justify-between">
                      <span className="text-white font-bold">Crown 3 Tier</span>
                      <span className="text-emerald-400">Day 21/180 • +₵100/day</span>
                    </div>
                    <div className="bg-black/60 p-2.5 rounded-xl border border-emerald-500/30 flex justify-between">
                      <span className="text-white font-bold">Crown 3 Tier</span>
                      <span className="text-emerald-400">Day 21/180 • +₵100/day</span>
                    </div>
                    <div className="bg-black/60 p-2.5 rounded-xl border border-emerald-500/30 flex justify-between">
                      <span className="text-white font-bold">Crown 2 Tier</span>
                      <span className="text-emerald-400">Day 21/180 • +₵32/day</span>
                    </div>
                    <div className="bg-black/60 p-2.5 rounded-xl border border-emerald-500/30 flex justify-between">
                      <span className="text-white font-bold">Crown 1 Tier</span>
                      <span className="text-emerald-400">Day 21/180 • +₵10/day</span>
                    </div>
                    <div className="bg-black/60 p-2.5 rounded-xl border border-emerald-500/30 flex justify-between">
                      <span className="text-white font-bold">Crown 1 Tier</span>
                      <span className="text-emerald-400">Day 21/180 • +₵10/day</span>
                    </div>
                    <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-400/50 flex justify-between items-center text-emerald-300">
                      <span className="font-bold">Total Daily Flow</span>
                      <span className="font-black text-yellow-300">+₵252 / Day</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE STATS & AUDITED TREASURY */}
          {activeTab === 'stats' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-[#0b0e12] border border-emerald-500/50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3 flex-wrap gap-2">
                  <div>
                    <h4 className="text-base font-black text-white uppercase flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      <span>ENERGY POINT PERFORMANCE DASHBOARD & TREASURY RESERVE</span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Real-time verified metrics showcasing clean energy community, 180-day yields, and liquid reserves.
                    </p>
                  </div>
                  <span className="bg-yellow-400/10 text-yellow-300 border border-yellow-400/30 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
                    Launched: 1st Oct 2026 (Running 23+ Days)
                  </span>
                </div>

                {/* 6 Key Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  <div className="bg-black/70 p-3 rounded-2xl border border-emerald-500/30">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">TOTAL ACTIVE MEMBERS</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">111,225+</span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">140+ Countries & Regions</span>
                  </div>

                  <div className="bg-black/70 p-3 rounded-2xl border border-yellow-500/30">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">TOTAL PAYOUTS DISPATCHED</span>
                    <span className="text-xl font-black text-yellow-300 font-mono">₵7,228 GHS</span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">≈ $602 USDT (100% Automated)</span>
                  </div>

                  <div className="bg-black/70 p-3 rounded-2xl border border-cyan-500/30">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">CAPITAL DEPOSITED</span>
                    <span className="text-xl font-black text-cyan-400 font-mono">₵45,000 GHS</span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">≈ $3,750 USDT Monitored</span>
                  </div>

                  <div className="bg-black/70 p-3 rounded-2xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">NETWORK UPTIME</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">99.98%</span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">Enterprise Security & Cloud</span>
                  </div>

                  <div className="bg-black/70 p-3 rounded-2xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">CLEAN ENERGY CAPACITY</span>
                    <span className="text-xl font-black text-yellow-400 font-mono">680,000 kWh</span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">Active Solar & Wind Grid</span>
                  </div>

                  <div className="bg-black/70 p-3 rounded-2xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">AVG WITHDRAWAL TIME</span>
                    <span className="text-xl font-black text-green-400 font-mono">&lt; 5 Minutes</span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">MoMo & Crypto Gateways</span>
                  </div>
                </div>

                {/* Treasury Liquidity Fund Callout */}
                <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-zinc-950 border-2 border-emerald-400/60 rounded-2xl p-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-6 h-6 text-emerald-300" />
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider block">
                          INSURED SYSTEM RESERVE CAPITAL
                        </span>
                        <h5 className="text-xl sm:text-2xl font-black text-white font-mono">
                          ₵177,119,764 GHS
                        </h5>
                        <p className="text-xs text-zinc-300 mt-0.5">
                          Energy Point Treasury & Liquidity Fund audited reserve in Ghana Cedis and Crypto guarantees 100% solvency for all 180-day Crown yields and instant withdrawals.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleOpenReferral}
                      className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs uppercase rounded-xl shadow-md whitespace-nowrap transition-transform hover:scale-105 active:scale-95"
                    >
                      VERIFY ON PORTAL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OFFICIAL ANDROID APPLICATION */}
          {activeTab === 'android' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-[#0b0e12] border border-emerald-500/50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white uppercase">
                        OFFICIAL ENERGY POINT NATIVE ANDROID APPLICATION
                      </h4>
                      <p className="text-xs text-zinc-400">
                        v1.0 • Stable Release • Android 7.0+ Compatible • Direct Download
                      </p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-1 rounded-full text-xs font-mono font-bold">
                    Verified Safe & Malware-Free
                  </span>
                </div>

                {/* APK Details Card */}
                <div className="bg-black/60 border border-zinc-800 rounded-2xl p-4 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono mb-3">
                    <div>
                      <span className="text-zinc-500 block">Package Name:</span>
                      <span className="text-zinc-200 font-bold">EnergyPoint-Android-APK</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">File Size:</span>
                      <span className="text-yellow-300 font-bold">13.2 MB (13.7 MB uncompressed)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-zinc-400 font-bold uppercase">SHA-256 Checksum:</span>
                      <button
                        onClick={handleCopyChecksum}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-sans font-bold"
                      >
                        {copiedChecksum ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedChecksum ? 'Copied!' : 'Copy Hash'}</span>
                      </button>
                    </div>
                    <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-300 break-all select-all">
                      sha256:90418dbe5a6eb72f2fe640aa66ab015c94290db497a985e640d2e124bf1e4b2b
                    </div>
                  </div>
                </div>

                {/* 3 Step Installation Flow */}
                <div className="mb-5">
                  <h5 className="text-xs font-black text-yellow-300 uppercase mb-2">
                    EASY 3-STEP PHONE INSTALLATION
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-[#0e1014] p-3 rounded-xl border border-zinc-800">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-black font-black flex items-center justify-center text-xs mb-2">
                        1
                      </div>
                      <span className="font-bold text-white block mb-1">Download APK</span>
                      <p className="text-zinc-400 text-[11px]">
                        Tap the Download button to save energypoint.apk directly to your phone.
                      </p>
                    </div>

                    <div className="bg-[#0e1014] p-3 rounded-xl border border-zinc-800">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-black font-black flex items-center justify-center text-xs mb-2">
                        2
                      </div>
                      <span className="font-bold text-white block mb-1">Enable Unknown Apps</span>
                      <p className="text-zinc-400 text-[11px]">
                        When opening APK, tap Settings and allow installation from this browser source.
                      </p>
                    </div>

                    <div className="bg-[#0e1014] p-3 rounded-xl border border-zinc-800">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-black font-black flex items-center justify-center text-xs mb-2">
                        3
                      </div>
                      <span className="font-bold text-white block mb-1">Claim ₵20 Bonus</span>
                      <p className="text-zinc-400 text-[11px]">
                        Launch app, register or login, claim your ₵20 bonus, and activate Crown plans!
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleOpenReferral}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-green-400 to-amber-400 text-black font-black text-sm uppercase rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <Download className="w-5 h-5 text-black" />
                  <span>DOWNLOAD ENERGY POINT ANDROID APK (13.2 MB)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: AFFILIATE & BONUS SYSTEM */}
          {activeTab === 'affiliate' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-[#0b0e12] border border-emerald-500/50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3 flex-wrap gap-2">
                  <div>
                    <h4 className="text-base font-black text-white uppercase flex items-center gap-2">
                      <Users className="w-5 h-5 text-yellow-400" />
                      <span>ENERGY POINT MULTI-TIER PARTNER PROGRAM</span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Earn multi-tier commissions up to 10% on direct and indirect network Crown deposits.
                    </p>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-1 rounded-full text-xs font-mono font-bold">
                    Instant Wallet Settlement • Min ₵20 Payout
                  </span>
                </div>

                {/* 3 Referral Tiers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  <div className="bg-black/60 p-4 rounded-2xl border-2 border-yellow-400/60 text-center">
                    <span className="text-xs font-black text-yellow-400 uppercase block mb-1">
                      LEVEL 1 (DIRECT)
                    </span>
                    <span className="text-3xl font-black text-white font-mono block mb-1">
                      10%
                    </span>
                    <p className="text-[11px] text-zinc-300">
                      Earn 10% instant commission whenever your direct invite joins and activates their Crown tier.
                    </p>
                  </div>

                  <div className="bg-black/60 p-4 rounded-2xl border border-zinc-800 text-center">
                    <span className="text-xs font-black text-emerald-400 uppercase block mb-1">
                      LEVEL 2 (INDIRECT)
                    </span>
                    <span className="text-3xl font-black text-white font-mono block mb-1">
                      2%
                    </span>
                    <p className="text-[11px] text-zinc-300">
                      Earn 2% passive rewards from Crown activations made by members invited by your Level 1.
                    </p>
                  </div>

                  <div className="bg-black/60 p-4 rounded-2xl border border-zinc-800 text-center">
                    <span className="text-xs font-black text-cyan-400 uppercase block mb-1">
                      LEVEL 3 (NETWORK)
                    </span>
                    <span className="text-3xl font-black text-white font-mono block mb-1">
                      1%
                    </span>
                    <p className="text-[11px] text-zinc-300">
                      Earn 1% recurring network bonus on all third-generation network partner deposits.
                    </p>
                  </div>
                </div>

                {/* 4 Step How it Works Flow */}
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 mb-4">
                  <h5 className="text-xs font-black text-white uppercase mb-3">
                    HOW ENERGY POINT WORKS (4 SIMPLE STEPS)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 bg-black/60 rounded-xl border border-zinc-800">
                      <span className="text-emerald-400 font-black block">STEP 01</span>
                      <span className="font-bold text-white block">Sign Up & Get ₵20</span>
                      <span className="text-zinc-400 text-[11px]">Instant ₵20 sign-up bonus credited to wallet.</span>
                    </div>
                    <div className="p-2.5 bg-black/60 rounded-xl border border-zinc-800">
                      <span className="text-emerald-400 font-black block">STEP 02</span>
                      <span className="font-bold text-white block">Deposit MoMo / Crypto</span>
                      <span className="text-zinc-400 text-[11px]">Deposit from ₵100 via MTN MoMo or Crypto.</span>
                    </div>
                    <div className="p-2.5 bg-black/60 rounded-xl border border-zinc-800">
                      <span className="text-emerald-400 font-black block">STEP 03</span>
                      <span className="font-bold text-white block">Activate Crown Tier</span>
                      <span className="text-zinc-400 text-[11px]">Lock in 180-day automated daily earnings.</span>
                    </div>
                    <div className="p-2.5 bg-black/60 rounded-xl border border-zinc-800">
                      <span className="text-emerald-400 font-black block">STEP 04</span>
                      <span className="font-bold text-white block">Daily 24h Payouts</span>
                      <span className="text-zinc-400 text-[11px]">Withdraw daily to MoMo (min cashout ₵20).</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Persistent Bottom Footer CTA */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-emerald-400">Official Energy Point Beta Vercel Platform</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">Ref Code: HYIPEXPLORERPRO391</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl border border-zinc-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleOpenReferral}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 hover:from-red-500 hover:to-yellow-300 text-black font-black text-xs uppercase rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
            >
              <span>REGISTER & CLAIM ₵20 SIGNUP GIFT</span>
              <ExternalLink className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

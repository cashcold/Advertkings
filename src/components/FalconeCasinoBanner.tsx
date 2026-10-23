import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Send,
  Flame,
  Trophy,
  Crown,
  Play,
  RotateCw,
  Gift,
  Coins,
  ShieldCheck,
  Star,
  ExternalLink,
  Percent,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Volume2
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface FalconeCasinoBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

export interface FalconeSlotGame {
  id: string;
  name: string;
  provider: 'PRAGMATIC' | 'PLAYNGO' | 'PUSHGAMING' | 'RELAX' | 'NETENT' | 'AMATIC' | 'FALCONE';
  categoryTag: string;
  rtp: string;
  maxWin: string;
  accentGradient: string;
  badge: string;
  emoji: string;
  highlightText: string;
  themeColor: string;
}

export const FALCONE_SLOT_GAMES: FalconeSlotGame[] = [
  // Site Original
  {
    id: 'falcone-dice',
    name: 'Dice (Falcone Original)',
    provider: 'FALCONE',
    categoryTag: 'Site Exclusive',
    rtp: '99.5%',
    maxWin: '10,000x',
    accentGradient: 'from-amber-600 via-yellow-700 to-zinc-950',
    badge: 'EXCLUSIVE ORIGINAL',
    emoji: '🦅🎲',
    highlightText: 'Provably Fair Falcone Mascot 3D Dice Throw with 99.5% Ultra-High RTP',
    themeColor: '#eab308',
  },
  // Pragmatic Play Games
  {
    id: 'sweet-bonanza-2500',
    name: 'Sweet Bonanza 2500',
    provider: 'PRAGMATIC',
    categoryTag: 'Tumble Cluster',
    rtp: '96.5%',
    maxWin: '25,000x',
    accentGradient: 'from-pink-600 via-purple-700 to-rose-950',
    badge: 'SUPER 2500X',
    emoji: '🍭🍬',
    highlightText: 'Sweet 2500x Sugar Bomb Multipliers & Free Spins Tumble Features',
    themeColor: '#ec4899',
  },
  {
    id: 'gates-of-olympus',
    name: 'Gates of Olympus',
    provider: 'PRAGMATIC',
    categoryTag: 'Greek Gods Tumble',
    rtp: '96.5%',
    maxWin: '50,000x',
    accentGradient: 'from-amber-500 via-yellow-600 to-slate-950',
    badge: 'ZEUS 500X ORBS',
    emoji: '⚡🏛️',
    highlightText: 'Zeus 500x Multiplier Thunderbolts with Infinite Tumble Retriggers',
    themeColor: '#f59e0b',
  },
  {
    id: 'the-dog-house',
    name: 'The Dog House',
    provider: 'PRAGMATIC',
    categoryTag: 'Sticky Multiplier Wilds',
    rtp: '96.51%',
    maxWin: '6,750x',
    accentGradient: 'from-orange-500 via-amber-600 to-zinc-950',
    badge: 'STICKY WILDS',
    emoji: '🐶🏠',
    highlightText: 'High Volatility 2x & 3x Sticky Multiplier Doghouse Wild Free Spins',
    themeColor: '#f97316',
  },
  {
    id: 'bigger-bass-bonanza',
    name: 'Bigger Bass Bonanza',
    provider: 'PRAGMATIC',
    categoryTag: 'Fisherman Cash Collect',
    rtp: '96.71%',
    maxWin: '4,000x',
    accentGradient: 'from-teal-600 via-cyan-700 to-blue-950',
    badge: 'CASH COLLECT',
    emoji: '🎣🐟',
    highlightText: 'Catch Massive Golden Bass with 10x Retrigger Fisherman Wilds',
    themeColor: '#06b6d4',
  },
  {
    id: 'sweet-bonanza',
    name: 'Sweet Bonanza',
    provider: 'PRAGMATIC',
    categoryTag: 'Tumble Candy',
    rtp: '96.48%',
    maxWin: '21,175x',
    accentGradient: 'from-fuchsia-600 via-pink-600 to-purple-950',
    badge: 'CANDY TUMBLE',
    emoji: '🍓🍭',
    highlightText: 'All-Way Pay Anywhere with up to 100x Rainbow Candy Multipliers',
    themeColor: '#d946ef',
  },
  {
    id: 'fruit-party',
    name: 'Fruit Party',
    provider: 'PRAGMATIC',
    categoryTag: 'Cluster Pay',
    rtp: '96.47%',
    maxWin: '5,000x',
    accentGradient: 'from-green-500 via-emerald-600 to-lime-950',
    badge: 'CLUSTER 256X',
    emoji: '🍇🍎',
    highlightText: 'Random 2x Multiplier Clusters compounding up to an explosive 256x',
    themeColor: '#10b981',
  },
  {
    id: 'santas-wonderland',
    name: 'Santa\'s Wonderland',
    provider: 'PRAGMATIC',
    categoryTag: 'Midnight Magic Grid',
    rtp: '96.23%',
    maxWin: '7,500x',
    accentGradient: 'from-red-600 via-rose-700 to-zinc-950',
    badge: 'HOLIDAY MAGIC',
    emoji: '🎅🎁',
    highlightText: 'Midnight Spin Snowflake Modifiers with Multi-Level Progressive Meter',
    themeColor: '#ef4444',
  },
  {
    id: 'sweet-bonanza-xmas',
    name: 'Sweet Bonanza Xmas',
    provider: 'PRAGMATIC',
    categoryTag: 'Festive Tumble',
    rtp: '96.51%',
    maxWin: '21,175x',
    accentGradient: 'from-sky-500 via-blue-600 to-indigo-950',
    badge: 'FROSTED BOMBS',
    emoji: '❄️🍬',
    highlightText: 'Winter Wonderland 100x Frosted Sugar Multiplier Snow Explosions',
    themeColor: '#38bdf8',
  },

  // Relax Gaming
  {
    id: 'money-train-2',
    name: 'Money Train 2',
    provider: 'RELAX',
    categoryTag: 'Steampunk Respins',
    rtp: '98.0% (Bonus Buy)',
    maxWin: '50,000x',
    accentGradient: 'from-amber-700 via-orange-800 to-zinc-950',
    badge: '50,000X MAX WIN',
    emoji: '🚂💰',
    highlightText: 'Legendary Money Cart Respin with Persistent Sniper, Collector & Payer',
    themeColor: '#d97706',
  },
  {
    id: 'money-train-3',
    name: 'Money Train 3',
    provider: 'RELAX',
    categoryTag: 'Futuristic Cart',
    rtp: '96.5%',
    maxWin: '100,000x',
    accentGradient: 'from-red-700 via-amber-700 to-zinc-950',
    badge: '100,000X INSANE',
    emoji: '⚡🚆',
    highlightText: 'Next-Gen 100,000x Max Win with Persistent Necromancer & Tommy Gun',
    themeColor: '#dc2626',
  },

  // Push Gaming
  {
    id: 'retro-tapes',
    name: 'Retro Tapes (Cluster Link)',
    provider: 'PUSHGAMING',
    categoryTag: 'Neon Tape Clusters',
    rtp: '96.47%',
    maxWin: '10,000x',
    accentGradient: 'from-purple-600 via-fuchsia-700 to-indigo-950',
    badge: 'CLUSTER LINK',
    emoji: '📼🪩',
    highlightText: 'Wild Tape Multipliers, Magnet Instant Prizes & Top Charts Free Spins',
    themeColor: '#a855f7',
  },
  {
    id: 'fire-hopper',
    name: 'Fire Hopper',
    provider: 'PUSHGAMING',
    categoryTag: 'Cascading Pond',
    rtp: '96.3%',
    maxWin: '50,000x',
    accentGradient: 'from-emerald-500 via-teal-600 to-zinc-950',
    badge: 'FROG JUMP WILDS',
    emoji: '🐸🔥',
    highlightText: 'Multiplier Frog leaps across Firefly Wilds to trigger 50,000x Pond Wins',
    themeColor: '#10b981',
  },
  {
    id: 'fat-rabbit',
    name: 'Fat Rabbit',
    provider: 'PUSHGAMING',
    categoryTag: 'Growing Wilds',
    rtp: '96.45%',
    maxWin: '10,223x',
    accentGradient: 'from-orange-600 via-amber-600 to-zinc-950',
    badge: '5x5 GIANT RABBIT',
    emoji: '🐰🥕',
    highlightText: 'Rabbit gorges on Carrots to expand into an enormous 5x5 Screen-Filling Wild',
    themeColor: '#f97316',
  },
  {
    id: 'fat-santa',
    name: 'Fat Santa',
    provider: 'PUSHGAMING',
    categoryTag: 'Festive Expanding Wild',
    rtp: '96.45%',
    maxWin: '10,223x',
    accentGradient: 'from-red-600 via-emerald-700 to-zinc-950',
    badge: 'GIANT SANTA WILD',
    emoji: '🎅🥧',
    highlightText: 'Santa eats Christmas Mince Pies to grow into a massive 5x5 Wild Screen',
    themeColor: '#ef4444',
  },

  // Play'n GO
  {
    id: 'book-of-dead',
    name: 'Book of Dead (Rich Wilde)',
    provider: 'PLAYNGO',
    categoryTag: 'Egyptian Explorer',
    rtp: '96.21%',
    maxWin: '5,000x',
    accentGradient: 'from-amber-600 via-yellow-600 to-zinc-950',
    badge: 'EXPANDING SYMBOLS',
    emoji: '📖⚱️',
    highlightText: 'Join Rich Wilde in the Tomb of Osiris with Golden Expanding Free Spins',
    themeColor: '#f59e0b',
  },
  {
    id: 'legacy-of-dead',
    name: 'Legacy of Dead',
    provider: 'PLAYNGO',
    categoryTag: 'Pharaoh Tombs',
    rtp: '96.58%',
    maxWin: '5,000x',
    accentGradient: 'from-yellow-600 via-amber-700 to-zinc-950',
    badge: '9 EXPANDING SYMBOLS',
    emoji: '🏺👑',
    highlightText: 'Retrigger up to 9 simultaneous Special Expanding Pharaoh Symbols',
    themeColor: '#eab308',
  },
  {
    id: 'reactoonz-2',
    name: 'Reactoonz 2',
    provider: 'PLAYNGO',
    categoryTag: 'Quantum Grid',
    rtp: '96.2%',
    maxWin: '5,083x',
    accentGradient: 'from-blue-500 via-sky-600 to-indigo-950',
    badge: 'GARGANTOON 3X3',
    emoji: '👾⚡',
    highlightText: 'Charge the Fluctometer & Quantumeter to unleash 3x3 Gargantoon Wilds',
    themeColor: '#0ea5e9',
  },
  {
    id: 'gigantoonz',
    name: 'Gigantoonz',
    provider: 'PLAYNGO',
    categoryTag: 'Mega Alien Grid',
    rtp: '96.25%',
    maxWin: '4,000x',
    accentGradient: 'from-indigo-600 via-purple-600 to-zinc-950',
    badge: '7X7 MEGA TOONZ',
    emoji: '👽🪐',
    highlightText: '7x7 Grid with Mega Symbol Blocks and 100-Charge Gargantoon Surge',
    themeColor: '#6366f1',
  },

  // NetEnt
  {
    id: 'dead-or-alive-2',
    name: 'Dead or Alive 2 (Feature Buy)',
    provider: 'NETENT',
    categoryTag: 'Wild West Outlaws',
    rtp: '96.82%',
    maxWin: '111,111x',
    accentGradient: 'from-stone-700 via-zinc-800 to-black',
    badge: '111,111X MAXIMUM',
    emoji: '🤠🔫',
    highlightText: 'High Noon Saloon Multiplier Sticky Wilds with astronomical 111,111x Max Win',
    themeColor: '#78716c',
  },
  {
    id: 'butterfly-staxx',
    name: 'Butterfly Staxx',
    provider: 'NETENT',
    categoryTag: 'Glowing Staxx',
    rtp: '96.8%',
    maxWin: '1,200x',
    accentGradient: 'from-pink-500 via-purple-600 to-blue-950',
    badge: 'BUTTERFLY RESPIN',
    emoji: '🦋🌸',
    highlightText: 'Full stacks of Golden Tropical Butterflies flutter left for endless Re-Spins',
    themeColor: '#ec4899',
  },

  // Amatic
  {
    id: 'blue-dolphin',
    name: 'Blue Dolphin',
    provider: 'AMATIC',
    categoryTag: 'Classic Ocean Deluxe',
    rtp: '96.0%',
    maxWin: '10,000x',
    accentGradient: 'from-cyan-600 via-blue-700 to-indigo-950',
    badge: '3X MULTI SPINS',
    emoji: '🐬🌊',
    highlightText: 'Wild Dolphins double payouts and Crown Bonus triggers 15 Free Spins at 3x',
    themeColor: '#06b6d4',
  },
];

const RECENT_WINNERS = [
  { user: '@Alex_VIP', game: 'Gates of Olympus', amount: '$48,250', multiplier: '500x Orb' },
  { user: '@Maria_Slots', game: 'Money Train 3', amount: '$124,500', multiplier: '100,000x Hit' },
  { user: '@CryptoKing77', game: 'Sweet Bonanza 2500', amount: '$31,800', multiplier: '2,500x Bomb' },
  { user: '@FalconDiver', game: 'Falcone Dice', amount: '$19,400', multiplier: '99.5% Streak' },
  { user: '@TombExplorer', game: 'Book of Dead', amount: '$25,000', multiplier: '5x Rich Wilde' },
  { user: '@Giga_Hunter', game: 'Gigantoonz', amount: '$18,900', multiplier: 'Mega Charge' },
];

export const FalconeCasinoBanner: React.FC<FalconeCasinoBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('ALL');
  const [activeGame, setActiveGame] = useState<FalconeSlotGame>(FALCONE_SLOT_GAMES[0]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinOutcome, setSpinOutcome] = useState<string | null>(null);
  const [liveWinIndex, setLiveWinIndex] = useState<number>(0);

  // Auto rotate recent big winners ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveWinIndex((prev) => (prev + 1) % RECENT_WINNERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const filteredGames = FALCONE_SLOT_GAMES.filter((g) => {
    if (selectedProvider === 'ALL') return true;
    return g.provider === selectedProvider;
  });

  const handleTestSpin = (game: FalconeSlotGame) => {
    incrementClicks();
    soundManager.playSpinTick();
    setIsSpinning(true);
    setSpinOutcome(null);

    setTimeout(() => {
      setIsSpinning(false);
      soundManager.playWinFanfare();
      const multipliers = ['50x BIG WIN', '125x MEGA WIN', '500x ZEUS HIT', '2,500x SUGAR BOMB', '10,000x JACKPOT!'];
      const win = multipliers[Math.floor(Math.random() * multipliers.length)];
      setSpinOutcome(win);
    }, 1200);
  };

  const handleClaimTelegramBonus = (game: FalconeSlotGame) => {
    incrementClicks();
    soundManager.playWinFanfare();

    const msg =
      `🎰 FALCONE CASINO VIP SLOTS & WELCOME BONUS ACTIVATION 🦅\n` +
      `• Selected Game: ${game.name} (${game.provider})\n` +
      `• Max Win Potential: ${game.maxWin} | Official RTP: ${game.rtp}\n` +
      `• Welcome Promo: 500% Deposit Match + 250 Free Spins (No KYC)\n` +
      `• Fast Cashout: USDT, TON, BTC & Instant Card Settlement in 30s\n` +
      `Hi @adkingsSupport, please activate my Falcone Casino VIP access and free spins bonus now!`;

    onOpenTelegram(msg);
  };

  const currentWin = RECENT_WINNERS[liveWinIndex];

  return (
    <section
      id="falcone-casino-banner"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c0f1d] via-[#070913] to-[#020307] border-2 border-amber-400 p-4 sm:p-5 shadow-[0_0_40px_rgba(234,179,8,0.35)] transition-all duration-300"
    >
      {/* Background Ambience */}
      <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

      {/* Top Header Badge & Live Ticker */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 pb-3 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.7)] flex items-center gap-1.5 animate-pulse">
              <Crown className="w-3.5 h-3.5 fill-black text-black inline" /> FALCONE CASINO VIP SLOTS & ORIGINALS 🦅
            </span>
            <span className="bg-purple-900/90 text-purple-200 border border-purple-400/40 text-[10px] sm:text-xs px-2.5 py-0.5 rounded font-black tracking-wide flex items-center gap-1">
              <Gift className="w-3.5 h-3.5 text-yellow-300 inline" /> 500% BONUS + 250 FREE SPINS
            </span>
            <span className="text-[11px] text-amber-300 font-bold hidden sm:inline flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" /> No KYC • 30s Crypto Payouts
            </span>
          </div>
          <p className="text-[11px] text-zinc-300 font-medium pt-0.5 max-w-3xl leading-relaxed">
            Direct access to all <strong>22 top-tier slot games and original dice</strong> featured in Falcone Casino: Pragmatic Play, Relax Gaming, Push Gaming, Play'n GO, NetEnt, and Amatic.
          </p>
        </div>

        {/* Live Winner Ticker Pill */}
        <div className="bg-black/80 border border-amber-400/40 px-3 py-1.5 rounded-xl shadow font-mono text-[11px] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">{currentWin.user}</span>
            <span className="text-zinc-400">won</span>
            <span className="text-emerald-400 font-black">{currentWin.amount}</span>
            <span className="text-purple-300 text-[10px]">({currentWin.game})</span>
          </div>
        </div>
      </div>

      {/* Provider Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {[
          { id: 'ALL', label: '🔥 All 22 Slots' },
          { id: 'FALCONE', label: '🦅 Falcone Originals' },
          { id: 'PRAGMATIC', label: '🍬 Pragmatic Play' },
          { id: 'RELAX', label: '🚂 Relax Gaming' },
          { id: 'PUSHGAMING', label: '📼 Push Gaming' },
          { id: 'PLAYNGO', label: '📖 Play\'n GO' },
          { id: 'NETENT', label: '🤠 NetEnt' },
          { id: 'AMATIC', label: '🐬 Amatic' },
        ].map((tab) => {
          const isSelected = selectedProvider === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedProvider(tab.id);
                soundManager.playCoin();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black border-yellow-200 shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-[1.03]'
                  : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-amber-500/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left Active Game Hologram Stage (5 cols) + Right Games Showcase (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Column: Featured Slot Reel / Hologram Stage */}
        <div className="lg:col-span-5 space-y-3">
          <div
            className={`relative rounded-2xl bg-gradient-to-br ${activeGame.accentGradient} border-2 border-amber-400 p-4 sm:p-5 text-white shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300`}
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="bg-black/70 border border-amber-400/50 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                {activeGame.provider}
              </span>
              <span className="bg-yellow-400 text-black text-[9px] font-black px-2 py-0.5 rounded uppercase shadow">
                {activeGame.badge}
              </span>
            </div>

            {/* Game Visual Showcase */}
            <div className="my-2 text-center">
              <div className="text-5xl sm:text-6xl mb-2 drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] animate-bounce">
                {activeGame.emoji}
              </div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white drop-shadow">
                {activeGame.name}
              </h3>
              <span className="text-xs text-amber-200 font-semibold block mt-0.5">
                {activeGame.categoryTag}
              </span>
              <p className="text-[11px] text-zinc-200 mt-2 bg-black/60 p-2 rounded-xl border border-white/10 leading-snug">
                {activeGame.highlightText}
              </p>
            </div>

            {/* Stats Metrics */}
            <div className="grid grid-cols-2 gap-2 my-3 text-center text-xs font-mono">
              <div className="bg-black/60 border border-white/15 p-2 rounded-xl">
                <span className="text-[9px] text-zinc-400 block uppercase font-bold">OFFICIAL RTP</span>
                <strong className="text-emerald-400 text-sm font-black">{activeGame.rtp}</strong>
              </div>
              <div className="bg-black/60 border border-white/15 p-2 rounded-xl">
                <span className="text-[9px] text-zinc-400 block uppercase font-bold">MAX POTENTIAL</span>
                <strong className="text-yellow-300 text-sm font-black">{activeGame.maxWin}</strong>
              </div>
            </div>

            {/* Interactive Demo Test Spin Section */}
            <div className="bg-black/70 border border-amber-400/30 rounded-xl p-2.5 text-center space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-400 flex items-center gap-1">
                  <RotateCw className={`w-3.5 h-3.5 text-amber-400 ${isSpinning ? 'animate-spin' : ''}`} /> Demo Spin Test:
                </span>
                {spinOutcome && (
                  <span className="text-emerald-400 font-black animate-pulse">{spinOutcome}</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleTestSpin(activeGame)}
                disabled={isSpinning}
                className="w-full py-2 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-xs rounded-lg border border-amber-400/40 flex items-center justify-center gap-1.5 transition-all shadow"
              >
                <Play className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span>{isSpinning ? 'SPINNING REELS...' : `TEST DEMO SPIN ON ${activeGame.name.split(' ')[0]}`}</span>
              </button>
            </div>

            {/* Main Telegram Bonus CTA */}
            <button
              type="button"
              onClick={() => handleClaimTelegramBonus(activeGame)}
              className="w-full mt-3 py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black text-sm rounded-xl border-2 border-yellow-100 shadow-[0_0_20px_rgba(245,158,11,0.8)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Gift className="w-4 h-4 text-black" />
              <span>CLAIM 500% BONUS + 250 SPINS</span>
              <Send className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        {/* Right Column: Grid of All Falcone Games (Filtered) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-300 pb-1">
            <span className="flex items-center gap-1 text-amber-300">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              Falcone Casino Games ({filteredGames.length} Available):
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Click to Preview & Claim Bonus</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredGames.map((game) => {
              const isSelected = activeGame.id === game.id;
              return (
                <div
                  key={game.id}
                  onClick={() => {
                    setActiveGame(game);
                    soundManager.playCoin();
                  }}
                  className={`group relative cursor-pointer rounded-xl p-2.5 border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-950/80 via-black to-zinc-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-[1.02]'
                      : 'bg-black/50 border-zinc-800/80 hover:border-amber-500/50 hover:bg-black/80'
                  }`}
                >
                  <div>
                    {/* Top Tag & Provider */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-tighter truncate max-w-[80px]">
                        {game.provider}
                      </span>
                      <span className="text-[8px] font-black bg-white/10 text-zinc-300 px-1 rounded">
                        {game.rtp}
                      </span>
                    </div>

                    {/* Game Icon & Name */}
                    <div className="flex items-center gap-2 my-1">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{game.emoji}</span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-white truncate group-hover:text-amber-300 transition-colors">
                          {game.name}
                        </h4>
                        <span className="text-[9px] text-zinc-400 block truncate font-medium">
                          {game.categoryTag}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Multiplier & Fast Action */}
                  <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-yellow-400 font-bold">{game.maxWin}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClaimTelegramBonus(game);
                      }}
                      className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-300 text-[9px] font-bold rounded border border-amber-400/40 transition-colors flex items-center gap-0.5"
                    >
                      <span>PLAY</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Falcone Casino Global Features Pill */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] font-mono text-center">
            <div className="bg-black/60 border border-amber-500/20 p-2 rounded-xl text-amber-300">
              <span className="font-black text-white block">🦅 FALCONE ORIGINALS</span>
              <span>Dice • 99.5% RTP</span>
            </div>
            <div className="bg-black/60 border border-emerald-500/20 p-2 rounded-xl text-emerald-300">
              <span className="font-black text-white block">⚡ INSTANT CASHOUTS</span>
              <span>USDT, TON & Cards</span>
            </div>
            <div className="bg-black/60 border border-purple-500/20 p-2 rounded-xl text-purple-300">
              <span className="font-black text-white block">🎁 500% VIP MATCH</span>
              <span>250 Free Spins</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

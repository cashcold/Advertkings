import { BannerItem, BannerCategory, BannerSize } from '../types';

// Helper templates to build 50+ rich, unique high-converting banners per category
const SIZES: { size: '728x90' | '970x250' | '300x250' | '300x600' | '320x100'; sizeName: string }[] = [
  { size: '728x90', sizeName: 'Leaderboard 728x90' },
  { size: '970x250', sizeName: 'Billboard 970x250' },
  { size: '300x250', sizeName: 'Medium Rect 300x250' },
  { size: '300x600', sizeName: 'Half Page 300x600' },
  { size: '320x100', sizeName: 'Mobile Banner 320x100' },
];

const MASCOTS: ('doge' | 'ape' | 'duck' | 'piggy' | 'frog' | 'leprechaun')[] = [
  'doge', 'ape', 'duck', 'piggy', 'frog', 'leprechaun'
];

interface BannerTemplate {
  title: string;
  tagline: string;
  bonusText: string;
  badge: string;
  ctr: string;
  accentColor: string;
  bgGradient: string;
  actionLabel: string;
}

// 50 unique templates for HYIP Directory
const HYIP_TEMPLATES: BannerTemplate[] = [
  {
    title: '⚡ ENERGY POINT: ₵20 SIGNUP GIFT • WATCH & EARN 👑',
    tagline: '180-Day Crown Contracts (₵10 - ₵1,800 Daily) • Instant MoMo & Crypto Payouts',
    bonusText: '₵20 FREE BONUS',
    badge: 'HOT LAUNCH',
    ctr: '44.8%',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-green-950 to-amber-950',
    actionLabel: 'CLAIM ₵20 BONUS',
  },
  {
    title: '⚡ BITCOIN 300% DAILY HOURLY PAYOUT ⚡',
    tagline: 'Deposit $100 -> Get $300 Daily Forever! Instant TRC20 & TON Payouts',
    bonusText: '300% ROI',
    badge: 'HOT HYIP',
    ctr: '24.2%',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-950 via-zinc-950 to-red-950',
    actionLabel: 'INVEST VIA TELEGRAM',
  },
  {
    title: '💎 AURA DIAMOND VIP RESERVE YIELD 💎',
    tagline: 'Physical High-Carat Diamond Vault Contracts • 15% Daily Automated Crypto ROI',
    bonusText: '15% DAILY',
    badge: 'AUDITED VAULT',
    ctr: '28.5%',
    accentColor: '#38bdf8',
    bgGradient: 'from-sky-950 via-zinc-950 to-blue-950',
    actionLabel: 'START WITH $50',
  },
  {
    title: '⛏️ GOLDBOD PRO ASIC MINING NODES ⛏️',
    tagline: 'Institutional ASIC Rigs with Daily Payouts & Zero Hardware Maintenance',
    bonusText: '10% FIRST DEP',
    badge: 'TOP CHOICE',
    ctr: '32.1%',
    accentColor: '#eab308',
    bgGradient: 'from-yellow-950 via-zinc-950 to-amber-950',
    actionLabel: 'MINE NOW ON TG',
  },
  {
    title: '☁️ CLOUDMINE-X ENTERPRISE HASHRATE ☁️',
    tagline: 'Multi-Currency Yields • Instant MTN MoMo, Telecel & Crypto Cashouts',
    bonusText: '35% MONTHLY',
    badge: 'INSTANT PAYOUT',
    ctr: '29.7%',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-zinc-950 to-teal-950',
    actionLabel: 'RENT HASHPOWER',
  },
  {
    title: '🥇 PRIME GOLD RESOURCES COMMODITY BOT 🥇',
    tagline: 'Physical Gold Bullion Reserves Backing • 5% to 20% Net Profit Weekly',
    bonusText: '20% 7-DAY',
    badge: 'GOLD BACKED',
    ctr: '26.4%',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-950 via-zinc-950 to-yellow-950',
    actionLabel: 'ALLOCATE GOLD',
  },
  {
    title: '🚀 HYPER-YIELD USDT HOURLY VAULT 🚀',
    tagline: 'Earn 1.25% Every 60 Minutes • Non-Custodial Smart Contract Pool',
    bonusText: '1.25% HOURLY',
    badge: 'AUTO BOT',
    ctr: '34.8%',
    accentColor: '#22c55e',
    bgGradient: 'from-green-950 via-zinc-950 to-emerald-950',
    actionLabel: 'ACTIVATE BOT',
  },
  {
    title: '💰 TON MATRIX AUTO-COMPOUND STAKING 💰',
    tagline: 'Telegram-Native TON Smart Pool • Double Your Toncoin in 14 Days',
    bonusText: '2X TONCOIN',
    badge: 'TON NATIVE',
    ctr: '36.2%',
    accentColor: '#0ea5e9',
    bgGradient: 'from-cyan-950 via-zinc-950 to-blue-950',
    actionLabel: 'STAKE TON',
  },
  {
    title: '⚡ QUANTUM HASH APEX MINING POOL ⚡',
    tagline: 'Next-Gen Liquid Cloud Hashrate with Daily TRC20 Direct Deposit',
    bonusText: '400% APY',
    badge: 'HIGH HASHRATE',
    ctr: '27.9%',
    accentColor: '#a855f7',
    bgGradient: 'from-purple-950 via-zinc-950 to-violet-950',
    actionLabel: 'JOIN APEX POOL',
  },
  {
    title: '🛡️ INSURED CAPITAL CRYPTO HEDGE FUND 🛡️',
    tagline: '100% Principal Protection Guarantee • 8.5% Stable Weekly Yield',
    bonusText: 'INSURED 100%',
    badge: 'PRINCIPAL SAFE',
    ctr: '25.3%',
    accentColor: '#6366f1',
    bgGradient: 'from-indigo-950 via-zinc-950 to-slate-950',
    actionLabel: 'SECURE CAPITAL',
  },
  {
    title: '👑 APEX WHALE PRIVATE STAKING CLUB 👑',
    tagline: 'Minimum $500 Deposit • Receive 25% Weekly Dividends + Telegram Concierge',
    bonusText: '25% WEEKLY',
    badge: 'WHALE ONLY',
    ctr: '38.0%',
    accentColor: '#ec4899',
    bgGradient: 'from-pink-950 via-zinc-950 to-rose-950',
    actionLabel: 'APPLY VIP DESK',
  },
  {
    title: '🔥 FLASH YIELD 500% 24-HOUR CONTRACT 🔥',
    tagline: 'Deposit 20 USDT -> Withdraw 100 USDT in exactly 24 Hours!',
    bonusText: '500% 24H',
    badge: 'FLASH CONTRACT',
    ctr: '41.5%',
    accentColor: '#ef4444',
    bgGradient: 'from-red-950 via-zinc-950 to-amber-950',
    actionLabel: 'BUY FLASH PASS',
  },
  {
    title: '🌐 GLOBAL ARBITRAGE BOT NETWORK 🌐',
    tagline: 'AI Cross-Exchange Arbitrage Exploitation • Steady 3.5% Daily Compound',
    bonusText: '3.5% DAILY',
    badge: 'ARBITRAGE AI',
    ctr: '23.6%',
    accentColor: '#14b8a6',
    bgGradient: 'from-teal-950 via-zinc-950 to-cyan-950',
    actionLabel: 'RUN ARBITRAGE',
  },
];

// Dedicated templates for all 22 Falcone Casino Slot & Original Games
const CASINO_TEMPLATES: BannerTemplate[] = [
  // 1. Falcone Mascot Dice (Site Original)
  {
    title: '🦅 FALCONE DICE 3D (SITE ORIGINAL): 99.5% ULTRA RTP 🎲',
    tagline: 'Provably fair falcon mascot dice roll • Customizable multiplier up to 10,000x & instant crypto payout',
    bonusText: '99.5% ULTRA RTP',
    badge: 'FALCONE ORIGINAL',
    ctr: '52.8%',
    accentColor: '#eab308',
    bgGradient: 'from-amber-950 via-yellow-950 to-zinc-950',
    actionLabel: 'ROLL FALCONE DICE',
  },
  // 2. Sweet Bonanza 2500 (Pragmatic Play)
  {
    title: '🍬 SWEET BONANZA 2500 (PRAGMATIC): 25,000X MAX WIN 🍭',
    tagline: 'Sugar bomb tumble multipliers up to 2500x • Super free spins bonus buy with cascading wins',
    bonusText: '25,000X MULTIPLIER',
    badge: 'PRAGMATIC PLAY',
    ctr: '49.4%',
    accentColor: '#ec4899',
    bgGradient: 'from-pink-950 via-purple-950 to-rose-950',
    actionLabel: 'SPIN BONANZA 2500',
  },
  // 3. Gates of Olympus (Pragmatic Play)
  {
    title: '⚡ GATES OF OLYMPUS (PRAGMATIC): ZEUS 500X THUNDERBOLTS ⚡',
    tagline: 'Zeus strikes random 500x multiplier orbs on any spin • 50,000x max win with infinite retriggers',
    bonusText: '500X ZEUS ORBS',
    badge: 'PRAGMATIC HIT',
    ctr: '54.6%',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-950 via-yellow-950 to-slate-950',
    actionLabel: 'UNLEASH ZEUS POWER',
  },
  // 4. The Dog House (Pragmatic Play)
  {
    title: '🐶 THE DOG HOUSE (PRAGMATIC): 3X STICKY MULTIPLIER WILDS 🏠',
    tagline: 'High volatility dog kennel free spins with sticky 2x and 3x multiplier wilds locking in place',
    bonusText: 'STICKY 3X WILDS',
    badge: 'PRAGMATIC DOGS',
    ctr: '46.7%',
    accentColor: '#f97316',
    bgGradient: 'from-orange-950 via-amber-950 to-zinc-950',
    actionLabel: 'ENTER DOG HOUSE',
  },
  // 5. Bigger Bass Bonanza (Pragmatic Play)
  {
    title: '🎣 BIGGER BASS BONANZA (PRAGMATIC): 10X GOLDEN RETRIGGER 🐟',
    tagline: 'Catch giant money fish with the fisherman wild symbol • Level up to 10x multiplier in free spins',
    bonusText: 'CASH COLLECT 10X',
    badge: 'PRAGMATIC BASS',
    ctr: '48.1%',
    accentColor: '#06b6d4',
    bgGradient: 'from-teal-950 via-cyan-950 to-blue-950',
    actionLabel: 'CATCH BIGGER BASS',
  },
  // 6. Dead or Alive 2 Feature Buy (NetEnt)
  {
    title: '🤠 DEAD OR ALIVE 2 (NETENT): 111,111X MAXIMUM WIN 🔫',
    tagline: 'Legendary outlaw Western slot • High Noon Saloon sticky multiplier wilds with astronomical 111,111x cap',
    bonusText: '111,111X MAX WIN',
    badge: 'NETENT OUTLAWS',
    ctr: '53.2%',
    accentColor: '#78716c',
    bgGradient: 'from-stone-950 via-zinc-950 to-black',
    actionLabel: 'BUY OUTLAW FEATURE',
  },
  // 7. Retro Tapes Cluster Link (Push Gaming)
  {
    title: '📼 RETRO TAPES (PUSH GAMING): CLUSTER LINK MULTIPLIERS 🪩',
    tagline: 'Neon cassette tape cluster pays • Wild Tape multipliers, Magnet instant coins & Top Charts spins',
    bonusText: 'CLUSTER LINK 10K',
    badge: 'PUSH GAMING',
    ctr: '47.5%',
    accentColor: '#a855f7',
    bgGradient: 'from-purple-950 via-fuchsia-950 to-indigo-950',
    actionLabel: 'SPIN RETRO TAPES',
  },
  // 8. Money Train 2 (Relax Gaming)
  {
    title: '🚂 MONEY TRAIN 2 (RELAX GAMING): 50,000X RESPIN VAULT 💰',
    tagline: 'Steampunk Money Cart bonus with Persistent Sniper, Collector and Payer symbols unlocking 50,000x',
    bonusText: '50,000X RESPIN',
    badge: 'RELAX GAMING',
    ctr: '51.9%',
    accentColor: '#d97706',
    bgGradient: 'from-amber-950 via-orange-950 to-zinc-950',
    actionLabel: 'BOARD MONEY TRAIN 2',
  },
  // 9. Money Train 3 (Relax Gaming)
  {
    title: '⚡ MONEY TRAIN 3 (RELAX GAMING): 100,000X CYBER CART 🚆',
    tagline: 'Futuristic 100,000x maximum jackpot • Persistent Necromancer, Tommy Gun and Collector characters',
    bonusText: '100,000X INSANE',
    badge: 'RELAX HIT',
    ctr: '55.3%',
    accentColor: '#dc2626',
    bgGradient: 'from-red-950 via-amber-950 to-zinc-950',
    actionLabel: 'PLAY MONEY TRAIN 3',
  },
  // 10. Blue Dolphin (Amatic)
  {
    title: '🐬 BLUE DOLPHIN (AMATIC): 15 FREE SPINS WITH 3X MULTIPLIER 🌊',
    tagline: 'Classic ocean casino favorite • Wild Dolphin doubles base payouts and Crown triggers 3x free games',
    bonusText: '3X FREE GAMES',
    badge: 'AMATIC CLASSIC',
    ctr: '41.8%',
    accentColor: '#0ea5e9',
    bgGradient: 'from-cyan-950 via-blue-950 to-indigo-950',
    actionLabel: 'DIVE BLUE DOLPHIN',
  },
  // 11. Sweet Bonanza (Pragmatic Play)
  {
    title: '🍭 SWEET BONANZA (PRAGMATIC): 100X RAINBOW CANDY BOMBS 🍬',
    tagline: 'Pay anywhere scatter pays with tumbling reels • Hit 100x rainbow candy bomb multipliers',
    bonusText: '21,175X PAYOUT',
    badge: 'PRAGMATIC SWEET',
    ctr: '50.6%',
    accentColor: '#d946ef',
    bgGradient: 'from-fuchsia-950 via-pink-950 to-purple-950',
    actionLabel: 'CLAIM CANDY BOMBS',
  },
  // 12. Gigantoonz (Play\'n GO)
  {
    title: '👽 GIGANTOONZ (PLAY\'N GO): 7X7 MEGA TOONZ & GARGANTOON 🪐',
    tagline: 'Charge Quantumeter with cascading alien mega blocks to unleash the massive 3x3 Gargantoon Wild',
    bonusText: '7X7 MEGA GRID',
    badge: 'PLAY\'N GO',
    ctr: '46.3%',
    accentColor: '#6366f1',
    bgGradient: 'from-indigo-950 via-purple-950 to-zinc-950',
    actionLabel: 'CHARGE GIGANTOONZ',
  },
  // 13. Reactoonz 2 (Play\'n GO)
  {
    title: '👾 REACTOONZ 2 (PLAY\'N GO): ENERGOON & GARGANTOON SURGE ⚡',
    tagline: 'Fluctometer electric wilds & Quantumeter level-ups triggering full screen alien cascade destruction',
    bonusText: 'GARGANTOON 3X3',
    badge: 'PLAY\'N GO ALIEN',
    ctr: '48.7%',
    accentColor: '#38bdf8',
    bgGradient: 'from-blue-950 via-sky-950 to-indigo-950',
    actionLabel: 'TRIGGER REACTOONZ 2',
  },
  // 14. Santa\'s Wonderland (Pragmatic Play)
  {
    title: '🎅 SANTA\'S WONDERLAND (PRAGMATIC): MIDNIGHT PROGRESSIVE METER 🎁',
    tagline: 'Grid tumble slot with colored snowflake modifiers • Fill the clock meter for multi-level bonus multipliers',
    bonusText: '7,500X HOLIDAY',
    badge: 'PRAGMATIC SANTA',
    ctr: '43.9%',
    accentColor: '#ef4444',
    bgGradient: 'from-red-950 via-rose-950 to-zinc-950',
    actionLabel: 'OPEN WONDERLAND',
  },
  // 15. Fruit Party (Pragmatic Play)
  {
    title: '🍇 FRUIT PARTY (PRAGMATIC): 256X RANDOM CLUSTER MULTIPLIERS 🍎',
    tagline: 'Tasty 7x7 fruit grid • Cascading fruit clusters compound random 2x multipliers up to a huge 256x win',
    bonusText: '256X CLUSTERS',
    badge: 'PRAGMATIC FRUIT',
    ctr: '45.8%',
    accentColor: '#10b981',
    bgGradient: 'from-green-950 via-emerald-950 to-lime-950',
    actionLabel: 'JOIN FRUIT PARTY',
  },
  // 16. Butterfly Staxx (NetEnt)
  {
    title: '🦋 BUTTERFLY STAXX (NETENT): GOLDEN BUTTERFLY RE-SPINS 🌸',
    tagline: 'Stack reels with glowing tropical butterflies that flutter left for continuous lucrative re-spins',
    bonusText: 'RESPIN STAXX',
    badge: 'NETENT TROPICAL',
    ctr: '42.1%',
    accentColor: '#ec4899',
    bgGradient: 'from-pink-950 via-purple-950 to-blue-950',
    actionLabel: 'RELEASE BUTTERFLIES',
  },
  // 17. Book of Dead (Play\'n GO)
  {
    title: '📖 BOOK OF DEAD (PLAY\'N GO): RICH WILDE GOLDEN EXPANDING TOMB ⚱️',
    tagline: 'Explore the Tomb of Osiris • Retrigger free spins with special selected expanding golden symbol',
    bonusText: '5,000X EXPANDING',
    badge: 'PLAY\'N GO BOOK',
    ctr: '52.0%',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-950 via-yellow-950 to-zinc-950',
    actionLabel: 'OPEN BOOK OF DEAD',
  },
  // 18. Legacy of Dead (Play\'n GO)
  {
    title: '🏺 LEGACY OF DEAD (PLAY\'N GO): UNLOCK ALL 9 EXPANDING SYMBOLS 👑',
    tagline: 'Ancient Egyptian Pharaoh tomb • Retrigger free spins to unlock up to 9 simultaneous expanding icons',
    bonusText: '9 EXPANDING ICONS',
    badge: 'PLAY\'N GO LEGACY',
    ctr: '49.8%',
    accentColor: '#eab308',
    bgGradient: 'from-yellow-950 via-amber-950 to-zinc-950',
    actionLabel: 'CLAIM PHARAOH LEGACY',
  },
  // 19. Fire Hopper (Push Gaming)
  {
    title: '🐸 FIRE HOPPER (PUSH GAMING): MULTIPLIER FROG 50,000X LEAP 🔥',
    tagline: 'Frog wild hops towards Fireflies increasing multiplier with every jump across the waterlily grid',
    bonusText: '50,000X POND WIN',
    badge: 'PUSH GAMING FROG',
    ctr: '47.9%',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-teal-950 to-zinc-950',
    actionLabel: 'LEAP IN FIRE HOPPER',
  },
  // 20. Fat Rabbit (Push Gaming)
  {
    title: '🐰 FAT RABBIT (PUSH GAMING): 5X5 SCREEN-FILLING GIANT RABBIT 🥕',
    tagline: 'Feed the rabbit juicy carrots in free spins to expand him into a massive 5x5 screen-filling wild',
    bonusText: '5X5 GIANT WILD',
    badge: 'PUSH GAMING RABBIT',
    ctr: '45.2%',
    accentColor: '#f97316',
    bgGradient: 'from-orange-950 via-amber-950 to-zinc-950',
    actionLabel: 'FEED FAT RABBIT',
  },
  // 21. Fat Santa (Push Gaming)
  {
    title: '🎅 FAT SANTA (PUSH GAMING): CHRISTMAS PIE EXPANDING SANTA 🥧',
    tagline: 'Santa eats Christmas pies during free spins to grow into a gargantuan 5x5 wild symbol',
    bonusText: '5X5 SANTA WILD',
    badge: 'PUSH GAMING SANTA',
    ctr: '44.6%',
    accentColor: '#ef4444',
    bgGradient: 'from-red-950 via-emerald-950 to-zinc-950',
    actionLabel: 'GROW FAT SANTA',
  },
  // 22. Sweet Bonanza Xmas (Pragmatic Play)
  {
    title: '❄️ SWEET BONANZA XMAS (PRAGMATIC): FROSTED 100X SUGAR BOMBS 🍬',
    tagline: 'Holiday edition of Sweet Bonanza • Festive snow candies with frosted 100x multiplier bombs',
    bonusText: '21,175X SNOW BOMBS',
    badge: 'PRAGMATIC XMAS',
    ctr: '48.9%',
    accentColor: '#38bdf8',
    bgGradient: 'from-sky-950 via-blue-950 to-indigo-950',
    actionLabel: 'PLAY BONANZA XMAS',
  },
];

// 50 unique templates for Aviator Signal
const AVIATOR_TEMPLATES: BannerTemplate[] = [
  {
    title: '✈️ AVIATOR AI SIGNAL BOT: 99.8% CRASH PREDICTION ✈️',
    tagline: 'Next Round Signal 18.5x Multiplier • Free Trial Telegram VIP Signals',
    bonusText: 'VIP BOT FREE',
    badge: '18.5x SIGNAL',
    ctr: '38.4%',
    accentColor: '#ef4444',
    bgGradient: 'from-red-950 via-zinc-950 to-orange-950',
    actionLabel: 'GET VIP SIGNALS',
  },
  {
    title: '🚀 100X JETX & AVIATOR RADAR TELEGRAM BOT 🚀',
    tagline: 'Live Neural Prediction Algorithm • 94.6% Confirmed Round Accuracy',
    bonusText: '100X RADAR',
    badge: 'NEURAL AI',
    ctr: '43.2%',
    accentColor: '#f97316',
    bgGradient: 'from-orange-950 via-red-950 to-zinc-950',
    actionLabel: 'START RADAR',
  },
  {
    title: '🔥 LUCKY JET AUTOPILOT CASH-OUT ASSISTANT 🔥',
    tagline: 'Auto cashout before the astronaut flies away! Set safety multiplier',
    bonusText: 'AUTOPILOT BOT',
    badge: 'AUTO CASHOUT',
    ctr: '35.9%',
    accentColor: '#eab308',
    bgGradient: 'from-yellow-950 via-amber-950 to-zinc-950',
    actionLabel: 'ACTIVATE BOT',
  },
  {
    title: '🎯 SPACEMAN 500X CRASH PATTERN SCANNER 🎯',
    tagline: 'Detect green wave multiplier streaks before placing your next wager',
    bonusText: 'PATTERN SCAN',
    badge: 'STREAK ALERTS',
    ctr: '39.8%',
    accentColor: '#a855f7',
    bgGradient: 'from-purple-950 via-indigo-950 to-zinc-950',
    actionLabel: 'SCAN PATTERNS',
  },
  {
    title: '📈 CRASH PREDICTOR PRO: GUARANTEED 2X - 10X 📈',
    tagline: 'Receive exact cash-out notifications 3 seconds before each takeoff',
    bonusText: '99% ACCURACY',
    badge: '3S ADVANCE',
    ctr: '46.1%',
    accentColor: '#22c55e',
    bgGradient: 'from-green-950 via-emerald-950 to-zinc-950',
    actionLabel: 'GET LIVE PUSH',
  },
  {
    title: '⚡ AVIATOR VIP WHALE SIGNAL CHANNEL ⚡',
    tagline: 'Over 25,000 active Telegram pilots cashing out over 10x every single hour',
    bonusText: '25K PILOTS',
    badge: 'TELEGRAM VIP',
    ctr: '40.7%',
    accentColor: '#38bdf8',
    bgGradient: 'from-sky-950 via-blue-950 to-zinc-950',
    actionLabel: 'JOIN TG PILOTS',
  },
  {
    title: '🕹️ CRASH STRATEGY MARTINGALE CALCULATOR 🕹️',
    tagline: 'Calculate risk-free hedge bets across dual simultaneous cashout slots',
    bonusText: 'DUAL CASH-OUT',
    badge: 'STRATEGY TOOL',
    ctr: '28.3%',
    accentColor: '#14b8a6',
    bgGradient: 'from-teal-950 via-cyan-950 to-zinc-950',
    actionLabel: 'CALCULATE BET',
  },
  {
    title: '💎 AVIATOR GOLDEN FLIGHT PROMO: $1,000 DEMO 💎',
    tagline: 'Claim $1,000 risk-free demo credits to test the AI signal predictions',
    bonusText: '$1,000 DEMO',
    badge: 'FREE RISK-FREE',
    ctr: '48.5%',
    accentColor: '#ec4899',
    bgGradient: 'from-pink-950 via-rose-950 to-zinc-950',
    actionLabel: 'CLAIM $1000 DEMO',
  },
  {
    title: '🛰️ SKYWARD CRASH ORACLE SERVER 🛰️',
    tagline: 'Direct seed hash decoder providing real-time statistical odds',
    bonusText: 'HASH DECODER',
    badge: 'PROVABLY FAIR',
    ctr: '33.1%',
    accentColor: '#6366f1',
    bgGradient: 'from-indigo-950 via-purple-950 to-zinc-950',
    actionLabel: 'DECODE SEED',
  },
  {
    title: '💰 CASH ROCKET: 1000X SKY MULTIPLIER 💰',
    tagline: 'Instant alerts whenever the sky rocket enters a super-multiplier streak',
    bonusText: '1000X ALERT',
    badge: 'SUPER STREAK',
    ctr: '37.4%',
    accentColor: '#fbbf24',
    bgGradient: 'from-amber-950 via-yellow-950 to-zinc-950',
    actionLabel: 'GET ROCKET ALERTS',
  },
  {
    title: '🏆 AVIATOR TOURNAMENT: $50,000 LEADERBOARD 🏆',
    tagline: 'Top multiplier pilots share $50,000 cash prizes daily on Telegram!',
    bonusText: '$50K PRIZES',
    badge: 'TOURNAMENT',
    ctr: '31.5%',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-950 via-red-950 to-zinc-950',
    actionLabel: 'ENTER TOURNEY',
  },
  {
    title: '⚡ SPEED AVIATOR BOT: ZERO DELAY PUSH ⚡',
    tagline: 'Ultra low-latency WebSocket connection to global crash game servers',
    bonusText: '0.01s LATENCY',
    badge: 'ULTRA FAST',
    ctr: '42.9%',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-teal-950 to-zinc-950',
    actionLabel: 'CONNECT BOT',
  },
];

// 50 unique templates for Lottery 777
const LOTTERY_TEMPLATES: BannerTemplate[] = [
  {
    title: '🎟️ $50,000 GOLDEN SCRATCH: 1 IN 3 WINS 🎟️',
    tagline: 'Free daily tickets on Telegram • Instant 777 cash prizes credited to wallet',
    bonusText: 'FREE TICKET',
    badge: '1 IN 3 WINS',
    ctr: '22.1%',
    accentColor: '#22c55e',
    bgGradient: 'from-green-950 via-zinc-900 to-zinc-950',
    actionLabel: 'CLAIM TICKET ON TG',
  },
  {
    title: '💰 MEGA $1,000,000 CRYPTO LOTTO JACKPOT 💰',
    tagline: 'Draw every 60 minutes! Match 6 lucky numbers and win 1 Million USDT',
    bonusText: '$1,000,000',
    badge: 'HOURLY DRAW',
    ctr: '39.4%',
    accentColor: '#eab308',
    bgGradient: 'from-yellow-950 via-amber-950 to-zinc-950',
    actionLabel: 'BUY $1 TICKET',
  },
  {
    title: '👑 TRIPLE 777 LUCKY WHEEL: SPIN TO WIN 👑',
    tagline: 'Guaranteed prize on every spin: Free USDT, iPhones, and Luxury Watches',
    bonusText: '100% WIN WHEEL',
    badge: 'NO LOSE SPIN',
    ctr: '45.8%',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-950 via-orange-950 to-zinc-950',
    actionLabel: 'SPIN WHEEL NOW',
  },
  {
    title: '💎 DIAMOND SCRATCH OFF: $250,000 TOP PRIZE 💎',
    tagline: 'Scratch 3 matching diamonds to unlock the quarter-million crypto chest',
    bonusText: '$250,000',
    badge: 'DIAMOND CHEST',
    ctr: '34.2%',
    accentColor: '#38bdf8',
    bgGradient: 'from-sky-950 via-blue-950 to-zinc-950',
    actionLabel: 'SCRATCH CHEST',
  },
  {
    title: '🍀 LEPRECHAUN GOLDEN POT LOTTERY 🍀',
    tagline: 'Collect lucky clovers in Telegram and redeem for instant USDT rewards',
    bonusText: 'FREE CLOVERS',
    badge: 'LUCKY DROP',
    ctr: '28.9%',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-green-950 to-zinc-950',
    actionLabel: 'COLLECT CLOVERS',
  },
  {
    title: '⚡ BITCOIN POWERBALL: 50 BTC JACKPOT ⚡',
    tagline: 'Decentralized smart contract lottery verified on Bitcoin blockchain',
    bonusText: '50 BTC POOL',
    badge: 'ON-CHAIN',
    ctr: '37.6%',
    accentColor: '#f97316',
    bgGradient: 'from-orange-950 via-red-950 to-zinc-950',
    actionLabel: 'ENTER 50 BTC POOL',
  },
  {
    title: '🎁 10,000 TON TELEGRAM GIFT BOX LOTTO 🎁',
    tagline: 'Open mystery Telegram gift boxes! Over 5,000 boxes filled with TON cash',
    bonusText: '10K TON POOL',
    badge: 'MYSTERY BOX',
    ctr: '43.0%',
    accentColor: '#0ea5e9',
    bgGradient: 'from-cyan-950 via-indigo-950 to-zinc-950',
    actionLabel: 'OPEN GIFT BOX',
  },
  {
    title: '🔥 SPEED LOTTO: 60-SECOND QUICK DRAW 🔥',
    tagline: 'Never wait for weekly draws! Instant 60-second crypto lottery results',
    bonusText: '60S QUICK DRAW',
    badge: 'INSTANT WIN',
    ctr: '32.7%',
    accentColor: '#ef4444',
    bgGradient: 'from-red-950 via-rose-950 to-zinc-950',
    actionLabel: 'PLAY QUICK DRAW',
  },
  {
    title: '🌟 VIP LOTTO SYNDICATE: POOL & MULTIPLY 🌟',
    tagline: 'Join 500+ players buying 10,000 tickets together for 98% win probability',
    bonusText: '98% PROBABILITY',
    badge: 'SYNDICATE POOL',
    ctr: '35.1%',
    accentColor: '#a855f7',
    bgGradient: 'from-purple-950 via-violet-950 to-zinc-950',
    actionLabel: 'JOIN SYNDICATE',
  },
  {
    title: '🎉 DAILY NO-LOSS LOTTERY SAVINGS POOL 🎉',
    tagline: 'Deposit funds to earn tickets; keep 100% of your deposit win or lose!',
    bonusText: 'NO-LOSS POOL',
    badge: '100% SAFE',
    ctr: '41.8%',
    accentColor: '#22c55e',
    bgGradient: 'from-green-950 via-teal-950 to-zinc-950',
    actionLabel: 'STAKE FOR TICKETS',
  },
  {
    title: '🎟️ ROLLS ROYCE CRYPTO RAFFLE 🎟️',
    tagline: 'Win a brand new Phantom or $450,000 USDT equivalent in your wallet',
    bonusText: '$450K RAFFLE',
    badge: 'LUXURY RAFFLE',
    ctr: '46.9%',
    accentColor: '#ec4899',
    bgGradient: 'from-pink-950 via-purple-950 to-zinc-950',
    actionLabel: 'GET RAFFLE PASS',
  },
  {
    title: '💰 BINGO 777 LIVE TELEGRAM ROOM 💰',
    tagline: 'Live interactive crypto bingo with automated card daubers & instant cash',
    bonusText: 'FREE BINGO CARDS',
    badge: 'LIVE BINGO',
    ctr: '29.5%',
    accentColor: '#14b8a6',
    bgGradient: 'from-teal-950 via-emerald-950 to-zinc-950',
    actionLabel: 'ENTER BINGO ROOM',
  },
];

// 50 unique templates for Cyber Gaming
const GAMING_TEMPLATES: BannerTemplate[] = [
  {
    title: '🎮 CYBER ESPORTS SKINS CASINO & CASE OPENINGS 🎮',
    tagline: 'Win Dragon Lore, AWP & 500 Free Spins with no deposit • Instant Trade',
    bonusText: 'MYTHIC CRATE',
    badge: 'CS:GO & DOTA',
    ctr: '26.4%',
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-950 via-zinc-900 to-zinc-950',
    actionLabel: 'OPEN CRATE ON TG',
  },
  {
    title: '⚔️ METAVERSE CYBER ARENA: PLAY-TO-EARN ⚔️',
    tagline: 'Battle AI Gladiators • Earn $15 to $80 Daily in Liquid Crypto Tokens',
    bonusText: 'EARN $80/DAY',
    badge: 'P2E ARENA',
    ctr: '33.5%',
    accentColor: '#a855f7',
    bgGradient: 'from-purple-950 via-indigo-950 to-zinc-950',
    actionLabel: 'ENTER ARENA',
  },
  {
    title: '🕹️ RETRO ARCADE 10,000X CRYPTO JACKPOT 🕹️',
    tagline: 'Classic Space Invaders & Pac-Crypto with real cash multipliers',
    bonusText: '10,000X RETRO',
    badge: 'ARCADE CASINO',
    ctr: '30.2%',
    accentColor: '#ef4444',
    bgGradient: 'from-red-950 via-orange-950 to-zinc-950',
    actionLabel: 'PLAY ARCADE',
  },
  {
    title: '🏆 ESPORTS MATCH PREDICTION & LIVE ODDS 🏆',
    tagline: 'Bet on CS2, Valorant, Dota 2 & League with best crypto odds in Telegram',
    bonusText: '200% MATCH BONUS',
    badge: 'LIVE ESPORTS',
    ctr: '37.8%',
    accentColor: '#38bdf8',
    bgGradient: 'from-sky-950 via-blue-950 to-zinc-950',
    actionLabel: 'BET ON MATCHES',
  },
  {
    title: '👾 CYBER MONSTER NFT BREEDING & FARMING 👾',
    tagline: 'Hatch legendary battle pets and generate passive daily staking tokens',
    bonusText: 'FREE STARTER PET',
    badge: 'NFT STAKING',
    ctr: '28.1%',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-teal-950 to-zinc-950',
    actionLabel: 'HATCH STARTER PET',
  },
  {
    title: '🔥 CYBER PUNKER MULTIPLAYER DUELS 🔥',
    tagline: '1v1 High-Stakes Skill Duels • Winner takes 95% of the crypto pot instantly',
    bonusText: '1V1 PVP DUELS',
    badge: 'SKILL GAMING',
    ctr: '42.6%',
    accentColor: '#f97316',
    bgGradient: 'from-orange-950 via-red-950 to-zinc-950',
    actionLabel: 'CHALLENGE RIVAL',
  },
  {
    title: '🚀 CYBER CRATE BATTLE: SPINNER OF FORTUNE 🚀',
    tagline: 'Unbox rare tactical knives and gloves • Instant Steam P2P crypto trade',
    bonusText: '$50 FREE CRATE',
    badge: 'FREE UNBOXING',
    ctr: '44.3%',
    accentColor: '#ec4899',
    bgGradient: 'from-pink-950 via-rose-950 to-zinc-950',
    actionLabel: 'CLAIM $50 CRATE',
  },
  {
    title: '🛡️ CLAN WARS GUILD STAKING REWARDS 🛡️',
    tagline: 'Join the Top 10 Esports Guild • Earn weekly prize pool shares up to 5 ETH',
    bonusText: '5 ETH POOL',
    badge: 'GUILD REWARDS',
    ctr: '31.9%',
    accentColor: '#eab308',
    bgGradient: 'from-yellow-950 via-amber-950 to-zinc-950',
    actionLabel: 'JOIN TOP GUILD',
  },
  {
    title: '⚡ SPEED RUNNER CASH CHALLENGE ⚡',
    tagline: 'Complete obstacle levels in under 30 seconds to win automated bounties',
    bonusText: '$200 BOUNTY',
    badge: 'SPEED BOUNTY',
    ctr: '36.0%',
    accentColor: '#22c55e',
    bgGradient: 'from-green-950 via-emerald-950 to-zinc-950',
    actionLabel: 'START CHALLENGE',
  },
  {
    title: '💎 CYBER CITY TYCOON: SIMULATOR 💎',
    tagline: 'Build neon skyscrapers, earn simulated tax profits paid in real USDT',
    bonusText: 'USDT TAX POOL',
    badge: 'SIM TYCOON',
    ctr: '34.7%',
    accentColor: '#6366f1',
    bgGradient: 'from-indigo-950 via-purple-950 to-zinc-950',
    actionLabel: 'BUILD NEON CITY',
  },
  {
    title: '🎯 CYBER SNIPER TOURNAMENT ROYALE 🎯',
    tagline: 'Eliminate targets in Telegram mini-game • $10,000 weekly leaderboard',
    bonusText: '$10K LEADERBOARD',
    badge: 'ROYALE LEAGUE',
    ctr: '39.1%',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-950 via-pink-950 to-zinc-950',
    actionLabel: 'JOIN ROYALE',
  },
  {
    title: '🌟 VR CASINO METAVERSE PASSPORT 🌟',
    tagline: 'Experience immersive cyber VIP lounges from any device with zero lag',
    bonusText: 'FREE VIP PASS',
    badge: 'METAVERSE VR',
    ctr: '27.5%',
    accentColor: '#14b8a6',
    bgGradient: 'from-teal-950 via-cyan-950 to-zinc-950',
    actionLabel: 'CLAIM VIP PASS',
  },
];

// 15 unique templates for Forex Trading Banners
export const FOREX_TEMPLATES: BannerTemplate[] = [
  {
    title: '📈 MT5 M5 CANDLESTICK TERMINAL: 99.4% GOLD & FX BOT 📈',
    tagline: 'Authentic MetaTrader 5 M5 Japanese Candlesticks • 1-Tap Quick SELL/BUY Execution • 99.4% Win EA',
    bonusText: '99.4% MT5 BOT',
    badge: 'MT5 TERMINAL',
    ctr: '58.2%',
    accentColor: '#2cb5a8',
    bgGradient: 'from-emerald-950 via-zinc-950 to-black',
    actionLabel: 'OPEN MT5 CHART',
  },
  {
    title: '🥇 XAUUSDm (GOLD) M5 LIVE CANDLESTICK SNIPER 🥇',
    tagline: 'London & NY Session Breakout • Live Teal & Coral Candlestick Ticks • +250 Pips Daily Target',
    bonusText: '+250 PIPS DAILY',
    badge: 'XAUUSDm M5',
    ctr: '55.6%',
    accentColor: '#eab308',
    bgGradient: 'from-amber-950 via-yellow-950 to-zinc-950',
    actionLabel: 'SNIPE GOLD ON MT5',
  },
  {
    title: '⚡ BCHUSDm (BITCOIN CASH) M5 SCALPING TERMINAL ⚡',
    tagline: 'M5 High Volatility Momentum Candlestick Chart • 0.01s Execution • 99.5% Verified Accuracy',
    bonusText: '99.5% ACCURACY',
    badge: 'BCHUSDm M5',
    ctr: '53.9%',
    accentColor: '#38bdf8',
    bgGradient: 'from-sky-950 via-blue-950 to-zinc-950',
    actionLabel: 'TRADE BCH ON MT5',
  },
  {
    title: '🤖 QUANTUM FX 99.2% AUTO-TRADER EA FOR MT4/MT5 🤖',
    tagline: '100% Hands-Free Automated Execution • 99.2% Profit Factor • Zero Drawdown Hedging Shield',
    bonusText: '99.2% PROFIT FACTOR',
    badge: 'TOP WIN BOT',
    ctr: '53.8%',
    accentColor: '#a855f7',
    bgGradient: 'from-purple-950 via-indigo-950 to-zinc-950',
    actionLabel: 'DOWNLOAD 99% BOT',
  },
  {
    title: '🏆 $100,000 INSTANT FUNDED PROP TRADER ACCOUNT 🏆',
    tagline: 'Pass Any Challenge in 24h with our 99% Win Bot • 90% Profit Split • Direct Crypto Payouts',
    bonusText: '$100K ACCOUNT',
    badge: 'PROP FIRM',
    ctr: '49.1%',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-teal-950 to-zinc-950',
    actionLabel: 'CLAIM $100K PORTAL',
  },
  {
    title: '📈 EUR/USD & GBP/USD ZERO SPREAD ECN BROKER 📈',
    tagline: 'Raw 0.0 Pip Spreads • 1:2000 Leverage • Instant USDT & TON Direct Deposits',
    bonusText: '0.0 PIP SPREAD',
    badge: 'RAW ECN',
    ctr: '34.6%',
    accentColor: '#38bdf8',
    bgGradient: 'from-sky-950 via-blue-950 to-zinc-950',
    actionLabel: 'OPEN ECN ACCOUNT',
  },
  {
    title: '🎁 100% FOREX DEPOSIT MATCH + $50 NO-DEPOSIT BONUS 🎁',
    tagline: 'Double your margin immediately! Start trading global currency pairs with $0 risk',
    bonusText: '100% MATCH + $50',
    badge: 'NO DEPOSIT $50',
    ctr: '47.8%',
    accentColor: '#22c55e',
    bgGradient: 'from-green-950 via-emerald-950 to-zinc-950',
    actionLabel: 'CLAIM $50 FREE',
  },
  {
    title: '⚡ VIP TELEGRAM FOREX SIGNALS: 99.1% ACCURACY ⚡',
    tagline: 'Over 45,000 active traders profiting daily from 99% win-rate sniper entry signals',
    bonusText: '99.1% ACCURACY',
    badge: 'VIP 99% SIGNALS',
    ctr: '54.2%',
    accentColor: '#f97316',
    bgGradient: 'from-orange-950 via-amber-950 to-zinc-950',
    actionLabel: 'JOIN 99% VIP BOT',
  },
  {
    title: '🎯 NASDAQ 100 & US30 99% VOLATILITY ROBOT 🎯',
    tagline: 'Trade US Market Open with ultra-tight stop-loss and 99% high-accuracy profit targets',
    bonusText: '99% INDEX BOT',
    badge: 'US30 99% BOT',
    ctr: '46.9%',
    accentColor: '#ef4444',
    bgGradient: 'from-red-950 via-rose-950 to-zinc-950',
    actionLabel: 'SNIPE US30 NOW',
  },
  {
    title: '🪙 FOREX CENT ACCOUNT: START TRADING WITH $10 🪙',
    tagline: 'Micro Lot Size 0.001 • Test our 99% win algorithm in real market conditions with $10',
    bonusText: 'START WITH $10',
    badge: 'MICRO LOTS',
    ctr: '31.4%',
    accentColor: '#14b8a6',
    bgGradient: 'from-teal-950 via-cyan-950 to-zinc-950',
    actionLabel: 'OPEN CENT ACCOUNT',
  },
  {
    title: '👑 COPYTRADING MASTER: 99% PROFITABLE TRADES 👑',
    tagline: 'Auto-mirror verified top Master Trader with 99% winning months 100% hands-free via Telegram',
    bonusText: '99% WIN TRADES',
    badge: '99% AUTO COPY',
    ctr: '52.0%',
    accentColor: '#ec4899',
    bgGradient: 'from-pink-950 via-purple-950 to-zinc-950',
    actionLabel: 'COPY MASTER NOW',
  },
  {
    title: '🛡️ SWAP-FREE ISLAMIC FOREX (NO OVERNIGHT FEES) 🛡️',
    tagline: 'Hold Gold, Oil & Major Currencies long-term with 0 overnight rollover interest',
    bonusText: '0% SWAP FEES',
    badge: 'SWAP FREE',
    ctr: '29.8%',
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-950 via-sky-950 to-zinc-950',
    actionLabel: 'ACTIVATE SWAP-FREE',
  },
  {
    title: '💎 $250,000 GLOBAL FOREX TRADING LEAGUE CONTEST 💎',
    tagline: 'Compete with global currency traders! Top 50 win withdrawable cash prizes',
    bonusText: '$250K CONTEST',
    badge: 'LEADERBOARD',
    ctr: '37.5%',
    accentColor: '#fbbf24',
    bgGradient: 'from-yellow-950 via-amber-950 to-zinc-950',
    actionLabel: 'ENTER CONTEST',
  },
  {
    title: '🌐 BTC & FOREX HYBRID CRYPTO DERIVATIVES 🌐',
    tagline: 'Deposit BTC, ETH, USDT or TON • Trade 80+ Forex pairs without fiat conversion',
    bonusText: 'CRYPTO TO FX',
    badge: 'HYBRID POOL',
    ctr: '35.8%',
    accentColor: '#6366f1',
    bgGradient: 'from-indigo-950 via-purple-950 to-zinc-950',
    actionLabel: 'TRADE WITH CRYPTO',
  },
  {
    title: '🚀 1:2000 UNLIMITED LEVERAGE POWER ACCOUNT 🚀',
    tagline: 'Maximize market buying power on EUR, GBP, JPY & Gold with negative balance protection',
    bonusText: '1:2000 LEVERAGE',
    badge: 'MAX POWER',
    ctr: '41.9%',
    accentColor: '#e11d48',
    bgGradient: 'from-rose-950 via-red-950 to-zinc-950',
    actionLabel: 'BOOST LEVERAGE',
  },
  {
    title: '🏛️ INSTITUTIONAL TIER-1 DARK POOL FOREX LIQUIDITY 🏛️',
    tagline: 'Direct FIX API connection to London & Tokyo Interbank Prime Brokers',
    bonusText: 'FIX API DIRECT',
    badge: 'INSTITUTIONAL',
    ctr: '30.5%',
    accentColor: '#0ea5e9',
    bgGradient: 'from-cyan-950 via-blue-950 to-zinc-950',
    actionLabel: 'REQUEST FIX ACCESS',
  },
  {
    title: '🔥 RISK-FREE FIRST 5 TRADES CASHBACK GUARANTEE 🔥',
    tagline: 'If your first 5 trades end in loss, get 100% refund credited back in USDT!',
    bonusText: '100% LOSS REFUND',
    badge: 'RISK FREE',
    ctr: '49.2%',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-950 via-orange-950 to-zinc-950',
    actionLabel: 'CLAIM RISK-FREE',
  },
];

// 15 unique templates for Football Betting Slip VVIP & Correct Score
export const FOOTBALL_TEMPLATES: BannerTemplate[] = [
  {
    title: '⚽ VVIP 100% CORRECT SCORE 250+ ODDS FIXED SLIP ⚽',
    tagline: 'Direct Insider Fixed Matches • Exact Half-Time / Full-Time Score Guarantee',
    bonusText: '250+ ODDS FIXED',
    badge: 'VVIP SLIP',
    ctr: '52.4%',
    accentColor: '#22c55e',
    bgGradient: 'from-green-950 via-emerald-950 to-zinc-950',
    actionLabel: 'GET VVIP SLIP',
  },
  {
    title: '🎯 DAILY 50+ ODDS ACCUMULATOR MULTI-BET COMBO 🎯',
    tagline: '5-Match Over 2.5 Goals & Both Teams To Score (BTTS) Banker Tickets',
    bonusText: '50+ COMBO ODDS',
    badge: 'BANKER ACCA',
    ctr: '44.8%',
    accentColor: '#eab308',
    bgGradient: 'from-yellow-950 via-amber-950 to-zinc-950',
    actionLabel: 'GET DAILY SLIP',
  },
  {
    title: '🔥 HALF-TIME / FULL-TIME (HT/FT 1/2 & 2/1) TURNAROUND 🔥',
    tagline: 'Massive 30.00 Odds Turnaround Matches • 100% Verified Match Reports',
    bonusText: '30.00 HT/FT',
    badge: 'HT/FT SPECIAL',
    ctr: '49.6%',
    accentColor: '#f97316',
    bgGradient: 'from-orange-950 via-red-950 to-zinc-950',
    actionLabel: 'JOIN VIP TELEGRAM',
  },
  {
    title: '👑 CHAMPIONS LEAGUE & PREMIER LEAGUE VVIP PASS 👑',
    tagline: 'Real Madrid, Man City, Arsenal & Bayern Munich Exact Score Predictions',
    bonusText: 'UCL & EPL SLIP',
    badge: 'PREMIUM VVIP',
    ctr: '46.3%',
    accentColor: '#38bdf8',
    bgGradient: 'from-sky-950 via-blue-950 to-zinc-950',
    actionLabel: 'UNLOCK UCL SLIPS',
  },
  {
    title: '🤖 AI NEURAL FOOTBALL PREDICTOR: 98.4% STRIKE RATE 🤖',
    tagline: 'Machine Learning Algorithm scanning 1,400+ European & South American Leagues',
    bonusText: '98.4% WIN RATE',
    badge: 'AI BOT SLIP',
    ctr: '43.7%',
    accentColor: '#a855f7',
    bgGradient: 'from-purple-950 via-violet-950 to-zinc-950',
    actionLabel: 'COPY AI SLIP',
  },
  {
    title: '💰 100% MONEY-BACK GUARANTEE BETTING SLIP 💰',
    tagline: 'If one game cuts your ticket, receive an instant 100% refund in crypto or cash!',
    bonusText: 'MONEY BACK 100%',
    badge: 'INSURED SLIP',
    ctr: '48.1%',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-teal-950 to-zinc-950',
    actionLabel: 'GET INSURED TICKET',
  },
  {
    title: '⚡ ROLLOVER CHALLENGE: $20 TO $5,000 IN 5 DAYS ⚡',
    tagline: 'Safe 1.30–1.50 Daily Banker Odds Compound System • Day 1 Starts Now!',
    bonusText: '$20 -> $5,000',
    badge: 'ROLLOVER 5-DAY',
    ctr: '51.9%',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-950 via-yellow-950 to-zinc-950',
    actionLabel: 'JOIN ROLLOVER',
  },
  {
    title: '🏆 MEGA WEEKEND JACKPOT: 15/15 GAMES PREDICTION 🏆',
    tagline: 'Guaranteed 13+ Minimum Score or Free Replacement for Next Weekend Pool',
    bonusText: '$1,000,000 POOL',
    badge: 'MEGA JACKPOT',
    ctr: '41.5%',
    accentColor: '#ec4899',
    bgGradient: 'from-pink-950 via-rose-950 to-zinc-950',
    actionLabel: 'GET 15/15 SLIP',
  },
  {
    title: '🛡️ DRAW-NO-BET (DNB) & HANDICAP SAFE LOCKS 🛡️',
    tagline: 'Zero Risk Asian Handicap & Draw No Bet strategies for high-roller punters',
    bonusText: 'SAFE LOCKS',
    badge: 'LOW RISK',
    ctr: '36.2%',
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-950 via-slate-950 to-zinc-950',
    actionLabel: 'GET SAFE SLIP',
  },
  {
    title: '🎫 LIVE IN-PLAY 80TH MINUTE GOAL SNIPER 🎫',
    tagline: 'Telegram Instant Live Notifications for late momentum game winners',
    bonusText: 'LIVE IN-PLAY',
    badge: 'LIVE SNIPER',
    ctr: '39.8%',
    accentColor: '#ef4444',
    bgGradient: 'from-red-950 via-rose-950 to-zinc-950',
    actionLabel: 'SNIPE LIVE GOALS',
  },
  {
    title: '💎 SUPER VIP SOURCE: 2 ACCURATE CORRECT SCORES 💎',
    tagline: 'Score 1: 3-1 Odds (14.00) + Score 2: 2-0 Odds (9.50) • Total Odds 133.00',
    bonusText: '133.00 ODDS',
    badge: 'DOUBLE SCORE',
    ctr: '54.0%',
    accentColor: '#8b5cf6',
    bgGradient: 'from-violet-950 via-purple-950 to-zinc-950',
    actionLabel: 'REVEAL SCORES',
  },
  {
    title: '🌍 SERIE A, LA LIGA & BUNDESLIGA GOLD TICKET 🌍',
    tagline: 'Weekend European Top Flights Combo Slip • High Staking Confidence',
    bonusText: 'EUROPE GOLD',
    badge: 'TOP LEAGUES',
    ctr: '42.9%',
    accentColor: '#eab308',
    bgGradient: 'from-yellow-950 via-amber-950 to-zinc-950',
    actionLabel: 'CLAIM GOLD TICKET',
  },
  {
    title: '💸 CORNERS & CARDS STATISTICAL EDGE SLIP 💸',
    tagline: 'Over 9.5 Total Match Corners + Over 4.5 Yellow Cards High Precision Multi',
    bonusText: 'STATS EDGE',
    badge: 'CORNERS & CARDS',
    ctr: '35.4%',
    accentColor: '#14b8a6',
    bgGradient: 'from-teal-950 via-emerald-950 to-zinc-950',
    actionLabel: 'GET STATS SLIP',
  },
  {
    title: '🔥 10-GAME ACCA WITH 200% CASHOUT BOOST BONUS 🔥',
    tagline: 'Extra 200% winning bonus added automatically on every winning accumulator',
    bonusText: '+200% BONUS',
    badge: 'ACCA BOOST',
    ctr: '47.5%',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-950 via-red-950 to-zinc-950',
    actionLabel: 'BOOST SLIP 200%',
  },
  {
    title: '🎟️ VIP WHALE FOOTBALL CLUB: PRIVATE DAILY DOSSIER 🎟️',
    tagline: 'Exclusive daily match betting insights sent 4 hours before kickoff',
    bonusText: 'VIP DOSSIER',
    badge: 'WHALE CLUB',
    ctr: '50.1%',
    accentColor: '#6366f1',
    bgGradient: 'from-indigo-950 via-blue-950 to-zinc-950',
    actionLabel: 'JOIN WHALE CLUB',
  },
];

// 15 unique templates for CryptoFundBiz Institutional Crypto Loans (with website redirect support)
export const CRYPTO_LOAN_TEMPLATES: BannerTemplate[] = [
  {
    title: '🏦 CRYPTOFUNDBIZ: INSTITUTIONAL CRYPTO LOANS ($700 - $50,000) 🏦',
    tagline: 'Fast commercial capital in USDT, BTC, or ETH. Flexible 1–10 year terms • 7.5% Estimated APR',
    bonusText: '$700 - $50,000 USD',
    badge: 'CRYPTOFUNDBIZ',
    ctr: '49.8%',
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-950 via-sky-950 to-zinc-950',
    actionLabel: 'APPLY ON CRYPTOFUNDBIZ',
  },
  {
    title: '⚡ FAST COMMERCIAL CRYPTO CAPITAL: INSTANT DISBURSEMENT ⚡',
    tagline: 'Empowering small businesses, startups & traders with instant liquidity in USDT, BTC, ETH',
    bonusText: '7.5% EST. APR',
    badge: 'FAST CAPITAL',
    ctr: '47.5%',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-teal-950 to-zinc-950',
    actionLabel: 'CALCULATE LOAN',
  },
  {
    title: '🪙 BORROW UP TO $50,000 IN USDT / BTC / ETH 🪙',
    tagline: 'Instant liquidity directly to your crypto wallet • Flexible 1 to 10 year repayment terms',
    bonusText: '1 - 10 YR TERMS',
    badge: 'USDT • BTC • ETH',
    ctr: '44.9%',
    accentColor: '#eab308',
    bgGradient: 'from-yellow-950 via-amber-950 to-zinc-950',
    actionLabel: 'APPLY FOR LOAN',
  },
  {
    title: '🚀 CRYPTOFUNDBIZ COMMERCIAL BUSINESS LOANS 🚀',
    tagline: 'No traditional bank credit friction • 4-step approval with 20% refundable qualification fee',
    bonusText: 'INSTANT LIQUIDITY',
    badge: 'BUSINESS LOAN',
    ctr: '48.9%',
    accentColor: '#a855f7',
    bgGradient: 'from-purple-950 via-violet-950 to-zinc-950',
    actionLabel: 'GET APPROVED',
  },
  {
    title: '🛡️ INSTITUTIONAL CRYPTO LENDING PORTAL 🛡️',
    tagline: 'Real-time loan calculation with transparent amortization schedule & direct wallet payout',
    bonusText: '20% REFUNDABLE FEE',
    badge: 'VERIFIED PORTAL',
    ctr: '41.6%',
    accentColor: '#38bdf8',
    bgGradient: 'from-blue-950 via-cyan-950 to-zinc-950',
    actionLabel: 'VIEW LOAN PORTAL',
  },
  {
    title: '💎 $15,000 COMMERCIAL LOAN = ONLY $466.59/MO 💎',
    tagline: 'Empower your enterprise with flexible 36-month capital in USDT, Bitcoin, or Ethereum',
    bonusText: '$466.59/MO (3 YR)',
    badge: 'POPULAR TIER',
    ctr: '52.1%',
    accentColor: '#22c55e',
    bgGradient: 'from-green-950 via-emerald-950 to-zinc-950',
    actionLabel: 'CLAIM $15K LOAN',
  },
  {
    title: '🌐 CRYPTO CAPITAL FOR ENTREPRENEURS & STARTUPS 🌐',
    tagline: 'Scale operations without selling your crypto portfolio. $700 to $50,000 USD instant release',
    bonusText: 'STARTUP CAPITAL',
    badge: 'ENTREPRENEUR',
    ctr: '43.2%',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-950 via-yellow-950 to-zinc-950',
    actionLabel: 'APPLY NOW',
  },
  {
    title: '👑 CRYPTOFUNDBIZ VIP COMMERCIAL FINANCING 👑',
    tagline: 'Multi-crypto disbursement in USDT, BTC, ETH with dedicated underwriting & fast wallet payout',
    bonusText: 'UP TO $50,000',
    badge: 'VIP CAPITAL',
    ctr: '46.3%',
    accentColor: '#ec4899',
    bgGradient: 'from-pink-950 via-rose-950 to-zinc-950',
    actionLabel: 'ACCESS PORTAL',
  },
  {
    title: '🌐 STABLECOIN CREDIT LINE FOR CRYPTO TRADERS 🌐',
    tagline: 'Leverage your portfolio without selling. Ideal for arbitrage, trading and daily expenses',
    bonusText: 'TRADER CREDIT',
    badge: 'TRADING LINE',
    ctr: '42.1%',
    accentColor: '#6366f1',
    bgGradient: 'from-indigo-950 via-purple-950 to-zinc-950',
    actionLabel: 'OPEN CREDIT LINE',
  },
  {
    title: '🔥 FLASH LOAN PROTOCOL: $500K INSTANT ARBITRAGE LIQUIDITY 🔥',
    tagline: 'Zero collateral intra-block loans for DeFi arbitrageurs, liquidators and bot operators',
    bonusText: '$500K FLASH POOL',
    badge: 'FLASH LOAN',
    ctr: '45.3%',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-950 via-red-950 to-zinc-950',
    actionLabel: 'ACCESS FLASH DEFI',
  },
  {
    title: '👑 VIP CRYPTO WEALTH: $1,000,000+ PRIVATE LOAN DESK 👑',
    tagline: 'Dedicated account manager, customized LTV structures and prime OTC liquidity rates',
    bonusText: '$1M+ DESK',
    badge: 'WHALE DESK',
    ctr: '37.8%',
    accentColor: '#fbbf24',
    bgGradient: 'from-yellow-950 via-amber-950 to-zinc-950',
    actionLabel: 'CONTACT DESK',
  },
  {
    title: '🪙 TON & TELEGRAM CRYPTO LOAN BOT 🪙',
    tagline: 'Borrow USDT using TON & Notcoin inside Telegram in 3 taps • Instant Tonkeeper Payout',
    bonusText: 'TON NATIVE LOAN',
    badge: 'TON LOAN',
    ctr: '47.0%',
    accentColor: '#0ea5e9',
    bgGradient: 'from-cyan-950 via-blue-950 to-zinc-950',
    actionLabel: 'LAUNCH TG LOAN',
  },
  {
    title: '🎁 FIRST-TIME BORROWER $100 CASHBACK BONUS 🎁',
    tagline: 'Take a loan of $1,000+ and receive a free $100 cash voucher credited into your account',
    bonusText: '$100 FREE BONUS',
    badge: '$100 VOUCHER',
    ctr: '51.2%',
    accentColor: '#ec4899',
    bgGradient: 'from-pink-950 via-rose-950 to-zinc-950',
    actionLabel: 'CLAIM $100 BONUS',
  },
  {
    title: '🛡️ AUTO-MARGIN REFINANCING WITH ZERO LIQUIDATION 🛡️',
    tagline: 'Smart buffer cushions your loan during market dips so you never lose collateral',
    bonusText: 'ZERO LIQUIDATION',
    badge: 'BUFFER SHIELD',
    ctr: '40.6%',
    accentColor: '#14b8a6',
    bgGradient: 'from-teal-950 via-cyan-950 to-zinc-950',
    actionLabel: 'EXPLORE SHIELD',
  },
  {
    title: '📈 MINER EQUIPMENT CAPITAL & HASHRATE FINANCING 📈',
    tagline: 'Use your mined Bitcoin or mining rigs as collateral to expand your ASIC hash farm',
    bonusText: 'MINER FINANCING',
    badge: 'MINER LOAN',
    ctr: '33.9%',
    accentColor: '#e11d48',
    bgGradient: 'from-rose-950 via-red-950 to-zinc-950',
    actionLabel: 'FINANCE ASICS',
  },
  {
    title: '💰 MICRO CRYPTO LOANS: BORROW FROM $25 TO $500 💰',
    tagline: 'Instant micro-credits with 5-minute approval. Perfect for urgent crypto gas and fees',
    bonusText: 'FROM $25',
    badge: 'MICRO LOAN',
    ctr: '44.5%',
    accentColor: '#84cc16',
    bgGradient: 'from-lime-950 via-green-950 to-zinc-950',
    actionLabel: 'GET $25-$500',
  },
];

// 4 PayPal Money Reload / Top-up Banner Templates
export const PAYPAL_TEMPLATES: BannerTemplate[] = [
  {
    title: '⚡ INSTANT PAYPAL RELOAD & BALANCE INJECTION ⚡',
    tagline: 'Deposit Crypto, Card or MoMo -> Receive Instant $50 - $5,000 PayPal Funds with 0% Hold',
    bonusText: 'INSTANT RELOAD',
    badge: 'PAYPAL TOP-UP',
    ctr: '48.9%',
    accentColor: '#0070ba',
    bgGradient: 'from-blue-950 via-sky-950 to-zinc-950',
    actionLabel: 'RELOAD PAYPAL NOW',
  },
  {
    title: '💳 100% VERIFIED PAYPAL MONEY ADDED & TOPUP 💳',
    tagline: 'Direct peer-to-peer balance reload. Instant email confirmation & available for immediate transfer',
    bonusText: '$100 - $5,000',
    badge: 'VERIFIED FUNDS',
    ctr: '51.2%',
    accentColor: '#003087',
    bgGradient: 'from-indigo-950 via-blue-950 to-zinc-950',
    actionLabel: 'TOP-UP BALANCE',
  },
  {
    title: '🚀 CRYPTO TO PAYPAL INSTANT CASHOUT & RELOAD 🚀',
    tagline: 'Swap USDT, BTC, ETH or TON directly into Clean PayPal Balance in 60 seconds with buyer protection',
    bonusText: '60s DELIVERY',
    badge: '0% HOLD PROMO',
    ctr: '46.7%',
    accentColor: '#0ea5e9',
    bgGradient: 'from-sky-950 via-cyan-950 to-zinc-950',
    actionLabel: 'EXCHANGE TO PAYPAL',
  },
  {
    title: '🌐 GLOBAL PAYPAL RELOAD & COMMERCIAL CAPITAL 🌐',
    tagline: 'Send & receive high-volume PayPal balance top-ups worldwide. Direct Telegram concierge support',
    bonusText: 'NO KYC / FAST',
    badge: 'GLOBAL RELOAD',
    ctr: '43.8%',
    accentColor: '#38bdf8',
    bgGradient: 'from-blue-950 via-slate-950 to-zinc-950',
    actionLabel: 'START PAYPAL RELOAD',
  },
];

// Wealthy Sugar Mummy & Sugar Daddy (Ages 37-78) Marriage & Companionship Banner Templates
export const SUGAR_MUMMY_TEMPLATES: BannerTemplate[] = [
  {
    title: '👑 WEALTHY SUGAR MUMMY (AGE 37-78) LOOKING FOR MAN TO MARRY 👑',
    tagline: 'Multi-Millionaires from Africa (Nigeria, Ghana, South Africa), Europe & USA Seeking Marriage & Companionship • $15,000 - $60,000/mo',
    bonusText: '$25,000/MO ALLOWANCE',
    badge: '💍 WEALTHY MARRIAGE',
    ctr: '61.4%',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-950 via-pink-950 to-zinc-950',
    actionLabel: 'MEET WEALTHY WOMEN',
  },
  {
    title: '💎 ELITE SUGAR DADDY (AGE 37-78) SEEKING WOMAN FOR MARRIAGE 💎',
    tagline: 'Hedge Fund Tycoons & Real Estate Moguls in Africa, UK & Europe Seeking Devoted Wife • Full Luxury Lifestyle & Cards Provided',
    bonusText: '$30,000/MO ALLOWANCE',
    badge: '👑 WEALTHY HUSBAND',
    ctr: '59.2%',
    accentColor: '#38bdf8',
    bgGradient: 'from-sky-950 via-indigo-950 to-zinc-950',
    actionLabel: 'MEET WEALTHY MEN',
  },
  {
    title: '🌍 AFRICAN & EUROPEAN WEALTHY LADIES (AGE 37-78) SEEKING HUSBANDS 🌍',
    tagline: 'Lagos, Paris, London, Accra & Nairobi Estates • Looking for honest, loving partner to marry, spoil & travel together',
    bonusText: 'LUXURY TRAVEL & VILLA',
    badge: '💍 SUGAR MUMMY VIP',
    ctr: '64.7%',
    accentColor: '#fb7185',
    bgGradient: 'from-pink-950 via-purple-950 to-black',
    actionLabel: 'CONNECT ON TELEGRAM',
  },
  {
    title: '🎩 DISTINGUISHED MILLIONAIRE (AGE 37-78) LOOKING FOR A WIFE 🎩',
    tagline: 'Generous executive offering luxury housing, supercars, and unconditional monthly sponsorship for true marriage',
    bonusText: 'FULL SPONSORSHIP',
    badge: '🏆 WEALTHY PATRON',
    ctr: '56.9%',
    accentColor: '#eab308',
    bgGradient: 'from-amber-950 via-yellow-950 to-zinc-950',
    actionLabel: 'VIEW ELITE PROFILE',
  },
  {
    title: '👸 EUROPEAN & AFRICAN HEIRESSES (AGE 37-78): MARRIAGE & FULL SUPPORT 👸',
    tagline: 'Paris, Lagos & Geneva Residents • Ready to sponsor and marry an affectionate gentleman with $20,000/mo cash allowance',
    bonusText: '$20,000/MO CASH',
    badge: '✨ SUGAR MUMMY',
    ctr: '63.1%',
    accentColor: '#ec4899',
    bgGradient: 'from-fuchsia-950 via-rose-950 to-zinc-950',
    actionLabel: 'INSTANT MATCHMAKER',
  },
  {
    title: '💰 WEALTHY BUSINESSWOMEN (37-78 YRS) SPONSORSHIP & MARRIAGE 💰',
    tagline: 'Verified multi-millionaire women seeking genuine companionship, marriage, and loyalty with royal pampering',
    bonusText: 'VERIFIED MILLIONAIRE',
    badge: '💎 VIP ESCROW',
    ctr: '60.3%',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-teal-950 to-black',
    actionLabel: 'CONNECT WITH MUMMIES',
  },
];

// 4 Shopping & Virtual Prepaid Card Banner Templates
export const SHOPPING_TEMPLATES: BannerTemplate[] = [
  {
    title: '🛍️ $500 FREE SHOPPING VIRTUAL CARD & VOUCHER 🛍️',
    tagline: 'Claim funded virtual shopping cards, global e-commerce vouchers & promo cashback for instant online store checkout',
    bonusText: '$500 SHOPPING CARD',
    badge: 'FUNDED VOUCHER',
    ctr: '51.8%',
    accentColor: '#ec4899',
    bgGradient: 'from-pink-950 via-purple-950 to-zinc-950',
    actionLabel: 'GET SHOPPING CARD',
  },
  {
    title: '💳 INSTANT VIRTUAL VISA & MASTERCARD SHOPPING CARDS 💳',
    tagline: 'Instant issuance prepaid virtual cards (Visa & Mastercard) funded for Amazon, AliExpress, eBay, ASOS and online stores',
    bonusText: 'INSTANT ISSUANCE',
    badge: 'VIRTUAL DEBIT',
    ctr: '54.2%',
    accentColor: '#8b5cf6',
    bgGradient: 'from-purple-950 via-indigo-950 to-zinc-950',
    actionLabel: 'CLAIM VIRTUAL CARD',
  },
  {
    title: '🎁 $1,000 GLOBAL E-COMMERCE SPREE & CASHBACK 🎁',
    tagline: 'Exclusive 30% discount coupons, store credits & cashback vouchers for international shopping platforms',
    bonusText: '30% CASHBACK PROMO',
    badge: 'GLOBAL STORE SPREE',
    ctr: '48.6%',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-950 via-fuchsia-950 to-zinc-950',
    actionLabel: 'CLAIM STORE PROMO',
  },
  {
    title: '🛒 1-CLICK PREPAID SHOPPING CARD & REWARD BALANCE 🛒',
    tagline: 'Prepaid virtual shopping cards with instant delivery via Telegram concierge with zero maintenance fees',
    bonusText: 'PREPAID CARD',
    badge: 'ZERO FEE CARD',
    ctr: '46.7%',
    accentColor: '#d946ef',
    bgGradient: 'from-fuchsia-950 via-pink-950 to-zinc-950',
    actionLabel: 'REDEEM SHOPPING CARD',
  },
];

// 6 E-Commerce & Dropshipping Automation Banner Templates
export const DROPSHIPPING_TEMPLATES: BannerTemplate[] = [
  {
    title: '📦 1-CLICK AUTOMATED TIKTOK & SHOPIFY DROPSHIPPING STORE 📦',
    tagline: 'Turnkey Automated E-Com Stores with Pre-Loaded Viral Winners • 2-4 Day US/EU Fast Fulfillment • 80% Net Margins',
    bonusText: '80% PROFIT MARGIN',
    badge: 'TURNKEY STORE',
    ctr: '58.4%',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-teal-950 to-zinc-950',
    actionLabel: 'LAUNCH STORE VIA TG',
  },
  {
    title: '🔥 SPY 7-FIGURE VIRAL WINNING DROPSHIP PRODUCTS 🔥',
    tagline: 'Access 50+ Tested Winning Products with Sourcing Quotes, Supplier VIP Lines & High-Converting Video UGC Ads',
    bonusText: '50+ TESTED WINNERS',
    badge: 'VIRAL SPY TOOLS',
    ctr: '62.1%',
    accentColor: '#eab308',
    bgGradient: 'from-amber-950 via-yellow-950 to-zinc-950',
    actionLabel: 'GET WINNING PRODUCTS',
  },
  {
    title: '🚚 FAST 2-4 DAY US/EU SUPPLIER WAREHOUSE LINE 🚚',
    tagline: 'Private Agent Automated Fulfillment for CJ Dropshipping & AutoDS • Zero MOQ • Custom Branded Packaging',
    bonusText: '2-4 DAY DELIVERY',
    badge: 'PRIVATE AGENT',
    ctr: '54.7%',
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-950 via-blue-950 to-zinc-950',
    actionLabel: 'CONNECT US SUPPLIERS',
  },
  {
    title: '💰 $10,000/MO DROPSHIPPING SCALE BLUEPRINT & ADS PACK 💰',
    tagline: 'Complete TikTok Shop & Meta Ads Scaling Playbook • High ROAS Creatives • 100% Automated Order Sync',
    bonusText: '$10K/MO BLUEPRINT',
    badge: 'SCALING PLAYBOOK',
    ctr: '65.3%',
    accentColor: '#a855f7',
    bgGradient: 'from-purple-950 via-fuchsia-950 to-zinc-950',
    actionLabel: 'CLAIM BLUEPRINT NOW',
  },
];

const HYIP_PROJECT_URLS = [
  'https://aura-diamond-holdings.vercel.app',
  'https://gold-bod-pro.vercel.app',
  'https://cloud-mine-x.vercel.app',
  'https://prime-gold-resources.vercel.app',
];

// Default URL for CryptoFundBiz Institutional Crypto Loan portal
export const CRYPTO_LOAN_DEFAULT_URL = 'https://crypto-fund-biz.vercel.app';

// 4 unique templates for Free Virtual Phone Numbers
const VIRTUAL_PHONE_TEMPLATES: BannerTemplate[] = [
  {
    title: '📱 FREE VIRTUAL PHONE NUMBERS (CALLS & SMS) 📱',
    tagline: 'Instant Online Verification for WhatsApp, TikTok, Facebook, Telegram, Google & PayPal • 120+ Countries',
    bonusText: '100% FREE',
    badge: 'SMS OTP LIVE',
    ctr: '34.8%',
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-950 via-zinc-950 to-teal-950',
    actionLabel: 'GET FREE NUMBER',
  },
  {
    title: '💼 BUSINESS & PERSONAL VIRTUAL SIM NUMBERS 💼',
    tagline: 'US 🇺🇸, UK 🇬🇧, Canada 🇨🇦 & Global Numbers • WhatsApp Business & Free VoIP Incoming Calls',
    bonusText: 'NO KYC',
    badge: 'VIP BUSINESS',
    ctr: '31.2%',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-zinc-950 to-cyan-950',
    actionLabel: 'ACTIVATE VIRTUAL SIM',
  },
  {
    title: '💬 WHATSAPP & TIKTOK INSTANT OTP RECEIVER 💬',
    tagline: 'Receive SMS Verification Codes in < 3 Seconds • Bypass 2FA on Meta, Google & TikTok',
    bonusText: '3 SEC OTP',
    badge: 'HOT VERIFY',
    ctr: '38.4%',
    accentColor: '#22c55e',
    bgGradient: 'from-green-950 via-zinc-950 to-emerald-950',
    actionLabel: 'RECEIVE SMS OTP',
  },
  {
    title: '🌐 PRIVATE ANONYMOUS VIRTUAL SECOND LINE 🌐',
    tagline: 'Permanent & Temporary Numbers for Dating, Private Messaging, Secret Telegram & Ads',
    bonusText: '100% PRIVATE',
    badge: 'ANONYMOUS',
    ctr: '29.6%',
    accentColor: '#38bdf8',
    bgGradient: 'from-sky-950 via-zinc-950 to-blue-950',
    actionLabel: 'GET SECOND LINE',
  },
];

// 4 unique templates for Hookup & Casual Dating
const HOOKUP_TEMPLATES: BannerTemplate[] = [
  {
    title: '🔥 DISCREET LOCAL HOOKUPS & CASUAL DATING 🔥',
    tagline: 'Connect with Verified Singles & Open Couples Tonight • 100% Private, Safe & Instant Matchmaking',
    bonusText: 'ACTIVE TONIGHT',
    badge: 'HOT MEET',
    ctr: '39.4%',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-950 via-zinc-950 to-pink-950',
    actionLabel: 'FIND LOCAL HOOKUP',
  },
  {
    title: '💋 LATE NIGHT ENCOUNTERS & HOTEL DATES 💋',
    tagline: 'Real Local Singles Online Now • Spontaneous Drinks, VIP Parties & Secret Companionship',
    bonusText: 'NO STRINGS',
    badge: 'VIP DISCREET',
    ctr: '37.8%',
    accentColor: '#fb7185',
    bgGradient: 'from-pink-950 via-zinc-950 to-rose-950',
    actionLabel: 'CONNECT WITH SINGLES',
  },
  {
    title: '⚡ SPONTANEOUS TONIGHT MATCHES (< 5 KM) ⚡',
    tagline: 'Verified Photo Profiles • Instant Chat Unlock & Fast Rendezvous in Your City',
    bonusText: 'NEARBY (<2KM)',
    badge: 'INSTANT OTP',
    ctr: '42.1%',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-950 via-zinc-950 to-rose-950',
    actionLabel: 'VIEW NEARBY SINGLES',
  },
  {
    title: '🥂 100% PRIVATE SECRET CASUAL CONCIERGE 🥂',
    tagline: 'Zero Judgement, End-to-End Encrypted Matchmaking • Meet Respectful Dating Partners',
    bonusText: '100% PRIVATE',
    badge: 'VERIFIED',
    ctr: '35.6%',
    accentColor: '#ec4899',
    bgGradient: 'from-fuchsia-950 via-zinc-950 to-purple-950',
    actionLabel: 'CHAT WITH CONCIERGE',
  },
];

// Templates for Full Stack & Android Developers Available
const DEVELOPERS_TEMPLATES: BannerTemplate[] = [
  {
    title: '💻 FULL-STACK & ANDROID DEVELOPERS AVAILABLE 💻',
    tagline: 'Senior Kotlin, Jetpack Compose, React 19, Next.js, Node, Python & Mobile Engineers • Ready in 24h',
    bonusText: 'READY IN 24H',
    badge: 'TOP 1% TALENT',
    ctr: '38.4%',
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-950 via-zinc-950 to-blue-950',
    actionLabel: 'HIRE DEVELOPER ON TG',
  },
  {
    title: '🚀 HIRE SENIOR FULL-STACK & ANDROID ENGINEERS 🚀',
    tagline: 'Native Android (Kotlin/Compose), Scalable SaaS Web Apps & Custom APIs • 100% Code Ownership & No Hiring Fees',
    bonusText: '$38/HR START',
    badge: 'SCREENED PROS',
    ctr: '34.9%',
    accentColor: '#3b82f6',
    bgGradient: 'from-blue-950 via-zinc-950 to-indigo-950',
    actionLabel: 'VIEW DEV PORTFOLIOS',
  },
  {
    title: '🤖 ANDROID APP & WEB PLATFORM SQUAD 🤖',
    tagline: 'Launch Your Android App & Web Dashboard in 14 Days • Kotlin, Jetpack Compose, Next.js & Postgres Backend',
    bonusText: '14-DAY MVP',
    badge: 'FIXED PRICE',
    ctr: '36.2%',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-zinc-950 to-cyan-950',
    actionLabel: 'GET INSTANT ESTIMATE',
  },
  {
    title: '⚡ FULL-STACK AI, ANDROID & WEB3 DEVELOPERS ⚡',
    tagline: 'Gemini LLM Workflows, Mobile Android Apps, Telegram Bots & Cloud Microservices',
    bonusText: 'AI & ANDROID',
    badge: 'VERIFIED EXPERTS',
    ctr: '41.5%',
    accentColor: '#8b5cf6',
    bgGradient: 'from-purple-950 via-zinc-950 to-cyan-950',
    actionLabel: 'HIRE AI/ANDROID DEV',
  },
];

export const EMAIL_VERIFICATION_TEMPLATES: BannerTemplate[] = [
  {
    title: '✉️ INSTANT EMAIL VERIFIER & DELIVERABILITY CHECKER ✉️',
    tagline: 'RFC 5322 Syntax, Real-time DNS MX Lookup, SMTP 250 Handshake & 0% Bounce Risk Engine',
    bonusText: '99.9% ACCURACY',
    badge: 'ZERO BOUNCE',
    ctr: '39.8%',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950 via-zinc-950 to-teal-950',
    actionLabel: 'VERIFY EMAIL FREE',
  },
  {
    title: '🛡️ 100% FREE DISPOSABLE TEMP MAIL & OTP INBOX 🛡️',
    tagline: 'Instant Private Burner Email • Receive Netflix, Binance, Steam, TikTok & PayPal Verification Codes',
    bonusText: 'INSTANT OTP',
    badge: 'ZERO LOGS',
    ctr: '42.1%',
    accentColor: '#14b8a6',
    bgGradient: 'from-teal-950 via-zinc-950 to-emerald-950',
    actionLabel: 'CLAIM TEMP INBOX',
  },
  {
    title: '⚡ BULK EMAIL LIST CLEANSER & SPAM TRAP FILTER ⚡',
    tagline: 'Clean 10k - 500k Email Lists in Seconds • Detect Disposable Domains, Honeypots & Dead MX Hosts',
    bonusText: 'BULK AUDIT',
    badge: 'HIGH SPEED',
    ctr: '37.4%',
    accentColor: '#22c55e',
    bgGradient: 'from-green-950 via-zinc-950 to-black',
    actionLabel: 'CLEANSE LIST NOW',
  },
];

export const LIVE_WEATHER_TEMPLATES: BannerTemplate[] = [
  {
    title: '☀️ SATELLITE LIVE WEATHER RADAR & METEOROLOGICAL STATION PRO ☀️',
    tagline: 'Hyper-Local Atmospheric Radar • Real-Time Rain Tickers, Storm Trackers & UV Index Customized to Your Country',
    bonusText: '100% ACCURATE',
    badge: 'LIVE RADAR',
    ctr: '38.6%',
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-950 via-sky-950 to-blue-950',
    actionLabel: 'CHECK LIVE RADAR',
  },
  {
    title: '⛈️ SEVERE STORM & TYPHOON WARNING TELEGRAM BOT 24/7 ⛈️',
    tagline: 'Get Instant Telegram Alerts for Rainfall, Gale Winds, Floods & Heatwaves Before They Strike Your City',
    bonusText: 'INSTANT ALERTS',
    badge: 'VIP BOT',
    ctr: '41.2%',
    accentColor: '#38bdf8',
    bgGradient: 'from-sky-950 via-cyan-950 to-slate-950',
    actionLabel: 'SUBSCRIBE ALERTS',
  },
  {
    title: '🌍 GLOBAL AGRI-CLIMATE & WEATHER COMMODITY INTELLIGENCE 🌍',
    tagline: 'Trade Weather Derivatives, Energy Demands, Solar Yields & Crop Harvest Forecasts with Real-Time Data',
    bonusText: 'COMMODITY SIGNALS',
    badge: 'WALL STREET',
    ctr: '36.9%',
    accentColor: '#0ea5e9',
    bgGradient: 'from-blue-950 via-teal-950 to-black',
    actionLabel: 'VIEW WEATHER DERIVATIVES',
  },
];

// Generator to produce unique banners per category across all formats
function generateBannersForCategory(category: BannerCategory, templates: BannerTemplate[]): BannerItem[] {
  const list: BannerItem[] = [];
  let count = 1;

  for (let tIdx = 0; tIdx < templates.length; tIdx++) {
    const t = templates[tIdx];
    for (let sIdx = 0; sIdx < SIZES.length; sIdx++) {
      const sizeObj = SIZES[sIdx];
      const mascot = MASCOTS[(count + sIdx) % MASCOTS.length];
      const clicks = 12000 + count * 450 + sIdx * 820;

      let websiteUrl: string | undefined = undefined;
      let actionLabel = t.actionLabel;

      if (category === 'hyip') {
        if (t.title.includes('ENERGY POINT')) {
          websiteUrl = 'https://energy-point-beta.vercel.app/register?ref=HYIPEXPLORERPRO391';
        } else if (t.title.includes('AURA DIAMOND')) {
          websiteUrl = 'https://aura-diamond-holdings.vercel.app';
        } else if (t.title.includes('GOLDBOD')) {
          websiteUrl = 'https://gold-bod-pro.vercel.app';
        } else if (t.title.includes('CLOUDMINE')) {
          websiteUrl = 'https://cloud-mine-x.vercel.app';
        } else if (t.title.includes('PRIME GOLD')) {
          websiteUrl = 'https://prime-gold-resources.vercel.app';
        } else {
          websiteUrl = HYIP_PROJECT_URLS[tIdx % HYIP_PROJECT_URLS.length];
        }
        actionLabel = 'VISIT PROJECT WEBSITE';
      } else if (category === 'crypto-loan') {
        websiteUrl = CRYPTO_LOAN_DEFAULT_URL;
        actionLabel = 'APPLY FOR CRYPTO LOAN';
      } else if (category === 'paypal') {
        actionLabel = t.actionLabel;
      } else if (category === 'shopping') {
        actionLabel = t.actionLabel;
      } else if (category === 'virtual-phone') {
        actionLabel = t.actionLabel;
      } else if (category === 'hookup-dating') {
        actionLabel = t.actionLabel;
      }

      let telegramMessage = `Hi @adkingsSupport, I want to activate/claim the ${t.title} promotion (Placement #${category}-${sizeObj.size.replace('x', '_')}-${count})!`;
      if (category === 'paypal') {
        telegramMessage = `Hi @adkingsSupport, I want to initiate a PayPal reload: "${t.title}" (${sizeObj.sizeName}). Please assist with my balance top-up!`;
      } else if (category === 'shopping') {
        telegramMessage = `Hi @adkingsSupport, I want to claim the Free Shopping Voucher / Virtual Card Promo: "${t.title}" (${sizeObj.sizeName})!`;
      } else if (category === 'sugar-mummy') {
        telegramMessage = `Hi @adkingsSupport, I am interested in VIP Matchmaking for Wealthy Women / Men (37-78 Yrs) for Marriage & Companionship: "${t.title}" (${sizeObj.sizeName})! Please connect me with verified VIP sponsors.`;
      } else if (category === 'virtual-phone') {
        telegramMessage = `Hi @adkingsSupport, I want to claim a Free Virtual Phone Number for Calls & Online Verification (WhatsApp, TikTok, Facebook): "${t.title}" (${sizeObj.sizeName})!`;
      } else if (category === 'hookup-dating') {
        telegramMessage = `Hi @adkingsSupport, I want to connect with verified singles/couples for discreet casual encounters & tonight hookups: "${t.title}" (${sizeObj.sizeName})!`;
      } else if (category === 'dropshipping') {
        telegramMessage = `Hi @adkingsSupport, I want to launch an automated E-Commerce Dropshipping Store: "${t.title}" (${sizeObj.sizeName})! Please send winning products and turnkey setup details.`;
      } else if (category === 'developers') {
        telegramMessage = `Hi @adkingsSupport, I am looking to hire Full-Stack & Android Developers: "${t.title}" (${sizeObj.sizeName})! Please share available developer profiles and kickoff details.`;
      } else if (category === 'email-verification') {
        telegramMessage = `Hi @adkingsSupport, I want to use the Email Verification & Disposable Temp Mail service: "${t.title}" (${sizeObj.sizeName})! Please provide API access or dedicated gateway setup.`;
      } else if (category === 'live-weather') {
        telegramMessage = `Hi @adkingsSupport, I want to activate Live Weather Radar & Severe Storm Alerts on Telegram: "${t.title}" (${sizeObj.sizeName})!`;
      }

      list.push({
        id: `${category}-${sizeObj.size.replace('x', '_')}-${count}`,
        title: t.title,
        category,
        size: sizeObj.size,
        sizeName: sizeObj.sizeName,
        tagline: t.tagline,
        bonusText: t.bonusText,
        badge: t.badge,
        clicks,
        ctr: t.ctr,
        accentColor: t.accentColor,
        bgGradient: t.bgGradient,
        telegramMessage,
        mascotType: mascot,
        actionLabel,
        websiteUrl,
      });
      count++;
    }
  }
  return list;
}

// Function to interleave/mix categories so they are dynamically distributed on the homepage
function interleaveCategoryBanners(lists: BannerItem[][]): BannerItem[] {
  const mixed: BannerItem[] = [];
  const maxLen = Math.max(...lists.map((l) => l.length));

  for (let i = 0; i < maxLen; i++) {
    for (const list of lists) {
      if (i < list.length) {
        mixed.push(list[i]);
      }
    }
  }
  return mixed;
}

// Generate banners across Developers, Dropshipping, Hookup Dating, Sugar Mummy, HYIP, Shopping, Forex, Football, Crypto Loans, PayPal, Casino, Aviator, Lottery, Gaming, Virtual Phone (Mixed dynamically across the home page)
export const ALL_SPONSORED_BANNERS: BannerItem[] = interleaveCategoryBanners([
  generateBannersForCategory('developers', DEVELOPERS_TEMPLATES),
  generateBannersForCategory('dropshipping', DROPSHIPPING_TEMPLATES),
  generateBannersForCategory('hookup-dating', HOOKUP_TEMPLATES),
  generateBannersForCategory('sugar-mummy', SUGAR_MUMMY_TEMPLATES),
  generateBannersForCategory('virtual-phone', VIRTUAL_PHONE_TEMPLATES),
  generateBannersForCategory('hyip', HYIP_TEMPLATES),
  generateBannersForCategory('shopping', SHOPPING_TEMPLATES),
  generateBannersForCategory('paypal', PAYPAL_TEMPLATES),
  generateBannersForCategory('football', FOOTBALL_TEMPLATES),
  generateBannersForCategory('crypto-loan', CRYPTO_LOAN_TEMPLATES),
  generateBannersForCategory('forex', FOREX_TEMPLATES),
  generateBannersForCategory('casino', CASINO_TEMPLATES),
  generateBannersForCategory('aviator', AVIATOR_TEMPLATES),
  generateBannersForCategory('lottery', LOTTERY_TEMPLATES),
  generateBannersForCategory('gaming', GAMING_TEMPLATES),
  generateBannersForCategory('email-verification', EMAIL_VERIFICATION_TEMPLATES),
  generateBannersForCategory('live-weather', LIVE_WEATHER_TEMPLATES),
]);

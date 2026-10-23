export interface LiveFeedItem {
  id: number;
  text: string;
  colorClass: string;
  category?: string;
}

export const LIVE_ADS_100_FEED: LiveFeedItem[] = [
  // 1-10: HYIP & High Yield Projects
  { id: 1, text: "🔥 HYIP 300% DAILY HOURLY PAYOUT LIVE NOW!", colorClass: "text-yellow-300", category: "hyip" },
  { id: 2, text: "⛏️ GOLDBOD PRO: $2,500 MONITORED DEPOSIT ACTIVE • 20% MAX ROI PAID HOURLY!", colorClass: "text-amber-400", category: "hyip" },
  { id: 3, text: "💎 AURA DIAMOND HOLDINGS: 15% DAILY CRYPTO ROI VAULT AUDITED & PAYING!", colorClass: "text-cyan-300", category: "hyip" },
  { id: 4, text: "⚡ CLOUDMINEX: 12% DAILY ENTERPRISE ASIC HASHRATE NODES PAYING INSTANT TRC20!", colorClass: "text-emerald-400", category: "hyip" },
  { id: 5, text: "🏆 PRIME GOLD RESOURCES: $3,000 AUDITED BULLION CONTRACTS • 20% 7-DAY YIELD!", colorClass: "text-yellow-400", category: "hyip" },
  { id: 6, text: "💰 HYIP MONITOR: $76,200 USDT TOTAL MONITORED FUNDS • 8.95 AVG SAFETY RATING!", colorClass: "text-green-300", category: "hyip" },
  { id: 7, text: "🛡️ 100% CAPITAL INSURANCE FUND: ZERO RISK DEPOSIT PROTECTION ON VERIFIED HYIPS!", colorClass: "text-sky-300", category: "hyip" },
  { id: 8, text: "⚡ BITCOIN HOURLY CASH: 1.25% PAID EVERY 60 MINUTES DIRECT TO YOUR WALLET!", colorClass: "text-amber-300", category: "hyip" },
  { id: 9, text: "💵 HYIP INSTANT WITHDRAWAL: $4,850 USDT BATCH #TX9841 PAID 14 SECONDS AGO!", colorClass: "text-emerald-300", category: "hyip" },
  { id: 10, text: "🚀 NEW HYIP LAUNCH: 5% TO 20% TOTAL PROFIT PLAN AUDITED FOR 2026!", colorClass: "text-yellow-300", category: "hyip" },

    // 21-30: Forex Trading & MT5 Bot Engine
  { id: 21, text: "🏆 99% WIN RATE FOREX BOT ACTIVE: 100% HANDS-FREE MT4/MT5 EA RUNNING!", colorClass: "text-yellow-300", category: "forex" },
  { id: 22, text: "🥇 99.4% GOLD SNIPER (XAUUSDm): ZERO DRAWDOWN HEDGING IN ADV KINGS BROKER!", colorClass: "text-amber-400", category: "forex" },
  { id: 23, text: "⚡ 99.5% BITCOIN SCALPER (BCHUSDm): HIGH FREQUENCY TRADING WITH 1:2000 LEVERAGE!", colorClass: "text-orange-400", category: "forex" },
  { id: 24, text: "📈 99.2% QUANTUM NEURAL EA (EURUSDm): REAL-TIME ORDER FLOW EXECUTION ACTIVE!", colorClass: "text-cyan-300", category: "forex" },
  { id: 25, text: "🪙 99.6% CRYPTO SNIPER (BTCUSDm): SWAP-FREE VIP BROKER TERMINAL TICKETING!", colorClass: "text-emerald-400", category: "forex" },
  { id: 26, text: "⚡ ADV KINGS ECN STP GATEWAY CONNECTED: LONDON LD4 LIQUIDITY 0.0 PIPS SPREAD!", colorClass: "text-sky-300", category: "forex" },
  { id: 27, text: "💵 FOREX CASHOUT: +$420.50 PROFIT RETURNED TO VIP PLAY BALANCE AUTOMATICALLY!", colorClass: "text-green-400", category: "forex" },
  { id: 28, text: "🤖 AI AUTO-PILOT TRADING BOT: 24/7 AUTOMATED EXECUTION WITH REAL TIME PnL!", colorClass: "text-yellow-400", category: "forex" },
  { id: 29, text: "📊 MT5 MULTI-TIMEFRAME RADAR: M1, M5, M15, M30, H1, H4 CANDLESTICK SIGNALS!", colorClass: "text-cyan-300", category: "forex" },
  { id: 30, text: "🎯 INSTANT BOT SIGNAL ALERT: BUY 0.05 LOT XAUUSDm TARGET HIT +54 PIPS!", colorClass: "text-emerald-300", category: "forex" },

  // 31-40: Casino Jackpots, Slots & Aviator
  { id: 31, text: "🎰 @CryptoWhale_77 WON $148,200 ON FALCONE VIP CASINO JACKPOT!", colorClass: "text-yellow-300", category: "casino" },
  { id: 32, text: "✈️ AVIATOR VIP SIGNAL BOT: 99.8% ACCURACY NEXT SIGNAL PREDICTED 14.80x!", colorClass: "text-cyan-300", category: "aviator" },
  { id: 33, text: "💥 MEGA CASINO CRASH: @Elena_Berlin CASHED OUT AT 48.60x ($24,300 PAYOUT)!", colorClass: "text-rose-400", category: "aviator" },
  { id: 34, text: "🍒 ROYAL 777 SLOTS: $250,000 PROGRESSIVE GRAND JACKPOT POOL INCREASING!", colorClass: "text-red-400", category: "casino" },
  { id: 35, text: "✈️ AVIATOR AUTO-CASHOUT ALGORITHM: 2-STAGE HEDGING SECURES 3.50x DAILY PROFITS!", colorClass: "text-sky-300", category: "aviator" },
  { id: 36, text: "🎲 FALCONE HIGH-ROLLER LOUNGE: 0% HOUSE EDGE PROMO HOUR ACTIVE NOW!", colorClass: "text-amber-400", category: "casino" },
  { id: 37, text: "🎟️ SCRATCH & WIN 50,000 USDT: INSTANT LUCKY TICKET CLAIM CODE UNLOCKED!", colorClass: "text-green-300", category: "lottery" },
  { id: 38, text: "🎰 CASINO TOURNAMENT: 1ST PLACE LEADERBOARD WINS BRAND NEW TESLA MODEL S!", colorClass: "text-yellow-400", category: "casino" },
  { id: 39, text: "✈️ AVIATOR RADAR DETECTED PINK MULTIPLIER STREAK: 100x+ COMING IN 3 ROUNDS!", colorClass: "text-fuchsia-400", category: "aviator" },
  { id: 40, text: "💎 VIP CASINO CASHBACK: 25% WEEKLY LOSS RECOVERY CREDITED EVERY MONDAY!", colorClass: "text-purple-300", category: "casino" },

  // 41-50: PayPal Reload & Free Shopping Cards
  { id: 41, text: "💳 PAYPAL MONEY RELOAD: 60s INSTANT TOP-UP 0% HOLD TO ANY PAYPAL ACCOUNT!", colorClass: "text-sky-300", category: "paypal" },
  { id: 42, text: "🛍️ $500 FREE SHOPPING VIRTUAL CARDS & STORE VOUCHERS CLAIMABLE NOW!", colorClass: "text-pink-300", category: "shopping" },
  { id: 43, text: "📦 AMAZON $250 SHOPPING SPREE CARD: 100% BALANCE LOADED INSTANT CODE!", colorClass: "text-amber-300", category: "shopping" },
  { id: 44, text: "💳 PAYPAL INSTANT CASHOUT: $1,200 TRANSFERRED TO @Marcus_K WITH ZERO FEES!", colorClass: "text-sky-400", category: "paypal" },
  { id: 45, text: "🎁 APPLE STORE & ITUNES $100 GIFT CARDS: NO REGISTRATION REQUIRED ON TG!", colorClass: "text-zinc-100", category: "gift-card" },
  { id: 46, text: "🎮 STEAM $100 WALLET CODE & PSN VOUCHERS READY FOR INSTANT DOWNLOAD!", colorClass: "text-purple-300", category: "gift-card" },
  { id: 47, text: "💳 VISA & MASTERCARD PRE-LOADED VIRTUAL CARDS FOR WORLDWIDE ONLINE STORES!", colorClass: "text-emerald-400", category: "shopping" },
  { id: 48, text: "🛍️ NIKE & SEPHORA $300 DISCOUNTS: EXCLUSIVE ADKINGS VIP REDEMPTION CODES!", colorClass: "text-pink-400", category: "shopping" },
  { id: 49, text: "💳 PAYPAL BUSINESS TOP-UP: INSTANT FUNDS LOAD WITHOUT 21-DAY CLEARING DELAY!", colorClass: "text-blue-300", category: "paypal" },
  { id: 50, text: "🎁 GOOGLE PLAY & ROBLOX GIFT CARDS: CLAIM 10,000 ROBUX CODE ON TELEGRAM!", colorClass: "text-green-300", category: "gift-card" },

  // 11-20: Full Stack Web Developers Available
  { id: 11, text: "💻 FULL STACK WEB DEVELOPERS AVAILABLE: HIRE TOP 1% SENIOR CODERS IN 24H!", colorClass: "text-cyan-400", category: "developers" },
  { id: 12, text: "⚛️ REACT 19 & NEXT.js 15 SENIOR SPECIALISTS READY FOR IMMEDIATE MVP DEPLOYMENT!", colorClass: "text-sky-300", category: "developers" },
  { id: 13, text: "🟩 NODE.js & NESTJS BACKEND ARCHITECTS: HIGH CONCURRENCY APIs FROM $38/HR!", colorClass: "text-emerald-400", category: "developers" },
  { id: 14, text: "🐍 PYTHON, FASTAPI & GEMINI AI AGENT DEVELOPERS AVAILABLE FOR WORKFLOW BOTS!", colorClass: "text-yellow-300", category: "developers" },
  { id: 15, text: "📱 REACT NATIVE & EXPO MOBILE EXPERTS: SHIP iOS & ANDROID APPS IN 2 WEEKS!", colorClass: "text-pink-300", category: "developers" },
  { id: 16, text: "⛓️ WEB3 & SOLIDITY SMART CONTRACT AUDITORS READY • ZERO RECRUITMENT FEES!", colorClass: "text-purple-300", category: "developers" },
  { id: 17, text: "🛡️ 100% CODE OWNERSHIP & STRICT NDA SIGNED ON DAY ONE FOR ALL CLIENTS!", colorClass: "text-green-300", category: "developers" },
  { id: 18, text: "👨‍💻 ALEX R. (SENIOR FULL-STACK LEAD) JUST ENGAGED FOR SAAS DASHBOARD ON TG!", colorClass: "text-cyan-300", category: "developers" },
  { id: 19, text: "🚀 TURNKEY MVP SQUAD: PROTOTYPE TO PRODUCTION LAUNCH IN UNDER 14 DAYS!", colorClass: "text-yellow-400", category: "developers" },
  { id: 20, text: "🤝 RISK-FREE 14-DAY DEVELOPER TRIAL PERIOD: TALK TO TECH LEAD ON TELEGRAM!", colorClass: "text-emerald-300", category: "developers" },



  // 51-60: Virtual Phone Numbers & Free Mobile Data
  { id: 51, text: "📱 FREE VIRTUAL NUMBERS (500+ LIVE OTPs): GOOGLE, OPENAI, AWS, STRIPE & WHATSAPP INSTANT SMS!", colorClass: "text-emerald-400", category: "virtual-phone" },
  { id: 52, text: "📶 500GB FREE INTERNET MOBILE DATA: LIFETIME UNLIMITED NO EXPIRY ACTIVE!", colorClass: "text-cyan-300", category: "internet" },
  { id: 53, text: "💬 WHATSAPP & TELEGRAM OTP NUMBERS: INSTANT ONLINE SMS RECEIVE 0% FAIL!", colorClass: "text-green-400", category: "virtual-phone" },
  { id: 54, text: "🇬🇭 MTN MOMO, TELECEL CASH & AT MONEY AUTOMATED MOBILE GATEWAY INTEGRATED!", colorClass: "text-yellow-300", category: "payment" },
  { id: 55, text: "🤖 OPENAI, ANTHROPIC & AWS ROOT VERIFICATION: 500+ HIGH-CONCURRENCY LIVE SMS!", colorClass: "text-teal-300", category: "virtual-phone" },
  { id: 56, text: "🌐 5G ULTRA BROADBAND eSIM: UNLIMITED ROAMING DATA IN 140+ COUNTRIES FREE!", colorClass: "text-sky-300", category: "internet" },
  { id: 57, text: "📞 PRIVATE DISCREET BURNER LINES: ANONYMOUS CALL FORWARDING WITH ZERO LOGS!", colorClass: "text-zinc-200", category: "virtual-phone" },
  { id: 58, text: "⚡ UNLIMITED YOUTUBE & NETFLIX STREAMING DATA PACK: ZERO DATA CONSUMPTION!", colorClass: "text-red-400", category: "internet" },
  { id: 59, text: "📱 TEMPORARY SMS NUMBER: 500+ TECH & SOCIAL VERIFICATION CODES STREAMING LIVE!", colorClass: "text-emerald-300", category: "virtual-phone" },
  { id: 60, text: "🌍 AIRTEL & VODAFONE 100GB BOOST: INSTANT RECHARGE CODE VIA TELEGRAM BOT!", colorClass: "text-yellow-400", category: "internet" },

  // 61-70: Football Betting VVIP & Virtue Games
  { id: 61, text: "⚽ FOOTBALL VVIP CORRECT SCORE: 98.4% WIN RATE FIXED MATCHES READY TODAY!", colorClass: "text-emerald-400", category: "football" },
  { id: 62, text: "🎮 VIRTUE GAMES VIP: VIRTUAL PREMIER LEAGUE, CAR RACING & GREYHOUND LIVE!", colorClass: "text-yellow-300", category: "virtual-games" },
  { id: 63, text: "🎯 CHAMPIONS LEAGUE 32.50 ODDS VIP COMBO SLIP AVAILABLE ON TELEGRAM!", colorClass: "text-cyan-300", category: "football" },
  { id: 64, text: "🐎 VIRTUE HORSE DERBY: 3-MINUTE SPRINT RACES WITH REAL PLAY BALANCE CASHOUT!", colorClass: "text-amber-400", category: "virtual-games" },
  { id: 65, text: "⚽ PREMIER LEAGUE STANDINGS UPDATED: MANCHESTER CITY & ARSENAL TITLE RACE!", colorClass: "text-sky-300", category: "football" },
  { id: 66, text: "🥅 VIRTUE PENALTY SHOOTOUT: GOALKEEPER MULTIPLIERS UP TO 100x CASH WIN!", colorClass: "text-green-300", category: "virtual-games" },
  { id: 67, text: "⚽ HALFTIME/FULLTIME DOUBLE CHANCE TIPS: 100% AUDITED MATCH PREDICTIONS!", colorClass: "text-yellow-400", category: "football" },
  { id: 68, text: "🏎️ VIRTUE SPEED CAR RACE: MONACO GRAND PRIX VIRTUAL CIRCUIT LIVE ODDS!", colorClass: "text-red-400", category: "virtual-games" },
  { id: 69, text: "🏆 VVIP BETTING SLIP WON: @LondonBettor CASHED OUT $9,400 ON 4-FOLD ACCA!", colorClass: "text-emerald-300", category: "football" },
  { id: 70, text: "🐕 VIRTUE GREYHOUND TRACK: TRICAST & FORECAST BETTING WITH INSTANT WINNERS!", colorClass: "text-purple-300", category: "virtual-games" },

  // 71-80: Crypto Loans & Dropshipping Turnkey Stores
  { id: 71, text: "🏦 INSTANT CRYPTO LOANS: 0% KYC COLLATERALIZED BORROWING IN USDT & BITCOIN!", colorClass: "text-yellow-300", category: "crypto-loan" },
  { id: 72, text: "📦 TURNKEY E-COMMERCE DROPSHIPPING: LAUNCH A $10K/MO AUTOMATED STORE IN 48H!", colorClass: "text-pink-300", category: "dropshipping" },
  { id: 73, text: "💎 CRYPTO LOAN APPROVED: $25,000 USDT DISBURSED IN 90 SECONDS VIA SMART CONTRACT!", colorClass: "text-emerald-400", category: "crypto-loan" },
  { id: 74, text: "🚀 50 WINNING TIKTOK DROPSHIP PRODUCTS IDENTIFIED WITH PRE-TESTED AD CREATIVES!", colorClass: "text-cyan-300", category: "dropshipping" },
  { id: 75, text: "💰 BORROW UP TO $100,000 AGAINST YOUR CRYPTO WITHOUT SELLING YOUR ASSETS!", colorClass: "text-amber-400", category: "crypto-loan" },
  { id: 76, text: "📦 ZERO INVENTORY SHOPIFY STORES: 100% AUTOMATED SUPPLIER FULFILLMENT!", colorClass: "text-green-300", category: "dropshipping" },
  { id: 77, text: "🏦 FLEXIBLE CRYPTO REPAYMENT TERMS: 30 TO 365 DAYS WITH ZERO CREDIT CHECKS!", colorClass: "text-sky-300", category: "crypto-loan" },
  { id: 78, text: "📈 AUTOMATED VIRAL TIKTOK ADS BLUEPRINT GENERATING 4.8x ROAS FOR DROPSHIPPERS!", colorClass: "text-fuchsia-400", category: "dropshipping" },
  { id: 79, text: "⚡ FLASH CRYPTO CREDIT LINE: DRAW FUNDS 24/7 DIRECTLY TO YOUR TRC20/ERC20 WALLET!", colorClass: "text-yellow-400", category: "crypto-loan" },
  { id: 80, text: "📦 FULL TURNKEY SETUP: BRANDED STORE, PAYMENT GATEWAY & SUPPLIERS INCLUDED!", colorClass: "text-pink-300", category: "dropshipping" },

  // 81-90: Social Media Boost & Sugar Mummy Matchmaking
  { id: 81, text: "🚀 SOCIAL MEDIA BOOST: +10,000 REAL FOLLOWERS & LIKES DELIVERED PER HOUR!", colorClass: "text-fuchsia-400", category: "social" },
  { id: 82, text: "👑 SUGAR MUMMY & SUGAR DADDY VIP MATCHMAKING (AGES 37-78) COMPANIONSHIP!", colorClass: "text-rose-400", category: "sugar-mummy" },
  { id: 83, text: "📸 INSTAGRAM VIRAL ALGORITHM ACCELERATOR: EXPLORE PAGE PLACEMENT GUARANTEED!", colorClass: "text-pink-400", category: "social" },
  { id: 84, text: "💍 WEALTHY SPONSORS LOOKING FOR RESPECTFUL PARTNERS • DAILY ALLOWANCES PAID!", colorClass: "text-amber-300", category: "sugar-mummy" },
  { id: 85, text: "🎵 TIKTOK FYP BOOSTER: SKYROCKET TO 1,000,000+ REAL VIDEO VIEWS IN 24 HOURS!", colorClass: "text-cyan-300", category: "social" },
  { id: 86, text: "🥂 DISCREET TONIGHT HOOKUPS (<5KM): VERIFIED PHOTO PROFILES IN YOUR CITY!", colorClass: "text-rose-300", category: "hookup" },
  { id: 87, text: "✈️ TELEGRAM CHANNEL BOOST: REAL CRYPTO & FOREX MEMBERS WITH 100% RETENTION!", colorClass: "text-sky-300", category: "social" },
  { id: 88, text: "💋 100% PRIVATE & CONFIDENTIAL VIP DATING CONCIERGE ON TELEGRAM!", colorClass: "text-pink-300", category: "sugar-mummy" },
  { id: 89, text: "▶️ YOUTUBE 4,000 WATCH HOURS & 1,000 SUBSCRIBERS: INSTANT MONETIZATION PACKAGE!", colorClass: "text-red-400", category: "social" },
  { id: 90, text: "🔥 CASUAL ENCOUNTERS: 284 SINGLES CURRENTLY ACTIVE & CHATTING NEAR YOU!", colorClass: "text-yellow-300", category: "hookup" },

  // 91-100: Network Ads, Telegram Support & Security
  { id: 91, text: "⚡ AD BANNER SLOTS AVAILABLE: CONTACT @adkingsSupport ON TELEGRAM ⚡", colorClass: "text-yellow-400", category: "ads" },
  { id: 92, text: "💰 NO KYC • NO REGISTRATION • DIRECT TELEGRAM INSTANT AUTOMATION 💰", colorClass: "text-zinc-100", category: "security" },
  { id: 93, text: "🌐 48,290+ AD CLICKS RECORDED TODAY ACROSS MEGASPIN ADVERTISING NETWORK!", colorClass: "text-emerald-400", category: "ads" },
  { id: 94, text: "💼 HIGH CTR AD SPOTS FOR RENT: LEADERBOARDS (728x90) & BILLBOARDS (970x250)!", colorClass: "text-cyan-300", category: "ads" },
  { id: 95, text: "🛡️ ENTERPRISE END-TO-END 256-BIT ENCRYPTED TELEGRAM AUTOMATION SYSTEM!", colorClass: "text-sky-300", category: "security" },
  { id: 96, text: "🪙 ACCEPTED PAYMENTS: BITCOIN, USDT TRC20, TON, ETH, PAYPAL & MOMO CASH!", colorClass: "text-yellow-300", category: "payment" },
  { id: 97, text: "👑 VIP PLATINUM CLUB: ACCESS UNRELEASED SIGNALS & PRIVATE ARBITRAGE BOTS!", colorClass: "text-amber-400", category: "vip" },
  { id: 98, text: "⚡ INSTANT 24/7 CUSTOMER CONCIERGE: MESSAGE @adkingsSupport ON TELEGRAM NOW!", colorClass: "text-green-300", category: "support" },
  { id: 99, text: "✉️ INSTANT EMAIL VERIFIER: RFC 5322 MX LOOKUP & SMTP 250 HANDSHAKE LIVE!", colorClass: "text-emerald-400", category: "email-verification" },
  { id: 100, text: "🛡️ FREE DISPOSABLE TEMP INBOX: RECEIVE NETFLIX, BINANCE & TIKTOK CODES FAST!", colorClass: "text-teal-300", category: "email-verification" },
  { id: 101, text: "☀️ GLOBAL LIVE WEATHER RADAR: REAL-TIME COUNTRY ATMOSPHERIC CONDITIONS & RAIN FORECASTS!", colorClass: "text-cyan-300", category: "live-weather" },
  { id: 102, text: "⚡ ZERO DEPOSIT TRANSACTION FEES ACROSS ALL PROMOTIONAL OFFERS THIS WEEK!", colorClass: "text-cyan-400", category: "security" },
  { id: 103, text: "⛈️ 24/7 SEVERE WEATHER ALERTS & RAIN RADAR: SUBSCRIBE VIA TELEGRAM BOT NOW!", colorClass: "text-sky-400", category: "live-weather" },
  { id: 104, text: "🚀 ADKINGS ADS NETWORK 2026: THE WORLD'S #1 HIGH-CTR TRAFFIC HUB FOR CRYPTO & WEB!", colorClass: "text-yellow-300", category: "ads" },
];

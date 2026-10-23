import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Flame, 
  Trophy, 
  DollarSign, 
  Zap, 
  CheckCircle2, 
  ExternalLink,
  Crown,
  ShieldCheck,
  Radio,
  Minimize2,
  Maximize2,
  TrendingUp,
  Ticket,
  Wallet,
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { AuthUser } from '../types';

export interface ChatMessage {
  id: string;
  username: string;
  avatar: string;
  badge: 'VIP' | 'WHALE' | 'PRO' | 'LUCKY' | 'HYIP MASTER' | 'MOD' | 'FX SNIPER' | 'VVIP TIPSTER' | 'CRYPTO BORROWER' | 'PAYPAL USER' | 'FREE SHOPPER';
  badgeColor: string;
  category: 'hyip' | 'forex' | 'football' | 'crypto-loan' | 'paypal' | 'shopping' | 'casino' | 'aviator' | 'lottery' | 'gaming';
  projectOrGame: string;
  projectUrl?: string;
  amountWon: string;
  text: string;
  timeAgo: string;
  likes: number;
  isCustom?: boolean;
}

// Rich pool of realistic win claims across HYIPs, Shopping, Forex, Football, Crypto Loans, PayPal Reloads, Casino, Aviator, Lottery, Cyber Gaming
const INITIAL_WIN_CLAIMS: Omit<ChatMessage, 'id' | 'timeAgo' | 'likes'>[] = [
  {
    username: 'ShopFree_Elena',
    avatar: '🛍️',
    badge: 'FREE SHOPPER',
    badgeColor: 'bg-pink-400 text-black',
    category: 'shopping',
    projectOrGame: '$500 Shopping Virtual Card Promo',
    amountWon: '+$500.00 Store Voucher',
    text: 'Redeemed the $500 virtual shopping promo voucher and checked out on Amazon with free express shipping! Clean 100% discount! 🎁🛍️',
  },
  {
    username: 'PayPalRecharged_Dan',
    avatar: '💳',
    badge: 'PAYPAL USER',
    badgeColor: 'bg-sky-400 text-black',
    category: 'paypal',
    projectOrGame: 'Instant PayPal Money Reload',
    amountWon: '+$2,500.00 PayPal Added',
    text: 'Sent USDT TRC20 and got $2,500 USD credited directly to my PayPal balance in 45 seconds! Zero hold, ready for instant spending! 🚀💳',
  },
  {
    username: 'BettingKing_Lekan',
    avatar: '⚽',
    badge: 'VVIP TIPSTER',
    badgeColor: 'bg-green-500 text-black',
    category: 'football',
    projectOrGame: 'VVIP 100% Correct Score Slip',
    amountWon: '+$14,500.00 USDT (@145.00 Odds)',
    text: 'BOOOOOOOM! Real Madrid 3-1 + Arsenal 2-0 exact scores LANDED cleanly! Staked $100 and banked $14,500 USDT on Telegram slip! 🔥⚽',
  },
  {
    username: 'SatoshiLender_Dave',
    avatar: '🏦',
    badge: 'CRYPTO BORROWER',
    badgeColor: 'bg-cyan-400 text-black',
    category: 'crypto-loan',
    projectOrGame: 'Instant 95% LTV Crypto Loan',
    amountWon: '+$45,000.00 USDT Disbursed',
    text: 'Locked 0.75 BTC collateral at 0% APR promo and received $45k USDT direct to my TRC20 wallet in 90 seconds! Kept my Bitcoin upside 🚀',
  },
  {
    username: 'ForexSniper_Kwame',
    avatar: '📈',
    badge: 'FX SNIPER',
    badgeColor: 'bg-emerald-500 text-black',
    category: 'forex',
    projectOrGame: 'Gold (XAU/USD) 100 Pips Bot',
    amountWon: '+$4,820.00 (125 Pips)',
    text: 'Hit the London breakout long on Gold! 1:2000 leverage made +$4.8K in 35 minutes flat! Auto MT5 EA is insane 🔥',
  },
  {
    username: 'CryptoKing_99',
    avatar: '👑',
    badge: 'WHALE',
    badgeColor: 'bg-amber-500 text-black',
    category: 'hyip',
    projectOrGame: 'Aura Diamond VIP Reserve',
    projectUrl: 'https://aura-diamond-holdings.vercel.app',
    amountWon: '+$3,450.00 USDT',
    text: 'Just received my 15% daily payout direct to TRC20 wallet from Aura Diamond! Instant in under 12 seconds 🚀💎',
  },
  {
    username: 'PropTrader_Alex',
    avatar: '🏆',
    badge: 'PRO',
    badgeColor: 'bg-yellow-400 text-black',
    category: 'forex',
    projectOrGame: '$100,000 Funded Prop Account',
    amountWon: '+$8,950.00 (90% Split)',
    text: 'Passed the 1-step challenge and received my first bi-weekly $8,950 profit split direct in USDT! Legit firm!',
  },
  {
    username: 'VegasLuckyGirl',
    avatar: '🎰',
    badge: 'LUCKY',
    badgeColor: 'bg-pink-600 text-white',
    category: 'casino',
    projectOrGame: '888 Mega Casino (Sweet Bonanza)',
    amountWon: '+$14,280.00 USDT',
    text: 'OMG!! Hit 100x bomb multiplier on Sweet Bonanza with my 250 free spins!! Already withdrawn to TON wallet! 🎉🎉',
  },
  {
    username: 'HashMiner_Ghana',
    avatar: '⛏️',
    badge: 'HYIP MASTER',
    badgeColor: 'bg-yellow-500 text-black',
    category: 'hyip',
    projectOrGame: 'GoldBod Pro Mining',
    projectUrl: 'https://gold-bod-pro.vercel.app',
    amountWon: '+$890.00 USDT',
    text: 'GoldBod Pro daily ASIC node returns just landed! 4th consecutive day cashing out smoothly. Legit project!',
  },
  {
    username: 'Pilot_Alex92',
    avatar: '✈️',
    badge: 'PRO',
    badgeColor: 'bg-cyan-500 text-black',
    category: 'aviator',
    projectOrGame: 'Aviator AI Signal Bot',
    amountWon: '+$4,120.00 USDT',
    text: 'Followed the 18.5x prediction radar on Telegram... cashed out at 17.8x right before the plane crashed at 18.9x! INSANE accuracy! 🔥',
  },
  {
    username: 'Nana_Kwame',
    avatar: '🍀',
    badge: 'VIP',
    badgeColor: 'bg-emerald-500 text-black',
    category: 'lottery',
    projectOrGame: '$50,000 Golden Scratch 777',
    amountWon: '+$2,500.00 (MTN MoMo)',
    text: 'Claimed the free daily scratch ticket and hit triple 7s! Cashout received via Mobile Money in 2 mins. God is good 🙏',
  },
  {
    username: 'CyberGhost_CS',
    avatar: '🎮',
    badge: 'PRO',
    badgeColor: 'bg-purple-500 text-white',
    category: 'gaming',
    projectOrGame: 'Cyber Esports Skin Crate',
    amountWon: '+$1,850.00 (AWP Dragon Lore)',
    text: 'Unboxed Mythic Factory New AWP Dragon Lore on 1st crate attempt!! Instant P2P crypto buyout settled!',
  },
  {
    username: 'AccraInvestor_T',
    avatar: '💎',
    badge: 'WHALE',
    badgeColor: 'bg-amber-400 text-black',
    category: 'hyip',
    projectOrGame: 'CloudMine-X Enterprise',
    projectUrl: 'https://cloud-mine-x.vercel.app',
    amountWon: '+$1,200.00 USDT',
    text: 'CloudMine-X month 2 yield withdrawal approved instantly. 35% compound is real, compounding another $500 today.',
  },
  {
    username: 'RouletteWhale',
    avatar: '🎲',
    badge: 'VIP',
    badgeColor: 'bg-red-500 text-white',
    category: 'casino',
    projectOrGame: 'Live High Roller Suite',
    amountWon: '+$8,500.00 USDT',
    text: 'Stuck on Red 32 three times in a row! Dealer was shocked lol. Instant blockchain settlement.',
  },
  {
    username: 'GoldBullion_Kofi',
    avatar: '🥇',
    badge: 'HYIP MASTER',
    badgeColor: 'bg-yellow-400 text-black',
    category: 'hyip',
    projectOrGame: 'Prime Gold Resources',
    projectUrl: 'https://prime-gold-resources.vercel.app',
    amountWon: '+$675.00 USDT',
    text: 'Prime Gold weekly dividend paid on schedule. Physical bullion backing makes me sleep like a baby 😴💰',
  },
  {
    username: 'SpacemanSniper',
    avatar: '🚀',
    badge: 'PRO',
    badgeColor: 'bg-blue-500 text-white',
    category: 'aviator',
    projectOrGame: 'Spaceman 500x Radar',
    amountWon: '+$5,600.00 USDT',
    text: 'Caught the 45x multiplier wave using dual-cashout hedge strategy! Best signal bot on TG period.',
  },
  {
    username: 'LottoQueen_777',
    avatar: '🎟️',
    badge: 'LUCKY',
    badgeColor: 'bg-rose-500 text-white',
    category: 'lottery',
    projectOrGame: 'Triple 777 Lucky Wheel',
    amountWon: '+$1,000.00 USDT',
    text: 'Spun the wheel after sharing to 3 friends and hit the $1,000 jackpot slice! 100% win rate is crazy 🤩',
  },
  {
    username: 'DogeMaster_TG',
    avatar: '🐕',
    badge: 'VIP',
    badgeColor: 'bg-amber-500 text-black',
    category: 'hyip',
    projectOrGame: 'Bitcoin 300% Daily Hourly',
    amountWon: '+$2,100.00 DOGE',
    text: 'Hourly automated TG bot already sent 12 installments today. ROI reached in 8 hours! 🚀🔥',
  },
  {
    username: 'EsportsPVP_Dan',
    avatar: '⚔️',
    badge: 'PRO',
    badgeColor: 'bg-indigo-500 text-white',
    category: 'gaming',
    projectOrGame: 'Metaverse Cyber Arena',
    amountWon: '+$420.00 USDT',
    text: 'Won 6 straight 1v1 PvP skill duels in the cyber arena! Liquid tokens swapped directly on DEX.',
  },
];

const RANDOM_USERS = [
  { name: 'SatoshiSam', avatar: '🪙', badge: 'WHALE', badgeColor: 'bg-yellow-400 text-black' },
  { name: 'Elena_Vegas', avatar: '💃', badge: 'LUCKY', badgeColor: 'bg-pink-500 text-white' },
  { name: 'Kwabena_Yields', avatar: '🇬🇭', badge: 'HYIP MASTER', badgeColor: 'bg-emerald-400 text-black' },
  { name: 'JetPilot_Marcus', avatar: '🛩️', badge: 'PRO', badgeColor: 'bg-cyan-400 text-black' },
  { name: 'SpinDoctor_Max', avatar: '🎰', badge: 'VIP', badgeColor: 'bg-purple-500 text-white' },
  { name: 'GoldenAura_VIP', avatar: '💎', badge: 'WHALE', badgeColor: 'bg-amber-300 text-black' },
  { name: 'LottoKing_Zero', avatar: '🎟️', badge: 'LUCKY', badgeColor: 'bg-rose-400 text-black' },
  { name: 'CyberBlade_99', avatar: '🗡️', badge: 'PRO', badgeColor: 'bg-blue-400 text-black' },
  { name: 'MomoRich_Boss', avatar: '📱', badge: 'VIP', badgeColor: 'bg-yellow-500 text-black' },
];

const RANDOM_NEW_CLAIMS = [
  {
    category: 'hyip' as const,
    projectOrGame: 'Aura Diamond VIP Reserve',
    projectUrl: 'https://aura-diamond-holdings.vercel.app',
    amountWon: '+$2,150.00 USDT',
    texts: [
      'Another daily 15% dividend withdrawal hit my wallet! Fast automated blockchain processing 👌',
      'Aura Diamond never misses! Compounding $500 more for tomorrow.',
      'Deposit $1000 -> instant $150 daily yield received! Best HYIP on the monitor right now.',
    ],
  },
  {
    category: 'hyip' as const,
    projectOrGame: 'GoldBod Pro Mining',
    projectUrl: 'https://gold-bod-pro.vercel.app',
    amountWon: '+$1,450.00 USDT',
    texts: [
      'GoldBod Pro hash payouts just credited! No hardware fees, pure daily profit.',
      'Withdrew 10% first deposit bonus + daily ROI in 1 minute! ⛏️🔥',
      'Solid mining node returns from GoldBod Pro. Highly recommend to everyone in the chat!',
    ],
  },
  {
    category: 'hyip' as const,
    projectOrGame: 'CloudMine-X Enterprise',
    projectUrl: 'https://cloud-mine-x.vercel.app',
    amountWon: '+$920.00 USDT',
    texts: [
      'CloudMine-X MTN MoMo instant cashout completed in under 45 seconds! 🇬🇭💰',
      'Enterprise tier cloud hash unlocked! Daily return jumped to $85/day.',
    ],
  },
  {
    category: 'hyip' as const,
    projectOrGame: 'Prime Gold Resources',
    projectUrl: 'https://prime-gold-resources.vercel.app',
    amountWon: '+$1,800.00 USDT',
    texts: [
      'Prime Gold bullion contract paid out $1,800 weekly dividend! True stability.',
      'Gold backed smart bot made me 20% this week. Withdrawn without issues!',
    ],
  },
  {
    category: 'casino' as const,
    projectOrGame: '888 Mega Casino',
    amountWon: '+$6,800.00 USDT',
    texts: [
      'Just triggered the 50,000x jackpot on Mega Joker!! Heart is beating so fast ❤️🔥',
      'Claimed 500% welcome match and cashed out $6.8k on Pragmatic slots with no KYC!',
      'Live dealer blackjack run: 7 wins in a row! Cashout approved in 30 seconds.',
    ],
  },
  {
    category: 'aviator' as const,
    projectOrGame: 'Aviator AI Signal Bot',
    amountWon: '+$3,950.00 USDT',
    texts: [
      'Signal bot predicted 22.4x... Plane flew to 23.1x! Auto cashout worked like magic ✈️🤑',
      'Made $3.9k today purely following the Telegram push notifications!',
      '99% accuracy confirmed! 5 winning rounds out of 5 today on Aviator!',
    ],
  },
  {
    category: 'lottery' as const,
    projectOrGame: '$1,000,000 Crypto Lotto',
    amountWon: '+$5,000.00 USDT',
    texts: [
      'Matched 5 out of 6 lucky numbers on the hourly crypto lotto! $5k instant reward 🎟️🎉',
      'Triple 777 scratcher gave me $2,500! Deposited $10 and took home thousands!',
    ],
  },
  {
    category: 'gaming' as const,
    projectOrGame: 'CS2 & Dota Mythic Crates',
    amountWon: '+$2,200.00 (Karambit Fade)',
    texts: [
      'NO WAY!! Unboxed Karambit Doppler Phase 2 on Cyber Esports loot boxes! 🗡️✨',
      '1v1 Cyber arena duel won! Took the $800 pot in 20 seconds flat!',
    ],
  },
  {
    category: 'forex' as const,
    projectOrGame: 'Gold (XAU/USD) 100 Pips Bot',
    amountWon: '+$3,600.00 (95 Pips)',
    texts: [
      'Gold scalper bot nailed the NY market open breakout! +95 pips banked in 20 mins 📈⚡',
      'Copied the VIP Telegram forex signal on EUR/USD: 1:2000 leverage doubled my account today!',
      '$100k Prop Firm funded trader payout received directly to TON wallet! 90% profit split is legit 🏆',
    ],
  },
  {
    category: 'football' as const,
    projectOrGame: 'VVIP 100% Correct Score Slip',
    amountWon: '+$8,750.00 USDT',
    texts: [
      'The 2-match exact correct score ticket HIT at 175.00 odds! Unbelievable VIP insider accuracy! ⚽🔥',
      'Won the 10-game weekend accumulator! $50 stake returned $6,200 USDT direct to wallet!',
      'HT/FT Turnaround 1/2 landed! 30.00 odds fixed slip on Telegram is pure gold 🏆',
    ],
  },
  {
    category: 'crypto-loan' as const,
    projectOrGame: 'Instant 95% LTV Crypto Loan',
    amountWon: '+$28,500.00 USDT Borrowed',
    texts: [
      'Instant 95% LTV loan approved in 2 mins with 0% APR promo! Collateral safely locked in Fireblocks custody 🏦',
      'Took a $15k crypto loan against my ETH to buy mining nodes—funds arrived in 60 seconds!',
      'Withdrew crypto loan directly to MTN MoMo cashout without selling any Bitcoin! Super smooth 💳',
    ],
  },
];

interface LiveCommunityChatProps {
  soundEnabled: boolean;
  onOpenTelegram: (msg: string) => void;
  incrementClicks: () => void;
  currentUser?: AuthUser | null;
  onOpenAuth?: () => void;
}

export const LiveCommunityChat: React.FC<LiveCommunityChatProps> = ({
  soundEnabled,
  onOpenTelegram,
  incrementClicks,
  currentUser,
  onOpenAuth,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return INITIAL_WIN_CLAIMS.map((c, i) => ({
      ...c,
      id: `msg-init-${i}`,
      timeAgo: `${(i + 1) * 2}m ago`,
      likes: Math.floor(12 + Math.random() * 45),
    }));
  });

  const [inputMessage, setInputMessage] = useState('');
  const [inputCategory, setInputCategory] = useState<'hyip' | 'forex' | 'football' | 'crypto-loan' | 'casino' | 'aviator' | 'lottery' | 'gaming'>('hyip');
  const [inputAmount, setInputAmount] = useState('+$1,250.00 USDT');
  const [inputProject, setInputProject] = useState('Aura Diamond VIP Reserve');
  const [activeFilter, setActiveFilter] = useState<'all' | 'hyip' | 'forex' | 'football' | 'crypto-loan' | 'casino' | 'aviator' | 'lottery' | 'gaming'>('all');
  const [isExpanded, setIsExpanded] = useState(true);
  const [onlineCount, setOnlineCount] = useState(2841);
  const [pinnedAlert, setPinnedAlert] = useState<string>('⚡ Big Payout Alert: @CryptoKing_99 just withdrew $3,450 from Aura Diamond VIP Reserve!');

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-generate realistic fake user win claims every 8 to 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomUser = RANDOM_USERS[Math.floor(Math.random() * RANDOM_USERS.length)];
      const randomClaim = RANDOM_NEW_CLAIMS[Math.floor(Math.random() * RANDOM_NEW_CLAIMS.length)];
      const randomText = randomClaim.texts[Math.floor(Math.random() * randomClaim.texts.length)];

      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random()}`,
        username: randomUser.name,
        avatar: randomUser.avatar,
        badge: randomUser.badge as any,
        badgeColor: randomUser.badgeColor,
        category: randomClaim.category,
        projectOrGame: randomClaim.projectOrGame,
        projectUrl: randomClaim.projectUrl,
        amountWon: randomClaim.amountWon,
        text: randomText,
        timeAgo: 'Just now',
        likes: Math.floor(1 + Math.random() * 8),
      };

      setMessages((prev) => [newMessage, ...prev.slice(0, 49)]);
      setPinnedAlert(`⚡ LIVE WIN ALERT: @${randomUser.name} just claimed ${randomClaim.amountWon} on ${randomClaim.projectOrGame}!`);

      if (soundEnabled && Math.random() > 0.4) {
        soundManager.playCoin();
      }
    }, 9000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Online count fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineCount((prev) => prev + (Math.random() > 0.4 ? 2 : -1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    incrementClicks();
    if (soundEnabled) soundManager.playCoin();

    let projectUrl: string | undefined = undefined;
    if (inputProject.includes('Aura Diamond')) {
      projectUrl = 'https://aura-diamond-holdings.vercel.app';
    } else if (inputProject.includes('GoldBod')) {
      projectUrl = 'https://gold-bod-pro.vercel.app';
    } else if (inputProject.includes('CloudMine')) {
      projectUrl = 'https://cloud-mine-x.vercel.app';
    } else if (inputProject.includes('Prime Gold')) {
      projectUrl = 'https://prime-gold-resources.vercel.app';
    }

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      username: currentUser ? `@${currentUser.fullName || currentUser.email.split('@')[0]}` : 'You (VIP Guest)',
      avatar: currentUser?.avatar || '👑',
      badge: currentUser ? 'VIP' : 'VIP',
      badgeColor: 'bg-yellow-400 text-black',
      category: inputCategory,
      projectOrGame: inputProject,
      projectUrl,
      amountWon: inputAmount.startsWith('+') ? inputAmount : `+${inputAmount}`,
      text: inputMessage,
      timeAgo: 'Just now',
      likes: 1,
      isCustom: true,
    };

    setMessages((prev) => [userMsg, ...prev]);
    setInputMessage('');
  };

  const handleLike = (id: string) => {
    if (soundEnabled) soundManager.playSpinTick();
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m))
    );
  };

  const handleProjectClick = (msg: ChatMessage) => {
    incrementClicks();
    if (soundEnabled) soundManager.playCoin();
    if (msg.projectUrl) {
      window.open(msg.projectUrl, '_blank', 'noopener,noreferrer');
    } else {
      onOpenTelegram(`Hi, I saw @${msg.username}'s win claim on ${msg.projectOrGame} in the live chatroom! How can I get started?`);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (activeFilter === 'all') return true;
    return m.category === activeFilter;
  });

  return (
    <section 
      id="live-community-chatroom" 
      className="max-w-7xl mx-auto px-3 sm:px-6 my-8 scroll-mt-28"
    >
      <div className="bg-gradient-to-b from-[#111116] via-[#0d0d11] to-[#08080a] border-2 border-yellow-500/40 rounded-3xl shadow-[0_0_40px_rgba(234,179,8,0.2)] overflow-hidden">
        
        {/* Chatroom Header & Live Stream Bar */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-yellow-500/30 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-red-600 to-purple-800 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(234,179,8,0.5)] border border-yellow-300">
                💬
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-black"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  <span className="bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
                    LIVE WINNERS & CASHOUT CHATROOM
                  </span>
                  <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 inline" /> LIVE
                  </span>
                </h2>
              </div>
              <p className="text-[11px] text-zinc-400 font-bold flex items-center gap-2">
                <span className="text-green-400 font-black flex items-center gap-1">
                  ● {onlineCount.toLocaleString()} High Rollers Chatting
                </span>
                <span>•</span>
                <span className="text-yellow-400 font-bold">
                  Verified Real-Time Payout Claims
                </span>
              </p>
            </div>
          </div>

          {/* Filter Tabs by Category */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: '🔥 All Wins', icon: Sparkles },
              { id: 'shopping', label: '🛍️ Free Shopping', icon: ShoppingBag },
              { id: 'football', label: '⚽ Football VVIP', icon: Ticket },
              { id: 'crypto-loan', label: '🏦 Crypto Loans', icon: Wallet },
              { id: 'paypal', label: '💳 PayPal Topups', icon: CreditCard },
              { id: 'hyip', label: '⚡ HYIP Cashouts', icon: Zap },
              { id: 'forex', label: '📈 Forex Signals', icon: TrendingUp },
              { id: 'casino', label: '🎰 Casino Jackpots', icon: Trophy },
              { id: 'aviator', label: '✈️ Aviator Signals', icon: Flame },
              { id: 'lottery', label: '🎟️ Lotto 777', icon: Crown },
              { id: 'gaming', label: '🎮 Cyber Esports', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveFilter(tab.id as any);
                    if (soundEnabled) soundManager.playSpinTick();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-tight transition-all border flex items-center gap-1 ${
                    activeFilter === tab.id
                      ? 'bg-yellow-400 text-black border-yellow-200 shadow-[0_0_12px_rgba(234,179,8,0.5)]'
                      : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 bg-zinc-900 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 ml-1"
              title={isExpanded ? 'Minimize Chat' : 'Expand Chat'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Pinned Real-Time Breaking Win Marquee */}
        <div className="bg-yellow-950/40 border-b border-yellow-500/20 px-3 py-1.5 flex items-center gap-2 overflow-hidden">
          <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 animate-bounce">
            BREAKING WIN
          </span>
          <div className="text-xs font-bold text-yellow-300 truncate">
            {pinnedAlert}
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Live Message Feed Stream */}
            <div 
              ref={chatContainerRef}
              className="p-3 sm:p-5 space-y-3 max-h-[460px] overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-500/30 scrollbar-track-zinc-900/50 bg-[#0a0a0d]"
            >
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-2xl border transition-all hover:border-yellow-400/50 ${
                    msg.isCustom
                      ? 'bg-gradient-to-r from-yellow-950/30 via-zinc-900 to-zinc-900 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                      : 'bg-zinc-900/70 border-zinc-800/80 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    {/* User Header */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl leading-none">{msg.avatar}</span>
                      <span className="text-xs sm:text-sm font-black text-white">
                        {msg.username}
                      </span>
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${msg.badgeColor} uppercase tracking-wider`}>
                        {msg.badge}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono font-semibold">
                        {msg.timeAgo}
                      </span>
                    </div>

                    {/* Win Amount Badge */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2.5 py-0.5 bg-gradient-to-r from-emerald-500 to-green-600 text-black font-black text-[11px] sm:text-xs rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)] flex items-center gap-0.5">
                        <DollarSign className="w-3 h-3 inline font-black" />
                        {msg.amountWon}
                      </span>
                    </div>
                  </div>

                  {/* Project / Game Tag Bar */}
                  <div className="mb-2 flex items-center gap-2 flex-wrap text-[11px]">
                    <span className="text-zinc-400 font-medium">Claimed on:</span>
                    <button
                      onClick={() => handleProjectClick(msg)}
                      className="px-2 py-0.5 bg-zinc-800 hover:bg-yellow-500 hover:text-black text-yellow-300 font-black rounded-md border border-yellow-500/30 flex items-center gap-1 transition-all"
                      title="View Project / Claim on Telegram"
                    >
                      <span>{msg.projectOrGame}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Instant Proof Verified
                    </span>
                  </div>

                  {/* Message Body */}
                  <p className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed mb-2">
                    {msg.text}
                  </p>

                  {/* Footer Interaction */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/60">
                    <button
                      onClick={() => handleLike(msg.id)}
                      className="flex items-center gap-1 hover:text-yellow-400 font-bold transition-colors"
                    >
                      <span>🔥 GG / Respect ({msg.likes})</span>
                    </button>

                    <button
                      onClick={() => handleProjectClick(msg)}
                      className="text-xs text-yellow-400 hover:text-yellow-300 font-black flex items-center gap-1 underline underline-offset-2"
                    >
                      <span>{msg.projectUrl ? 'Visit Official Project' : 'Play / Claim Win'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Post Your Win Claim Box */}
            <div className="bg-zinc-950 border-t-2 border-yellow-500/30 p-3 sm:p-4">
              <form onSubmit={handleSendMessage} className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-zinc-300">
                  <div className="flex items-center gap-1.5 text-yellow-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CLAIM YOUR WIN / CASHOUT IN CHAT:</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Select Category */}
                    <select
                      value={inputCategory}
                      onChange={(e) => {
                        const cat = e.target.value as any;
                        setInputCategory(cat);
                        if (cat === 'hyip') setInputProject('Aura Diamond VIP Reserve');
                        if (cat === 'football') setInputProject('VVIP 100% Correct Score Slip');
                        if (cat === 'crypto-loan') setInputProject('Instant 95% LTV Crypto Loan');
                        if (cat === 'forex') setInputProject('Gold (XAU/USD) 100 Pips Bot');
                        if (cat === 'casino') setInputProject('888 Mega Casino');
                        if (cat === 'aviator') setInputProject('Aviator AI Signal Bot');
                        if (cat === 'lottery') setInputProject('$50,000 Golden Scratch');
                        if (cat === 'gaming') setInputProject('Cyber Esports Skins');
                      }}
                      className="bg-zinc-900 border border-zinc-700 text-yellow-300 text-xs rounded-lg px-2 py-1 font-bold focus:outline-none focus:border-yellow-400"
                    >
                      <option value="hyip">⚡ HYIP Cashout</option>
                      <option value="football">⚽ Football VVIP Slip</option>
                      <option value="crypto-loan">🏦 Crypto Loan</option>
                      <option value="forex">📈 Forex Signals</option>
                      <option value="casino">🎰 Casino Jackpot</option>
                      <option value="aviator">✈️ Aviator Win</option>
                      <option value="lottery">🎟️ Lotto 777</option>
                      <option value="gaming">🎮 Cyber Gaming</option>
                    </select>

                    {/* Select or Input Project Name */}
                    <select
                      value={inputProject}
                      onChange={(e) => setInputProject(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 text-white text-xs rounded-lg px-2 py-1 font-bold focus:outline-none focus:border-yellow-400"
                    >
                      {inputCategory === 'hyip' && (
                        <>
                          <option value="Aura Diamond VIP Reserve">Aura Diamond VIP Reserve (15% Daily)</option>
                          <option value="GoldBod Pro Mining">GoldBod Pro ASIC Nodes</option>
                          <option value="CloudMine-X Enterprise">CloudMine-X Enterprise</option>
                          <option value="Prime Gold Resources">Prime Gold Resources</option>
                          <option value="Bitcoin 300% Daily">Bitcoin 300% Daily Hourly</option>
                        </>
                      )}
                      {inputCategory === 'football' && (
                        <>
                          <option value="VVIP 100% Correct Score Slip">VVIP 100% Correct Score (250+ Odds)</option>
                          <option value="Daily 50+ Banker Accumulator">Daily 50+ Banker Accumulator Slip</option>
                          <option value="HT/FT Turnaround 30.00 Odds">HT/FT Turnaround 30.00 Odds Fixed</option>
                          <option value="Champions League VVIP Pass">Champions League VVIP Ticket</option>
                          <option value="AI Neural Football Bot 98%">AI Neural Football Predictor Slip</option>
                        </>
                      )}
                      {inputCategory === 'crypto-loan' && (
                        <>
                          <option value="Instant 95% LTV Crypto Loan">Instant 95% LTV Crypto Loan (0% APR)</option>
                          <option value="Bitcoin Collateral Credit Line">Bitcoin Collateral Credit Line</option>
                          <option value="No KYC Smart Contract Loan">No KYC Flash Liquidity Loan</option>
                          <option value="Mobile Money & Bank Cashout Loan">Crypto Loan to Mobile Money / Bank</option>
                          <option value="Whale $1M+ Private Loan Desk">Whale $1M+ Private Loan Desk</option>
                        </>
                      )}
                      {inputCategory === 'forex' && (
                        <>
                          <option value="Gold (XAU/USD) 100 Pips Bot">Gold (XAU/USD) 100 Pips Daily Scalper</option>
                          <option value="$100,000 Funded Prop Account">$100,000 Funded Prop Trader Account</option>
                          <option value="EUR/USD Zero Spread ECN Broker">EUR/USD 0.0 Pip ECN Broker</option>
                          <option value="AI Neural EA for MT5">AI Neural Trading EA Bot</option>
                          <option value="VIP Telegram Forex Signals">VIP Forex Telegram Signals (94.6%)</option>
                        </>
                      )}
                      {inputCategory === 'casino' && (
                        <>
                          <option value="888 Mega Casino">888 Mega Casino (500% Match)</option>
                          <option value="Vegas Rush Crypto Slots">Vegas Rush $100K Slots</option>
                          <option value="Ape VIP High Roller Lounge">Ape VIP High Roller Lounge</option>
                          <option value="Live Roulette 24/7">Live Roulette 24/7</option>
                        </>
                      )}
                      {inputCategory === 'aviator' && (
                        <>
                          <option value="Aviator AI Signal Bot">Aviator AI Signal Bot (99.8%)</option>
                          <option value="100x JetX Radar Bot">100x JetX Radar Bot</option>
                          <option value="Spaceman 500x Scanner">Spaceman 500x Scanner</option>
                        </>
                      )}
                      {inputCategory === 'lottery' && (
                        <>
                          <option value="$50,000 Golden Scratch">$50,000 Golden Scratch (1 in 3 Wins)</option>
                          <option value="$1,000,000 Crypto Lotto">$1,000,000 Crypto Lotto</option>
                          <option value="Triple 777 Lucky Wheel">Triple 777 Lucky Wheel</option>
                        </>
                      )}
                      {inputCategory === 'gaming' && (
                        <>
                          <option value="Cyber Esports Skins">Cyber Esports Skins & Cases</option>
                          <option value="Metaverse Cyber Arena">Metaverse Cyber Arena P2E</option>
                          <option value="1v1 High-Stakes Duels">1v1 High-Stakes Skill Duels</option>
                        </>
                      )}
                    </select>

                    {/* Win Amount Input */}
                    <input
                      type="text"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      placeholder="+$1,250.00 USDT"
                      className="w-28 bg-zinc-900 border border-zinc-700 text-green-400 font-mono font-bold text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-green-400"
                    />
                  </div>
                </div>

                {/* Message Input Bar */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Share your cashout proof, jackpot win, or congrats to players..."
                    className="flex-1 bg-zinc-900 border-2 border-zinc-700 focus:border-yellow-400 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none placeholder-zinc-500 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black text-xs sm:text-sm rounded-xl border border-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.5)] flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 text-black fill-black" />
                    <span>POST WIN</span>
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

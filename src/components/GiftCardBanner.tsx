import React, { useState, useMemo, useEffect } from 'react';
import { 
  Gift, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  Clock, 
  Flame, 
  QrCode, 
  CreditCard, 
  Globe, 
  Gamepad2, 
  Tv, 
  ShoppingBag, 
  Zap, 
  Activity,
  Infinity,
  Tag,
  Star,
  CheckCheck,
  Coins,
  AlertTriangle,
  ArrowRight,
  Sliders,
  DollarSign
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface GiftCardBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

export type GiftCardBrandId = 
  | 'amazon' 
  | 'apple' 
  | 'googleplay' 
  | 'steam' 
  | 'playstation' 
  | 'xbox' 
  | 'netflix' 
  | 'razer' 
  | 'roblox' 
  | 'sephora' 
  | 'ebay' 
  | 'nike'
  | 'walmart'
  | 'visa_gift';

interface GiftCardBrand {
  id: GiftCardBrandId;
  name: string;
  category: 'shopping' | 'gaming' | 'entertainment' | 'prepaid';
  iconEmoji: string;
  badge: string;
  accentColor: string;
  bgGradient: string;
  borderColor: string;
  codePrefix: string;
  tagline: string;
  region: string;
}

type CryptoAsset = 'USDT' | 'ETH' | 'BTC';

interface CryptoDepositInfo {
  asset: CryptoAsset;
  name: string;
  network: string;
  address: string;
  icon: string;
  notes: string;
}

const CRYPTO_DEPOSIT_ADDRESSES: Record<CryptoAsset, CryptoDepositInfo> = {
  USDT: {
    asset: 'USDT',
    name: 'Tether USD',
    network: 'TRC20 (Tron Network)',
    address: 'TMmpdCUFH9xJ5efivRdyAw8MBVGqdsJmpX',
    icon: '⚡',
    notes: 'Send USDT via TRC20 network for ultra-low network gas fee and ~60s automated ledger confirmation.',
  },
  ETH: {
    asset: 'ETH',
    name: 'Ethereum',
    network: 'ERC20 / Arbitrum / Optimism',
    address: '0x450306b9721d2cc03a70f3c6aa9b7a61b0137b44',
    icon: '💎',
    notes: 'Deposits via smart contracts are not supported with the exception of ETH via ERC20, Arbitrum & Optimism network or BNB via BSC network.',
  },
  BTC: {
    asset: 'BTC',
    name: 'Bitcoin',
    network: 'BTC Native Network',
    address: '15512yaegwoVpZ2mjnsZ8mmVdhMnbcYybZ',
    icon: '🪙',
    notes: 'Binance supports deposits from all BTC addresses (starting with "1", "3", "bc1p" and "bc1q")',
  },
};

export const ALL_GIFT_CARDS: GiftCardBrand[] = [
  {
    id: 'amazon',
    name: 'Amazon Gift Card',
    category: 'shopping',
    iconEmoji: '📦',
    badge: 'TOP SHOPPING',
    accentColor: '#f59e0b',
    bgGradient: 'from-[#232f3e] via-[#131921] to-[#0b0e14]',
    borderColor: 'border-amber-400',
    codePrefix: 'AMZN-99X2',
    tagline: 'Millions of items on Amazon with instant zero-fee balance top-up',
    region: 'Global / US / UK / EU',
  },
  {
    id: 'apple',
    name: 'Apple & iTunes Gift Card',
    category: 'entertainment',
    iconEmoji: '🍎',
    badge: 'APPLE APP STORE',
    accentColor: '#38bdf8',
    bgGradient: 'from-[#1e293b] via-[#0f172a] to-[#020617]',
    borderColor: 'border-sky-400',
    codePrefix: 'APPL-77K8',
    tagline: 'App Store, Apple Music, iCloud+, Apple Arcade & hardware purchases',
    region: 'Worldwide',
  },
  {
    id: 'googleplay',
    name: 'Google Play Gift Card',
    category: 'entertainment',
    iconEmoji: '▶️',
    badge: 'ANDROID & APPS',
    accentColor: '#10b981',
    bgGradient: 'from-[#064e3b] via-[#022c22] to-[#01140f]',
    borderColor: 'border-emerald-400',
    codePrefix: 'GPLY-44R1',
    tagline: 'In-app diamonds, games, movies, books, and Google One storage',
    region: 'All Regions',
  },
  {
    id: 'steam',
    name: 'Steam Wallet Card',
    category: 'gaming',
    iconEmoji: '🕹️',
    badge: 'PC GAMING',
    accentColor: '#6366f1',
    bgGradient: 'from-[#171a21] via-[#1b2838] to-[#0e141b]',
    borderColor: 'border-indigo-400',
    codePrefix: 'STMD-88V3',
    tagline: 'Instant Steam balance for thousands of PC games, DLCs and skins',
    region: 'Global Currency',
  },
  {
    id: 'playstation',
    name: 'PlayStation PSN Card',
    category: 'gaming',
    iconEmoji: '🎮',
    badge: 'PS5 & PS4',
    accentColor: '#3b82f6',
    bgGradient: 'from-[#003791] via-[#001c4a] to-[#000d24]',
    borderColor: 'border-blue-400',
    codePrefix: 'PSNX-55J9',
    tagline: 'PS Plus Essential/Extra, PS Store digital games, and DLC add-ons',
    region: 'US / UK / EU / Asia',
  },
  {
    id: 'xbox',
    name: 'Xbox & Game Pass Card',
    category: 'gaming',
    iconEmoji: '🟢',
    badge: 'XBOX LIVE',
    accentColor: '#22c55e',
    bgGradient: 'from-[#107c10] via-[#083e08] to-[#031903]',
    borderColor: 'border-green-400',
    codePrefix: 'XBOX-33Q6',
    tagline: 'Xbox Game Pass Ultimate, Microsoft Store downloads and consoles',
    region: 'Global',
  },
  {
    id: 'netflix',
    name: 'Netflix Streaming Card',
    category: 'entertainment',
    iconEmoji: '🍿',
    badge: '4K STREAMING',
    accentColor: '#ef4444',
    bgGradient: 'from-[#7f1d1d] via-[#450a0a] to-[#1c0404]',
    borderColor: 'border-red-500',
    codePrefix: 'NFLX-22B4',
    tagline: 'Watch movies, TV series, anime & documentaries with no credit card required',
    region: 'Worldwide',
  },
  {
    id: 'razer',
    name: 'Razer Gold PIN',
    category: 'gaming',
    iconEmoji: '🟡',
    badge: 'VIRTUAL CREDITS',
    accentColor: '#eab308',
    bgGradient: 'from-[#422006] via-[#1c1917] to-[#0a0a0a]',
    borderColor: 'border-yellow-400',
    codePrefix: 'RZRG-91P7',
    tagline: 'Virtual credits for over 42,000 games including PUBG, Free Fire & MLBB',
    region: 'Global PIN',
  },
  {
    id: 'roblox',
    name: 'Roblox Robux Gift Card',
    category: 'gaming',
    iconEmoji: '💎',
    badge: 'ROBUX & SKINS',
    accentColor: '#ec4899',
    bgGradient: 'from-[#831843] via-[#500724] to-[#1f020e]',
    borderColor: 'border-pink-400',
    codePrefix: 'RBLX-66M2',
    tagline: 'Redeem for Robux currency, VIP avatar items and exclusive virtual gear',
    region: 'Global',
  },
  {
    id: 'sephora',
    name: 'Sephora & Beauty Card',
    category: 'shopping',
    iconEmoji: '💄',
    badge: 'BEAUTY & LUXURY',
    accentColor: '#f43f5e',
    bgGradient: 'from-[#4c0519] via-[#26020c] to-[#0a0104]',
    borderColor: 'border-rose-400',
    codePrefix: 'SPHR-14T8',
    tagline: 'Luxury skincare, makeup, fragrances and cosmetics from top beauty brands',
    region: 'US / EU / Global',
  },
  {
    id: 'ebay',
    name: 'eBay Voucher Card',
    category: 'shopping',
    iconEmoji: '🛒',
    badge: 'GLOBAL STORE',
    accentColor: '#0ea5e9',
    bgGradient: 'from-[#082f49] via-[#031522] to-[#01080e]',
    borderColor: 'border-sky-400',
    codePrefix: 'EBAY-82C5',
    tagline: 'Electronics, fashion, collectibles, and global auctions with buyer protection',
    region: 'International',
  },
  {
    id: 'nike',
    name: 'Nike & Sneaker Card',
    category: 'shopping',
    iconEmoji: '👟',
    badge: 'SPORTSWEAR',
    accentColor: '#f97316',
    bgGradient: 'from-[#431407] via-[#1f0702] to-[#0c0201]',
    borderColor: 'border-orange-400',
    codePrefix: 'NIKE-51S9',
    tagline: 'Latest sneakers, Jordan releases, athletic gear and Nike App exclusive drops',
    region: 'Global Stores',
  },
  {
    id: 'walmart',
    name: 'Walmart eGift Card',
    category: 'shopping',
    iconEmoji: '🏪',
    badge: 'SUPERCENTER',
    accentColor: '#3b82f6',
    bgGradient: 'from-[#172554] via-[#09122c] to-[#030611]',
    borderColor: 'border-blue-400',
    codePrefix: 'WLMT-39D4',
    tagline: 'Groceries, electronics, household essentials and online delivery',
    region: 'US & Global',
  },
  {
    id: 'visa_gift',
    name: 'Visa Prepaid Gift Card',
    category: 'prepaid',
    iconEmoji: '💳',
    badge: 'UNIVERSAL PREPAID',
    accentColor: '#a855f7',
    bgGradient: 'from-[#3b0764] via-[#1e0334] to-[#0b0114]',
    borderColor: 'border-purple-400',
    codePrefix: 'VISA-94W1',
    tagline: 'Spend anywhere Visa is accepted worldwide, online or in physical stores',
    region: 'Worldwide 3DS',
  },
];

const CARD_AMOUNTS = [150, 250, 500, 1000, 2500];

interface LiveClaimFeed {
  id: string;
  user: string;
  brand: string;
  amount: string;
  time: string;
  emoji: string;
}

const INITIAL_GIFT_CLAIMS: LiveClaimFeed[] = [
  { id: '1', user: '@Sarah_Shop', brand: 'Amazon', amount: '$500', time: 'Just now', emoji: '📦' },
  { id: '2', user: '@Marcus_Gamer', brand: 'Steam Wallet', amount: '$150', time: '12s ago', emoji: '🕹️' },
  { id: '3', user: '@Chloe_Deals', brand: 'Apple & iTunes', amount: '$250', time: '34s ago', emoji: '🍎' },
  { id: '4', user: '@Kwame_Play', brand: 'Google Play', amount: '$150', time: '58s ago', emoji: '▶️' },
];

const USERS_FEED_POOL = [
  { user: '@Elena_Deals', brand: 'Amazon', emoji: '📦' },
  { user: '@Alex_PS5', brand: 'PlayStation', emoji: '🎮' },
  { user: '@Liam_Xbox', brand: 'Xbox', emoji: '🟢' },
  { user: '@Sophie_Vibe', brand: 'Netflix', emoji: '🍿' },
  { user: '@Kenji_Razer', brand: 'Razer Gold', emoji: '🟡' },
  { user: '@Tariq_Robux', brand: 'Roblox', emoji: '💎' },
  { user: '@Amina_Glam', brand: 'Sephora', emoji: '💄' },
  { user: '@David_Nike', brand: 'Nike', emoji: '👟' },
  { user: '@Carlos_Shop', brand: 'eBay', emoji: '🛒' },
  { user: '@Grace_Prepaid', brand: 'Visa Prepaid', emoji: '💳' },
];

export const GiftCardBanner: React.FC<GiftCardBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
}) => {
  const [selectedBrandId, setSelectedBrandId] = useState<GiftCardBrandId>('amazon');
  const [selectedAmount, setSelectedAmount] = useState<number>(150);
  const [customAmountInput, setCustomAmountInput] = useState<string>('150');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD ($)');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset>('USDT');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(2048);
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);
  const [liveClaims, setLiveClaims] = useState<LiveClaimFeed[]>(INITIAL_GIFT_CLAIMS);
  const [filterCategory, setFilterCategory] = useState<'all' | 'shopping' | 'gaming' | 'entertainment' | 'prepaid'>('all');

  const activeBrand = useMemo(() => {
    return ALL_GIFT_CARDS.find((b) => b.id === selectedBrandId) || ALL_GIFT_CARDS[0];
  }, [selectedBrandId]);

  const activeCrypto = useMemo(() => {
    return CRYPTO_DEPOSIT_ADDRESSES[selectedCrypto];
  }, [selectedCrypto]);

  // Zero Processing Fee (100% Direct Voucher Value)
  const processingFee = 0;

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  // Generate masked code based on brand and seed
  const cardCode = useMemo(() => {
    const randomSuffix = String((seed * 43) % 9000 + 1000);
    const middleBlock = String((seed * 17) % 9000 + 1000);
    return `${activeBrand.codePrefix}-${middleBlock}-${randomSuffix}`;
  }, [activeBrand, seed]);

  // Live claims stream generator
  useEffect(() => {
    const interval = setInterval(() => {
      const randomUser = USERS_FEED_POOL[Math.floor(Math.random() * USERS_FEED_POOL.length)];
      const randomAmount = CARD_AMOUNTS[Math.floor(Math.random() * CARD_AMOUNTS.length)];

      const newEntry: LiveClaimFeed = {
        id: String(Date.now()),
        user: randomUser.user,
        brand: randomUser.brand,
        amount: `$${randomAmount}`,
        time: 'Just now',
        emoji: randomUser.emoji,
      };

      setLiveClaims((prev) => {
        const updated = prev.slice(0, 3).map((item, idx) => ({
          ...item,
          time: idx === 0 ? '6s ago' : idx === 1 ? '19s ago' : '45s ago',
        }));
        return [newEntry, ...updated];
      });
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const handleCopyCode = () => {
    soundManager.playCoin();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    soundManager.playCoin();
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleShuffleCard = () => {
    soundManager.playSpinTick();
    setSeed((prev) => prev + Math.floor(Math.random() * 97) + 13);
  };

  const handleSelectAmount = (amt: number) => {
    const clamped = Math.max(150, amt);
    setSelectedAmount(clamped);
    setCustomAmountInput(String(clamped));
    soundManager.playCoin();
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmountInput(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      if (num >= 150) {
        setSelectedAmount(num);
      } else {
        setSelectedAmount(150);
      }
    }
  };

  const handleClaimGiftCard = () => {
    incrementClicks();
    soundManager.playWinFanfare();
    setIsRedeeming(true);

    const feeFormatted = formatUSD(processingFee);
    const voucherFormatted = formatUSD(selectedAmount);

    // Save order details to MongoDB Adkings database
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderType: 'gift_card',
          amount: selectedAmount,
          feeAmount: 0,
          feePercentage: 0,
          totalPayable: selectedAmount,
          currency: 'USD',
          paymentMethod: 'crypto',
          depositAsset: activeCrypto.asset,
          depositNetwork: activeCrypto.network,
          depositAddress: activeCrypto.address,
          targetDetails: {
            brandName: activeBrand.name,
            promoCode: cardCode,
            storeTarget: activeBrand.region,
          },
        }),
      }).catch((e) => console.warn('Order logging to Adkings error:', e));
    } catch (e) {
      // Non-blocking
    }

    setTimeout(() => {
      setIsRedeeming(false);
      const msg = 
        `🎁 OFFICIAL DIGITAL GIFT CARD APPLICATION:\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `• Card Brand: ${activeBrand.name} (${activeBrand.badge})\n` +
        `• Category: ${activeBrand.category.toUpperCase()}\n` +
        `• Voucher Face Value: ${voucherFormatted} ${selectedCurrency}\n` +
        `• Processing Fee: $0.00 (Zero Fee)\n` +
        `• Total Amount Payable: ${voucherFormatted}\n` +
        `• Digital Code Prefix: ${cardCode}\n` +
        `• Region / Validity: ${activeBrand.region} (Lifetime / No Expiration)\n` +
        `• Official Deposit Gateway: ${activeCrypto.asset} (${activeCrypto.network})\n` +
        `• Payment Address: ${activeCrypto.address}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Deposit of ${voucherFormatted} (${activeCrypto.asset}) sent. Please issue my official 16-digit voucher PIN code on Telegram!`;

      onOpenTelegram(msg);
    }, 400);
  };

  const filteredBrands = useMemo(() => {
    if (filterCategory === 'all') return ALL_GIFT_CARDS;
    return ALL_GIFT_CARDS.filter((b) => b.category === filterCategory);
  }, [filterCategory]);

  return (
    <section 
      id="all-gift-cards-banner"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#120722] via-[#0a0314] to-[#040108] border-2 border-fuchsia-400 p-4 sm:p-5 shadow-[0_0_40px_rgba(217,70,239,0.35)] transition-all duration-300"
    >
      {/* Background Radiance */}
      <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-fuchsia-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Top Banner Header & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-fuchsia-500/30 pb-3 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(217,70,239,0.7)] flex items-center gap-1.5 animate-pulse">
              <Gift className="w-3.5 h-3.5 inline text-yellow-300 fill-yellow-300" /> ALL OFFICIAL DIGITAL GIFT CARDS 🎁
            </span>
            <span className="bg-yellow-400 text-black font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded uppercase tracking-tight flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-black inline" /> 100% Instant Digital Code Delivery
            </span>
            <span className="text-[11px] text-fuchsia-300 font-bold hidden sm:inline flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" /> Zero Maintenance Fees • Global Valid
            </span>
          </div>
          <p className="text-[11px] text-zinc-300 font-medium pt-0.5 max-w-3xl leading-relaxed">
            Instant digital redemption codes & vouchers for all major brands: <strong className="text-white">Amazon, Apple iTunes, Google Play, Steam, PlayStation, Xbox, Netflix, Razer Gold, Roblox, Sephora, Nike & Visa</strong>. Min denomination: <strong className="text-yellow-300 font-bold">$150 USD</strong> with <strong className="text-emerald-400 font-bold">0% processing fee</strong> (Zero-Fee Digital Delivery).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 font-mono text-[11px] bg-black/70 border border-emerald-500/40 px-3 py-1 rounded-lg">
            <span className="text-yellow-300 font-bold">Min $150 USD</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 font-bold">0% Processing Fee</span>
          </div>
        </div>
      </div>

      {/* 4-Step Issuance Flow Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {[
          { step: '1', title: 'Choose Brand & Value', desc: 'Select voucher (Min $150)' },
          { step: '2', title: 'Pick Crypto Gateway', desc: 'USDT TRC20, ETH or BTC' },
          { step: '3', title: 'Zero Fee Transfer', desc: `Send $${selectedAmount} for $${selectedAmount} Code` },
          { step: '4', title: 'Instant Telegram PIN', desc: 'Redeem code directly at store' },
        ].map((item) => (
          <div key={item.step} className="bg-black/50 border border-fuchsia-500/20 rounded-xl p-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-mono font-black text-xs flex items-center justify-center shrink-0 shadow">
              {item.step}
            </span>
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
              <p className="text-[9px] text-zinc-400 font-mono truncate">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        <span className="text-[11px] font-bold text-zinc-400 mr-1 flex items-center gap-1">
          <Tag className="w-3 h-3 text-fuchsia-400" /> Filter:
        </span>
        {[
          { id: 'all', label: 'All Gift Cards (14)' },
          { id: 'shopping', label: '🛍️ Shopping & Retail' },
          { id: 'gaming', label: '🎮 Gaming & Steam' },
          { id: 'entertainment', label: '🍿 Entertainment & Apps' },
          { id: 'prepaid', label: '💳 Universal Prepaid' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setFilterCategory(cat.id as any);
              soundManager.playCoin();
            }}
            className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
              filterCategory === cat.id
                ? 'bg-fuchsia-600 text-white shadow-[0_0_10px_rgba(217,70,239,0.5)] font-black'
                : 'bg-black/50 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gift Card Grid Selector (Horizontal Carousel / Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-4">
        {filteredBrands.map((brand) => {
          const isSelected = selectedBrandId === brand.id;
          return (
            <button
              key={brand.id}
              onClick={() => {
                setSelectedBrandId(brand.id);
                soundManager.playCoin();
              }}
              className={`p-2 rounded-xl text-center border transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                isSelected
                  ? 'bg-gradient-to-b from-fuchsia-950/90 to-purple-950/90 border-fuchsia-400 text-white shadow-[0_0_14px_rgba(217,70,239,0.6)] scale-[1.04]'
                  : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-fuchsia-500/40 hover:text-zinc-200'
              }`}
            >
              <span className="text-xl sm:text-2xl filter drop-shadow">{brand.iconEmoji}</span>
              <div className="font-extrabold text-[11px] text-zinc-200 truncate w-full">{brand.name.split(' ')[0]}</div>
              <span className="text-[9px] font-mono font-bold text-fuchsia-300 bg-fuchsia-950/60 px-1 py-0.2 rounded border border-fuchsia-500/30 truncate max-w-full">
                {brand.badge.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Grid: Left 3D Digital Card Visualizer (5 cols) + Right Controls & Gateways (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left 5 Cols: Digital Holographic Gift Card Visualizer + Fee Breakdown */}
        <div className="lg:col-span-5 space-y-3">
          <div 
            className={`relative rounded-2xl bg-gradient-to-br ${activeBrand.bgGradient} border-2 ${activeBrand.borderColor} p-4 sm:p-5 text-white shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300`}
          >
            {/* Holographic Watermark & Radiance */}
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 blur-xl pointer-events-none" />
            <div className="absolute top-2.5 right-3 text-[9px] font-mono text-white/60 tracking-widest uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> {activeBrand.region}
            </div>

            {/* Top Brand Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
                {activeBrand.iconEmoji}
              </div>
              <div>
                <span className="text-[10px] font-mono text-fuchsia-300 uppercase tracking-wider block font-bold">OFFICIAL DIGITAL VOUCHER</span>
                <h3 className="text-base font-black text-white tracking-tight">{activeBrand.name}</h3>
              </div>
            </div>

            {/* Center Face Value Banner */}
            <div className="my-3 bg-black/60 border border-white/20 rounded-xl p-3 text-center">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">VOUCHER FACE VALUE</span>
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] flex items-center justify-center gap-1">
                <span className="text-yellow-300 font-sans">$</span>
                <span>{selectedAmount}</span>
                <span className="text-xs text-zinc-400 font-mono self-end mb-1">.00 USD</span>
              </div>
              <p className="text-[10px] text-zinc-300 font-medium mt-1 truncate">{activeBrand.tagline}</p>
            </div>

            {/* Redeem Code Box */}
            <div className="pt-1">
              <span className="text-[9px] text-white/60 font-mono uppercase tracking-wider block mb-1">DIGITAL REDEMPTION CODE:</span>
              <div className="bg-black/80 border border-white/30 rounded-xl p-2 flex items-center justify-between font-mono">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-black tracking-widest text-emerald-300">
                    {cardCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1 text-white/70 hover:text-white transition-colors"
                  title="Copy Gift Code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bottom Bar: Zero Expiry & Quick Shuffle */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-300">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Infinity className="w-3 h-3 text-emerald-400" /> NO EXPIRY DATE
              </span>
              <button
                type="button"
                onClick={handleShuffleCard}
                className="text-fuchsia-300 hover:text-white font-bold underline cursor-pointer"
              >
                Generate Next Serial
              </button>
            </div>
          </div>

          {/* Zero Processing Fee Invoice Breakdown */}
          <div className="bg-black/70 border border-fuchsia-500/30 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs border-b border-zinc-800 pb-1.5">
              <span className="font-bold text-zinc-300 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-yellow-400" /> Voucher Face Value:
              </span>
              <span className="font-mono font-black text-white text-sm">{formatUSD(selectedAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-zinc-800 pb-1.5">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Processing Fee:
              </span>
              <span className="font-mono font-black text-emerald-400 text-sm">$0.00 (Zero Fee)</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-0.5">
              <div>
                <span className="font-extrabold text-emerald-400 block text-xs">Total Deposit Required:</span>
                <span className="text-[10px] text-zinc-400 font-mono">1:1 Direct Value • Zero Extra Surcharge</span>
              </div>
              <span className="font-mono font-black text-emerald-400 text-base">{formatUSD(selectedAmount)}</span>
            </div>
          </div>

          {/* Live Recent Claim Ticker */}
          <div className="bg-black/60 border border-fuchsia-500/20 rounded-xl p-2.5 space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Live Gift Card Claims:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] font-mono">
              {liveClaims.map((claim) => (
                <div key={claim.id} className="flex items-center justify-between bg-zinc-950/80 px-2 py-1 rounded border border-fuchsia-500/10 text-zinc-300">
                  <div className="flex items-center gap-1 truncate">
                    <span>{claim.emoji}</span>
                    <span className="text-fuchsia-300 font-bold truncate">{claim.user}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-emerald-400 font-black">{claim.amount}</span>
                    <span className="text-zinc-500 text-[9px]">• {claim.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Custom Denominations, Crypto Gateways & 1-Click Telegram Concierge */}
        <div className="lg:col-span-7 bg-zinc-950/90 border border-fuchsia-500/30 rounded-2xl p-4 space-y-4 shadow-xl">
          
          {/* Section 1: Configure Denomination (Min $150 USD) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-fuchsia-500/20 pb-2">
              <span className="text-xs font-black text-fuchsia-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-yellow-400" />
                Configure Gift Card Value (Min: $150 USD)
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 100% Genuine Digital Code
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
              <span>Select Denomination Preset:</span>
              <span className="text-yellow-300 font-mono font-black text-sm">
                {formatUSD(selectedAmount)} <span className="text-zinc-400 text-[10px]">({selectedCurrency})</span>
              </span>
            </div>

            {/* Quick Preset Buttons (Min $150) */}
            <div className="grid grid-cols-5 gap-1.5">
              {[150, 250, 500, 1000, 2500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleSelectAmount(amt)}
                  className={`py-2 px-1 rounded-xl text-center font-mono font-black text-xs transition-all ${
                    selectedAmount === amt
                      ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white border-2 border-yellow-300 shadow-[0_0_12px_rgba(217,70,239,0.7)] scale-[1.03]'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700'
                  }`}
                >
                  ${amt.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Custom Amount Input & Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400 font-bold">Custom Amount:</span>
                <div className="relative flex-1">
                  <DollarSign className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-yellow-400" />
                  <input
                    type="text"
                    value={customAmountInput}
                    onChange={handleCustomAmountChange}
                    placeholder="150"
                    className="w-full bg-zinc-950 border border-fuchsia-500/40 rounded-lg pl-6 pr-2 py-1 text-xs font-mono font-black text-yellow-300 focus:outline-none focus:border-fuchsia-400"
                  />
                </div>
              </div>
              <input
                type="range"
                min="150"
                max="10000"
                step="50"
                value={selectedAmount}
                onChange={(e) => handleSelectAmount(Number(e.target.value))}
                className="w-full accent-fuchsia-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>Min: $150 USD</span>
                <span>Max: $10,000+ USD</span>
              </div>
            </div>
          </div>

          {/* Section 2: Official Crypto Payment Gateways */}
          <div className="space-y-2 pt-2 border-t border-fuchsia-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-yellow-300 uppercase tracking-wide flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-yellow-400" />
                Select Crypto Gateway (Payable: {formatUSD(selectedAmount)} - Zero Fee)
              </span>
              <span className="text-[10px] font-mono text-fuchsia-300 bg-fuchsia-950/80 px-2 py-0.5 rounded border border-fuchsia-500/30">
                Automated Ledger
              </span>
            </div>

            {/* Crypto Asset Switcher Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(CRYPTO_DEPOSIT_ADDRESSES) as CryptoAsset[]).map((cryptoKey) => {
                const info = CRYPTO_DEPOSIT_ADDRESSES[cryptoKey];
                const isSelected = selectedCrypto === cryptoKey;
                return (
                  <button
                    key={cryptoKey}
                    onClick={() => {
                      setSelectedCrypto(cryptoKey);
                      soundManager.playCoin();
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-fuchsia-950 to-purple-950 border-fuchsia-400 text-white shadow-[0_0_12px_rgba(217,70,239,0.5)]'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <span className="text-lg">{info.icon}</span>
                    <div className="overflow-hidden">
                      <div className="font-mono font-black text-xs text-white leading-tight">{info.asset}</div>
                      <div className="text-[9px] text-zinc-400 truncate">{info.network.split(' ')[0]}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Deposit Address Card */}
            <div className="bg-black/80 border border-fuchsia-500/40 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 font-bold flex items-center gap-1">
                  <span>{activeCrypto.icon}</span> {activeCrypto.name} ({activeCrypto.network}) Address:
                </span>
                <span className="text-emerald-400 font-mono font-bold text-[10px]">100% Verified Gateway</span>
              </div>

              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-2">
                <span className="font-mono font-black text-xs text-yellow-300 break-all select-all flex-1">
                  {activeCrypto.address}
                </span>
                <button
                  onClick={() => handleCopyText(activeCrypto.address, activeCrypto.asset)}
                  className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1 transition-all shrink-0 ${
                    copiedField === activeCrypto.asset
                      ? 'bg-emerald-500 text-black'
                      : 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white'
                  }`}
                >
                  {copiedField === activeCrypto.asset ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>

              {/* Specific Network Guidelines */}
              <div className="text-[10px] text-zinc-400 bg-zinc-950/60 p-2 rounded border border-zinc-800/80 leading-relaxed font-mono">
                <p className="text-zinc-300">{activeCrypto.notes}</p>
              </div>

              {/* Validator Reward Warning */}
              <div className="flex items-center gap-1.5 text-[10px] text-amber-300/90 font-medium pt-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Please note: Do not send validator rewards to the deposit address.</span>
              </div>
            </div>
          </div>

          {/* Section 3: Currency & Target Region Selector */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1 flex items-center justify-between">
              <span>Currency & Target Region:</span>
              <span className="text-[10px] text-zinc-400 font-mono">{activeBrand.region}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { code: 'USD ($)', label: 'United States' },
                { code: 'EUR (€)', label: 'European Union' },
                { code: 'GBP (£)', label: 'United Kingdom' },
                { code: 'GLOBAL (USDT)', label: 'Crypto / Global' },
              ].map((curr) => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => {
                    setSelectedCurrency(curr.code);
                    soundManager.playCoin();
                  }}
                  className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-all ${
                    selectedCurrency === curr.code
                      ? 'bg-fuchsia-950 border-fuchsia-400 text-white'
                      : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-mono">{curr.code}</div>
                  <div className="text-[9px] text-zinc-500 truncate">{curr.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Specifications */}
          <div className="bg-black/50 border border-fuchsia-500/20 rounded-xl p-3 space-y-2 text-xs">
            <div className="font-bold text-fuchsia-300 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> Digital Voucher Specifications:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300 font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> Instant PIN Delivery via Telegram
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Genuine Direct Merchant Code
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> Zero processing fee on all gift card codes
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> Lifetime validity (0 monthly deduction)
              </div>
            </div>
          </div>

          {/* Section 5: Primary Action CTA */}
          <button
            type="button"
            onClick={handleClaimGiftCard}
            disabled={isRedeeming}
            className="w-full py-3.5 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 hover:from-fuchsia-400 hover:to-amber-300 text-black font-black text-sm rounded-xl border-2 border-yellow-200 shadow-[0_0_25px_rgba(217,70,239,0.7)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] pulse-cta"
          >
            <Gift className="w-4 h-4 text-black fill-black" />
            <span>
              {isRedeeming
                ? 'GENERATING DIGITAL VOUCHER...'
                : `CLAIM $${selectedAmount} ${activeBrand.name.toUpperCase()} ON TELEGRAM (ZERO FEE)`}
            </span>
            <Send className="w-4 h-4 text-black" />
          </button>

          {/* Security Disclaimer */}
          <div className="text-[10px] text-zinc-400 flex items-start gap-1.5 bg-black/40 p-2 rounded-lg border border-fuchsia-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Official digital gift cards are redeemable on respective merchant portals. 24/7 Telegram concierge available for immediate balance assistance.
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};


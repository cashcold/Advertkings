import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Lock, 
  Percent, 
  ArrowRight, 
  Wallet,
  Clock,
  CheckCircle2,
  Send,
  RefreshCw,
  TrendingUp,
  FileText,
  Calendar,
  Building2,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CryptoLoanBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
  loanWebsiteUrl?: string;
}

type CryptoAsset = 'USDT' | 'BTC' | 'ETH';

const DEFAULT_RATES: Record<CryptoAsset, number> = {
  USDT: 1.00,
  BTC: 67399.67,
  ETH: 3473.01,
};

const DURATION_YEARS = [1, 2, 3, 5, 7, 10];
const QUICK_AMOUNTS = [1000, 5000, 15000, 30000, 50000];
const ANNUAL_INTEREST_RATE = 0.075; // 7.5% APR

export const CryptoLoanBanner: React.FC<CryptoLoanBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
  loanWebsiteUrl = 'https://crypto-fund-biz.vercel.app',
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset>('USDT');
  const [loanAmount, setLoanAmount] = useState<number>(15000);
  const [loanYears, setLoanYears] = useState<number>(3);
  const [rates, setRates] = useState<Record<CryptoAsset, number>>(DEFAULT_RATES);
  const [isUpdatingRates, setIsUpdatingRates] = useState<boolean>(false);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  // Formatting helpers
  const formatUSD = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatCrypto = (usdVal: number, asset: CryptoAsset) => {
    const rate = rates[asset] || 1;
    const cryptoAmount = usdVal / rate;
    if (asset === 'USDT') {
      return `${cryptoAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`;
    }
    return `${cryptoAmount.toFixed(4)} ${asset}`;
  };

  // Financial Loan Calculations
  const loanCalculations = useMemo(() => {
    const principal = Math.min(50000, Math.max(700, loanAmount));
    const totalMonths = loanYears * 12;
    const monthlyRate = ANNUAL_INTEREST_RATE / 12;

    // Monthly payment formula: P * (r * (1+r)^n) / ((1+r)^n - 1)
    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalRepayment = monthlyPayment * totalMonths;
    const totalInterest = totalRepayment - principal;
    const qualificationFee = principal * 0.20; // 20% refundable qualification fee

    return {
      principal,
      totalMonths,
      monthlyPayment,
      totalRepayment,
      totalInterest,
      qualificationFee,
    };
  }, [loanAmount, loanYears]);

  // Handle rates update animation
  const handleUpdateRates = () => {
    setIsUpdatingRates(true);
    soundManager.playCoin();
    setTimeout(() => {
      setRates({
        USDT: 1.00,
        BTC: 67399.67 + (Math.random() * 40 - 20),
        ETH: 3473.01 + (Math.random() * 8 - 4),
      });
      setIsUpdatingRates(false);
    }, 600);
  };

  // Primary Redirect to CryptoFundBiz portal
  const handleRedirectToCryptoFundBiz = (subpath: string = '') => {
    incrementClicks();
    soundManager.playWinFanfare();
    const targetUrl = subpath ? `${loanWebsiteUrl}${subpath}` : loanWebsiteUrl;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Secondary Telegram contact option
  const handleContactTelegram = () => {
    incrementClicks();
    soundManager.playCoin();
    onOpenTelegram(
      `🏦 CRYPTOFUNDBIZ INSTITUTIONAL LOAN INQUIRY:\n` +
      `• Requested Amount: ${formatUSD(loanCalculations.principal)} (${formatCrypto(loanCalculations.principal, selectedCrypto)})\n` +
      `• Term: ${loanYears} Years (${loanCalculations.totalMonths} Months)\n` +
      `• APR: 7.5% Estimated\n` +
      `• Monthly Payment: ${formatUSD(loanCalculations.monthlyPayment)}/mo\n` +
      `• 20% Refundable Qualification Fee: ${formatUSD(loanCalculations.qualificationFee)}\n` +
      `• Disbursement Asset: ${selectedCrypto}\n` +
      `Please assist with my commercial application on CryptoFundBiz Portal!`
    );
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061826] via-[#040f18] to-black border-2 border-cyan-500/80 p-4 sm:p-6 shadow-[0_0_40px_rgba(6,182,212,0.25)] glow-gold">
      
      {/* Top Live Rates & Brand Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-cyan-500/30 pb-3.5 mb-4">
        {/* Brand & Tagline */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.6)] flex items-center gap-1.5 animate-pulse">
              <Building2 className="w-3.5 h-3.5 inline" /> CryptoFundBiz
            </span>
            <span className="bg-yellow-400 text-black font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded uppercase tracking-tight">
              Institutional Crypto Loans
            </span>
            <span className="text-[11px] text-cyan-300 font-bold hidden sm:inline flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 inline" /> Fast Commercial Crypto Capital
            </span>
          </div>
          <p className="text-[11px] text-zinc-300 font-medium pt-1 max-w-2xl leading-relaxed">
            Empowering small businesses, entrepreneurs, and startups with instant liquidity in <strong className="text-white">USDT, BTC, or ETH</strong>. Flexible 1–10 year terms from <strong className="text-yellow-300">$700 to $50,000 USD</strong>.
          </p>
        </div>

        {/* Live Crypto Rates Ticker */}
        <div className="flex items-center gap-2 bg-black/60 border border-cyan-500/40 px-3 py-1.5 rounded-xl text-xs font-mono shrink-0 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-zinc-400 font-bold">USDT:</span>
              <span className="text-emerald-400 font-bold">${rates.USDT.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-zinc-400 font-bold">BTC:</span>
              <span className="text-amber-400 font-bold">${rates.BTC.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-zinc-400 font-bold">ETH:</span>
              <span className="text-cyan-400 font-bold">${rates.ETH.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          <button
            onClick={handleUpdateRates}
            title="Update Live Rates"
            className="flex items-center gap-1 text-[10px] text-cyan-300 hover:text-white bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isUpdatingRates ? 'animate-spin text-yellow-300' : ''}`} />
            <span>Update Rates</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Loan Configuration + Loan Calculation Summary + Approval Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Col: Loan Configuration & Real-time Calculation (6 cols) */}
        <div className="lg:col-span-6 bg-[#051c2c]/90 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 shadow-inner space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <span className="text-xs font-black text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Loan Configuration (Real-time Calculation)
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                1 {selectedCrypto} = ${rates[selectedCrypto].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Select Disbursement Crypto */}
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                Select Disbursement Crypto:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['USDT', 'BTC', 'ETH'] as const).map((crypto) => (
                  <button
                    key={crypto}
                    onClick={() => {
                      setSelectedCrypto(crypto);
                      soundManager.playSpinTick();
                    }}
                    className={`py-2 px-3 rounded-xl font-black text-xs transition-all flex flex-col items-center justify-center gap-0.5 ${
                      selectedCrypto === crypto
                        ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.7)] scale-[1.02]'
                        : 'bg-zinc-900/90 text-zinc-300 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <span className="text-sm font-extrabold">{crypto}</span>
                    <span className="text-[10px] font-mono opacity-90">
                      ${rates[crypto].toLocaleString('en-US', { minimumFractionDigits: crypto === 'USDT' ? 2 : 2, maximumFractionDigits: 2 })}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Amount (USD) */}
            <div className="bg-black/70 p-3.5 rounded-xl border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-zinc-300">Loan Amount (USD):</span>
                <span className="text-yellow-300 font-mono font-black text-sm">
                  {formatUSD(loanAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-cyan-300 font-mono">
                <span>≈ {formatCrypto(loanAmount, selectedCrypto)}</span>
                <span className="text-zinc-400 text-[10px]">Min: $700 • Max: $50,000</span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="700"
                max="50000"
                step="100"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />

              {/* Quick Select Buttons */}
              <div className="pt-1">
                <span className="text-[10px] text-zinc-400 font-bold block mb-1">Quick Select:</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {QUICK_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        setLoanAmount(amt);
                        soundManager.playSpinTick();
                      }}
                      className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                        loanAmount === amt
                          ? 'bg-cyan-400 text-black font-black shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      ${amt >= 1000 ? `${amt / 1000}k` : amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loan Duration (Years) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300 mb-1.5">
                <span>Loan Duration (Years):</span>
                <span className="text-cyan-300 font-mono font-bold">
                  {loanYears} {loanYears === 1 ? 'Year' : 'Years'} ({loanYears * 12} Months)
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {DURATION_YEARS.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => {
                      setLoanYears(yr);
                      soundManager.playSpinTick();
                    }}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      loanYears === yr
                        ? 'bg-yellow-400 text-black font-black shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {yr} yr
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 bg-black/40 p-2 rounded-lg border border-cyan-500/10">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Fast commercial capital with 20% refundable qualification fee released upon wallet confirmation.</span>
          </div>
        </div>

        {/* Right Col: Loan Calculation Summary & Direct Redirect (6 cols) */}
        <div className="lg:col-span-6 bg-gradient-to-b from-[#072438] via-zinc-950 to-black border-2 border-cyan-500/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl space-y-4">
          
          <div className="space-y-3">
            {/* Header & Estimated APR badge */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-black text-cyan-300 uppercase tracking-wide">
                  Loan Calculation Summary
                </span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 rounded text-[11px] font-mono font-black">
                7.5% Estimated APR
              </span>
            </div>

            {/* Approved Loan & Crypto Equivalent */}
            <div className="grid grid-cols-2 gap-2 bg-black/60 p-2.5 rounded-xl border border-cyan-500/20 text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block font-semibold">Approved Loan Amount:</span>
                <span className="text-white font-mono font-black text-sm">{formatUSD(loanCalculations.principal)}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block font-semibold">Loan Equivalent in Crypto:</span>
                <span className="text-cyan-300 font-mono font-black text-sm">{formatCrypto(loanCalculations.principal, selectedCrypto)}</span>
              </div>
            </div>

            {/* 20% Qualification Fee */}
            <div className="bg-yellow-950/40 border border-yellow-500/30 p-2.5 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-yellow-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" /> 20% Qualification Fee:
                </span>
                <span className="text-yellow-300 font-mono font-black">{formatUSD(loanCalculations.qualificationFee)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300">
                <span>Crypto Equivalent:</span>
                <span className="font-bold text-yellow-200">{formatCrypto(loanCalculations.qualificationFee, selectedCrypto)}</span>
              </div>
              <p className="text-[9.5px] text-zinc-400 italic pt-0.5">
                * refundable fee required after loan approval prior to releasing funds to your wallet.
              </p>
            </div>

            {/* Estimated Monthly Payment & Totals */}
            <div className="bg-gradient-to-r from-cyan-950 via-zinc-900 to-cyan-950 p-3 rounded-xl border border-cyan-400/40 text-center">
              <span className="text-[10px] text-zinc-400 block font-bold uppercase">Estimated Monthly Payment:</span>
              <div className="text-xl sm:text-2xl font-black font-mono text-cyan-300 tracking-tight glow-cyan">
                {formatUSD(loanCalculations.monthlyPayment)}/mo
              </div>
              <span className="text-[11px] text-yellow-300 font-mono font-bold block">
                ≈ {formatCrypto(loanCalculations.monthlyPayment, selectedCrypto)}/mo
              </span>

              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-cyan-500/20 text-[10px] sm:text-[11px]">
                <div>
                  <span className="text-zinc-400 block">Total Interest Payable:</span>
                  <span className="font-mono font-black text-zinc-200">{formatUSD(loanCalculations.totalInterest)}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Total Repayment Amount:</span>
                  <span className="font-mono font-black text-cyan-300">{formatUSD(loanCalculations.totalRepayment)}</span>
                </div>
              </div>
            </div>

            {/* View Full Amortization Schedule toggle */}
            <button
              onClick={() => setShowAmortization(!showAmortization)}
              className="w-full text-center text-xs text-cyan-400 hover:text-cyan-300 font-bold underline decoration-dotted transition-colors py-1 flex items-center justify-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{showAmortization ? 'Hide Amortization Schedule' : 'View Full Amortization Schedule'}</span>
            </button>
          </div>

          {/* Primary Action Button: Direct Redirect to https://crypto-fund-biz.vercel.app */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleRedirectToCryptoFundBiz()}
              className="w-full py-3 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-black text-sm rounded-xl border border-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.7)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] pulse-cta"
            >
              <span>Apply for {formatUSD(loanCalculations.principal)} Loan</span>
              <ExternalLink className="w-4 h-4 text-black" />
            </button>

            {/* Approval Process Checklist */}
            <div className="bg-black/50 p-2.5 rounded-xl border border-cyan-500/20 text-[10px] space-y-1">
              <span className="font-bold text-cyan-300 block mb-0.5">Approval Process Checklist:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-zinc-300 font-medium">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" /> 1. Submit Business & Wallet Details
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" /> 2. Admin Reviews & Sets Approved
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-yellow-400 shrink-0" /> 3. Pay 20% Refundable Fee
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> 4. Crypto Released to Wallet
                </span>
              </div>
            </div>

            {/* Secondary Option: Telegram Concierge */}
            <button
              onClick={handleContactTelegram}
              className="w-full py-1.5 bg-zinc-900/90 hover:bg-zinc-800 text-cyan-300 font-bold text-[10px] rounded-lg border border-cyan-500/30 flex items-center justify-center gap-1 transition-colors"
            >
              <Send className="w-3 h-3 text-cyan-400" />
              <span>Contact Loan Officer on Telegram</span>
            </button>
          </div>

        </div>

      </div>

      {/* Expandable Amortization Schedule Table */}
      {showAmortization && (
        <div className="mt-4 bg-black/90 border border-cyan-500/40 rounded-2xl p-4 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
            <h5 className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-yellow-400" />
              Amortization Schedule (Sample First 12 Months @ 7.5% APR)
            </h5>
            <button
              onClick={() => setShowAmortization(false)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto max-h-48 overflow-y-auto">
            <table className="w-full text-left text-[11px] font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-[10px]">
                  <th className="pb-1.5">Month</th>
                  <th className="pb-1.5">Payment</th>
                  <th className="pb-1.5">Principal</th>
                  <th className="pb-1.5">Interest (7.5%)</th>
                  <th className="pb-1.5">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {Array.from({ length: Math.min(12, loanCalculations.totalMonths) }).map((_, idx) => {
                  const month = idx + 1;
                  const monthlyRate = ANNUAL_INTEREST_RATE / 12;
                  let balance = loanCalculations.principal;
                  let principalPaid = 0;
                  let interestPaid = 0;

                  for (let m = 1; m <= month; m++) {
                    interestPaid = balance * monthlyRate;
                    principalPaid = loanCalculations.monthlyPayment - interestPaid;
                    balance = Math.max(0, balance - principalPaid);
                  }

                  return (
                    <tr key={month} className="hover:bg-cyan-950/20">
                      <td className="py-1 text-cyan-400 font-bold">Month {month}</td>
                      <td className="py-1 text-white">{formatUSD(loanCalculations.monthlyPayment)}</td>
                      <td className="py-1 text-emerald-400">{formatUSD(principalPaid)}</td>
                      <td className="py-1 text-yellow-400">{formatUSD(interestPaid)}</td>
                      <td className="py-1 font-bold text-zinc-300">{formatUSD(balance)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-right">
            <button
              onClick={() => handleRedirectToCryptoFundBiz()}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 underline font-bold"
            >
              View Full {loanCalculations.totalMonths}-Month Schedule on CryptoFundBiz Portal ↗
            </button>
          </div>
        </div>
      )}

      {/* Footer Navigation / Portal Badges */}
      <div className="mt-4 pt-3 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 text-[10px] text-zinc-400">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleRedirectToCryptoFundBiz()}
            className="hover:text-cyan-300 font-bold flex items-center gap-1 text-zinc-300"
          >
            <Building2 className="w-3 h-3 text-cyan-400" />
            <span>CryptoFundBiz Portal</span>
          </button>
          <span>•</span>
          <span>Commercial Crypto Loans ($700 - $50,000 USD)</span>
          <span>•</span>
          <span className="text-cyan-300 font-mono font-bold">Supported: USDT | BTC | ETH</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleRedirectToCryptoFundBiz()}
            className="hover:text-yellow-300 font-bold text-zinc-400 transition-colors"
          >
            20% Qualification Fee Policy
          </button>
          <span>•</span>
          <button
            onClick={() => handleRedirectToCryptoFundBiz()}
            className="text-cyan-400 hover:text-cyan-300 font-black flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            <span>Staff Admin Access</span>
          </button>
        </div>
      </div>

    </div>
  );
};

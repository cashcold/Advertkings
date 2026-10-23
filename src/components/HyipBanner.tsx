import React, { useState } from 'react';
import { Zap, TrendingUp, DollarSign, Clock, ShieldCheck, Send, ArrowRight, ExternalLink } from 'lucide-react';
import { MascotVisual } from './MascotVisuals';
import { soundManager } from '../utils/audio';

interface HyipBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

export const HyipBanner: React.FC<HyipBannerProps> = ({ onOpenTelegram, incrementClicks }) => {
  const [depositAmount, setDepositAmount] = useState<number>(500);

  const hourlyProfit = (depositAmount * 0.125).toFixed(2);
  const dailyProfit = (depositAmount * 3.0).toFixed(2);
  const weeklyProfit = (depositAmount * 21.0).toFixed(2);

  const handleInvest = () => {
    incrementClicks();
    soundManager.playCoin();
    // Directly redirect to the official HYIP project website
    window.open('https://gold-bod-pro.vercel.app', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#120e05] via-[#09090b] to-[#120505] border-2 border-yellow-500/80 p-4 sm:p-6 glow-gold shadow-2xl backdrop-blur-md">
      {/* Banner Header Tag */}
      <div className="flex items-center justify-between border-b border-yellow-500/30 pb-3 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-red-600 text-yellow-200 font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wider animate-blink-fast border border-yellow-300/70 flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            <Zap className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" /> HYIP HIGH YIELD VIP
          </span>
          <span className="bg-yellow-400 text-black font-black text-xs px-2 py-1 rounded uppercase tracking-tight shadow-[0_0_10px_rgba(234,179,8,0.4)]">
            ⚡ 300% DAILY ROI FOREVER
          </span>
        </div>
        <span className="text-green-400 font-mono font-bold text-xs flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping inline-block"></span>
          AUTO-PAYOUT BOT RUNNING
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Col: Mascot & Punchy Claims */}
        <div className="lg:col-span-4 flex flex-col items-center text-center lg:text-left lg:items-start">
          <div className="flex items-center gap-4">
            <MascotVisual type="doge" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
            <div>
              <div className="text-yellow-300 font-black text-lg tracking-tight uppercase">
                DOGE BILLIONAIRE HYIP
              </div>
              <div className="text-xs text-red-400 font-extrabold flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" /> 12.5% HOURLY DIRECT
              </div>
              <div className="mt-1.5 bg-yellow-400/10 border border-yellow-400/30 rounded px-2 py-0.5 text-[11px] text-yellow-200 font-bold">
                100% AUTOMATED ON TELEGRAM
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 w-full text-xs">
            <div className="bg-[#0c0c0f] border border-yellow-500/20 p-2 rounded-lg text-center shadow-inner">
              <span className="text-zinc-500 text-[10px] block font-bold">MIN DEPOSIT</span>
              <span className="font-black text-yellow-400 text-sm font-mono">$10 USDT</span>
            </div>
            <div className="bg-[#0c0c0f] border border-yellow-500/20 p-2 rounded-lg text-center shadow-inner">
              <span className="text-zinc-500 text-[10px] block font-bold">WITHDRAWAL</span>
              <span className="font-black text-green-400 text-sm font-mono">INSTANT 0s</span>
            </div>
          </div>
        </div>

        {/* Center Col: Interactive Calculator Slider */}
        <div className="lg:col-span-5 bg-[#09090c] border border-yellow-500/40 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black text-yellow-300 uppercase flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-yellow-400" /> SELECT INVESTMENT AMOUNT:
            </label>
            <span className="font-mono font-black text-lg text-yellow-300 bg-black px-2.5 py-0.5 rounded border border-yellow-500/50 shadow-inner">
              ${depositAmount.toLocaleString()} USDT
            </span>
          </div>

          {/* Range Slider */}
          <input
            type="range"
            min="50"
            max="10000"
            step="50"
            value={depositAmount}
            onChange={(e) => {
              setDepositAmount(Number(e.target.value));
              soundManager.playSpinTick();
            }}
            className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-400 mb-4"
          />

          {/* Quick preset buttons */}
          <div className="flex items-center justify-between gap-1 mb-4">
            {[100, 500, 1000, 2500, 5000].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setDepositAmount(amt);
                  soundManager.playSpinTick();
                }}
                className={`text-[11px] font-black px-2 py-1 rounded transition-all border ${
                  depositAmount === amt
                    ? 'bg-yellow-400 text-black border-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          {/* Profit Matrix */}
          <div className="grid grid-cols-3 gap-2 text-center bg-black/90 rounded-lg p-2.5 border border-zinc-800/80">
            <div>
              <span className="text-[10px] text-zinc-500 block font-bold">HOURLY (12.5%)</span>
              <span className="font-black font-mono text-xs sm:text-sm text-yellow-400">+${hourlyProfit}</span>
            </div>
            <div className="border-x border-zinc-800">
              <span className="text-[10px] text-zinc-500 block font-bold">DAILY (300%)</span>
              <span className="font-black font-mono text-xs sm:text-sm text-green-400">+${dailyProfit}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block font-bold">7-DAY ROI</span>
              <span className="font-black font-mono text-xs sm:text-sm text-cyan-400">+${weeklyProfit}</span>
            </div>
          </div>
        </div>

        {/* Right Col: High-voltage CTA */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center gap-3">
          <button
            id="hyip-invest-cta-btn"
            onClick={handleInvest}
            className="w-full py-4 px-4 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 hover:from-red-500 hover:to-yellow-300 text-black font-black text-sm sm:text-base rounded-xl border border-yellow-200 shadow-[0_0_25px_rgba(239,68,68,0.6)] pulse-cta flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105 active:scale-95"
          >
            <div className="flex items-center gap-1.5 font-black">
              <span>VISIT OFFICIAL PROJECT SITE</span>
              <ExternalLink className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-extrabold bg-black text-yellow-300 px-2 py-0.5 rounded shadow-sm">
              ⚡ GET +${dailyProfit} USDT TODAY
            </span>
          </button>

          <div className="text-center">
            <p className="text-[11px] text-zinc-400 font-bold flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-400" /> No Registration • Direct Telegram
            </p>
            <button
              onClick={() => onOpenTelegram(`Hi @adkingsSupport, I have a question about HYIP 300% program.`)}
              className="text-xs text-cyan-400 font-bold hover:underline mt-1 flex items-center justify-center gap-1"
            >
              <Send className="w-3 h-3" /> Contact Support on Telegram
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

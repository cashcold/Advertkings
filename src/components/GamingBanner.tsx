import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gamepad2, Gift, Send, Zap, Shield, Flame } from 'lucide-react';
import { MascotVisual } from './MascotVisuals';
import { soundManager } from '../utils/audio';

interface GamingBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

export const GamingBanner: React.FC<GamingBannerProps> = ({ onOpenTelegram, incrementClicks }) => {
  const [openedBox, setOpenedBox] = useState<boolean>(false);

  const handleOpenBox = () => {
    setOpenedBox(true);
    incrementClicks();
    soundManager.playWinFanfare();
    soundManager.playCoin();

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#ec4899', '#f59e0b'],
    });
  };

  const handleClaimGaming = () => {
    incrementClicks();
    soundManager.playCoin();
    onOpenTelegram(
      `🎮 CYBER GAMING & ESPORTS BONUS CLAIM:\n` +
      `• Unlocked Item: AWP Dragon Lore / 250 Free Spins\n` +
      `• Platform: MegaSpin Cyber Casino\n` +
      `• Telegram Promo Code: CYBERGOD99\n` +
      `Please link my Steam / Telegram account!`
    );
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#061118] via-[#09090b] to-[#0c0618] border-2 border-cyan-500/80 p-4 sm:p-6 glow-cyan shadow-2xl backdrop-blur-md">
      {/* Top Tag */}
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-cyan-500 text-black font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wider animate-blink-fast border border-yellow-300/70 flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            <Gamepad2 className="w-3.5 h-3.5" /> CYBER ESPORTS & CASINO
          </span>
          <span className="bg-fuchsia-600 text-white font-black text-xs px-2 py-1 rounded uppercase tracking-tight shadow-[0_0_10px_rgba(217,70,239,0.4)]">
            🎁 FREE MYTHIC LOOT BOX
          </span>
        </div>
        <span className="text-cyan-300 font-mono font-bold text-xs flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-yellow-400" /> INSTANT SKIN CASHOUT
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Col: Mascot & Title */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center gap-4">
            <MascotVisual type="frog" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
            <div>
              <h2 className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-fuchsia-400 uppercase">
                CYBER FROG GAMING
              </h2>
              <p className="text-xs text-cyan-300/80 font-bold mt-0.5">
                CS:GO • Dota 2 • Valorant & Live Crash
              </p>
              <div className="mt-2 inline-flex items-center gap-1 bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                <Shield className="w-3 h-3 text-cyan-400" /> STEAM & TELEGRAM VERIFIED
              </div>
            </div>
          </div>
        </div>

        {/* Center Col: Interactive Loot Box */}
        <div className="lg:col-span-4 flex flex-col items-center bg-[#09090c] border border-cyan-500/50 rounded-2xl p-4 shadow-xl">
          <div className="text-[11px] font-black text-cyan-300 uppercase tracking-widest mb-2 flex items-center gap-1">
            <Gift className="w-3.5 h-3.5 text-yellow-400" /> DAILY MYTHIC CRATE
          </div>

          <div
            onClick={handleOpenBox}
            className={`w-36 h-28 bg-gradient-to-br from-indigo-950 via-purple-950 to-zinc-950 rounded-xl border border-cyan-400/80 flex flex-col items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-transform hover:scale-105 active:scale-95 ${
              openedBox ? 'border-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.5)]' : 'animate-bounce'
            }`}
          >
            {openedBox ? (
              <div className="text-center">
                <span className="text-3xl">🐉</span>
                <span className="text-xs font-black text-yellow-300 block mt-1">AWP DRAGON LORE</span>
                <span className="text-[10px] text-green-400 font-bold font-mono">WORTH $1,250 USDT</span>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-3xl">📦</span>
                <span className="text-[11px] font-black text-cyan-200 block mt-1">CLICK TO OPEN</span>
                <span className="text-[9px] text-yellow-300 font-bold">100% FREE DROP</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Action CTA */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center gap-3">
          <button
            id="gaming-claim-btn"
            onClick={handleClaimGaming}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl border border-yellow-200 shadow-[0_0_25px_rgba(6,182,212,0.6)] pulse-cta flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span>CLAIM MYTHIC SKINS ON TELEGRAM</span>
          </button>

          <span className="text-[11px] text-zinc-400 font-bold text-center">
            🎮 Connect with 1 click via Telegram Bot
          </span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, Send, Flame, Play } from 'lucide-react';
import { MascotVisual } from './MascotVisuals';
import { soundManager } from '../utils/audio';

interface CasinoJackpotBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

const SYMBOLS = ['7️⃣', '💎', '👑', '🍒', '🔔', '💰', '🍀'];

export const CasinoJackpotBanner: React.FC<CasinoJackpotBannerProps> = ({ onOpenTelegram, incrementClicks }) => {
  const [reels, setReels] = useState<string[]>(['7️⃣', '7️⃣', '7️⃣']);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [spinCount, setSpinCount] = useState<number>(0);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setHasWon(false);
    incrementClicks();

    let ticks = 0;
    const interval = setInterval(() => {
      ticks++;
      soundManager.playSpinTick();
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);

      if (ticks > 12) {
        clearInterval(interval);
        // Guaranteed mega win for max engagement!
        const winCombo = spinCount % 2 === 0 ? ['7️⃣', '7️⃣', '7️⃣'] : ['💎', '💎', '💎'];
        setReels(winCombo);
        setIsSpinning(false);
        setHasWon(true);
        setSpinCount((c) => c + 1);

        soundManager.playWinFanfare();
        soundManager.playCoin();

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#eab308', '#ef4444', '#a855f7', '#3b82f6'],
        });
      }
    }, 90);
  };

  const handleClaimBonus = () => {
    incrementClicks();
    soundManager.playCoin();
    onOpenTelegram(
      `🎰 CASINO JACKPOT WINNER CLAIM:\n` +
      `• Result: ${reels.join(' - ')} (3x JACKPOT MATCH!)\n` +
      `• Unlocked Prize: 500% VIP First Deposit + 200 Free Spins\n` +
      `• Promo Code: MEGASPIN777\n` +
      `Please activate my VIP Casino bonus now!`
    );
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#130718] via-[#09090b] to-[#140609] border-2 border-yellow-500/80 p-4 sm:p-6 glow-purple shadow-2xl backdrop-blur-md">
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between border-b border-purple-500/30 pb-3 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-red-600 to-yellow-500 text-white font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wider animate-blink-fast border border-yellow-300/70 flex items-center gap-1 shadow-[0_0_10px_rgba(234,179,8,0.4)]">
            <Flame className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" /> MEGA CASINO JACKPOT 888
          </span>
          <span className="bg-yellow-400 text-black font-black text-xs px-2 py-1 rounded uppercase tracking-tight shadow-[0_0_10px_rgba(234,179,8,0.4)]">
            🎰 98.9% RTP SLOTS
          </span>
        </div>
        <span className="text-yellow-300 font-mono font-bold text-xs flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> 1,500+ CASINO GAMES
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Col: Mascot & Title */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center gap-4">
            <MascotVisual type="ape" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]" />
            <div>
              <h2 className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-purple-300 uppercase">
                DIAMOND APES CASINO
              </h2>
              <p className="text-xs text-purple-300/80 font-bold mt-0.5">
                Spin the Mega Reel & Claim Instant VIP Rewards!
              </p>
              <div className="mt-2 inline-flex items-center gap-1 bg-red-600/30 border border-red-500/60 text-red-200 text-[11px] font-black px-2.5 py-0.5 rounded-full animate-pulse">
                🔥 3 JACKPOTS HIT IN LAST 10 MIN
              </div>
            </div>
          </div>
        </div>

        {/* Center Col: Interactive Mini Slot Machine */}
        <div className="lg:col-span-4 flex flex-col items-center bg-[#0a0a0d] border border-yellow-500/50 rounded-2xl p-4 shadow-2xl">
          <div className="text-[11px] font-black text-yellow-400 uppercase tracking-widest mb-2 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" /> LUCKY REEL SIMULATOR
          </div>

          {/* Slot Reels Box */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 bg-black/90 p-3 rounded-xl border-2 border-yellow-500/60 shadow-[inset_0_0_15px_rgba(0,0,0,0.9)] mb-3">
            {reels.map((symbol, idx) => (
              <div
                key={idx}
                className={`w-14 h-16 sm:w-16 sm:h-20 bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 rounded-lg border border-yellow-400/80 flex items-center justify-center text-3xl sm:text-4xl shadow-md transition-all ${
                  isSpinning ? 'animate-bounce blur-[0.5px]' : 'scale-100'
                }`}
              >
                {symbol}
              </div>
            ))}
          </div>

          {/* Spin Trigger Button */}
          <button
            id="slot-spin-btn"
            disabled={isSpinning}
            onClick={handleSpin}
            className={`w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
              isSpinning
                ? 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-yellow-200 hover:from-yellow-300 hover:to-amber-400 shadow-[0_0_15px_rgba(234,179,8,0.5)] active:scale-95'
            }`}
          >
            <Play className={`w-4 h-4 ${isSpinning ? 'animate-spin' : 'fill-black'}`} />
            <span>{isSpinning ? 'SPINNING REELS...' : 'SPIN REELS (FREE)'}</span>
          </button>
        </div>

        {/* Right Col: Win Results & Direct Claim */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center gap-3">
          {hasWon ? (
            <div className="w-full bg-gradient-to-br from-[#1a1005] to-[#1c0808] border border-yellow-300/80 p-3 rounded-xl text-center shadow-[0_0_20px_rgba(234,179,8,0.4)] animate-pulse">
              <span className="text-xs font-black text-yellow-300 uppercase block">🎉 JACKPOT UNLOCKED!</span>
              <span className="text-base sm:text-lg font-black text-white block font-mono">
                500% BONUS + 200 SPINS
              </span>
              <span className="text-[10px] text-green-300 font-bold block mt-0.5">
                CODE: <strong className="text-yellow-300 font-mono">MEGASPIN777</strong>
              </span>
            </div>
          ) : (
            <div className="w-full bg-[#0c0c0e] border border-zinc-800 p-3 rounded-xl text-center">
              <span className="text-xs font-black text-yellow-400 uppercase block">WELCOME PACKAGE</span>
              <span className="text-sm font-bold text-zinc-300 block">Up to 2,500 USDT Match</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">Spin the reels to win!</span>
            </div>
          )}

          <button
            id="casino-claim-btn"
            onClick={handleClaimBonus}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 via-purple-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm rounded-xl border border-yellow-300/80 shadow-[0_0_25px_rgba(168,85,247,0.6)] pulse-cta flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span>CLAIM CASINO BONUS ON TELEGRAM</span>
          </button>

          <span className="text-[11px] text-zinc-400 font-bold text-center">
            🚀 Instant Telegram deposit via TRC20, TON, BTC, ETH
          </span>
        </div>
      </div>
    </div>
  );
};

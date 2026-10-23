import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Trophy, Coins, Sparkles, Send } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { LiveWinner } from '../types';

interface JackpotTickerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

const INITIAL_WINNERS: LiveWinner[] = [
  { user: '@AlexVip99', amount: '$42,500.00', game: 'Mega Fortune Reel', timeAgo: '3s ago', avatar: '🦁' },
  { user: '@DogeWhale', amount: '$118,940.00', game: 'Aviator Jet 88.4x', timeAgo: '12s ago', avatar: '🚀' },
  { user: '@CryptoQueen', amount: '$15,000.00', game: 'HYIP 300% Payout', timeAgo: '24s ago', avatar: '💎' },
  { user: '@LuckySeven', amount: '$77,777.00', game: 'Lotto 777 Scratch', timeAgo: '41s ago', avatar: '🍀' },
  { user: '@MoonTrader', amount: '$8,640.00', game: 'Esports Cyber Drop', timeAgo: '58s ago', avatar: '⚡' },
];

export const JackpotTicker: React.FC<JackpotTickerProps> = ({ onOpenTelegram, incrementClicks }) => {
  const [jackpot, setJackpot] = useState<number>(8492104.42);
  const [winners, setWinners] = useState<LiveWinner[]>(INITIAL_WINNERS);
  const [recentWinBanner, setRecentWinBanner] = useState<string | null>(null);

  // Ticking jackpot counter
  useEffect(() => {
    const timer = setInterval(() => {
      setJackpot((prev) => prev + (Math.random() * 1.85 + 0.15));
    }, 120);
    return () => clearInterval(timer);
  }, []);

  // Periodic random live winners
  useEffect(() => {
    const winnerTimer = setInterval(() => {
      const names = ['@TonMaster', '@JackpotKing', '@Satoshi77', '@DubaiTrader', '@VipRoller', '@CryptoTiger', '@AlphaWinner'];
      const games = ['Aviator 14.5x', 'Mega Jackpot 777', 'HYIP Hourly Bonus', 'Lotto Gold Scratch', 'Cyber Roulette'];
      const emojis = ['👑', '💰', '🔥', '✈️', '💎', '🎰'];
      
      const newWin: LiveWinner = {
        user: names[Math.floor(Math.random() * names.length)],
        amount: `$${(Math.random() * 35000 + 2000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        game: games[Math.floor(Math.random() * games.length)],
        timeAgo: 'Just now',
        avatar: emojis[Math.floor(Math.random() * emojis.length)],
      };

      setWinners((prev) => [newWin, ...prev.slice(0, 4)]);
      setRecentWinBanner(`🚨 WIN ALERT: ${newWin.user} WON ${newWin.amount} ON ${newWin.game}!`);

      setTimeout(() => {
        setRecentWinBanner(null);
      }, 4000);
    }, 9000);

    return () => clearInterval(winnerTimer);
  }, []);

  const triggerJackpotDrop = () => {
    incrementClicks();
    soundManager.playWinFanfare();
    soundManager.playCoin();

    // Trigger explosive confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#ef4444', '#10b981', '#3b82f6', '#ec4899'],
    });

    setJackpot((prev) => prev + 5000);
    onOpenTelegram(`🔥 JACKPOT DROP TRIGGERED! I want to claim the $5,000 USDT Mega Drop Bonus!`);
  };

  return (
    <section className="relative my-4 overflow-hidden rounded-2xl bg-[#09090b]/95 border-2 border-yellow-500/80 p-3 sm:p-5 glow-gold shadow-2xl backdrop-blur-md">
      {/* Background Animated Lights */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-950/20 via-yellow-950/20 to-purple-950/20 opacity-60 pointer-events-none" />

      {/* Flashing Win Alert Toast */}
      {recentWinBanner && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-red-600 border border-yellow-300 text-yellow-100 font-black text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-bounce whitespace-nowrap">
          {recentWinBanner}
        </div>
      )}

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Jackpot Display Left */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
            <span className="bg-red-600 text-white font-black text-xs px-2.5 py-0.5 rounded uppercase tracking-wider animate-blink-fast flex items-center gap-1 border border-yellow-300/60 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              <Flame className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" /> LIVE GLOBAL JACKPOT
            </span>
            <span className="text-yellow-400 font-bold text-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> GUARANTEED DROP EVERY 15 MIN
            </span>
          </div>

          <div className="flex items-baseline justify-center lg:justify-start gap-1 font-mono">
            <span className="text-3xl sm:text-5xl md:text-6xl font-black bg-gradient-to-b from-yellow-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(234,179,8,0.8)] tracking-tight">
              ${jackpot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-yellow-300 text-sm sm:text-base font-black animate-pulse">USDT</span>
          </div>

          <p className="text-xs text-zinc-400 mt-1 font-bold">
            ⚡ Instant Payouts directly to your Telegram Wallet • Zero Fees • Non-Custodial
          </p>
        </div>

        {/* Live Winners Stream Center */}
        <div className="w-full lg:w-96 bg-[#0e0e11] border border-yellow-500/40 rounded-xl p-2.5 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-black text-yellow-400 border-b border-zinc-800 pb-1 mb-1.5">
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" /> RECENT JACKPOT DROPS
            </span>
            <span className="text-green-400 animate-pulse font-mono">● LIVE STREAM</span>
          </div>
          <div className="space-y-1">
            {winners.slice(0, 3).map((w, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs bg-black/60 px-2 py-1 rounded border border-zinc-800/80"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{w.avatar}</span>
                  <span className="font-bold text-zinc-200">{w.user}</span>
                  <span className="text-[10px] text-zinc-500 hidden sm:inline">({w.game})</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-black text-green-400">{w.amount}</span>
                  <span className="text-[10px] text-zinc-500">{w.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Jackpot Trigger Action Right */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto">
          <button
            id="trigger-jackpot-btn"
            onClick={triggerJackpotDrop}
            className="px-6 py-3.5 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 hover:from-red-500 hover:to-yellow-300 text-black font-black text-sm sm:text-base rounded-xl border border-yellow-200 shadow-[0_0_20px_rgba(234,179,8,0.6)] pulse-cta flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <Coins className="w-5 h-5 text-black" />
            <span>CLAIM $5,000 DROP</span>
            <span className="bg-black text-yellow-300 text-[10px] font-black px-1.5 py-0.5 rounded animate-bounce shadow-sm">
              FREE
            </span>
          </button>

          <button
            id="jackpot-telegram-btn"
            onClick={() => onOpenTelegram('Hi, I want to claim the VIP Jackpot Drop welcome bonus!')}
            className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl border border-cyan-400/80 flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5 text-cyan-300" />
            <span>Connect Telegram Bot</span>
          </button>
        </div>
      </div>
    </section>
  );
};

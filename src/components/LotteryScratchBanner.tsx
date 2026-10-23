import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Send, Check } from 'lucide-react';
import { MascotVisual } from './MascotVisuals';
import { soundManager } from '../utils/audio';

interface LotteryScratchBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

export const LotteryScratchBanner: React.FC<LotteryScratchBannerProps> = ({ onOpenTelegram, incrementClicks }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isScratching, setIsScratching] = useState<boolean>(false);
  const [scratchedPercent, setScratchedPercent] = useState<number>(0);

  // Initialize Canvas Scratch surface
  const initScratchCard = () => {
    setIsRevealed(false);
    setScratchedPercent(0);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 240;
    canvas.height = 110;

    // Draw metallic silver foil pattern
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#9ca3af');
    grad.addColorStop(0.5, '#e5e7eb');
    grad.addColorStop(1, '#6b7280');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text on silver foil
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🪙 SCRATCH HERE TO WIN 🪙', canvas.width / 2, 45);
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#b91c1c';
    ctx.fillText('REVEAL 3 LUCKY 7s', canvas.width / 2, 70);
  };

  useEffect(() => {
    initScratchCard();
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    soundManager.playScratch();

    // Check completion threshold
    setScratchedPercent((prev) => {
      const next = prev + 5;
      if (next >= 40 && !isRevealed) {
        setIsRevealed(true);
        soundManager.playWinFanfare();
        soundManager.playCoin();
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#eab308', '#ef4444'],
        });
      }
      return next;
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsScratching(false);
  };

  const handleClaimLotto = () => {
    incrementClicks();
    soundManager.playCoin();
    onOpenTelegram(
      `🎟️ LOTTERY 777 WINNER CLAIM:\n` +
      `• Scratch Result: 7️⃣-7️⃣-7️⃣ MATCH\n` +
      `• Prize: $50,000 USDT Mega Ticket\n` +
      `• Ticket ID: LOTTO-777-GOLD\n` +
      `Please verify and credit my lottery win!`
    );
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#05140a] via-[#09090b] to-[#0f1406] border-2 border-emerald-500/80 p-4 sm:p-6 glow-green shadow-2xl backdrop-blur-md">
      {/* Top Tag */}
      <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-600 text-white font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wider animate-blink-fast border border-yellow-300/70 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
            <Sparkles className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" /> INSTANT POWERBALL 777
          </span>
          <span className="bg-yellow-400 text-black font-black text-xs px-2 py-1 rounded uppercase tracking-tight shadow-[0_0_10px_rgba(234,179,8,0.4)]">
            🎟️ $50,000 TOP PRIZE
          </span>
        </div>
        <span className="text-yellow-400 font-mono font-bold text-xs flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5" /> 1 IN 3 TICKETS WIN
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Col: Mascot & Title */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center gap-4">
            <MascotVisual type="leprechaun" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
            <div>
              <h2 className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-yellow-200 to-amber-300 uppercase">
                LUCKY CLOVER LOTTO
              </h2>
              <p className="text-xs text-green-300/80 font-bold mt-0.5">
                Rub the Scratch Card & Reveal Instant USDT Payouts!
              </p>
              <div className="mt-2 inline-flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/40 text-yellow-300 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                🍀 100% PROVABLY FAIR
              </div>
            </div>
          </div>
        </div>

        {/* Center Col: Interactive Canvas Scratch Card */}
        <div className="lg:col-span-4 flex flex-col items-center bg-[#09090c] border border-emerald-500/50 rounded-2xl p-4 shadow-xl">
          <div className="text-[11px] font-black text-green-400 uppercase tracking-widest mb-2 flex items-center gap-1">
            <span>SCRATCH CARD PREVIEW</span>
            {isRevealed && <Check className="w-3.5 h-3.5 text-green-400" />}
          </div>

          {/* Underneath Reveal Content */}
          <div className="relative w-[240px] h-[110px] rounded-xl overflow-hidden border-2 border-yellow-400/90 shadow-inner bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex flex-col items-center justify-center select-none">
            <div className="text-2xl font-black text-black">7️⃣ 7️⃣ 7️⃣</div>
            <div className="text-lg font-black text-red-900 font-mono tracking-tight">$50,000 USDT</div>
            <div className="text-[9px] font-bold text-black uppercase">JACKPOT MATCH WINNER!</div>

            {/* Silver Scratch Foil Canvas Layer */}
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="absolute inset-0 cursor-crosshair touch-none"
            />
          </div>

          <div className="flex items-center justify-between w-full mt-2 text-[11px]">
            <button
              onClick={initScratchCard}
              className="text-zinc-400 hover:text-white flex items-center gap-1 font-bold"
            >
              <RotateCcw className="w-3 h-3" /> Reset Card
            </button>
            <span className="text-yellow-400 font-bold">
              {isRevealed ? '🎉 100% REVEALED!' : '👆 Swipe finger or mouse'}
            </span>
          </div>
        </div>

        {/* Right Col: Claim CTA */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center gap-3">
          <button
            id="lotto-claim-btn"
            onClick={handleClaimLotto}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-400 hover:to-emerald-500 text-black font-black text-xs sm:text-sm rounded-xl border border-yellow-200 shadow-[0_0_25px_rgba(16,185,129,0.6)] pulse-cta flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4 text-black fill-black" />
            <span>CLAIM LOTTO WIN ON TELEGRAM</span>
          </button>

          <span className="text-[11px] text-zinc-400 font-bold text-center">
            🎁 Daily Free Scratch Tickets sent directly to Telegram members
          </span>
        </div>
      </div>
    </div>
  );
};

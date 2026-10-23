import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Play,
  RotateCw,
  Trophy,
  AlertCircle,
  Award,
  Zap,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { VirtualBetHistoryItem } from '../../types';

interface VirtualSpinGameProps {
  userBalance: number;
  onUpdateBalance: (delta: number, reason: string) => Promise<boolean>;
  onRecordBet: (item: VirtualBetHistoryItem) => void;
  onOpenReload: () => void;
  soundEnabled: boolean;
}

interface WheelSegment {
  id: number;
  multiplier: number;
  label: string;
  color: string;
  textColor: string;
  isJackpot?: boolean;
}

const SEGMENTS: WheelSegment[] = [
  { id: 0, multiplier: 2, label: '2X', color: '#3b82f6', textColor: '#ffffff' },
  { id: 1, multiplier: 5, label: '5X', color: '#10b981', textColor: '#ffffff' },
  { id: 2, multiplier: 10, label: '10X', color: '#8b5cf6', textColor: '#ffffff' },
  { id: 3, multiplier: 0.5, label: '0.5X', color: '#64748b', textColor: '#ffffff' },
  { id: 4, multiplier: 20, label: '20X', color: '#ec4899', textColor: '#ffffff' },
  { id: 5, multiplier: 100, label: '100X MEGA', color: '#eab308', textColor: '#000000', isJackpot: true },
  { id: 6, multiplier: 1.5, label: '1.5X', color: '#0ea5e9', textColor: '#ffffff' },
  { id: 7, multiplier: 3, label: '3X', color: '#14b8a6', textColor: '#ffffff' },
  { id: 8, multiplier: 0, label: '0X MISS', color: '#ef4444', textColor: '#ffffff' },
  { id: 9, multiplier: 2.5, label: '2.5X', color: '#f59e0b', textColor: '#000000' },
  { id: 10, multiplier: 15, label: '15X', color: '#a855f7', textColor: '#ffffff' },
  { id: 11, multiplier: 50, label: '50X ULTRA', color: '#f97316', textColor: '#ffffff', isJackpot: true },
];

export const VirtualSpinGame: React.FC<VirtualSpinGameProps> = ({
  userBalance,
  onUpdateBalance,
  onRecordBet,
  onOpenReload,
  soundEnabled,
}) => {
  const [stake, setStake] = useState<number>(10);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [landedSegment, setLandedSegment] = useState<WheelSegment | null>(null);
  const [winPayout, setWinPayout] = useState<number | null>(null);

  const currentRotationRef = useRef<number>(0);

  const numSegments = SEGMENTS.length;
  const segmentAngle = 360 / numSegments;

  const handleSpinWheel = async () => {
    if (isSpinning) return;
    if (userBalance < stake) {
      if (soundEnabled) soundManager.playCrash();
      return;
    }

    const ok = await onUpdateBalance(-stake, 'Virtue Spin: Wheel Stake');
    if (!ok) return;

    setIsSpinning(true);
    setLandedSegment(null);
    setWinPayout(null);

    // Rigorous house-edge calibration: 35% win rate, 65% loss rate
    const userWins = Math.random() < 0.35;
    let targetIndex = 0;

    if (userWins) {
      // 35% winning outcomes distributed across positive multipliers (> 1.0x)
      const winRand = Math.random() * 100;
      if (winRand < 40) targetIndex = 6; // 1.5x
      else if (winRand < 65) targetIndex = 0; // 2x
      else if (winRand < 78) targetIndex = 9; // 2.5x
      else if (winRand < 88) targetIndex = 7; // 3x
      else if (winRand < 94) targetIndex = 1; // 5x
      else if (winRand < 97) targetIndex = 2; // 10x
      else if (winRand < 98.5) targetIndex = 10; // 15x
      else if (winRand < 99.4) targetIndex = 4; // 20x
      else if (winRand < 99.85) targetIndex = 11; // 50x ULTRA
      else targetIndex = 5; // 100x MEGA JACKPOT!
    } else {
      // 65% loss outcomes (0x MISS or 0.5x partial recovery)
      // 52% 0X MISS, 13% 0.5X
      targetIndex = Math.random() < 0.80 ? 8 : 3;
    }

    const chosenSeg = SEGMENTS[targetIndex];

    // Calculate rotation to land exactly at top pointer (270 degrees in standard coordinate)
    // Extra full spins (5 to 8 full revolutions)
    const extraSpins = 360 * (6 + Math.floor(Math.random() * 2));
    // The top pointer points at the top of the wheel (0 deg or 360 deg)
    const targetAngle = (360 - (targetIndex * segmentAngle + segmentAngle / 2)) % 360;
    const finalRotation = currentRotationRef.current + extraSpins + ((targetAngle - (currentRotationRef.current % 360) + 360) % 360);

    currentRotationRef.current = finalRotation;
    setRotationDegrees(finalRotation);

    // Ticker audio
    if (soundEnabled) {
      let tickCount = 0;
      const tickInterval = setInterval(() => {
        soundManager.playSpinTick();
        tickCount += 1;
        if (tickCount > 18) clearInterval(tickInterval);
      }, 160);
    }

    // Animation lasts 3.8 seconds
    setTimeout(() => {
      finishSpin(chosenSeg);
    }, 3800);
  };

  const finishSpin = async (segment: WheelSegment) => {
    setIsSpinning(false);
    setLandedSegment(segment);

    const payout = Number((stake * segment.multiplier).toFixed(2));
    setWinPayout(payout);

    const isWin = segment.multiplier > 1.0;

    if (segment.multiplier > 0) {
      if (isWin) {
        if (soundEnabled) soundManager.playWinFanfare();
      } else {
        if (soundEnabled) soundManager.playCrash();
      }
      await onUpdateBalance(payout, `Virtue Spin ${isWin ? 'WON' : 'Partial'}: ${segment.label} (${segment.multiplier}x)`);
      onRecordBet({
        id: `bet-${Date.now()}`,
        game: 'Virtue Spin 🎡',
        market: 'Wheel Multiplier',
        selection: segment.label,
        stake,
        odds: segment.multiplier,
        payout,
        result: isWin ? 'won' : 'lost',
        timestamp: new Date(),
      });
    } else {
      if (soundEnabled) soundManager.playCrash();
      onRecordBet({
        id: `bet-${Date.now()}`,
        game: 'Virtue Spin 🎡',
        market: 'Wheel Multiplier',
        selection: segment.label,
        stake,
        odds: 0,
        payout: 0,
        result: 'lost',
        timestamp: new Date(),
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Virtue Spin Header */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
          <span className="font-black text-yellow-400 uppercase tracking-wider">
            Virtue Mega Wheel • 100X Multiplier VIP
          </span>
        </div>
        <span className="text-zinc-400 font-mono text-[11px] bg-black/60 px-2.5 py-1 rounded border border-zinc-800">
          Fair Random RNG • Instant Payout
        </span>
      </div>

      {/* Interactive Spinning Wheel Stage */}
      <div className="rounded-2xl bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border border-yellow-500/40 p-4 sm:p-6 shadow-[0_0_35px_rgba(234,179,8,0.2)] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute w-72 h-72 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />

        {/* Top Indicator Needle */}
        <div className="relative z-20 -mb-3 flex flex-col items-center">
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-yellow-400 filter drop-shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-white shadow-md border-2 border-yellow-500 -mt-1" />
        </div>

        {/* Wheel SVG */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72">
          <svg
            viewBox="0 0 300 300"
            className="w-full h-full rounded-full shadow-[0_0_40px_rgba(0,0,0,0.9)] border-4 border-yellow-500/80 transition-transform duration-[3800ms] ease-[cubic-bezier(0.15,0.9,0.2,1)]"
            style={{ transform: `rotate(${rotationDegrees}deg)` }}
          >
            {SEGMENTS.map((seg, idx) => {
              const startAngle = idx * segmentAngle;
              const endAngle = (idx + 1) * segmentAngle;
              const startRad = ((startAngle - 90) * Math.PI) / 180;
              const endRad = ((endAngle - 90) * Math.PI) / 180;

              const x1 = 150 + 145 * Math.cos(startRad);
              const y1 = 150 + 145 * Math.sin(startRad);
              const x2 = 150 + 145 * Math.cos(endRad);
              const y2 = 150 + 145 * Math.sin(endRad);

              const pathData = `M 150 150 L ${x1} ${y1} A 145 145 0 0 1 ${x2} ${y2} Z`;

              // Text position
              const midAngle = startAngle + segmentAngle / 2;
              const midRad = ((midAngle - 90) * Math.PI) / 180;
              const textX = 150 + 95 * Math.cos(midRad);
              const textY = 150 + 95 * Math.sin(midRad);

              return (
                <g key={seg.id}>
                  <path d={pathData} fill={seg.color} stroke="#18181b" strokeWidth="1.5" />
                  <text
                    x={textX}
                    y={textY}
                    fill={seg.textColor}
                    fontSize={seg.isJackpot ? '11' : '12'}
                    fontWeight="900"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {seg.label}
                  </text>
                </g>
              );
            })}

            {/* Outer Rim Lights */}
            {SEGMENTS.map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const cx = 150 + 142 * Math.cos(angle);
              const cy = 150 + 142 * Math.sin(angle);
              return <circle key={i} cx={cx} cy={cy} r="2.5" fill="#fef08a" />;
            })}

            {/* Center Hub */}
            <circle cx="150" cy="150" r="32" fill="#09090b" stroke="#eab308" strokeWidth="3" />
            <circle cx="150" cy="150" r="22" fill="#eab308" />
            <text
              x="150"
              y="153"
              fill="#000000"
              fontSize="10"
              fontWeight="900"
              textAnchor="middle"
              dominantBaseline="central"
            >
              VIP
            </text>
          </svg>
        </div>

        {/* Landed Outcome Celebration */}
        {landedSegment && (
          <div
            className={`mt-4 p-3.5 rounded-xl border flex items-center justify-between text-xs w-full max-w-md animate-fadeIn ${
              landedSegment.multiplier > 0
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-yellow-400 shrink-0" />
              <div>
                <strong className="text-sm font-black block">
                  {landedSegment.multiplier > 0
                    ? `🎉 LANDED ON ${landedSegment.label}! +$${winPayout?.toFixed(2)} USD Payout Credited!`
                    : 'Missed this turn (0X). Better luck on the next spin!'}
                </strong>
                <span className="text-[11px] text-zinc-400">
                  Multiplier: {landedSegment.multiplier}x • Stake: ${stake.toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stake Controller & Spin Action */}
      <div className="p-3.5 rounded-2xl bg-zinc-950 border border-yellow-500/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-bold">Max Wheel Multiplier:</span>
            <span className="font-black text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/30">
              100X MEGA JACKPOT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Potential 100X Win:</span>
            <span className="font-mono font-black text-emerald-400 text-sm">
              ${(stake * 100).toFixed(2)} USD
            </span>
          </div>
        </div>

        {/* Stake Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-zinc-400 mr-1">Spin Stake:</span>
          {[2, 5, 10, 25, 50, 100].map((amt) => (
            <button
              key={amt}
              type="button"
              disabled={isSpinning}
              onClick={() => {
                setStake(amt);
                if (soundEnabled) soundManager.playSpinTick();
              }}
              className={`px-2.5 py-1 text-xs font-black rounded-lg border transition cursor-pointer ${
                stake === amt
                  ? 'bg-yellow-400 text-black border-yellow-300'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              ${amt}
            </button>
          ))}
          <button
            type="button"
            disabled={isSpinning || userBalance < 1}
            onClick={() => {
              setStake(Math.floor(userBalance));
              if (soundEnabled) soundManager.playCoin();
            }}
            className="px-2.5 py-1 text-xs font-black text-yellow-300 bg-yellow-500/20 border border-yellow-500/40 rounded-lg uppercase cursor-pointer"
          >
            MAX (${Math.floor(userBalance)})
          </button>
        </div>

        {/* Spin Action */}
        {userBalance < stake ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
            <span>Insufficient balance (${userBalance.toFixed(2)} USD available).</span>
            <button
              type="button"
              onClick={onOpenReload}
              className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-lg cursor-pointer transition"
            >
              + Deposit Funds
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={isSpinning}
            onClick={handleSpinWheel}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 hover:from-yellow-400 hover:to-amber-300 disabled:opacity-50 text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(234,179,8,0.45)] transition cursor-pointer border border-yellow-200"
          >
            {isSpinning ? (
              <>
                <RotateCw className="w-5 h-5 animate-spin" />
                <span>Spinning Virtue Mega Wheel...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-black" />
                <span>
                  SPIN VIRTUE MEGA WHEEL (${stake.toFixed(2)} USD)
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

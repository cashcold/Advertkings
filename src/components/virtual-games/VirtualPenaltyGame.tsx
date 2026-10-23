import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Trophy,
  AlertCircle,
  Award,
  Zap,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { VirtualBetHistoryItem } from '../../types';

interface VirtualPenaltyGameProps {
  userBalance: number;
  onUpdateBalance: (delta: number, reason: string) => Promise<boolean>;
  onRecordBet: (item: VirtualBetHistoryItem) => void;
  onOpenReload: () => void;
  soundEnabled: boolean;
}

type TargetZone = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

const MULTIPLIERS = [1.95, 3.80, 7.50, 15.00, 32.00];

export const VirtualPenaltyGame: React.FC<VirtualPenaltyGameProps> = ({
  userBalance,
  onUpdateBalance,
  onRecordBet,
  onOpenReload,
  soundEnabled,
}) => {
  const [stake, setStake] = useState<number>(10);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [inRound, setInRound] = useState<boolean>(false);
  const [isShooting, setIsShooting] = useState<boolean>(false);
  const [lastShotZone, setLastShotZone] = useState<TargetZone | null>(null);
  const [keeperDiveZone, setKeeperDiveZone] = useState<TargetZone | null>(null);
  const [shotResult, setShotResult] = useState<'goal' | 'saved' | null>(null);
  const [roundNotification, setRoundNotification] = useState<string>('Pick a corner and strike past the goalkeeper.');

  const currentMultiplier = currentStreak > 0 ? MULTIPLIERS[currentStreak - 1] : 1;
  const currentPotentialCashout = currentStreak > 0 ? Number((stake * currentMultiplier).toFixed(2)) : 0;

  const handleStartRound = async () => {
    if (inRound) return;
    if (userBalance < stake) {
      if (soundEnabled) soundManager.playCrash();
      return;
    }

    const ok = await onUpdateBalance(-stake, 'Virtue Penalty: Round Stake');
    if (!ok) return;

    setInRound(true);
    setCurrentStreak(0);
    setShotResult(null);
    setLastShotZone(null);
    setKeeperDiveZone(null);
    setRoundNotification('Round active! Pick your shot target (Goal 1 of 5).');
    if (soundEnabled) soundManager.playWhistle();
  };

  const handleShoot = (zone: TargetZone) => {
    if (!inRound || isShooting) return;

    setIsShooting(true);
    setLastShotZone(zone);
    setShotResult(null);

    const zones: TargetZone[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];
    
    // Rigorous house-edge calibration: 35% win (goal) / 65% loss (saved)
    const goalScored = Math.random() < 0.35;
    let keeperDive: TargetZone;
    if (goalScored) {
      // Keeper dives away to an alternate zone, allowing the goal
      const otherZones = zones.filter((z) => z !== zone);
      keeperDive = otherZones[Math.floor(Math.random() * otherZones.length)];
    } else {
      // 65% loss: goalkeeper reads the trajectory and blocks the exact zone!
      keeperDive = zone;
    }

    setKeeperDiveZone(keeperDive);

    if (soundEnabled) soundManager.playWhistle();

    setTimeout(async () => {
      setIsShooting(false);
      const isSaved = keeperDive === zone;

      if (!isSaved) {
        // Goal scored!
        const nextStreak = currentStreak + 1;
        setCurrentStreak(nextStreak);
        setShotResult('goal');
        if (soundEnabled) soundManager.playCoin();

        if (nextStreak === 5) {
          // Completed full ladder!
          const maxPayout = Number((stake * MULTIPLIERS[4]).toFixed(2));
          if (soundEnabled) soundManager.playWinFanfare();
          await onUpdateBalance(maxPayout, `Virtue Penalty 5/5 STREAK WON: 32X ($${maxPayout})`);
          onRecordBet({
            id: `bet-${Date.now()}`,
            game: 'Virtue Penalty 🥅',
            market: '5/5 Streak Ladder',
            selection: '32.00x Golden Trophy',
            stake,
            odds: MULTIPLIERS[4],
            payout: maxPayout,
            result: 'won',
            timestamp: new Date(),
          });
          setInRound(false);
          setRoundNotification(`🏆 GOLDEN BOOT! 5 CONSECUTIVE GOALS! Won $${maxPayout.toFixed(2)} USD (32X)!`);
        } else {
          setRoundNotification(`💥 GOAL! Streak ${nextStreak}/5! Multiplier now ${MULTIPLIERS[nextStreak - 1]}X ($${(stake * MULTIPLIERS[nextStreak - 1]).toFixed(2)} USD). Cash out or shoot next!`);
        }
      } else {
        // Saved! Round lost
        setShotResult('saved');
        setInRound(false);
        setCurrentStreak(0);
        if (soundEnabled) soundManager.playCrash();
        setRoundNotification(`🧤 SAVED! Goalkeeper blocked the shot in the ${zone} corner. Round over.`);
        onRecordBet({
          id: `bet-${Date.now()}`,
          game: 'Virtue Penalty 🥅',
          market: 'Penalty Streak',
          selection: `${zone} Shot`,
          stake,
          odds: 0,
          payout: 0,
          result: 'lost',
          timestamp: new Date(),
        });
      }
    }, 1100);
  };

  const handleCashout = async () => {
    if (!inRound || currentStreak === 0 || isShooting) return;

    const payout = currentPotentialCashout;
    setInRound(false);
    if (soundEnabled) soundManager.playWinFanfare();
    await onUpdateBalance(payout, `Virtue Penalty Cashout: ${currentMultiplier}x ($${payout})`);
    onRecordBet({
      id: `bet-${Date.now()}`,
      game: 'Virtue Penalty 🥅',
      market: 'Streak Cashout',
      selection: `${currentStreak} Goals @ ${currentMultiplier}x`,
      stake,
      odds: currentMultiplier,
      payout,
      result: 'won',
      timestamp: new Date(),
    });
    setRoundNotification(`💰 CASHED OUT! Banked +$${payout.toFixed(2)} USD (${currentMultiplier}X)!`);
    setCurrentStreak(0);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-black text-emerald-400 uppercase tracking-wider">
            Virtue Penalty Shootout • Golden Multiplier Streak
          </span>
        </div>
        <span className="text-zinc-400 font-mono text-[11px] bg-black/60 px-2.5 py-1 rounded border border-zinc-800">
          Up to 32X Multiplier
        </span>
      </div>

      {/* Goal Frame Stage */}
      <div className="rounded-2xl bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border border-emerald-500/40 p-4 sm:p-5 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden">
        {/* Streak Multiplier Ladder */}
        <div className="grid grid-cols-5 gap-1.5 mb-4">
          {MULTIPLIERS.map((mult, idx) => {
            const isReached = currentStreak > idx;
            const isCurrent = currentStreak === idx + 1;
            return (
              <div
                key={idx}
                className={`p-2 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-yellow-400 text-black border-yellow-300 font-black shadow-[0_0_15px_rgba(234,179,8,0.5)] scale-105'
                    : isReached
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-500 font-mono'
                }`}
              >
                <span className="text-[9px] block uppercase opacity-80">Goal {idx + 1}</span>
                <strong className="text-xs sm:text-sm font-black">{mult}X</strong>
              </div>
            );
          })}
        </div>

        {/* Goal Post View */}
        <div className="relative h-56 sm:h-64 bg-gradient-to-b from-sky-950/40 via-emerald-950/30 to-emerald-900/60 rounded-xl border-4 border-white/80 shadow-inner overflow-hidden flex flex-col justify-between p-3">
          {/* Net texture */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.06),rgba(255,255,255,0.06)_12px,transparent_12px,transparent_24px)] pointer-events-none" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.06)_12px,transparent_12px,transparent_24px)] pointer-events-none" />

          {/* Goalkeeper in Goal */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div
              className={`text-4xl sm:text-5xl transition-all duration-500 ${
                keeperDiveZone === 'top-left'
                  ? '-translate-x-24 -translate-y-12 rotate-[-45deg]'
                  : keeperDiveZone === 'top-right'
                  ? 'translate-x-24 -translate-y-12 rotate-[45deg]'
                  : keeperDiveZone === 'bottom-left'
                  ? '-translate-x-28 translate-y-12 rotate-[-60deg]'
                  : keeperDiveZone === 'bottom-right'
                  ? 'translate-x-28 translate-y-12 rotate-[60deg]'
                  : keeperDiveZone === 'center'
                  ? '-translate-y-4'
                  : ''
              }`}
            >
              🧤
            </div>
          </div>

          {/* Target Zones (Top) */}
          <div className="flex justify-between relative z-20">
            <button
              type="button"
              disabled={!inRound || isShooting}
              onClick={() => handleShoot('top-left')}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition cursor-pointer ${
                lastShotZone === 'top-left'
                  ? shotResult === 'goal'
                    ? 'bg-emerald-500/50 border-emerald-300 animate-pulse'
                    : 'bg-red-500/50 border-red-400'
                  : inRound
                  ? 'bg-black/50 border-yellow-400/80 hover:bg-yellow-400/20 text-yellow-300'
                  : 'bg-black/30 border-zinc-700 text-zinc-600'
              }`}
            >
              <span className="text-xl">↖</span>
              <span className="text-[10px] font-black uppercase">Top Left</span>
            </button>

            {/* Center Panenka */}
            <button
              type="button"
              disabled={!inRound || isShooting}
              onClick={() => handleShoot('center')}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition cursor-pointer ${
                lastShotZone === 'center'
                  ? shotResult === 'goal'
                    ? 'bg-emerald-500/50 border-emerald-300 animate-pulse'
                    : 'bg-red-500/50 border-red-400'
                  : inRound
                  ? 'bg-black/50 border-yellow-400/80 hover:bg-yellow-400/20 text-yellow-300'
                  : 'bg-black/30 border-zinc-700 text-zinc-600'
              }`}
            >
              <span className="text-xl">⬆</span>
              <span className="text-[10px] font-black uppercase">Panenka</span>
            </button>

            <button
              type="button"
              disabled={!inRound || isShooting}
              onClick={() => handleShoot('top-right')}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition cursor-pointer ${
                lastShotZone === 'top-right'
                  ? shotResult === 'goal'
                    ? 'bg-emerald-500/50 border-emerald-300 animate-pulse'
                    : 'bg-red-500/50 border-red-400'
                  : inRound
                  ? 'bg-black/50 border-yellow-400/80 hover:bg-yellow-400/20 text-yellow-300'
                  : 'bg-black/30 border-zinc-700 text-zinc-600'
              }`}
            >
              <span className="text-xl">↗</span>
              <span className="text-[10px] font-black uppercase">Top Right</span>
            </button>
          </div>

          {/* Target Zones (Bottom) */}
          <div className="flex justify-between relative z-20">
            <button
              type="button"
              disabled={!inRound || isShooting}
              onClick={() => handleShoot('bottom-left')}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition cursor-pointer ${
                lastShotZone === 'bottom-left'
                  ? shotResult === 'goal'
                    ? 'bg-emerald-500/50 border-emerald-300 animate-pulse'
                    : 'bg-red-500/50 border-red-400'
                  : inRound
                  ? 'bg-black/50 border-yellow-400/80 hover:bg-yellow-400/20 text-yellow-300'
                  : 'bg-black/30 border-zinc-700 text-zinc-600'
              }`}
            >
              <span className="text-xl">↙</span>
              <span className="text-[10px] font-black uppercase">Low Left</span>
            </button>

            {/* Ball on Penalty Spot */}
            <div className="flex flex-col items-center justify-end pb-1">
              <span className={`text-2xl sm:text-3xl ${isShooting ? 'animate-ping' : ''}`}>⚽</span>
              <span className="text-[9px] font-mono text-zinc-400">11m Spot</span>
            </div>

            <button
              type="button"
              disabled={!inRound || isShooting}
              onClick={() => handleShoot('bottom-right')}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition cursor-pointer ${
                lastShotZone === 'bottom-right'
                  ? shotResult === 'goal'
                    ? 'bg-emerald-500/50 border-emerald-300 animate-pulse'
                    : 'bg-red-500/50 border-red-400'
                  : inRound
                  ? 'bg-black/50 border-yellow-400/80 hover:bg-yellow-400/20 text-yellow-300'
                  : 'bg-black/30 border-zinc-700 text-zinc-600'
              }`}
            >
              <span className="text-xl">↘</span>
              <span className="text-[10px] font-black uppercase">Low Right</span>
            </button>
          </div>
        </div>

        {/* Shootout Status Bar */}
        <div className="mt-3 p-2.5 rounded-lg bg-black/70 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-mono text-emerald-300 font-bold truncate">{roundNotification}</span>
          </div>

          {inRound && currentStreak > 0 && (
            <button
              type="button"
              disabled={isShooting}
              onClick={handleCashout}
              className="ml-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs rounded-lg shadow-[0_0_12px_rgba(16,185,129,0.5)] transition cursor-pointer shrink-0"
            >
              Cash Out ${currentPotentialCashout.toFixed(2)} USD
            </button>
          )}
        </div>
      </div>

      {/* Stake Controller & Start Round */}
      {!inRound && (
        <div className="p-3.5 rounded-2xl bg-zinc-950 border border-yellow-500/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-bold">Goal 1 Multiplier:</span>
              <span className="font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                1.95X
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Max Trophy Payout:</span>
              <span className="font-mono font-black text-yellow-400 text-sm">
                ${(stake * 32).toFixed(2)} USD (32X)
              </span>
            </div>
          </div>

          {/* Quick Stakes */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-zinc-400 mr-1">Stake:</span>
            {[2, 5, 10, 25, 50, 100].map((amt) => (
              <button
                key={amt}
                type="button"
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
              disabled={userBalance < 1}
              onClick={() => {
                setStake(Math.floor(userBalance));
                if (soundEnabled) soundManager.playCoin();
              }}
              className="px-2.5 py-1 text-xs font-black text-yellow-300 bg-yellow-500/20 border border-yellow-500/40 rounded-lg uppercase cursor-pointer"
            >
              MAX (${Math.floor(userBalance)})
            </button>
          </div>

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
              onClick={handleStartRound}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition cursor-pointer border border-emerald-300"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>START PENALTY SHOOTOUT (${stake.toFixed(2)} USD)</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

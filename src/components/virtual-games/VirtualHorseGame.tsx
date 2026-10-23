import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Play,
  Flame,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Zap,
  Award,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { VirtualBetHistoryItem } from '../../types';

interface VirtualHorseGameProps {
  userBalance: number;
  onUpdateBalance: (delta: number, reason: string) => Promise<boolean>;
  onRecordBet: (item: VirtualBetHistoryItem) => void;
  onOpenReload: () => void;
  soundEnabled: boolean;
}

interface Horse {
  number: number;
  name: string;
  odds: number;
  color: string;
  silkBg: string;
  jockey: string;
  form: string;
}

const HORSES: Horse[] = [
  { number: 1, name: 'Thunder Bolt', odds: 3.20, color: '#ef4444', silkBg: 'from-red-500 to-amber-500', jockey: 'D. Egan', form: '1-1-2' },
  { number: 2, name: 'Desert Mirage', odds: 4.50, color: '#3b82f6', silkBg: 'from-blue-500 to-cyan-400', jockey: 'W. Buick', form: '2-1-3' },
  { number: 3, name: 'Golden Gallop', odds: 6.00, color: '#eab308', silkBg: 'from-yellow-400 to-amber-600', jockey: 'R. Moore', form: '3-2-1' },
  { number: 4, name: 'Shadow Stallion', odds: 8.50, color: '#a855f7', silkBg: 'from-purple-600 to-pink-500', jockey: 'F. Dettori', form: '4-3-2' },
  { number: 5, name: 'Royal Majesty', odds: 12.00, color: '#10b981', silkBg: 'from-emerald-500 to-teal-400', jockey: 'O. Murphy', form: '1-4-5' },
  { number: 6, name: 'Lucky Sovereign', odds: 18.00, color: '#f97316', silkBg: 'from-orange-500 to-red-600', jockey: 'T. Marquand', form: '5-2-4' },
];

export const VirtualHorseGame: React.FC<VirtualHorseGameProps> = ({
  userBalance,
  onUpdateBalance,
  onRecordBet,
  onOpenReload,
  soundEnabled,
}) => {
  const [selectedHorseNum, setSelectedHorseNum] = useState<number>(1);
  const [stake, setStake] = useState<number>(10);
  const [raceState, setRaceState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [horseProgress, setHorseProgress] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [winnerHorse, setWinnerHorse] = useState<Horse | null>(null);
  const [winPayout, setWinPayout] = useState<number | null>(null);
  const [raceCommentary, setRaceCommentary] = useState<string>('Gates closed. Horses lined up at the starting stalls.');

  const activeBetRef = useRef<{ horse: Horse; stake: number } | null>(null);

  const selectedHorse = HORSES.find((h) => h.number === selectedHorseNum) || HORSES[0];

  const handleStartRace = async () => {
    if (userBalance < stake) {
      if (soundEnabled) soundManager.playCrash();
      return;
    }

    const ok = await onUpdateBalance(-stake, `Virtue Horse: #${selectedHorse.number} ${selectedHorse.name}`);
    if (!ok) return;

    if (soundEnabled) {
      soundManager.playWhistle();
      soundManager.playGallop();
    }

    activeBetRef.current = { horse: selectedHorse, stake };
    setRaceState('running');
    setWinnerHorse(null);
    setWinPayout(null);
    setRaceCommentary('🔔 THE GATES FLY OPEN! And they\'re off in the Royal Virtue Derby!');

    const currentPositions = [0, 0, 0, 0, 0, 0];
    setHorseProgress([...currentPositions]);

    // Rigorous house-edge calibration: 35% win rate, 65% loss rate
    const userWins = Math.random() < 0.35;
    let targetWinnerHorse: Horse;
    if (userWins) {
      targetWinnerHorse = selectedHorse;
    } else {
      const rivals = HORSES.filter((h) => h.number !== selectedHorse.number);
      targetWinnerHorse = rivals[Math.floor(Math.random() * rivals.length)];
    }

    const targetWinnerIdx = HORSES.findIndex((h) => h.number === targetWinnerHorse.number);

    let elapsed = 0;
    const totalTicks = 14;

    const interval = setInterval(() => {
      elapsed += 1;

      // Update positions with realistic gallop surges and momentum
      for (let i = 0; i < 6; i++) {
        if (i === targetWinnerIdx) {
          // Winner surges strongly in final stretch to take 1st place
          const winnerStep = elapsed > 8 ? 8.2 + Math.random() * 2.5 : 6.5 + Math.random() * 2.0;
          currentPositions[i] = Math.min(100, currentPositions[i] + winnerStep);
        } else {
          // Other horses race tightly but lag slightly behind the winner
          const regularStep = elapsed > 9 ? 4.5 + Math.random() * 2.2 : 6.0 + Math.random() * 2.2;
          currentPositions[i] = Math.min(94, currentPositions[i] + regularStep);
        }
      }

      // If last tick reached or winner crossed line
      if (elapsed >= totalTicks || currentPositions[targetWinnerIdx] >= 98) {
        currentPositions[targetWinnerIdx] = 100;
        setHorseProgress([...currentPositions]);
        clearInterval(interval);
        finishRace(targetWinnerHorse);
        return;
      }

      setHorseProgress([...currentPositions]);

      if (soundEnabled && elapsed % 3 === 0) {
        soundManager.playGallop();
      }

      // Live dynamic commentary
      const leaderIndex = currentPositions.indexOf(Math.max(...currentPositions));
      const leader = HORSES[leaderIndex];
      if (elapsed === 3) {
        setRaceCommentary(`⚡ Approaching the 800m bend! #${leader.number} ${leader.name} takes the rail!`);
      } else if (elapsed === 7) {
        setRaceCommentary(`🔥 400m to go! The pack bunches up, jockeys driving with whips!`);
      } else if (elapsed === 11) {
        setRaceCommentary(`💥 FINAL FURLONG! #${targetWinnerHorse.number} ${targetWinnerHorse.name} bursts through with a furious sprint!`);
      }
    }, 420);
  };

  const finishRace = async (winningHorse: Horse) => {
    setRaceState('finished');
    setWinnerHorse(winningHorse);
    setRaceCommentary(`🏆 PHOTO FINISH! #${winningHorse.number} ${winningHorse.name} storms past the post to WIN!`);

    const placed = activeBetRef.current;
    if (!placed) return;

    if (winningHorse.number === placed.horse.number) {
      const payout = Number((placed.stake * placed.horse.odds).toFixed(2));
      setWinPayout(payout);
      if (soundEnabled) soundManager.playWinFanfare();
      await onUpdateBalance(payout, `Virtue Horse WON: #${placed.horse.number} ${placed.horse.name} @${placed.horse.odds}`);
      onRecordBet({
        id: `bet-${Date.now()}`,
        game: 'Virtue Horse 🐎',
        market: 'Winner',
        selection: `#${placed.horse.number} ${placed.horse.name}`,
        stake: placed.stake,
        odds: placed.horse.odds,
        payout,
        result: 'won',
        timestamp: new Date(),
      });
    } else {
      setWinPayout(0);
      if (soundEnabled) soundManager.playCrash();
      onRecordBet({
        id: `bet-${Date.now()}`,
        game: 'Virtue Horse 🐎',
        market: 'Winner',
        selection: `#${placed.horse.number} ${placed.horse.name}`,
        stake: placed.stake,
        odds: placed.horse.odds,
        payout: 0,
        result: 'lost',
        timestamp: new Date(),
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Race Track Header */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="font-black text-amber-400 uppercase tracking-wider">
            Ascot Virtue Derby • 1200m Sprint
          </span>
        </div>
        <span className="text-zinc-400 font-mono text-[11px] bg-black/60 px-2.5 py-1 rounded border border-zinc-800">
          6 Runners • Turf Firm
        </span>
      </div>

      {/* Interactive Galloping Turf Race Track */}
      <div className="rounded-2xl bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border border-amber-500/40 p-3 sm:p-4 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
        {/* Dynamic Moving Background: Ascot Grandstand & Railing Scenery */}
        <div className="relative h-10 mb-2 rounded-xl bg-gradient-to-b from-emerald-950 to-zinc-950 border border-emerald-800/60 overflow-hidden flex items-center">
          {/* Continuous scrolling grandstand and distance markers */}
          <div
            className={`flex items-center whitespace-nowrap text-[10px] text-emerald-300 font-mono tracking-wider font-bold select-none ${
              raceState === 'running' ? 'animate-track-scenery' : ''
            }`}
            style={{ width: '200%' }}
          >
            <div className="flex items-center gap-8 px-4 shrink-0 w-1/2 justify-around">
              <span>🏟️ ROYAL ASCOT GRANDSTAND</span>
              <span>🚩 1200m GATES</span>
              <span>🌳 FURLONG RAIL</span>
              <span>🚩 800m BEND</span>
              <span>🏇 CHEERING ENCLOSURE</span>
              <span>🚩 400m STRETCH</span>
              <span>🚩 200m SPRINT</span>
              <span className="text-yellow-400 font-black">🏁 FINISH POST</span>
            </div>
            <div className="flex items-center gap-8 px-4 shrink-0 w-1/2 justify-around">
              <span>🏟️ ROYAL ASCOT GRANDSTAND</span>
              <span>🚩 1200m GATES</span>
              <span>🌳 FURLONG RAIL</span>
              <span>🚩 800m BEND</span>
              <span>🏇 CHEERING ENCLOSURE</span>
              <span>🚩 400m STRETCH</span>
              <span>🚩 200m SPRINT</span>
              <span className="text-yellow-400 font-black">🏁 FINISH POST</span>
            </div>
          </div>

          {/* White Racetrack Rail Fence overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-1.5 bg-[repeating-linear-gradient(90deg,#ffffff,#ffffff_4px,transparent_4px,transparent_16px)] opacity-60 ${
              raceState === 'running' ? 'animate-turf-moving' : ''
            }`}
          />
        </div>

        {/* Track Turf Background with Lane Dividers */}
        <div className="space-y-2.5 relative">
          {HORSES.map((h, idx) => {
            const isUserPick = h.number === selectedHorseNum;
            const progress = horseProgress[idx] || 0;
            const isWinner = winnerHorse?.number === h.number;

            return (
              <div
                key={h.number}
                className={`relative p-2 rounded-xl border transition-all ${
                  isWinner
                    ? 'bg-amber-500/20 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                    : isUserPick
                    ? 'bg-zinc-900/90 border-amber-500/60'
                    : 'bg-zinc-950/80 border-zinc-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full bg-gradient-to-br ${h.silkBg} text-white font-black flex items-center justify-center text-[10px] shadow`}
                    >
                      {h.number}
                    </span>
                    <strong className="text-white font-bold">{h.name}</strong>
                    <span className="text-zinc-400 text-[10px] hidden sm:inline">({h.jockey})</span>
                    {isUserPick && (
                      <span className="px-1.5 py-0.2 bg-yellow-400 text-black font-black text-[9px] rounded uppercase">
                        YOUR PICK
                      </span>
                    )}
                    {isWinner && (
                      <span className="px-1.5 py-0.2 bg-yellow-400 text-black font-black text-[9px] rounded uppercase animate-bounce">
                        👑 1ST PLACE
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-black text-yellow-400">@{h.odds.toFixed(2)}</span>
                </div>

                {/* Turf Running Lane Progress Bar with Continuous Scrolling Grass */}
                <div className="relative h-6 bg-emerald-950/70 rounded-lg border border-emerald-900/80 overflow-hidden flex items-center">
                  {/* Lane Turf Moving Grass Texture */}
                  <div
                    className={`absolute inset-0 bg-[repeating-linear-gradient(90deg,#064e3b,#064e3b_10px,#047857_10px,#047857_20px)] opacity-50 ${
                      raceState === 'running' ? 'animate-turf-moving' : ''
                    }`}
                  />
                  
                  {/* Secondary Fast Moving Turf Specks */}
                  <div
                    className={`absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_30px,rgba(255,255,255,0.08)_30px,rgba(255,255,255,0.08)_33px)] ${
                      raceState === 'running' ? 'animate-turf-moving' : ''
                    }`}
                  />

                  {/* Finish Line Marker (Checkered White & Black) */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-4 bg-[repeating-conic-gradient(#000_0_90deg,#fff_90deg_180deg)] bg-[length:6px_6px] z-10 opacity-90 shadow-[0_0_12px_rgba(255,255,255,0.6)] border-l border-white/40"
                    title="Finish Line"
                  />

                  {/* Galloping Horse Avatar - Facing Right and Galloping Forward to Finish Line */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-linear z-10 flex items-center gap-1"
                    style={{ left: `calc(${Math.min(90, progress)}%)` }}
                  >
                    {/* Dust trail trailing BEHIND on the left */}
                    {raceState === 'running' && progress > 5 && progress < 95 && (
                      <span className="text-[10px] text-amber-300 opacity-80 animate-ping select-none">
                        💨
                      </span>
                    )}

                    {/* Number Badge trailing behind the horse head */}
                    <span
                      className="text-[9px] font-black px-1 rounded text-white bg-black/85 border shrink-0 shadow-sm"
                      style={{ borderColor: h.color }}
                    >
                      #{h.number}
                    </span>

                    {/* Galloping Horse Emoji Facing RIGHT towards the finish line */}
                    <span
                      className={`text-lg filter drop-shadow inline-block ${
                        raceState === 'running' ? 'animate-gallop-bounce' : ''
                      }`}
                    >
                      <span className="inline-block transform scale-x-[-1] select-none">
                        🐎
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Race Commentary Ticker */}
        <div className="mt-3 p-2.5 rounded-lg bg-black/70 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-mono text-amber-300 font-bold truncate">{raceCommentary}</span>
        </div>

        {/* Winner Result Card */}
        {raceState === 'finished' && (
          <div
            className={`mt-3 p-3.5 rounded-xl border flex items-center justify-between text-xs animate-fadeIn ${
              winPayout && winPayout > 0
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {winPayout && winPayout > 0 ? (
                <Sparkles className="w-5 h-5 text-yellow-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-zinc-400 shrink-0" />
              )}
              <div>
                <strong className="text-sm font-black block">
                  {winPayout && winPayout > 0
                    ? `🎉 DERBY VICTORY! +$${winPayout.toFixed(2)} USD Payout Credited!`
                    : `Run complete. #${winnerHorse?.number} ${winnerHorse?.name} took 1st place.`}
                </strong>
                <span className="text-[11px] text-zinc-400">
                  Your Pick: #{selectedHorse.number} {selectedHorse.name} • Stake: ${stake.toFixed(2)} USD
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setRaceState('idle');
                setWinnerHorse(null);
                setWinPayout(null);
                setHorseProgress([0, 0, 0, 0, 0, 0]);
                setRaceCommentary('Ready for next derby heat.');
              }}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-lg text-xs transition cursor-pointer"
            >
              Next Race
            </button>
          </div>
        )}
      </div>

      {/* Horse Selection Cards */}
      <div>
        <h4 className="text-xs font-black text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Select Your Winning Thoroughbred</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {HORSES.map((h) => {
            const isSelected = h.number === selectedHorseNum;
            return (
              <button
                key={h.number}
                type="button"
                disabled={raceState === 'running'}
                onClick={() => {
                  setSelectedHorseNum(h.number);
                  if (soundEnabled) soundManager.playSpinTick();
                }}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-yellow-400 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.3)]'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                } disabled:opacity-50`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-4 h-4 rounded-full bg-gradient-to-br ${h.silkBg} text-white font-black flex items-center justify-center text-[9px]`}
                    >
                      {h.number}
                    </span>
                    <span className="text-[10px] text-zinc-400">Form: {h.form}</span>
                  </div>
                  <strong className="font-mono text-yellow-400 text-xs">@{h.odds.toFixed(2)}</strong>
                </div>
                <p className="text-xs font-black text-white truncate">{h.name}</p>
                <p className="text-[10px] text-zinc-400 truncate">Jockey: {h.jockey}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stake Controller & Race Button */}
      <div className="p-3.5 rounded-2xl bg-zinc-950 border border-yellow-500/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-bold">Selected Horse:</span>
            <span className="font-black text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/30">
              #{selectedHorse.number} {selectedHorse.name}
            </span>
            <span className="font-mono font-black text-white">@{selectedHorse.odds.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Potential Return:</span>
            <span className="font-mono font-black text-emerald-400 text-sm">
              ${(stake * selectedHorse.odds).toFixed(2)} USD
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
              disabled={raceState === 'running'}
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
            disabled={raceState === 'running' || userBalance < 1}
            onClick={() => {
              setStake(Math.floor(userBalance));
              if (soundEnabled) soundManager.playCoin();
            }}
            className="px-2.5 py-1 text-xs font-black text-yellow-300 bg-yellow-500/20 border border-yellow-500/40 rounded-lg uppercase cursor-pointer"
          >
            MAX (${Math.floor(userBalance)})
          </button>
        </div>

        {/* Race Start Action */}
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
            disabled={raceState === 'running'}
            onClick={handleStartRace}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 disabled:opacity-50 text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition cursor-pointer border border-amber-300"
          >
            {raceState === 'running' ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Horses Galloping Towards Finish Line...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span>
                  Bet & Start Virtue Horse Race (${stake.toFixed(2)} USD)
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

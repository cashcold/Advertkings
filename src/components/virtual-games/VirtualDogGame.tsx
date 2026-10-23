import React, { useState, useRef } from 'react';
import {
  Trophy,
  Play,
  Flame,
  Clock,
  Sparkles,
  AlertCircle,
  Zap,
  Award,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { VirtualBetHistoryItem } from '../../types';

interface VirtualDogGameProps {
  userBalance: number;
  onUpdateBalance: (delta: number, reason: string) => Promise<boolean>;
  onRecordBet: (item: VirtualBetHistoryItem) => void;
  onOpenReload: () => void;
  soundEnabled: boolean;
}

interface Dog {
  number: number;
  name: string;
  trap: number;
  odds: number;
  color: string;
  boxColor: string;
  form: string;
  speed: string;
  coat: string;
}

const DOGS: Dog[] = [
  { number: 1, name: 'Lightning Bolt ⚡', trap: 1, odds: 2.80, color: '#ef4444', boxColor: '#dc2626', form: '1-1-2-1', speed: '68 km/h', coat: 'Brindle' },
  { number: 2, name: 'Silver Phantom 🐺', trap: 2, odds: 3.50, color: '#3b82f6', boxColor: '#2563eb', form: '2-1-3-1', speed: '67 km/h', coat: 'Blue/White' },
  { number: 3, name: 'Golden Bullet 🐾', trap: 3, odds: 4.60, color: '#ffffff', boxColor: '#e2e8f0', form: '3-2-1-2', speed: '66 km/h', coat: 'White' },
  { number: 4, name: 'Black Shadow 🌪️', trap: 4, odds: 6.00, color: '#000000', boxColor: '#18181b', form: '1-4-2-3', speed: '65 km/h', coat: 'Black' },
  { number: 5, name: 'Apex Storm 💥', trap: 5, odds: 9.00, color: '#f59e0b', boxColor: '#d97706', form: '4-3-1-4', speed: '64 km/h', coat: 'Fawn' },
  { number: 6, name: 'Rocket Rover 🚀', trap: 6, odds: 14.00, color: '#10b981', boxColor: '#059669', form: '5-2-4-1', speed: '63 km/h', coat: 'Striped' },
];

export const VirtualDogGame: React.FC<VirtualDogGameProps> = ({
  userBalance,
  onUpdateBalance,
  onRecordBet,
  onOpenReload,
  soundEnabled,
}) => {
  const [selectedDogNum, setSelectedDogNum] = useState<number>(1);
  const [stake, setStake] = useState<number>(10);
  const [raceState, setRaceState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [dogProgress, setDogProgress] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [winnerDog, setWinnerDog] = useState<Dog | null>(null);
  const [winPayout, setWinPayout] = useState<number | null>(null);
  const [raceCommentary, setRaceCommentary] = useState<string>('Trap boxes loaded. Hare mechanical arm energized.');

  const activeBetRef = useRef<{ dog: Dog; stake: number } | null>(null);

  const selectedDog = DOGS.find((d) => d.number === selectedDogNum) || DOGS[0];

  const handleStartRace = async () => {
    if (userBalance < stake) {
      if (soundEnabled) soundManager.playCrash();
      return;
    }

    const ok = await onUpdateBalance(-stake, `Virtue Greyhound Derby: #${selectedDog.number} ${selectedDog.name}`);
    if (!ok) return;

    if (soundEnabled) {
      soundManager.playWhistle();
    }

    activeBetRef.current = { dog: selectedDog, stake };
    setRaceState('running');
    setWinnerDog(null);
    setWinPayout(null);
    setRaceCommentary('🔔 THE HARE IS RUNNING! Traps open and greyhounds explode out!');

    const currentPositions = [0, 0, 0, 0, 0, 0];
    setDogProgress([...currentPositions]);

    // Rigorous house-edge calibration: 35% win rate, 65% loss rate
    const userWins = Math.random() < 0.35;
    let targetWinnerDog: Dog;
    if (userWins) {
      targetWinnerDog = selectedDog;
    } else {
      const rivals = DOGS.filter((d) => d.number !== selectedDog.number);
      targetWinnerDog = rivals[Math.floor(Math.random() * rivals.length)];
    }

    const targetWinnerIdx = DOGS.findIndex((d) => d.number === targetWinnerDog.number);

    let elapsed = 0;
    const totalTicks = 13;

    const interval = setInterval(() => {
      elapsed += 1;

      for (let i = 0; i < 6; i++) {
        if (i === targetWinnerIdx) {
          const winnerStep = elapsed > 7 ? 8.6 + Math.random() * 2.5 : 6.8 + Math.random() * 2.0;
          currentPositions[i] = Math.min(100, currentPositions[i] + winnerStep);
        } else {
          const regularStep = elapsed > 8 ? 4.6 + Math.random() * 2.2 : 6.2 + Math.random() * 2.2;
          currentPositions[i] = Math.min(94, currentPositions[i] + regularStep);
        }
      }

      if (elapsed >= totalTicks || currentPositions[targetWinnerIdx] >= 98) {
        currentPositions[targetWinnerIdx] = 100;
        setDogProgress([...currentPositions]);
        clearInterval(interval);
        finishRace(targetWinnerDog);
        return;
      }

      setDogProgress([...currentPositions]);

      if (soundEnabled && elapsed % 3 === 0) {
        soundManager.playSpinTick();
      }

      const leaderIndex = currentPositions.indexOf(Math.max(...currentPositions));
      const leader = DOGS[leaderIndex];
      if (elapsed === 3) {
        setRaceCommentary(`⚡ First bend! Trap #${leader.trap} ${leader.name} cutting the corner tightly!`);
      } else if (elapsed === 6) {
        setRaceCommentary(`🔥 Back straight! The greyhounds are at top sprint speeds chasing the lure!`);
      } else if (elapsed === 10) {
        setRaceCommentary(`💥 HOME TURN! Trap #${targetWinnerDog.trap} ${targetWinnerDog.name} kicks into the lead!`);
      }
    }, 400);
  };

  const finishRace = async (winningDog: Dog) => {
    setRaceState('finished');
    setWinnerDog(winningDog);
    setRaceCommentary(`🏁 PHOTO FINISH! Trap #${winningDog.trap} ${winningDog.name} crosses 1st!`);

    const placed = activeBetRef.current;
    if (!placed) return;

    if (winningDog.number === placed.dog.number) {
      const payout = Number((placed.stake * placed.dog.odds).toFixed(2));
      setWinPayout(payout);
      if (soundEnabled) soundManager.playWinFanfare();
      await onUpdateBalance(payout, `Virtue Greyhound WON: #${placed.dog.number} ${placed.dog.name} @${placed.dog.odds}`);
      onRecordBet({
        id: `bet-${Date.now()}`,
        game: 'Virtue Greyhound 🐕',
        market: 'Trap Winner',
        selection: `Trap ${placed.dog.trap} - ${placed.dog.name}`,
        stake: placed.stake,
        odds: placed.dog.odds,
        payout,
        result: 'won',
        timestamp: new Date(),
      });
    } else {
      setWinPayout(0);
      if (soundEnabled) soundManager.playCrash();
      onRecordBet({
        id: `bet-${Date.now()}`,
        game: 'Virtue Greyhound 🐕',
        market: 'Trap Winner',
        selection: `Trap ${placed.dog.trap} - ${placed.dog.name}`,
        stake: placed.stake,
        odds: placed.dog.odds,
        payout: 0,
        result: 'lost',
        timestamp: new Date(),
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Race Header */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="font-black text-rose-400 uppercase tracking-wider">
            Virtue Greyhound Stadium • 500m Night Derby
          </span>
        </div>
        <span className="text-zinc-400 font-mono text-[11px] bg-black/60 px-2.5 py-1 rounded border border-zinc-800">
          6 Fast Traps • Mechanical Lure
        </span>
      </div>

      {/* Greyhound Sand Track Stage */}
      <div className="rounded-2xl bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border border-rose-500/40 p-3 sm:p-4 shadow-[0_0_30px_rgba(244,63,94,0.15)] relative overflow-hidden">
        {/* Dynamic Moving Background: Stadium Floodlights & Lure Rail */}
        <div className="relative h-10 mb-2 rounded-xl bg-gradient-to-b from-rose-950/70 to-zinc-950 border border-rose-800/50 overflow-hidden flex items-center">
          <div
            className={`flex items-center whitespace-nowrap text-[10px] text-rose-300 font-mono tracking-wider font-bold select-none ${
              raceState === 'running' ? 'animate-track-scenery' : ''
            }`}
            style={{ width: '200%' }}
          >
            <div className="flex items-center gap-8 px-4 shrink-0 w-1/2 justify-around">
              <span>🏟️ STADIUM FLOODLIGHTS</span>
              <span>🐇 MECHANICAL HARE LURE</span>
              <span>🚩 400m BEND</span>
              <span>🐕 FAST SPRINT RAIL</span>
              <span>🚩 200m HOME STRETCH</span>
              <span className="text-yellow-400 font-black">🏁 FINISH BEAM</span>
            </div>
            <div className="flex items-center gap-8 px-4 shrink-0 w-1/2 justify-around">
              <span>🏟️ STADIUM FLOODLIGHTS</span>
              <span>🐇 MECHANICAL HARE LURE</span>
              <span>🚩 400m BEND</span>
              <span>🐕 FAST SPRINT RAIL</span>
              <span>🚩 200m HOME STRETCH</span>
              <span className="text-yellow-400 font-black">🏁 FINISH BEAM</span>
            </div>
          </div>

          {/* Running Lure Hare Line */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-1.5 bg-[repeating-linear-gradient(90deg,#f43f5e,#f43f5e_8px,#fbbf24_8px,#fbbf24_16px)] opacity-70 ${
              raceState === 'running' ? 'animate-turf-moving' : ''
            }`}
          />
        </div>

        {/* Sand Track with 6 Traps */}
        <div className="space-y-2.5 relative">
          {DOGS.map((dog, idx) => {
            const isUserPick = dog.number === selectedDogNum;
            const progress = dogProgress[idx] || 0;
            const isWinner = winnerDog?.number === dog.number;

            return (
              <div
                key={dog.number}
                className={`relative p-2 rounded-xl border transition-all ${
                  isWinner
                    ? 'bg-rose-500/20 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                    : isUserPick
                    ? 'bg-zinc-900/90 border-rose-500/60'
                    : 'bg-zinc-950/80 border-zinc-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-md font-black flex items-center justify-center text-[10px] text-white shadow"
                      style={{ backgroundColor: dog.boxColor }}
                    >
                      T{dog.trap}
                    </span>
                    <strong className="text-white font-bold">{dog.name}</strong>
                    <span className="text-zinc-400 text-[10px] hidden sm:inline">({dog.coat})</span>
                    {isUserPick && (
                      <span className="px-1.5 py-0.2 bg-rose-400 text-black font-black text-[9px] rounded uppercase">
                        YOUR GREYHOUND
                      </span>
                    )}
                    {isWinner && (
                      <span className="px-1.5 py-0.2 bg-yellow-400 text-black font-black text-[9px] rounded uppercase animate-bounce">
                        🏆 1ST PLACE WINNER
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-400">Form: {dog.form}</span>
                    <span className="font-mono font-black text-yellow-400">@{dog.odds.toFixed(2)}</span>
                  </div>
                </div>

                {/* Sand Track Lane with Moving Texture */}
                <div className="relative h-6 bg-amber-950/40 rounded-lg border border-amber-900/50 overflow-hidden flex items-center">
                  <div
                    className={`absolute inset-0 bg-[repeating-linear-gradient(90deg,#78350f,#78350f_10px,#92400e_10px,#92400e_20px)] opacity-40 ${
                      raceState === 'running' ? 'animate-turf-moving' : ''
                    }`}
                  />
                  <div
                    className={`absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_25px,rgba(255,255,255,0.06)_25px,rgba(255,255,255,0.06)_28px)] ${
                      raceState === 'running' ? 'animate-turf-moving' : ''
                    }`}
                  />

                  {/* Finish Line (Checkered White & Black) */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-4 bg-[repeating-conic-gradient(#000_0_90deg,#fff_90deg_180deg)] bg-[length:6px_6px] z-10 opacity-90 shadow-[0_0_12px_rgba(255,255,255,0.6)] border-l border-white/40"
                    title="Finish Line"
                  />

                  {/* Mechanical Hare Running at the very front - Facing Right */}
                  {raceState === 'running' && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-300 ease-linear pointer-events-none text-xs"
                      style={{ left: `calc(${Math.min(95, Math.max(...dogProgress) + 4)}%)` }}
                    >
                      <span className="inline-block transform scale-x-[-1] select-none filter drop-shadow">
                        🐇
                      </span>
                    </div>
                  )}

                  {/* Galloping Greyhound Avatar - Facing Right and Sprinting Forward to Finish Line */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-linear z-10 flex items-center gap-1"
                    style={{ left: `calc(${Math.min(90, progress)}%)` }}
                  >
                    {/* Dust trail trailing BEHIND on the left */}
                    {raceState === 'running' && progress > 5 && progress < 95 && (
                      <span className="text-[10px] text-rose-300 opacity-80 animate-ping select-none">
                        💨
                      </span>
                    )}

                    {/* Trap Number Badge trailing behind the dog */}
                    <span
                      className="text-[9px] font-black px-1 rounded text-white bg-black/80 border shrink-0 shadow-sm"
                      style={{ borderColor: dog.boxColor }}
                    >
                      T{dog.trap}
                    </span>

                    {/* Greyhound Emoji Facing RIGHT towards the finish line */}
                    <span
                      className={`text-lg filter drop-shadow inline-block ${
                        raceState === 'running' ? 'animate-gallop-bounce' : ''
                      }`}
                    >
                      <span className="inline-block transform scale-x-[-1] select-none">
                        🐕
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
          <Clock className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-mono text-rose-300 font-bold truncate">{raceCommentary}</span>
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
                    ? `🎉 TRAP ${winnerDog?.trap} WON! +$${winPayout.toFixed(2)} USD Credited to Balance!`
                    : `Race over. Trap ${winnerDog?.trap} ${winnerDog?.name} won the heat.`}
                </strong>
                <span className="text-[11px] text-zinc-400">
                  Your Pick: Trap {selectedDog.trap} {selectedDog.name} • Stake: ${stake.toFixed(2)} USD
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setRaceState('idle');
                setWinnerDog(null);
                setWinPayout(null);
                setDogProgress([0, 0, 0, 0, 0, 0]);
                setRaceCommentary('Trap gates ready for next heat.');
              }}
              className="px-3 py-1.5 bg-rose-400 hover:bg-rose-300 text-black font-black rounded-lg text-xs transition cursor-pointer"
            >
              Next Dog Race
            </button>
          </div>
        )}
      </div>

      {/* Dog Selection Cards */}
      <div>
        <h4 className="text-xs font-black text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-rose-400" />
          <span>Pick Your Greyhound Trap</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DOGS.map((dog) => {
            const isSelected = dog.number === selectedDogNum;
            return (
              <button
                key={dog.number}
                type="button"
                disabled={raceState === 'running'}
                onClick={() => {
                  setSelectedDogNum(dog.number);
                  if (soundEnabled) soundManager.playSpinTick();
                }}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                } disabled:opacity-50`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="w-5 h-5 rounded text-[10px] font-black flex items-center justify-center text-white"
                    style={{ backgroundColor: dog.boxColor }}
                  >
                    T{dog.trap}
                  </span>
                  <strong className="font-mono text-yellow-400 text-xs">@{dog.odds.toFixed(2)}</strong>
                </div>
                <p className="text-xs font-black text-white truncate">{dog.name}</p>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-0.5">
                  <span>Speed: {dog.speed}</span>
                  <span className="font-mono text-zinc-500">{dog.form}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stake Controller & Race Action */}
      <div className="p-3.5 rounded-2xl bg-zinc-950 border border-yellow-500/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-bold">Selected Greyhound:</span>
            <span className="font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
              Trap {selectedDog.trap} - {selectedDog.name}
            </span>
            <span className="font-mono font-black text-white">@{selectedDog.odds.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Potential Return:</span>
            <span className="font-mono font-black text-emerald-400 text-sm">
              ${(stake * selectedDog.odds).toFixed(2)} USD
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

        {/* Start Button */}
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
            className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-400 hover:to-pink-400 disabled:opacity-50 text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.4)] transition cursor-pointer border border-rose-300"
          >
            {raceState === 'running' ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Greyhounds Sprinting at 68 km/h...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span>
                  Bet & Start Greyhound Derby (${stake.toFixed(2)} USD)
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

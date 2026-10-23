import React, { useState, useRef } from 'react';
import {
  Trophy,
  Play,
  Flame,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Zap,
  Gauge,
  Award,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { VirtualBetHistoryItem } from '../../types';

interface VirtualCarRaceGameProps {
  userBalance: number;
  onUpdateBalance: (delta: number, reason: string) => Promise<boolean>;
  onRecordBet: (item: VirtualBetHistoryItem) => void;
  onOpenReload: () => void;
  soundEnabled: boolean;
}

interface Car {
  number: number;
  name: string;
  driver: string;
  odds: number;
  color: string;
  glowColor: string;
  speed: string;
}

const CARS: Car[] = [
  { number: 1, name: 'Red Bull Nitro RB20', driver: 'M. Verstappen', odds: 2.90, color: '#001a30', glowColor: '#00e5ff', speed: '342 km/h' },
  { number: 2, name: 'Ferrari Scuderia SF-24', driver: 'C. Leclerc', odds: 3.60, color: '#e60000', glowColor: '#ff2a2a', speed: '338 km/h' },
  { number: 3, name: 'Mercedes Silver Arrow W15', driver: 'L. Hamilton', odds: 4.80, color: '#00a19c', glowColor: '#00ffc4', speed: '335 km/h' },
  { number: 4, name: 'McLaren Papaya Speed MCL38', driver: 'L. Norris', odds: 6.50, color: '#ff8000', glowColor: '#ffaa33', speed: '332 km/h' },
  { number: 5, name: 'Aston Martin Valkyrie AMR24', driver: 'F. Alonso', odds: 10.00, color: '#00594f', glowColor: '#00df8f', speed: '328 km/h' },
  { number: 6, name: 'Porsche 911 GT3 Nitro', driver: 'K. Estre', odds: 15.00, color: '#990000', glowColor: '#ffcc00', speed: '325 km/h' },
];

export const VirtualCarRaceGame: React.FC<VirtualCarRaceGameProps> = ({
  userBalance,
  onUpdateBalance,
  onRecordBet,
  onOpenReload,
  soundEnabled,
}) => {
  const [selectedCarNum, setSelectedCarNum] = useState<number>(1);
  const [stake, setStake] = useState<number>(10);
  const [raceState, setRaceState] = useState<'idle' | 'racing' | 'finished'>('idle');
  const [carProgress, setCarProgress] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [winnerCar, setWinnerCar] = useState<Car | null>(null);
  const [winPayout, setWinPayout] = useState<number | null>(null);
  const [telemetryText, setTelemetryText] = useState<string>('Grid formation complete. Green flag ready.');

  const activeBetRef = useRef<{ car: Car; stake: number } | null>(null);

  const selectedCar = CARS.find((c) => c.number === selectedCarNum) || CARS[0];

  const handleStartRace = async () => {
    if (userBalance < stake) {
      if (soundEnabled) soundManager.playCrash();
      return;
    }

    const ok = await onUpdateBalance(-stake, `Virtue Car Race: #${selectedCar.number} ${selectedCar.name}`);
    if (!ok) return;

    if (soundEnabled) {
      soundManager.playEngineRev();
    }

    activeBetRef.current = { car: selectedCar, stake };
    setRaceState('racing');
    setWinnerCar(null);
    setWinPayout(null);
    setTelemetryText('🚥 LIGHTS OUT AND AWAY WE GO! Supercars hit 300+ km/h into Turn 1!');

    const currentPositions = [0, 0, 0, 0, 0, 0];
    setCarProgress([...currentPositions]);

    // Rigorous house-edge calibration: 35% win rate, 65% loss rate
    const userWins = Math.random() < 0.35;
    let targetWinnerCar: Car;
    if (userWins) {
      targetWinnerCar = selectedCar;
    } else {
      const rivals = CARS.filter((c) => c.number !== selectedCar.number);
      targetWinnerCar = rivals[Math.floor(Math.random() * rivals.length)];
    }

    const targetWinnerIdx = CARS.findIndex((c) => c.number === targetWinnerCar.number);

    let tick = 0;
    const totalTicks = 14;

    const interval = setInterval(() => {
      tick += 1;

      // Update positions with dynamic DRS surges and telemetry speed
      for (let i = 0; i < 6; i++) {
        if (i === targetWinnerIdx) {
          // Winner surges with maximum DRS boost in final straight
          const winnerStep = tick > 8 ? 8.4 + Math.random() * 2.6 : 6.6 + Math.random() * 2.0;
          currentPositions[i] = Math.min(100, currentPositions[i] + winnerStep);
        } else {
          // Other cars stay tightly competitive but finish behind
          const regularStep = tick > 9 ? 4.5 + Math.random() * 2.2 : 6.1 + Math.random() * 2.2;
          currentPositions[i] = Math.min(94, currentPositions[i] + regularStep);
        }
      }

      // Check if finished
      if (tick >= totalTicks || currentPositions[targetWinnerIdx] >= 98) {
        currentPositions[targetWinnerIdx] = 100;
        setCarProgress([...currentPositions]);
        clearInterval(interval);
        finishRace(targetWinnerCar);
        return;
      }

      setCarProgress([...currentPositions]);

      if (soundEnabled && tick % 2 === 0) {
        soundManager.playEngineRev();
      }

      const leaderIdx = currentPositions.indexOf(Math.max(...currentPositions));
      const leader = CARS[leaderIdx];
      if (tick === 3) {
        setTelemetryText(`💨 DRS Zone 1 Active! #${leader.number} ${leader.name} hits 338 km/h on the pit straight!`);
      } else if (tick === 7) {
        setTelemetryText(`🔥 Sector 2 Hairpin! Pack roaring wheel-to-wheel through the Monaco chicane!`);
      } else if (tick === 11) {
        setTelemetryText(`🏁 FINAL CORNER SPRINT! #${targetWinnerCar.number} ${targetWinnerCar.name} unleashes full KERS boost!`);
      }
    }, 400);
  };

  const finishRace = async (winningCar: Car) => {
    setRaceState('finished');
    setWinnerCar(winningCar);
    setTelemetryText(`🏁 CHECKERED FLAG! #${winningCar.number} ${winningCar.name} takes 1st place in the Grand Prix!`);

    const placed = activeBetRef.current;
    if (!placed) return;

    if (winningCar.number === placed.car.number) {
      const payout = Number((placed.stake * placed.car.odds).toFixed(2));
      setWinPayout(payout);
      if (soundEnabled) soundManager.playWinFanfare();
      await onUpdateBalance(payout, `Virtue Car Race WON: #${placed.car.number} ${placed.car.name} @${placed.car.odds}`);
      onRecordBet({
        id: `bet-${Date.now()}`,
        game: 'Virtue Car Race 🏎',
        market: 'Winner',
        selection: `#${placed.car.number} ${placed.car.name}`,
        stake: placed.stake,
        odds: placed.car.odds,
        payout,
        result: 'won',
        timestamp: new Date(),
      });
    } else {
      setWinPayout(0);
      if (soundEnabled) soundManager.playCrash();
      onRecordBet({
        id: `bet-${Date.now()}`,
        game: 'Virtue Car Race 🏎',
        market: 'Winner',
        selection: `#${placed.car.number} ${placed.car.name}`,
        stake: placed.stake,
        odds: placed.car.odds,
        payout: 0,
        result: 'lost',
        timestamp: new Date(),
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Race Grand Prix Header */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-black text-cyan-400 uppercase tracking-wider">
            Virtue Grand Prix • Circuit de Monaco Night Race
          </span>
        </div>
        <span className="text-zinc-400 font-mono text-[11px] bg-black/60 px-2.5 py-1 rounded border border-zinc-800">
          6 Hypercars • Turbocharged DRS
        </span>
      </div>

      {/* Cyber Neon Asphalt Racetrack */}
      <div className="rounded-2xl bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border border-cyan-500/40 p-3 sm:p-4 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
        {/* Dynamic Moving Background: Monaco Pit Wall & Neon Skyline Strip */}
        <div className="relative h-10 mb-2 rounded-xl bg-gradient-to-b from-cyan-950/80 to-zinc-950 border border-cyan-800/60 overflow-hidden flex items-center">
          {/* Continuous scrolling pit wall and telemetry signs */}
          <div
            className={`flex items-center whitespace-nowrap text-[10px] text-cyan-300 font-mono tracking-wider font-bold select-none ${
              raceState === 'racing' ? 'animate-track-scenery' : ''
            }`}
            style={{ width: '200%' }}
          >
            <div className="flex items-center gap-8 px-4 shrink-0 w-1/2 justify-around">
              <span>🏎️ MONACO PIT STRAIGHT</span>
              <span>⚡ SPEED TRAP 342 KM/H</span>
              <span>🟢 DRS ZONE 1 ACTIVE</span>
              <span>🏁 SECTOR 2 CHICANE</span>
              <span>⛽ PIT LANE GARAGES</span>
              <span>🔥 MONACO HARBOR TUNNEL</span>
              <span className="text-yellow-400 font-black">🏁 CHECKERED ARCH</span>
            </div>
            <div className="flex items-center gap-8 px-4 shrink-0 w-1/2 justify-around">
              <span>🏎️ MONACO PIT STRAIGHT</span>
              <span>⚡ SPEED TRAP 342 KM/H</span>
              <span>🟢 DRS ZONE 1 ACTIVE</span>
              <span>🏁 SECTOR 2 CHICANE</span>
              <span>⛽ PIT LANE GARAGES</span>
              <span>🔥 MONACO HARBOR TUNNEL</span>
              <span className="text-yellow-400 font-black">🏁 CHECKERED ARCH</span>
            </div>
          </div>

          {/* Red and White Grand Prix Kerb Rumble Strip */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-1.5 bg-[repeating-linear-gradient(90deg,#ef4444,#ef4444_8px,#ffffff_8px,#ffffff_16px)] opacity-70 ${
              raceState === 'racing' ? 'animate-kerb-moving' : ''
            }`}
          />
        </div>

        <div className="space-y-2.5 relative">
          {CARS.map((car, idx) => {
            const isUserPick = car.number === selectedCarNum;
            const progress = carProgress[idx] || 0;
            const isWinner = winnerCar?.number === car.number;

            return (
              <div
                key={car.number}
                className={`relative p-2 rounded-xl border transition-all ${
                  isWinner
                    ? 'bg-cyan-500/20 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : isUserPick
                    ? 'bg-zinc-900/90 border-cyan-500/60'
                    : 'bg-zinc-950/80 border-zinc-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-md font-black flex items-center justify-center text-[10px] text-white shadow"
                      style={{ backgroundColor: car.color, border: `1px solid ${car.glowColor}` }}
                    >
                      {car.number}
                    </span>
                    <strong className="text-white font-bold">{car.name}</strong>
                    <span className="text-zinc-400 text-[10px] hidden sm:inline">({car.driver})</span>
                    {isUserPick && (
                      <span className="px-1.5 py-0.2 bg-cyan-400 text-black font-black text-[9px] rounded uppercase">
                        YOUR RACER
                      </span>
                    )}
                    {isWinner && (
                      <span className="px-1.5 py-0.2 bg-yellow-400 text-black font-black text-[9px] rounded uppercase animate-bounce">
                        🏆 GRAND PRIX WINNER
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-300">{car.speed}</span>
                    <span className="font-mono font-black text-yellow-400">@{car.odds.toFixed(2)}</span>
                  </div>
                </div>

                {/* Asphalt Track Lane with Fast Moving Road Lines & Kerbs */}
                <div className="relative h-7 bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden flex items-center">
                  {/* High Speed Moving Asphalt Center Dashes */}
                  <div
                    className={`absolute inset-0 bg-[repeating-linear-gradient(90deg,#06b6d4,#06b6d4_15px,transparent_15px,transparent_35px)] opacity-35 ${
                      raceState === 'racing' ? 'animate-road-moving' : ''
                    }`}
                  />

                  {/* Secondary Fast Road Grit Texture */}
                  <div
                    className={`absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(255,255,255,0.06)_20px,rgba(255,255,255,0.06)_22px)] ${
                      raceState === 'racing' ? 'animate-road-moving' : ''
                    }`}
                  />

                  {/* Top & Bottom Red/White Rumble Kerbs */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(90deg,#ef4444,#ef4444_6px,#ffffff_6px,#ffffff_12px)] opacity-60 ${
                      raceState === 'racing' ? 'animate-kerb-moving' : ''
                    }`}
                  />
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(90deg,#ef4444,#ef4444_6px,#ffffff_6px,#ffffff_12px)] opacity-60 ${
                      raceState === 'racing' ? 'animate-kerb-moving' : ''
                    }`}
                  />

                  {/* Finish Line Checkered Pattern */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-4 bg-[repeating-conic-gradient(#000_0_90deg,#fff_90deg_180deg)] bg-[length:6px_6px] z-10 opacity-90 shadow-[0_0_12px_rgba(255,255,255,0.6)] border-l border-white/40"
                    title="Finish Line"
                  />

                  {/* Hypercar Icon - Facing Right and Racing Forward to Finish Line */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-linear z-10 flex items-center gap-1"
                    style={{ left: `calc(${Math.min(90, progress)}%)` }}
                  >
                    {/* Nitro & Exhaust Flame trailing BEHIND on the left */}
                    {raceState === 'racing' && progress > 5 && progress < 95 && (
                      <span className="text-xs text-cyan-400 font-bold -mr-0.5 animate-pulse select-none">
                        🔥💨
                      </span>
                    )}

                    {/* Car Racing Number Badge */}
                    <span
                      className="text-[9px] font-black px-1 rounded text-white bg-black/90 border shrink-0 shadow-sm"
                      style={{ borderColor: car.glowColor }}
                    >
                      #{car.number}
                    </span>

                    {/* Hypercar Icon Facing RIGHT towards the finish line */}
                    <span
                      className={`text-xl filter drop-shadow inline-block ${
                        raceState === 'racing' ? 'animate-car-shake' : ''
                      }`}
                    >
                      <span className="inline-block transform scale-x-[-1] select-none">
                        🏎️
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Telemetry Ticker */}
        <div className="mt-3 p-2.5 rounded-lg bg-black/70 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
          <Gauge className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-mono text-cyan-300 font-bold truncate">{telemetryText}</span>
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
                    ? `🎉 GRAND PRIX PODIUM! +$${winPayout.toFixed(2)} USD Payout Credited!`
                    : `Race finished. #${winnerCar?.number} ${winnerCar?.name} took P1.`}
                </strong>
                <span className="text-[11px] text-zinc-400">
                  Your Pick: #{selectedCar.number} {selectedCar.name} • Stake: ${stake.toFixed(2)} USD
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setRaceState('idle');
                setWinnerCar(null);
                setWinPayout(null);
                setCarProgress([0, 0, 0, 0, 0, 0]);
                setTelemetryText('Ready for next Grand Prix heat.');
              }}
              className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black rounded-lg text-xs transition cursor-pointer"
            >
              Next GP Race
            </button>
          </div>
        )}
      </div>

      {/* Car Selection Cards */}
      <div>
        <h4 className="text-xs font-black text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>Select Your Hypercar for P1</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CARS.map((car) => {
            const isSelected = car.number === selectedCarNum;
            return (
              <button
                key={car.number}
                type="button"
                disabled={raceState === 'racing'}
                onClick={() => {
                  setSelectedCarNum(car.number);
                  if (soundEnabled) soundManager.playSpinTick();
                }}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                } disabled:opacity-50`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded text-[9px] font-black flex items-center justify-center text-white"
                      style={{ backgroundColor: car.color, border: `1px solid ${car.glowColor}` }}
                    >
                      {car.number}
                    </span>
                    <span className="text-[10px] text-zinc-400">{car.speed}</span>
                  </div>
                  <strong className="font-mono text-yellow-400 text-xs">@{car.odds.toFixed(2)}</strong>
                </div>
                <p className="text-xs font-black text-white truncate">{car.name}</p>
                <p className="text-[10px] text-zinc-400 truncate">Driver: {car.driver}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stake Controller & Race Action */}
      <div className="p-3.5 rounded-2xl bg-zinc-950 border border-yellow-500/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-bold">Selected Car:</span>
            <span className="font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
              #{selectedCar.number} {selectedCar.name}
            </span>
            <span className="font-mono font-black text-white">@{selectedCar.odds.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Potential Return:</span>
            <span className="font-mono font-black text-emerald-400 text-sm">
              ${(stake * selectedCar.odds).toFixed(2)} USD
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
              disabled={raceState === 'racing'}
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
            disabled={raceState === 'racing' || userBalance < 1}
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
            disabled={raceState === 'racing'}
            onClick={handleStartRace}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition cursor-pointer border border-cyan-300"
          >
            {raceState === 'racing' ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Supercars Racing at 340 km/h...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span>
                  Bet & Start Virtue Car Race (${stake.toFixed(2)} USD)
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

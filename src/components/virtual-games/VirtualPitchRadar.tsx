import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Activity, Clock, Flame, ChevronRight } from 'lucide-react';
import { FootballFixture, BetSlipItem } from './VirtualFootballGame';

interface VirtualPitchRadarProps {
  fixture: FootballFixture;
  simMinute: number;
  homeScore: number;
  awayScore: number;
  phase: 'betting' | 'in_play' | 'results';
  countdown: number;
  eventLogs: string[];
  activeBetItems: BetSlipItem[];
  allFixtures: FootballFixture[];
  onSelectFixture: (f: FootballFixture) => void;
}

export const VirtualPitchRadar: React.FC<VirtualPitchRadarProps> = ({
  fixture,
  simMinute,
  homeScore,
  awayScore,
  phase,
  countdown,
  eventLogs,
  activeBetItems,
  allFixtures,
  onSelectFixture,
}) => {
  // Ball position state for visual pitch action
  const [ballState, setBallState] = useState<{ x: number; y: number; action: string }>({
    x: 50,
    y: 50,
    action: 'Kick-off',
  });

  // Dynamic radar action simulator during in_play
  useEffect(() => {
    if (phase !== 'in_play') {
      setBallState({ x: 50, y: 50, action: phase === 'betting' ? 'Warm up' : 'Full Time' });
      return;
    }

    const actions = [
      { x: 50, y: 50, text: 'Midfield Play' },
      { x: 75, y: 35, text: `${fixture.homeAbbr} Attack` },
      { x: 88, y: 48, text: 'Dangerous Cross!' },
      { x: 92, y: 50, text: 'Shot on Target!' },
      { x: 25, y: 65, text: `${fixture.awayAbbr} Counter-Attack` },
      { x: 12, y: 52, text: 'Defensive Clearance!' },
      { x: 78, y: 20, text: 'Corner Kick' },
      { x: 55, y: 45, text: 'Possession Contest' },
    ];

    const idx = Math.floor((simMinute / 3) % actions.length);
    const chosen = actions[idx] || actions[0];
    setBallState({ x: chosen.x, y: chosen.y, action: chosen.text });
  }, [simMinute, phase, fixture.homeAbbr, fixture.awayAbbr]);

  // Check if user has an active bet on this fixture
  const userFixtureBet = activeBetItems.find((b) => b.fixtureId === fixture.id);

  // Status of user bet
  const getBetStatus = () => {
    if (!userFixtureBet) return null;
    if (userFixtureBet.marketName === '1X2') {
      if (userFixtureBet.selectionKey === 'home') {
        return homeScore > awayScore ? 'WINNING' : homeScore === awayScore ? 'DRAWING' : 'LOSING';
      }
      if (userFixtureBet.selectionKey === 'draw') {
        return homeScore === awayScore ? 'WINNING' : 'LOSING';
      }
      if (userFixtureBet.selectionKey === 'away') {
        return awayScore > homeScore ? 'WINNING' : awayScore === homeScore ? 'DRAWING' : 'LOSING';
      }
    }
    return 'IN PROGRESS';
  };

  const betStatus = getBetStatus();

  return (
    <div className="bg-gradient-to-b from-[#10141e] to-[#161c2b] border-b border-zinc-800 p-3 relative overflow-hidden">
      {/* Top Banner: SportyBet Match Broadcast Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {phase === 'in_play' ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-red-600 text-white shadow-sm animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              LIVE {simMinute}'
            </span>
          ) : phase === 'betting' ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-600 text-white shadow-sm">
              <Clock className="w-3 h-3" />
              NEXT KICK-OFF IN 00:{countdown < 10 ? `0${countdown}` : countdown}s
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-yellow-500 text-black shadow-sm font-mono">
              <Sparkles className="w-3 h-3" />
              FULL TIME 90'
            </span>
          )}

          <span className="text-[11px] text-zinc-400 font-bold hidden sm:inline">
            Virtual Stadium • {fixture.homeTeam} vs {fixture.awayTeam}
          </span>
        </div>

        {/* Quick Match Switcher Dropdown */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="radar-match-select" className="text-[10px] text-zinc-400 font-bold hidden md:inline">
            View Match:
          </label>
          <select
            id="radar-match-select"
            value={fixture.id}
            onChange={(e) => {
              const found = allFixtures.find((f) => f.id === e.target.value);
              if (found) onSelectFixture(found);
            }}
            className="bg-[#1e2434] text-white border border-zinc-700 text-[11px] font-bold rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-emerald-500 transition"
          >
            {allFixtures.map((f) => (
              <option key={f.id} value={f.id}>
                {f.homeAbbr} vs {f.awayAbbr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Pitch & Scoreboard Container */}
      <div className="relative rounded-xl overflow-hidden border border-emerald-500/20 shadow-xl bg-[#0d1e16]">
        {/* Pitch Graphic Background */}
        <div className="h-32 sm:h-36 w-full relative bg-gradient-to-r from-[#0d2a1c] via-[#0f3623] to-[#0d2a1c] overflow-hidden">
          {/* Pitch lines */}
          <div className="absolute inset-2 border border-white/20 rounded-sm pointer-events-none" />
          {/* Center line */}
          <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-px bg-white/20 pointer-events-none" />
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40 pointer-events-none" />

          {/* Left Penalty Box (Home) */}
          <div className="absolute top-6 bottom-6 left-2 w-12 border-r border-t border-b border-white/20 pointer-events-none" />
          {/* Right Penalty Box (Away) */}
          <div className="absolute top-6 bottom-6 right-2 w-12 border-l border-t border-b border-white/20 pointer-events-none" />

          {/* Animated Football on Pitch during live */}
          <div
            className="absolute transition-all duration-700 ease-out z-20"
            style={{
              left: `${Math.min(Math.max(ballState.x, 8), 92)}%`,
              top: `${Math.min(Math.max(ballState.y, 15), 85)}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative">
              <span className="w-4 h-4 rounded-full bg-white border border-black shadow-lg flex items-center justify-center text-[9px] animate-bounce">
                ⚽
              </span>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/50 rounded-full blur-[1px]" />
            </div>
          </div>

          {/* Action Callout pill on pitch */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 bg-black/75 backdrop-blur-xs border border-zinc-700/80 px-3 py-1 rounded-full text-[10px] font-black text-emerald-300 flex items-center gap-1.5 shadow-lg">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>{phase === 'in_play' ? ballState.action : phase === 'betting' ? 'Countdown to Kick-off' : 'Match Final'}</span>
          </div>
        </div>

        {/* Floating Top Scoreboard HUD */}
        <div className="absolute top-2 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
          {/* Home Team */}
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-700/80">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow"
              style={{ backgroundColor: fixture.homeBg, color: fixture.homeColor }}
            >
              {fixture.homeAbbr.substring(0, 2)}
            </span>
            <div>
              <span className="text-xs font-black text-white block">{fixture.homeAbbr}</span>
              <span className="text-[9px] text-amber-400">{'★'.repeat(fixture.homeStars)}</span>
            </div>
          </div>

          {/* Central Live Score Display */}
          <div className="bg-black/90 backdrop-blur-md px-4 py-1 rounded-xl border border-zinc-700/80 text-center shadow-2xl">
            <div className="flex items-center gap-2 text-xl font-mono font-black text-white tracking-widest">
              <span className={homeScore > awayScore ? 'text-emerald-400' : 'text-white'}>{homeScore}</span>
              <span className="text-zinc-500 text-sm">:</span>
              <span className={awayScore > homeScore ? 'text-emerald-400' : 'text-white'}>{awayScore}</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-zinc-400 block -mt-0.5">
              {phase === 'in_play' ? `${simMinute}'` : phase === 'betting' ? 'VS' : 'FT'}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-700/80">
            <div className="text-right">
              <span className="text-xs font-black text-white block">{fixture.awayAbbr}</span>
              <span className="text-[9px] text-amber-400">{'★'.repeat(fixture.awayStars)}</span>
            </div>
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow"
              style={{ backgroundColor: fixture.awayBg, color: fixture.awayColor }}
            >
              {fixture.awayAbbr.substring(0, 2)}
            </span>
          </div>
        </div>
      </div>

      {/* User Active Bet Alert Pill on Radar */}
      {userFixtureBet && (
        <div className="mt-2 p-2 rounded-xl bg-[#1a2333] border border-emerald-500/40 flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-yellow-400" />
            <div>
              <span className="text-white font-bold">Your Selection: </span>
              <span className="text-emerald-300 font-bold">{userFixtureBet.selectionLabel} (@{userFixtureBet.odds.toFixed(2)})</span>
            </div>
          </div>

          <span
            className={`px-2 py-0.5 rounded-md font-mono font-black text-[10px] ${
              betStatus === 'WINNING'
                ? 'bg-emerald-500 text-black animate-pulse'
                : betStatus === 'DRAWING'
                ? 'bg-amber-500 text-black'
                : 'bg-red-500/80 text-white'
            }`}
          >
            {betStatus}
          </span>
        </div>
      )}

      {/* Live Event Ticker (Most recent match highlight) */}
      {eventLogs.length > 0 && phase === 'in_play' && (
        <div className="mt-2 text-[11px] font-mono text-zinc-300 bg-black/50 px-2.5 py-1 rounded-lg border border-zinc-800 flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="truncate">{eventLogs[0]}</span>
        </div>
      )}
    </div>
  );
};

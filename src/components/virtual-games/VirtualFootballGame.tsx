import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Info,
  LineChart,
  SlidersHorizontal,
  X,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Flame,
  AlertCircle,
  Activity,
  Check,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { VirtualBetHistoryItem } from '../../types';
import {
  generateAllLeaguesFixtures,
  LEAGUE_METADATA,
} from './footballData';
import { LeagueStandingsModal } from './LeagueStandingsModal';
import { VirtualPitchRadar } from './VirtualPitchRadar';

interface VirtualFootballGameProps {
  userBalance: number;
  onUpdateBalance: (delta: number, reason: string) => Promise<boolean>;
  onRecordBet: (item: VirtualBetHistoryItem) => void;
  onOpenReload: () => void;
  soundEnabled: boolean;
}

export type LeagueKey = 'england' | 'spain' | 'germany' | 'france' | 'italy';

export interface FootballFixture {
  id: string;
  homeTeam: string;
  homeAbbr: string;
  homeStars: number;
  homeColor: string;
  homeBg: string;
  awayTeam: string;
  awayAbbr: string;
  awayStars: number;
  awayColor: string;
  awayBg: string;
  league: LeagueKey;
  moreCount: number;
  odds1X2: { home: number; draw: number; away: number };
  odds1UP: { home: number; draw: number; away: number };
  odds2UP: { home: number; draw: number; away: number };
  overUnder: {
    line: number;
    over: number;
    under: number;
  }[];
  btts: { yes: number; no: number };
}

export interface BetSlipItem {
  id: string;
  fixtureId: string;
  matchName: string;
  marketName: string;
  selectionKey: string;
  selectionLabel: string;
  odds: number;
}

export interface ActiveRoundTicket {
  id: string;
  roundNumber: number;
  items: BetSlipItem[];
  stake: number;
  totalOdds: number;
  potentialReturn: number;
  placedAt: Date;
}

export const VirtualFootballGame: React.FC<VirtualFootballGameProps> = ({
  userBalance,
  onUpdateBalance,
  onRecordBet,
  onOpenReload,
  soundEnabled,
}) => {
  const [activeLeague, setActiveLeague] = useState<LeagueKey>('england');
  const [activeMarketFilter, setActiveMarketFilter] = useState<'1X2' | '1X2 - 1UP' | '1X2 - 2UP'>('1X2');
  const [betBuilderActive, setBetBuilderActive] = useState<boolean>(false);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [isStandingsOpen, setIsStandingsOpen] = useState<boolean>(false);
  const [fixtures, setFixtures] = useState<FootballFixture[]>(() => generateAllLeaguesFixtures(1));

  // Game Lifecycle State (SportyBet Engine: betting -> in_play -> results -> next round)
  const [phase, setPhase] = useState<'betting' | 'in_play' | 'results'>('betting');
  const [countdown, setCountdown] = useState<number>(30); // 30s countdown for betting & in_play
  const [simMinute, setSimMinute] = useState<number>(0); // In-match minute 0' -> 90'
  const [liveScores, setLiveScores] = useState<Record<string, { home: number; away: number }>>({});
  const [eventLogs, setEventLogs] = useState<string[]>([]);
  const [timeoutNotice, setTimeoutNotice] = useState<string | null>(null);

  // Target precalculated outcomes for current in-play round
  const targetOutcomesRef = useRef<Record<string, { home: number; away: number }>>({});

  // Active Placed Ticket for the upcoming/current round
  const [activeTicket, setActiveTicket] = useState<ActiveRoundTicket | null>(null);
  const [lastRoundOutcome, setLastRoundOutcome] = useState<{
    won: boolean;
    payout: number;
    ticket: ActiveRoundTicket;
  } | null>(null);

  // Detail Market View (Screenshot 2)
  const [detailFixture, setDetailFixture] = useState<FootballFixture | null>(null);
  const [detailMarketTab, setDetailMarketTab] = useState<'all' | 'main' | 'goals' | 'half'>('all');
  const [isMatchDropdownOpen, setIsMatchDropdownOpen] = useState<boolean>(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    '1X2-2UP': true,
  });

  // Betslip Drawer State
  const [betslip, setBetslip] = useState<BetSlipItem[]>([]);
  const [isBetslipOpen, setIsBetslipOpen] = useState<boolean>(false);
  const [stake, setStake] = useState<number>(10);

  // Selected fixture to watch in Virtual Pitch Radar
  const [radarFixture, setRadarFixture] = useState<FootballFixture | null>(() => {
    const englandMatches = fixtures.filter((f) => f.league === 'england');
    return englandMatches[0] || fixtures[0] || null;
  });

  // Keep radar fixture updated if fixtures change
  useEffect(() => {
    if (!radarFixture || !fixtures.some((f) => f.id === radarFixture.id)) {
      const match = fixtures.find((f) => f.league === activeLeague) || fixtures[0];
      if (match) setRadarFixture(match);
    }
  }, [fixtures, activeLeague, radarFixture]);

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectOdds = (
    fixture: FootballFixture,
    marketName: string,
    selectionKey: string,
    selectionLabel: string,
    odds: number
  ) => {
    // If betting is closed for current round, show friendly alert
    if (phase !== 'betting') {
      setTimeoutNotice('Matchday in progress! You can prepare selections for the upcoming round.');
      setTimeout(() => setTimeoutNotice(null), 3500);
    }

    if (soundEnabled) soundManager.playSpinTick();

    setBetslip((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.fixtureId === fixture.id && item.marketName === marketName && item.selectionKey === selectionKey
      );

      if (existingIdx >= 0) {
        return prev.filter((_, idx) => idx !== existingIdx);
      } else {
        const filtered = prev.filter(
          (item) => !(item.fixtureId === fixture.id && item.marketName === marketName)
        );
        const newItem: BetSlipItem = {
          id: `${fixture.id}-${marketName}-${selectionKey}-${Date.now()}`,
          fixtureId: fixture.id,
          matchName: `${fixture.homeAbbr} vs ${fixture.awayAbbr}`,
          marketName,
          selectionKey,
          selectionLabel,
          odds,
        };
        return [...filtered, newItem];
      }
    });
  };

  const isOddsSelected = (fixtureId: string, marketName: string, selectionKey: string) => {
    return betslip.some(
      (b) => b.fixtureId === fixtureId && b.marketName === marketName && b.selectionKey === selectionKey
    );
  };

  const totalOdds = betslip.reduce((acc, curr) => acc * curr.odds, 1);
  const potentialReturn = (stake * totalOdds).toFixed(2);

  // Place Bet during the 30-second Betting Countdown window
  const handleConfirmAndPlaceBet = async () => {
    if (phase !== 'betting') {
      setTimeoutNotice('Betting is closed for this round. Please wait for the next game!');
      setTimeout(() => setTimeoutNotice(null), 4000);
      return;
    }

    if (betslip.length === 0) return;
    if (userBalance < stake) {
      if (soundEnabled) soundManager.playCrash();
      return;
    }

    const ok = await onUpdateBalance(-stake, `Virtue Football Bet (Round #${roundNumber}): ${betslip.length} picks`);
    if (!ok) return;

    if (soundEnabled) soundManager.playCoin();

    const newTicket: ActiveRoundTicket = {
      id: `ticket-${roundNumber}-${Date.now()}`,
      roundNumber,
      items: [...betslip],
      stake,
      totalOdds,
      potentialReturn: Number(potentialReturn),
      placedAt: new Date(),
    };

    setActiveTicket(newTicket);
    setIsBetslipOpen(false);

    // If user bet on a specific match, focus radar on that match
    const betFixture = fixtures.find((f) => f.id === betslip[0]?.fixtureId);
    if (betFixture) {
      setRadarFixture(betFixture);
      setActiveLeague(betFixture.league);
    }
  };

  // Start In-Play Match Simulation (lasts 30 seconds!)
  const startMatchPlay = useCallback(() => {
    setPhase('in_play');
    setCountdown(30); // Exactly 30 seconds of play
    setSimMinute(0);

    if (soundEnabled) soundManager.playWhistle();

    // Initialize all stadium scores to 0-0
    const initialScores: Record<string, { home: number; away: number }> = {};
    fixtures.forEach((f) => {
      initialScores[f.id] = { home: 0, away: 0 };
    });
    setLiveScores(initialScores);

    // Determine target outcomes:
    // If user has an active ticket, ~36% calibrated win rate
    const userWins = Math.random() < 0.36;
    const targets: Record<string, { home: number; away: number }> = {};

    fixtures.forEach((f) => {
      const matchBets = activeTicket ? activeTicket.items.filter((b) => b.fixtureId === f.id) : [];
      if (matchBets.length > 0) {
        const bet = matchBets[0];
        if (userWins) {
          if (bet.selectionKey === 'home') {
            targets[f.id] = { home: Math.floor(Math.random() * 2) + 1, away: 0 };
          } else if (bet.selectionKey === 'away') {
            targets[f.id] = { home: 0, away: Math.floor(Math.random() * 2) + 1 };
          } else if (bet.selectionKey === 'draw') {
            const drawScore = Math.random() < 0.5 ? 1 : 0;
            targets[f.id] = { home: drawScore, away: drawScore };
          } else if (bet.selectionKey.startsWith('over')) {
            targets[f.id] = { home: 2, away: 1 };
          } else {
            targets[f.id] = { home: 1, away: 0 };
          }
        } else {
          if (bet.selectionKey === 'home') {
            targets[f.id] = { home: 0, away: 1 };
          } else if (bet.selectionKey === 'away') {
            targets[f.id] = { home: 2, away: 0 };
          } else if (bet.selectionKey === 'draw') {
            targets[f.id] = { home: 1, away: 0 };
          } else {
            targets[f.id] = { home: 0, away: 0 };
          }
        }
      } else {
        const standardScores = [
          { home: 1, away: 0 },
          { home: 2, away: 1 },
          { home: 0, away: 0 },
          { home: 1, away: 1 },
          { home: 0, away: 2 },
          { home: 3, away: 1 },
          { home: 2, away: 0 },
        ];
        targets[f.id] = standardScores[Math.floor(Math.random() * standardScores.length)];
      }
    });

    targetOutcomesRef.current = targets;
    setEventLogs(["0' ⚽ Referees whistle: Kick-off across all European stadiums!"]);
  }, [fixtures, activeTicket, soundEnabled]);

  // Settle Round at 90 minutes
  const settleRound = useCallback(
    async (finalScores: Record<string, { home: number; away: number }>) => {
      setPhase('results');
      setCountdown(5); // 5 seconds result banner before automatic next round

      if (soundEnabled) soundManager.playWhistle();

      if (activeTicket) {
        let allWon = true;
        for (const item of activeTicket.items) {
          const score = finalScores[item.fixtureId] || { home: 0, away: 0 };
          if (item.marketName === '1X2' || item.marketName === '1X2 - 1UP' || item.marketName === '1X2 - 2UP') {
            if (item.selectionKey === 'home' && score.home <= score.away) allWon = false;
            if (item.selectionKey === 'draw' && score.home !== score.away) allWon = false;
            if (item.selectionKey === 'away' && score.away <= score.home) allWon = false;
          } else if (item.marketName.startsWith('O/U')) {
            const total = score.home + score.away;
            const line = parseFloat(item.marketName.split(' ')[1] || '2.5');
            if (item.selectionKey.startsWith('over') && total <= line) allWon = false;
            if (item.selectionKey.startsWith('under') && total >= line) allWon = false;
          }
        }

        if (allWon) {
          const payout = Number((activeTicket.stake * activeTicket.totalOdds).toFixed(2));
          if (soundEnabled) soundManager.playWinFanfare();
          await onUpdateBalance(
            payout,
            `Virtue Football WON (Rd #${activeTicket.roundNumber}): @${activeTicket.totalOdds.toFixed(2)}`
          );
          onRecordBet({
            id: `bet-${Date.now()}`,
            game: 'Virtue Football',
            market: 'Instant Football Multi',
            selection: activeTicket.items.map((i) => `${i.matchName} (${i.selectionLabel})`).join(', '),
            stake: activeTicket.stake,
            odds: activeTicket.totalOdds,
            payout,
            result: 'won',
            timestamp: new Date(),
          });
          setLastRoundOutcome({ won: true, payout, ticket: activeTicket });
        } else {
          if (soundEnabled) soundManager.playCrash();
          onRecordBet({
            id: `bet-${Date.now()}`,
            game: 'Virtue Football',
            market: 'Instant Football Multi',
            selection: activeTicket.items.map((i) => `${i.matchName} (${i.selectionLabel})`).join(', '),
            stake: activeTicket.stake,
            odds: activeTicket.totalOdds,
            payout: 0,
            result: 'lost',
            timestamp: new Date(),
          });
          setLastRoundOutcome({ won: false, payout: 0, ticket: activeTicket });
        }
      }
    },
    [activeTicket, soundEnabled, onUpdateBalance, onRecordBet]
  );

  // Advance to Automatic Next Round
  const advanceToNextRound = useCallback(() => {
    const nextRound = roundNumber + 1;
    setRoundNumber(nextRound);

    // Generate brand new randomized fixtures for all 5 leagues
    const freshFixtures = generateAllLeaguesFixtures(nextRound);
    setFixtures(freshFixtures);

    // Reset state for new round
    setPhase('betting');
    setCountdown(30); // 30s betting countdown for the new game
    setSimMinute(0);
    setLiveScores({});
    setEventLogs([]);
    setActiveTicket(null);
    setLastRoundOutcome(null);
    setTimeoutNotice(null);

    // Set radar fixture to first fixture in active league
    const nextRadar = freshFixtures.find((f) => f.league === activeLeague) || freshFixtures[0];
    if (nextRadar) setRadarFixture(nextRadar);
    if (detailFixture) {
      const nextDetail = freshFixtures.find((f) => f.league === activeLeague) || freshFixtures[0];
      setDetailFixture(nextDetail);
    }
  }, [roundNumber, activeLeague, detailFixture]);

  // Master Game Loop Interval (1-second tick)
  useEffect(() => {
    const timer = setInterval(() => {
      if (phase === 'betting') {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Timeout reached! Lock bets and start 30s match play
            startMatchPlay();
            return 30;
          }
          return prev - 1;
        });
      } else if (phase === 'in_play') {
        setCountdown((prev) => {
          const nextSec = prev - 1;
          // In 30 seconds of play, advance 90 match minutes (~3 minutes per second)
          const newMinute = Math.min(90, Math.floor(((30 - nextSec) / 30) * 90));
          setSimMinute(newMinute);

          // Update live scores towards targets
          setLiveScores((currentScores) => {
            const updated = { ...currentScores };
            const targets = targetOutcomesRef.current;

            fixtures.forEach((f) => {
              const target = targets[f.id];
              if (!target) return;
              if (!updated[f.id]) updated[f.id] = { home: 0, away: 0 };
              const score = updated[f.id];

              // Chance of goal during the 30s window
              if (score.home < target.home && Math.random() < 0.22) {
                score.home += 1;
                setEventLogs((prevLogs) => [
                  `${newMinute}' 💥 GOAL! ${f.homeAbbr} strikes! (${score.home}-${score.away})`,
                  ...prevLogs.slice(0, 4),
                ]);
                if (soundEnabled && (radarFixture?.id === f.id || activeTicket?.items.some((b) => b.fixtureId === f.id))) {
                  soundManager.playCoin();
                }
              } else if (score.away < target.away && Math.random() < 0.22) {
                score.away += 1;
                setEventLogs((prevLogs) => [
                  `${newMinute}' 💥 GOAL! ${f.awayAbbr} finds the net! (${score.home}-${score.away})`,
                  ...prevLogs.slice(0, 4),
                ]);
                if (soundEnabled && (radarFixture?.id === f.id || activeTicket?.items.some((b) => b.fixtureId === f.id))) {
                  soundManager.playCoin();
                }
              }
            });

            return updated;
          });

          if (nextSec <= 0 || newMinute >= 90) {
            // 30 seconds completed: 90 minutes finished!
            settleRound(liveScores);
            return 5;
          }
          return nextSec;
        });
      } else if (phase === 'results') {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Automatically advance to the next round!
            advanceToNextRound();
            return 30;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, fixtures, activeTicket, radarFixture, soundEnabled, liveScores, startMatchPlay, settleRound, advanceToNextRound]);

  const filteredFixtures = fixtures.filter((f) => f.league === activeLeague);

  return (
    <div className="rounded-2xl overflow-hidden bg-[#10141e] text-white border border-zinc-800 shadow-2xl relative font-sans select-none">
      {/* 1. SportyBet Red Brand Header */}
      <div className="bg-[#dc2626] px-3.5 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          {detailFixture ? (
            <button
              type="button"
              onClick={() => setDetailFixture(null)}
              className="text-white hover:bg-black/20 p-1 rounded-full cursor-pointer transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={advanceToNextRound}
              disabled={phase === 'in_play'}
              className="text-white hover:bg-black/20 p-1 rounded-full cursor-pointer transition disabled:opacity-40"
              title="Manual Skip / Next Round"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm tracking-tight text-white uppercase">
              Sporty Virtual Football
            </span>
            <span className="bg-black/30 text-[10px] px-2 py-0.5 rounded-full font-black text-white/90">
              RD {roundNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-black text-white/95 bg-black/25 px-2.5 py-0.5 rounded-lg border border-white/15">
            ${userBalance.toFixed(2)} USD
          </span>
          <button
            type="button"
            onClick={() => setIsBetslipOpen(true)}
            className="relative text-white hover:opacity-80 transition cursor-pointer"
            title="Open Betslip"
          >
            <div className="w-7 h-7 bg-[#171b26] border border-white/30 rounded-lg flex flex-col items-center justify-center p-0.5 shadow-inner">
              <span className="w-3.5 h-0.5 bg-white mb-0.5 rounded-full" />
              <span className="w-3.5 h-0.5 bg-white mb-0.5 rounded-full" />
              <span className="w-2.5 h-0.5 bg-white rounded-full" />
            </div>
            {betslip.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                {betslip.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. SportyBet Matchday Countdown & Status Bar */}
      <div className="bg-[#171b26] px-3.5 py-2 border-b border-zinc-800 flex items-center justify-between text-xs">
        {/* Phase Badge */}
        <div className="flex items-center gap-2">
          {phase === 'betting' && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-black text-[#00e676] uppercase tracking-wider text-[11px]">
                Betting Open
              </span>
            </div>
          )}

          {phase === 'in_play' && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-black text-red-400 uppercase tracking-wider text-[11px]">
                Match in Play ({simMinute}')
              </span>
            </div>
          )}

          {phase === 'results' && (
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-black text-yellow-400 uppercase tracking-wider text-[11px]">
                Round {roundNumber} Completed
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Countdown Clock */}
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[11px] text-zinc-400">
            {phase === 'betting' && 'Next Game in:'}
            {phase === 'in_play' && 'Match Ends in:'}
            {phase === 'results' && 'Next Round in:'}
          </span>
          <span
            className={`font-mono font-black text-xs px-2 py-0.5 rounded-md border ${
              countdown <= 5
                ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                : 'bg-black/40 text-emerald-400 border-emerald-500/30'
            }`}
          >
            00:{countdown < 10 ? `0${countdown}` : countdown}s
          </span>
        </div>
      </div>

      {/* Countdown Progress Line */}
      <div className="h-1 bg-zinc-900 w-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            phase === 'betting'
              ? 'bg-gradient-to-r from-emerald-500 to-green-400'
              : phase === 'in_play'
              ? 'bg-gradient-to-r from-red-500 to-yellow-500'
              : 'bg-yellow-400'
          }`}
          style={{
            width: `${(countdown / (phase === 'results' ? 5 : 30)) * 100}%`,
          }}
        />
      </div>

      {/* Timeout Alert Toast Notification */}
      {timeoutNotice && (
        <div className="bg-amber-950/90 border-b border-amber-500/50 px-3 py-2 text-amber-200 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{timeoutNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setTimeoutNotice(null)}
            className="text-amber-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active Ticket Notification Banner */}
      {activeTicket && (
        <div className="bg-emerald-950/60 border-b border-emerald-500/40 px-3.5 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-200">
              Active Bet: <strong className="text-white">{activeTicket.items.length} Pick(s)</strong> @
              <strong className="text-emerald-400">{activeTicket.totalOdds.toFixed(2)}</strong> (${activeTicket.stake.toFixed(2)} USD)
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-300">
            {phase === 'betting' && `Starting in ${countdown}s`}
            {phase === 'in_play' && `Live in Play (${simMinute}')`}
            {phase === 'results' && 'Evaluating Result'}
          </span>
        </div>
      )}

      {/* 3. Sporty Virtual Pitch Radar (2D pitch, live action, live scores) */}
      {radarFixture && (
        <VirtualPitchRadar
          fixture={radarFixture}
          simMinute={simMinute}
          homeScore={liveScores[radarFixture.id]?.home || 0}
          awayScore={liveScores[radarFixture.id]?.away || 0}
          phase={phase}
          countdown={countdown}
          eventLogs={eventLogs}
          activeBetItems={activeTicket?.items || []}
          allFixtures={filteredFixtures}
          onSelectFixture={(f) => setRadarFixture(f)}
        />
      )}

      {/* 4. League Tabs Navigation Bar */}
      <div className="bg-[#171b26] border-b border-zinc-800 flex items-center justify-between px-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1">
          {[
            { key: 'england', label: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
            { key: 'spain', label: 'Spain', flag: '🇪🇸' },
            { key: 'germany', label: 'Germany', flag: '🇩🇪' },
            { key: 'france', label: 'France', flag: '🇫🇷' },
            { key: 'italy', label: 'Italy', flag: '🇮🇹' },
          ].map((tab) => {
            const isActive = activeLeague === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveLeague(tab.key as LeagueKey);
                  const firstInLeague = fixtures.find((f) => f.league === tab.key);
                  if (firstInLeague) setRadarFixture(firstInLeague);
                  if (soundEnabled) soundManager.playSpinTick();
                }}
                className={`py-2 px-3 text-xs font-bold whitespace-nowrap transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
                  isActive
                    ? 'border-[#00b843] text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{tab.flag}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pl-2">
          <button
            type="button"
            onClick={() => setIsStandingsOpen(true)}
            className="flex items-center gap-1.5 bg-[#252c3f] hover:bg-[#2e374d] text-cyan-400 px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer border border-cyan-500/30"
            title="View Real League Standings & Form"
          >
            <LineChart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Standings</span>
          </button>
        </div>
      </div>

      {/* VIEW A: Detailed Markets View (Screenshot 2) */}
      {detailFixture ? (
        <div className="p-3 space-y-3">
          {/* Match Dropdown Pill */}
          <div className="relative">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsMatchDropdownOpen(!isMatchDropdownOpen)}
                className="flex items-center gap-2 bg-[#1e2433] hover:bg-[#252c3f] px-4 py-2 rounded-full border border-zinc-700 shadow-inner transition cursor-pointer"
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shadow"
                  style={{ backgroundColor: detailFixture.homeBg, color: detailFixture.homeColor }}
                >
                  {detailFixture.homeAbbr.substring(0, 2)}
                </span>
                <span className="text-xs font-black text-white">{detailFixture.homeAbbr}</span>
                <span className="text-[10px] text-zinc-400">vs</span>
                <span className="text-xs font-black text-white">{detailFixture.awayAbbr}</span>
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shadow"
                  style={{ backgroundColor: detailFixture.awayBg, color: detailFixture.awayColor }}
                >
                  {detailFixture.awayAbbr.substring(0, 2)}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-zinc-400 ml-1 transition-transform ${
                    isMatchDropdownOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={() => setIsStandingsOpen(true)}
                title="View League Standings & Form"
                className="p-1 hover:bg-zinc-800 rounded-lg text-cyan-400 transition cursor-pointer"
              >
                <LineChart className="w-4 h-4" />
              </button>
            </div>

            {/* Dropdown Menu of other fixtures */}
            {isMatchDropdownOpen && (
              <div className="absolute top-12 left-0 z-30 w-72 bg-[#181d2a] border border-zinc-700 rounded-xl shadow-2xl p-1.5 space-y-1 animate-fadeIn">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                  Switch Fixture ({activeLeague})
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-zinc-800/60">
                  {filteredFixtures.map((fix) => (
                    <button
                      key={fix.id}
                      type="button"
                      onClick={() => {
                        setDetailFixture(fix);
                        setRadarFixture(fix);
                        setIsMatchDropdownOpen(false);
                        if (soundEnabled) soundManager.playSpinTick();
                      }}
                      className={`w-full p-2 rounded-lg text-left flex items-center justify-between text-xs transition cursor-pointer ${
                        fix.id === detailFixture.id
                          ? 'bg-[#00b843]/20 text-white font-bold'
                          : 'hover:bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-white">{fix.homeAbbr}</span>
                        <span className="text-zinc-500 text-[10px]">vs</span>
                        <span className="font-black text-white">{fix.awayAbbr}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        1X2: {fix.odds1X2.home} | {fix.odds1X2.draw} | {fix.odds1X2.away}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Subtabs Filter */}
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-1.5 overflow-x-auto text-xs">
            {/* BB Toggle */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-black italic text-emerald-400 text-xs tracking-tighter">BB</span>
              <button
                type="button"
                onClick={() => setBetBuilderActive(!betBuilderActive)}
                className={`w-8 h-4 rounded-full p-0.5 transition cursor-pointer flex items-center ${
                  betBuilderActive ? 'bg-[#00b843] justify-end' : 'bg-zinc-700 justify-start'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-white shadow-md" />
              </button>
            </div>

            <SlidersHorizontal className="w-4 h-4 text-[#00b843] shrink-0" />

            {(['all', 'main', 'goals', 'half'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setDetailMarketTab(tab)}
                className={`capitalize font-bold text-xs pb-1 transition cursor-pointer whitespace-nowrap ${
                  detailMarketTab === tab
                    ? 'text-white border-b-2 border-[#00b843]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab === 'all' ? 'All' : tab === 'main' ? 'Main' : tab === 'goals' ? 'Goals' : 'Half'}
              </button>
            ))}
          </div>

          {/* Collapsible Market Accordions */}
          <div className="space-y-3">
            {/* 1. 1X2 Accordion */}
            {(detailMarketTab === 'all' || detailMarketTab === 'main') && (
              <div className="bg-[#181d2a] rounded-xl border border-zinc-800/80 p-2.5">
                <div
                  onClick={() => toggleSection('1X2')}
                  className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 cursor-pointer mb-2"
                >
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-400 transition-transform ${
                      collapsedSections['1X2'] ? '-rotate-90' : ''
                    }`}
                  />
                  <span className="font-black text-white">1X2</span>
                  <Info className="w-3.5 h-3.5 text-zinc-500" />
                </div>

                {!collapsedSections['1X2'] && (
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'home', label: '1 (Home)', val: detailFixture.odds1X2.home },
                      { key: 'draw', label: 'X (Draw)', val: detailFixture.odds1X2.draw },
                      { key: 'away', label: '2 (Away)', val: detailFixture.odds1X2.away },
                    ].map((btn) => {
                      const selected = isOddsSelected(detailFixture.id, '1X2', btn.key);
                      return (
                        <button
                          key={btn.key}
                          type="button"
                          onClick={() =>
                            handleSelectOdds(
                              detailFixture,
                              '1X2',
                              btn.key,
                              `${detailFixture.homeAbbr} vs ${detailFixture.awayAbbr} (${btn.label})`,
                              btn.val
                            )
                          }
                          className={`py-2 px-3 rounded-lg border text-xs flex items-center justify-between transition cursor-pointer ${
                            selected
                              ? 'bg-[#00b843] text-black border-[#00b843] font-black'
                              : 'bg-[#202738] border-zinc-700/80 text-zinc-300 hover:border-zinc-500'
                          }`}
                        >
                          <span className="text-[11px] font-medium opacity-90">{btn.label}</span>
                          <strong
                            className={`font-mono font-black text-xs ${
                              selected ? 'text-black' : 'text-[#00e676]'
                            }`}
                          >
                            {btn.val.toFixed(2)}
                          </strong>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. Over / Under Goals Accordion */}
            {(detailMarketTab === 'all' || detailMarketTab === 'goals') && (
              <div className="bg-[#181d2a] rounded-xl border border-zinc-800/80 p-2.5">
                <div
                  onClick={() => toggleSection('OU')}
                  className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 cursor-pointer mb-2"
                >
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-400 transition-transform ${
                      collapsedSections['OU'] ? '-rotate-90' : ''
                    }`}
                  />
                  <span className="font-black text-white">Over / Under Total Goals</span>
                </div>

                {!collapsedSections['OU'] && (
                  <div className="space-y-1.5">
                    {detailFixture.overUnder.map((row) => {
                      const overSelected = isOddsSelected(detailFixture.id, `O/U ${row.line}`, 'over');
                      const underSelected = isOddsSelected(detailFixture.id, `O/U ${row.line}`, 'under');

                      return (
                        <div
                          key={row.line}
                          className="grid grid-cols-3 gap-0 rounded-lg overflow-hidden border border-zinc-700/70 text-xs"
                        >
                          <div className="bg-[#161a25] py-2 px-3 flex items-center font-bold text-zinc-300 border-r border-zinc-800">
                            Line {row.line}
                          </div>

                          {/* Over */}
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectOdds(
                                detailFixture,
                                `O/U ${row.line}`,
                                'over',
                                `Over ${row.line}`,
                                row.over
                              )
                            }
                            className={`py-2 px-2 text-center font-mono font-bold transition cursor-pointer border-r border-zinc-800 ${
                              overSelected
                                ? 'bg-[#00b843] text-black font-black'
                                : 'bg-[#202738] text-[#00e676] hover:bg-[#283147]'
                            }`}
                          >
                            Over: {row.over.toFixed(2)}
                          </button>

                          {/* Under */}
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectOdds(
                                detailFixture,
                                `O/U ${row.line}`,
                                'under',
                                `Under ${row.line}`,
                                row.under
                              )
                            }
                            className={`py-2 px-2 text-center font-mono font-bold transition cursor-pointer ${
                              underSelected
                                ? 'bg-[#00b843] text-black font-black'
                                : 'bg-[#202738] text-[#00e676] hover:bg-[#283147]'
                            }`}
                          >
                            Under: {row.under.toFixed(2)}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. Both Teams To Score (GG/NG) */}
            {(detailMarketTab === 'all' || detailMarketTab === 'goals') && (
              <div className="bg-[#181d2a] rounded-xl border border-zinc-800/80 p-2.5">
                <div
                  onClick={() => toggleSection('BTTS')}
                  className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 cursor-pointer mb-2"
                >
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-400 transition-transform ${
                      collapsedSections['BTTS'] ? '-rotate-90' : ''
                    }`}
                  />
                  <span className="font-black text-white">Both Teams To Score (GG/NG)</span>
                </div>

                {!collapsedSections['BTTS'] && (
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'yes', label: 'Yes (GG)', val: detailFixture.btts.yes },
                      { key: 'no', label: 'No (NG)', val: detailFixture.btts.no },
                    ].map((btn) => {
                      const selected = isOddsSelected(detailFixture.id, 'BTTS', btn.key);
                      return (
                        <button
                          key={btn.key}
                          type="button"
                          onClick={() =>
                            handleSelectOdds(
                              detailFixture,
                              'BTTS',
                              btn.key,
                              `BTTS: ${btn.label}`,
                              btn.val
                            )
                          }
                          className={`py-2 px-3 rounded-lg border text-xs flex items-center justify-between transition cursor-pointer ${
                            selected
                              ? 'bg-[#00b843] text-black border-[#00b843] font-black'
                              : 'bg-[#202738] border-zinc-700/80 text-zinc-300 hover:border-zinc-500'
                          }`}
                        >
                          <span className="text-[11px] font-medium opacity-90">{btn.label}</span>
                          <strong
                            className={`font-mono font-black text-xs ${
                              selected ? 'text-black' : 'text-[#00e676]'
                            }`}
                          >
                            {btn.val.toFixed(2)}
                          </strong>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VIEW B: Main Fixtures Screen (Screenshot 1) */
        <div>
          {/* Quick Filter & Markets Header (BB, Filter, 1X2, 1X2 - 1UP, 1X2 - 2UP) */}
          <div className="flex items-center gap-3 px-3 py-2 bg-[#171b26] border-b border-zinc-800 overflow-x-auto text-xs">
            {/* BetBuilder switch */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-black italic text-[#00b843] text-xs">BB</span>
              <button
                type="button"
                onClick={() => setBetBuilderActive(!betBuilderActive)}
                className={`w-8 h-4 rounded-full p-0.5 transition cursor-pointer flex items-center ${
                  betBuilderActive ? 'bg-[#00b843] justify-end' : 'bg-zinc-700 justify-start'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-white shadow-md" />
              </button>
            </div>

            <SlidersHorizontal className="w-4 h-4 text-[#00b843] shrink-0" />

            {(['1X2', '1X2 - 1UP', '1X2 - 2UP'] as const).map((mkt) => {
              const isSelected = activeMarketFilter === mkt;
              return (
                <button
                  key={mkt}
                  type="button"
                  onClick={() => {
                    setActiveMarketFilter(mkt);
                    if (soundEnabled) soundManager.playSpinTick();
                  }}
                  className={`font-bold whitespace-nowrap pb-0.5 transition cursor-pointer ${
                    isSelected
                      ? 'text-white border-b-2 border-[#00b843]'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {mkt}
                </button>
              );
            })}
          </div>

          {/* League Subheader with 1 X 2 Column Headings */}
          <div className="grid grid-cols-12 items-center px-3 py-2 bg-[#1a1e29] border-b border-zinc-800 text-[11px] font-bold text-zinc-400">
            <div className="col-span-6 flex items-center gap-1.5 overflow-hidden">
              <span className="text-sm">
                {LEAGUE_METADATA[activeLeague]?.flag || '⚽'}
              </span>
              <span className="text-white font-black truncate">
                {LEAGUE_METADATA[activeLeague]?.name || activeLeague}
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                {filteredFixtures.length} Matches • Rd {roundNumber}
              </span>
            </div>
            <div className="col-span-2 text-center">1</div>
            <div className="col-span-2 text-center">X</div>
            <div className="col-span-2 text-center">2</div>
          </div>

          {/* Fixtures Rows */}
          <div className="divide-y divide-zinc-800/80">
            {filteredFixtures.map((fixture) => {
              const marketOdds =
                activeMarketFilter === '1X2'
                  ? fixture.odds1X2
                  : activeMarketFilter === '1X2 - 1UP'
                  ? fixture.odds1UP
                  : fixture.odds2UP;

              const live = liveScores[fixture.id];
              const homeWon = isOddsSelected(fixture.id, activeMarketFilter, 'home');
              const drawWon = isOddsSelected(fixture.id, activeMarketFilter, 'draw');
              const awayWon = isOddsSelected(fixture.id, activeMarketFilter, 'away');

              return (
                <div
                  key={fixture.id}
                  className={`grid grid-cols-12 items-center px-3 py-2.5 transition ${
                    radarFixture?.id === fixture.id
                      ? 'bg-[#152033]/60 border-l-2 border-emerald-400'
                      : 'hover:bg-zinc-900/40'
                  }`}
                >
                  {/* Left Match Details: Crests, Star Ratings, +71 > */}
                  <div className="col-span-6 pr-2">
                    <div
                      onClick={() => setRadarFixture(fixture)}
                      className="flex items-center gap-1.5 text-xs font-black text-white cursor-pointer hover:text-emerald-300 transition"
                    >
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black shrink-0 shadow"
                        style={{ backgroundColor: fixture.homeBg, color: fixture.homeColor }}
                      >
                        {fixture.homeAbbr.substring(0, 1)}
                      </span>
                      <span className="truncate">{fixture.homeAbbr}</span>
                      <span className="text-[10px] text-zinc-400 font-normal">vs</span>
                      <span className="truncate">{fixture.awayAbbr}</span>
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black shrink-0 shadow"
                        style={{ backgroundColor: fixture.awayBg, color: fixture.awayColor }}
                      >
                        {fixture.awayAbbr.substring(0, 1)}
                      </span>
                    </div>

                    {/* Stars Rating */}
                    <div className="flex items-center gap-4 text-[9px] text-amber-400 mt-0.5">
                      <span>{'★'.repeat(fixture.homeStars)}{'☆'.repeat(5 - fixture.homeStars)}</span>
                      <span>{'★'.repeat(fixture.awayStars)}{'☆'.repeat(5 - fixture.awayStars)}</span>
                    </div>

                    {/* Links row: +more and radar view button */}
                    <div className="flex items-center justify-between mt-1 text-[10px] text-zinc-400">
                      <button
                        type="button"
                        onClick={() => {
                          setDetailFixture(fixture);
                          setRadarFixture(fixture);
                          if (soundEnabled) soundManager.playSpinTick();
                        }}
                        className="flex items-center gap-0.5 hover:text-emerald-400 transition cursor-pointer"
                      >
                        <span>+{fixture.moreCount} Markets</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>

                      {/* Live score if match in progress */}
                      {phase !== 'betting' && live && (
                        <span className="font-mono font-black text-yellow-400 bg-black/40 px-1.5 py-0.5 rounded border border-yellow-500/30">
                          {live.home} - {live.away} {phase === 'in_play' ? `(${simMinute}')` : '(FT)'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 1 (Home) Odds Box */}
                  <div className="col-span-2 px-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectOdds(
                          fixture,
                          activeMarketFilter,
                          'home',
                          `${fixture.homeAbbr} (Home)`,
                          marketOdds.home
                        )
                      }
                      className={`w-full py-2.5 rounded-lg text-center font-mono font-black text-xs transition cursor-pointer border ${
                        homeWon
                          ? 'bg-[#00b843] text-black border-[#00b843]'
                          : 'bg-[#1e2434] text-[#00e676] border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      {marketOdds.home.toFixed(2)}
                    </button>
                  </div>

                  {/* X (Draw) Odds Box */}
                  <div className="col-span-2 px-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectOdds(
                          fixture,
                          activeMarketFilter,
                          'draw',
                          `Draw (${fixture.homeAbbr} vs ${fixture.awayAbbr})`,
                          marketOdds.draw
                        )
                      }
                      className={`w-full py-2.5 rounded-lg text-center font-mono font-black text-xs transition cursor-pointer border ${
                        drawWon
                          ? 'bg-[#00b843] text-black border-[#00b843]'
                          : 'bg-[#1e2434] text-[#00e676] border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      {marketOdds.draw.toFixed(2)}
                    </button>
                  </div>

                  {/* 2 (Away) Odds Box */}
                  <div className="col-span-2 px-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectOdds(
                          fixture,
                          activeMarketFilter,
                          'away',
                          `${fixture.awayAbbr} (Away)`,
                          marketOdds.away
                        )
                      }
                      className={`w-full py-2.5 rounded-lg text-center font-mono font-black text-xs transition cursor-pointer border ${
                        awayWon
                          ? 'bg-[#00b843] text-black border-[#00b843]'
                          : 'bg-[#1e2434] text-[#00e676] border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      {marketOdds.away.toFixed(2)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Round Result Celebration Banner */}
      {lastRoundOutcome && phase === 'results' && (
        <div
          className={`p-3 border-t text-xs flex items-center justify-between animate-fadeIn ${
            lastRoundOutcome.won
              ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
              : 'bg-zinc-900 border-zinc-700 text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {lastRoundOutcome.won ? (
              <Sparkles className="w-5 h-5 text-yellow-400 shrink-0" />
            ) : (
              <RotateCcw className="w-5 h-5 text-zinc-400 shrink-0" />
            )}
            <div>
              <strong className="text-sm font-black block">
                {lastRoundOutcome.won
                  ? `🎉 WON! +$${lastRoundOutcome.payout.toFixed(2)} USD Added to Balance!`
                  : 'Round Completed: Bet did not land.'}
              </strong>
              <span className="text-[11px] text-zinc-400">
                Stake: ${lastRoundOutcome.ticket.stake.toFixed(2)} USD • Total Odds: @{lastRoundOutcome.ticket.totalOdds.toFixed(2)} • Next round starts in {countdown}s
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={advanceToNextRound}
            className="px-3 py-1.5 bg-[#00b843] hover:bg-[#00c259] text-black font-black rounded-lg text-xs transition cursor-pointer"
          >
            Next Round ({countdown}s)
          </button>
        </div>
      )}

      {/* 5. SportyBet Floating Bottom Bar */}
      <div className="grid grid-cols-2 gap-0 border-t border-zinc-800 bg-[#171b26]">
        {/* Next Round Button (or Skip Countdown) */}
        <button
          type="button"
          disabled={phase === 'in_play'}
          onClick={advanceToNextRound}
          className="py-3 px-4 bg-[#181d2a] hover:bg-[#202738] active:bg-[#131722] text-white font-black text-xs sm:text-sm text-center border-r border-zinc-800 transition cursor-pointer disabled:opacity-40"
        >
          {phase === 'in_play' ? `Simulating (${30 - countdown}s / 30s)` : `Next Round (${countdown}s)`}
        </button>

        {/* Betslip Button */}
        <button
          type="button"
          onClick={() => setIsBetslipOpen(true)}
          className="py-3 px-4 bg-[#00b843] hover:bg-[#00c259] active:bg-[#009b38] text-white font-black text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition cursor-pointer shadow-[0_0_20px_rgba(0,184,67,0.3)]"
        >
          <span>Betslip</span>
          {betslip.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-black font-black text-xs flex items-center justify-center">
              {betslip.length}
            </span>
          )}
        </button>
      </div>

      {/* 6. Betslip Modal Drawer */}
      {isBetslipOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#131722] border border-zinc-800 rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-[#dc2626] px-4 py-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm uppercase">Sporty Betslip</span>
                <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full font-bold">
                  {betslip.length} {betslip.length === 1 ? 'Selection' : 'Selections'}
                </span>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded font-mono font-bold">
                  Rd {roundNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsBetslipOpen(false)}
                className="text-white hover:bg-black/20 p-1 rounded-full cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Countdown Status in Betslip */}
            <div className="bg-[#171b26] px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Status:</span>
              {phase === 'betting' ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Betting Closes in 00:{countdown < 10 ? `0${countdown}` : countdown}s
                </span>
              ) : (
                <span className="text-red-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  Betting Closed • Matchday in Play
                </span>
              )}
            </div>

            {/* Selections List */}
            <div className="p-3 max-h-60 overflow-y-auto space-y-2">
              {betslip.length === 0 ? (
                <div className="text-center py-6 text-zinc-400 text-xs">
                  <p>Your betslip is empty.</p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Click any odds button (1, X, 2, Over/Under) to add selections!
                  </p>
                </div>
              ) : (
                betslip.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-[#1e2434] border border-zinc-700/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-white font-bold block">{item.matchName}</span>
                      <span className="text-zinc-400 text-[11px]">
                        {item.marketName} • {item.selectionLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-[#00e676]">@{item.odds.toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => setBetslip((prev) => prev.filter((b) => b.id !== item.id))}
                        className="text-zinc-400 hover:text-red-400 p-1 cursor-pointer transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Stake Controls & Payout Summary */}
            {betslip.length > 0 && (
              <div className="p-3 bg-[#171b26] border-t border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Total Odds:</span>
                  <span className="font-mono font-black text-white text-sm">@{totalOdds.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Potential Return:</span>
                  <span className="font-mono font-black text-[#00e676] text-sm">
                    ${potentialReturn} USD
                  </span>
                </div>

                {/* Quick Stakes */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-zinc-400 mr-1">Stake:</span>
                  {[2, 5, 10, 25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setStake(amt)}
                      className={`px-2.5 py-1 text-xs font-black rounded-lg border transition cursor-pointer ${
                        stake === amt
                          ? 'bg-[#00b843] text-black border-[#00b843]'
                          : 'bg-[#1e2434] text-zinc-300 border-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setStake(Math.floor(userBalance))}
                    className="px-2 py-1 text-xs font-black text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-lg cursor-pointer"
                  >
                    MAX (${Math.floor(userBalance)})
                  </button>
                </div>

                {/* Place Bet or Timeout Notice */}
                {phase !== 'betting' ? (
                  <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-center text-xs space-y-2">
                    <p className="text-amber-300 font-bold">
                      ⏰ Betting is currently closed for Round #{roundNumber}.
                    </p>
                    <p className="text-zinc-400 text-[11px]">
                      Matchday is in progress (30s play). Next round betting begins in{' '}
                      <strong className="text-white font-mono">{countdown}s</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsBetslipOpen(false)}
                      className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg cursor-pointer"
                    >
                      Watch Live Game
                    </button>
                  </div>
                ) : userBalance < stake ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                    <span>Insufficient balance (${userBalance.toFixed(2)} USD).</span>
                    <button
                      type="button"
                      onClick={onOpenReload}
                      className="px-2.5 py-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-lg cursor-pointer transition"
                    >
                      + Deposit
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmAndPlaceBet}
                    className="w-full py-3 px-4 bg-[#00b843] hover:bg-[#00c259] active:bg-[#009b38] text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,184,67,0.4)] transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Confirm Bet (Round #{roundNumber}) • {countdown}s Left</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Real League Standings Modal */}
      <LeagueStandingsModal
        isOpen={isStandingsOpen}
        activeLeague={activeLeague}
        onClose={() => setIsStandingsOpen(false)}
        onSelectLeague={(l) => setActiveLeague(l)}
      />
    </div>
  );
};

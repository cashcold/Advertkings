import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Trophy,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  Globe,
} from 'lucide-react';
import { LeagueKey } from './VirtualFootballGame';
import { LEAGUE_METADATA } from './footballData';

export interface RealStandingTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface RealStandingRow {
  position: number;
  team: RealStandingTeam;
  playedGames: number;
  form: string[];
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface RealStandingsApiResponse {
  success: boolean;
  source: string;
  competition: {
    id: number;
    name: string;
    code: string;
    emblem: string;
    flag: string;
  };
  season: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
  };
  totalClubs: number;
  standings: RealStandingRow[];
  lastUpdated?: string;
  error?: string;
  message?: string;
}

interface LeagueStandingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLeague: LeagueKey;
  onSelectLeague: (league: LeagueKey) => void;
}

const LEAGUES_LIST: { key: LeagueKey; label: string; flag: string }[] = [
  { key: 'england', label: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { key: 'spain', label: 'LaLiga', flag: '🇪🇸' },
  { key: 'germany', label: 'Bundesliga', flag: '🇩🇪' },
  { key: 'france', label: 'Ligue 1', flag: '🇫🇷' },
  { key: 'italy', label: 'Serie A', flag: '🇮🇹' },
];

export const LeagueStandingsModal: React.FC<LeagueStandingsModalProps> = ({
  isOpen,
  onClose,
  activeLeague,
  onSelectLeague,
}) => {
  const [data, setData] = useState<RealStandingsApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<string | null>(null);

  const fetchLiveStandings = useCallback(async (league: LeagueKey) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/football-standings?league=${league}`);
      const json: RealStandingsApiResponse = await res.json();

      if (res.ok && json.success && Array.isArray(json.standings) && json.standings.length > 0) {
        setData(json);
        setErrorMsg(null);
        setLastFetchTime(
          new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        );
      } else {
        // DO NOT show fake or hardcoded table data if the live API is not returned
        setData(null);
        setErrorMsg(
          json.message || json.error || 'Unable to retrieve live standings from the Football API.'
        );
      }
    } catch (err: any) {
      // DO NOT show fake or hardcoded table data if network fails
      setData(null);
      setErrorMsg(
        err.message || 'Network connectivity error. Live standings currently unavailable.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch when opened or when league changes
  useEffect(() => {
    if (isOpen) {
      fetchLiveStandings(activeLeague);
    }
  }, [isOpen, activeLeague, fetchLiveStandings]);

  if (!isOpen) return null;

  const currentLeagueMeta = LEAGUE_METADATA[activeLeague] || {
    name: 'Top Flight League',
    country: 'Europe',
    flag: '⚽',
    totalMatches: 10,
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-[#141824] border border-zinc-700/80 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white font-sans">
        {/* Modal Header */}
        <div className="bg-[#dc2626] px-4 py-3 flex items-center justify-between shadow">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-yellow-300 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm uppercase tracking-tight text-white">
                  Live Official League Standings
                </h3>
                <span className="bg-black/30 text-[10px] text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live API
                </span>
              </div>
              <p className="text-[11px] text-white/80">
                Official table & records fed directly from Football-Data.org API
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:bg-black/20 p-1.5 rounded-full cursor-pointer transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* League Switcher Tabs */}
        <div className="bg-[#1b202e] border-b border-zinc-800 flex items-center px-2 overflow-x-auto no-scrollbar">
          {LEAGUES_LIST.map((league) => {
            const isSel = activeLeague === league.key;
            return (
              <button
                key={league.key}
                type="button"
                onClick={() => onSelectLeague(league.key)}
                className={`py-2.5 px-3.5 text-xs font-bold whitespace-nowrap transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
                  isSel
                    ? 'border-[#00b843] text-white bg-zinc-800/50'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="text-sm">{league.flag}</span>
                <span>{league.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live League Metadata & API Status Bar */}
        <div className="px-4 py-2 bg-[#0f131d] border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            {data?.competition?.emblem ? (
              <img
                src={data.competition.emblem}
                alt={data.competition.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 object-contain"
              />
            ) : (
              <span className="text-base">{currentLeagueMeta.flag}</span>
            )}
            <span className="font-black text-white">
              {data?.competition?.name || currentLeagueMeta.name}
            </span>
            {data?.season && (
              <span className="text-[11px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-mono">
                Matchday {data.season.currentMatchday || 1} • {data.totalClubs} Clubs
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {lastFetchTime && (
              <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                Synced at {lastFetchTime}
              </span>
            )}
            <button
              type="button"
              onClick={() => fetchLiveStandings(activeLeague)}
              disabled={isLoading}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition cursor-pointer font-bold disabled:opacity-50"
              title="Refresh Live Table from API"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Connecting...' : 'Refresh API'}</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="overflow-y-auto flex-1 p-2 sm:p-4 min-h-[320px]">
          {isLoading && !data ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  Loading Live Standings from Football API...
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Connecting to Football-Data.org live official feed
                </p>
              </div>
            </div>
          ) : errorMsg && !data ? (
            /* Error State: Strictly NO fake or hardcoded data */
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
              <h4 className="text-base font-bold text-white">
                Live Standings Table Unavailable
              </h4>
              <p className="text-xs text-zinc-400 max-w-md mt-1.5 leading-relaxed">
                As requested, simulated or hardcoded standings are withheld when live API data
                cannot be retrieved. We only display official live table data.
              </p>
              <div className="mt-3 bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-[11px] text-rose-300/90 font-mono max-w-md">
                {errorMsg}
              </div>
              <button
                type="button"
                onClick={() => fetchLiveStandings(activeLeague)}
                className="mt-4 inline-flex items-center gap-2 bg-[#00b843] hover:bg-[#009e3a] text-black font-black px-4 py-2 rounded-lg text-xs transition cursor-pointer shadow-lg"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Live Connection</span>
              </button>
            </div>
          ) : data && data.standings ? (
            /* Live Official Standings Table */
            <div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-[11px] font-bold text-zinc-400 uppercase">
                    <th className="py-2 pl-2 w-8 text-center">#</th>
                    <th className="py-2 pl-1">Club</th>
                    <th className="py-2 text-center w-8">P</th>
                    <th className="py-2 text-center w-8">W</th>
                    <th className="py-2 text-center w-8">D</th>
                    <th className="py-2 text-center w-8">L</th>
                    <th className="py-2 text-center w-12">Goals</th>
                    <th className="py-2 text-center w-8">GD</th>
                    <th className="py-2 text-center w-10 font-black text-white">Pts</th>
                    <th className="py-2 pr-2 text-right w-24">Form</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {data.standings.map((team, idx) => {
                    // Standard UEFA qualification & relegation zones
                    const isUCL = idx < 4;
                    const isUEL = idx === 4;
                    const isUECL = idx === 5;
                    const isRelegation = idx >= data.standings.length - 3;

                    return (
                      <tr
                        key={team.team.id || idx}
                        className="hover:bg-zinc-800/40 transition text-zinc-300"
                      >
                        {/* Position Badge */}
                        <td className="py-2 pl-2 text-center font-bold">
                          <span
                            className={`inline-block w-5 h-5 rounded text-[10px] leading-5 text-center font-black ${
                              isUCL
                                ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40'
                                : isUEL
                                ? 'bg-orange-600/30 text-orange-400 border border-orange-500/40'
                                : isUECL
                                ? 'bg-teal-600/30 text-teal-400 border border-teal-500/40'
                                : isRelegation
                                ? 'bg-red-600/30 text-red-400 border border-red-500/40'
                                : 'text-zinc-500'
                            }`}
                          >
                            {team.position}
                          </span>
                        </td>

                        {/* Team Name and Crest */}
                        <td className="py-2 pl-1 font-sans">
                          <div className="flex items-center gap-2">
                            {team.team.crest ? (
                              <img
                                src={team.team.crest}
                                alt={team.team.shortName || team.team.name}
                                referrerPolicy="no-referrer"
                                className="w-5 h-5 object-contain shrink-0 drop-shadow"
                                onError={(e) => {
                                  // Fallback hide if broken image
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="w-5 h-5 rounded-full bg-zinc-700 text-[9px] font-bold flex items-center justify-center text-white shrink-0">
                                {team.team.tla?.substring(0, 2) ||
                                  team.team.shortName?.substring(0, 2)}
                              </span>
                            )}
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold text-white text-xs truncate">
                                {team.team.shortName || team.team.name}
                              </span>
                              {team.team.tla && (
                                <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                                  {team.team.tla}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-2 text-center text-zinc-400">{team.playedGames}</td>
                        <td className="py-2 text-center text-zinc-300 font-bold">{team.won}</td>
                        <td className="py-2 text-center text-zinc-400">{team.draw}</td>
                        <td className="py-2 text-center text-zinc-400">{team.lost}</td>
                        <td className="py-2 text-center text-zinc-400 text-[11px]">
                          {team.goalsFor}:{team.goalsAgainst}
                        </td>
                        <td
                          className={`py-2 text-center font-bold ${
                            team.goalDifference > 0
                              ? 'text-emerald-400'
                              : team.goalDifference < 0
                              ? 'text-rose-400'
                              : 'text-zinc-400'
                          }`}
                        >
                          {team.goalDifference > 0
                            ? `+${team.goalDifference}`
                            : team.goalDifference}
                        </td>
                        <td className="py-2 text-center font-black text-white bg-zinc-900/60 rounded">
                          {team.points}
                        </td>
                        <td className="py-2 pr-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {team.form && team.form.length > 0 ? (
                              team.form.map((res, fIdx) => (
                                <span
                                  key={fIdx}
                                  className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center ${
                                    res === 'W'
                                      ? 'bg-emerald-600 text-white'
                                      : res === 'D'
                                      ? 'bg-zinc-600 text-white'
                                      : 'bg-rose-600 text-white'
                                  }`}
                                >
                                  {res}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-zinc-600 font-mono">
                                In Season
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Legend */}
              <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-wrap gap-4 text-[11px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Champions League</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>Europa League</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>Conference League</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Relegation Zone</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#0f131d] px-4 py-2.5 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px]">
              Live data strictly from Football-Data.org official API. No fake or mock tables used.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-4 py-1.5 rounded-lg transition cursor-pointer"
          >
            Close Table
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  RefreshCw,
  Search,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  ExternalLink,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Activity,
  Globe2,
} from 'lucide-react';
import { LeagueKey } from './virtual-games/VirtualFootballGame';
import { LEAGUE_METADATA } from './virtual-games/footballData';

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

const LEAGUES_LIST: { key: LeagueKey; label: string; flag: string; country: string }[] = [
  { key: 'england', label: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England' },
  { key: 'spain', label: 'LaLiga', flag: '🇪🇸', country: 'Spain' },
  { key: 'germany', label: 'Bundesliga', flag: '🇩🇪', country: 'Germany' },
  { key: 'france', label: 'Ligue 1', flag: '🇫🇷', country: 'France' },
  { key: 'italy', label: 'Serie A', flag: '🇮🇹', country: 'Italy' },
];

export const RealFootballStandingsSection: React.FC = () => {
  const [activeLeague, setActiveLeague] = useState<LeagueKey>('england');
  const [data, setData] = useState<RealStandingsApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

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
        setData(null);
        setErrorMsg(
          json.message || json.error || 'Live standings currently updating from the Football API.'
        );
      }
    } catch (err: any) {
      setData(null);
      setErrorMsg(
        err.message || 'Unable to connect to live Football API feed. Please retry.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveStandings(activeLeague);
  }, [activeLeague, fetchLiveStandings]);

  const filteredStandings = (data?.standings || []).filter((row) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      row.team.name.toLowerCase().includes(q) ||
      row.team.shortName.toLowerCase().includes(q) ||
      row.team.tla.toLowerCase().includes(q)
    );
  });

  const currentLeagueMeta = LEAGUE_METADATA[activeLeague] || {
    name: 'Top Flight League',
    country: 'Europe',
    flag: '⚽',
    totalMatches: 10,
  };

  const getPositionStyle = (pos: number, total: number) => {
    if (pos <= 4) {
      return {
        badgeBg: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
        lineBorder: 'border-l-4 border-l-blue-500',
        label: 'UCL',
      };
    }
    if (pos === 5) {
      return {
        badgeBg: 'bg-orange-500/20 text-orange-400 border border-orange-500/40',
        lineBorder: 'border-l-4 border-l-orange-500',
        label: 'UEL',
      };
    }
    if (pos === 6) {
      return {
        badgeBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
        lineBorder: 'border-l-4 border-l-emerald-500',
        label: 'UECL',
      };
    }
    if (pos > total - 3) {
      return {
        badgeBg: 'bg-red-500/20 text-red-400 border border-red-500/40',
        lineBorder: 'border-l-4 border-l-red-500',
        label: 'REL',
      };
    }
    return {
      badgeBg: 'bg-zinc-800 text-zinc-400',
      lineBorder: 'border-l-4 border-l-transparent',
      label: null,
    };
  };

  return (
    <div
      id="real-football-standings"
      className="mt-4 rounded-3xl bg-gradient-to-br from-[#061611] via-[#08121a] to-black border-2 border-green-500/60 p-4 sm:p-6 shadow-[0_0_35px_rgba(34,197,94,0.25)] text-white font-sans"
    >
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-green-500/30 pb-3 mb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.5)]">
            <Trophy className="w-5 h-5 text-black" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-sm sm:text-base uppercase tracking-tight text-white flex items-center gap-1.5">
                <span>⚽ REAL FOOTBALL LEAGUE STANDINGS</span>
              </h3>
              <span className="bg-green-500/20 text-green-400 border border-green-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live Official API Feed
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Verified table standings, matchday form, and goal records powered by Football-Data.org
            </p>
          </div>
        </div>

        {/* Controls: Refresh & Collapse */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchLiveStandings(activeLeague)}
            disabled={isLoading}
            className="text-xs font-bold bg-[#14231b] hover:bg-[#1c3227] text-green-300 border border-green-500/40 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh Table Standings from Live API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-green-400' : ''}`} />
            <span className="hidden sm:inline">{isLoading ? 'Syncing...' : 'Refresh API'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
            title={isExpanded ? 'Collapse Standings' : 'Expand Standings'}
          >
            <ChevronDown className={`w-4 h-4 text-green-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            <span className="hidden sm:inline">{isExpanded ? 'Hide' : 'Show'}</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 animate-fadeIn">
          {/* League Tabs Switcher */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-zinc-800/80">
            <div className="flex items-center gap-1.5 shrink-0">
              {LEAGUES_LIST.map((league) => {
                const isSel = activeLeague === league.key;
                return (
                  <button
                    key={league.key}
                    type="button"
                    onClick={() => setActiveLeague(league.key)}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isSel
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-[0_0_12px_rgba(34,197,94,0.6)]'
                        : 'bg-[#121924] text-zinc-300 hover:bg-[#182333] hover:text-white border border-zinc-800'
                    }`}
                  >
                    <span className="text-sm">{league.flag}</span>
                    <span>{league.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Club Search Field */}
            <div className="relative shrink-0 w-36 sm:w-48">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search club..."
                className="w-full bg-[#101622] text-white placeholder-zinc-500 text-xs pl-8 pr-2.5 py-1.5 rounded-xl border border-zinc-700/80 outline-none focus:border-green-400 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-zinc-400 hover:text-white text-xs absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Subheader: Competition Info & Matchday Stats */}
          {data && (
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0c131d] px-3.5 py-2 rounded-xl border border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                {data.competition?.emblem && (
                  <img
                    src={data.competition.emblem}
                    alt={data.competition.name}
                    className="w-5 h-5 object-contain bg-white/10 p-0.5 rounded"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span className="font-black text-white">{data.competition?.name || currentLeagueMeta.name}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-green-400 font-mono font-bold">
                  Matchday {data.season?.currentMatchday || 1}
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400 text-[11px]">
                  Season {data.season?.startDate?.substring(0, 4)}/{data.season?.endDate?.substring(0, 4)}
                </span>
              </div>

              {lastFetchTime && (
                <span className="text-[11px] text-zinc-400 font-mono">
                  Synced: <strong className="text-zinc-300">{lastFetchTime}</strong>
                </span>
              )}
            </div>
          )}

          {/* Loading State Skeleton */}
          {isLoading && !data && (
            <div className="py-12 text-center text-zinc-400 space-y-3 bg-[#0d141e]/70 rounded-2xl border border-zinc-800">
              <Loader2 className="w-8 h-8 text-green-400 animate-spin mx-auto" />
              <p className="text-xs font-bold text-zinc-300">
                Contacting live Football API for {currentLeagueMeta.name} standings...
              </p>
              <p className="text-[11px] text-zinc-500 font-mono">
                Querying official matchday points, goal differentials & club records
              </p>
            </div>
          )}

          {/* Error Notice (Strict No-Mock Fallback) */}
          {errorMsg && !data && !isLoading && (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 text-center space-y-2">
              <AlertTriangle className="w-6 h-6 text-red-400 mx-auto" />
              <strong className="text-xs text-red-300 block font-bold">
                Live Football API Notice
              </strong>
              <p className="text-[11px] text-zinc-300 max-w-md mx-auto">{errorMsg}</p>
              <button
                type="button"
                onClick={() => fetchLiveStandings(activeLeague)}
                className="mt-1 px-4 py-1.5 bg-red-500 hover:bg-red-400 text-black font-black text-xs rounded-xl cursor-pointer transition shadow"
              >
                Retry Live Connection
              </button>
            </div>
          )}

          {/* Table Container */}
          {data && (
            <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-[#0c131d] shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  {/* Table Header */}
                  <thead>
                    <tr className="bg-[#121924] border-b border-zinc-800 text-[10px] sm:text-[11px] uppercase font-mono font-bold text-zinc-400">
                      <th className="py-2.5 px-2 text-center w-10">#</th>
                      <th className="py-2.5 px-3">Club</th>
                      <th className="py-2.5 px-2 text-center" title="Matches Played">
                        MP
                      </th>
                      <th className="py-2.5 px-2 text-center" title="Wins">
                        W
                      </th>
                      <th className="py-2.5 px-2 text-center" title="Draws">
                        D
                      </th>
                      <th className="py-2.5 px-2 text-center" title="Losses">
                        L
                      </th>
                      <th className="py-2.5 px-2 text-center hidden md:table-cell" title="Goals For : Goals Against">
                        GF:GA
                      </th>
                      <th className="py-2.5 px-2 text-center font-bold" title="Goal Difference">
                        GD
                      </th>
                      <th className="py-2.5 px-3 text-center font-black text-yellow-300" title="Total Points">
                        Pts
                      </th>
                      <th className="py-2.5 px-3 text-center hidden sm:table-cell" title="Recent Match Form">
                        Form
                      </th>
                    </tr>
                  </thead>

                  {/* Table Rows */}
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredStandings.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-zinc-500 text-xs">
                          No clubs match "{searchQuery}" in {currentLeagueMeta.name}.
                        </td>
                      </tr>
                    ) : (
                      filteredStandings.map((row) => {
                        const style = getPositionStyle(row.position, data.standings.length);
                        return (
                          <tr
                            key={row.team.id}
                            className={`hover:bg-[#15202e] transition ${style.lineBorder}`}
                          >
                            {/* Position */}
                            <td className="py-2 px-2 text-center">
                              <span
                                className={`w-6 h-6 rounded-md inline-flex items-center justify-center font-mono font-black text-[11px] ${style.badgeBg}`}
                              >
                                {row.position}
                              </span>
                            </td>

                            {/* Club Crest & Name */}
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-2">
                                {row.team.crest ? (
                                  <img
                                    src={row.team.crest}
                                    alt={row.team.name}
                                    className="w-5 h-5 object-contain shrink-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      // Fallback on image failure
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-[9px] font-black flex items-center justify-center text-zinc-300 shrink-0">
                                    {row.team.shortName.substring(0, 2)}
                                  </span>
                                )}
                                <div className="truncate max-w-[130px] sm:max-w-none">
                                  <span className="font-bold text-white text-xs block truncate">
                                    {row.team.name}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-mono">
                                    {row.team.tla}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Matches Played */}
                            <td className="py-2 px-2 text-center font-mono text-zinc-300">
                              {row.playedGames}
                            </td>

                            {/* Wins */}
                            <td className="py-2 px-2 text-center font-mono text-green-400 font-bold">
                              {row.won}
                            </td>

                            {/* Draws */}
                            <td className="py-2 px-2 text-center font-mono text-zinc-400">
                              {row.draw}
                            </td>

                            {/* Losses */}
                            <td className="py-2 px-2 text-center font-mono text-red-400">
                              {row.lost}
                            </td>

                            {/* Goals GF:GA */}
                            <td className="py-2 px-2 text-center font-mono text-zinc-400 text-[11px] hidden md:table-cell">
                              {row.goalsFor}:{row.goalsAgainst}
                            </td>

                            {/* Goal Difference */}
                            <td
                              className={`py-2 px-2 text-center font-mono font-bold ${
                                row.goalDifference > 0
                                  ? 'text-green-400'
                                  : row.goalDifference < 0
                                  ? 'text-red-400'
                                  : 'text-zinc-400'
                              }`}
                            >
                              {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                            </td>

                            {/* Points (Highlighted) */}
                            <td className="py-2 px-3 text-center font-mono font-black text-sm text-yellow-300">
                              {row.points}
                            </td>

                            {/* Form Pill Badges */}
                            <td className="py-2 px-3 text-center hidden sm:table-cell">
                              <div className="flex items-center justify-center gap-1">
                                {Array.isArray(row.form) && row.form.length > 0 ? (
                                  row.form.map((res, i) => (
                                    <span
                                      key={i}
                                      className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center font-mono ${
                                        res === 'W'
                                          ? 'bg-green-500 text-black'
                                          : res === 'D'
                                          ? 'bg-zinc-600 text-white'
                                          : 'bg-red-500 text-white'
                                      }`}
                                    >
                                      {res}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-zinc-500 font-mono">-</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer: Qualification Zones Legend */}
              <div className="bg-[#0f1722] px-3.5 py-2.5 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-400">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>UEFA Champions League (1-4)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span>Europa League (5)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Conference League (6)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span>Relegation Zone</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Globe2 className="w-3.5 h-3.5 text-green-400" />
                  <span>Official European Top 5 Leagues</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

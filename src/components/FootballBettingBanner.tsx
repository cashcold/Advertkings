import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  DollarSign,
  Ticket,
  Percent,
  Star,
  RefreshCw,
  Lock,
  Globe2,
  Cpu,
  Gamepad2
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface FootballBettingBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

interface MatchPick {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeCrest?: string;
  awayCrest?: string;
  competitionEmblem?: string;
  time: string;
  market: string;
  prediction: string;
  odds: number;
  confidence: string;
  isToday?: boolean;
}

const getTodayDateString = (timeStr: string = '20:00 GMT') => {
  const d = new Date();
  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
  const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `Today (${dayName}, ${monthDay}) • ${timeStr}`;
};

const DEFAULT_MATCHES: MatchPick[] = [
  {
    id: 'fd-564636',
    league: 'Spanish Primera Division',
    homeTeam: 'RC Celta de Vigo',
    awayTeam: 'CA Osasuna',
    homeCrest: 'https://crests.football-data.org/558.png',
    awayCrest: 'https://crests.football-data.org/79.png',
    competitionEmblem: 'https://crests.football-data.org/laliga.png',
    time: 'Today (Thu, Aug 27) • 18:30 GMT',
    market: 'Exact Correct Score',
    prediction: '* - *',
    odds: 11.80,
    confidence: '99.9% VVIP Fixed',
    isToday: true,
  },
  {
    id: 'fd-564630',
    league: 'Spanish Primera Division',
    homeTeam: 'FC Barcelona',
    awayTeam: 'Athletic Club',
    homeCrest: 'https://crests.football-data.org/81.png',
    awayCrest: 'https://crests.football-data.org/77.png',
    competitionEmblem: 'https://crests.football-data.org/laliga.png',
    time: 'Today (Thu, Aug 27) • 19:00 GMT',
    market: 'Exact Correct Score',
    prediction: '* - *',
    odds: 12.40,
    confidence: '100% Insider',
    isToday: true,
  },
];

const BACKUP_3RD_MATCH: MatchPick = {
  id: 'fd-564640',
  league: 'German Bundesliga',
  homeTeam: 'FC Bayern München',
  awayTeam: 'VfB Stuttgart',
  homeCrest: 'https://crests.football-data.org/5.png',
  awayCrest: 'https://crests.football-data.org/10.png',
  competitionEmblem: 'https://crests.football-data.org/BL1.png',
  time: 'Fri, Aug 28 • 18:30 GMT',
  market: 'Exact Correct Score',
  prediction: '* - *',
  odds: 13.50,
  confidence: '99.8% VVIP Fixed',
  isToday: false,
};

const BACKUP_4TH_MATCH: MatchPick = {
  id: 'fd-564641',
  league: 'Italian Serie A',
  homeTeam: 'AC Milan',
  awayTeam: 'Venezia FC',
  homeCrest: 'https://crests.football-data.org/98.png',
  awayCrest: 'https://crests.football-data.org/454.png',
  competitionEmblem: 'https://crests.football-data.org/SA.png',
  time: 'Fri, Aug 28 • 18:45 GMT',
  market: 'Exact Correct Score',
  prediction: '* - *',
  odds: 11.40,
  confidence: '100% Fixed Lock',
  isToday: false,
};

const BACKUP_5TH_MATCH: MatchPick = {
  id: 'fd-564642',
  league: 'French Ligue 1',
  homeTeam: 'Lille OSC',
  awayTeam: 'Paris Saint-Germain FC',
  homeCrest: 'https://crests.football-data.org/521.png',
  awayCrest: 'https://crests.football-data.org/524.png',
  competitionEmblem: 'https://crests.football-data.org/FL1.png',
  time: 'Fri, Aug 28 • 18:45 GMT',
  market: 'Exact Correct Score',
  prediction: '* - *',
  odds: 14.80,
  confidence: '99.9% VVIP Fixed',
  isToday: false,
};

export const FootballBettingBanner: React.FC<FootballBettingBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
}) => {
  const [matches, setMatches] = useState<MatchPick[]>(DEFAULT_MATCHES);
  const [matchCount, setMatchCount] = useState<2 | 3 | 5>(2);
  const [stakeAmount, setStakeAmount] = useState<number>(50);
  const [copiedSlip, setCopiedSlip] = useState<boolean>(false);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [apiSource, setApiSource] = useState<string>('Football-Data.org Live API');

  // Auto-fetch real matches from football-data.org API on initial mount
  useEffect(() => {
    handleFetchWorldwideMatches(matchCount, false);
  }, []);

  // Handle toggling between 2, 3, and 5 matches
  const handleCountToggle = (count: 2 | 3 | 5) => {
    setMatchCount(count);
    soundManager.playSpinTick();
    handleFetchWorldwideMatches(count, false);
  };

  // Fetch / generate 2 or 3 matches from worldwide leagues via API
  const handleFetchWorldwideMatches = async (targetCount: number = matchCount, playSound: boolean = true) => {
    setIsLoadingApi(true);
    incrementClicks();
    if (playSound) {
      soundManager.playSpinTick();
    }

    try {
      const res = await fetch(`/api/football-matches?count=${targetCount}`);
      if (res.ok) {
        const data = await res.json();
        if (data.matches && Array.isArray(data.matches) && data.matches.length > 0) {
          // Ensure all predictions are strictly masked as '* - *'
          const sanitized = data.matches.map((m: any) => ({
            ...m,
            prediction: '* - *',
          }));
          setMatches(sanitized);
          if (data.source === 'football-data.org') {
            setApiSource('Football-Data.org Live API');
          } else if (data.source === 'gemini-ai-radar') {
            setApiSource('Gemini AI Neural Radar');
          } else {
            setApiSource('Worldwide Fixture API');
          }
          if (playSound) {
            soundManager.playWinFanfare();
          }
        }
      } else {
        // Fallback local shuffle if server is offline
        generateFallbackMatches(targetCount);
      }
    } catch (err) {
      console.warn('API fetch fallback:', err);
      generateFallbackMatches(targetCount);
    } finally {
      setIsLoadingApi(false);
    }
  };

  const generateFallbackMatches = (targetCount: number) => {
    const worldwidePool: MatchPick[] = [
      {
        id: `fb-${Date.now()}-1`,
        league: 'UEFA Champions League',
        homeTeam: 'Bayern Munich',
        awayTeam: 'Paris Saint-Germain',
        time: getTodayDateString('20:00 GMT'),
        market: 'Exact Correct Score',
        prediction: '* - *',
        odds: 14.50,
        confidence: '99.9% VVIP Fixed',
      },
      {
        id: `fb-${Date.now()}-2`,
        league: 'English Premier League',
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        time: getTodayDateString('19:30 GMT'),
        market: 'Exact Correct Score',
        prediction: '* - *',
        odds: 9.80,
        confidence: '100% Insider',
      },
      {
        id: `fb-${Date.now()}-3`,
        league: 'Spanish La Liga',
        homeTeam: 'FC Barcelona',
        awayTeam: 'Atletico Madrid',
        time: getTodayDateString('21:00 GMT'),
        market: 'Exact Correct Score',
        prediction: '* - *',
        odds: 11.20,
        confidence: '99.8% VVIP Fixed',
      },
      {
        id: `fb-${Date.now()}-4`,
        league: 'Italian Serie A',
        homeTeam: 'Inter Milan',
        awayTeam: 'Juventus',
        time: getTodayDateString('19:45 GMT'),
        market: 'Exact Correct Score',
        prediction: '* - *',
        odds: 12.00,
        confidence: '99.5% Insider',
      },
      {
        id: `fb-${Date.now()}-5`,
        league: 'German Bundesliga',
        homeTeam: 'Borussia Dortmund',
        awayTeam: 'Bayer Leverkusen',
        time: getTodayDateString('18:30 GMT'),
        market: 'Exact Correct Score',
        prediction: '* - *',
        odds: 13.50,
        confidence: '99.7% VVIP Fixed',
      },
      {
        id: `fb-${Date.now()}-6`,
        league: 'Saudi Pro League',
        homeTeam: 'Al-Nassr',
        awayTeam: 'Al-Hilal',
        time: getTodayDateString('18:00 GMT'),
        market: 'Exact Correct Score',
        prediction: '* - *',
        odds: 15.00,
        confidence: '99.9% VVIP Fixed',
      },
      {
        id: `fb-${Date.now()}-7`,
        league: 'Copa Libertadores',
        homeTeam: 'Flamengo',
        awayTeam: 'River Plate',
        time: getTodayDateString('22:30 GMT'),
        market: 'Exact Correct Score',
        prediction: '* - *',
        odds: 13.80,
        confidence: '99.6% VVIP Fixed',
      },
    ];

    const shuffled = [...worldwidePool].sort(() => 0.5 - Math.random());
    setMatches(shuffled.slice(0, targetCount));
    setApiSource('Worldwide League Radar');
  };

  // Calculate total odds for 2-match, 3-match, and 5-match combo for fast reference
  const current2MatchOdds = (matches.length >= 2 ? matches[0].odds * matches[1].odds : DEFAULT_MATCHES[0].odds * DEFAULT_MATCHES[1].odds);
  const current3MatchOdds = (matches.length >= 3 
    ? matches[0].odds * matches[1].odds * matches[2].odds 
    : current2MatchOdds * BACKUP_3RD_MATCH.odds);
  const current5MatchOdds = (matches.length >= 5
    ? matches.slice(0, 5).reduce((acc, m) => acc * m.odds, 1)
    : current3MatchOdds * BACKUP_4TH_MATCH.odds * BACKUP_5TH_MATCH.odds);

  const totalOdds = matches.reduce((acc, m) => acc * m.odds, 1);
  const potentialReturn = (stakeAmount * totalOdds).toFixed(2);

  const handleCopySlip = () => {
    incrementClicks();
    soundManager.playCoin();
    setCopiedSlip(true);
    setTimeout(() => setCopiedSlip(false), 2500);

    const matchDetails = matches
      .map(
        (m, idx) =>
          `⚽ MATCH ${idx + 1} (${m.league} - ${m.time}):\n` +
          `• Teams: ${m.homeTeam} VS ${m.awayTeam}\n` +
          `• Market: ${m.market}\n` +
          `• Exact Prediction: [🔒 HIDDEN: * - *]\n` +
          `• Confidence: ${m.confidence}\n`
      )
      .join('\n');

    onOpenTelegram(
      `⚽ 100% VVIP FOOTBALL EXACT SCORE TICKET REQUEST:\n\n` +
      `• TOTAL COMBINED SLIP ODDS: @${totalOdds.toFixed(2)}\n` +
      `• Combo Selection: ${matches.length} MATCHES FIXED COMBO\n` +
      `• Stake: $${stakeAmount} USDT\n` +
      `• Estimated Payout: $${Number(potentialReturn).toLocaleString()} USDT\n\n` +
      `${matchDetails}\n` +
      `⚡ Please send me the 100% UNLOCKED Correct Scores & Official VVIP Booking Code on Telegram now!`
    );
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061e0f] via-[#040f08] to-black border-2 border-green-500/80 p-4 sm:p-6 shadow-[0_0_40px_rgba(34,197,94,0.3)] glow-gold">
      
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-green-500/30 pb-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-green-500 text-black font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(34,197,94,0.6)] flex items-center gap-1.5 animate-pulse">
            <Ticket className="w-4 h-4 inline fill-black" /> ⚽ 100% VVIP FOOTBALL BETTING SLIP
          </span>
          <span className="bg-yellow-400 text-black font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded uppercase tracking-tight">
            EXACT CORRECT SCORE FIXED
          </span>
          {/* Total Odds Top Glowing Badge */}
          <span className="bg-gradient-to-r from-yellow-400 to-amber-300 text-black font-black font-mono text-xs px-3 py-1 rounded-full uppercase tracking-tight shadow-[0_0_15px_rgba(250,204,21,0.7)] flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-black inline" /> TOTAL ODDS: @{totalOdds.toFixed(2)}
          </span>
        </div>

        {/* Dynamic API Status & Refresh Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/60 border border-green-500/40 px-2 py-1 rounded-lg">
            <Cpu className="w-3.5 h-3.5 text-green-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-green-300">{apiSource}</span>
          </div>

          <a
            href="#real-football-standings"
            className="text-xs font-black text-green-300 hover:text-white bg-black/70 hover:bg-green-950/80 border border-green-500/50 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 shadow-md hover:scale-105"
            title="Jump to Real Football Standings Table below"
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden sm:inline">LIVE STANDINGS</span>
          </a>

          <button
            onClick={() => handleFetchWorldwideMatches(matchCount)}
            disabled={isLoadingApi}
            className="text-xs font-black text-black bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-yellow-300 hover:to-amber-200 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 disabled:opacity-50"
            title="Generate new random matches from global leagues via API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingApi ? 'animate-spin' : ''}`} />
            <span>{isLoadingApi ? 'GENERATING...' : 'GENERATE VIA API'}</span>
          </button>
        </div>
      </div>

      {/* Match Count Toggle Bar with Explicit Total Odds on each button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-black/60 border border-green-500/30 p-2.5 sm:p-3 rounded-2xl shadow-inner">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-zinc-200 flex items-center gap-1">
            <Globe2 className="w-4 h-4 text-green-400" />
            COMBO SELECTION:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleCountToggle(2)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                matchCount === 2
                  ? 'bg-green-500 text-black shadow-[0_0_12px_rgba(34,197,94,0.7)] scale-[1.02]'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-700'
              }`}
            >
              <span>2 MATCHES COMBO</span>
              <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-black ${
                matchCount === 2 ? 'bg-black text-yellow-300' : 'bg-yellow-950/80 text-yellow-400 border border-yellow-500/30'
              }`}>
                TOTAL ODDS: @{current2MatchOdds.toFixed(2)}
              </span>
            </button>

            <button
              onClick={() => handleCountToggle(3)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                matchCount === 3
                  ? 'bg-green-500 text-black shadow-[0_0_12px_rgba(34,197,94,0.7)] scale-[1.02]'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-700'
              }`}
            >
              <span>3 MATCHES COMBO</span>
              <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-black ${
                matchCount === 3 ? 'bg-black text-yellow-300' : 'bg-yellow-950/80 text-yellow-400 border border-yellow-500/30'
              }`}>
                TOTAL ODDS: @{current3MatchOdds.toFixed(2)}
              </span>
            </button>

            <button
              onClick={() => handleCountToggle(5)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                matchCount === 5
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-300 text-black shadow-[0_0_15px_rgba(250,204,21,0.8)] scale-[1.02]'
                  : 'bg-zinc-900 text-yellow-300 hover:text-yellow-200 border border-yellow-500/40'
              }`}
            >
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current inline" />
                5 MATCHES COMBO
              </span>
              <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-black ${
                matchCount === 5 ? 'bg-black text-yellow-300' : 'bg-yellow-950/90 text-yellow-300 border border-yellow-400/50'
              }`}>
                TOTAL ODDS: @{Number(current5MatchOdds.toFixed(0)).toLocaleString()}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-yellow-300 bg-yellow-950/80 border border-yellow-500/40 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-yellow-400" />
            Correct Scores Protected (* - *)
          </span>
        </div>
      </div>

      {/* Prominent Ticket Odds Banner Strip */}
      <div className="bg-gradient-to-r from-yellow-500/20 via-green-500/20 to-emerald-500/20 border-2 border-yellow-400/60 rounded-2xl px-4 py-2.5 mb-4 flex flex-wrap items-center justify-between gap-2 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wide">
            {matches.length}-MATCH VVIP COMBINATION SLIP:
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-300 font-bold uppercase tracking-wider">TOTAL ODDS:</span>
          <span className="text-lg sm:text-2xl font-black font-mono text-yellow-300 bg-black/80 border border-yellow-400/50 px-3 py-0.5 rounded-xl shadow-md glow-gold">
            @{totalOdds.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Main Grid: Active Match Cards (Design matching exact specifications) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Match Cards List (7 cols) */}
        <div className="lg:col-span-7 space-y-3 flex flex-col justify-start max-h-[750px] overflow-y-auto pr-1">
          {matches.map((m, idx) => (
            <div 
              key={m.id || idx}
              className="bg-gradient-to-r from-black/90 via-[#0a170e] to-black/80 border-2 border-green-500/40 hover:border-green-400 transition-all rounded-2xl p-3.5 sm:p-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] group"
            >
              {/* League & Time */}
              <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-1.5 mb-2">
                <span className="text-xs font-black text-green-400 uppercase tracking-wide flex items-center gap-1.5">
                  {m.competitionEmblem ? (
                    <img 
                      src={m.competitionEmblem} 
                      alt="" 
                      className="w-4 h-4 object-contain" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <Star className="w-3.5 h-3.5 fill-green-400 text-green-400 inline" />
                  )}
                  {m.league}
                </span>
                <span className="text-[11px] font-mono text-zinc-300 flex items-center gap-1 bg-zinc-900/90 px-2.5 py-0.5 rounded-md border border-zinc-800">
                  <Clock className="w-3 h-3 text-green-400" /> {m.time}
                </span>
              </div>

              {/* Teams & Score Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
                
                {/* Home vs Away with optional official crests */}
                <div className="sm:col-span-7 space-y-1.5">
                  <div className="text-base sm:text-lg font-black text-white flex flex-wrap items-center gap-2 tracking-tight">
                    <div className="flex items-center gap-1.5">
                      {m.homeCrest && (
                        <img 
                          src={m.homeCrest} 
                          alt="" 
                          className="w-5 h-5 sm:w-6 sm:h-6 object-contain" 
                          referrerPolicy="no-referrer" 
                        />
                      )}
                      <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{m.homeTeam}</span>
                    </div>
                    
                    <span className="text-yellow-400 font-black text-[11px] px-1.5 py-0.5 rounded bg-yellow-950/60 border border-yellow-500/30">VS</span>

                    <div className="flex items-center gap-1.5">
                      {m.awayCrest && (
                        <img 
                          src={m.awayCrest} 
                          alt="" 
                          className="w-5 h-5 sm:w-6 sm:h-6 object-contain" 
                          referrerPolicy="no-referrer" 
                        />
                      )}
                      <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{m.awayTeam}</span>
                    </div>
                  </div>

                  {/* Masked Outcome Prediction Line */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-xs text-zinc-300 font-bold uppercase tracking-wider">OUTCOME PREDICTION:</span>
                    <span className="text-sm font-mono font-black text-yellow-300 bg-yellow-950/80 border border-yellow-400/60 px-2.5 py-0.5 rounded-lg shadow-[0_0_10px_rgba(234,179,8,0.3)] flex items-center gap-1.5 animate-pulse">
                      <Lock className="w-3.5 h-3.5 text-yellow-400 inline" />
                      {m.prediction || '* - *'}
                    </span>
                  </div>
                </div>

                {/* Match Status & Confidence Tag (Single Combined Odds is shown in Ticket Total) */}
                <div className="sm:col-span-5 flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800/80">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-zinc-400 block font-black uppercase tracking-wider">COMBO SELECTION</span>
                    <span className="text-xs sm:text-sm font-black text-emerald-400 flex items-center gap-1 sm:justify-end">
                      <Lock className="w-3 h-3 text-yellow-400" />
                      MATCH #{idx + 1} LOCKED
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-md border border-emerald-500/40 flex items-center gap-1 shadow-sm mt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {m.confidence}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Staking & Payout Calculator Box (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#0c2214] via-zinc-950 to-black border-2 border-green-500/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-2xl space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 mb-2 border-b border-green-500/30 pb-2">
              <span className="flex items-center gap-1.5 text-green-400 font-black text-sm">
                <Trophy className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                VVIP TICKET SLIP TOTAL
              </span>
              <span className="bg-yellow-400 text-black font-mono font-black px-2.5 py-0.5 rounded-md shadow-sm text-xs">
                {matches.length} MATCH COMBO
              </span>
            </div>

            {/* Combined Odds Single Display */}
            <div className="bg-gradient-to-r from-green-950/80 via-emerald-900/50 to-black p-3 rounded-xl border border-green-500/50 mb-3 text-center shadow-lg">
              <span className="text-[10px] text-zinc-300 block font-black uppercase tracking-wider">
                COMBINED {matches.length}-MATCH VVIP ODDS
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-yellow-400 tracking-tight glow-gold my-0.5">
                @{totalOdds.toFixed(2)}
              </div>
              <span className="text-[10px] font-bold text-green-300">
                ★ 100% Combined Multiplier
              </span>
            </div>

            {/* Stake Quick Buttons */}
            <div className="bg-black/60 p-3 rounded-xl border border-zinc-800 mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-zinc-300 font-bold">SELECT STAKE (USDT / $):</span>
                <span className="text-xs font-mono font-black text-yellow-400">${stakeAmount} USDT</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[20, 50, 100, 250].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setStakeAmount(amt);
                      soundManager.playSpinTick();
                    }}
                    className={`py-1.5 rounded-lg text-xs font-mono font-black transition-all ${
                      stakeAmount === amt
                        ? 'bg-green-400 text-black shadow-[0_0_10px_rgba(34,197,94,0.6)]'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Payout Output */}
            <div className="bg-gradient-to-r from-green-950 via-emerald-950 to-zinc-950 p-3.5 rounded-xl border border-green-400/50 text-center shadow-inner">
              <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">
                ESTIMATED VVIP WINNING PAYOUT
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-green-300 tracking-tight glow-green my-0.5">
                +${Number(potentialReturn).toLocaleString()} USDT
              </div>
              <span className="text-[11px] text-yellow-300 font-bold flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-400 inline" />
                100% Insured Ticket Guarantee
              </span>
            </div>
          </div>

          {/* Action Unlock Button */}
          <button
            onClick={handleCopySlip}
            className="w-full py-3.5 bg-gradient-to-r from-green-400 via-emerald-500 to-green-500 hover:from-green-300 hover:to-emerald-400 text-black font-black text-xs sm:text-sm rounded-xl border border-green-200 shadow-[0_0_20px_rgba(34,197,94,0.7)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] pulse-cta"
          >
            <Send className="w-4 h-4 text-black fill-black" />
            <span>{copiedSlip ? '✓ VVIP SLIP COPIED TO TELEGRAM!' : 'UNLOCK VVIP SLIP & BOOKING CODE'}</span>
          </button>

          {/* Quick Anchor to Real Football Standings directly under the slip */}
          <div className="pt-2 border-t border-zinc-800/80 space-y-2">
            <a
              href="#real-football-standings"
              className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-500/20 via-green-500/15 to-emerald-500/20 hover:bg-emerald-500/30 border border-green-500/40 rounded-xl text-center text-xs font-black text-green-300 flex items-center justify-center gap-2 transition shadow-md"
            >
              <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
              <span className="truncate">📊 VIEW REAL FOOTBALL TABLE STANDINGS BELOW (EPL, LaLiga, Serie A...)</span>
              <span className="text-[10px] bg-green-500 text-black px-1.5 py-0.5 rounded font-black uppercase shrink-0">
                LIVE API
              </span>
            </a>

            <a
              href="#virtue-games-suite"
              className="w-full py-2.5 px-3 bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 rounded-xl text-center text-xs font-black text-yellow-300 flex items-center justify-center gap-2 transition"
            >
              <Gamepad2 className="w-4 h-4 text-yellow-400 shrink-0" />
              <span className="truncate">🎮 PLAY VIRTUE GAMES BELOW (Football, Horses 🐎, Cars 🏎, Spin 🎡)</span>
              <span className="text-[10px] bg-yellow-400 text-black px-1.5 py-0.5 rounded font-black uppercase shrink-0">
                USE BALANCE
              </span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};


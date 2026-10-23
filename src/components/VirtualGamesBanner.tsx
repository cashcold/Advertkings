import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  Volume2,
  VolumeX,
  History,
  Sparkles,
  Zap,
  Wallet,
  Send,
  PlusCircle,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { AuthUser, VirtualBetHistoryItem } from '../types';
import { VirtualFootballGame } from './virtual-games/VirtualFootballGame';
import { VirtualHorseGame } from './virtual-games/VirtualHorseGame';
import { VirtualDogGame } from './virtual-games/VirtualDogGame';
import { VirtualCarRaceGame } from './virtual-games/VirtualCarRaceGame';
import { VirtualSpinGame } from './virtual-games/VirtualSpinGame';
import { VirtualPenaltyGame } from './virtual-games/VirtualPenaltyGame';

interface VirtualGamesBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
  currentUser?: AuthUser | null;
  currentBalance?: number;
  currency?: string;
  onUpdateBalance?: (delta: number, reason: string) => Promise<boolean> | boolean;
  onOpenReload?: () => void;
}

type VirtueGameTab = 'football' | 'horse' | 'dog' | 'car' | 'spin' | 'penalty';

const LIVE_WINNERS_TICKER = [
  { user: 'Liam_VIP', game: '🐎 Virtue Horse', amount: '+$360.00', odds: '@12.00', time: '12s ago' },
  { user: 'Sasha_K', game: '🐕 Virtue Dog Derby', amount: '+$280.00', odds: '@14.00', time: '19s ago' },
  { user: 'Carlos_M', game: '⚽ Virtue Football', amount: '+$142.50', odds: '@2.85', time: '28s ago' },
  { user: 'Elena_Dubai', game: '🎡 Virtue Spin', amount: '+$500.00', odds: '@50.0X', time: '41s ago' },
  { user: 'Tariq_Crypto', game: '🏎 Virtue Car Race', amount: '+$290.00', odds: '@2.90', time: '1m ago' },
  { user: 'Arthur_UK', game: '🥅 Virtue Penalty', amount: '+$320.00', odds: '@32.0X', time: '2m ago' },
];

export const VirtualGamesBanner: React.FC<VirtualGamesBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
  currentUser,
  currentBalance = 50.0,
  currency = 'USD',
  onUpdateBalance,
  onOpenReload,
}) => {
  const [activeTab, setActiveTab] = useState<VirtueGameTab>('football');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [livePlayers, setLivePlayers] = useState<number>(3842);
  const [betHistory, setBetHistory] = useState<VirtualBetHistoryItem[]>([
    {
      id: 'init-1',
      game: 'Virtue Football',
      market: '1X2',
      selection: 'Real Madrid (Home Win)',
      stake: 25,
      odds: 2.35,
      payout: 58.75,
      result: 'won',
      timestamp: 'Today, 10:14',
    },
    {
      id: 'init-2',
      game: 'Virtue Horse 🐎',
      market: 'Winner',
      selection: '#2 Desert Mirage',
      stake: 10,
      odds: 4.50,
      payout: 45.00,
      result: 'won',
      timestamp: 'Today, 09:42',
    },
  ]);

  // Sync sound manager enabled state
  useEffect(() => {
    soundManager.enabled = soundOn;
  }, [soundOn]);

  // Live players fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setLivePlayers((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.enabled = next;
    if (next) soundManager.playCoin();
  };

  const handleRecordBet = (item: VirtualBetHistoryItem) => {
    setBetHistory((prev) => [item, ...prev]);
    incrementClicks();
  };

  const executeBalanceUpdate = async (delta: number, reason: string): Promise<boolean> => {
    if (onUpdateBalance) {
      const res = await onUpdateBalance(delta, reason);
      return Boolean(res);
    }
    return true;
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-6" id="virtue-games-suite">
      <div className="relative rounded-3xl bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border-2 border-yellow-500/50 p-4 sm:p-6 lg:p-8 shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden">
        {/* Background glow flares */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & VIP Balance Dashboard */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-zinc-800/80 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-black text-xs rounded-full shadow-[0_0_15px_rgba(234,179,8,0.6)] flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                VIRTUE GAMES SUITE
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                24/7 INSTANT ROUNDS
              </span>
              <span className="text-zinc-400 text-xs font-mono hidden sm:inline">
                • {livePlayers.toLocaleString()} Online Players
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Play Virtue Games With VIP Balance</span>
              <Trophy className="w-6 h-6 text-yellow-400 shrink-0" />
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Virtue Football ⚽, Royal Horse Derby 🐎, Grand Prix Cars 🏎, Mega Spin 🎡 & Penalty Shootouts 🥅
            </p>
          </div>

          {/* Balance & Control Box */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* VIP Balance Display */}
            <div className="flex items-center gap-3 bg-zinc-950/90 border border-yellow-500/50 px-4 py-2.5 rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.2)]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-black font-black shadow">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                  {currentUser?.fullName || 'VIP Member'} Balance
                </span>
                <span className="text-lg sm:text-xl font-black font-mono text-yellow-400 tracking-tight">
                  ${currentBalance.toFixed(2)} {currency}
                </span>
              </div>

              {onOpenReload && (
                <button
                  type="button"
                  onClick={onOpenReload}
                  className="ml-2 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Deposit / Withdraw</span>
                </button>
              )}
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                soundOn
                  ? 'bg-yellow-500/15 border-yellow-400 text-yellow-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
              title={soundOn ? 'Mute SFX' : 'Enable SFX'}
            >
              {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* History Toggle */}
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className={`px-3 py-2 rounded-xl border text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                showHistory
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Bets ({betHistory.length})</span>
            </button>
          </div>
        </div>

        {/* Live Community Winners Ticker */}
        <div className="py-2.5 px-3 bg-black/60 rounded-xl border border-zinc-800/80 my-4 flex items-center gap-3 overflow-hidden text-xs">
          <div className="flex items-center gap-1.5 text-yellow-400 font-black shrink-0 uppercase tracking-wider text-[11px]">
            <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
            <span>Live Virtue Wins:</span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap text-zinc-300 text-[11px]">
            {LIVE_WINNERS_TICKER.map((w, i) => (
              <div key={i} className="flex items-center gap-1.5 shrink-0 bg-zinc-900/60 px-2.5 py-1 rounded-lg border border-zinc-800">
                <span className="font-bold text-white">{w.user}</span>
                <span className="text-zinc-400">•</span>
                <span>{w.game}</span>
                <span className="text-emerald-400 font-mono font-black">{w.amount}</span>
                <span className="text-yellow-400 font-mono text-[10px]">{w.odds}</span>
                <span className="text-zinc-500 text-[9px]">{w.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Virtue Game Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('football');
              if (soundOn) soundManager.playSpinTick();
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'football'
                ? 'bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-transparent border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-102'
                : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">⚽</span>
              <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                12s LIVE
              </span>
            </div>
            <strong className="text-xs sm:text-sm font-black block text-white">Instant Football</strong>
            <span className="text-[10px] text-zinc-400">1X2, 1UP & Over/Under</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('horse');
              if (soundOn) soundManager.playSpinTick();
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'horse'
                ? 'bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border-yellow-400 text-white shadow-[0_0_20px_rgba(234,179,8,0.3)] scale-102'
                : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">🐎</span>
              <span className="text-[10px] font-mono font-black text-yellow-400 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                18X DERBY
              </span>
            </div>
            <strong className="text-xs sm:text-sm font-black block text-white">Virtue Horse</strong>
            <span className="text-[10px] text-zinc-400">6 Thoroughbreds</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('dog');
              if (soundOn) soundManager.playSpinTick();
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'dog'
                ? 'bg-gradient-to-br from-rose-500/20 via-rose-600/10 to-transparent border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-102'
                : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">🐕</span>
              <span className="text-[10px] font-mono font-black text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                14X GREYHOUND
              </span>
            </div>
            <strong className="text-xs sm:text-sm font-black block text-white">Virtue Dog</strong>
            <span className="text-[10px] text-zinc-400">6 Trap Derby</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('car');
              if (soundOn) soundManager.playSpinTick();
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'car'
                ? 'bg-gradient-to-br from-cyan-500/20 via-cyan-600/10 to-transparent border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-102'
                : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">🏎️</span>
              <span className="text-[10px] font-mono font-black text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                340 KM/H
              </span>
            </div>
            <strong className="text-xs sm:text-sm font-black block text-white">Virtue Car Race</strong>
            <span className="text-[10px] text-zinc-400">Grand Prix DRS</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('spin');
              if (soundOn) soundManager.playSpinTick();
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'spin'
                ? 'bg-gradient-to-br from-yellow-500/20 via-yellow-600/10 to-transparent border-yellow-300 text-white shadow-[0_0_20px_rgba(234,179,8,0.4)] scale-102'
                : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">🎡</span>
              <span className="text-[10px] font-mono font-black text-yellow-300 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                100X MEGA
              </span>
            </div>
            <strong className="text-xs sm:text-sm font-black block text-white">Virtue Spin</strong>
            <span className="text-[10px] text-zinc-400">VIP Fortune Wheel</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('penalty');
              if (soundOn) soundManager.playSpinTick();
            }}
            className={`col-span-2 sm:col-span-1 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === 'penalty'
                ? 'bg-gradient-to-br from-teal-500/20 via-teal-600/10 to-transparent border-teal-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] scale-102'
                : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">🥅</span>
              <span className="text-[10px] font-mono font-black text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
                32X STREAK
              </span>
            </div>
            <strong className="text-xs sm:text-sm font-black block text-white">Virtue Penalty</strong>
            <span className="text-[10px] text-zinc-400">Golden Boot Kicks</span>
          </button>
        </div>

        {/* Selected Game Screen */}
        <div className="bg-zinc-950/80 rounded-3xl border border-zinc-800/90 p-4 sm:p-6">
          {activeTab === 'football' && (
            <VirtualFootballGame
              userBalance={currentBalance}
              onUpdateBalance={executeBalanceUpdate}
              onRecordBet={handleRecordBet}
              onOpenReload={onOpenReload || (() => {})}
              soundEnabled={soundOn}
            />
          )}

          {activeTab === 'horse' && (
            <VirtualHorseGame
              userBalance={currentBalance}
              onUpdateBalance={executeBalanceUpdate}
              onRecordBet={handleRecordBet}
              onOpenReload={onOpenReload || (() => {})}
              soundEnabled={soundOn}
            />
          )}

          {activeTab === 'dog' && (
            <VirtualDogGame
              userBalance={currentBalance}
              onUpdateBalance={executeBalanceUpdate}
              onRecordBet={handleRecordBet}
              onOpenReload={onOpenReload || (() => {})}
              soundEnabled={soundOn}
            />
          )}

          {activeTab === 'car' && (
            <VirtualCarRaceGame
              userBalance={currentBalance}
              onUpdateBalance={executeBalanceUpdate}
              onRecordBet={handleRecordBet}
              onOpenReload={onOpenReload || (() => {})}
              soundEnabled={soundOn}
            />
          )}

          {activeTab === 'spin' && (
            <VirtualSpinGame
              userBalance={currentBalance}
              onUpdateBalance={executeBalanceUpdate}
              onRecordBet={handleRecordBet}
              onOpenReload={onOpenReload || (() => {})}
              soundEnabled={soundOn}
            />
          )}

          {activeTab === 'penalty' && (
            <VirtualPenaltyGame
              userBalance={currentBalance}
              onUpdateBalance={executeBalanceUpdate}
              onRecordBet={handleRecordBet}
              onOpenReload={onOpenReload || (() => {})}
              soundEnabled={soundOn}
            />
          )}
        </div>

        {/* Bet History Modal / Accordion */}
        {showHistory && (
          <div className="mt-6 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-black text-white text-sm flex items-center gap-1.5">
                <History className="w-4 h-4 text-yellow-400" />
                <span>Your Virtue Bet History</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="text-zinc-500 hover:text-white text-xs cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            {betHistory.length === 0 ? (
              <p className="text-zinc-500 py-4 text-center">No Virtue bets placed yet. Play a game above!</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {betHistory.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      item.result === 'won'
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-bold">{item.game}</strong>
                        <span className="text-[10px] text-zinc-400">({item.market})</span>
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                            item.result === 'won'
                              ? 'bg-emerald-400 text-black'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {item.result.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{item.selection}</p>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-[10px] text-zinc-500 block">
                        Stake: ${item.stake.toFixed(2)} • @{item.odds.toFixed(2)}
                      </span>
                      <strong
                        className={`text-xs font-black ${
                          item.result === 'won' ? 'text-emerald-400' : 'text-zinc-400'
                        }`}
                      >
                        {item.result === 'won' ? `+$${item.payout.toFixed(2)} USD` : '$0.00'}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Banner Footer with Telegram Community VIP Bot */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Fair Certified Virtual Random Number Generator (RNG) • Instant Balance Crediting</span>
          </div>

          <button
            type="button"
            onClick={() =>
              onOpenTelegram(
                '🎮 VIRTUE GAMES VIP ACCESS:\n\nHello VIP Manager, I am playing Virtue Games on the portal and would like access to the 24/7 Virtual Sports Prediction & Telegram Bot VIP Group!'
              )
            }
            className="inline-flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 font-bold transition cursor-pointer self-start sm:self-auto"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Get 24/7 Telegram Virtual AI Signals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};

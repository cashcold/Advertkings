import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Zap, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  Flame, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Layers,
  Award,
  Clock,
  Trophy,
  Bot,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Wallet,
  Play,
  XCircle,
  Percent,
  Check
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { MT5CandlestickChart, MT5PairKey, MT5Timeframe, BrokerPosition, ClosedPosition } from './MT5CandlestickChart';

export interface ForexTradingBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
  currentUser?: any;
  currentBalance?: number;
  currency?: string;
  onUpdateBalance?: (delta: number, reason: string) => void;
  onOpenReload?: () => void;
}

type BotPreset = 'gold' | 'bch' | 'quantum' | 'us30';

export const FOREX_WIN_PROBABILITY = 0.42;
export const FOREX_LOSS_PROBABILITY = 0.58;

interface LiveTradeExecution {
  id: string;
  bot: string;
  pair: string;
  profit: string;
  pips: string;
  time: string;
  isWin: boolean;
}

const BOT_MODELS = {
  gold: {
    name: '🏆 99.4% Gold Sniper (XAUUSDm)',
    shortName: '99.4% Gold',
    badge: '99.4%',
    desc: '99.4% Verified Win Rate • Zero Drawdown Hedging • TP +120 Pips',
    winRate: 99.4,
    preferredPair: 'XAUUSDm' as MT5PairKey,
    tp: '+120 Pips',
    sl: '-45 Pips',
    targetPriceGain: 1.8,
  },
  bch: {
    name: '⚡ 99.5% Bitcoin Scalper (BCHUSDm)',
    shortName: '99.5% Bitcoin',
    badge: '99.5%',
    desc: '99.5% Verified Win Rate • Volatility Momentum Scalper',
    winRate: 99.5,
    preferredPair: 'BCHUSDm' as MT5PairKey,
    tp: '+95 Pips',
    sl: '-35 Pips',
    targetPriceGain: 2.5,
  },
  quantum: {
    name: '🤖 99.2% Quantum Neural EA (EURUSDm)',
    shortName: '99.2% Quantum',
    badge: '99.2%',
    desc: '99.2% Verified Win Rate • Quantum Spread Grid EA',
    winRate: 99.2,
    preferredPair: 'EURUSDm' as MT5PairKey,
    tp: '+85 Pips',
    sl: '-30 Pips',
    targetPriceGain: 0.0018,
  },
  us30: {
    name: '🚀 99.6% Crypto Sniper (BTCUSDm)',
    shortName: '99.6% Crypto',
    badge: '99.6%',
    desc: '99.6% Verified Win Rate • Institutional Order Flow Sniper',
    winRate: 99.6,
    preferredPair: 'BTCUSDm' as MT5PairKey,
    tp: '+350 Pips',
    sl: '-120 Pips',
    targetPriceGain: 380,
  }
};

const INITIAL_TRADES: LiveTradeExecution[] = [
  { id: '1', bot: '99.4% Gold Sniper EA', pair: 'XAUUSDm', profit: '+$640.00', pips: '+42 Pips', time: 'Just now', isWin: true },
  { id: '2', bot: '99.5% Bitcoin Scalper', pair: 'BCHUSDm', profit: '+$420.00', pips: '+28 Pips', time: '8s ago', isWin: true },
  { id: '3', bot: '99.2% Quantum Neural EA', pair: 'EURUSDm', profit: '+$360.00', pips: '+24 Pips', time: '18s ago', isWin: true },
];

const INITIAL_CLOSED_HISTORY: ClosedPosition[] = [
  { id: 'cl-1', ticket: 481023, symbol: 'XAUUSDm', type: 'BUY', lot: 0.05, margin: 2.50, entryPrice: 2378.10, closePrice: 2383.60, profit: 8.40, openTime: '09:12:00', closeTime: '09:24:18', outcome: 'WIN' },
  { id: 'cl-2', ticket: 481105, symbol: 'EURUSDm', type: 'SELL', lot: 0.10, margin: 5.00, entryPrice: 1.0890, closePrice: 1.0865, profit: 6.20, openTime: '09:30:10', closeTime: '09:42:05', outcome: 'WIN' },
  { id: 'cl-3', ticket: 481219, symbol: 'XAUUSDm', type: 'SELL', lot: 0.05, margin: 2.50, entryPrice: 2381.20, closePrice: 2384.50, profit: -5.10, openTime: '09:48:22', closeTime: '09:59:11', outcome: 'LOSS' },
  { id: 'cl-4', ticket: 481340, symbol: 'BCHUSDm', type: 'BUY', lot: 0.02, margin: 1.00, entryPrice: 388.50, closePrice: 384.20, profit: -3.80, openTime: '10:02:15', closeTime: '10:14:40', outcome: 'LOSS' },
  { id: 'cl-5', ticket: 481452, symbol: 'BTCUSDm', type: 'BUY', lot: 0.01, margin: 1.50, entryPrice: 64200, closePrice: 64580, profit: 9.50, openTime: '10:16:04', closeTime: '10:25:33', outcome: 'WIN' },
  { id: 'cl-6', ticket: 481580, symbol: 'EURUSDm', type: 'BUY', lot: 0.05, margin: 2.50, entryPrice: 1.0875, closePrice: 1.0850, profit: -4.30, openTime: '10:28:10', closeTime: '10:35:48', outcome: 'LOSS' },
  { id: 'cl-7', ticket: 481699, symbol: 'XAUUSDm', type: 'BUY', lot: 0.05, margin: 2.50, entryPrice: 2385.00, closePrice: 2381.80, profit: -4.90, openTime: '10:37:02', closeTime: '10:41:50', outcome: 'LOSS' },
];

export const ForexTradingBanner: React.FC<ForexTradingBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
  currentUser,
  currentBalance = 50.0,
  currency = 'USD',
  onUpdateBalance,
  onOpenReload,
}) => {
  const [selectedBot, setSelectedBot] = useState<BotPreset>('gold');
  const [selectedPair, setSelectedPair] = useState<MT5PairKey>('XAUUSDm');
  const [selectedTimeframe, setSelectedTimeframe] = useState<MT5Timeframe>('M5');
  const [leverage, setLeverage] = useState<'1:500' | '1:1000' | '1:2000'>('1:2000');
  const [copiedSignal, setCopiedSignal] = useState<boolean>(false);
  const [liveTrades, setLiveTrades] = useState<LiveTradeExecution[]>(INITIAL_TRADES);
  
  // Initialize starter position obeying 42% Win / 58% Loss rate when user starts
  const [activePositions, setActivePositions] = useState<BrokerPosition[]>(() => {
    const starterIsWin = Math.random() < FOREX_WIN_PROBABILITY;
    return [
      {
        id: 'demo-pos-1',
        ticket: 489201,
        symbol: 'XAUUSDm',
        type: 'BUY',
        lot: 0.05,
        margin: 2.50,
        entryPrice: 2382.40,
        currentPrice: starterIsWin ? 2384.70 : 2380.60,
        profit: starterIsWin ? 3.80 : -2.85,
        pips: starterIsWin ? 14 : -11,
        openTime: '10:42:15',
        isAiBot: true,
        targetOutcome: starterIsWin ? 'WIN' : 'LOSS',
      }
    ];
  });
  
  // Pre-seed closed history with 42.8% Win (3/7) and 57.2% Loss (4/7)
  const [closedPositions, setClosedPositions] = useState<ClosedPosition[]>(INITIAL_CLOSED_HISTORY);
  const [brokerToast, setBrokerToast] = useState<string | null>(null);
  const [isAiAutoPilot, setIsAiAutoPilot] = useState<boolean>(false);

  const activeBotConfig = BOT_MODELS[selectedBot];
  const brokerAccountName = currentUser?.username 
    ? `AdvKings ECN #${currentUser.username.slice(0, 8)}` 
    : 'AdvKings Live ECN #AK-89201';

  // Calculate account metrics
  const totalFloatingPnl = activePositions.reduce((sum, p) => sum + p.profit, 0);
  const totalMarginUsed = activePositions.reduce((sum, p) => sum + p.margin, 0);
  const equity = currentBalance + totalFloatingPnl;
  const freeMargin = Math.max(0, equity - totalMarginUsed);
  const marginLevel = totalMarginUsed > 0 ? ((equity / totalMarginUsed) * 100).toFixed(0) : '∞';

  // Calculate session win/loss statistics (42% Win / 58% Loss distribution)
  const sessionWins = closedPositions.filter((c) => c.profit >= 0).length;
  const sessionLosses = closedPositions.filter((c) => c.profit < 0).length;
  const totalClosed = closedPositions.length;
  const sessionWinRate = totalClosed > 0 ? ((sessionWins / totalClosed) * 100).toFixed(1) : '42.0';
  const sessionLossRate = totalClosed > 0 ? ((sessionLosses / totalClosed) * 100).toFixed(1) : '58.0';
  const totalRealizedPnl = closedPositions.reduce((sum, c) => sum + c.profit, 0);

  // Floating PnL simulation on active broker positions
  useEffect(() => {
    if (activePositions.length === 0) return;

    const interval = setInterval(() => {
      setActivePositions((prev) =>
        prev.map((pos) => {
          // Enforce 42% Win / 58% Loss trajectory
          const isTargetWin = pos.targetOutcome === 'WIN';
          const tickFavorable = isTargetWin ? Math.random() < 0.78 : Math.random() < 0.22;
          const delta = (Math.random() * 0.40 + 0.12) * (tickFavorable ? 1 : -0.85);
          let nextProfit = +(pos.profit + delta).toFixed(2);

          // Realistic guardrails based on margin
          if (isTargetWin) {
            nextProfit = Math.max(-0.25, Math.min(22.0 * (pos.lot / 0.05), nextProfit));
          } else {
            nextProfit = Math.max(-pos.margin * 0.95, Math.min(0.25, nextProfit));
          }

          const pipsDelta = tickFavorable ? 1 : -1;
          const nextPips = Math.round(pos.pips + pipsDelta);
          return {
            ...pos,
            profit: nextProfit,
            pips: nextPips,
          };
        })
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [activePositions.length]);

  // AI Auto-Pilot: opens trades with play balance obeying 42% Win / 58% Loss distribution
  useEffect(() => {
    if (!isAiAutoPilot) return;

    const autoInterval = setInterval(() => {
      if (activePositions.length >= 4) return;
      if (currentBalance < 1.0) return;

      const randomPresetKey = (Object.keys(BOT_MODELS) as BotPreset[])[Math.floor(Math.random() * 4)];
      const botPreset = BOT_MODELS[randomPresetKey];
      const botLot = 0.02;
      const margin = +(botLot * 10).toFixed(2); // $0.20 margin

      if (currentBalance >= margin) {
        if (onUpdateBalance) {
          onUpdateBalance(-margin, `AdvKings AI Sniper Margin: ${botPreset.preferredPair} 0.02 Lot`);
        }
        const ticketNum = Math.floor(200000 + Math.random() * 800000);
        const isWin = Math.random() < FOREX_WIN_PROBABILITY;
        const newPos: BrokerPosition = {
          id: `auto-${Date.now()}`,
          ticket: ticketNum,
          symbol: botPreset.preferredPair,
          type: 'BUY',
          lot: botLot,
          margin,
          entryPrice: 2380.0,
          currentPrice: isWin ? 2381.20 : 2378.80,
          profit: isWin ? 0.35 : -0.40,
          pips: isWin ? 4 : -4,
          openTime: new Date().toLocaleTimeString(),
          isAiBot: true,
          targetOutcome: isWin ? 'WIN' : 'LOSS',
        };

        setActivePositions((prev) => [newPos, ...prev]);
        soundManager.playCoin();
        showBrokerToast(`🤖 AI Auto-Pilot opened BUY 0.02 ${botPreset.preferredPair} • Zero Drawdown EA Active`);
      }
    }, 9000);

    return () => clearInterval(autoInterval);
  }, [isAiAutoPilot, currentBalance, activePositions.length, onUpdateBalance]);

  // Dynamic live trade executions generator reflecting 42% Win and 58% Loss reality
  useEffect(() => {
    const interval = setInterval(() => {
      const bots = [
        { name: '99.4% Gold Sniper EA', pair: 'XAUUSDm' },
        { name: '99.5% Bitcoin Scalper', pair: 'BCHUSDm' },
        { name: '99.6% Crypto Sniper', pair: 'BTCUSDm' },
        { name: '99.2% Quantum Neural EA', pair: 'EURUSDm' },
      ];
      const randomBot = bots[Math.floor(Math.random() * bots.length)];
      const isWinTrade = Math.random() < FOREX_WIN_PROBABILITY;

      const newEntry: LiveTradeExecution = {
        id: String(Date.now()),
        bot: randomBot.name,
        pair: randomBot.pair,
        profit: isWinTrade 
          ? `+$${(Math.random() * 550 + 220).toFixed(2)}`
          : `-$${(Math.random() * 450 + 160).toFixed(2)}`,
        pips: isWinTrade 
          ? `+${Math.floor(Math.random() * 40 + 20)} Pips`
          : `-${Math.floor(Math.random() * 32 + 15)} Pips`,
        time: 'Just now',
        isWin: isWinTrade,
      };

      setLiveTrades((prev) => {
        const updated = prev.slice(0, 2).map((item, idx) => ({
          ...item,
          time: idx === 0 ? '12s ago' : '45s ago',
        }));
        return [newEntry, ...updated];
      });
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const showBrokerToast = (msg: string) => {
    setBrokerToast(msg);
    setTimeout(() => setBrokerToast(null), 4500);
  };

  const handleBotSelect = (preset: BotPreset) => {
    setSelectedBot(preset);
    setSelectedPair(BOT_MODELS[preset].preferredPair);
    soundManager.playCoin();
  };

  // Place trade on AdvKings Broker using user's Play Balance (42% Win / 58% Loss)
  const handlePlaceBrokerTrade = (type: 'BUY' | 'SELL', lot: number, price: number) => {
    incrementClicks();
    const margin = +(lot * 10).toFixed(2); // 1:1000 margin calculation ($0.10 per 0.01 lot)

    if (currentBalance < margin) {
      soundManager.playSpinTick();
      showBrokerToast(`⚠️ Insufficient Play Balance ($${currentBalance.toFixed(2)}). Need $${margin.toFixed(2)} margin. Tap +Reload!`);
      return;
    }

    // Deduct margin from play balance
    if (onUpdateBalance) {
      onUpdateBalance(-margin, `AdvKings Broker Margin: ${type} ${lot} ${selectedPair}`);
    }

    // 42% Win / 58% Loss probability assignment
    const isWinningTrade = Math.random() < FOREX_WIN_PROBABILITY;
    const targetOutcome: 'WIN' | 'LOSS' = isWinningTrade ? 'WIN' : 'LOSS';
    const initialProfit = isWinningTrade
      ? +(lot * 2.2).toFixed(2)
      : -(lot * 3.2).toFixed(2);
    const initialPips = isWinningTrade ? 3 : -3;

    const ticket = Math.floor(100000 + Math.random() * 900000);
    const newPos: BrokerPosition = {
      id: `pos-${Date.now()}`,
      ticket,
      symbol: selectedPair,
      type,
      lot,
      margin,
      entryPrice: price,
      currentPrice: price,
      profit: initialProfit,
      pips: initialPips,
      openTime: new Date().toLocaleTimeString(),
      isAiBot: false,
      targetOutcome,
    };

    setActivePositions((prev) => [newPos, ...prev]);
    soundManager.playWinFanfare();
    showBrokerToast(
      `✓ AdvKings ECN ${type} ${lot} LOT @ ${price} OPENED [Ticket #${ticket}] • 99% Bot Hedging Active`
    );
  };

  // Close position and return margin + realized profit to Play Balance
  const handleClosePosition = (id: string) => {
    incrementClicks();
    const pos = activePositions.find((p) => p.id === id);
    if (!pos) return;

    const payout = +(Math.max(0, pos.margin + pos.profit)).toFixed(2);

    if (onUpdateBalance) {
      onUpdateBalance(payout, `AdvKings Broker Cashout: #${pos.ticket} ${pos.symbol} ${pos.profit >= 0 ? '+' : ''}$${pos.profit.toFixed(2)}`);
    }

    const isWin = pos.profit >= 0;
    const closed: ClosedPosition = {
      id: pos.id,
      ticket: pos.ticket,
      symbol: pos.symbol,
      type: pos.type,
      lot: pos.lot,
      margin: pos.margin,
      entryPrice: pos.entryPrice,
      closePrice: pos.currentPrice,
      profit: pos.profit,
      openTime: pos.openTime,
      closeTime: new Date().toLocaleTimeString(),
      isAiBot: pos.isAiBot,
      outcome: isWin ? 'WIN' : 'LOSS',
    };

    setClosedPositions((prev) => [closed, ...prev]);
    setActivePositions((prev) => prev.filter((p) => p.id !== id));

    if (isWin) {
      soundManager.playWinFanfare();
      showBrokerToast(`🏆 Position #${pos.ticket} Closed: +$${pos.profit.toFixed(2)} Profit returned to Play Balance!`);
    } else {
      soundManager.playSpinTick();
      showBrokerToast(`Position #${pos.ticket} Closed: -$${Math.abs(pos.profit).toFixed(2)} deducted.`);
    }
  };

  // Close all open trades at once
  const handleCloseAllTrades = () => {
    if (activePositions.length === 0) return;
    incrementClicks();

    let totalPayout = 0;
    let winCount = 0;
    let lossCount = 0;
    const closedList: ClosedPosition[] = [];

    activePositions.forEach((pos) => {
      const payout = Math.max(0, pos.margin + pos.profit);
      totalPayout += payout;
      if (pos.profit >= 0) winCount++;
      else lossCount++;

      closedList.push({
        id: pos.id,
        ticket: pos.ticket,
        symbol: pos.symbol,
        type: pos.type,
        lot: pos.lot,
        margin: pos.margin,
        entryPrice: pos.entryPrice,
        closePrice: pos.currentPrice,
        profit: pos.profit,
        openTime: pos.openTime,
        closeTime: new Date().toLocaleTimeString(),
        isAiBot: pos.isAiBot,
        outcome: pos.profit >= 0 ? 'WIN' : 'LOSS',
      });
    });

    if (onUpdateBalance && totalPayout > 0) {
      onUpdateBalance(+totalPayout.toFixed(2), `AdvKings Close All Trades (${activePositions.length} positions)`);
    }

    setClosedPositions((prev) => [...closedList, ...prev]);
    setActivePositions([]);
    soundManager.playWinFanfare();
    showBrokerToast(`🏆 Closed ${activePositions.length} positions (${winCount} Wins / ${lossCount} Losses)! Total $${totalPayout.toFixed(2)} cashed out to Play Balance.`);
  };

  // Instant Free Reload of Play Balance
  const handleReloadPlayBalance = () => {
    soundManager.playWinFanfare();
    if (onOpenReload) {
      onOpenReload();
    } else if (onUpdateBalance) {
      onUpdateBalance(100.0, 'AdvKings Play Balance Virtual Top-up');
    }
    showBrokerToast(`✓ $100.00 Play Balance credited to your AdvKings Broker account!`);
  };

  const handleCopySignal = () => {
    incrementClicks();
    soundManager.playWinFanfare();
    setCopiedSignal(true);
    setTimeout(() => setCopiedSignal(false), 2500);
    onOpenTelegram(
      `🏆 99% WIN FOREX AI BOT ACTIVATION REQUEST:\n` +
      `• Broker: AdvKings Markets ECN (STP Live01)\n` +
      `• Account ID: ${brokerAccountName}\n` +
      `• Bot Engine: ${activeBotConfig.name}\n` +
      `• Accuracy: ${activeBotConfig.winRate}% Verified Win Rate\n` +
      `• Instrument: ${selectedPair} (MT5 ${selectedTimeframe} Candlestick Chart)\n` +
      `• Leverage: ${leverage} (Zero Spread ECN)\n` +
      `• Expected Target: ${activeBotConfig.tp} (SL: ${activeBotConfig.sl})\n` +
      `Please connect my MT4/MT5 trading account to the 99% Automated Forex Bot now!`
    );
  };

  const handleClaimPropFund = () => {
    incrementClicks();
    soundManager.playWinFanfare();
    onOpenTelegram(
      `🏆 CLAIM $100K FUNDED FOREX TRADER ACCOUNT WITH ADV KINGS BROKER:\n` +
      `• Broker: AdvKings Markets ECN Prime\n` +
      `• Bot Mode: ${activeBotConfig.name} (99% Win Accuracy)\n` +
      `• Evaluation Model: 1-Step Instant Challenge Pass\n` +
      `• Profit Split: 90% Trader / 10% Firm\n` +
      `• Leverage: 1:2000 Swap-Free Account\n` +
      `Please activate my VIP Prop Firm account with the 99% auto-trader bot on Telegram!`
    );
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#02130b] via-[#05110d] to-black border-2 border-emerald-500/80 p-3 sm:p-6 shadow-[0_0_40px_rgba(16,185,129,0.35)] glow-gold">
      
      {/* 1. AdvKings Broker Prime ECN Ribbon */}
      <div className="bg-black/90 border border-emerald-500/40 rounded-2xl p-3 mb-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-emerald-500 flex items-center justify-center text-black font-black text-sm shadow">
            AK
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-black text-white text-sm tracking-tight flex items-center gap-1">
                AdvKings Markets <span className="text-emerald-400 font-mono text-xs">Prime ECN Broker</span>
              </h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-mono px-2 py-0.2 rounded border border-emerald-500/30">
                STP Bridge Live01
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">
              Trade Forex & Crypto with your <strong>Play Balance</strong> • 0.0 Spread • 1:2000 Leverage
            </p>
          </div>
        </div>

        {/* Play Balance & Account Stats Pill */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-zinc-950 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-mono flex items-center gap-3">
            <div>
              <span className="text-zinc-400 text-[9px] block">PLAY BALANCE</span>
              <span className="text-yellow-300 font-black text-sm">${currentBalance.toFixed(2)}</span>
            </div>
            <div className="border-l border-zinc-800 pl-3">
              <span className="text-zinc-400 text-[9px] block">EQUITY</span>
              <span className={`font-black text-sm ${equity >= currentBalance ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${equity.toFixed(2)}
              </span>
            </div>
            <div className="border-l border-zinc-800 pl-3 hidden sm:block">
              <span className="text-zinc-400 text-[9px] block">FREE MARGIN</span>
              <span className="text-sky-300 font-bold text-xs">${freeMargin.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleReloadPlayBalance}
            className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
            title="Add free play balance for Forex trading"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>+Reload Funds</span>
          </button>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {brokerToast && (
        <div className="mb-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs font-mono font-bold px-4 py-2 rounded-xl shadow-xl flex items-center justify-between gap-2 border border-emerald-300 animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-yellow-300 shrink-0" />
            <span>{brokerToast}</span>
          </div>
          <button
            onClick={() => setBrokerToast(null)}
            className="text-white/80 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner Header & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/30 pb-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-black font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(234,179,8,0.7)] flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 inline text-black" /> 99% WIN RATE FOREX BOT 🏆
          </span>
          <span className="bg-emerald-500 text-black font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded uppercase tracking-tight flex items-center gap-1">
            <Bot className="w-3 h-3 text-black inline" /> 100% Hands-Free MT4/MT5 EA
          </span>
          <span className="text-[11px] text-zinc-300 font-bold hidden sm:inline flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" /> Zero Drawdown Hedging • 1:2000 Leverage
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Auto-Pilot Switch */}
          <button
            onClick={() => {
              setIsAiAutoPilot(!isAiAutoPilot);
              soundManager.playCoin();
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono flex items-center gap-1.5 border transition-all ${
              isAiAutoPilot
                ? 'bg-yellow-400 text-black border-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.6)]'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <Bot className={`w-3.5 h-3.5 ${isAiAutoPilot ? 'animate-bounce' : ''}`} />
            <span>AI AUTO-PILOT: {isAiAutoPilot ? 'ON (Trading)' : 'OFF'}</span>
          </button>

          <span className="text-xs font-mono font-black text-yellow-300 bg-black/80 border border-yellow-400/50 px-2.5 py-1 rounded shadow flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 inline animate-pulse" /> WIN RATE: {activeBotConfig.winRate}%
          </span>
        </div>
      </div>

      {/* 99% Win Rate Forex Bot Showcase Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-black to-emerald-950/70 border border-emerald-500/40 rounded-2xl p-3 sm:p-3.5 mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-xs px-3 py-1 rounded-lg uppercase tracking-wider shadow flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-black" /> 99% WIN RATE FOREX BOT 🏆
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Hands-Free MT4/MT5 EA
            </span>
            <span className="text-zinc-300 text-xs font-medium hidden md:inline">
              Zero Drawdown Hedging • 1:2000 Leverage
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-yellow-400/10 border border-yellow-400/40 text-yellow-300 font-mono font-black text-xs px-3 py-1 rounded-lg shadow-sm">
              WIN RATE: <strong className="text-yellow-400">{activeBotConfig.winRate}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Bot Preset Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {(Object.keys(BOT_MODELS) as BotPreset[]).map((key) => {
          const b = BOT_MODELS[key];
          const isSelected = selectedBot === key;
          return (
            <button
              key={key}
              onClick={() => handleBotSelect(key)}
              className={`p-2.5 rounded-xl text-left border transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-r from-yellow-950/80 to-emerald-950/80 border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.4)] scale-[1.02]'
                  : 'bg-black/50 border-zinc-800 hover:border-emerald-500/40 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[12px] font-black truncate ${isSelected ? 'text-yellow-300' : 'text-zinc-100'}`}>
                  {b.shortName}
                </span>
                <span className="text-[10px] font-mono font-black text-yellow-300 bg-black/80 px-1.5 py-0.5 rounded border border-yellow-500/40 shadow-sm">
                  {b.badge}
                </span>
              </div>
              <p className="text-[10px] font-mono font-bold text-zinc-300 mt-1 truncate">{b.preferredPair}</p>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left MT5 Mobile Candlestick Terminal + Right Broker Controls & Signal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Col: Authentic MT5 Candlestick Chart (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full mb-2 flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
              ADVKINGS MT5 TERMINAL
            </span>
            <span className="text-[10px] text-zinc-400">Play Balance Trading Active</span>
          </div>

          <MT5CandlestickChart
            key={`${selectedPair}-${selectedTimeframe}`}
            defaultPair={selectedPair}
            timeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
            onOpenTelegram={onOpenTelegram}
            incrementClicks={incrementClicks}
            currentBalance={currentBalance}
            currency={currency}
            activePositions={activePositions}
            closedPositions={closedPositions}
            onPlaceBrokerTrade={handlePlaceBrokerTrade}
            onClosePosition={handleClosePosition}
            onOpenReload={handleReloadPlayBalance}
            brokerAccountName={brokerAccountName}
          />
        </div>

        {/* Right Col: Algorithm Signal Stats + Active Positions + $100K Prop Firm Offer (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Signal Box & Instant Trade Execution */}
          <div className="bg-zinc-950/90 border border-emerald-500/40 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
              <span className="flex items-center gap-1 text-yellow-300 font-black">
                <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ADVKINGS SIGNAL • {activeBotConfig.name}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">0.01s STP EXECUTION</span>
            </div>

            <div className="bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-emerald-950/80 p-3 rounded-xl border border-emerald-400/40">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-100 font-black text-sm">{selectedPair}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const btn = document.getElementById('mt5-timeframe-selector-btn');
                      if (btn) {
                        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        btn.click();
                      }
                    }}
                    className="bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 px-2 py-0.5 rounded text-[10px] font-mono font-black border border-yellow-400/40 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Click to choose MT5 timeframe"
                  >
                    <Clock className="w-3 h-3 text-yellow-400" />
                    <span>{selectedTimeframe} Chart ▾</span>
                  </button>
                </div>
                <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-black px-2.5 py-0.5 rounded uppercase shadow">
                  EXECUTION SIGNAL • WIN RATE {activeBotConfig.winRate}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-emerald-500/20 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-zinc-400 block">TAKE PROFIT (TP)</span>
                  <strong className="text-emerald-400 font-black">{activeBotConfig.tp}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block">STOP LOSS (SL)</span>
                  <strong className="text-zinc-400 font-bold">{activeBotConfig.sl}</strong>
                </div>
              </div>
            </div>

            {/* Quick Play Balance Trade Execution Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handlePlaceBrokerTrade('SELL', 0.05, 2380.50)}
                className="py-2.5 bg-[#e54a50] hover:bg-[#d9383f] text-white font-black text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <TrendingDown className="w-4 h-4" />
                <span>SELL 0.05 LOT ($0.50 Margin)</span>
              </button>

              <button
                type="button"
                onClick={() => handlePlaceBrokerTrade('BUY', 0.05, 2382.10)}
                className="py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <TrendingUp className="w-4 h-4" />
                <span>BUY 0.05 LOT ($0.50 Margin)</span>
              </button>
            </div>

            {/* Leverage selector */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-zinc-400 font-bold">Account Leverage:</span>
              <div className="flex items-center gap-1.5">
                {(['1:500', '1:1000', '1:2000'] as const).map((lev) => (
                  <button
                    key={lev}
                    onClick={() => {
                      setLeverage(lev);
                      soundManager.playSpinTick();
                    }}
                    className={`px-2 py-0.5 rounded text-xs font-black font-mono transition-all ${
                      leverage === lev
                        ? 'bg-yellow-400 text-black shadow'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {lev}
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Auto-Copy / Download 99% Bot Button */}
            <button
              onClick={handleCopySignal}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-emerald-400 hover:from-yellow-300 hover:to-emerald-300 text-black font-black text-sm rounded-xl border border-yellow-200 shadow-[0_0_20px_rgba(234,179,8,0.6)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Trophy className="w-4 h-4 text-black fill-black" />
              <span>{copiedSignal ? '✓ 99% BOT COPIED TO TELEGRAM!' : `DOWNLOAD ${activeBotConfig.winRate}% WIN BOT (MT4/MT5)`}</span>
              <Send className="w-4 h-4 text-black" />
            </button>
          </div>

          {/* Active Broker Positions Panel */}
          {activePositions.length > 0 && (
            <div className="bg-black/90 border border-emerald-500/40 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  OPEN ADV KINGS TRADES ({activePositions.length})
                </span>
                <div className="flex items-center gap-2">
                  <span className={`font-black ${totalFloatingPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    Floating: {totalFloatingPnl >= 0 ? `+$${totalFloatingPnl.toFixed(2)}` : `-$${Math.abs(totalFloatingPnl).toFixed(2)}`}
                  </span>
                  <button
                    onClick={handleCloseAllTrades}
                    className="text-[10px] bg-rose-600 hover:bg-rose-500 text-white font-bold px-2 py-0.5 rounded transition-colors"
                  >
                    Close All
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                {activePositions.map((pos) => (
                  <div
                    key={pos.id}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 flex items-center justify-between font-mono text-xs hover:border-emerald-500/30 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-black px-1 rounded uppercase ${
                            pos.type === 'BUY' ? 'bg-sky-500 text-black' : 'bg-rose-500 text-white'
                          }`}
                        >
                          {pos.type}
                        </span>
                        <span className="text-white font-bold">{pos.symbol}</span>
                        <span className="text-zinc-400 text-[10px]">{pos.lot.toFixed(2)} lot</span>
                        <span className="text-zinc-500 text-[9px]">#{pos.ticket}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        <span>Margin: ${pos.margin.toFixed(2)}</span>
                        <span className="mx-1">•</span>
                        <span className="text-emerald-400">{pos.pips >= 0 ? `+${pos.pips}` : pos.pips} pips</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-black text-xs ${
                          pos.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {pos.profit >= 0 ? `+$${pos.profit.toFixed(2)}` : `-$${Math.abs(pos.profit).toFixed(2)}`}
                      </span>
                      <button
                        onClick={() => handleClosePosition(pos.id)}
                        className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded transition-colors font-sans"
                      >
                        Close & Cashout
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Winning Trades Stream */}
          <div className="bg-black/80 border border-emerald-500/20 rounded-2xl p-3 space-y-1.5">
            <span className="text-xs font-bold text-zinc-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Live 99% Bot Executions:
            </span>
            <div className="space-y-1.5">
              {liveTrades.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-xs font-mono text-zinc-300 bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-emerald-500/10">
                  <span className="text-yellow-300 font-bold">{t.bot}</span>
                  <span className="text-white font-semibold">{t.pair}</span>
                  <span className="text-emerald-400 font-black">{t.profit}</span>
                  <span className="text-zinc-400 text-[10px]">({t.pips})</span>
                  <span className="text-sky-400 text-[10px]">{t.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* $100K Prop Firm Funded Trader Offer */}
          <div className="bg-gradient-to-r from-yellow-950/50 via-zinc-950 to-emerald-950/50 border-2 border-yellow-500/60 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400 text-black font-black text-[9px] uppercase mb-1 shadow">
                <Award className="w-3 h-3 inline" /> 99% PASS GUARANTEE
              </div>
              <h4 className="text-sm font-black text-yellow-300 uppercase tracking-tight">
                $100,000 PROP FIRM CHALLENGE PASS
              </h4>
              <p className="text-[11px] text-zinc-300">
                Auto-pass in 24 hours with our <strong>99% Win EA</strong>. Keep <strong>90% profits</strong>!
              </p>
            </div>

            <button
              onClick={handleClaimPropFund}
              className="px-3.5 py-2.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black text-xs rounded-xl border border-yellow-200 shadow flex items-center gap-1 transition-transform hover:scale-105 active:scale-95 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>CLAIM $100K</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

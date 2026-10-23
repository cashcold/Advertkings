import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Plus,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  BarChart2,
  PieChart,
  History,
  MessageSquare,
  Send,
  Zap,
  Play,
  CheckCircle2,
  Award,
  Sparkles,
  X
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type MT5PairKey = 'XAUUSDm' | 'BCHUSDm' | 'EURUSDm' | 'BTCUSDm';

export type MT5Timeframe =
  | 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'M10' | 'M12' | 'M15' | 'M20' | 'M30'
  | 'H1' | 'H2' | 'H3' | 'H4' | 'H6' | 'H8' | 'H12'
  | 'D1' | 'W1' | 'MN';

export interface MT5TimeframeOption {
  code: MT5Timeframe;
  name: string;
  category: 'Minutes' | 'Hours' | 'Days';
  seconds: number;
  popular?: boolean;
}

export const MT5_TIMEFRAMES: MT5TimeframeOption[] = [
  // Primary Quick Bar / Popular MT5 Timeframes
  { code: 'M1', name: '1 Minute', category: 'Minutes', seconds: 60, popular: true },
  { code: 'M2', name: '2 Minutes', category: 'Minutes', seconds: 120 },
  { code: 'M3', name: '3 Minutes', category: 'Minutes', seconds: 180 },
  { code: 'M4', name: '4 Minutes', category: 'Minutes', seconds: 240 },
  { code: 'M5', name: '5 Minutes', category: 'Minutes', seconds: 300, popular: true },
  { code: 'M6', name: '6 Minutes', category: 'Minutes', seconds: 360 },
  { code: 'M10', name: '10 Minutes', category: 'Minutes', seconds: 600 },
  { code: 'M12', name: '12 Minutes', category: 'Minutes', seconds: 720 },
  { code: 'M15', name: '15 Minutes', category: 'Minutes', seconds: 900, popular: true },
  { code: 'M20', name: '20 Minutes', category: 'Minutes', seconds: 1200 },
  { code: 'M30', name: '30 Minutes', category: 'Minutes', seconds: 1800, popular: true },
  // Hours
  { code: 'H1', name: '1 Hour', category: 'Hours', seconds: 3600, popular: true },
  { code: 'H2', name: '2 Hours', category: 'Hours', seconds: 7200 },
  { code: 'H3', name: '3 Hours', category: 'Hours', seconds: 10800 },
  { code: 'H4', name: '4 Hours', category: 'Hours', seconds: 14400, popular: true },
  { code: 'H6', name: '6 Hours', category: 'Hours', seconds: 21600 },
  { code: 'H8', name: '8 Hours', category: 'Hours', seconds: 28800 },
  { code: 'H12', name: '12 Hours', category: 'Hours', seconds: 43200 },
  // Days & Months
  { code: 'D1', name: '1 Day (Daily)', category: 'Days', seconds: 86400, popular: true },
  { code: 'W1', name: '1 Week (Weekly)', category: 'Days', seconds: 604800, popular: true },
  { code: 'MN', name: '1 Month (Monthly)', category: 'Days', seconds: 2592000, popular: true },
];

export interface MT5PairConfig {
  symbol: string;
  name: string;
  timeframe: string;
  spread: number;
  decimals: number;
  pipUnit: number;
  defaultPrice: number;
  initialCandles: CandleData[];
  sellOrderLine?: {
    type: 'SELL' | 'BUY';
    lot: string;
    profitText: string;
    price: number;
  };
}

export const MT5_PAIRS: Record<MT5PairKey, MT5PairConfig> = {
  // Gold vs US Dollar (From Image 2)
  XAUUSDm: {
    symbol: 'XAUUSDm',
    name: 'Gold vs US Dollar',
    timeframe: 'M5',
    spread: 0.24,
    decimals: 3,
    pipUnit: 0.1,
    defaultPrice: 4085.522,
    sellOrderLine: {
      type: 'SELL',
      lot: '0.01',
      profitText: '+450.00 USD',
      price: 4083.290,
    },
    initialCandles: [
      { time: '23 Jul 10:25', open: 4086.2, high: 4088.4, low: 4084.1, close: 4087.5 },
      { time: '23 Jul 10:30', open: 4087.5, high: 4089.8, low: 4085.6, close: 4088.9 },
      { time: '23 Jul 10:35', open: 4088.9, high: 4090.5, low: 4086.2, close: 4089.4 },
      { time: '23 Jul 10:40', open: 4089.4, high: 4089.9, low: 4087.1, close: 4087.8 },
      { time: '23 Jul 10:45', open: 4087.8, high: 4093.8, low: 4087.5, close: 4093.2 },
      { time: '23 Jul 10:50', open: 4093.2, high: 4094.6, low: 4092.8, close: 4094.1 },
      { time: '23 Jul 10:55', open: 4094.1, high: 4094.5, low: 4092.5, close: 4093.1 },
      { time: '23 Jul 11:00', open: 4093.1, high: 4093.3, low: 4089.8, close: 4090.2 },
      { time: '23 Jul 11:05', open: 4090.2, high: 4091.2, low: 4087.1, close: 4087.6 },
      { time: '23 Jul 11:10', open: 4087.6, high: 4088.5, low: 4085.2, close: 4086.0 },
      { time: '23 Jul 11:15', open: 4086.0, high: 4086.4, low: 4083.5, close: 4084.1 },
      { time: '23 Jul 11:20', open: 4084.1, high: 4085.2, low: 4083.8, close: 4084.8 },
      { time: '23 Jul 11:25', open: 4084.8, high: 4085.0, low: 4081.2, close: 4082.1 },
      { time: '23 Jul 11:30', open: 4082.1, high: 4082.4, low: 4079.5, close: 4080.2 },
      { time: '23 Jul 11:35', open: 4080.2, high: 4081.0, low: 4077.2, close: 4079.8 },
      { time: '23 Jul 11:40', open: 4079.8, high: 4082.8, low: 4078.6, close: 4082.4 },
      { time: '23 Jul 11:45', open: 4082.4, high: 4086.9, low: 4081.8, close: 4085.5 },
    ],
  },
  // Bitcoin Cash vs US Dollar (From Image 1)
  BCHUSDm: {
    symbol: 'BCHUSDm',
    name: 'Bitcoin Cash vs US Dollar',
    timeframe: 'M5',
    spread: 15.0,
    decimals: 2,
    pipUnit: 0.1,
    defaultPrice: 208.77,
    sellOrderLine: {
      type: 'SELL',
      lot: '0.10',
      profitText: '+773.06 USD',
      price: 208.20,
    },
    initialCandles: [
      { time: '23 Jul 10:45', open: 208.58, high: 208.66, low: 208.52, close: 208.62 },
      { time: '23 Jul 10:50', open: 208.62, high: 208.72, low: 208.56, close: 208.68 },
      { time: '23 Jul 10:55', open: 208.68, high: 208.74, low: 208.50, close: 208.72 },
      { time: '23 Jul 11:00', open: 208.72, high: 208.75, low: 208.65, close: 208.67 },
      { time: '23 Jul 11:05', open: 208.67, high: 209.12, low: 208.58, close: 209.05 },
      { time: '23 Jul 11:10', open: 209.05, high: 209.84, low: 209.02, close: 209.78 },
      { time: '23 Jul 11:15', open: 209.78, high: 209.82, low: 209.48, close: 209.52 },
      { time: '23 Jul 11:20', open: 209.52, high: 209.58, low: 209.14, close: 209.18 },
      { time: '23 Jul 11:25', open: 209.18, high: 209.28, low: 209.02, close: 209.08 },
      { time: '23 Jul 11:30', open: 209.08, high: 209.12, low: 208.98, close: 209.02 },
      { time: '23 Jul 11:35', open: 209.02, high: 209.06, low: 208.72, close: 208.78 },
      { time: '23 Jul 11:40', open: 208.78, high: 208.82, low: 208.68, close: 208.71 },
      { time: '23 Jul 11:45', open: 208.71, high: 208.76, low: 208.58, close: 208.62 },
      { time: '23 Jul 11:50', open: 208.62, high: 208.74, low: 208.52, close: 208.70 },
      { time: '23 Jul 11:55', open: 208.70, high: 208.84, low: 208.68, close: 208.77 },
    ],
  },
  // Euro vs US Dollar
  EURUSDm: {
    symbol: 'EURUSDm',
    name: 'Euro vs US Dollar',
    timeframe: 'M5',
    spread: 0.00012,
    decimals: 5,
    pipUnit: 0.0001,
    defaultPrice: 1.08645,
    sellOrderLine: {
      type: 'BUY',
      lot: '1.00',
      profitText: '+820.00 USD',
      price: 1.08580,
    },
    initialCandles: [
      { time: '23 Jul 10:45', open: 1.08520, high: 1.08560, low: 1.08510, close: 1.08550 },
      { time: '23 Jul 10:50', open: 1.08550, high: 1.08590, low: 1.08540, close: 1.08585 },
      { time: '23 Jul 10:55', open: 1.08585, high: 1.08640, low: 1.08570, close: 1.08630 },
      { time: '23 Jul 11:00', open: 1.08630, high: 1.08710, low: 1.08620, close: 1.08695 },
      { time: '23 Jul 11:05', open: 1.08695, high: 1.08705, low: 1.08645, close: 1.08660 },
      { time: '23 Jul 11:10', open: 1.08660, high: 1.08670, low: 1.08610, close: 1.08625 },
      { time: '23 Jul 11:15', open: 1.08625, high: 1.08635, low: 1.08590, close: 1.08605 },
      { time: '23 Jul 11:20', open: 1.08605, high: 1.08620, low: 1.08580, close: 1.08595 },
      { time: '23 Jul 11:25', open: 1.08595, high: 1.08655, low: 1.08590, close: 1.08645 },
    ],
  },
  // Bitcoin vs US Dollar
  BTCUSDm: {
    symbol: 'BTCUSDm',
    name: 'Bitcoin vs US Dollar',
    timeframe: 'M5',
    spread: 12.5,
    decimals: 2,
    pipUnit: 1.0,
    defaultPrice: 64520.50,
    sellOrderLine: {
      type: 'BUY',
      lot: '0.50',
      profitText: '+3,240.00 USD',
      price: 64180.00,
    },
    initialCandles: [
      { time: '23 Jul 10:45', open: 64100, high: 64280, low: 64050, close: 64220 },
      { time: '23 Jul 10:50', open: 64220, high: 64450, low: 64180, close: 64410 },
      { time: '23 Jul 10:55', open: 64410, high: 64890, low: 64380, close: 64820 },
      { time: '23 Jul 11:00', open: 64820, high: 64850, low: 64520, close: 64560 },
      { time: '23 Jul 11:05', open: 64560, high: 64620, low: 64310, close: 64380 },
      { time: '23 Jul 11:10', open: 64380, high: 64420, low: 64200, close: 64250 },
      { time: '23 Jul 11:15', open: 64250, high: 64600, low: 64220, close: 64520 },
    ],
  },
};

export interface BrokerPosition {
  id: string;
  ticket: number;
  symbol: MT5PairKey;
  type: 'BUY' | 'SELL';
  lot: number;
  margin: number;
  entryPrice: number;
  currentPrice: number;
  profit: number;
  pips: number;
  openTime: string;
  isAiBot?: boolean;
  targetOutcome?: 'WIN' | 'LOSS';
}

export interface ClosedPosition {
  id: string;
  ticket: number;
  symbol: MT5PairKey;
  type: 'BUY' | 'SELL';
  lot: number;
  margin: number;
  entryPrice: number;
  closePrice: number;
  profit: number;
  openTime: string;
  closeTime: string;
  isAiBot?: boolean;
  outcome?: 'WIN' | 'LOSS';
}

export function generateCandlesForTimeframe(
  pairKey: MT5PairKey,
  tf: MT5Timeframe,
  basePrice: number,
  decimals: number,
  pipUnit: number
): CandleData[] {
  // If pair has initialCandles and tf is M5, use authentic screenshot-accurate initialCandles
  if (tf === 'M5' && MT5_PAIRS[pairKey]?.initialCandles?.length) {
    return MT5_PAIRS[pairKey].initialCandles;
  }

  const numCandles = 16;
  const list: CandleData[] = [];
  const now = new Date();

  // Determine step in seconds
  const tfOpt = MT5_TIMEFRAMES.find((t) => t.code === tf) || { category: 'Minutes', seconds: 300 };
  const stepSeconds = tfOpt.seconds;

  // Volatility multiplier scales with sqrt(time)
  const volMultiplier = Math.max(0.7, Math.sqrt(stepSeconds / 300));
  const stepSwing = pipUnit * (pairKey === 'XAUUSDm' ? 8 : pairKey === 'BCHUSDm' ? 5 : pairKey === 'BTCUSDm' ? 120 : 6) * volMultiplier;

  let runningPrice = basePrice - (Math.random() - 0.45) * stepSwing * 2.5;

  for (let i = numCandles - 1; i >= 0; i--) {
    const candleTime = new Date(now.getTime() - i * stepSeconds * 1000);
    let timeStr = '';

    if (tfOpt.category === 'Minutes') {
      const hh = String(candleTime.getHours()).padStart(2, '0');
      const mm = String(candleTime.getMinutes()).padStart(2, '0');
      timeStr = `${hh}:${mm}`;
    } else if (tfOpt.category === 'Hours') {
      const dd = candleTime.getDate();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const mon = monthNames[candleTime.getMonth()];
      const hh = String(candleTime.getHours()).padStart(2, '0');
      timeStr = `${dd} ${mon} ${hh}:00`;
    } else {
      // Days / Weeks / Months
      const dd = candleTime.getDate();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const mon = monthNames[candleTime.getMonth()];
      if (tf === 'MN') {
        timeStr = `${mon} ${String(candleTime.getFullYear()).slice(-2)}`;
      } else if (tf === 'W1') {
        timeStr = `Wk ${dd} ${mon}`;
      } else {
        timeStr = `${dd} ${mon}`;
      }
    }

    const open = Number(runningPrice.toFixed(decimals));
    const delta = (Math.random() - 0.49) * stepSwing;
    const close = Number((open + delta).toFixed(decimals));
    const high = Number((Math.max(open, close) + Math.random() * (stepSwing * 0.4)).toFixed(decimals));
    const low = Number((Math.min(open, close) - Math.random() * (stepSwing * 0.4)).toFixed(decimals));

    runningPrice = close;
    list.push({ time: timeStr, open, high, low, close });
  }

  // Ensure last candle close is aligned to basePrice
  if (list.length > 0) {
    list[list.length - 1].close = basePrice;
    list[list.length - 1].high = Math.max(list[list.length - 1].high, basePrice);
    list[list.length - 1].low = Math.min(list[list.length - 1].low, basePrice);
  }

  return list;
}

export interface MT5CandlestickChartProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
  defaultPair?: MT5PairKey;
  timeframe?: MT5Timeframe;
  onTimeframeChange?: (tf: MT5Timeframe) => void;
  currentBalance?: number;
  currency?: string;
  activePositions?: BrokerPosition[];
  closedPositions?: ClosedPosition[];
  onPlaceBrokerTrade?: (type: 'BUY' | 'SELL', lot: number, price: number) => void;
  onClosePosition?: (id: string) => void;
  onOpenReload?: () => void;
  brokerAccountName?: string;
}

export const MT5CandlestickChart: React.FC<MT5CandlestickChartProps> = ({
  onOpenTelegram,
  incrementClicks,
  defaultPair = 'XAUUSDm',
  timeframe,
  onTimeframeChange,
  currentBalance = 50.0,
  currency = 'USD',
  activePositions = [],
  closedPositions = [],
  onPlaceBrokerTrade,
  onClosePosition,
  onOpenReload,
  brokerAccountName = 'AdvKings Live ECN #AK-89201',
}) => {
  const [activePairKey, setActivePairKey] = useState<MT5PairKey>(defaultPair);
  const [selectedTimeframe, setSelectedTimeframe] = useState<MT5Timeframe>(timeframe || 'M5');
  const [lotSize, setLotSize] = useState<string>('0.01');
  const [candles, setCandles] = useState<CandleData[]>(MT5_PAIRS[defaultPair].initialCandles);
  const [currentPrice, setCurrentPrice] = useState<number>(MT5_PAIRS[defaultPair].defaultPrice);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(56);
  const [activeNavTab, setActiveNavTab] = useState<'quotes' | 'charts' | 'trade' | 'history' | 'messages'>('charts');
  const [showPairDropdown, setShowPairDropdown] = useState<boolean>(false);
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState<boolean>(false);
  const [tradeExecutedNote, setTradeExecutedNote] = useState<string | null>(null);

  const activeConfig = MT5_PAIRS[activePairKey];

  // Sync timeframe prop if controlled from parent
  useEffect(() => {
    if (timeframe && timeframe !== selectedTimeframe) {
      setSelectedTimeframe(timeframe);
    }
  }, [timeframe, selectedTimeframe]);

  // Sync candles when pair or timeframe changes
  useEffect(() => {
    const generated = generateCandlesForTimeframe(
      activePairKey,
      selectedTimeframe,
      activeConfig.defaultPrice,
      activeConfig.decimals,
      activeConfig.pipUnit
    );
    setCandles(generated);
    setCurrentPrice(activeConfig.defaultPrice);
    if (activePairKey === 'XAUUSDm') {
      setLotSize('0.01');
    } else if (activePairKey === 'BCHUSDm') {
      setLotSize('0.1');
    } else {
      setLotSize('1.0');
    }
  }, [activePairKey, selectedTimeframe, activeConfig]);

  // Handle changing timeframe
  const handleSelectTimeframe = (tf: MT5Timeframe) => {
    setSelectedTimeframe(tf);
    if (onTimeframeChange) {
      onTimeframeChange(tf);
    }
    const tfOpt = MT5_TIMEFRAMES.find((t) => t.code === tf);
    const duration = tfOpt ? tfOpt.seconds : 300;
    setSecondsRemaining(Math.min(duration, 3600));

    const newCandles = generateCandlesForTimeframe(
      activePairKey,
      tf,
      currentPrice || activeConfig.defaultPrice,
      activeConfig.decimals,
      activeConfig.pipUnit
    );
    setCandles(newCandles);
    soundManager.playCoin();
    setTradeExecutedNote(`Timeframe set to ${tf} (${tfOpt?.name || tf})`);
    setTimeout(() => setTradeExecutedNote(null), 3000);
    setShowTimeframeDropdown(false);
  };

  // Real-time ticking price & live candle timer countdown (e.g., 01:55, 00:56)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        const tfOpt = MT5_TIMEFRAMES.find((t) => t.code === selectedTimeframe);
        const resetVal = tfOpt ? Math.min(tfOpt.seconds, 3600) : 300;
        if (prev <= 1) return resetVal;
        return prev - 1;
      });

      // Price micro-fluctuation
      const fluctuation = (Math.random() - 0.48) * (activeConfig.pipUnit * 1.5);
      setCurrentPrice((prev) => {
        const next = prev + fluctuation;
        return Number(next.toFixed(activeConfig.decimals));
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [activeConfig, selectedTimeframe]);

  // Compute scale boundaries for candlestick SVG rendering
  const minPrice = Math.min(...candles.map((c) => c.low), currentPrice) * 0.9985;
  const maxPrice = Math.max(...candles.map((c) => c.high), currentPrice) * 1.0015;
  const priceRange = maxPrice - minPrice || 1;

  const chartHeight = 320;
  const candleWidth = 14;
  const candleGap = 6;
  const totalChartWidth = candles.length * (candleWidth + candleGap) + 40;

  const getY = (val: number) => {
    return chartHeight - ((val - minPrice) / priceRange) * chartHeight;
  };

  // Price axis step calculations
  const priceSteps = 12;
  const stepVal = priceRange / priceSteps;
  const priceAxisLabels = Array.from({ length: priceSteps + 1 }, (_, i) => {
    const p = maxPrice - i * stepVal;
    return p.toFixed(activeConfig.decimals);
  });

  // Calculate Bid (SELL) and Ask (BUY)
  const sellBid = currentPrice;
  const buyAsk = Number((currentPrice + activeConfig.spread).toFixed(activeConfig.decimals));

  // Split prices for MT5 big pip digit styling (e.g. 4085.52^2)
  const formatMT5Digits = (val: number) => {
    const str = val.toFixed(activeConfig.decimals);
    const parts = str.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '00';
    const mainDec = decimalPart.slice(0, 2);
    const superDec = decimalPart.slice(2) || '';
    return { integerPart, mainDec, superDec };
  };

  const sellDigits = formatMT5Digits(sellBid);
  const buyDigits = formatMT5Digits(buyAsk);

  const formattedCountdown = `${String(Math.floor(secondsRemaining / 60)).padStart(2, '0')}:${String(
    secondsRemaining % 60
  ).padStart(2, '0')}`;

  const handleLotChange = (delta: number) => {
    soundManager.playSpinTick();
    const current = parseFloat(lotSize) || 0.01;
    const next = Math.max(0.01, +(current + delta).toFixed(2));
    setLotSize(next.toFixed(2));
  };

  const totalFloatingPnl = activePositions.reduce((sum, p) => sum + p.profit, 0);
  const symbolPositions = activePositions.filter((p) => p.symbol === activePairKey);

  const handleExecuteTrade = (type: 'BUY' | 'SELL') => {
    incrementClicks();
    soundManager.playWinFanfare();
    const price = type === 'BUY' ? buyAsk : sellBid;
    const lotNum = parseFloat(lotSize) || 0.01;

    if (onPlaceBrokerTrade) {
      onPlaceBrokerTrade(type, lotNum, price);
      const note = `✓ AdvKings ECN ${type} ${lotSize} LOT @ ${price} EXECUTED ON PLAY BALANCE`;
      setTradeExecutedNote(note);
      setTimeout(() => setTradeExecutedNote(null), 3500);
      return;
    }

    const note = `✓ MT5 ${type} ${lotSize} LOT ON ${activeConfig.symbol} EXECUTED @ ${price}`;
    setTradeExecutedNote(note);
    setTimeout(() => setTradeExecutedNote(null), 3500);

    const msg =
      `📈 MT5 TERMINAL INSTANT ORDER EXECUTION:\n` +
      `• Action: ${type} ${lotSize} LOT\n` +
      `• Instrument: ${activeConfig.symbol} (${activeConfig.name})\n` +
      `• Execution Price: ${price}\n` +
      `• Spread: ${activeConfig.spread} | Timeframe: ${activeConfig.timeframe}\n` +
      `• Live Candle Countdown: ${formattedCountdown}\n` +
      `Please register my automated MT5 position with 99% accuracy bot on Telegram!`;

    onOpenTelegram(msg);
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl bg-[#000000] border-2 border-zinc-800 text-white shadow-[0_0_40px_rgba(0,0,0,0.95)] overflow-hidden font-sans select-none">
      
      {/* 0. AdvKings ECN Prime Broker Live Account Header */}
      <div className="bg-[#040e08] border-b border-emerald-500/30 px-3 py-1.5 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-emerald-400">AdvKings Broker</span>
          <span className="text-zinc-500 text-[10px] hidden sm:inline">Live01</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 text-[10px]">Play Balance:</span>
          <span className="text-yellow-300 font-black">${currentBalance.toFixed(2)}</span>
          {onOpenReload && (
            <button
              onClick={onOpenReload}
              className="text-[9px] bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 transition-colors"
            >
              +Reload
            </button>
          )}
        </div>
      </div>

      {/* 1. MT5 Top Mobile Status & Tool Icons Bar */}
      <div className="bg-[#0e0e0e] px-3 py-2 border-b border-zinc-900 flex items-center justify-between text-zinc-300">
        <div className="flex items-center gap-3">
          <button type="button" className="hover:text-white transition-colors" title="MT5 Menu">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold text-zinc-400 truncate max-w-[120px]">{brokerAccountName}</span>
        </div>

        <div className="flex items-center gap-3.5 text-zinc-400">
          <button type="button" className="hover:text-white" title="Crosshair">
            <Plus className="w-4 h-4" />
          </button>
          <span className="font-serif italic font-bold text-sm text-zinc-300 cursor-pointer hover:text-white" title="Indicators">
            ƒ
          </span>
          <button
            type="button"
            onClick={() => {
              setShowTimeframeDropdown(!showTimeframeDropdown);
              setShowPairDropdown(false);
            }}
            className="text-xs font-bold text-yellow-300 hover:text-yellow-200 bg-zinc-900 hover:bg-zinc-800 px-2 py-0.5 rounded cursor-pointer border border-yellow-500/40 hover:border-yellow-400 font-mono transition-colors"
            title="Choose Timeframe"
          >
            {selectedTimeframe}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowTimeframeDropdown(!showTimeframeDropdown);
              setShowPairDropdown(false);
            }}
            className="hover:text-white"
            title="Timeframes / Clock"
          >
            <Clock className="w-4 h-4 text-sky-400" />
          </button>
          <button type="button" className="hover:text-white" title="Split Screen">
            <Layers className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      </div>

      {/* 2. MT5 Top Quick Execution SELL / LOT / BUY Bar */}
      <div className="grid grid-cols-12 bg-[#141414] border-b border-zinc-800/90 text-center items-stretch">
        
        {/* SELL BOX */}
        <button
          type="button"
          onClick={() => handleExecuteTrade('SELL')}
          className="col-span-4 bg-[#e54a50] hover:bg-[#d9383f] text-white p-2 flex flex-col justify-center items-center transition-all active:scale-95 group"
        >
          <span className="text-[10px] font-bold text-white/90 uppercase tracking-tight block">SELL</span>
          <div className="flex items-baseline font-mono font-black text-sm leading-tight mt-0.5">
            <span>{sellDigits.integerPart}.</span>
            <span className="text-base">{sellDigits.mainDec}</span>
            {sellDigits.superDec && <sup className="text-[9px] font-bold">{sellDigits.superDec}</sup>}
          </div>
        </button>

        {/* LOT SIZE SELECTOR */}
        <div className="col-span-4 bg-[#0a0a0a] flex items-center justify-between px-2 py-1 border-x border-zinc-800">
          <button
            type="button"
            onClick={() => handleLotChange(-0.01)}
            className="text-zinc-400 hover:text-white p-1"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <span className="font-mono font-black text-sm text-white">{lotSize}</span>
          <button
            type="button"
            onClick={() => handleLotChange(+0.01)}
            className="text-zinc-400 hover:text-white p-1"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        {/* BUY BOX (Authentic MT5 Blue) */}
        <button
          type="button"
          onClick={() => handleExecuteTrade('BUY')}
          className="col-span-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white p-2 flex flex-col justify-center items-center transition-all active:scale-95 group"
        >
          <span className="text-[10px] font-bold text-white/90 uppercase tracking-tight block">BUY</span>
          <div className="flex items-baseline font-mono font-black text-sm leading-tight mt-0.5">
            <span>{buyDigits.integerPart}.</span>
            <span className="text-base">{buyDigits.mainDec}</span>
            {buyDigits.superDec && <sup className="text-[9px] font-bold">{buyDigits.superDec}</sup>}
          </div>
        </button>
      </div>

      {/* 3. Instrument Info Header (e.g. XAUUSDm ▾ M5 Gold vs US Dollar) */}
      <div className="relative px-3 py-1.5 bg-[#000000] flex items-center justify-between text-xs border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            {/* Instrument Pair Trigger */}
            <button
              type="button"
              id="mt5-pair-selector-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowPairDropdown(!showPairDropdown);
                setShowTimeframeDropdown(false);
              }}
              className="flex items-center gap-1 cursor-pointer group text-[#38bdf8] hover:text-sky-300 font-black text-xs transition-colors"
              title="Change trading instrument"
            >
              <span>{activeConfig.symbol}</span>
              <ChevronDown className="w-3 h-3 text-[#38bdf8]" />
            </button>

            {/* Timeframe Selector Button */}
            <button
              type="button"
              id="mt5-timeframe-selector-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowTimeframeDropdown(!showTimeframeDropdown);
                setShowPairDropdown(false);
              }}
              className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-black flex items-center gap-1 transition-all cursor-pointer shadow-sm ${
                showTimeframeDropdown
                  ? 'bg-yellow-400 text-black border border-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.6)]'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-yellow-300 hover:text-yellow-200 border border-yellow-500/40 hover:border-yellow-400'
              }`}
              title="Click M5 to choose timeframe (M1 - MN)"
            >
              <Clock className="w-3 h-3 text-yellow-400 inline" />
              <span>{selectedTimeframe}</span>
              <ChevronDown className="w-2.5 h-2.5 text-yellow-400" />
            </button>
          </div>
          <p className="text-[10px] text-zinc-300 font-medium mt-0.5">{activeConfig.name}</p>
        </div>

        <div className="text-right">
          <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
            Market Open
          </span>
          <span className="text-[10px] text-zinc-400 block font-mono">Spread: {activeConfig.spread}</span>
        </div>

        {/* Outside click backdrop */}
        {(showPairDropdown || showTimeframeDropdown) && (
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => {
              setShowPairDropdown(false);
              setShowTimeframeDropdown(false);
            }}
          />
        )}

        {/* Dropdown for Switching Pairs */}
        {showPairDropdown && (
          <div className="absolute top-11 left-2 z-50 bg-[#121212] border border-zinc-700 rounded-xl shadow-2xl p-1.5 space-y-1 w-56 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
              Select Instrument
            </div>
            {(Object.keys(MT5_PAIRS) as MT5PairKey[]).map((key) => {
              const p = MT5_PAIRS[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActivePairKey(key);
                    setShowPairDropdown(false);
                    soundManager.playCoin();
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                    activePairKey === key
                      ? 'bg-sky-600 text-white font-bold'
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <span>{p.symbol}</span>
                  <span className="text-[10px] text-zinc-400">{p.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Comprehensive MT5 Timeframe Dropdown Modal */}
        {showTimeframeDropdown && (
          <div
            id="mt5-timeframe-dropdown"
            className="absolute top-11 left-2 z-50 bg-[#0d1117] border border-yellow-500/40 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.95)] p-3 w-[290px] sm:w-[330px] text-zinc-200 font-sans backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Dropdown Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-black uppercase text-white tracking-wider">
                  MT5 Timeframes
                </span>
                <span className="text-[10px] font-mono text-yellow-400 font-bold bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/30">
                  {selectedTimeframe}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowTimeframeDropdown(false)}
                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Bar: Popular MT5 Periods */}
            <div className="mb-2.5">
              <div className="text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-wider flex items-center justify-between">
                <span>Standard Periods</span>
                <span className="text-[9px] text-zinc-500 font-mono">Tap to switch</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {MT5_TIMEFRAMES.filter((t) => t.popular).map((tf) => {
                  const isSelected = tf.code === selectedTimeframe;
                  return (
                    <button
                      key={tf.code}
                      type="button"
                      onClick={() => handleSelectTimeframe(tf.code)}
                      className={`py-1.5 px-1 rounded-lg text-xs font-mono font-black text-center transition-all ${
                        isSelected
                          ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(234,179,8,0.5)] scale-105'
                          : 'bg-zinc-900/90 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {tf.code}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categorized List: Minutes, Hours, Days & Months */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700">
              {/* Minute Timeframes */}
              <div>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Minutes (M)
                </span>
                <div className="grid grid-cols-6 gap-1">
                  {MT5_TIMEFRAMES.filter((t) => t.category === 'Minutes').map((tf) => {
                    const isSelected = tf.code === selectedTimeframe;
                    return (
                      <button
                        key={tf.code}
                        type="button"
                        onClick={() => handleSelectTimeframe(tf.code)}
                        className={`py-1 px-0.5 rounded text-[11px] font-mono font-bold text-center transition-colors ${
                          isSelected
                            ? 'bg-yellow-400 text-black font-black shadow-sm'
                            : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800/80'
                        }`}
                        title={tf.name}
                      >
                        {tf.code}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hour Timeframes */}
              <div>
                <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                  Hours (H)
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {MT5_TIMEFRAMES.filter((t) => t.category === 'Hours').map((tf) => {
                    const isSelected = tf.code === selectedTimeframe;
                    return (
                      <button
                        key={tf.code}
                        type="button"
                        onClick={() => handleSelectTimeframe(tf.code)}
                        className={`py-1 px-1 rounded text-[11px] font-mono font-bold text-center transition-colors ${
                          isSelected
                            ? 'bg-yellow-400 text-black font-black shadow-sm'
                            : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800/80'
                        }`}
                        title={tf.name}
                      >
                        {tf.code}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Days, Weeks & Months */}
              <div>
                <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                  Daily / Weekly / Monthly
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {MT5_TIMEFRAMES.filter((t) => t.category === 'Days').map((tf) => {
                    const isSelected = tf.code === selectedTimeframe;
                    return (
                      <button
                        key={tf.code}
                        type="button"
                        onClick={() => handleSelectTimeframe(tf.code)}
                        className={`py-1 px-1.5 rounded text-[11px] font-mono font-bold text-center transition-colors ${
                          isSelected
                            ? 'bg-yellow-400 text-black font-black shadow-sm'
                            : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800/80'
                        }`}
                        title={tf.name}
                      >
                        {tf.code} <span className="text-[9px] opacity-70 font-normal">{tf.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Dropdown Footer */}
            <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[9px] text-zinc-400 font-mono">
              <span>Active: <strong className="text-yellow-300">{MT5_TIMEFRAMES.find((t) => t.code === selectedTimeframe)?.name}</strong></span>
              <span className="text-emerald-400 font-semibold">Real-time Ticks</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Notification Toast for Trade Execution */}
      {tradeExecutedNote && (
        <div className="bg-emerald-600 text-white text-[11px] font-mono font-bold px-3 py-1.5 text-center animate-pulse flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{tradeExecutedNote}</span>
        </div>
      )}

      {/* 5. Authentic MT5 Candlestick Chart Area OR Tab Views */}
      {activeNavTab === 'charts' && (
        <>
          <div className="relative bg-[#000000] h-[320px] w-full overflow-hidden flex">
            {/* SVG Drawing Canvas for Candlesticks & Grid Lines */}
            <div className="flex-1 h-full relative overflow-x-auto overflow-y-hidden scrollbar-none">
              <svg
                className="h-full"
                style={{ width: `${Math.max(totalChartWidth, 300)}px` }}
                viewBox={`0 0 ${Math.max(totalChartWidth, 300)} ${chartHeight}`}
                preserveAspectRatio="none"
              >
                <defs>
                  <pattern id="mt5Grid" width="45" height="26.6" patternUnits="userSpaceOnUse">
                    <path d="M 45 0 L 0 0 0 26.6" fill="none" stroke="#1c1c1c" strokeWidth="0.75" strokeDasharray="2,2" />
                  </pattern>
                </defs>

                {/* Background Grid */}
                <rect width="100%" height="100%" fill="url(#mt5Grid)" />

                {/* Active Sell/Buy Horizontal Order Line (Sample from Image) */}
                {activeConfig.sellOrderLine && symbolPositions.length === 0 && (
                  <g>
                    <line
                      x1="0"
                      y1={getY(activeConfig.sellOrderLine.price)}
                      x2="100%"
                      y2={getY(activeConfig.sellOrderLine.price)}
                      stroke="#e54a50"
                      strokeWidth="1.2"
                      strokeDasharray="4,3"
                    />
                    <text
                      x="6"
                      y={getY(activeConfig.sellOrderLine.price) - 4}
                      fill="#e54a50"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {activeConfig.sellOrderLine.type} {activeConfig.sellOrderLine.lot} ({activeConfig.sellOrderLine.profitText})
                    </text>
                  </g>
                )}

                {/* Live Real Broker Open Positions for Active Instrument */}
                {symbolPositions.map((pos) => {
                  const y = Math.min(Math.max(getY(pos.entryPrice), 12), chartHeight - 12);
                  const isBuy = pos.type === 'BUY';
                  const color = isBuy ? '#38bdf8' : '#e54a50';
                  return (
                    <g key={pos.id}>
                      <line
                        x1="0"
                        y1={y}
                        x2="100%"
                        y2={y}
                        stroke={color}
                        strokeWidth="1.2"
                        strokeDasharray="4,3"
                      />
                      <rect
                        x="6"
                        y={Math.max(y - 14, 2)}
                        width="135"
                        height="13"
                        fill={isBuy ? '#0369a1' : '#991b1b'}
                        rx="2"
                      />
                      <text
                        x="9"
                        y={Math.max(y - 4, 11)}
                        fill="#ffffff"
                        fontSize="8.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {pos.type} {pos.lot.toFixed(2)} ({pos.profit >= 0 ? `+$${pos.profit.toFixed(2)}` : `-$${Math.abs(pos.profit).toFixed(2)}`})
                      </text>
                    </g>
                  );
                })}

                {/* Current Price Horizontal Bid Line */}
                <line
                  x1="0"
                  y1={getY(currentPrice)}
                  x2="100%"
                  y2={getY(currentPrice)}
                  stroke="#2cb5a8"
                  strokeWidth="0.8"
                  strokeDasharray="2,2"
                  opacity="0.8"
                />

                {/* Candlesticks & Wicks */}
                {candles.map((candle, idx) => {
                  const isBull = candle.close >= candle.open;
                  const candleColor = isBull ? '#2cb5a8' : '#e54a50';
                  const x = idx * (candleWidth + candleGap) + 15;
                  const openY = getY(candle.open);
                  const closeY = getY(candle.close);
                  const highY = getY(candle.high);
                  const lowY = getY(candle.low);
                  const topY = Math.min(openY, closeY);
                  const bodyHeight = Math.max(Math.abs(closeY - openY), 2);

                  return (
                    <g key={idx} className="transition-all duration-150">
                      <line
                        x1={x + candleWidth / 2}
                        y1={highY}
                        x2={x + candleWidth / 2}
                        y2={lowY}
                        stroke={candleColor}
                        strokeWidth="1.2"
                      />
                      <rect
                        x={x}
                        y={topY}
                        width={candleWidth}
                        height={bodyHeight}
                        fill={candleColor}
                        stroke={candleColor}
                        strokeWidth="0.5"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Right Vertical Price Ladder & Active Price Tag */}
            <div className="w-16 bg-[#000000] border-l border-zinc-900 flex flex-col justify-between py-1 text-[9px] font-mono text-zinc-400 shrink-0 select-none relative">
              {priceAxisLabels.map((lbl, idx) => (
                <span key={idx} className="px-1 text-right truncate">
                  {lbl}
                </span>
              ))}

              {/* Active Floating Teal Price Box & Timer Tag */}
              <div
                className="absolute right-0 bg-[#2cb5a8] text-black font-black px-1 py-0.5 rounded-l text-[9px] font-mono shadow leading-tight text-right transition-all duration-200"
                style={{
                  top: `${Math.min(Math.max(getY(currentPrice) - 10, 5), chartHeight - 30)}px`,
                }}
              >
                <div>{currentPrice.toFixed(activeConfig.decimals)}</div>
                <div className="text-[8px] font-normal text-zinc-900">{formattedCountdown}</div>
              </div>

              {/* Order price markers */}
              {symbolPositions.length > 0 ? (
                symbolPositions.map((p) => (
                  <div
                    key={p.id}
                    className={`absolute right-0 border bg-black font-black px-1 text-[8px] font-mono rounded-l ${
                      p.type === 'BUY' ? 'border-[#38bdf8] text-[#38bdf8]' : 'border-[#e54a50] text-[#e54a50]'
                    }`}
                    style={{
                      top: `${Math.min(Math.max(getY(p.entryPrice) - 6, 5), chartHeight - 20)}px`,
                    }}
                  >
                    {p.entryPrice.toFixed(activeConfig.decimals)}
                  </div>
                ))
              ) : activeConfig.sellOrderLine ? (
                <div
                  className="absolute right-0 border border-[#e54a50] bg-black text-[#e54a50] font-black px-1 text-[8px] font-mono rounded-l"
                  style={{
                    top: `${Math.min(Math.max(getY(activeConfig.sellOrderLine.price) - 6, 5), chartHeight - 20)}px`,
                  }}
                >
                  {activeConfig.sellOrderLine.price.toFixed(activeConfig.decimals)}
                </div>
              ) : null}
            </div>
          </div>

          {/* Horizontal Time Axis */}
          <div className="bg-[#000000] px-3 py-1 border-t border-zinc-900 flex items-center justify-between text-[9px] font-mono text-zinc-400">
            <span>{candles[0]?.time || '10:25'}</span>
            <span>{candles[Math.floor(candles.length * 0.33)]?.time || '10:55'}</span>
            <span>{candles[Math.floor(candles.length * 0.66)]?.time || '11:25'}</span>
            <span>{candles[candles.length - 1]?.time || '11:55'}</span>
          </div>
        </>
      )}

      {/* TRADE TAB (Open positions in AdvKings Broker) */}
      {activeNavTab === 'trade' && (
        <div className="h-[350px] overflow-y-auto p-3 bg-[#050907] space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div>
              <span className="text-zinc-400 text-[10px] block">ADV KINGS BROKER ACCOUNT</span>
              <span className="text-emerald-400 font-bold text-xs">{brokerAccountName}</span>
              <span className="text-[9px] text-emerald-400 font-mono block mt-0.5">
                Zero Latency ECN Gateway • 1:2000 Ultra Leverage
              </span>
            </div>
            <div className="text-right">
              <span className="text-zinc-400 text-[10px] block">FLOATING P/L</span>
              <span className={`font-black text-sm ${totalFloatingPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalFloatingPnl >= 0 ? `+$${totalFloatingPnl.toFixed(2)}` : `-$${Math.abs(totalFloatingPnl).toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-black/60 p-2 rounded-lg border border-zinc-800 text-[10px]">
            <div>
              <span className="text-zinc-500 block">Balance</span>
              <span className="text-white font-bold">${currentBalance.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Equity</span>
              <span className="text-yellow-400 font-bold">${(currentBalance + totalFloatingPnl).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Open Trades</span>
              <span className="text-sky-400 font-bold">{activePositions.length}</span>
            </div>
          </div>

          {activePositions.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 space-y-2">
              <p className="text-xs">No active open positions in AdvKings Broker.</p>
              <p className="text-[10px] text-zinc-400">
                Use the SELL or BUY buttons above to execute a trade with your Play Balance.
              </p>
              <button
                onClick={() => setActiveNavTab('charts')}
                className="text-[11px] bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 px-3 py-1 rounded-lg border border-sky-500/40"
              >
                Go to Charts
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {activePositions.map((pos) => (
                <div
                  key={pos.id}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between hover:border-emerald-500/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                          pos.type === 'BUY' ? 'bg-sky-500 text-black' : 'bg-rose-500 text-white'
                        }`}
                      >
                        {pos.type}
                      </span>
                      <span className="text-white font-bold text-xs">{pos.symbol}</span>
                      <span className="text-zinc-400 text-[10px]">{pos.lot.toFixed(2)} lot</span>
                      {pos.isAiBot && (
                        <span className="text-[8px] bg-amber-400/20 text-amber-300 px-1 rounded border border-amber-400/30">
                          AI Bot
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">
                      <span>Entry: {pos.entryPrice}</span>
                      <span className="mx-1">•</span>
                      <span>Margin: ${pos.margin.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span
                      className={`text-xs font-black ${
                        pos.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {pos.profit >= 0 ? `+$${pos.profit.toFixed(2)}` : `-$${Math.abs(pos.profit).toFixed(2)}`}
                    </span>
                    {onClosePosition && (
                      <button
                        onClick={() => onClosePosition(pos.id)}
                        className="text-[9px] bg-zinc-800 hover:bg-rose-600 text-white px-2 py-0.5 rounded transition-colors font-sans"
                      >
                        Close Trade
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* QUOTES TAB */}
      {activeNavTab === 'quotes' && (
        <div className="h-[350px] overflow-y-auto p-3 bg-[#050907] space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-[10px] text-zinc-400">
            <span>INSTRUMENT</span>
            <div className="flex gap-4">
              <span>BID</span>
              <span>ASK</span>
            </div>
          </div>
          {(Object.keys(MT5_PAIRS) as MT5PairKey[]).map((key) => {
            const p = MT5_PAIRS[key];
            const isSelected = activePairKey === key;
            const liveBid = isSelected ? currentPrice : p.defaultPrice;
            const liveAsk = Number((liveBid + p.spread).toFixed(p.decimals));
            return (
              <div
                key={key}
                onClick={() => {
                  setActivePairKey(key);
                  setActiveNavTab('charts');
                  soundManager.playCoin();
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/50'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-xs">{p.symbol}</span>
                    <span className="text-[9px] text-zinc-400 bg-zinc-800 px-1 rounded">{p.timeframe}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block truncate max-w-[140px]">{p.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-rose-400 font-bold block">{liveBid.toFixed(p.decimals)}</span>
                    <span className="text-[9px] text-zinc-500">Spread: {p.spread}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sky-400 font-bold block">{liveAsk.toFixed(p.decimals)}</span>
                    <span className="text-[9px] text-emerald-400">ECN 0.0</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeNavTab === 'history' && (() => {
        const totalClosed = closedPositions.length;
        const winCount = closedPositions.filter((c) => c.profit >= 0).length;
        const lossCount = closedPositions.filter((c) => c.profit < 0).length;
        const winRate = totalClosed > 0 ? ((winCount / totalClosed) * 100).toFixed(1) : '99.4';
        const totalRealized = closedPositions.reduce((s, c) => s + c.profit, 0);

        return (
          <div className="h-[350px] overflow-y-auto p-3 bg-[#050907] space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-[10px] text-zinc-400">
              <span>CLOSED TRADES ({totalClosed})</span>
              <span className={`font-bold ${totalRealized >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                Realized: {totalRealized >= 0 ? `+$${totalRealized.toFixed(2)}` : `-$${Math.abs(totalRealized).toFixed(2)}`}
              </span>
            </div>

            {/* Session Win / Loss Ratio HUD */}
            <div className="bg-black/70 p-2 rounded-lg border border-zinc-800 flex items-center justify-between text-[10px]">
              <div>
                <span className="text-zinc-400 block">WIN RATE</span>
                <span className="text-yellow-300 font-black">{winRate}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">🟢 {winCount} Wins</span>
                <span className="text-zinc-600">•</span>
                <span className="text-rose-400 font-bold">🔴 {lossCount} Losses</span>
              </div>
            </div>

            {closedPositions.length === 0 ? (
              <div className="text-center py-10 text-zinc-500 text-xs">
                No closed trades yet in this session.
              </div>
            ) : (
              <div className="space-y-1.5">
                {closedPositions.map((c) => (
                  <div key={c.id} className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 flex items-center justify-between text-[11px]">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] font-bold px-1 rounded uppercase ${c.profit >= 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                          {c.profit >= 0 ? 'WIN' : 'LOSS'}
                        </span>
                        <span className="text-white font-bold">{c.symbol}</span>
                        <span className="text-zinc-400 text-[9px]">{c.type} {c.lot.toFixed(2)}</span>
                      </div>
                      <div className="text-[9px] text-zinc-500">{c.openTime} → {c.closeTime}</div>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${c.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {c.profit >= 0 ? `+$${c.profit.toFixed(2)}` : `-$${Math.abs(c.profit).toFixed(2)}`}
                      </span>
                      <span className="text-[8px] text-zinc-500 block">Ticket #{c.ticket}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* MESSAGES TAB */}
      {activeNavTab === 'messages' && (
        <div className="h-[350px] overflow-y-auto p-3 bg-[#050907] space-y-2 font-sans text-xs">
          <div className="text-[10px] text-zinc-400 font-mono pb-1 border-b border-zinc-800">
            ADV KINGS BROKER SYSTEM ALERTS
          </div>
          <div className="space-y-2">
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-emerald-500/20 text-zinc-300">
              <span className="text-emerald-400 font-bold block text-[11px]">✓ ECN STP Gateway Connected</span>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Server AdvKings-Live01 bridged with London LD4 liquidity providers. Zero latency order execution active.
              </p>
            </div>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-yellow-500/20 text-zinc-300">
              <span className="text-yellow-400 font-bold block text-[11px]">⚡ 99.4% AI Sniper Bot Engine Active</span>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Quantum neural algorithm loaded for Gold (XAUUSDm) & Bitcoin. 100% hands-free execution and zero drawdown hedging enabled.
              </p>
            </div>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-sky-500/20 text-zinc-300">
              <span className="text-sky-400 font-bold block text-[11px]">🏆 1:2000 Ultra Leverage Enabled</span>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Swap-free VIP accounts active. Control large positions with minimal play balance margin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. Bottom MT5 Mobile Navigation Bar */}
      <div className="bg-[#0a0a0a] border-t border-zinc-900 px-3 py-2 flex items-center justify-between text-[10px] font-sans">
        {/* Quotes */}
        <button
          type="button"
          onClick={() => setActiveNavTab('quotes')}
          className={`flex flex-col items-center gap-0.5 ${
            activeNavTab === 'quotes' ? 'text-[#38bdf8] font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Quotes</span>
        </button>

        {/* Charts */}
        <button
          type="button"
          onClick={() => setActiveNavTab('charts')}
          className={`flex flex-col items-center gap-0.5 ${
            activeNavTab === 'charts' ? 'text-[#38bdf8] font-black' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <BarChart2 className="w-4 h-4 text-[#38bdf8]" />
          <span className="text-[#38bdf8]">Charts</span>
        </button>

        {/* Trade */}
        <button
          type="button"
          onClick={() => setActiveNavTab('trade')}
          className={`flex flex-col items-center gap-0.5 ${
            activeNavTab === 'trade' ? 'text-[#38bdf8] font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span
            className={`text-white text-[9px] font-mono font-bold px-1.5 rounded-full mt-0.5 ${
              totalFloatingPnl >= 0 ? 'bg-emerald-600' : 'bg-[#e54a50]'
            }`}
          >
            {totalFloatingPnl >= 0 ? `+${totalFloatingPnl.toFixed(2)}` : totalFloatingPnl.toFixed(2)}
          </span>
        </button>

        {/* History */}
        <button
          type="button"
          onClick={() => setActiveNavTab('history')}
          className={`flex flex-col items-center gap-0.5 ${
            activeNavTab === 'history' ? 'text-[#38bdf8] font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>History</span>
        </button>

        {/* Messages */}
        <button
          type="button"
          onClick={() => setActiveNavTab('messages')}
          className={`flex flex-col items-center gap-0.5 ${
            activeNavTab === 'messages' ? 'text-[#38bdf8] font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Messages</span>
        </button>
      </div>

    </div>
  );
};

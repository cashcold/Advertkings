import React, { useState } from 'react';
import { HyipProject, PayoutProof } from '../types';
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  Star,
  CheckCircle2,
  ThumbsUp,
  DollarSign,
  Calculator,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Coins,
  Gem,
  Cpu,
  Flame,
  Award,
  Users,
  CreditCard,
  Send,
  MessageSquare,
  Shield,
  Activity,
  Crown,
  Gift,
  Tv,
  Smartphone,
  Sun,
  AlertTriangle
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { EnergyPointModal } from './EnergyPointModal';

interface HyipMonitorListProps {
  onOpenTelegram: (msg: string) => void;
  incrementClicks: () => void;
  soundEnabled?: boolean;
}

// Helper to calculate exact elapsed days from a start date (e.g., '2026-08-26') to today's date dynamically
export const calculateElapsedDays = (startDateStr: string): number => {
  const match = startDateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return 0;
  const [, year, month, day] = match;
  const startDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  const now = new Date();
  const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = todayMidnight.getTime() - startMidnight.getTime();
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
};

// Helper to format 'YYYY-MM-DD (Xd)' dynamically
export const formatSinceDate = (startDateStr: string): string => {
  const match = startDateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return startDateStr;
  const [, year, month, day] = match;
  const days = calculateElapsedDays(`${year}-${month}-${day}`);
  return `${year}-${month}-${day} (${days}d)`;
};

// Helper to format date-time always within the last 0-3 hours (e.g. 5 mins ago, 35 mins ago, 1 hour 25 mins ago)
export const getRecentFormattedDateTime = (minutesAgo: number = 0): string => {
  const clampedMinutes = Math.max(1, Math.min(minutesAgo, 160));
  const d = new Date(Date.now() - clampedMinutes * 60 * 1000);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const INITIAL_PROJECTS: HyipProject[] = [
  {
    id: 'energy-point',
    name: 'Energy Point',
    classType: 'Class "Premium" (TOP Choices)',
    status: 'PAYING',
    rating: 5.0,
    reviewsCount: 3840,
    securityBadge: '256-Bit SSL Encrypted & Treasury Insured',
    roi: 'Up to ₵1,800/Day (180d)',
    profitPlan: 'Crown 1 – Crown 7 (180 Days Contracts)',
    monitoredDeposit: '₵45,000 GHS',
    minDepositLimit: '₵100 GHS',
    lastPayout: getRecentFormattedDateTime(2),
    withdrawal: 'Instant (< 5 Min, Min ₵20)',
    affiliate: '10% - 2% - 1% (3 Multi-Tiers)',
    paymentMethods: ['Crypto', 'Mobile Money', 'MTN MoMo', 'AirtelTigo'],
    websiteUrl: 'https://energy-point-beta.vercel.app/register?ref=HYIPEXPLORERPRO391',
    description:
      'Energy Point connects clean solar & wind energy sponsor media with high-yield 180-day Crown contracts. Claim your instant ₵20 free welcome bonus upon signup, watch short daily clean power clips, and collect automated daily payouts straight to Mobile Money (MTN / AirtelTigo) or crypto wallets.',
    since: formatSinceDate('2026-10-01'),
    monitors: 1,
    featuredTag: '🔥 ₵20 SIGNUP GIFT • 180-DAY CROWN TIERS',
    votes: 3410,
    currencySymbol: '₵',
    bonusBadge: '₵20 Free Signup Gift',
    tagline: 'WATCH • EARN • GROW',
    payoutProofs: [
      {
        id: 'tx-ep-1',
        date: getRecentFormattedDateTime(2),
        amount: '₵20.00 GHS',
        currency: 'USDT (TRC20)',
        batchTx: 'Car***_M',
        status: 'Instant',
      },
      {
        id: 'tx-ep-2',
        date: getRecentFormattedDateTime(7),
        amount: '₵1,500.00 GHS',
        currency: 'Ethereum (ETH)',
        batchTx: 'Kof***ah',
        status: 'Instant',
      },
      {
        id: 'tx-ep-3',
        date: getRecentFormattedDateTime(16),
        amount: '₵250.00 GHS',
        currency: 'Bitcoin (BTC)',
        batchTx: 'Ele***_R',
        status: 'Instant',
      },
      {
        id: 'tx-ep-4',
        date: getRecentFormattedDateTime(24),
        amount: '₵35.00 GHS',
        currency: 'MTN MoMo',
        batchTx: 'Bit***99',
        status: 'Instant',
      },
      {
        id: 'tx-ep-5',
        date: getRecentFormattedDateTime(33),
        amount: '₵2,200.00 GHS',
        currency: 'Ethereum (ETH)',
        batchTx: 'Dav***_M',
        status: 'Instant',
      },
      {
        id: 'tx-ep-6',
        date: getRecentFormattedDateTime(45),
        amount: '₵400.00 GHS',
        currency: 'AirtelTigo MoMo',
        batchTx: 'Kwa***_O',
        status: 'Instant',
      },
      {
        id: 'tx-ep-7',
        date: getRecentFormattedDateTime(58),
        amount: '₵50.00 GHS',
        currency: 'USDT (TRC20)',
        batchTx: 'Mat***_R',
        status: 'Instant',
      },
      {
        id: 'tx-ep-8',
        date: getRecentFormattedDateTime(72),
        amount: '₵3,500.00 GHS',
        currency: 'MTN MoMo',
        batchTx: 'Emm***_W',
        status: 'Instant',
      },
      {
        id: 'tx-ep-9',
        date: getRecentFormattedDateTime(89),
        amount: '₵650.00 GHS',
        currency: 'Bitcoin (BTC)',
        batchTx: 'Ais***_B',
        status: 'Instant',
      },
      {
        id: 'tx-ep-10',
        date: getRecentFormattedDateTime(104),
        amount: '₵80.00 GHS',
        currency: 'USDT (TRC20)',
        batchTx: 'Mar***_V',
        status: 'Instant',
      },
      {
        id: 'tx-ep-11',
        date: getRecentFormattedDateTime(120),
        amount: '₵5,000.00 GHS',
        currency: 'Ethereum (ETH)',
        batchTx: 'Cry***ut',
        status: 'Instant',
      },
      {
        id: 'tx-ep-12',
        date: getRecentFormattedDateTime(140),
        amount: '₵1,000.00 GHS',
        currency: 'MTN MoMo',
        batchTx: 'Gol***er',
        status: 'Instant',
      },
    ],
  },
  {
    id: 'goldbod-pro',
    name: 'GoldBod Pro',
    classType: 'Class "Premium" (TOP Choices)',
    status: 'PAYING',
    rating: 4.9,
    reviewsCount: 2840,
    securityBadge: 'EV SSL',
    roi: '20%',
    profitPlan: '5% to 20% total profit (1 - 7 days)',
    monitoredDeposit: '$2500',
    minDepositLimit: '$50',
    lastPayout: getRecentFormattedDateTime(14),
    withdrawal: 'Instant',
    affiliate: '10% (First Deposit) / 5% - 2% - 1%',
    paymentMethods: ['Crypto'],
    websiteUrl: 'https://gold-bod-pro.vercel.app',
    description:
      'GoldBod Pro bridges institutional-grade cloud mining hardware with retail cryptocurrency investment opportunity. Offering automated, multi-currency yields with zero hardware requirements and high-efficiency ASIC mining rigs.',
    since: formatSinceDate('2026-08-31'),
    monitors: 1,
    featuredTag: 'HIGH VOLUME MINING',
    votes: 2190,
    payoutProofs: [
      {
        id: 'tx-gbp-1',
        date: getRecentFormattedDateTime(14),
        amount: '$500.00',
        currency: 'USDT (TRC20)',
        batchTx: '0x992c...001f',
        status: 'Instant',
      },
      {
        id: 'tx-gbp-2',
        date: getRecentFormattedDateTime(58),
        amount: '$250.00',
        currency: 'USDT (BEP20)',
        batchTx: '0x7a4d...9382',
        status: 'Instant',
      },
      {
        id: 'tx-gbp-3',
        date: getRecentFormattedDateTime(115),
        amount: '$350.00',
        currency: 'BTC / ETH',
        batchTx: '0x12bb...887e',
        status: 'Instant',
      },
    ],
  },
  {
    id: 'aura-diamond-holdings',
    name: 'Aura Diamond Holdings',
    classType: 'Class "Premium" (TOP Choices)',
    status: 'PAYING',
    rating: 5.0,
    reviewsCount: 3,
    securityBadge: 'Enterprise Security (Insured)',
    roi: '20%',
    profitPlan: '5% to 20% total profit (1 - 7 days)',
    monitoredDeposit: '$2200',
    minDepositLimit: '$20',
    lastPayout: getRecentFormattedDateTime(8),
    withdrawal: 'Instant',
    affiliate: '5% - 2% - 1%',
    paymentMethods: ['Crypto'],
    websiteUrl: 'https://aura-diamond-holdings.vercel.app',
    description:
      'Aura Diamond Holdings bridges institutional high-carat diamond reserves and cryptographic vaults, delivering steady daily capital growth and liquid commodity contracts to worldwide private investors.',
    since: formatSinceDate('2026-08-26'),
    monitors: 1,
    featuredTag: 'INSURED TOP CHOICE',
    votes: 428,
    payoutProofs: [
      {
        id: 'tx-adh-1',
        date: getRecentFormattedDateTime(8),
        amount: '$440.00',
        currency: 'USDT (TRC20)',
        batchTx: '0x8f2a...7c91',
        status: 'Instant',
      },
      {
        id: 'tx-adh-2',
        date: getRecentFormattedDateTime(42),
        amount: '$220.00',
        currency: 'USDT (BEP20)',
        batchTx: '0x3d1b...912a',
        status: 'Instant',
      },
      {
        id: 'tx-adh-3',
        date: getRecentFormattedDateTime(95),
        amount: '$110.00',
        currency: 'BTC',
        batchTx: '0x6e9f...44b1',
        status: 'Instant',
      },
    ],
  },
  {
    id: 'cloudminex',
    name: 'CloudMineX',
    classType: 'Class "Premium" (TOP Choices)',
    status: 'WAITING',
    rating: 4.9,
    reviewsCount: 1240,
    securityBadge: 'EV SSL',
    roi: '12%',
    profitPlan: '5% to 12% daily (7 - 180 days)',
    monitoredDeposit: '$1500',
    minDepositLimit: '$10',
    lastPayout: getRecentFormattedDateTime(5),
    withdrawal: 'Pending Verification (Waiting)',
    affiliate: '10% (First Deposit) / 5% - 2% - 1%',
    paymentMethods: ['Crypto', 'MTN MoMo', 'Telecel Cash', 'AT Money'],
    websiteUrl: 'https://cloud-mine-x.vercel.app',
    description:
      'Next-Gen Cloud Mining Infrastructure providing automated, high-density cloud mining nodes. Rent enterprise-grade ASIC hash power and generate daily crypto rewards with zero hardware maintenance. [Status: Waiting for verification batch]',
    since: formatSinceDate('2026-09-01'),
    monitors: 1,
    featuredTag: '⏳ STATUS: WAITING FOR BATCH VERIFICATION',
    votes: 1680,
    payoutProofs: [
      {
        id: 'tx-cmx-1',
        date: getRecentFormattedDateTime(5),
        amount: '$180.00',
        currency: 'MTN MoMo',
        batchTx: 'MOMO-...7291',
        status: 'Instant',
      },
      {
        id: 'tx-cmx-2',
        date: getRecentFormattedDateTime(36),
        amount: '$120.00',
        currency: 'Telecel Cash',
        batchTx: 'TCEL-...8291',
        status: 'Instant',
      },
      {
        id: 'tx-cmx-3',
        date: getRecentFormattedDateTime(88),
        amount: '$240.00',
        currency: 'AT Money',
        batchTx: 'ATM-...1204',
        status: 'Instant',
      },
    ],
  },
  {
    id: 'prime-gold-resources',
    name: 'Prime Gold Resources',
    classType: 'Class "Premium" (TOP Choices)',
    status: 'WAITING',
    rating: 5.0,
    reviewsCount: 890,
    securityBadge: 'Enterprise Security (Insured)',
    roi: '20%',
    profitPlan: '5% to 20% total profit (1 - 7 days)',
    monitoredDeposit: '$3000',
    minDepositLimit: '$30',
    lastPayout: getRecentFormattedDateTime(11),
    withdrawal: 'Pending Verification (Waiting)',
    affiliate: '6% - 2% - 1%',
    paymentMethods: ['Crypto'],
    websiteUrl: 'https://prime-gold-resources.vercel.app',
    description:
      'Prime Gold Resources connects audited physical gold bullion mining operations with high-yield decentralized asset allocation. Enjoy secure, asset-backed commodity profits with instant withdrawal capabilities. [Status: Waiting for verification batch]',
    since: formatSinceDate('2026-08-29'),
    monitors: 1,
    featuredTag: '⏳ STATUS: WAITING FOR BATCH VERIFICATION',
    votes: 1340,
    payoutProofs: [
      {
        id: 'tx-pgr-1',
        date: getRecentFormattedDateTime(11),
        amount: '$600.00',
        currency: 'USDT (TRC20)',
        batchTx: '0x4c8e...117a',
        status: 'Instant',
      },
      {
        id: 'tx-pgr-2',
        date: getRecentFormattedDateTime(49),
        amount: '$300.00',
        currency: 'USDT (BEP20)',
        batchTx: '0x91d3...884c',
        status: 'Instant',
      },
      {
        id: 'tx-pgr-3',
        date: getRecentFormattedDateTime(102),
        amount: '$450.00',
        currency: 'BTC / ETH',
        batchTx: '0x55aa...209b',
        status: 'Instant',
      },
    ],
  },
];

export const HyipMonitorList: React.FC<HyipMonitorListProps> = ({
  onOpenTelegram,
  incrementClicks,
  soundEnabled = true,
}) => {
  const [projects, setProjects] = useState<HyipProject[]>(INITIAL_PROJECTS);
  const [expandedProofs, setExpandedProofs] = useState<{ [key: string]: boolean }>({});
  const [calcProject, setCalcProject] = useState<HyipProject | null>(null);
  const [calcDeposit, setCalcDeposit] = useState<number>(100);
  const [calcDays, setCalcDays] = useState<number>(7);
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PAYING' | 'WAITING'>('ALL');
  const [userVoted, setUserVoted] = useState<{ [key: string]: boolean }>({});
  const [reviewModalProject, setReviewModalProject] = useState<HyipProject | null>(null);
  const [userReviewRating, setUserReviewRating] = useState<number>(5);
  const [userReviewText, setUserReviewText] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [isEnergyPointModalOpen, setIsEnergyPointModalOpen] = useState<boolean>(false);

  const toggleProofs = (id: string) => {
    setExpandedProofs((prev) => ({ ...prev, [id]: !prev[id] }));
    if (soundEnabled) soundManager.playSpinTick();
  };

  const handleVote = (id: string) => {
    if (userVoted[id]) return;
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, votes: p.votes + 1 } : p))
    );
    setUserVoted((prev) => ({ ...prev, [id]: true }));
    incrementClicks();
    if (soundEnabled) soundManager.playCoin();
  };

  const handleOpenCalc = (p: HyipProject) => {
    setCalcProject(p);
    const minVal = parseInt(p.minDepositLimit.replace(/[^0-9]/g, ''), 10) || 50;
    setCalcDeposit(Math.max(minVal, 100));
    setCalcDays(7);
    if (soundEnabled) soundManager.playSpinTick();
  };

  const handleOpenReview = (p: HyipProject) => {
    setReviewModalProject(p);
    setUserReviewRating(5);
    setUserReviewText('');
    setReviewSubmitted(false);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalProject) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === reviewModalProject.id
          ? {
              ...p,
              reviewsCount: p.reviewsCount + 1,
              votes: p.votes + 1,
            }
          : p
      )
    );
    setReviewSubmitted(true);
    if (soundEnabled) soundManager.playWinFanfare();
    setTimeout(() => {
      setReviewModalProject(null);
      setReviewSubmitted(false);
    }, 1800);
  };

  const filteredProjects = projects.filter((p) => {
    if (filterStatus !== 'ALL' && p.status !== filterStatus) return false;
    if (filterMethod === 'all') return true;
    if (filterMethod === 'Crypto') return p.paymentMethods.includes('Crypto');
    if (filterMethod === 'Mobile Money') {
      return (
        p.paymentMethods.includes('Mobile Money') ||
        p.paymentMethods.includes('MTN MoMo') ||
        p.paymentMethods.includes('Telecel Cash') ||
        p.paymentMethods.includes('AT Money') ||
        p.paymentMethods.includes('AirtelTigo')
      );
    }
    return p.paymentMethods.includes(filterMethod);
  });

  const getProjectIcon = (id: string) => {
    if (id === 'energy-point') {
      return (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-600 to-amber-500 border-2 border-emerald-300 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]">
          <Zap className="w-8 h-8 text-yellow-200 fill-yellow-400/40 animate-pulse" />
        </div>
      );
    }
    if (id === 'aura-diamond-holdings') {
      return (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-900 border-2 border-cyan-300 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]">
          <Gem className="w-8 h-8 text-cyan-200 fill-cyan-400/30 animate-pulse" />
        </div>
      );
    }
    if (id === 'goldbod-pro') {
      return (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-600 to-yellow-900 border-2 border-yellow-300 flex items-center justify-center text-white shadow-[0_0_20px_rgba(234,179,8,0.5)]">
          <Coins className="w-8 h-8 text-yellow-200 fill-yellow-400/30 animate-bounce" />
        </div>
      );
    }
    if (id === 'prime-gold-resources') {
      return (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-600 to-amber-950 border-2 border-amber-300 flex items-center justify-center text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]">
          <Flame className="w-8 h-8 text-amber-200 fill-amber-400/40 animate-pulse" />
        </div>
      );
    }
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-600 to-zinc-900 border-2 border-emerald-300 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]">
        <Cpu className="w-8 h-8 text-emerald-200 animate-pulse" />
      </div>
    );
  };

  const calculateProjectProfit = (p: HyipProject, amount: number, days: number) => {
    if (p.id === 'energy-point') {
      const dailyRate = amount >= 2500 ? 0.15 : amount >= 1000 ? 0.10 : 0.0833;
      const dailyProfit = amount * dailyRate;
      const totalProfit = dailyProfit * days;
      const totalReturn = amount + totalProfit;
      return {
        dailyRate: `${(dailyRate * 100).toFixed(1)}% daily (₵${dailyProfit.toFixed(2)}/day)`,
        totalProfit: totalProfit.toFixed(2),
        totalReturn: totalReturn.toFixed(2),
        currency: '₵ GHS',
      };
    }
    if (p.id === 'cloudminex') {
      // 5% to 12% daily
      const dailyRate = 0.12;
      const totalProfit = amount * dailyRate * days;
      const totalReturn = amount + totalProfit;
      return { dailyRate: '12%', totalProfit: totalProfit.toFixed(2), totalReturn: totalReturn.toFixed(2), currency: '$ USDT' };
    }
    // 5% to 20% total profit for 1-7 days
    const totalProfit = amount * 0.2;
    const totalReturn = amount + totalProfit;
    return { dailyRate: '20% total', totalProfit: totalProfit.toFixed(2), totalReturn: totalReturn.toFixed(2), currency: '$ USDT' };
  };

  return (
    <section className="my-8 rounded-3xl bg-[#08080a]/95 border-2 border-yellow-500/80 p-4 sm:p-7 shadow-2xl backdrop-blur-md glow-gold relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-yellow-500/30 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-black font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider animate-blink-fast border border-yellow-200 flex items-center gap-1 shadow-[0_0_12px_rgba(234,179,8,0.5)]">
              <Zap className="w-3.5 h-3.5 fill-black" /> CLASS "PREMIUM" (TOP CHOICES)
            </span>
            <span className="bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-md uppercase tracking-tight flex items-center gap-1 border border-emerald-400/80 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-3.5 h-3.5" /> {projects.filter((p) => p.status === 'PAYING').length} PAYING
            </span>
            <span className="bg-amber-500 text-black font-black text-xs px-3 py-1 rounded-md uppercase tracking-tight flex items-center gap-1 border border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]">
              <Clock className="w-3.5 h-3.5" /> {projects.filter((p) => p.status === 'WAITING').length} WAITING
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-500 uppercase tracking-tight drop-shadow-[0_2px_10px_rgba(234,179,8,0.3)]">
            OFFICIAL HYIP PAYING PROJECTS MONITOR
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-bold mt-1">
            Real-time automated withdrawal proofs, monitored deposit insurance, and multi-currency payout ledger.
          </p>
        </div>

        {/* Aggregate Monitor Stats Badge */}
        <div className="flex items-center gap-3 bg-[#0e0e12] border border-yellow-500/40 rounded-2xl p-3 shadow-inner">
          <div className="text-center px-2">
            <span className="text-[10px] text-zinc-500 font-black block uppercase">TOTAL MONITORED</span>
            <span className="text-lg font-black text-yellow-400 font-mono">$76,200 USDT</span>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="text-center px-2">
            <span className="text-[10px] text-zinc-500 font-black block uppercase">AVG RATING</span>
            <span className="text-lg font-black text-emerald-400 font-mono flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 8.95
            </span>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <button
            onClick={() =>
              onOpenTelegram('Hi, I want to submit my HYIP project for Premium Class Monitoring!')
            }
            className="px-3 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs rounded-xl shadow-[0_0_12px_rgba(234,179,8,0.4)] flex items-center gap-1 transition-transform hover:scale-105 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SUBMIT PROJECT</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar: Status tabs & Payment Methods */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0a0a0f] p-3 rounded-2xl border border-zinc-800/80">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-zinc-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-yellow-400" /> Status:
            </span>
            <button
              onClick={() => {
                setFilterStatus('ALL');
                if (soundEnabled) soundManager.playSpinTick();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition-all border ${
                filterStatus === 'ALL'
                  ? 'bg-yellow-400 text-black border-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => {
                setFilterStatus('PAYING');
                if (soundEnabled) soundManager.playSpinTick();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition-all border flex items-center gap-1 ${
                filterStatus === 'PAYING'
                  ? 'bg-emerald-500 text-black border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                  : 'bg-zinc-900 text-emerald-400 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Paying ({projects.filter((p) => p.status === 'PAYING').length})
            </button>
            <button
              onClick={() => {
                setFilterStatus('WAITING');
                if (soundEnabled) soundManager.playSpinTick();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition-all border flex items-center gap-1 ${
                filterStatus === 'WAITING'
                  ? 'bg-amber-500 text-black border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'bg-zinc-900 text-amber-400 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Waiting ({projects.filter((p) => p.status === 'WAITING').length})
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <Activity className="w-3.5 h-3.5 text-green-400 animate-pulse" />
            <span>Last Monitor Sync: {getRecentFormattedDateTime(2)}</span>
          </div>
        </div>

        {/* Payment Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-zinc-400 mr-2 flex items-center gap-1 shrink-0">
            <CreditCard className="w-3.5 h-3.5 text-yellow-400" /> Filter Payment:
          </span>
          {['all', 'Crypto', 'Mobile Money', 'MTN MoMo', 'AirtelTigo', 'Telecel Cash', 'AT Money'].map((m) => (
            <button
              key={m}
              onClick={() => {
                setFilterMethod(m);
                if (soundEnabled) soundManager.playSpinTick();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition-all border shrink-0 ${
                filterMethod === m
                  ? 'bg-yellow-400 text-black border-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {m === 'all' ? 'All Currencies' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Cards List */}
      <div className="space-y-6">
        {filteredProjects.map((p) => {
          const isProofsOpen = expandedProofs[p.id];
          const hasVoted = userVoted[p.id];

          return (
            <div
              key={p.id}
              className={`relative overflow-hidden rounded-2xl bg-[#0c0c10] border-2 transition-all p-5 sm:p-6 shadow-xl backdrop-blur-md ${
                p.status === 'WAITING'
                  ? 'border-amber-500/60 hover:border-amber-400'
                  : 'border-yellow-500/50 hover:border-yellow-400/90'
              }`}
            >
              {/* Top Row: Class tag, Status badge, Security Badge */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800/90 pb-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-yellow-500/20 text-yellow-300 font-black text-xs px-2.5 py-0.5 rounded-md border border-yellow-400/50 flex items-center gap-1 uppercase tracking-tight">
                    <Sparkles className="w-3 h-3 text-yellow-400" /> {p.classType}
                  </span>
                  {p.status === 'WAITING' ? (
                    <span className="bg-amber-500 text-black font-black text-xs px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 border border-amber-300 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.6)]">
                      <Clock className="w-3.5 h-3.5 fill-black/20" /> WAITING
                    </span>
                  ) : p.status === 'PAYING' ? (
                    <span className="bg-emerald-600 text-white font-black text-xs px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 border border-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PAYING
                    </span>
                  ) : (
                    <span className="bg-rose-600 text-white font-black text-xs px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 border border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                      <AlertTriangle className="w-3.5 h-3.5" /> {p.status}
                    </span>
                  )}
                  {p.bonusBadge && (
                    <span className="bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-black font-black text-xs px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 border border-yellow-200 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                      <Gift className="w-3.5 h-3.5 fill-black" /> {p.bonusBadge}
                    </span>
                  )}
                  <span className="bg-blue-900/40 text-cyan-300 font-bold text-xs px-2.5 py-0.5 rounded-md border border-cyan-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> {p.securityBadge}
                  </span>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(p.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-zinc-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-mono font-black text-yellow-300 text-xs ml-1">
                      {p.rating.toFixed(1)}
                    </span>
                    <span className="text-[11px] text-zinc-400">({p.reviewsCount} reviews)</span>
                  </div>

                  <button
                    onClick={() => handleOpenReview(p)}
                    className="text-[11px] font-bold text-yellow-400 hover:text-yellow-300 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 px-2 py-1 rounded-md transition-colors"
                  >
                    + Review
                  </button>
                </div>
              </div>

              {/* Waiting Status Callout Banner */}
              {p.status === 'WAITING' && (
                <div className="mb-4 bg-amber-500/15 border border-amber-400/50 rounded-xl p-3 flex items-center justify-between gap-3 text-amber-200">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
                    <span>
                      STATUS: <span className="bg-amber-400 text-black px-1.5 py-0.5 rounded font-black tracking-wide">WAITING</span> &mdash; {p.name} is awaiting our next monitored batch payout verification.
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-300/90 hidden sm:inline-block bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
                    Batch Sync: Pending
                  </span>
                </div>
              )}

              {/* Main Project Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Col: Icon, Title, Description, Payment Badges (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      {getProjectIcon(p.id)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                            {p.name}
                          </h3>
                          {p.websiteUrl && (
                            <a
                              href={p.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-500/40 px-2 py-0.5 rounded-lg transition-colors"
                              title={`Visit ${p.name} Official Website`}
                            >
                              <ExternalLink className="w-3 h-3 text-yellow-400" />
                              <span>Official Site</span>
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium mt-0.5">
                          <span className="flex items-center gap-1 text-yellow-300 font-bold">
                            <Clock className="w-3.5 h-3.5" /> Since: {formatSinceDate(p.since)}
                          </span>
                          <span>•</span>
                          <span className="text-zinc-400">Monitors: {p.monitors}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed bg-[#060608] p-3 rounded-xl border border-zinc-800/80 mb-3">
                      {p.description}
                    </p>
                  </div>

                  {/* Accepted Currencies Tags */}
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">
                      ACCEPTED PAYMENT METHODS:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {p.paymentMethods.map((pm, idx) => (
                        <span
                          key={idx}
                          className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                            pm === 'Crypto'
                              ? 'bg-amber-950/40 text-yellow-300 border-yellow-500/40'
                              : pm === 'Mobile Money'
                              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                              : pm === 'MTN MoMo'
                              ? 'bg-yellow-900/40 text-yellow-200 border-yellow-400/50'
                              : pm === 'Telecel Cash'
                              ? 'bg-red-950/40 text-red-300 border-red-500/40'
                              : 'bg-blue-950/40 text-cyan-300 border-cyan-500/40'
                          }`}
                        >
                          <Coins className="w-3 h-3" /> {pm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Col: Performance Spec Matrix (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between h-full bg-[#08080c] rounded-2xl p-4 border border-zinc-800">
                  {/* Performance Matrix 2x3 Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {/* ROI Box */}
                    <div className="bg-black/60 p-2.5 rounded-xl border border-yellow-500/30">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                        MAX ROI
                      </span>
                      <span className="font-mono font-black text-xl text-yellow-400 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-yellow-400" /> {p.roi}
                      </span>
                    </div>

                    {/* Monitored Deposit Box */}
                    <div className="bg-black/60 p-2.5 rounded-xl border border-emerald-500/30">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                        MONITORED DEPOSIT
                      </span>
                      <span className="font-mono font-black text-xl text-emerald-400">
                        {p.monitoredDeposit}
                      </span>
                    </div>

                    {/* Min Deposit Box */}
                    <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                        MIN DEPOSIT LIMIT
                      </span>
                      <span className="font-mono font-black text-xl text-zinc-200">
                        {p.minDepositLimit}
                      </span>
                    </div>

                    {/* Profit Plan Box */}
                    <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-800 sm:col-span-2">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                        YIELD / PROFIT PLAN
                      </span>
                      <span className="font-black text-xs sm:text-sm text-yellow-300">
                        ⚡ {p.profitPlan}
                      </span>
                    </div>

                    {/* Withdrawal Box */}
                    <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                        WITHDRAWAL SPEED
                      </span>
                      <span
                        className={`font-black text-xs sm:text-sm flex items-center gap-1 ${
                          p.status === 'WAITING' ? 'text-amber-400' : 'text-green-400'
                        }`}
                      >
                        {p.status === 'WAITING' ? (
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Zap className="w-3.5 h-3.5 fill-green-400" />
                        )}
                        {p.withdrawal}
                      </span>
                    </div>
                  </div>

                  {/* Secondary Details: Last payout & Affiliate tier */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs bg-black/40 p-2.5 rounded-xl border border-zinc-800/80 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-zinc-400">Last Payout:</span>
                      <span className="font-mono font-bold text-emerald-300">{p.lastPayout}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="text-zinc-400">Affiliate:</span>
                      <span className="font-mono font-bold text-yellow-300">{p.affiliate}</span>
                    </div>
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Invest CTA - Direct Project Website Redirect */}
                    <button
                      id={`invest-btn-${p.id}`}
                      onClick={() => {
                        incrementClicks();
                        if (soundEnabled) soundManager.playCoin();
                        if (p.websiteUrl) {
                          window.open(p.websiteUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className={`flex-1 min-w-[140px] py-3 px-4 text-black font-black text-xs sm:text-sm rounded-xl border flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95 uppercase tracking-wide ${
                        p.status === 'WAITING'
                          ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                          : 'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 hover:from-red-500 hover:to-yellow-300 border-yellow-200 shadow-[0_0_20px_rgba(234,179,8,0.5)] pulse-cta'
                      }`}
                    >
                      <ExternalLink className="w-4 h-4 text-black" />
                      <span>
                        {p.status === 'WAITING'
                          ? `VISIT ${p.name.toUpperCase()} (STATUS: WAITING)`
                          : `INVEST IN ${p.name.toUpperCase()} (OFFICIAL SITE)`}
                      </span>
                    </button>

                    {/* Website Redirection CTA */}
                    {p.websiteUrl && (
                      <a
                        href={p.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={incrementClicks}
                        className="py-3 px-3.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/10 hover:from-yellow-500/30 hover:to-amber-500/20 text-yellow-300 font-black text-xs rounded-xl border border-yellow-500/50 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 uppercase tracking-wide shadow-sm"
                        title={`Go to ${p.name} Website`}
                      >
                        <ExternalLink className="w-4 h-4 text-yellow-400" />
                        <span>VISIT WEBSITE</span>
                      </a>
                    )}

                    {/* Energy Point Crown Plans Deep-Dive Button */}
                    {p.id === 'energy-point' && (
                      <button
                        onClick={() => {
                          setIsEnergyPointModalOpen(true);
                          if (soundEnabled) soundManager.playSpinTick();
                        }}
                        className="py-3 px-3.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs uppercase rounded-xl border border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
                        title="View 7 Crown Plans & Watch & Earn"
                      >
                        <Crown className="w-4 h-4 text-black fill-yellow-400" />
                        <span>7 CROWN PLANS & WATCH & EARN</span>
                      </button>
                    )}

                    {/* Calculator Button */}
                    <button
                      onClick={() => handleOpenCalc(p)}
                      className="py-3 px-3 bg-zinc-900 hover:bg-zinc-800 text-yellow-300 font-bold text-xs rounded-xl border border-yellow-500/40 flex items-center gap-1.5 transition-colors"
                      title="Calculate ROI"
                    >
                      <Calculator className="w-4 h-4 text-yellow-400" />
                      <span className="hidden sm:inline">Calculator</span>
                    </button>

                    {/* Vote Upvote Button */}
                    <button
                      onClick={() => handleVote(p.id)}
                      disabled={hasVoted}
                      className={`py-3 px-3.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all ${
                        hasVoted
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                      }`}
                      title="Vote Paying Status"
                    >
                      <ThumbsUp className={`w-4 h-4 ${hasVoted ? 'fill-emerald-400' : ''}`} />
                      <span>{p.votes} Votes</span>
                    </button>

                    {/* Proofs toggle */}
                    <button
                      onClick={() => toggleProofs(p.id)}
                      className="py-3 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl border border-zinc-800 flex items-center gap-1 transition-colors"
                    >
                      <span className="text-[11px]">Payout Proofs</span>
                      {isProofsOpen ? (
                        <ChevronUp className="w-3.5 h-3.5 text-yellow-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Payout Proofs Table */}
              {isProofsOpen && (
                <div className="mt-4 pt-4 border-t border-zinc-800/90 animate-in fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" /> VERIFIED INSTANT PAYOUT PROOF LEDGER
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      All batches verified on blockchain & telco gateways
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="bg-black/60 text-zinc-400 border-b border-zinc-800">
                          <th className="py-2 px-3">Date & Time</th>
                          <th className="py-2 px-3">Amount</th>
                          <th className="py-2 px-3">Gateway / Method</th>
                          <th className="py-2 px-3">Batch TX ID</th>
                          <th className="py-2 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {p.payoutProofs.map((proof) => (
                          <tr key={proof.id} className="hover:bg-zinc-900/40">
                            <td className="py-2 px-3 text-zinc-300">{proof.date}</td>
                            <td className="py-2 px-3 text-emerald-400 font-black font-sans">
                              {proof.amount}
                            </td>
                            <td className="py-2 px-3 text-yellow-300">{proof.currency}</td>
                            <td className="py-2 px-3 text-cyan-400">{proof.batchTx}</td>
                            <td className="py-2 px-3 text-right">
                              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded text-[10px] font-sans font-black">
                                ⚡ {proof.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ROI Profit Calculator Modal */}
      {calcProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0c0c10] border-2 border-yellow-400 rounded-3xl p-6 shadow-2xl glow-gold">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-yellow-400/20 border border-yellow-400 flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-yellow-300 uppercase">
                    {calcProject.name} CALCULATOR
                  </h4>
                  <span className="text-[10px] text-zinc-400">{calcProject.profitPlan}</span>
                </div>
              </div>
              <button
                onClick={() => setCalcProject(null)}
                className="text-zinc-400 hover:text-white text-xs bg-zinc-900 p-1.5 rounded-lg border border-zinc-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 font-bold uppercase block mb-1">
                  Deposit Amount ($ USDT / Fiat Eqv):
                </label>
                <input
                  type="number"
                  value={calcDeposit}
                  onChange={(e) => setCalcDeposit(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-base font-black text-yellow-400 font-mono focus:border-yellow-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-bold uppercase block mb-1">
                  Duration (Days): {calcDays} Days
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={calcDays}
                  onChange={(e) => setCalcDays(Number(e.target.value))}
                  className="w-full accent-yellow-400"
                />
              </div>

              {/* Profit Calculation Result */}
              {(() => {
                const res = calculateProjectProfit(calcProject, calcDeposit, calcDays);
                return (
                  <div className="bg-black/80 rounded-xl p-3 border border-yellow-500/40 space-y-2">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Rate Mode:</span>
                      <span className="font-mono text-yellow-300 font-bold">{res.dailyRate}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Pure Net Profit:</span>
                      <span className="font-mono text-emerald-400 font-black text-sm">
                        +${res.totalProfit} USDT
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-200 font-bold border-t border-zinc-800 pt-1.5">
                      <span>Total Payout (Principal + Yield):</span>
                      <span className="font-mono text-yellow-400 font-black text-base">
                        ${res.totalReturn} USDT
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const p = calcProject;
                    setCalcProject(null);
                    onOpenTelegram(
                      `Hi, I want to invest $${calcDeposit} in ${p.name} for ${calcDays} days based on the HYIP Monitor Calculator!`
                    );
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-black font-black text-xs uppercase rounded-xl border border-white shadow-[0_0_15px_rgba(234,179,8,0.5)] flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>START WITH ${calcDeposit}</span>
                </button>

                {calcProject.websiteUrl && (
                  <a
                    href={calcProject.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={incrementClicks}
                    className="py-3 px-4 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 font-black text-xs uppercase rounded-xl border border-yellow-400/50 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>VISIT SITE</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0c0c10] border-2 border-yellow-400 rounded-3xl p-6 shadow-2xl glow-gold">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <h4 className="font-black text-sm text-yellow-300 uppercase">
                REVIEW {reviewModalProject.name}
              </h4>
              <button
                onClick={() => setReviewModalProject(null)}
                className="text-zinc-400 hover:text-white text-xs bg-zinc-900 p-1.5 rounded-lg border border-zinc-700"
              >
                ✕
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2 animate-bounce" />
                <h5 className="font-black text-base text-white">THANK YOU!</h5>
                <p className="text-xs text-zinc-400 mt-1">
                  Your review has been verified and added to the monitor ratings.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="text-zinc-400 font-bold uppercase block mb-1.5">
                    Your Rating:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setUserReviewRating(star)}
                        className="p-1 transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= userReviewRating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="font-black text-yellow-300 font-mono text-sm ml-2">
                      {userReviewRating}.0 / 5.0
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 font-bold uppercase block mb-1.5">
                    Payment Experience / Feedback:
                  </label>
                  <textarea
                    rows={3}
                    value={userReviewText}
                    onChange={(e) => setUserReviewText(e.target.value)}
                    placeholder="e.g. Received instant payout to TRC20 wallet within 30 seconds! Highly recommended."
                    required
                    className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-xs text-zinc-200 focus:border-yellow-400 focus:outline-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-black font-black text-xs uppercase rounded-xl border border-white shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SUBMIT VERIFIED RATING</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Energy Point Deep-Dive Modal with Crown Tiers, Watch & Earn & Android App */}
      <EnergyPointModal
        isOpen={isEnergyPointModalOpen}
        onClose={() => setIsEnergyPointModalOpen(false)}
        soundEnabled={soundEnabled}
        incrementClicks={incrementClicks}
      />
    </section>
  );
};

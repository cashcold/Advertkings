export type BannerCategory = 'all' | 'developers' | 'dropshipping' | 'hookup-dating' | 'sugar-mummy' | 'virtual-phone' | 'gift-card' | 'live-weather' | 'shopping' | 'hyip' | 'forex' | 'football' | 'virtual-games' | 'crypto-loan' | 'paypal' | 'casino' | 'lottery' | 'aviator' | 'gaming' | 'email-verification';

export interface VirtualBetHistoryItem {
  id: string;
  game: 'Virtue Football' | 'Virtue Horse 🐎' | 'Virtue Car Race 🏎' | 'Virtue Spin 🎡' | 'Virtue Penalty 🥅' | 'Virtue Greyhound 🐕';
  market: string;
  selection: string;
  stake: number;
  odds: number;
  payout: number;
  result: 'won' | 'lost' | 'pending';
  timestamp: Date | string;
}

export type BannerSize = 'all' | 'leaderboard' | 'medium-rect' | 'half-page' | 'billboard' | 'mobile-banner';

export interface BannerItem {
  id: string;
  title: string;
  category: BannerCategory;
  size: '728x90' | '300x250' | '300x600' | '970x250' | '320x100';
  sizeName: string;
  tagline: string;
  bonusText: string;
  badge: string;
  clicks: number;
  ctr: string;
  accentColor: string;
  bgGradient: string;
  telegramMessage: string;
  mascotType: 'doge' | 'duck' | 'ape' | 'frog' | 'piggy' | 'leprechaun';
  actionLabel: string;
  websiteUrl?: string;
}

export interface TelegramContactInfo {
  handle: string;
  channel: string;
  vipBot: string;
}

export interface LiveWinner {
  user: string;
  amount: string;
  game: string;
  timeAgo: string;
  avatar: string;
}

export interface PayoutProof {
  id: string;
  date: string;
  amount: string;
  currency: string;
  batchTx: string;
  status: 'Instant' | 'Processed';
}

export interface HyipProject {
  id: string;
  name: string;
  classType: string; // e.g. "Class 'Premium' (TOP Choices)"
  status: 'PAYING' | 'WAITING' | 'PROBLEM';
  rating: number; // e.g. 5, 4.9
  reviewsCount: number; // e.g. 3, 2840, 1240
  securityBadge: string; // e.g. "Enterprise Security (Insured)", "EV SSL"
  roi: string; // e.g. "20%", "12%"
  profitPlan: string; // e.g. "5% to 20% total profit (1 - 7 days)", "5% to 12% daily (7 - 180 days)"
  monitoredDeposit: string; // e.g. "$2200", "$2500", "$1500"
  minDepositLimit: string; // e.g. "$20", "$50", "$10"
  lastPayout: string; // e.g. "2026-08-26 09:27:22"
  withdrawal: string; // e.g. "Instant"
  affiliate: string; // e.g. "5% - 2% - 1%", "10% (First Deposit) / 5% - 2% - 1%"
  paymentMethods: string[]; // e.g. ["Crypto"], ["Crypto", "Mobile Money"], ["Crypto", "MTN MoMo", "Telecel Cash", "AT Money"]
  description: string;
  since: string; // e.g. "2026-08-26 (1d)", "2026-08-02 (8d)", "2026-08-02 (10d)"
  monitors: number;
  featuredTag?: string;
  votes: number;
  payoutProofs: PayoutProof[];
  websiteUrl?: string;
  currencySymbol?: string;
  bonusBadge?: string;
  tagline?: string;
  crownPlans?: {
    tier: string;
    energyLevel: string;
    investment: string;
    dailyIncome: string;
    period: string;
    totalIncome: string;
    isPopular?: boolean;
  }[];
  stats?: {
    activeMembers: string;
    totalPayouts: string;
    reserveCapital: string;
    cleanCapacity: string;
    onlineNow: number;
    uptime: string;
    launchDate?: string;
    runningDays?: number;
    avgWithdrawalTime?: string;
    totalDeposited?: string;
  };
  apkDetails?: {
    filename: string;
    size: string;
    checksum: string;
    version: string;
  };
}

export interface AuthUser {
  id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode?: string;
  telegramHandle?: string;
  balance: number;
  currency: string;
  memberStatus?: string;
  role: 'member' | 'vip' | 'admin';
  verified: boolean;
  avatar?: string;
}

export interface ReloadRequestItem {
  _id?: string;
  id?: string;
  type?: 'deposit' | 'withdraw';
  userEmail: string;
  userName: string;
  userId?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  referenceId?: string;
  destinationAddress?: string;
  userNote?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  reviewedBy?: string;
  reviewedAt?: string | Date;
  balanceBefore?: number;
  balanceAfter?: number;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

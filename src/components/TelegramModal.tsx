import React, { useState } from 'react';
import { 
  Send, 
  X, 
  Copy, 
  Check, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  ExternalLink, 
  QrCode,
  Phone,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Heart,
  Wallet,
  Trophy,
  CreditCard,
  Package,
  Users
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const TELEGRAM_GROUP_URL = 'https://t.me/+7Ish7gfkoxw3NjM8';

export type ContactChannel = 'telegram' | 'whatsapp';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  defaultHandle?: string;
  defaultWhatsapp?: string;
  defaultChannel?: ContactChannel;
}

const TEMPLATE_EXAMPLES = [
  {
    id: 'hyip-payout',
    label: '⚡ HYIP Payout & Proof',
    icon: Zap,
    category: 'HYIP Cashout',
    text: `⚡ HYIP WITHDRAWAL & CASHOUT PROOF INQUIRY:\n• Project: Aura Diamond VIP Reserve / GoldBod Pro\n• Transaction Type: Instant Dividend Withdrawal\n• Amount: $1,250.00 USDT (TRC20 / TON / MoMo)\nPlease verify my withdrawal status and send automated ledger confirmation!`,
  },
  {
    id: 'forex-bot',
    label: '🏆 99% Forex Bot',
    icon: TrendingUp,
    category: 'Forex Bot',
    text: `🏆 99% WIN FOREX AI BOT ACTIVATION REQUEST:\n• Bot Engine: 99.4% Gold HFT Sniper (XAUUSDm)\n• Accuracy: 99.4% Verified Win Rate\n• Terminal: MT4 / MT5 Japanese Candlesticks\n• Leverage: 1:2000 (Zero Spread ECN)\nPlease connect my trading account to the automated bot now!`,
  },
  {
    id: 'matchmaking',
    label: '👑 Sugar Match Meeting',
    icon: Heart,
    category: 'Matchmaking',
    text: `👑 VIP MATCH MEETING & SPONSOR INQUIRY:\n• Candidate Profile: Seeking VIP Matchmaker Consultation\n• Target Sponsor: Irina Volkova (#184811) / Sugar Mummy (Ages 37-78)\n• Meeting Preference: In-Person VIP Dinner & Date\n• Allowance Range: $15,000 - $25,000 / month\nPlease schedule my introduction meeting with your certified matchmaker team!`,
  },
  {
    id: 'paypal-loan',
    label: '💳 PayPal / Crypto Loan',
    icon: CreditCard,
    category: 'Fintech',
    text: `💳 INSTANT PAYPAL RELOAD / CRYPTO LOAN REQUEST:\n• Service: $500.00 PayPal Reload (0% Hold Penalty)\n• Funding Method: Crypto (USDT) / Mobile Money\n• Delivery Time: ~60 Seconds Automated\nPlease confirm target wallet details and initiate instant balance injection!`,
  },
  {
    id: 'casino-aviator',
    label: '🎰 Casino & Aviator VIP',
    icon: Trophy,
    category: 'Casino / Aviator',
    text: `🎰 FALCONE CASINO 500% BONUS & AVIATOR SIGNALS:\n• Bonus Claim: 500% VIP Deposit Match + 250 Free Spins\n• Aviator Bot: 99.8% Accuracy Crash Predictor (10 Free Daily Signals)\nPlease credit my welcome package and connect me to the live VIP signal channel!`,
  },
  {
    id: 'dropshipping-store',
    label: '📦 E-Com Dropship Store',
    icon: Package,
    category: 'Dropshipping',
    text: `📦 E-COMMERCE DROPSHIPPING & AUTOMATED STORE INQUIRY:\n• Service: Turnkey 1-Click Shopify / TikTok Shop Automated Store\n• Winning Product: 360° AI Auto-Tracking Face Gimbal / Viral Winners\n• Suppliers: Fast 2-4 Day US/EU Express Line (AutoDS / CJ VIP)\n• Video Ads Pack: 5x High-Converting UGC Creatives Included\nPlease send turnkey store deployment package and activation link!`,
  },
  {
    id: 'ad-rentals',
    label: '📢 Rent Ad Banner Spots',
    icon: Sparkles,
    category: 'Ad Network',
    text: `📢 AD BANNER RENTAL & SPONSORSHIP INQUIRY:\n• Slot Formats: 728x90 Leaderboard / 970x250 Billboard\n• Duration: 7 Days / 30 Days Top Placement\n• Payment Currency: USDT TRC20 / TON / BTC\nPlease provide available slot rates and immediate placement activation link!`,
  },
];

export const TelegramModal: React.FC<TelegramModalProps> = ({
  isOpen,
  onClose,
  initialMessage = 'Hi @adkingsSupport, I want to inquire about renting banner spots on AdKings Hub!',
  defaultHandle = 'adkingsSupport',
  defaultWhatsapp = '+13024998749',
  defaultChannel = 'telegram',
}) => {
  const [activeChannel, setActiveChannel] = useState<ContactChannel>(defaultChannel);
  const [message, setMessage] = useState<string>(initialMessage);
  const [handle, setHandle] = useState<string>(defaultHandle);
  const [whatsappNumber, setWhatsappNumber] = useState<string>(defaultWhatsapp);
  const [copied, setCopied] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(false);

  // Sync initial message when changed
  React.useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  if (!isOpen) return null;

  const targetHandle = handle.replace('@', '').trim() || 'adkingsSupport';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '') || '13024998749';

  const telegramUrl = `https://t.me/${targetHandle}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    soundManager.playCoin();
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenTelegram = () => {
    soundManager.playCoin();
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenWhatsapp = () => {
    soundManager.playCoin();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSelectTemplate = (templateText: string) => {
    setMessage(templateText);
    soundManager.playSpinTick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-[#09090c] border-2 border-yellow-500/80 p-4 sm:p-7 glow-gold shadow-2xl backdrop-blur-md max-h-[94vh] flex flex-col">
        {/* Close Button */}
        <button
          id="close-tg-modal-btn"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900/90 rounded-full border border-zinc-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 shrink-0 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-300 shrink-0">
            {activeChannel === 'telegram' ? (
              <Send className="w-6 h-6 fill-white" />
            ) : (
              <MessageCircle className="w-6 h-6 fill-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-xl font-black text-yellow-300 uppercase tracking-tight">
                DIRECT CHAT & SUPPORT CONCIERGE
              </h3>
              <span className="bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                NO KYC / NO SIGNUP
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-bold">
              Choose <span className="text-cyan-400">Telegram</span> or <span className="text-emerald-400">WhatsApp</span> for 24/7 instant response across all ads & services
            </p>
          </div>
        </div>

        {/* Official Telegram VIP Group Banner */}
        <div className="mb-3.5 p-3 rounded-2xl bg-gradient-to-r from-blue-950/90 via-indigo-950/80 to-cyan-950/90 border-2 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.35)] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-md shrink-0 border border-cyan-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-black text-cyan-200 uppercase tracking-tight">
                  OFFICIAL TELEGRAM GROUP
                </span>
                <span className="bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm animate-pulse">
                  ACTIVE COMMUNITY
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 font-medium">
                Join our Telegram group for daily signals, VIP bonuses, payment proofs & winners chat!
              </p>
            </div>
          </div>

          <a
            id="modal-join-telegram-group-btn"
            href={TELEGRAM_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playCoin()}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-black font-black text-xs sm:text-sm rounded-xl border border-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.5)] pulse-cta flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap"
            title="Join Official Telegram Group"
          >
            <Send className="w-3.5 h-3.5 fill-black text-black" />
            <span>JOIN GROUP NOW</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Channel Selector Tabs: Telegram vs WhatsApp */}
        <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
          <button
            id="select-channel-telegram-tab"
            type="button"
            onClick={() => {
              setActiveChannel('telegram');
              soundManager.playSpinTick();
            }}
            className={`p-3 rounded-2xl border flex items-center justify-center gap-2.5 font-black text-xs sm:text-sm transition-all ${
              activeChannel === 'telegram'
                ? 'bg-gradient-to-r from-blue-600/40 via-cyan-600/30 to-blue-900/40 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow">
              <Send className="w-3.5 h-3.5 fill-white" />
            </div>
            <div className="text-left">
              <div className="leading-tight">Chat on Telegram</div>
              <div className="text-[10px] opacity-75 font-mono">@{targetHandle}</div>
            </div>
          </button>

          <button
            id="select-channel-whatsapp-tab"
            type="button"
            onClick={() => {
              setActiveChannel('whatsapp');
              soundManager.playSpinTick();
            }}
            className={`p-3 rounded-2xl border flex items-center justify-center gap-2.5 font-black text-xs sm:text-sm transition-all ${
              activeChannel === 'whatsapp'
                ? 'bg-gradient-to-r from-emerald-600/40 via-green-600/30 to-teal-900/40 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
            </div>
            <div className="text-left">
              <div className="leading-tight">Chat on WhatsApp</div>
              <div className="text-[10px] opacity-75 font-mono">+1 (302) 499-8749</div>
            </div>
          </button>
        </div>

        {/* Scrollable Container for templates & input */}
        <div className="overflow-y-auto space-y-4 pr-1">
          {/* Quick Payout / Inquiry Example Templates Chips */}
          <div>
            <label className="block text-[11px] font-black text-yellow-300 uppercase mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                SELECT INQUIRY / CASHOUT PROOF EXAMPLE TEMPLATE:
              </span>
              <span className="text-[10px] text-zinc-400 font-normal">Click to pre-fill</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {TEMPLATE_EXAMPLES.map((tmpl) => {
                const Icon = tmpl.icon;
                const isSelected = message === tmpl.text;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl.text)}
                    className={`p-2 rounded-xl text-left border text-xs font-black transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                        : 'bg-[#0e0e11] border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span className="truncate">{tmpl.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Input Box */}
          <div>
            <label className="block text-xs font-black text-yellow-300 uppercase mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                PRE-FILLED {activeChannel.toUpperCase()} MESSAGE:
              </span>
              <span className="text-[11px] text-zinc-500 font-normal">Edit text anytime</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full bg-[#070709] border border-zinc-800 focus:border-yellow-400/80 rounded-xl p-3 text-xs sm:text-sm text-zinc-100 font-mono focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Destination Details / Settings */}
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-zinc-400 font-bold">
                {activeChannel === 'telegram' ? 'Telegram Handle:' : 'WhatsApp Support Line:'}
              </span>
              {activeChannel === 'telegram' ? (
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400 w-36"
                  placeholder="@handle"
                />
              ) : (
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-400 w-44"
                  placeholder="+1 (302) 499-8749"
                />
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Official 24/7 Desk Online</span>
            </div>
          </div>

          {/* Primary Action Button Bar: Both Channels Direct Access */}
          <div className="space-y-2">
            {activeChannel === 'telegram' ? (
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  id="open-tg-direct-btn"
                  onClick={handleOpenTelegram}
                  className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm rounded-xl border border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.6)] pulse-cta flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                  <Send className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span>OPEN TELEGRAM (@{targetHandle})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  id="switch-to-wa-quick-btn"
                  onClick={handleOpenWhatsapp}
                  className="w-full sm:w-auto py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs rounded-xl border border-emerald-400/50 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  title="Open WhatsApp instead"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>OR OPEN WHATSAPP</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  id="open-wa-direct-btn"
                  onClick={handleOpenWhatsapp}
                  className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm rounded-xl border border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.6)] pulse-cta flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span>OPEN WHATSAPP ({whatsappNumber})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  id="switch-to-tg-quick-btn"
                  onClick={handleOpenTelegram}
                  className="w-full sm:w-auto py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl border border-cyan-400/50 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  title="Open Telegram instead"
                >
                  <Send className="w-4 h-4 fill-white" />
                  <span>OR OPEN TELEGRAM</span>
                </button>
              </div>
            )}

            {/* Dedicated Join Telegram Group Button */}
            <a
              id="modal-direct-join-group-action-btn"
              href={TELEGRAM_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playCoin()}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 hover:from-blue-600 hover:to-cyan-500 text-white font-black text-xs sm:text-sm rounded-xl border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-98"
            >
              <Users className="w-4 h-4 text-yellow-300" />
              <span>JOIN OFFICIAL TELEGRAM GROUP</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-200" />
            </a>

            {/* Auxiliary Buttons: Copy & QR */}
            <div className="flex items-center gap-2">
              <button
                id="copy-msg-btn"
                onClick={handleCopy}
                className="flex-1 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl border border-zinc-800 flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'MESSAGE COPIED TO CLIPBOARD!' : 'COPY PRE-FILLED MESSAGE'}</span>
              </button>

              <button
                onClick={() => setShowQr(!showQr)}
                className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-yellow-400 font-bold text-xs rounded-xl border border-yellow-500/40 flex items-center justify-center gap-1 shadow-sm"
              >
                <QrCode className="w-4 h-4" />
                <span>{showQr ? 'HIDE QR' : 'SHOW QR'}</span>
              </button>
            </div>
          </div>

          {/* QR Code expansion */}
          {showQr && (
            <div className="bg-black/90 p-4 rounded-xl border border-yellow-500/40 flex flex-col items-center justify-center text-center">
              <div className="bg-white p-3 rounded-lg shadow-md mb-2">
                {/* SVG QR Code Simulation */}
                <svg width="120" height="120" viewBox="0 0 120 120" fill="black">
                  <rect width="120" height="120" fill="white" />
                  <rect x="10" y="10" width="30" height="30" fill="black" />
                  <rect x="15" y="15" width="20" height="20" fill="white" />
                  <rect x="20" y="20" width="10" height="10" fill="black" />

                  <rect x="80" y="10" width="30" height="30" fill="black" />
                  <rect x="85" y="15" width="20" height="20" fill="white" />
                  <rect x="90" y="20" width="10" height="10" fill="black" />

                  <rect x="10" y="80" width="30" height="30" fill="black" />
                  <rect x="15" y="85" width="20" height="20" fill="white" />
                  <rect x="20" y="90" width="10" height="10" fill="black" />

                  <rect x="45" y="15" width="25" height="10" fill="black" />
                  <rect x="15" y="45" width="20" height="15" fill="black" />
                  <rect x="45" y="45" width="30" height="30" fill={activeChannel === 'telegram' ? '#0284c7' : '#10b981'} />
                  <rect x="85" y="55" width="25" height="20" fill="black" />
                  <rect x="50" y="85" width="20" height="25" fill="black" />
                  <rect x="80" y="85" width="30" height="25" fill="black" />
                </svg>
              </div>
              <span className="text-[11px] text-zinc-300 font-bold">
                Scan with your phone camera or {activeChannel === 'telegram' ? 'Telegram' : 'WhatsApp'} scanner to connect immediately!
              </span>
            </div>
          )}
        </div>

        {/* Security & Instant Guarantee Footer */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-bold border-t border-zinc-800/80 pt-3 mt-3 shrink-0">
          <span className="flex items-center gap-1 text-green-400">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Anonymous & Secure
          </span>
          <span className="flex items-center gap-1 text-yellow-400">
            <Zap className="w-3.5 h-3.5" /> Average response time: 45 seconds
          </span>
        </div>
      </div>
    </div>
  );
};


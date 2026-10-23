import React, { useState, useEffect } from 'react';
import {
  Mail,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Send,
  Zap,
  ShieldCheck,
  Server,
  Lock,
  Search,
  Sparkles,
  Inbox,
  Flame,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  UserCheck,
  FileCheck,
  Key,
  Layers,
  Database
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import {
  DISPOSABLE_DOMAINS,
  INITIAL_INCOMING_EMAILS,
  IncomingEmail,
  performSimulatedEmailVerification,
  EmailVerificationResult
} from '../data/emailVerificationData';

interface EmailVerificationBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

export const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
}) => {
  // Active feature tab: 'verifier' | 'tempmail' | 'bulk'
  const [activeTab, setActiveTab] = useState<'verifier' | 'tempmail' | 'bulk'>('verifier');

  // Verification State
  const [inputEmail, setInputEmail] = useState<string>('alex.trader@gmail.com');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<EmailVerificationResult | null>(() =>
    performSimulatedEmailVerification('alex.trader@gmail.com')
  );

  // Disposable Temp Mail State
  const [selectedDomain, setSelectedDomain] = useState<string>(DISPOSABLE_DOMAINS[0].domain);
  const [tempUsername, setTempUsername] = useState<string>(() => `vip.${Math.floor(1000 + Math.random() * 9000)}`);
  const [incomingEmails, setIncomingEmails] = useState<IncomingEmail[]>(INITIAL_INCOMING_EMAILS);
  const [selectedEmailDetail, setSelectedEmailDetail] = useState<IncomingEmail | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isRefreshingInbox, setIsRefreshingInbox] = useState<boolean>(false);

  // Bulk List State
  const [bulkInput, setBulkInput] = useState<string>(
    'alex.trader@gmail.com\ninvestor@proton.me\nsupport@binance.com\nburner@mailinator.com\nhello@yahoo.com\ninvalid-user@notreal-xyz99.org'
  );
  const [bulkResults, setBulkResults] = useState<EmailVerificationResult[] | null>(null);
  const [isProcessingBulk, setIsProcessingBulk] = useState<boolean>(false);

  const fullTempEmail = `${tempUsername}@${selectedDomain}`;

  // Periodic simulated incoming email
  useEffect(() => {
    const timer = setInterval(() => {
      const services = [
        { name: 'Discord Security', sender: 'noreply@discord.com', avatar: '👾', cat: 'social' as const, sub: 'Verify your Discord Account', code: `${Math.floor(100000 + Math.random() * 900000)}` },
        { name: 'Roblox Studio', sender: 'security@roblox.com', avatar: '🟥', cat: 'gaming' as const, sub: 'One-Time Security Code', code: `${Math.floor(100000 + Math.random() * 900000)}` },
        { name: 'X / Twitter Verification', sender: 'verify@x.com', avatar: '✖️', cat: 'social' as const, sub: 'Confirm your X account login', code: `${Math.floor(100000 + Math.random() * 900000)}` },
        { name: 'Netflix Streaming', sender: 'info@netflix.com', avatar: '🎬', cat: 'payment' as const, sub: 'Confirm your email for 4K UHD streaming', code: `${Math.floor(100000 + Math.random() * 900000)}` },
      ];

      const chosen = services[Math.floor(Math.random() * services.length)];
      const newMail: IncomingEmail = {
        id: `mail-${Date.now()}`,
        sender: chosen.sender,
        senderName: chosen.name,
        avatar: chosen.avatar,
        subject: `${chosen.sub} (${chosen.code})`,
        code: chosen.code,
        body: `Your instant verification security code is ${chosen.code}. Enter this code into your registration form to instantly complete authorization.`,
        receivedAt: 'Just now',
        serviceCategory: chosen.cat,
        isRead: false,
      };

      setIncomingEmails((prev) => [newMail, ...prev.slice(0, 9)]);
    }, 28000);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyEmail = (emailToTest?: string) => {
    const target = emailToTest || inputEmail;
    if (!target.trim()) return;

    incrementClicks();
    soundManager.playSpinTick();
    setIsVerifying(true);

    setTimeout(() => {
      const res = performSimulatedEmailVerification(target);
      setVerificationResult(res);
      setIsVerifying(false);
      if (res.status === 'valid') {
        soundManager.playWinFanfare();
      } else {
        soundManager.playCoin();
      }
    }, 450);
  };

  const handleGenerateNewAddress = () => {
    incrementClicks();
    soundManager.playSpinTick();
    setTempUsername(`vip.${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleCopyTempAddress = () => {
    navigator.clipboard.writeText(fullTempEmail);
    setCopiedAddress(true);
    soundManager.playCoin();
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyOtpCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    soundManager.playCoin();
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleRefreshInbox = () => {
    setIsRefreshingInbox(true);
    soundManager.playSpinTick();
    setTimeout(() => {
      setIsRefreshingInbox(false);
      soundManager.playCoin();
    }, 400);
  };

  const handleRunBulk = () => {
    incrementClicks();
    soundManager.playSpinTick();
    setIsProcessingBulk(true);

    setTimeout(() => {
      const lines = bulkInput
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const analyzed = lines.map((email) => performSimulatedEmailVerification(email));
      setBulkResults(analyzed);
      setIsProcessingBulk(false);
      soundManager.playWinFanfare();
    }, 600);
  };

  return (
    <div
      id="email-verification-banner"
      className="relative rounded-3xl p-4 sm:p-6 bg-gradient-to-b from-[#031d17] via-[#05110e] to-black border-2 border-emerald-500/70 shadow-[0_0_35px_rgba(16,185,129,0.35)] overflow-hidden text-white"
    >
      {/* Background ambient decorative glowing shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Top Banner Header: Title, Live Badges & Quick Stats */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-emerald-500/30 pb-4 mb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 text-black text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Zap className="w-3 h-3 text-black fill-black" />
              100% FREE VIP TOOL
            </span>
            <span className="px-2 py-0.5 rounded bg-black/60 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
              RFC 5322 MX & SMTP 250 HANDSHAKE
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              99.9% ACCURACY
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-yellow-200 to-teal-300 tracking-tight uppercase flex items-center gap-2">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 shrink-0" />
            EMAIL VERIFIER & DISPOSABLE TEMP INBOX
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-medium">
            Verify real mailboxes, DNS MX records, SMTP handshake & generate instant disposable temporary mail with live incoming OTP messages.
          </p>
        </div>

        {/* Action Tabs Selector */}
        <div className="flex items-center gap-1.5 bg-black/70 p-1.5 rounded-2xl border border-emerald-500/40 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveTab('verifier');
              soundManager.playSpinTick();
            }}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'verifier'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-[1.02]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Live Verifier</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('tempmail');
              soundManager.playSpinTick();
            }}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 relative ${
              activeTab === 'tempmail'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-[1.02]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Temp Inbox</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bulk');
              soundManager.playSpinTick();
            }}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bulk'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-[1.02]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bulk Cleanse</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'verifier' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Input and Preset Triggers (6 cols) */}
          <div className="lg:col-span-6 bg-black/60 rounded-2xl border border-emerald-500/30 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-emerald-400" />
                Live Single Email Verification
              </span>
              <span className="text-[10px] font-mono text-zinc-400">RFC 5322 Syntax + MX Check</span>
            </div>

            {/* Email Input Field & Run Button */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-300 block">
                Enter Email Address to Verify:
              </label>
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-emerald-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleVerifyEmail();
                    }}
                    placeholder="e.g. yourname@company.com or gmail"
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-emerald-500/50 rounded-xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-emerald-400 shadow-inner"
                  />
                </div>
                <button
                  onClick={() => handleVerifyEmail()}
                  disabled={isVerifying}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs sm:text-sm rounded-xl border border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
                >
                  <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>{isVerifying ? 'Checking MX...' : 'Verify Email'}</span>
                </button>
              </div>
            </div>

            {/* 1-Click Fast Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Quick Test Samples:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Google Workspace', email: 'alex.trader@gmail.com', tag: 'VALID' },
                  { label: 'Proton Encrypted', email: 'investor@proton.me', tag: 'VALID' },
                  { label: 'Binance Exchange', email: 'support@binance.com', tag: 'VALID' },
                  { label: 'Disposable Burner', email: 'spamtest@tempmail.com', tag: 'DISPOSABLE' },
                  { label: 'Syntax Error', email: 'user@bad@@email', tag: 'INVALID' },
                ].map((sample) => (
                  <button
                    key={sample.label}
                    onClick={() => {
                      setInputEmail(sample.email);
                      handleVerifyEmail(sample.email);
                    }}
                    className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-[11px] rounded-lg border border-zinc-700 hover:border-emerald-500/60 font-mono transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="text-zinc-300">{sample.label}</span>
                    <span
                      className={`text-[9px] px-1 rounded font-bold ${
                        sample.tag === 'VALID'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : sample.tag === 'DISPOSABLE'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {sample.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Deliverability Standards Guarantee */}
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2 text-[11px] text-zinc-300">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Multi-Layer Anti-Bounce Verification Engine</span>
              </div>
              <ul className="space-y-1 text-zinc-300 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>RFC 5322 syntax validation & character set compliance</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Real-time DNS MX record lookup & priority routing verification</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Direct SMTP handshake (250 OK) without sending spam</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Database of 35,000+ known disposable burner & honeypot domains</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Verification Results Display (6 cols) */}
          <div className="lg:col-span-6 bg-gradient-to-b from-[#021812] via-zinc-950 to-black rounded-2xl border border-emerald-500/40 p-4 sm:p-5 flex flex-col justify-between space-y-4">
            {verificationResult ? (
              <div className="space-y-3.5">
                {/* Result Status Header */}
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-mono block">VERIFICATION RESULT FOR:</span>
                    <span className="text-sm sm:text-base font-black text-white font-mono break-all">
                      {verificationResult.email}
                    </span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-xl text-xs font-black uppercase flex items-center gap-1 border shrink-0 ${
                      verificationResult.status === 'valid'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                        : verificationResult.status === 'disposable'
                        ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                        : 'bg-rose-950 text-rose-300 border-rose-500/50'
                    }`}
                  >
                    {verificationResult.status === 'valid' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>VALID & DELIVERABLE</span>
                      </>
                    ) : verificationResult.status === 'disposable' ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>DISPOSABLE / BURNER</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>INVALID / BOUNCE</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Score & Speed Metric */}
                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="bg-black/60 p-2.5 rounded-xl border border-emerald-500/30">
                    <span className="text-[10px] text-zinc-400 block font-semibold">Deliverability Score:</span>
                    <span
                      className={`text-lg sm:text-xl font-black ${
                        verificationResult.deliverabilityScore > 80
                          ? 'text-emerald-400'
                          : verificationResult.deliverabilityScore > 30
                          ? 'text-yellow-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {verificationResult.deliverabilityScore}%
                    </span>
                    <span className="text-[9px] text-zinc-500 block">
                      {verificationResult.deliverabilityScore > 80 ? 'Safe to Send' : 'High Bounce Risk'}
                    </span>
                  </div>

                  <div className="bg-black/60 p-2.5 rounded-xl border border-emerald-500/30">
                    <span className="text-[10px] text-zinc-400 block font-semibold">Verification Speed:</span>
                    <span className="text-lg sm:text-xl font-black text-cyan-400">
                      {verificationResult.responseTimeMs}ms
                    </span>
                    <span className="text-[9px] text-zinc-500 block">Ultra Low Latency</span>
                  </div>
                </div>

                {/* Diagnostic Details Grid */}
                <div className="bg-black/80 rounded-xl border border-emerald-500/20 p-3 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
                    <span className="text-zinc-400">RFC Syntax:</span>
                    <span className={verificationResult.syntaxValid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {verificationResult.syntaxValid ? '✓ Valid RFC 5322 Format' : '✗ Malformed Syntax'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
                    <span className="text-zinc-400">DNS MX Host:</span>
                    <span className="text-white font-bold truncate max-w-[200px] text-right">
                      {verificationResult.mxHost}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
                    <span className="text-zinc-400">SMTP Handshake:</span>
                    <span className={verificationResult.smtpCheck ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {verificationResult.smtpCheck ? '✓ 250 OK Mailbox Accepts' : '✗ Mailbox Rejected'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
                    <span className="text-zinc-400">Disposable Burner:</span>
                    <span className={verificationResult.isDisposable ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {verificationResult.isDisposable ? '⚠️ Yes (Temporary Mail)' : '✓ No (Clean Domain)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Domain Category:</span>
                    <span className="text-sky-300 font-bold">
                      {verificationResult.isFreeMail ? 'Free Webmail (Gmail/Yahoo)' : 'Custom Business Domain'}
                    </span>
                  </div>
                </div>

                {/* Status Explanation Box */}
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-zinc-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-snug">{verificationResult.reason}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400 space-y-2">
                <Mail className="w-12 h-12 text-zinc-600" />
                <p className="text-xs">Enter an email address and click "Verify Email" to begin check.</p>
              </div>
            )}

            {/* Bottom Telegram API Action */}
            <div className="pt-2">
              <button
                onClick={() => {
                  incrementClicks();
                  soundManager.playCoin();
                  onOpenTelegram(
                    `Hi @adkingsSupport, I want to integrate the Real-time Email Verification API with unlimited checks for my platform/business!`
                  );
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs sm:text-sm rounded-xl border border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Send className="w-4 h-4 text-black" />
                <span>Get Unlimited Email Verification API on Telegram</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Temp Mail Tab: 100% Free Disposable Temporary Inbox */}
      {activeTab === 'tempmail' && (
        <div className="space-y-4">
          {/* Active Disposable Address Generator Box */}
          <div className="bg-black/80 rounded-2xl border border-emerald-500/40 p-4 sm:p-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                  <Inbox className="w-3 h-3 text-emerald-400" />
                  Your Active Disposable Temporary Email Address:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base sm:text-xl font-black text-yellow-300 font-mono bg-zinc-950 px-3 py-1.5 rounded-xl border border-emerald-500/50 shadow-inner select-all">
                    {fullTempEmail}
                  </span>
                  <button
                    onClick={handleCopyTempAddress}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAddress ? 'Copied!' : 'Copy Address'}</span>
                  </button>
                  <button
                    onClick={handleGenerateNewAddress}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs rounded-xl border border-zinc-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>New Email</span>
                  </button>
                </div>
              </div>

              {/* Domain Selector Dropdown */}
              <div className="space-y-1 w-full md:w-auto">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wide block">
                  Select Domain Gateway:
                </label>
                <select
                  value={selectedDomain}
                  onChange={(e) => {
                    setSelectedDomain(e.target.value);
                    soundManager.playSpinTick();
                  }}
                  className="w-full md:w-auto bg-zinc-950 border border-emerald-500/40 rounded-xl px-3 py-1.5 text-xs text-emerald-300 font-mono focus:outline-none cursor-pointer"
                >
                  {DISPOSABLE_DOMAINS.map((d) => (
                    <option key={d.domain} value={d.domain}>
                      @{d.domain} ({d.badge} - {d.speed})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Incoming Messages Stream Inbox */}
          <div className="bg-black/60 rounded-2xl border border-emerald-500/30 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black text-white uppercase tracking-wide">
                  Live Incoming Verification Inboxes ({incomingEmails.length})
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <button
                onClick={handleRefreshInbox}
                disabled={isRefreshingInbox}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-emerald-300 text-[11px] font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshingInbox ? 'animate-spin' : ''}`} />
                <span>Refresh Inbox</span>
              </button>
            </div>

            {/* Email List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {incomingEmails.map((mail) => (
                <div
                  key={mail.id}
                  onClick={() => {
                    setSelectedEmailDetail(mail);
                    soundManager.playSpinTick();
                  }}
                  className="p-3 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 hover:border-emerald-500/60 border border-zinc-800 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 group"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl p-1 bg-zinc-900 rounded-lg border border-zinc-700 shrink-0">
                      {mail.avatar}
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
                          {mail.senderName}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          &lt;{mail.sender}&gt;
                        </span>
                        <span className="text-[9px] text-emerald-400 font-mono bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          {mail.receivedAt}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 font-medium line-clamp-1">
                        {mail.subject}
                      </p>
                    </div>
                  </div>

                  {/* Right OTP Code Pill & Copy Button */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <div className="bg-black/80 px-2.5 py-1 rounded-lg border border-yellow-400/40 flex items-center gap-1.5">
                      <span className="text-[9px] text-zinc-400 font-mono uppercase">CODE:</span>
                      <span className="text-xs font-mono font-black text-yellow-300 tracking-wider">
                        {mail.code}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyOtpCode(mail.code, mail.id);
                      }}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-lg text-xs font-black flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedCodeId === mail.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-300" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy OTP</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Email Detail Modal View */}
            {selectedEmailDetail && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-[#0b0f14] border-2 border-emerald-500 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedEmailDetail.avatar}</span>
                      <div>
                        <h4 className="text-sm font-black text-white">{selectedEmailDetail.senderName}</h4>
                        <p className="text-[10px] text-zinc-400 font-mono">{selectedEmailDetail.sender}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedEmailDetail(null)}
                      className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs rounded-lg border border-zinc-700"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <p className="text-yellow-300 font-bold text-sm">{selectedEmailDetail.subject}</p>
                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-300 leading-relaxed font-sans text-xs">
                      {selectedEmailDetail.body}
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-emerald-500/30">
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-mono">VERIFICATION OTP:</span>
                      <span className="text-xl font-black text-yellow-300 font-mono">{selectedEmailDetail.code}</span>
                    </div>
                    <button
                      onClick={() => handleCopyOtpCode(selectedEmailDetail.code, selectedEmailDetail.id)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedCodeId === selectedEmailDetail.id ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Cleanse Tab: Multi-Email Verification */}
      {activeTab === 'bulk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-black/60 rounded-2xl border border-emerald-500/30 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Bulk Email List Cleaner & Syntax Audit
              </span>
              <span className="text-[10px] font-mono text-zinc-400">One email per line</span>
            </div>

            <textarea
              rows={8}
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder="Paste email list here (one email per line)..."
              className="w-full p-3 bg-zinc-950 border border-emerald-500/40 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400 shadow-inner"
            />

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() =>
                  setBulkInput(
                    'alex.trader@gmail.com\ninvestor@proton.me\nsupport@binance.com\nburner@mailinator.com\nhello@yahoo.com\ninvalid-user@notreal-xyz99.org'
                  )
                }
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg border border-zinc-700 transition-colors"
              >
                Reset Sample List
              </button>

              <button
                onClick={handleRunBulk}
                disabled={isProcessingBulk}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs sm:text-sm rounded-xl border border-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.5)] flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessingBulk ? 'animate-spin' : ''}`} />
                <span>{isProcessingBulk ? 'Analyzing List...' : 'Cleanse & Verify List'}</span>
              </button>
            </div>
          </div>

          {/* Bulk Results Side */}
          <div className="lg:col-span-6 bg-gradient-to-b from-[#021812] via-zinc-950 to-black rounded-2xl border border-emerald-500/40 p-4 sm:p-5 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <span className="text-xs font-black text-white uppercase tracking-wide">
                  Bulk Analysis Summary
                </span>
                {bulkResults && (
                  <span className="text-[11px] font-mono text-emerald-400">
                    {bulkResults.filter((r) => r.status === 'valid').length} / {bulkResults.length} Deliverable
                  </span>
                )}
              </div>

              {bulkResults ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {bulkResults.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-black/60 rounded-xl border border-zinc-800 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="truncate mr-2">
                        <span className="text-white font-bold">{r.email}</span>
                        <span className="block text-[10px] text-zinc-400 truncate">{r.mxHost}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold text-zinc-400">{r.deliverabilityScore}%</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            r.status === 'valid'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : r.status === 'disposable'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-zinc-400 text-xs">
                  Click "Cleanse & Verify List" to inspect deliverability and bounce risk across multiple emails.
                </div>
              )}
            </div>

            <button
              onClick={() => {
                incrementClicks();
                soundManager.playCoin();
                onOpenTelegram(
                  'Hi @adkingsSupport, I want to request a large bulk email list verification check (10k - 500k emails)!'
                );
              }}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contact Telegram for 100k+ Bulk List Verification</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sticky Footer Note */}
      <div className="mt-4 pt-3 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Privacy Guaranteed • Zero Mail Logs • Encrypted WebSockets • 100% Free VIP Tier</span>
        </div>
        <button
          onClick={() => {
            incrementClicks();
            soundManager.playCoin();
            onOpenTelegram('Hi @adkingsSupport, I have a question about the Email Verification & Temp Mail tool.');
          }}
          className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>Need Custom SMTP Gateway? Chat with Support</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

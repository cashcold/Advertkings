import React, { useState, useEffect } from 'react';
import {
  X,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  Building2,
  DollarSign,
} from 'lucide-react';
import { AuthUser, ReloadRequestItem } from '../types';
import { soundManager } from '../utils/audio';

interface UserReloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onReloadRequested?: () => void;
  soundEnabled?: boolean;
}

const DEPOSIT_QUICK_AMOUNTS = [50, 100, 250, 500, 1000, 2500];

const DEPOSIT_METHODS = [
  { id: 'usdt_trc20', name: 'USDT (TRC-20)', badge: 'Recommended • Instant', address: 'TWr72xWnNpR58rK24qZbvXqE9o8D2BqLpM' },
  { id: 'btc', name: 'Bitcoin (BTC)', badge: 'Crypto Standard', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { id: 'paypal', name: 'PayPal Direct', badge: 'Fast Transfer', address: 'payments@adkings.vip' },
  { id: 'card', name: 'Credit / Debit Card', badge: 'Virtual Gateway', address: 'Card Gateway Tier-1' },
  { id: 'bank', name: 'Bank Wire / P2P', badge: 'High Volume VIP', address: 'AdKings Treasury Desk' },
];

const WITHDRAW_METHODS = [
  { id: 'usdt_trc20', name: 'USDT (TRC-20)', placeholder: 'Enter your TRC-20 Wallet Address (starts with T...)' },
  { id: 'btc', name: 'Bitcoin (BTC)', placeholder: 'Enter your Bitcoin (BTC) Receiving Address' },
  { id: 'paypal', name: 'PayPal Payout', placeholder: 'Enter your verified PayPal email address' },
  { id: 'bank', name: 'Bank Wire / SEPA', placeholder: 'Enter IBAN, Swift/BIC, and Account Holder Name' },
];

export const UserReloadModal: React.FC<UserReloadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onReloadRequested,
  soundEnabled = true,
}) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'my_requests'>('deposit');

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [depositCustomAmount, setDepositCustomAmount] = useState<string>('100');
  const [depositPaymentMethod, setDepositPaymentMethod] = useState<string>('USDT (TRC-20)');
  const [depositReferenceId, setDepositReferenceId] = useState<string>('');
  const [depositUserNote, setDepositUserNote] = useState<string>('');

  // Withdraw Form State
  const [withdrawAmount, setWithdrawAmount] = useState<string>('300');
  const [withdrawMethod, setWithdrawMethod] = useState<string>('USDT (TRC-20)');
  const [withdrawDestination, setWithdrawDestination] = useState<string>('');
  const [withdrawUserNote, setWithdrawUserNote] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userRequests, setUserRequests] = useState<ReloadRequestItem[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && currentUser?.email) {
      loadUserRequests();
      setSuccessMsg(null);
      setErrorMsg(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  const userBalance = currentUser.balance || 0;
  const currentDepositMethodObj =
    DEPOSIT_METHODS.find((m) => m.name.includes(depositPaymentMethod.split(' ')[0])) || DEPOSIT_METHODS[0];
  const currentWithdrawMethodObj =
    WITHDRAW_METHODS.find((m) => m.name.includes(withdrawMethod.split(' ')[0])) || WITHDRAW_METHODS[0];

  const loadUserRequests = async () => {
    if (!currentUser?.email) return;
    setIsLoadingRequests(true);
    try {
      const res = await fetch(`/api/user/reload-requests?email=${encodeURIComponent(currentUser.email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.requests)) {
          setUserRequests(data.requests);
        }
      }
    } catch (err) {
      console.warn('Failed to load user reload requests:', err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    if (soundEnabled) soundManager.playCoin();
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // Submit Deposit
  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const finalAmount = parseFloat(depositCustomAmount) || depositAmount;
    if (!finalAmount || finalAmount < 1) {
      setErrorMsg('Please select or enter a valid deposit amount (min $1.00 USD).');
      return;
    }

    setIsSubmitting(true);
    if (soundEnabled) soundManager.playSpinTick();

    try {
      const res = await fetch('/api/user/request-reload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          amount: finalAmount,
          type: 'deposit',
          paymentMethod: depositPaymentMethod,
          referenceId: depositReferenceId.trim() || undefined,
          userNote: depositUserNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit deposit request.');
      }

      if (soundEnabled) soundManager.playWinFanfare();
      setSuccessMsg(
        `✅ Deposit request for $${finalAmount.toFixed(2)} USD submitted! Status is PENDING. An administrator will verify and approve before funds are credited.`
      );
      setDepositReferenceId('');
      setDepositUserNote('');
      loadUserRequests();
      if (onReloadRequested) onReloadRequested();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting deposit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Withdrawal
  const handleSubmitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const finalAmount = parseFloat(withdrawAmount);
    if (!finalAmount || finalAmount < 300) {
      setErrorMsg('Minimum withdrawal amount is $300.00 USD.');
      return;
    }

    if (finalAmount > userBalance) {
      setErrorMsg(`Withdrawal amount ($${finalAmount.toFixed(2)}) exceeds your available VIP balance ($${userBalance.toFixed(2)} USD).`);
      return;
    }

    if (!withdrawDestination.trim()) {
      setErrorMsg(`Please provide a valid destination address or account for ${withdrawMethod}.`);
      return;
    }

    setIsSubmitting(true);
    if (soundEnabled) soundManager.playSpinTick();

    try {
      const res = await fetch('/api/user/request-reload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          amount: finalAmount,
          type: 'withdraw',
          paymentMethod: withdrawMethod,
          destinationAddress: withdrawDestination.trim(),
          userNote: withdrawUserNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit withdrawal request.');
      }

      if (soundEnabled) soundManager.playWinFanfare();
      setSuccessMsg(
        `✅ Withdrawal request for $${finalAmount.toFixed(2)} USD submitted! Status is PENDING. An administrator will verify and dispatch payout.`
      );
      setWithdrawDestination('');
      setWithdrawUserNote('');
      loadUserRequests();
      if (onReloadRequested) onReloadRequested();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting withdrawal request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingCount = userRequests.filter((r) => r.status === 'pending').length;

  return (
    <div
      id="user-reload-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div
        id="user-reload-modal-container"
        className="bg-zinc-950 border border-yellow-500/40 w-full max-w-xl rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.25)] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-800/80 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 p-0.5 shadow-[0_0_15px_rgba(234,179,8,0.4)] flex items-center justify-center">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                <Wallet className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-wide text-white uppercase flex items-center gap-1.5">
                  VIP Cashier: Deposit / Withdraw
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                  Database Vault
                </span>
              </div>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                Current Stored Balance:
                <span className="font-mono font-black text-emerald-400">
                  ${userBalance.toFixed(2)} USD
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-300 font-semibold">{currentUser.fullName}</span>
              </p>
            </div>
          </div>

          <button
            id="user-reload-close-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/50 px-4 pt-2 gap-2 shrink-0">
          <button
            id="tab-deposit-btn"
            type="button"
            onClick={() => {
              setActiveTab('deposit');
              setErrorMsg(null);
              setSuccessMsg(null);
              if (soundEnabled) soundManager.playSpinTick();
            }}
            className={`pb-2.5 px-3 text-xs font-black uppercase tracking-wider border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'deposit'
                ? 'border-yellow-400 text-yellow-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
            <span>Deposit</span>
          </button>

          <button
            id="tab-withdraw-btn"
            type="button"
            onClick={() => {
              setActiveTab('withdraw');
              setErrorMsg(null);
              setSuccessMsg(null);
              if (soundEnabled) soundManager.playSpinTick();
            }}
            className={`pb-2.5 px-3 text-xs font-black uppercase tracking-wider border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'withdraw'
                ? 'border-yellow-400 text-yellow-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4 text-amber-400" />
            <span>Withdraw</span>
          </button>

          <button
            id="tab-history-btn"
            type="button"
            onClick={() => {
              setActiveTab('my_requests');
              loadUserRequests();
              setErrorMsg(null);
              setSuccessMsg(null);
              if (soundEnabled) soundManager.playSpinTick();
            }}
            className={`pb-2.5 px-3 text-xs font-black uppercase tracking-wider border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'my_requests'
                ? 'border-yellow-400 text-yellow-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Cashier History</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-black font-black text-[10px] rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Status Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/60 flex items-start gap-2.5 text-xs text-red-200 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/60 flex items-start gap-2.5 text-xs text-emerald-200 animate-fadeIn shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">{successMsg}</span>
                <p className="text-[11px] text-emerald-300/80">
                  You can track admin review status under the "Cashier History" tab.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: DEPOSIT */}
          {/* ========================================================================= */}
          {activeTab === 'deposit' && (
            <form onSubmit={handleSubmitDeposit} className="space-y-4">
              {/* Approval Workflow Notice */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-start gap-2.5 text-xs text-amber-200/90">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-bold block mb-0.5">
                    Admin Approval Workflow
                  </strong>
                  <p className="text-[11px] text-zinc-300">
                    After you submit a reload, an administrator must{' '}
                    <strong className="text-white">Approve</strong> or{' '}
                    <strong className="text-white">Reject</strong> the transaction
                    before your balance is credited in the database.
                  </p>
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  1. Select Deposit Amount (USD)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2.5">
                  {DEPOSIT_QUICK_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setDepositAmount(amt);
                        setDepositCustomAmount(amt.toString());
                        if (soundEnabled) soundManager.playSpinTick();
                      }}
                      className={`py-2 px-1 text-xs font-black rounded-xl border transition cursor-pointer ${
                        parseFloat(depositCustomAmount) === amt
                          ? 'bg-yellow-400 text-black border-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.4)]'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 font-black text-sm">
                    $
                  </span>
                  <input
                    id="user-deposit-amount-input"
                    type="number"
                    min="1"
                    step="any"
                    value={depositCustomAmount}
                    onChange={(e) => {
                      setDepositCustomAmount(e.target.value);
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) setDepositAmount(val);
                    }}
                    placeholder="Enter custom deposit amount..."
                    className="w-full pl-8 pr-4 py-2.5 bg-zinc-900/90 border border-zinc-800 focus:border-yellow-400 rounded-xl text-white font-mono font-bold text-sm outline-none transition"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">
                    USD
                  </span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  2. Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEPOSIT_METHODS.map((method) => {
                    const isSelected = depositPaymentMethod.includes(method.name.split(' ')[0]);
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => {
                          setDepositPaymentMethod(method.name);
                          if (soundEnabled) soundManager.playSpinTick();
                        }}
                        className={`p-2.5 text-left rounded-xl border transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-yellow-500/15 border-yellow-400 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.2)]'
                            : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-black">{method.name}</p>
                          <span className="text-[10px] text-zinc-400">{method.badge}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-yellow-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Instructions / Wallet Address */}
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-bold">
                    Official Deposit Destination ({currentDepositMethodObj.name}):
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyAddress(currentDepositMethodObj.address)}
                    className="text-yellow-400 hover:text-yellow-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedAddress ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    {copiedAddress ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="font-mono text-xs text-yellow-300 break-all p-2 rounded-lg bg-black/60 border border-zinc-800 select-all">
                  {currentDepositMethodObj.address}
                </div>
                <p className="text-[10px] text-zinc-400">
                  Send <strong className="text-white">${parseFloat(depositCustomAmount) || depositAmount} USD</strong> equivalent to this destination, then provide your Transaction Hash / Reference ID below.
                </p>
              </div>

              {/* Transaction Hash / Proof ID */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  3. Deposit Transaction Hash / Reference ID (Proof)
                </label>
                <input
                  id="user-deposit-ref-input"
                  type="text"
                  value={depositReferenceId}
                  onChange={(e) => setDepositReferenceId(e.target.value)}
                  placeholder="e.g. TXID hash, bank receipt #, or PayPal transaction ID"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-yellow-400 rounded-xl text-white text-xs outline-none transition font-mono"
                />
              </div>

              {/* Note (optional) */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  4. Note (Optional)
                </label>
                <input
                  id="user-deposit-note-input"
                  type="text"
                  value={depositUserNote}
                  onChange={(e) => setDepositUserNote(e.target.value)}
                  placeholder="e.g. VIP deposit reload for weekend gaming"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-yellow-400 rounded-xl text-white text-xs outline-none transition"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="user-deposit-submit-btn"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 hover:from-yellow-400 hover:to-amber-300 disabled:opacity-50 text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.4)] transition cursor-pointer border border-yellow-200"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowDownCircle className="w-4 h-4" />
                )}
                <span>
                  Submit Deposit Request (${parseFloat(depositCustomAmount) || depositAmount} USD)
                </span>
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: WITHDRAW */}
          {/* ========================================================================= */}
          {activeTab === 'withdraw' && (
            <form onSubmit={handleSubmitWithdrawal} className="space-y-4">
              {/* Balance Box */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-yellow-950/20 via-zinc-900 to-zinc-900 border border-yellow-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Available For Withdrawal
                  </span>
                  <span className="font-mono font-black text-2xl text-emerald-400">
                    ${userBalance.toFixed(2)}{' '}
                    <span className="text-xs font-normal text-zinc-400">USD</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setWithdrawAmount(userBalance.toFixed(2));
                    if (soundEnabled) soundManager.playCoin();
                  }}
                  className="px-3 py-1.5 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 border border-yellow-500/40 rounded-lg text-xs font-black uppercase transition cursor-pointer"
                >
                  Withdraw All (MAX)
                </button>
              </div>

              {/* Admin Approval Notice */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-start gap-2.5 text-xs text-amber-200/90">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-bold block mb-0.5">
                    Admin Approval & Payout Verification
                  </strong>
                  <p className="text-[11px] text-zinc-300">
                    Upon submitting this withdrawal request, an administrator will verify your gaming session and approve the payout before funds are deducted and transferred.
                  </p>
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  1. Withdrawal Amount (Min $300.00 USD)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2.5">
                  {[300, 500, 1000, 2500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      disabled={userBalance < amt}
                      onClick={() => {
                        setWithdrawAmount(amt.toString());
                        if (soundEnabled) soundManager.playSpinTick();
                      }}
                      className={`py-2 px-1 text-xs font-black rounded-xl border transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        parseFloat(withdrawAmount) === amt
                          ? 'bg-yellow-400 text-black border-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.4)]'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 font-black text-sm">
                    $
                  </span>
                  <input
                    id="user-withdraw-amount-input"
                    type="number"
                    min="300"
                    max={userBalance}
                    step="any"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter withdrawal amount (min $300)..."
                    className="w-full pl-8 pr-16 py-2.5 bg-zinc-900/90 border border-zinc-800 focus:border-yellow-400 rounded-xl text-white font-mono font-bold text-sm outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(userBalance.toFixed(2))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-yellow-400 hover:text-yellow-300 cursor-pointer"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Payout Method */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  2. Payout Destination Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WITHDRAW_METHODS.map((method) => {
                    const isSelected = withdrawMethod.includes(method.name.split(' ')[0]);
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => {
                          setWithdrawMethod(method.name);
                          if (soundEnabled) soundManager.playSpinTick();
                        }}
                        className={`p-2.5 text-left rounded-xl border transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-yellow-500/15 border-yellow-400 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.2)]'
                            : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <p className="text-xs font-black">{method.name}</p>
                        {isSelected && <Check className="w-4 h-4 text-yellow-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Receiving Address / Account */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  3. Your Receiving Address or Account ({withdrawMethod})
                </label>
                <input
                  id="user-withdraw-destination-input"
                  type="text"
                  value={withdrawDestination}
                  onChange={(e) => setWithdrawDestination(e.target.value)}
                  placeholder={currentWithdrawMethodObj.placeholder}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-yellow-400 rounded-xl text-white text-xs outline-none transition font-mono"
                  required
                />
              </div>

              {/* Note (optional) */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  4. Note to Admin (Optional)
                </label>
                <input
                  id="user-withdraw-note-input"
                  type="text"
                  value={withdrawUserNote}
                  onChange={(e) => setWithdrawUserNote(e.target.value)}
                  placeholder="e.g. Aviator jackpot cashout payout"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-yellow-400 rounded-xl text-white text-xs outline-none transition"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="user-withdraw-submit-btn"
                disabled={isSubmitting || userBalance < 300 || parseFloat(withdrawAmount) < 300 || parseFloat(withdrawAmount) > userBalance}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 disabled:opacity-50 text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition cursor-pointer border border-yellow-200"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUpCircle className="w-4 h-4" />
                )}
                <span>
                  Submit Withdrawal Request (${parseFloat(withdrawAmount) || 0} USD)
                </span>
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CASHIER HISTORY */}
          {/* ========================================================================= */}
          {activeTab === 'my_requests' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-bold">
                  Your Deposit & Withdrawal Requests:
                </span>
                <button
                  type="button"
                  onClick={loadUserRequests}
                  className="text-xs text-yellow-400 hover:text-yellow-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRequests ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {userRequests.length === 0 ? (
                <div className="p-8 text-center bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
                  <Wallet className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs text-zinc-400 font-bold">No requests found.</p>
                  <p className="text-[11px] text-zinc-500">
                    Use the "Deposit" or "Withdraw" tabs to submit a new balance request.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {userRequests.map((req, idx) => {
                    const isWithdraw = req.type === 'withdraw';
                    return (
                      <div
                        key={req._id || req.id || idx}
                        className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-black text-base ${
                                isWithdraw ? 'text-amber-400' : 'text-emerald-400'
                              }`}
                            >
                              {isWithdraw ? '-' : '+'}${req.amount.toFixed(2)} {req.currency || 'USD'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                isWithdraw
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              }`}
                            >
                              {isWithdraw ? 'WITHDRAWAL' : 'DEPOSIT'}
                            </span>
                            {req.status === 'pending' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
                                <Clock className="w-3 h-3" /> Pending Admin Review
                              </span>
                            )}
                            {req.status === 'approved' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> {isWithdraw ? 'Approved & Paid' : 'Approved & Credited'}
                              </span>
                            )}
                            {req.status === 'rejected' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> Rejected
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-zinc-400 space-y-0.5">
                            <p>
                              Method: <strong className="text-zinc-200">{req.paymentMethod}</strong> •{' '}
                              {isWithdraw ? 'Payout Destination' : 'Ref / Hash'}:{' '}
                              <span className="font-mono text-zinc-300">
                                {req.destinationAddress || req.referenceId || 'N/A'}
                              </span>
                            </p>
                            {req.userNote && (
                              <p className="text-zinc-400 italic">User Note: "{req.userNote}"</p>
                            )}
                            {req.adminNote && (
                              <p className="text-yellow-300/90 italic">
                                Admin Note: {req.adminNote}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right text-[10px] text-zinc-500 shrink-0">
                          {new Date(req.createdAt).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

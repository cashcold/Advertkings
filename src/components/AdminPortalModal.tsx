import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Users,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Crown,
  History,
  Check,
  XCircle,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { AuthUser, ReloadRequestItem } from '../types';
import { soundManager } from '../utils/audio';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onBalanceUpdated: (updatedUser: AuthUser) => void;
}

interface AdminUserItem {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  balance: number;
  currency: string;
  role: string;
  verified: boolean;
  avatar?: string;
}

interface BalanceTransactionItem {
  _id?: string;
  id?: string;
  userEmail: string;
  userName: string;
  type: string;
  gameOrSource: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  note?: string;
  createdAt: string | Date;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onBalanceUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'reload' | 'history' | 'users'>('requests');
  const [usersList, setUsersList] = useState<AdminUserItem[]>([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>(
    currentUser?.email || 'kate20@gmail.com'
  );
  const [amount, setAmount] = useState<number>(500);
  const [operationMode, setOperationMode] = useState<'add' | 'set' | 'deduct'>('add');
  const [reason, setReason] = useState<string>('VIP Account Balance Reload');
  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<BalanceTransactionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Reload Requests Approval Workflow State
  const [reloadRequests, setReloadRequests] = useState<ReloadRequestItem[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [processingReqId, setProcessingReqId] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; reqId: string; userEmail: string; amount: number; reason: string }>({
    open: false,
    reqId: '',
    userEmail: '',
    amount: 0,
    reason: 'Payment or TXID hash could not be verified on ledger',
  });

  // Sync selected user when currentUser changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (currentUser?.email) {
        setSelectedUserEmail(currentUser.email);
      }
      loadReloadRequests();
      loadUsers();
      loadTransactions();
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen || currentUser?.role !== 'admin') return null;

  const loadReloadRequests = async () => {
    try {
      const res = await fetch('/api/admin/reload-requests');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.requests)) {
          setReloadRequests(data.requests);
          const count = typeof data.pendingCount === 'number'
            ? data.pendingCount
            : data.requests.filter((r: ReloadRequestItem) => r.status === 'pending').length;
          setPendingRequestsCount(count);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch reload requests:', e);
    }
  };

  const loadUsers = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          setUsersList(data.users);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch admin users:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const res = await fetch('/api/admin/transactions?limit=40');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        }
      }
    } catch (e) {
      console.warn('Failed to load transactions:', e);
    }
  };

  // Find currently targeted user (defaults to currentUser or selected)
  const targetUser: AdminUserItem = usersList.find(
    (u) => u.email.toLowerCase() === selectedUserEmail.toLowerCase()
  ) || {
    id: currentUser?.id || 'usr-kate',
    fullName: currentUser?.fullName || 'Kate',
    email: currentUser?.email || 'kate20@gmail.com',
    phoneNumber: currentUser?.phoneNumber || '+1 3254784445',
    balance: currentUser?.balance !== undefined ? currentUser.balance : 50.0,
    currency: currentUser?.currency || 'USD',
    role: currentUser?.role || 'vip',
    verified: true,
    avatar: currentUser?.avatar || '👑',
  };

  // 1. Admin Approve Reload Request (Takes Action & Credits User Database Balance)
  const handleApproveRequest = async (request: ReloadRequestItem) => {
    const reqId = request._id || request.id;
    if (!reqId) return;

    setProcessingReqId(reqId);
    setErrorMsg(null);
    setSuccessMsg(null);
    soundManager.playSpinTick();

    try {
      const res = await fetch(`/api/admin/reload-requests/${reqId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminName: 'Master Admin (Finance Desk)',
          adminNote: 'Deposit verified and authorized. Balance credited.',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to approve reload request.');
      }

      soundManager.playCoin();
      setSuccessMsg(
        `✅ Approved reload of $${request.amount.toFixed(2)} USD for ${request.userName} (${request.userEmail})! Balance credited to $${data.newBalance.toFixed(2)} USD in database.`
      );

      // If the targeted user is the active user session, update state immediately
      if (currentUser && request.userEmail.toLowerCase() === currentUser.email.toLowerCase()) {
        onBalanceUpdated({
          ...currentUser,
          balance: data.newBalance,
        });
      }

      loadReloadRequests();
      loadUsers();
      loadTransactions();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while approving reload request.');
    } finally {
      setProcessingReqId(null);
    }
  };

  // 2. Admin Reject Reload Request (Takes Action: Marks Rejected, No Balance Changed)
  const handleConfirmReject = async () => {
    if (!rejectModal.reqId) return;

    setProcessingReqId(rejectModal.reqId);
    setErrorMsg(null);
    setSuccessMsg(null);
    soundManager.playSpinTick();

    try {
      const res = await fetch(`/api/admin/reload-requests/${rejectModal.reqId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminName: 'Master Admin (Finance Desk)',
          reason: rejectModal.reason || 'Deposit reference unverified',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to reject reload request.');
      }

      setSuccessMsg(`❌ Reload request rejected for ${rejectModal.userEmail}. No funds were credited to balance.`);
      setRejectModal({ open: false, reqId: '', userEmail: '', amount: 0, reason: '' });
      loadReloadRequests();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while rejecting reload request.');
    } finally {
      setProcessingReqId(null);
    }
  };

  // Direct manual balance reload
  const handleExecuteReload = async () => {
    if (!amount || amount <= 0) {
      setErrorMsg('Please enter a valid amount greater than 0.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    soundManager.playSpinTick();

    try {
      const res = await fetch('/api/admin/reload-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetUser.email,
          amount: Number(amount),
          mode: operationMode,
          note: reason,
          adminName: 'Master Admin (Control Desk)',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update user balance.');
      }

      soundManager.playCoin();
      setSuccessMsg(
        `🎉 Successfully ${
          operationMode === 'add' ? 'reloaded +' : operationMode === 'deduct' ? 'deducted -' : 'set to '
        }$${amount.toLocaleString()} USD! Stored database balance: $${data.newBalance.toLocaleString()} USD.`
      );

      if (currentUser && targetUser.email.toLowerCase() === currentUser.email.toLowerCase()) {
        const updatedAuthUser: AuthUser = {
          ...currentUser,
          balance: data.newBalance,
        };
        onBalanceUpdated(updatedAuthUser);
      }

      loadUsers();
      loadTransactions();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while updating balance.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phoneNumber.includes(searchQuery)
  );

  const filteredRequests = reloadRequests.filter((r) => {
    if (requestFilter === 'all') return true;
    return r.status === requestFilter;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-3xl max-h-[92vh] bg-zinc-950 border border-yellow-500/70 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.3)] flex flex-col overflow-hidden text-white animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-yellow-950/40 via-black to-zinc-900 border-b border-yellow-500/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-black font-black shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide text-yellow-400">
                  ADMIN FINANCIAL PORTAL
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Database Authoritative
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-semibold">
                User Reload Approvals, Database Verification & Direct Balance Injections
              </p>
            </div>
          </div>

          <button
            id="admin-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="grid grid-cols-4 p-1.5 bg-black/70 border-b border-zinc-800 gap-1 shrink-0 text-xs">
          {/* TAB 1: RELOAD REQUESTS APPROVALS */}
          <button
            id="admin-tab-requests"
            onClick={() => {
              setActiveTab('requests');
              loadReloadRequests();
              soundManager.playSpinTick();
            }}
            className={`py-2 font-black rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <BadgeCheck className="w-3.5 h-3.5" />
            <span className="truncate">Approvals</span>
            {pendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-red-600 text-white font-black text-[10px] rounded-full animate-pulse">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          {/* TAB 2: DIRECT ADJUSTMENT */}
          <button
            id="admin-tab-reload"
            onClick={() => {
              setActiveTab('reload');
              soundManager.playSpinTick();
            }}
            className={`py-2 font-black rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'reload'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="truncate">Direct Reload</span>
          </button>

          {/* TAB 3: AUDIT LEDGER */}
          <button
            id="admin-tab-history"
            onClick={() => {
              setActiveTab('history');
              loadTransactions();
              soundManager.playSpinTick();
            }}
            className={`py-2 font-black rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="truncate">Audit Ledger</span>
          </button>

          {/* TAB 4: USERS */}
          <button
            id="admin-tab-users"
            onClick={() => {
              setActiveTab('users');
              loadUsers();
              soundManager.playSpinTick();
            }}
            className={`py-2 font-black rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="truncate">Users ({usersList.length || 1})</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* Notifications */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/60 flex items-start gap-2.5 text-xs text-red-200 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/60 flex items-start gap-2.5 text-xs text-emerald-200 animate-fadeIn shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: RELOAD REQUESTS APPROVAL & REJECTION QUEUE */}
          {/* ========================================================================= */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              {/* Filter Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-zinc-400 font-bold">Filter Status:</span>
                  {(['pending', 'all', 'approved', 'rejected'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setRequestFilter(st)}
                      className={`px-2.5 py-1 text-xs font-black rounded-lg uppercase tracking-wider transition cursor-pointer ${
                        requestFilter === st
                          ? 'bg-yellow-400 text-black shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {st === 'pending' ? `Pending (${pendingRequestsCount})` : st}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={loadReloadRequests}
                  className="text-xs text-yellow-400 hover:text-yellow-300 font-bold flex items-center gap-1 self-end sm:self-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh Queue
                </button>
              </div>

              {filteredRequests.length === 0 ? (
                <div className="p-10 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-2">
                  <BadgeCheck className="w-10 h-10 text-zinc-600 mx-auto" />
                  <p className="text-sm text-zinc-300 font-bold">
                    No {requestFilter !== 'all' ? requestFilter : ''} reload requests found.
                  </p>
                  <p className="text-xs text-zinc-500">
                    When a user submits a balance reload, it appears here awaiting admin approval or rejection before funds are credited.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRequests.map((req, idx) => {
                    const reqId = req._id || req.id || `req-${idx}`;
                    const isProcessing = processingReqId === reqId;

                    return (
                      <div
                        key={reqId}
                        className={`p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          req.status === 'pending'
                            ? 'bg-gradient-to-r from-amber-950/20 via-black to-zinc-900 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                            : req.status === 'approved'
                            ? 'bg-zinc-900/60 border-emerald-500/30'
                            : 'bg-zinc-900/40 border-red-500/30 opacity-75'
                        }`}
                      >
                        {/* Request Details */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span
                              className={`font-black text-lg ${
                                req.type === 'withdraw' ? 'text-amber-400' : 'text-emerald-400'
                              }`}
                            >
                              {req.type === 'withdraw' ? '-' : '+'}${req.amount.toFixed(2)} {req.currency || 'USD'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                req.type === 'withdraw'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              }`}
                            >
                              {req.type === 'withdraw' ? 'WITHDRAWAL' : 'DEPOSIT'}
                            </span>
                            <span className="text-xs font-bold text-white bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                              {req.userName}
                            </span>
                            <span className="text-xs font-mono text-zinc-400">
                              ({req.userEmail})
                            </span>

                            {/* Status Tag */}
                            {req.status === 'pending' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1 animate-pulse">
                                <Clock className="w-3 h-3" /> Awaiting Admin Review
                              </span>
                            )}
                            {req.status === 'approved' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> {req.type === 'withdraw' ? 'Approved & Paid' : 'Approved & Credited'}
                              </span>
                            )}
                            {req.status === 'rejected' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/50 flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> Rejected
                              </span>
                            )}
                          </div>

                          {/* Payment Metadata */}
                          <div className="text-xs text-zinc-300 space-y-0.5">
                            <p>
                              Method: <strong className="text-yellow-300">{req.paymentMethod}</strong> • {req.type === 'withdraw' ? 'Payout Destination / Account' : 'Ref / Hash'}:{' '}
                              <span className="font-mono text-white bg-black/60 px-1.5 py-0.5 rounded border border-zinc-800 select-all">
                                {req.destinationAddress || req.referenceId || 'N/A'}
                              </span>
                            </p>
                            {req.userNote && (
                              <p className="text-zinc-400 italic">
                                Note: "{req.userNote}"
                              </p>
                            )}
                            {req.adminNote && (
                              <p className="text-amber-300 font-semibold">
                                Admin Review: {req.adminNote}
                              </p>
                            )}
                          </div>

                          <p className="text-[10px] text-zinc-500">
                            Requested on: {new Date(req.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {/* Actions (Approve or Reject for Pending requests) */}
                        {req.status === 'pending' ? (
                          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                            {/* APPROVE BUTTON */}
                            <button
                              type="button"
                              id={`approve-btn-${reqId}`}
                              disabled={isProcessing}
                              onClick={() => handleApproveRequest(req)}
                              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition cursor-pointer disabled:opacity-50"
                            >
                              {isProcessing ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              )}
                              <span>{req.type === 'withdraw' ? 'Approve Payout' : 'Approve & Credit'}</span>
                            </button>

                            {/* REJECT BUTTON */}
                            <button
                              type="button"
                              id={`reject-btn-${reqId}`}
                              disabled={isProcessing}
                              onClick={() =>
                                setRejectModal({
                                  open: true,
                                  reqId,
                                  userEmail: req.userEmail,
                                  amount: req.amount,
                                  reason: 'Payment or TXID hash could not be verified on ledger',
                                })
                              }
                              className="px-3.5 py-2 bg-red-950/80 hover:bg-red-900 border border-red-500/60 text-red-200 hover:text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <div className="text-right text-[11px] text-zinc-400 shrink-0">
                            {req.reviewedBy && <p>Reviewed by: {req.reviewedBy}</p>}
                            {req.reviewedAt && (
                              <p className="text-[10px] text-zinc-500">
                                {new Date(req.reviewedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: DIRECT MANUAL BALANCE RELOAD (DATABASE PERSISTENT) */}
          {/* ========================================================================= */}
          {activeTab === 'reload' && (
            <div className="space-y-4">
              {/* Persistent Database Banner */}
              <div className="p-3 rounded-xl bg-zinc-900 border border-yellow-500/30 flex items-start gap-2.5 text-xs text-zinc-300">
                <Shield className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-yellow-300 font-bold block mb-0.5">
                    MongoDB Database Balance Storage
                  </strong>
                  <p className="text-[11px] text-zinc-400">
                    All balances are authoritative and stored permanently in the database.
                    Changes made here directly update the user's persistent record.
                  </p>
                </div>
              </div>

              {/* Target User Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  1. Select Target VIP Account:
                </label>
                <div className="flex items-center gap-2">
                  <select
                    id="admin-select-user"
                    value={selectedUserEmail}
                    onChange={(e) => {
                      setSelectedUserEmail(e.target.value);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-yellow-400 outline-none"
                  >
                    {usersList.map((u) => (
                      <option key={u.email} value={u.email}>
                        {u.fullName} ({u.email}) — Stored Balance: ${u.balance.toLocaleString()} {u.currency}
                      </option>
                    ))}
                    {!usersList.some((u) => u.email === selectedUserEmail) && (
                      <option value={selectedUserEmail}>
                        {targetUser.fullName} ({selectedUserEmail}) — Stored Balance: ${targetUser.balance.toLocaleString()} USD
                      </option>
                    )}
                  </select>

                  <button
                    onClick={loadUsers}
                    className="p-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition"
                    title="Refresh user list"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Target User Summary Card */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-xl">
                    {targetUser.avatar || '👑'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{targetUser.fullName}</span>
                      <span className="text-[10px] bg-yellow-400 text-black font-black px-1.5 py-0.2 rounded uppercase">
                        {targetUser.role || 'VIP'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">{targetUser.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                    Current Database Balance
                  </span>
                  <span className="text-base sm:text-lg font-black font-mono text-emerald-400">
                    ${targetUser.balance.toLocaleString()} {targetUser.currency}
                  </span>
                </div>
              </div>

              {/* Operation Mode (Add / Deduct / Set) */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  2. Financial Operation:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOperationMode('add')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      operationMode === 'add'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>+ Reload (Add Funds)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOperationMode('deduct')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      operationMode === 'deduct'
                        ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>- Deduct Balance</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOperationMode('set')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      operationMode === 'set'
                        ? 'bg-yellow-500 text-black border-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.3)]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>= Set Exact Balance</span>
                  </button>
                </div>
              </div>

              {/* Quick Select Chips & Custom Amount */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  3. Amount (USD):
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {[50, 100, 250, 500, 1000, 2500].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setAmount(chip)}
                      className={`py-1.5 px-2 text-xs font-black rounded-lg border transition cursor-pointer ${
                        amount === chip
                          ? 'bg-yellow-400 text-black border-yellow-300 shadow-sm'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      ${chip.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 font-bold text-sm">
                    $
                  </span>
                  <input
                    id="admin-amount-input"
                    type="number"
                    min="1"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    placeholder="Enter custom amount..."
                    className="w-full pl-8 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-yellow-400 rounded-xl text-white font-mono font-bold text-sm outline-none transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-bold">
                    USD
                  </span>
                </div>
              </div>

              {/* Reason / Transaction Note */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  4. Audit Note / Memo:
                </label>
                <input
                  id="admin-reason-input"
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. VIP balance reload, manual deposit authorization"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-yellow-400 rounded-xl text-white text-xs outline-none transition"
                />
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  id="admin-execute-reload-btn"
                  onClick={handleExecuteReload}
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 hover:from-yellow-400 hover:to-amber-300 text-black font-black text-sm rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.5)] border border-yellow-200 transition transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-black fill-black" />
                  )}
                  <span>
                    Confirm {operationMode === 'add' ? 'Direct Reload' : operationMode === 'deduct' ? 'Deduction' : 'Set'}{' '}
                    (${amount.toLocaleString()} USD)
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: AUDIT LEDGER */}
          {/* ========================================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-bold">
                  Recent Balance Adjustments & Game Transactions:
                </span>
                <button
                  onClick={loadTransactions}
                  className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              {transactions.length === 0 ? (
                <div className="p-8 text-center bg-black/40 border border-zinc-800 rounded-xl text-zinc-500 text-xs">
                  No balance transactions recorded yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {transactions.map((tx, idx) => {
                    const isPositive = tx.amount >= 0;
                    return (
                      <div
                        key={tx._id || tx.id || `tx-${idx}`}
                        className="bg-black/60 border border-zinc-800/80 hover:border-zinc-700 p-3 rounded-xl flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                              isPositive
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                                : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                            }`}
                          >
                            {isPositive ? '+' : '-'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{tx.userName}</span>
                              <span className="text-[10px] text-zinc-400 font-mono font-medium">
                                ({tx.userEmail})
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-semibold">{tx.gameOrSource}</p>
                            {tx.note && <p className="text-[10px] text-yellow-500/90">{tx.note}</p>}
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`font-black font-mono text-sm ${
                              isPositive ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isPositive ? '+' : ''}
                            ${Math.abs(tx.amount).toFixed(2)} USD
                          </span>
                          <p className="text-[10px] text-zinc-500">
                            Bal: ${tx.balanceAfter.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: MANAGE USERS */}
          {/* ========================================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by name, email, or phone..."
                  className="w-full bg-black/80 border border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              {/* Users List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredUsers.length === 0 ? (
                  <div className="p-6 text-center text-zinc-500 text-xs bg-black/40 rounded-xl border border-zinc-800">
                    No users found matching "{searchQuery}".
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                    <div
                      key={u.email}
                      onClick={() => {
                        setSelectedUserEmail(u.email);
                        setActiveTab('reload');
                        soundManager.playSpinTick();
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        targetUser.email === u.email
                          ? 'bg-yellow-950/20 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]'
                          : 'bg-black/60 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{u.avatar || '👑'}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{u.fullName}</span>
                            <span className="text-[9px] bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded uppercase font-bold">
                              {u.role || 'VIP'}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-mono">{u.email}</p>
                          <p className="text-[10px] text-yellow-500">{u.phoneNumber}</p>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <div>
                          <p className="text-[10px] text-zinc-400 uppercase font-bold">Stored Database Balance</p>
                          <p className="text-sm font-black font-mono text-green-400">
                            ${u.balance.toLocaleString()} USD
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Info */}
        <div className="p-3 bg-black/80 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-yellow-400" />
            <span>AdvKings Master Financial Portal • Synchronized with MongoDB Atlas</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-3 py-1 rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Reject Confirmation Prompt Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-950 border border-red-500/80 rounded-2xl p-5 max-w-md w-full text-white shadow-2xl space-y-3.5 animate-scaleUp">
            <div className="flex items-center gap-2 text-red-400 font-black text-sm">
              <XCircle className="w-5 h-5" />
              <span>Reject Reload Request</span>
            </div>

            <p className="text-xs text-zinc-300">
              Are you sure you want to reject the reload of{' '}
              <strong className="text-white">${rejectModal.amount.toFixed(2)} USD</strong> for{' '}
              <strong className="text-yellow-400">{rejectModal.userEmail}</strong>?
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400">
                Reason for Rejection:
              </label>
              <textarea
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:border-red-400 outline-none resize-none h-20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModal({ open: false, reqId: '', userEmail: '', amount: 0, reason: '' })}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

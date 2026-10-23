import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Crown,
  Zap,
  Globe,
  KeyRound,
  RefreshCw,
  Check
} from 'lucide-react';
import { AuthUser } from '../types';
import { soundManager } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  initialMode?: 'register' | 'login';
}

const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸', name: 'USA / Canada' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+971', flag: '🇦🇪', name: 'UAE / Dubai' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+380', flag: '🇺🇦', name: 'Ukraine' },
  { code: '+7', flag: '🇷🇺', name: 'Russia' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: '+63', flag: '🇵🇭', name: 'Philippines' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'register',
}) => {
  const [mode, setMode] = useState<'register' | 'login' | 'forgot-password'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [password, setPassword] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Login identifier (Email or Phone)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Password Reset & 6-digit email verification code state
  const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMsg(null);
      setResetStep('request');
      setResetCode('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  }, [isOpen, initialMode]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Request 6-digit code sent to registered email
  const handleSendResetCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = resetEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid registered email address.');
      return;
    }

    setLoading(true);
    soundManager.playSpinTick();

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch verification code. Please check your email.');
      }

      soundManager.playCoin();
      setResetStep('verify');
      setResendCooldown(60);
      setSuccessMsg(`✉️ A 6-digit code has been sent to ${cleanEmail}. Please enter it below.`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while dispatching verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Reset password using verified 6-digit code
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanCode = resetCode.trim().replace(/\D/g, '');
    if (cleanCode.length !== 6) {
      setError('Please enter the full 6-digit verification code sent to your email.');
      return;
    }

    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match. Please verify and retype.');
      return;
    }

    setLoading(true);
    soundManager.playSpinTick();

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail.trim().toLowerCase(),
          code: cleanCode,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to reset password. Please check your verification code.');
      }

      soundManager.playCoin();
      setSuccessMsg('🎉 Password has been reset successfully! Redirecting to VIP Sign In...');

      // Pre-fill login credentials so user can log in immediately
      setLoginIdentifier(resetEmail.trim().toLowerCase());
      setLoginPassword(newPassword);

      setTimeout(() => {
        setMode('login');
        setResetStep('request');
        setResetCode('');
        setNewPassword('');
        setConfirmNewPassword('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setError('Please enter your full name or nickname.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    soundManager.playSpinTick();

    try {
      const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: fullPhone,
        countryCode,
        password,
        telegramHandle: telegramHandle.trim(),
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('API server returned an invalid response format. Please try again.');
      }

      const data = await res.json();

      if (!res.ok || !data.success || !data.user) {
        throw new Error(data.error || 'Failed to complete registration. Please try again.');
      }

      soundManager.playCoin();
      setSuccessMsg('🎉 Registration successful! $50.00 USD bonus credited to your VIP account.');

      const userObj: AuthUser = {
        ...data.user,
        balance: typeof data.user.balance === 'number' ? data.user.balance : 50.0,
      };
      localStorage.setItem('adkings_user', JSON.stringify(userObj));

      setTimeout(() => {
        onSuccess(userObj);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!loginIdentifier.trim()) {
      setError('Please enter your registered Email or Phone Number.');
      return;
    }

    if (!loginPassword || !loginPassword.trim()) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);
    soundManager.playSpinTick();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Server returned an unexpected response format. Please check serverless connection.');
      }

      const data = await res.json();

      if (!res.ok || !data.success || !data.user) {
        throw new Error(data.error || 'No account found with this email or phone number. Please check credentials or register.');
      }

      soundManager.playCoin();
      setSuccessMsg('✅ Signed in successfully!');

      const userObj: AuthUser = data.user;
      localStorage.setItem('adkings_user', JSON.stringify(userObj));

      setTimeout(() => {
        onSuccess(userObj);
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-registration-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#121218] via-[#0d0d12] to-[#08080a] border-2 border-yellow-500/80 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden text-white">
        {/* Top Glowing Header Accent */}
        <div className="bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 p-0.5" />

        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 pb-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(234,179,8,0.5)] border border-yellow-200">
              <Crown className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                  AdvKings VIP Portal
                </span>
                <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                  MEMBER
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 font-semibold">
                Instant Access to High-Yield Banners & Signal Bots
              </p>
            </div>
          </div>

          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        {mode === 'forgot-password' ? (
          <div className="flex items-center justify-between px-3 py-2.5 bg-black/70 border-b border-zinc-800">
            <button
              type="button"
              id="auth-back-to-signin-tab"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMsg(null);
                soundManager.playSpinTick();
              }}
              className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to VIP Sign In</span>
            </button>
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-300 bg-yellow-500/10 px-2.5 py-1 rounded-md border border-yellow-500/30">
              <KeyRound className="w-3.5 h-3.5 text-yellow-400" />
              <span>Password Recovery</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 p-1.5 bg-black/60 border-b border-zinc-800/80 gap-1">
            <button
              type="button"
              id="auth-tab-register"
              onClick={() => {
                setMode('register');
                setError(null);
                setSuccessMsg(null);
                soundManager.playSpinTick();
              }}
              className={`py-2 px-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.4)] font-black'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create VIP Account (+$50)</span>
            </button>

            <button
              type="button"
              id="auth-tab-login"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMsg(null);
                soundManager.playSpinTick();
              }}
              className={`py-2 px-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.4)] font-black'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>VIP Sign In</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
          {/* VIP Welcome Badges */}
          <div className="mb-4 grid grid-cols-3 gap-2 text-center text-[10px] sm:text-[11px] font-bold">
            <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 flex flex-col items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Instant Payouts</span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex flex-col items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Insured</span>
            </div>
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex flex-col items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-cyan-400" />
              <span>$50 Bonus</span>
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-green-950/80 border border-green-500/60 text-green-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* REGISTRATION FORM */}
          {mode === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-zinc-300 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Full Name / Nickname <span className="text-red-500">*</span></span>
                </label>
                <input
                  id="register-fullname"
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan / @CryptoKing"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-yellow-400 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-zinc-300 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Email Address <span className="text-red-500">*</span></span>
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-yellow-400 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                />
              </div>

              {/* Phone Number with Country Code */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-zinc-300 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Phone Number (SMS / WhatsApp Alerts) <span className="text-red-500">*</span></span>
                </label>
                <div className="flex gap-2">
                  <select
                    id="register-country-code"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-[125px] bg-zinc-950 border border-zinc-800 focus:border-yellow-400 rounded-xl px-2 py-2 text-xs text-yellow-300 outline-none shrink-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code + c.name} value={c.code} className="bg-zinc-900 text-white">
                        {c.flag} {c.code} ({c.name.split(' ')[0]})
                      </option>
                    ))}
                  </select>

                  <input
                    id="register-phone"
                    type="tel"
                    required
                    placeholder="e.g. 555 123 4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-yellow-400 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-zinc-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Create Password <span className="text-red-500">*</span></span>
                  </span>
                  <span className="text-[10px] text-zinc-400">Min 4 chars</span>
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-yellow-400 rounded-xl px-3 py-2 pr-10 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Optional Telegram Handle */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-zinc-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Send className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Telegram Handle (Optional)</span>
                  </span>
                  <span className="text-[10px] text-cyan-400">For 1-on-1 VIP Support</span>
                </label>
                <input
                  id="register-telegram"
                  type="text"
                  placeholder="@your_username"
                  value={telegramHandle}
                  onChange={(e) => setTelegramHandle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                />
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  id="register-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-700 text-yellow-500 focus:ring-yellow-400"
                />
                <label htmlFor="register-terms" className="text-[11px] text-zinc-400 font-medium select-none cursor-pointer">
                  I agree to receive VIP signals, instant payout notifications, and hourly cashout updates.
                </label>
              </div>

              {/* Submit Button */}
              <button
                id="register-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl border border-yellow-200 shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-2 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Creating VIP Account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>COMPLETE REGISTRATION (CLAIM $50)</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>
          ) : mode === 'forgot-password' ? (
            /* FORGOT & RESET PASSWORD FLOW (6-DIGIT EMAIL CODE) */
            <div className="space-y-4 animate-fadeIn">
              {resetStep === 'request' ? (
                <form onSubmit={handleSendResetCode} className="space-y-4">
                  <div className="text-center p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <div className="w-12 h-12 mx-auto mb-2.5 rounded-xl bg-gradient-to-br from-yellow-500/25 to-amber-500/10 border border-yellow-500/40 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-black text-white">Reset VIP Password</h3>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      Enter your registered email address. We will send a 6-digit verification code to reset your account password.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-zinc-300 mb-1 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Registered Email Address <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      id="reset-request-email"
                      type="email"
                      required
                      placeholder="e.g. kate20@gmail.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-yellow-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                      autoFocus
                    />
                  </div>

                  <button
                    id="send-reset-code-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl border border-yellow-200 shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-4 cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Dispatching 6-Digit Code...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        <span>SEND 6-DIGIT VERIFICATION CODE</span>
                      </span>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setError(null);
                        setSuccessMsg(null);
                        soundManager.playSpinTick();
                      }}
                      className="text-xs text-zinc-400 hover:text-yellow-400 font-semibold cursor-pointer"
                    >
                      Remembered your password? <span className="text-yellow-400 font-bold underline">Back to Sign In</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* STEP 2: VERIFY 6-DIGIT CODE AND ENTER NEW PASSWORD */
                <form onSubmit={handleResetPassword} className="space-y-3.5">
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-zinc-400">Code Sent To</p>
                      <p className="text-xs font-black text-yellow-300 font-mono">{resetEmail}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setResetStep('request');
                        setError(null);
                        setSuccessMsg(null);
                        soundManager.playSpinTick();
                      }}
                      className="text-[10px] text-zinc-400 hover:text-yellow-400 underline font-semibold cursor-pointer"
                    >
                      Change email
                    </button>
                  </div>

                  {/* 6-Digit Code Input */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-zinc-300 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-yellow-400" />
                        <span>6-Digit Verification Code <span className="text-red-500">*</span></span>
                      </span>
                      <span className="text-[10px] text-zinc-400">15 min expiration</span>
                    </label>
                    <input
                      id="reset-code-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      placeholder="••••••"
                      value={resetCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setResetCode(val);
                      }}
                      className="w-full bg-zinc-950 border border-yellow-500/70 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-center text-xl font-mono font-black tracking-[0.4em] text-yellow-300 placeholder-zinc-700 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                      autoFocus
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-zinc-300 mb-1 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-yellow-400" />
                      <span>New Password <span className="text-red-500">*</span></span>
                    </label>
                    <div className="relative">
                      <input
                        id="reset-new-password"
                        type={showResetPassword ? 'text' : 'password'}
                        required
                        placeholder="At least 4 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-yellow-400 rounded-xl px-3 py-2.5 pr-10 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowResetPassword(!showResetPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                      >
                        {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-zinc-300 mb-1 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Confirm New Password <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      id="reset-confirm-password"
                      type={showResetPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-type new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-yellow-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                    />
                  </div>

                  {/* Submit Reset */}
                  <button
                    id="submit-reset-password-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl border border-yellow-200 shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-3 cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Updating Password...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>RESET PASSWORD & SIGN IN</span>
                      </span>
                    )}
                  </button>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || loading}
                      onClick={() => handleSendResetCode()}
                      className="text-zinc-400 hover:text-yellow-400 disabled:opacity-50 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                      <span>{resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setError(null);
                        setSuccessMsg(null);
                        soundManager.playSpinTick();
                      }}
                      className="text-yellow-400 hover:underline font-bold cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* SIGN IN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-zinc-300 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Email Address or Phone Number <span className="text-red-500">*</span></span>
                </label>
                <input
                  id="login-identifier"
                  type="text"
                  required
                  placeholder="name@example.com or +1 555..."
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-yellow-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-zinc-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Password <span className="text-red-500">*</span></span>
                  </span>
                  <button
                    type="button"
                    id="login-forgot-password-btn"
                    onClick={() => {
                      if (loginIdentifier && loginIdentifier.includes('@')) {
                        setResetEmail(loginIdentifier.trim());
                      }
                      setMode('forgot-password');
                      setResetStep('request');
                      setError(null);
                      setSuccessMsg(null);
                      soundManager.playSpinTick();
                    }}
                    className="text-[10.5px] text-yellow-400 hover:text-yellow-300 font-bold cursor-pointer inline-flex items-center gap-1 bg-yellow-500/10 hover:bg-yellow-500/20 px-2 py-0.5 rounded-lg border border-yellow-500/30 transition-all shadow-[0_0_8px_rgba(234,179,8,0.15)]"
                  >
                    <KeyRound className="w-3 h-3 text-yellow-400 shrink-0" />
                    <span>Forgot Password? (Email 6-Digit Code)</span>
                  </button>
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-yellow-400 rounded-xl px-3 py-2.5 pr-10 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl border border-yellow-200 shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-4 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>SIGN IN TO VIP ACCOUNT</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="text-xs text-zinc-400 hover:text-yellow-400 font-semibold"
                >
                  Don't have an account yet? <span className="text-yellow-400 font-bold underline">Register Now</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const VIPAuthModal = AuthModal;
export default AuthModal;

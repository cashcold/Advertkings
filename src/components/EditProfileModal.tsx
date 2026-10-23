import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Loader2, 
  Crown,
  Sparkles
} from 'lucide-react';
import { AuthUser } from '../types';
import { soundManager } from '../utils/audio';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onUpdateUser: (updatedUser: AuthUser) => void;
}

const AVATAR_OPTIONS = ['👑', '🤴', '👸', '💎', '🚀', '🔥', '⚡', '🌟', '🏆', '🎯'];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [telegram, setTelegram] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('👑');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.fullName || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phoneNumber || '');
      setTelegram(currentUser.telegramHandle || '');
      setSelectedAvatar(currentUser.avatar || '👑');
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedTelegram = telegram.trim();

    if (!trimmedUsername) {
      setErrorMessage('Username / Full Name cannot be empty');
      soundManager.playError();
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address');
      soundManager.playError();
      return;
    }

    if (!trimmedPhone) {
      setErrorMessage('Phone number cannot be empty');
      soundManager.playError();
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentEmail: currentUser.email,
          fullName: trimmedUsername,
          email: trimmedEmail,
          phoneNumber: trimmedPhone,
          telegramHandle: trimmedTelegram,
          avatar: selectedAvatar,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update profile');
      }

      const updatedUser: AuthUser = {
        ...currentUser,
        fullName: trimmedUsername,
        email: trimmedEmail,
        phoneNumber: trimmedPhone,
        telegramHandle: trimmedTelegram,
        avatar: selectedAvatar,
        ...(data.user || {}),
      };

      onUpdateUser(updatedUser);
      soundManager.playWinFanfare();
      setSuccessMessage('Profile information successfully updated!');

      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating profile. Please try again.');
      soundManager.playError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-gradient-to-b from-[#14141c] via-[#0d0d12] to-[#08080a] border-2 border-yellow-500/70 rounded-2xl p-5 sm:p-6 shadow-[0_0_50px_rgba(234,179,8,0.25)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-edit-profile-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-700 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-zinc-800 pb-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-2xl shadow-lg border border-yellow-300">
            {selectedAvatar}
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-1.5">
              Edit Account Profile
              <Crown className="w-4 h-4 text-yellow-400 inline" />
            </h2>
            <p className="text-xs text-zinc-400">
              Update your username, email address, and phone number
            </p>
          </div>
        </div>

        {/* Avatar Selection Row */}
        <div className="mb-4">
          <label className="text-[11px] font-bold text-zinc-300 block mb-1.5 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            Choose VIP Avatar
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
            {AVATAR_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setSelectedAvatar(emoji);
                  soundManager.playSpinTick();
                }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all shrink-0 ${
                  selectedAvatar === emoji
                    ? 'bg-yellow-500/30 border-2 border-yellow-400 scale-110 shadow-sm'
                    : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Username / Full Name */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-yellow-400" />
              Username / Full Name
            </label>
            <input
              id="edit-profile-username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Kate Alexander"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700/80 focus:border-yellow-400 focus:outline-none text-white text-xs font-medium placeholder-zinc-500 transition"
              required
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-yellow-400" />
              Email Address
            </label>
            <input
              id="edit-profile-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700/80 focus:border-yellow-400 focus:outline-none text-white text-xs font-medium placeholder-zinc-500 transition"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-yellow-400" />
              Phone Number
            </label>
            <input
              id="edit-profile-phone-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 (555) 234-5678"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700/80 focus:border-yellow-400 focus:outline-none text-white text-xs font-medium placeholder-zinc-500 transition"
              required
            />
          </div>

          {/* Telegram Handle (Optional) */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-sky-400" />
              Telegram Handle (Optional)
            </label>
            <input
              id="edit-profile-telegram-input"
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="e.g. @VIP_Member"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700/80 focus:border-yellow-400 focus:outline-none text-white text-xs font-medium placeholder-zinc-500 transition"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800/80 flex items-center gap-2 text-xs text-red-300 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700 flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs border border-zinc-700 transition"
            >
              Cancel
            </button>
            <button
              id="save-profile-btn"
              type="submit"
              disabled={isLoading}
              className="w-2/3 py-2.5 px-3 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 hover:from-yellow-400 hover:to-amber-300 text-black font-black text-xs border border-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.4)] flex items-center justify-center gap-1.5 transition disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

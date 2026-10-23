import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { JackpotTicker } from './components/JackpotTicker';
import { HyipBanner } from './components/HyipBanner';
import { CasinoJackpotBanner } from './components/CasinoJackpotBanner';
import { FalconeCasinoBanner } from './components/FalconeCasinoBanner';
import { AviatorBanner } from './components/AviatorBanner';
import { LotteryScratchBanner } from './components/LotteryScratchBanner';
import { GamingBanner } from './components/GamingBanner';
import { ForexTradingBanner } from './components/ForexTradingBanner';
import { FootballBettingBanner } from './components/FootballBettingBanner';
import { RealFootballStandingsSection } from './components/RealFootballStandingsSection';
import { VirtualGamesBanner } from './components/VirtualGamesBanner';
import { CryptoLoanBanner } from './components/CryptoLoanBanner';
import { PayPalReloadBanner } from './components/PayPalReloadBanner';
import { ShoppingCardBanner } from './components/ShoppingCardBanner';
import { EcommerceDropshippingBanner } from './components/EcommerceDropshippingBanner';
import { FreeInternetDataBanner } from './components/FreeInternetDataBanner';
import { VirtualPhoneBanner } from './components/VirtualPhoneBanner';
import { EmailVerificationBanner } from './components/EmailVerificationBanner';
import { GiftCardBanner } from './components/GiftCardBanner';
import { LiveWeatherBanner } from './components/LiveWeatherBanner';
import { SugarMummyBanner } from './components/SugarMummyBanner';
import { HookupDatingBanner } from './components/HookupDatingBanner';
import { SocialMediaBoostBanner } from './components/SocialMediaBoostBanner';
import { FullStackDevelopersBanner } from './components/FullStackDevelopersBanner';
import { HyipMonitorList } from './components/HyipMonitorList';
import { LiveCommunityChat } from './components/LiveCommunityChat';
import { BannerGrid } from './components/BannerGrid';
import { StickyBottomBanner } from './components/StickyBottomBanner';
import { TelegramModal } from './components/TelegramModal';
import { AuthModal } from './components/AuthModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { UserReloadModal } from './components/UserReloadModal';
import { EditProfileModal } from './components/EditProfileModal';
import { BannerCategory, BannerSize, AuthUser } from './types';
import { Send, Zap, Sparkles, Trophy, Flame, Shield, HelpCircle, MessageCircle, Users } from 'lucide-react';
import { soundManager } from './utils/audio';

const DEFAULT_VIP_USER: AuthUser = {
  id: 'kate_vip_01',
  email: 'kate20@gmail.com',
  fullName: 'Kate',
  phoneNumber: '+1 3254784445',
  balance: 50.0,
  currency: 'USD',
  memberStatus: 'VERIFIED VIP',
  avatar: '👑',
  role: 'vip',
  verified: true,
};

export default function App() {
  const [category, setCategory] = useState<BannerCategory>('all');
  const [bannerSize, setBannerSize] = useState<BannerSize>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [blinkIntensity, setBlinkIntensity] = useState<'mild' | 'extreme' | 'hyper'>('extreme');
  const [isTelegramOpen, setIsTelegramOpen] = useState<boolean>(false);
  const [telegramInitialMsg, setTelegramInitialMsg] = useState<string>('');
  const [totalClicks, setTotalClicks] = useState<number>(48290);

  // User Authentication & Global VIP Balance State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(DEFAULT_VIP_USER);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);
  const [isUserReloadOpen, setIsUserReloadOpen] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);

  // Synchronize user profile & balance directly from database
  const syncUserFromDb = async (email: string) => {
    try {
      const res = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
          localStorage.setItem('adkings_user', JSON.stringify(data.user));
        }
      }
    } catch (err) {
      console.warn('Database balance sync check:', err);
    }
  };

  // Load saved user session on mount and sync stored balance from database
  useEffect(() => {
    let emailToSync = 'kate20@gmail.com';
    try {
      const saved = localStorage.getItem('adkings_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email) {
          emailToSync = parsed.email;
        }
        setCurrentUser(parsed);
      } else {
        // Automatically default to the requested Kate VIP profile
        setCurrentUser(DEFAULT_VIP_USER);
        localStorage.setItem('adkings_user', JSON.stringify(DEFAULT_VIP_USER));
      }
    } catch (e) {
      console.error('Failed to load saved user session', e);
      setCurrentUser(DEFAULT_VIP_USER);
    }

    // Always fetch persistent balance stored in the database
    syncUserFromDb(emailToSync);
  }, []);

  const handleOpenAuth = (mode: 'register' | 'login' = 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    if (soundEnabled) soundManager.playSpinTick();
  };

  const handleLogout = () => {
    localStorage.removeItem('adkings_user');
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('adkings_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  // Synchronized global balance handler used across games (Aviator, Casino, etc.)
  const handleUpdateBalance = async (delta: number, reason: string): Promise<boolean> => {
    const active = currentUser || DEFAULT_VIP_USER;
    const newBalance = Math.max(0, Number((active.balance + delta).toFixed(2)));
    const updated: AuthUser = {
      ...active,
      balance: newBalance,
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem('adkings_user', JSON.stringify(updated));
      await fetch('/api/user/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: updated.id || updated.email,
          email: updated.email,
          delta,
          reason,
          newBalance,
        }),
      });
    } catch (err) {
      console.warn('Balance sync notice:', err);
    }
    return true;
  };

  // Auto-increment ad clicks count by +3 every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalClicks((prev) => prev + 3);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const incrementClicks = () => {
    setTotalClicks((prev) => prev + 1);
  };

  const handleOpenTelegram = (msg?: string) => {
    setTelegramInitialMsg(msg || 'Hi @adkingsSupport, I want to rent banner spots on AdKings Ads Network!');
    setIsTelegramOpen(true);
    if (soundEnabled) soundManager.playCoin();
  };

  return (
    <div
      className={`min-h-screen bg-[#050505] dark-grid-bg text-white font-sans selection:bg-yellow-400 selection:text-black pb-28 ${
        blinkIntensity === 'hyper'
          ? 'hyper-mode'
          : blinkIntensity === 'mild'
          ? 'mild-mode'
          : ''
      }`}
    >
      {/* Header */}
      <Header
        category={category}
        setCategory={setCategory}
        bannerSize={bannerSize}
        setBannerSize={setBannerSize}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        blinkIntensity={blinkIntensity}
        setBlinkIntensity={setBlinkIntensity}
        onOpenTelegram={handleOpenTelegram}
        totalClicks={totalClicks}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        onOpenUserReload={() => setIsUserReloadOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-4">
        {/* Verified HYIP Paying Projects Monitor (Class "Premium" TOP Choices) - Positioned at Top */}
        {(category === 'all' || category === 'hyip') && (
          <HyipMonitorList
            onOpenTelegram={handleOpenTelegram}
            incrementClicks={incrementClicks}
            soundEnabled={soundEnabled}
          />
        )}

        {/* Feature Interactive Banners Showcase */}
        <div className="space-y-6 mt-6">
          {/* Forex Trading AI Radar & AdvKings ECN Broker Banner */}
          {(category === 'all' || category === 'forex') && (
            <ForexTradingBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
              currentUser={currentUser}
              currentBalance={currentUser ? currentUser.balance : 50.0}
              currency="USD"
              onUpdateBalance={handleUpdateBalance}
              onOpenReload={() => {
                if (currentUser?.role === 'admin') {
                  setIsAdminPortalOpen(true);
                } else {
                  setIsUserReloadOpen(true);
                }
              }}
            />
          )}

          {(category === 'all' || category === 'hyip') && (
            <HyipBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}

          {/* Football Betting Slip VVIP & Correct Score Banner */}
          {(category === 'all' || category === 'football') && (
            <>
              <FootballBettingBanner
                onOpenTelegram={handleOpenTelegram}
                incrementClicks={incrementClicks}
              />
              {/* Real Football Table Standings Section directly under the VVIP slip */}
              <RealFootballStandingsSection />
            </>
          )}

          {/* Virtue Games Suite (Virtual Football, Horse Derby, Car Race, Mega Spin, Penalty Shootout) */}
          {(category === 'all' || category === 'virtual-games') && (
            <VirtualGamesBanner
              currentUser={currentUser}
              currentBalance={currentUser ? currentUser.balance : 50.0}
              currency="USD"
              onUpdateBalance={handleUpdateBalance}
              onOpenReload={() => {
                if (currentUser?.role === 'admin') {
                  setIsAdminPortalOpen(true);
                } else {
                  setIsUserReloadOpen(true);
                }
              }}
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}

          {/* Instant Crypto Loan Gateway Banner */}
          {(category === 'all' || category === 'crypto-loan') && (
            <CryptoLoanBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}

          {/* Instant PayPal Money Reload & Top-Up Banner */}
          {(category === 'all' || category === 'paypal') && (
            <PayPalReloadBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}

          {/* E-Commerce Dropshipping & Turnkey Store Automation Banner */}
          {(category === 'all' || category === 'dropshipping') && (
            <EcommerceDropshippingBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}

          {/* Free Shopping Virtual Card & Discount Voucher Banner */}
          {(category === 'all' || category === 'shopping') && (
            <ShoppingCardBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}

          {/* Free 500GB Internet Mobile Data Banner (No Expiration / Lifetime) */}
          {category === 'all' && (
            <FreeInternetDataBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}

          {/* Free Virtual Phone Number Banner (Calls & Online Verification for WhatsApp, TikTok, Facebook, etc.) */}
          {(category === 'all' || category === 'virtual-phone') && (
            <VirtualPhoneBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}

          {/* Email Verification & Temp Disposable Mail Inbox Banner */}
          {(category === 'all' || category === 'email-verification') && (
            <EmailVerificationBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}

          {/* Sugar Mummy & Sugar Daddy (Ages 37-78) Marriage Matchmaking Banner - Positioned under Virtual Phone Numbers */}
          {(category === 'all' || category === 'sugar-mummy') && (
            <SugarMummyBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}

          {/* All Digital Gift Cards Banner (Amazon, Apple, Google Play, Steam, PlayStation, Xbox, Netflix, Razer, Roblox, Sephora, Nike) */}
          {(category === 'all' || category === 'gift-card' || category === 'shopping' || category === 'gaming') && (
            <GiftCardBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}

          {/* Live Weather Global Radar & Local Country Forecast Banner - Positioned under Gift Cards */}
          {(category === 'all' || category === 'gift-card' || category === 'live-weather') && (
            <LiveWeatherBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}

          {/* Social Media Likes, Followers, Comments & Views Boost Banner (Up to 10k/Hour) */}
          {category === 'all' && (
            <SocialMediaBoostBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}

          {/* Casino Jackpot Slot Banner */}
          {(category === 'all' || category === 'casino') && (
            <>
              <FalconeCasinoBanner
                onOpenTelegram={handleOpenTelegram}
                incrementClicks={incrementClicks}
              />
              <CasinoJackpotBanner
                onOpenTelegram={handleOpenTelegram}
                incrementClicks={incrementClicks}
              />
            </>
          )}

          {/* Discreet Local Hookup & Casual Dating Banner - Positioned under Falcone Casino VIP Slots */}
          {(category === 'all' || category === 'hookup-dating') && (
            <HookupDatingBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}

          {/* Aviator Signal Banner */}
          {(category === 'all' || category === 'aviator') && (
            <AviatorBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
              currentUser={currentUser}
              currentBalance={currentUser ? currentUser.balance : 50.0}
              currency="USD"
              onUpdateBalance={handleUpdateBalance}
              onOpenAdminReload={() => {
                if (currentUser?.role === 'admin') {
                  setIsAdminPortalOpen(true);
                } else {
                  setIsUserReloadOpen(true);
                }
              }}
            />
          )}

          {/* Lottery Scratch Card Banner */}
          {(category === 'all' || category === 'lottery') && (
            <LotteryScratchBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}

          {/* Cyber Gaming Banner */}
          {(category === 'all' || category === 'gaming') && (
            <GamingBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          )}
        </div>

        {/* Global Live Jackpot Ticker - Positioned Under Banners / Projects */}
        <div className="mt-8">
          <JackpotTicker
            onOpenTelegram={handleOpenTelegram}
            incrementClicks={incrementClicks}
          />
        </div>

        {/* Live Winners & Cashout Chatroom (Simulated Real-Time Claims across HYIPs, Casino, Aviator, Lotto, Gaming) */}
        <div className="mt-8">
          <LiveCommunityChat
            soundEnabled={soundEnabled}
            onOpenTelegram={handleOpenTelegram}
            incrementClicks={incrementClicks}
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
          />
        </div>

        {/* High CTR Standard Ad Units Grid */}
        <BannerGrid
          category={category}
          bannerSize={bannerSize}
          onOpenTelegram={handleOpenTelegram}
          incrementClicks={incrementClicks}
        />

        {/* Full-Stack & Android Developers Available Banner (Placed at the bottom of High CTR Ad Network Sponsored Campaign Banners) */}
        {(category === 'all' || category === 'developers') && (
          <div className="my-8">
            <FullStackDevelopersBanner
              onOpenTelegram={handleOpenTelegram}
              incrementClicks={incrementClicks}
            />
          </div>
        )}

        {/* Bottom Value Props & Telegram Ad Rental FAQ */}
        <section className="my-10 rounded-2xl bg-zinc-950/90 border border-zinc-800 p-6 shadow-2xl backdrop-blur-sm">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <span className="bg-yellow-400 text-black font-black text-xs px-3 py-1 rounded uppercase tracking-wider shadow-[0_0_12px_rgba(234,179,8,0.4)]">
              ⚡ ADVERTISERS & PUBLISHERS ⚡
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-yellow-300 mt-3 uppercase tracking-tight">
              WHY ADVERTISE ON MEGASPIN ADS NETWORK?
            </h3>
            <p className="text-xs text-zinc-400 font-bold mt-1.5">
              35 Years of UI/UX craft engineered for high click-through rates, instant Telegram engagement, and zero registration friction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-[#0c0c0e] p-4 rounded-xl border border-yellow-500/30 hover:border-yellow-500/60 transition-colors shadow-lg">
              <div className="w-10 h-10 mx-auto rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 flex items-center justify-center mb-2 shadow-[0_0_12px_rgba(234,179,8,0.2)]">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-yellow-300 uppercase">35%+ AVERAGE CTR</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Hyper-contrast blinking animations and interactive elements that capture raw user focus.
              </p>
            </div>

            <div className="bg-[#0c0c0e] p-4 rounded-xl border border-cyan-500/30 hover:border-cyan-500/60 transition-colors shadow-lg">
              <div className="w-10 h-10 mx-auto rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-2 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <Send className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-cyan-300 uppercase">NO AUTH / DIRECT TG</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Zero signups or email hurdles. Traffic flows directly into your Telegram bots and channels.
              </p>
            </div>

            <div className="bg-[#0c0c0e] p-4 rounded-xl border border-green-500/30 hover:border-green-500/60 transition-colors shadow-lg">
              <div className="w-10 h-10 mx-auto rounded-full bg-green-500/10 border border-green-400/30 text-green-400 flex items-center justify-center mb-2 shadow-[0_0_12px_rgba(34,197,94,0.2)]">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-green-300 uppercase">INSTANT ACTIVATION</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Book your placement with USDT, TON, or BTC and your campaign goes live immediately.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Quick Action Telegram & WhatsApp Bubble + Group Link */}
      <div className="fixed bottom-20 right-3 sm:right-6 z-40 flex flex-col items-end gap-2">
        <a
          id="floating-tg-group-link"
          href="https://t.me/+7Ish7gfkoxw3NjM8"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (soundEnabled) soundManager.playCoin();
          }}
          className="px-3.5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full border-2 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.8)] flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 text-xs font-black cursor-pointer"
          title="Join Telegram Group: https://t.me/+7Ish7gfkoxw3NjM8"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Users className="w-3.5 h-3.5 text-yellow-300" />
          </div>
          <span className="text-yellow-300 uppercase tracking-tight">JOIN TELEGRAM GROUP</span>
        </a>

        <button
          id="floating-tg-bubble-btn"
          onClick={() => handleOpenTelegram('Hi AdKings Support, I want to rent ad banner spots or claim VIP bonuses!')}
          className="p-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white rounded-full border-2 border-yellow-300 shadow-[0_0_30px_rgba(6,182,212,0.8)] flex items-center gap-2 pulse-cta transition-transform hover:scale-105 active:scale-95"
          title="Contact Telegram & WhatsApp Support"
        >
          <div className="flex items-center -space-x-1">
            <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center border border-white">
              <Send className="w-3.5 h-3.5 fill-white" />
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center border border-white">
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
            </div>
          </div>
          <span className="font-black text-xs hidden sm:inline text-yellow-300 uppercase tracking-tight pr-1">
            24/7 Telegram & WhatsApp Support
          </span>
        </button>
      </div>

      {/* Flash Promo Sticky Bottom Bar */}
      <StickyBottomBanner
        onOpenTelegram={handleOpenTelegram}
        incrementClicks={incrementClicks}
      />

      {/* Direct Telegram Booking / Claiming Modal */}
      <TelegramModal
        isOpen={isTelegramOpen}
        onClose={() => setIsTelegramOpen(false)}
        initialMessage={telegramInitialMsg}
      />

      {/* User Registration & VIP Sign In Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />

      {/* User Deposit / Reload Balance Request Modal */}
      <UserReloadModal
        isOpen={isUserReloadOpen}
        onClose={() => setIsUserReloadOpen(false)}
        currentUser={currentUser}
        soundEnabled={soundEnabled}
        onReloadRequested={() => {
          if (currentUser?.email) {
            syncUserFromDb(currentUser.email);
          }
        }}
      />

      {/* User Profile Edit Modal (Username, Email, Phone) */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updatedUser) => {
          setCurrentUser(updatedUser);
          try {
            localStorage.setItem('adkings_user', JSON.stringify(updatedUser));
          } catch (e) {
            console.error('Failed to persist updated user:', e);
          }
        }}
      />

      {/* Financial Admin Portal for Balance Reloads and Game Auditing (Admins Only) */}
      {currentUser?.role === 'admin' && (
        <AdminPortalModal
          isOpen={isAdminPortalOpen}
          onClose={() => setIsAdminPortalOpen(false)}
          currentUser={currentUser}
          onBalanceUpdated={(updatedUser) => {
            if (currentUser && (currentUser.email === updatedUser.email || currentUser.id === updatedUser.id)) {
              setCurrentUser(updatedUser);
              try {
                localStorage.setItem('adkings_user', JSON.stringify(updatedUser));
              } catch (e) {
                console.error(e);
              }
            }
          }}
        />
      )}
    </div>
  );
}

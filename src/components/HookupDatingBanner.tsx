import React, { useState, useEffect, useCallback } from 'react';
import { 
  Flame, 
  Heart, 
  MapPin, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Zap, 
  Clock, 
  Eye, 
  Compass, 
  Sliders, 
  Filter, 
  UserCheck, 
  MessageCircle, 
  ShieldCheck, 
  Radio, 
  ChevronRight, 
  Users, 
  ArrowRight,
  Sparkle,
  X,
  Check,
  RefreshCw,
  Dices
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { HookupProfile, HOOKUP_PROFILES } from '../data/hookupProfiles';
import { fetchRandomUserHookupProfiles } from '../utils/randomUserService';

interface HookupDatingBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

export const HookupDatingBanner: React.FC<HookupDatingBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
}) => {
  const [profiles, setProfiles] = useState<HookupProfile[]>(HOOKUP_PROFILES);
  const [selectedProfile, setSelectedProfile] = useState<HookupProfile>(HOOKUP_PROFILES[0]);
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male' | 'couple'>('all');
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [matchedNotification, setMatchedNotification] = useState<boolean>(false);
  const [likedList, setLikedList] = useState<string[]>([]);
  const [nearbyActiveCount, setNearbyActiveCount] = useState<number>(1384);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);

  // Load random users from Random User API
  const loadRandomProfiles = useCallback(async (gender: 'all' | 'female' | 'male' | 'couple' = 'all') => {
    setIsLoadingApi(true);
    try {
      const liveProfiles = await fetchRandomUserHookupProfiles(16, gender);
      if (liveProfiles && liveProfiles.length > 0) {
        setProfiles(liveProfiles);
        setSelectedProfile(liveProfiles[0]);
        setActivePhotoIdx(0);
      }
    } catch (err) {
      console.warn('Failed fetching random profiles:', err);
    } finally {
      setIsLoadingApi(false);
    }
  }, []);

  // Initial load from Random User API
  useEffect(() => {
    loadRandomProfiles('all');
  }, [loadRandomProfiles]);

  // Periodic active counter bump
  useEffect(() => {
    const timer = setInterval(() => {
      setNearbyActiveCount((prev) => prev + Math.floor(Math.random() * 4) + 1);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  // Filter profiles based on selected distance and gender
  const filteredProfiles = profiles.filter((p) => {
    if (genderFilter !== 'all' && p.gender !== genderFilter) return false;
    if (p.distanceKm > maxDistance) return false;
    return true;
  });

  const handleSelectProfile = (p: HookupProfile) => {
    setSelectedProfile(p);
    setActivePhotoIdx(0);
    soundManager.playSpinTick();
  };

  const handleGenderChange = (newGender: 'all' | 'female' | 'male' | 'couple') => {
    setGenderFilter(newGender);
    soundManager.playSpinTick();
    loadRandomProfiles(newGender);
  };

  const handleRefreshRandomUsers = () => {
    incrementClicks();
    soundManager.playWinFanfare();
    loadRandomProfiles(genderFilter);
  };

  const handleLikeFlame = (p: HookupProfile) => {
    incrementClicks();
    soundManager.playWinFanfare();
    setLikedList((prev) => [...prev, p.id]);
    setMatchedNotification(true);
    setTimeout(() => setMatchedNotification(false), 3500);
  };

  const handleConnectTelegram = (profile: HookupProfile) => {
    incrementClicks();
    soundManager.playCoin();
    const msg = `🔥 *HOOKUP & CASUAL DATING MATCH REQUEST* 🔥\n\n` +
      `👤 *Profile Name:* ${profile.name} (${profile.age} Yrs)\n` +
      `📍 *Location:* ${profile.city}, ${profile.country} (~${profile.distanceKm} km away)\n` +
      `💋 *Intent:* ${profile.intent}\n` +
      `⚡ *Availability:* ${profile.availability}\n` +
      `🛡️ *Status:* 100% Discreet & Verified\n\n` +
      `_Hi VIP Match Concierge, please unlock direct chat & hookup rendezvous details with ${profile.name}!_`;
    onOpenTelegram(msg);
  };

  return (
    <section 
      id="hookup-dating-banner"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#18080f] via-[#0e0409] to-[#080205] border-2 border-rose-500/70 shadow-[0_15px_50px_rgba(244,63,94,0.3)] text-white p-4 sm:p-6 lg:p-8"
    >
      {/* Ambient Neon Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Match Alert Floating Notification */}
      {matchedNotification && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white px-5 py-2.5 rounded-full shadow-[0_0_25px_rgba(244,63,94,0.8)] border border-rose-200 flex items-center gap-2 animate-bounce">
          <Flame className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
          <span className="text-xs sm:text-sm font-black tracking-wide uppercase">
            It's a Match with {selectedProfile.name}! VIP Direct Chat Unlocked
          </span>
        </div>
      )}

      {/* Top Header Badge & Live Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-rose-900/60 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/60 text-rose-300 text-xs font-black uppercase tracking-wider shadow-sm">
              <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
              100% PRIVATE HOOKUP & CASUAL DATING
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[11px] font-extrabold uppercase">
              <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
              {nearbyActiveCount.toLocaleString()} SINGLES ONLINE NEARBY
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[11px] font-extrabold uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              NO STRINGS ATTACHED
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2 flex-wrap">
            <span className="bg-gradient-to-r from-rose-300 via-pink-200 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Discreet Hookups, Casual Encounters & Late-Night Dates
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-3xl leading-relaxed">
            Connect with verified local singles, open couples, and travelers ready for <strong>spontaneous tonight hookups, dinner dates, hotel rendezvous, and secret casual companionship</strong>.
          </p>
        </div>

        {/* Action Header Button & Random Generator Trigger */}
        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-2">
          <button
            id="hookup-refresh-random-btn"
            onClick={handleRefreshRandomUsers}
            disabled={isLoadingApi}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-yellow-300 border border-yellow-400/40 hover:border-yellow-300 font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            title="Discover new verified singles nearby"
          >
            <Dices className={`w-4 h-4 text-yellow-400 ${isLoadingApi ? 'animate-spin' : ''}`} />
            <span>{isLoadingApi ? 'Discovering Singles...' : '🎲 Shuffle Singles'}</span>
          </button>

          <button
            id="hookup-match-top-btn"
            onClick={() => handleConnectTelegram(selectedProfile)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-black text-xs sm:text-sm tracking-wide uppercase shadow-[0_0_20px_rgba(244,63,94,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span>FIND CASUAL MATCH NOW</span>
          </button>
        </div>
      </div>

      {/* Filter Bar: Gender & Max Distance */}
      <div className="mt-4 p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        {/* Gender Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-black text-zinc-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-rose-400" />
            Looking For:
          </span>
          {[
            { id: 'all', label: '🔥 All Matches' },
            { id: 'female', label: '👠 Women' },
            { id: 'male', label: '🎩 Men' },
            { id: 'couple', label: '🥂 Couples' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleGenderChange(btn.id as any)}
              disabled={isLoadingApi}
              className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-tight transition-all border ${
                genderFilter === btn.id
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white border-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Distance Range Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Max Distance:</span>
            <select
              value={maxDistance}
              onChange={(e) => {
                setMaxDistance(Number(e.target.value));
                soundManager.playSpinTick();
              }}
              aria-label="Max Distance"
              className="bg-zinc-900 text-yellow-300 font-black px-2 py-1 rounded-lg border border-zinc-700 text-xs focus:outline-none focus:border-rose-400 cursor-pointer"
            >
              <option value={2}>Within 2 km (Walking)</option>
              <option value={5}>Within 5 km (City Center)</option>
              <option value={10}>Within 10 km (Metro Area)</option>
              <option value={25}>Within 25 km (Greater Area)</option>
              <option value={100}>Any Distance (Worldwide)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Spotlight & Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        
        {/* Left Column: Interactive Spotlight Profile Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-rose-500/80 shadow-[0_10px_35px_rgba(244,63,94,0.3)]">
            
            {/* Main Photo Banner with Badges */}
            <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-black">
              <img
                src={selectedProfile.gallery[activePhotoIdx] || selectedProfile.photo}
                alt={selectedProfile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>

              {/* Badges on top of photo */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                <span className="bg-rose-600/90 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-rose-300 shadow-md flex items-center gap-1">
                  <Flame className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                  {selectedProfile.availability}
                </span>
                <span className="bg-black/70 backdrop-blur-md text-emerald-400 text-[10px] font-black px-2 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  {selectedProfile.onlineStatus}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span className="bg-amber-500/90 text-black font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-200 shadow-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                  VERIFIED SELFIE
                </span>
              </div>

              {/* Bottom Photo Title Info */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      {selectedProfile.name}, {selectedProfile.age}
                    </h3>
                    <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-300 font-bold mt-0.5">
                    <span className="flex items-center gap-1 text-amber-300">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedProfile.city}
                    </span>
                    <span>•</span>
                    <span className="text-rose-300 font-mono">~{selectedProfile.distanceKm} km away</span>
                  </div>
                </div>

                {/* Like / Flame Button */}
                <button
                  type="button"
                  onClick={() => handleLikeFlame(selectedProfile)}
                  className={`p-3 rounded-full shadow-lg border transition-all flex items-center justify-center ${
                    likedList.includes(selectedProfile.id)
                      ? 'bg-rose-500 text-white border-rose-300 scale-110 shadow-[0_0_20px_rgba(244,63,94,0.8)]'
                      : 'bg-black/80 hover:bg-rose-600 text-rose-400 hover:text-white border-rose-500/60 hover:scale-105'
                  }`}
                  title="Send Flame / Instant Like"
                >
                  <Flame className="w-6 h-6 fill-current" />
                </button>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {selectedProfile.gallery && selectedProfile.gallery.length > 1 && (
              <div className="p-3 bg-zinc-950 border-b border-zinc-800 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-black text-zinc-400 uppercase mr-1">Photos:</span>
                {selectedProfile.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActivePhotoIdx(idx);
                      soundManager.playSpinTick();
                    }}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activePhotoIdx === idx ? 'border-rose-400 scale-105' : 'border-zinc-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Profile Bio & Details */}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-3">
                <div className="text-[11px] font-black text-rose-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>Looking For:</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                  "{selectedProfile.intent}"
                </p>
              </div>

              <div>
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">About Me & Meetup Preference</div>
                <p className="text-xs text-zinc-300 leading-relaxed">{selectedProfile.bio}</p>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {selectedProfile.interests.map((interest, idx) => (
                  <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                    #{interest}
                  </span>
                ))}
              </div>

              {/* Connect Action Trigger */}
              <div className="pt-3 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleLikeFlame(selectedProfile)}
                  className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-rose-300 hover:text-white font-black text-xs uppercase tracking-wider border border-zinc-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4 fill-rose-400 text-rose-400" />
                  <span>{likedList.includes(selectedProfile.id) ? 'Liked! Send Match Message' : 'Send Instant Like'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleConnectTelegram(selectedProfile)}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(244,63,94,0.6)] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-white fill-white" />
                  <span>CHAT WITH {selectedProfile.name.split(' ')[0].toUpperCase()}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Grid of Nearby Hookup Profiles (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-rose-400 animate-spin" />
                <h4 className="text-xs font-black uppercase text-white tracking-wide">
                  Active Nearby Hookup Radar ({filteredProfiles.length})
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefreshRandomUsers}
                  disabled={isLoadingApi}
                  className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  title="Shuffle singles nearby"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingApi ? 'animate-spin text-amber-400' : ''}`} />
                </button>
                <span className="text-[10px] text-amber-400 font-bold font-mono">100% DISCREET</span>
              </div>
            </div>

            {/* List of Other Profiles */}
            <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
              {filteredProfiles.map((p) => {
                const isSelected = selectedProfile.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProfile(p)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-950 via-zinc-900 to-pink-950 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                        : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-700">
                        <img src={p.photo} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black"></span>
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-white">{p.name}, {p.age}</span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-rose-950 text-rose-300 font-bold border border-rose-700/50">{p.availability}</span>
                        </div>
                        <div className="text-[10px] text-amber-300 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{p.city} • ~{p.distanceKm} km</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 truncate mt-0.5">{p.intent}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnectTelegram(p);
                      }}
                      className="shrink-0 p-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md"
                      title="Direct Chat via Telegram"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick VIP Pass Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950 via-zinc-950 to-pink-950 border border-rose-500/50 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-black text-white uppercase">VIP Hookup Concierge</span>
              </div>
              <span className="text-[9px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full">INSTANT MATCH</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed mb-3">
              Want a guaranteed tonight hookup or private hotel rendezvous in your exact city? Our VIP Concierge bot matches you with verified local singles in under 3 minutes.
            </p>
            <button
              id="vip-hookup-concierge-btn"
              onClick={() => handleConnectTelegram(selectedProfile)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>REQUEST VIP MATCHMAKER ON TELEGRAM</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

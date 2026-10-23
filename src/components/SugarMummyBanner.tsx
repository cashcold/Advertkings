import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Crown, 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  Send, 
  MapPin, 
  CheckCircle2, 
  Flame, 
  ArrowRight,
  Filter,
  Star,
  Clock,
  Gem,
  Award,
  Users,
  Phone,
  Mail,
  Gift,
  Camera,
  Globe,
  RefreshCw,
  Bookmark,
  Calendar,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  X,
  FileText,
  UserCheck,
  Check,
  MessageCircle
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { DatingProfile, SEED_PROFILES, generateRandomDatingProfiles } from '../data/sugarDatingProfiles';

interface SugarMummyBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

export const SugarMummyBanner: React.FC<SugarMummyBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
}) => {
  // Profiles state
  const [profiles, setProfiles] = useState<DatingProfile[]>(SEED_PROFILES);
  const [selectedProfile, setSelectedProfile] = useState<DatingProfile>(SEED_PROFILES[0]);
  
  // Refs
  const spotlightRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef<boolean>(false);

  // Filters
  const [genderFilter, setGenderFilter] = useState<'all' | 'woman' | 'man'>('all');
  const [regionFilter, setRegionFilter] = useState<'all' | 'Africa' | 'Europe' | 'Americas' | 'Middle East & Asia'>('all');
  const [minAge, setMinAge] = useState<number>(37);
  const [maxAge, setMaxAge] = useState<number>(78);
  
  // UI states
  const [hotList, setHotList] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [flowerSent, setFlowerSent] = useState<boolean>(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [totalDatabaseCount, setTotalDatabaseCount] = useState<number>(248190);
  const [highlightPulse, setHighlightPulse] = useState<boolean>(false);
  const [quickViewModal, setQuickViewModal] = useState<DatingProfile | null>(null);

  // Profile Submission for Match Meeting Modal & Form State
  const [showSubmitProfileModal, setShowSubmitProfileModal] = useState<boolean>(false);
  const [submitSuccessId, setSubmitSuccessId] = useState<string | null>(null);
  const [candidateForm, setCandidateForm] = useState({
    fullName: '',
    age: '26',
    gender: 'Male',
    seeking: 'Wealthy Sugar Mummy (Ages 37-78)',
    location: '',
    contactPlatform: 'Telegram',
    contactHandle: '',
    meetingPreference: 'In-Person VIP Dinner & Date',
    preferredAllowance: '$10,000 - $25,000 / month',
    aboutPitch: '',
  });

  // 5-Second Live Image Rotation & Auto-Refresh Engine
  const [autoRotateEnabled, setAutoRotateEnabled] = useState<boolean>(true);
  const [rotateProgress, setRotateProgress] = useState<number>(0);

  // Increment total counter periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalDatabaseCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  // 5-Second Auto Image & Profile Rotation timer
  useEffect(() => {
    if (!autoRotateEnabled) return;

    const interval = 100; // 100ms tick for smooth progress bar
    const fullDuration = 5000; // 5000ms = 5 seconds

    const timer = setInterval(() => {
      if (isHoveredRef.current) return; // Pause on hover so user can read smoothly

      setRotateProgress((prev) => {
        const next = prev + (interval / fullDuration) * 100;
        if (next >= 100) {
          // Trigger 5-second image rotation
          setActivePhotoIdx((prevIdx) => {
            const galleryLen = selectedProfile.gallery?.length || 1;
            return (prevIdx + 1) % galleryLen;
          });
          return 0;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoRotateEnabled, selectedProfile]);

  // Filtered profiles
  const filteredProfiles = profiles.filter((p) => {
    if (genderFilter !== 'all' && p.type !== genderFilter) return false;
    if (regionFilter !== 'all' && p.region !== regionFilter) return false;
    if (p.age < minAge || p.age > maxAge) return false;
    return true;
  });

  const handleSelectProfile = (profile: DatingProfile, shouldScroll: boolean = true) => {
    setSelectedProfile(profile);
    setActivePhotoIdx(0);
    setRotateProgress(0);
    setHighlightPulse(true);
    setTimeout(() => setHighlightPulse(false), 1200);
    soundManager.playSpinTick();

    // Smoothly scroll the page to bring the main detailed profile card into full view
    if (shouldScroll && spotlightRef.current) {
      const element = spotlightRef.current;
      const yOffset = -80; // offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleGenerateMore = () => {
    setIsGenerating(true);
    soundManager.playSpinTick();

    setTimeout(() => {
      const more = generateRandomDatingProfiles(
        6, 
        genderFilter === 'all' ? undefined : genderFilter,
        regionFilter === 'all' ? undefined : regionFilter
      );
      setProfiles((prev) => [...more, ...prev]);
      if (more.length > 0) {
        handleSelectProfile(more[0], true);
      }
      setIsGenerating(false);
      soundManager.playCoin();
    }, 600);
  };

  const toggleHotList = (id: string) => {
    soundManager.playSpinTick();
    setHotList((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConnectTelegram = (actionName: string, profile: DatingProfile) => {
    incrementClicks();
    soundManager.playCoin();

    const isWoman = profile.type === 'woman';
    const sponsorTitle = isWoman ? '👑 WEALTHY SUGAR MUMMY (AGE 37-78)' : '💎 WEALTHY SUGAR DADDY (AGE 37-78)';
    
    const msg = 
      `💍 VIP MATCHMAKER & MARRIAGE CONNECTION REQUEST:\n` +
      `• Action: ${actionName}\n` +
      `• Category: ${sponsorTitle}\n` +
      `• Profile ID: #${profile.id}\n` +
      `• Name: ${profile.name} (Age: ${profile.age} Yrs)\n` +
      `• Origin: ${profile.originCity}, ${profile.originCountry}\n` +
      `• Current Location: ${profile.currentLocation}\n` +
      `• Zodiac: ${profile.zodiac}\n` +
      `• Occupation: ${profile.jobTitle} (${profile.company})\n` +
      `• Verified Net Worth: ${profile.netWorth}\n` +
      `• Monthly Allowance: ${profile.monthlyAllowance}\n` +
      `• Height/Weight: ${profile.height} | ${profile.weight}\n` +
      `• Marital Status: ${profile.maritalStatus} (Children: ${profile.children})\n` +
      `• Looking For: ${profile.lookingFor}\n` +
      `Please connect me directly with ${profile.name} (ID: ${profile.id}) on Telegram VIP Private Matchmaking!`;

    onOpenTelegram(msg);
  };

  const handleSendFlowers = (profile: DatingProfile) => {
    setFlowerSent(true);
    setTimeout(() => setFlowerSent(false), 4000);
    handleConnectTelegram('🌹 SEND VIRTUAL FLOWERS & GIFT BASKET', profile);
  };

  const handleOpenProfileSubmission = () => {
    incrementClicks();
    soundManager.playSpinTick();
    setSubmitSuccessId(null);
    setShowSubmitProfileModal(true);
  };

  const handleCandidateFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    incrementClicks();
    soundManager.playWinFanfare();

    const matchRefId = `MATCH-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmitSuccessId(matchRefId);

    // Format telegram message payload
    const msg = 
      `📝 NEW VIP MATCH MEETING PROFILE SUBMISSION (${matchRefId})\n\n` +
      `• Candidate Name: ${candidateForm.fullName || 'Anonymous Candidate'}\n` +
      `• Age & Gender: ${candidateForm.age} yrs • ${candidateForm.gender}\n` +
      `• Seeking: ${candidateForm.seeking}\n` +
      `• Preferred Target Sponsor: ${selectedProfile.name} (ID: #${selectedProfile.id}, Age ${selectedProfile.age})\n` +
      `• Location: ${candidateForm.location || 'Global/Worldwide'}\n` +
      `• Contact (${candidateForm.contactPlatform}): ${candidateForm.contactHandle || 'Provided via Direct Chat'}\n` +
      `• Preferred Meeting Type: ${candidateForm.meetingPreference}\n` +
      `• Expected Allowance Range: ${candidateForm.preferredAllowance}\n` +
      `• About / Pitch: ${candidateForm.aboutPitch || 'Ready for verified match meeting'}\n\n` +
      `Please schedule an introduction match meeting with our certified matchmaker team!`;

    setTimeout(() => {
      onOpenTelegram(msg);
    }, 1200);
  };

  const isCurrentInHotList = hotList.includes(selectedProfile.id);
  const isWoman = selectedProfile.type === 'woman';
  const currentPhoto = selectedProfile.gallery && selectedProfile.gallery[activePhotoIdx]
    ? selectedProfile.gallery[activePhotoIdx]
    : selectedProfile.photo;

  return (
    <div
      id="sugar-mummy-match-banner"
      className="relative rounded-3xl overflow-hidden border-2 border-rose-500/60 bg-gradient-to-br from-[#14030d] via-[#0d0615] to-[#06020c] p-4 sm:p-6 shadow-[0_0_40px_rgba(244,63,94,0.35)] transition-all duration-300"
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Banner Global Announcement */}
      <div className="relative pb-4 mb-4 border-b border-rose-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-[10px] sm:text-xs px-3 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-white text-white" />
                INTERNATIONAL ELITE MATCHMAKING (AGES 37–78)
              </span>
              <span className="bg-amber-400 text-black font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 shadow">
                <Crown className="w-3.5 h-3.5 fill-black" />
                WEALTHY SUGAR MUMMIES & DADDIES
              </span>
              <span className="bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                {totalDatabaseCount.toLocaleString()} VERIFIED CANDIDATES (AFRICA • EUROPE • GLOBAL)
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-rose-200 via-pink-100 to-amber-200 bg-clip-text text-transparent">
                Financially Established Women & Men (Ages 37–78) Seeking Marriage
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 font-medium max-w-4xl">
              Authentic verified international singles from <strong>Africa (Nigeria, Ghana, South Africa, Kenya, Ivory Coast)</strong>, <strong>Europe (Ukraine, France, UK, Switzerland)</strong>, and <strong>Americas</strong>. Ready for serious holy matrimony, luxury companionship, and $15,000–$60,000/mo sponsorship.
            </p>
          </div>

          {/* Quick Action Consultation */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleConnectTelegram('CONSULT MATCHMAKER TEAM', selectedProfile)}
              className="px-4 py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:from-rose-400 hover:to-amber-300 text-black font-black text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.6)] flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-black fill-black" />
              <span>TALK TO MATCHMAKER TEAM</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Global Filter Bar: Gender, Region, Age 37-78, & Generator */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 bg-black/50 p-3 rounded-2xl border border-rose-500/20">
          
          {/* Gender Filter */}
          <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => {
                setGenderFilter('all');
                soundManager.playSpinTick();
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                genderFilter === 'all'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🔥 All Profiles ({profiles.length})
            </button>
            <button
              onClick={() => {
                setGenderFilter('woman');
                soundManager.playSpinTick();
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                genderFilter === 'woman'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-black shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              👑 Sugar Mummies (37–78 Yrs)
            </button>
            <button
              onClick={() => {
                setGenderFilter('man');
                soundManager.playSpinTick();
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                genderFilter === 'man'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              💎 Sugar Daddies (37–78 Yrs)
            </button>
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 mr-1">
              <Globe className="w-3.5 h-3.5 text-rose-400" /> Region:
            </span>
            {(['all', 'Africa', 'Europe', 'Americas'] as const).map((reg) => (
              <button
                key={reg}
                onClick={() => {
                  setRegionFilter(reg);
                  soundManager.playSpinTick();
                }}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  regionFilter === reg
                    ? 'bg-amber-400 text-black font-black shadow'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {reg === 'all' ? '🌍 All Countries' : reg === 'Africa' ? '🌍 Africa (NG, GH, ZA, KE)' : reg === 'Europe' ? '🏰 Europe (UA, FR, UK)' : '🌎 Americas'}
              </button>
            ))}
          </div>

          {/* Procedural AI Generator Button (Simulate Millions of Profiles API) */}
          <button
            onClick={handleGenerateMore}
            disabled={isGenerating}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl border border-emerald-400/40 shadow flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'GENERATING PROFILES...' : '⚡ GENERATE 1,000,000+ NEW PROFILES'}</span>
          </button>
        </div>
      </div>

      {/* Main LoveMe Dating Card Layout (Screenshot Authentic Replicant) */}
      <div 
        ref={spotlightRef}
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
        className={`bg-[#f0f6fa] dark:bg-[#0c131c] text-zinc-900 dark:text-zinc-100 rounded-2xl border border-sky-300 dark:border-sky-900/60 p-4 sm:p-6 shadow-2xl transition-all duration-500 ${
          highlightPulse ? 'ring-4 ring-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.7)] scale-[1.01]' : ''
        }`}
      >
        
        {/* Main 2-Column Desktop Grid: Left Portrait & Details + Right VIP Actions & Singles Tours */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Col Left: Photo & Detailed Bio Profile Sheet (8 cols) */}
          <div className="lg:col-span-8 flex flex-col md:flex-row gap-5">
            
            {/* Left Photo Showcase Column */}
            <div className="w-full md:w-5/12 flex flex-col items-center shrink-0">
              <div className="relative w-full rounded-2xl overflow-hidden border-2 border-sky-400/60 shadow-lg group bg-black">
                <img
                  src={currentPhoto}
                  alt={selectedProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover object-top transition-all duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to stylized high quality portrait
                    (e.target as HTMLImageElement).src = isWoman
                      ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
                      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {/* VIP Ribbon Watermark */}
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-yellow-400/60 text-yellow-300 text-[10px] font-black uppercase flex items-center gap-1 shadow">
                  <Crown className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {selectedProfile.vipTier}
                </div>

                {/* Quick Popout Expand Button */}
                <button
                  onClick={() => setQuickViewModal(selectedProfile)}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-lg border border-white/30 backdrop-blur-sm shadow hover:scale-110 active:scale-95 transition-all"
                  title="Expand Full Popout View"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Age & ID Badge */}
                <div className="absolute bottom-2 left-2 bg-gradient-to-r from-rose-600/90 to-pink-600/90 text-white text-[11px] font-black px-2.5 py-1 rounded-lg backdrop-blur-sm shadow">
                  ID: #{selectedProfile.id} • AGE {selectedProfile.age} YRS
                </div>

                {/* Online Indicator */}
                {selectedProfile.onlineNow && (
                  <div className="absolute bottom-2 right-2 bg-emerald-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span> ONLINE NOW
                  </div>
                )}
              </div>

              {/* 5-Second Image Auto-Rotation Engine Bar & Thumbnail Strip */}
              <div className="w-full mt-2.5 p-2 rounded-xl bg-sky-950/20 dark:bg-black/40 border border-sky-300/40 dark:border-sky-800/50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-sky-700 dark:text-sky-300">
                    <Clock className="w-3 h-3 text-rose-500" />
                    <span>Auto-Rotating Photos (5s)</span>
                  </span>
                  <button
                    onClick={() => setAutoRotateEnabled(!autoRotateEnabled)}
                    className="flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded bg-sky-100 dark:bg-zinc-800 hover:bg-sky-200 dark:hover:bg-zinc-700 text-sky-900 dark:text-sky-200 transition-colors"
                  >
                    {autoRotateEnabled ? (
                      <>
                        <Pause className="w-2.5 h-2.5 text-amber-500 fill-amber-500" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500" /> Auto-Play (5s)
                      </>
                    )}
                  </button>
                </div>

                {/* 5s Progress Bar */}
                {autoRotateEnabled && (
                  <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 transition-all duration-100 ease-linear"
                      style={{ width: `${rotateProgress}%` }}
                    />
                  </div>
                )}

                {/* Gallery Thumbnails */}
                {selectedProfile.gallery && selectedProfile.gallery.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
                    {selectedProfile.gallery.map((photoUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActivePhotoIdx(idx);
                          setRotateProgress(0);
                        }}
                        className={`relative w-9 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                          activePhotoIdx === idx 
                            ? 'border-rose-500 ring-2 ring-rose-500/50 scale-105' 
                            : 'border-zinc-300 dark:border-zinc-700 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={photoUrl} 
                          alt="thumbnail" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Net Worth & Allowance Highlight Under Photo */}
              <div className="w-full mt-2 p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 border border-amber-400/40 text-center">
                <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">
                  VERIFIED NET WORTH & MONTHLY ALLOWANCE
                </span>
                <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {selectedProfile.netWorth}
                </div>
                <div className="text-xs font-black text-rose-600 dark:text-yellow-300">
                  💰 {selectedProfile.monthlyAllowance}
                </div>
              </div>
            </div>

            {/* Middle Details Grid (Exact LoveMe Screenshot Data Fields) */}
            <div className="flex-1 space-y-3">
              {/* Header Info */}
              <div className="border-b border-sky-200 dark:border-zinc-800 pb-2">
                <div className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wide">
                  ID: #{selectedProfile.id}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                  {selectedProfile.name}
                </h2>
                <div className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-4 h-4 inline shrink-0" />
                  <span>{selectedProfile.originCity}, {selectedProfile.originCountry}</span>
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  <strong>Current Location:</strong> {selectedProfile.currentLocation}
                </div>
              </div>

              {/* Exact Attributes Table / Grid */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                <div>
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Age: </span>
                  <strong className="text-zinc-900 dark:text-white text-sm">{selectedProfile.age}</strong>
                </div>
                <div>
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Zodiac: </span>
                  <strong className="text-sky-600 dark:text-sky-400">{selectedProfile.zodiac}</strong>
                </div>

                <div>
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Weight: </span>
                  <span className="text-zinc-800 dark:text-zinc-200">{selectedProfile.weight}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Height: </span>
                  <span className="text-zinc-800 dark:text-zinc-200">{selectedProfile.height}</span>
                </div>

                <div>
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Eye Color: </span>
                  <span className="text-zinc-800 dark:text-zinc-200">{selectedProfile.eyeColor}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Hair Color: </span>
                  <span className="text-zinc-800 dark:text-zinc-200">{selectedProfile.hairColor}</span>
                </div>

                <div>
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Marital Status: </span>
                  <span className="text-zinc-800 dark:text-zinc-200">{selectedProfile.maritalStatus}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Children: </span>
                  <span className="text-zinc-800 dark:text-zinc-200">{selectedProfile.children}</span>
                </div>

                <div>
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Religion: </span>
                  <span className="text-zinc-800 dark:text-zinc-200">{selectedProfile.religion}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Smoker: </span>
                  <span className="text-zinc-800 dark:text-zinc-200">{selectedProfile.smoker}</span>
                  <span className="font-bold text-zinc-500 dark:text-zinc-400 ml-2">Drinker: </span>
                  <span className="text-zinc-800 dark:text-zinc-200">{selectedProfile.drinker}</span>
                </div>

                <div>
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Education: </span>
                  <span className="text-zinc-800 dark:text-zinc-200">{selectedProfile.education}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Company: </span>
                  <span className="text-zinc-800 dark:text-zinc-200">{selectedProfile.company}</span>
                </div>

                <div className="col-span-2">
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Job Title: </span>
                  <strong className="text-amber-700 dark:text-amber-300">{selectedProfile.jobTitle}</strong>
                </div>

                <div className="col-span-2">
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Hobbies: </span>
                  <span className="text-zinc-800 dark:text-zinc-200">{selectedProfile.hobbies}</span>
                </div>

                <div>
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">English: </span>
                  <span className="text-zinc-800 dark:text-zinc-200">{selectedProfile.english}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-500 dark:text-zinc-400">Languages: </span>
                  <span className="text-zinc-800 dark:text-zinc-200">{selectedProfile.languages}</span>
                </div>
              </div>

              {/* Self Description & Comments */}
              <div className="pt-2 border-t border-sky-200 dark:border-zinc-800 space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/90 border border-sky-200 dark:border-zinc-800 shadow-sm">
                  <span className="font-bold text-rose-600 dark:text-rose-400 block mb-0.5">
                    Self Description:
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                    "{selectedProfile.selfDescription}"
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/40">
                  <span className="font-bold text-sky-700 dark:text-sky-300 block mb-0.5">
                    Comments & Looking For:
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed font-medium">
                    {selectedProfile.comments}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Col Right: LoveMe Sidebar Buttons, Hot List & Upcoming Singles Tours (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            
            {/* Direct Action Buttons matching LoveMe.com UI */}
            <div className="space-y-2 bg-white dark:bg-zinc-900/90 p-4 rounded-2xl border border-sky-200 dark:border-zinc-800 shadow-sm">
              <button
                onClick={() => handleConnectTelegram('VIEW ADDITIONAL PHOTOS', selectedProfile)}
                className="w-full py-2.5 px-3 bg-[#0a4d68] hover:bg-[#083c52] text-white font-bold text-xs rounded-xl flex items-center justify-between shadow transition-all"
              >
                <span className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-sky-300" /> My Additional Photos ({selectedProfile.gallery.length + 4})
                </span>
                <ChevronRight className="w-4 h-4 text-sky-300" />
              </button>

              <button
                onClick={() => handleConnectTelegram(`WRITE DIRECT MESSAGE TO ${selectedProfile.name}`, selectedProfile)}
                className="w-full py-3 px-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-between shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-white" /> Write {selectedProfile.name.split(' ')[0]} Now!
                </span>
                <Send className="w-4 h-4 text-yellow-300" />
              </button>

              <button
                onClick={() => handleSendFlowers(selectedProfile)}
                className="w-full py-2.5 px-3 bg-[#0a4d68] hover:bg-[#083c52] text-white font-bold text-xs rounded-xl flex items-center justify-between shadow transition-all"
              >
                <span className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-rose-300" /> {flowerSent ? '🌹 Flowers Sent to VIP Escrow!' : 'Send Flowers & Gift Basket'}
                </span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>

              <button
                onClick={() => handleConnectTelegram(`CALL REQUEST FOR ${selectedProfile.name}`, selectedProfile)}
                className="w-full py-2.5 px-3 bg-[#0a4d68] hover:bg-[#083c52] text-white font-bold text-xs rounded-xl flex items-center justify-between shadow transition-all"
              >
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-300" /> Direct VIP Video Call Now!
                </span>
                <ChevronRight className="w-4 h-4 text-sky-300" />
              </button>

              {/* Add to Hot List & Attract Buttons */}
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                <button
                  onClick={() => toggleHotList(selectedProfile.id)}
                  className={`w-full py-2.5 px-3 text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all ${
                    isCurrentInHotList
                      ? 'bg-rose-950 text-rose-300 border border-rose-500'
                      : 'bg-rose-800 hover:bg-rose-700 text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isCurrentInHotList ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span>{isCurrentInHotList ? '✓ Profile Added to Hot List' : `Add ${selectedProfile.name.split(' ')[0]} to Hot List`}</span>
                </button>

                <button
                  onClick={() => handleConnectTelegram('ATTRACT HER NATURALLY VIP GUIDE', selectedProfile)}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs rounded-xl shadow flex items-center justify-center gap-1.5"
                >
                  <Star className="w-4 h-4 fill-black text-black" />
                  <span>Attract {isWoman ? 'Her' : 'Him'} Naturally VIP Coaching</span>
                </button>
              </div>
            </div>

            {/* Upcoming Singles Tours 2026 Box (Africa, Euro, Asian, Latin) */}
            <div className="bg-gradient-to-b from-[#111f30] to-[#0a1420] text-white p-3.5 rounded-2xl border border-sky-500/40 space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Upcoming Singles Tours 2026
                </span>
                <span className="text-[10px] font-mono text-emerald-400">RSVP OPEN</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
                <div className="p-2 rounded-lg bg-black/50 border border-rose-500/30">
                  <span className="text-rose-400 font-bold block">🌍 African VIP Tour</span>
                  <span className="text-white">Oct 12: Lagos / Accra</span>
                  <span className="text-zinc-400 block text-[9px]">Nov 05: Nairobi / Cape Town</span>
                </div>
                <div className="p-2 rounded-lg bg-black/50 border border-sky-500/30">
                  <span className="text-sky-400 font-bold block">🏰 Euro VIP Tour</span>
                  <span className="text-white">Oct 16: Paris / Kiev</span>
                  <span className="text-zinc-400 block text-[9px]">Nov 20: Zurich / London</span>
                </div>
              </div>

              <button
                onClick={() => handleConnectTelegram('RESERVE SINGLES TOUR SEAT', selectedProfile)}
                className="w-full py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1"
              >
                <span>Book In-Person VIP Match Meeting</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>

        {/* Interested in Meeting Her/Him? Submit Profile for Match Meeting & Matchmaker Consultation */}
        <div className="mt-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#210515] via-[#16081e] to-[#0d0f21] border-2 border-rose-500/70 shadow-[0_0_35px_rgba(244,63,94,0.3)] flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-600 border-2 border-yellow-400/80 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-950/60">
              <UserCheck className="w-7 h-7 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-[10px] font-black uppercase tracking-wide">
                  VIP MATCH MEETING REQUEST
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase">
                  ⚡ 24/7 ACTIVE DESK
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Interested in Meeting {isWoman ? 'Her' : 'Him'}? Want to Submit Your Profile for a Match Meeting?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed max-w-3xl">
                Online communication is only the beginning. If you are genuinely interested in <strong>{selectedProfile.name}</strong> or want help meeting wealthy sponsors (ages 37–78) in Africa, Europe, or America, you can <strong>submit your candidate profile</strong> to schedule an in-person VIP dinner, private video call, or singles tour meeting.
              </p>
            </div>
          </div>

          {/* Action Buttons: Submit Profile vs Direct Chat */}
          <div className="flex flex-col sm:flex-row xl:flex-col gap-2.5 shrink-0 justify-center">
            <button
              id="submit-profile-match-meeting-btn"
              onClick={handleOpenProfileSubmission}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-rose-500 hover:from-yellow-300 hover:to-rose-400 text-black font-black text-xs sm:text-sm rounded-xl shadow-[0_0_25px_rgba(251,191,36,0.6)] flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <FileText className="w-4 h-4 text-black" />
              <span>📝 Yes! Submit Profile for Match Meeting</span>
            </button>

            <button
              id="talk-matchmaker-free-btn"
              onClick={() => handleConnectTelegram('FREE NO-PRESSURE CONSULTATION', selectedProfile)}
              className="px-5 py-2.5 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-rose-500/40 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>Talk to Matchmaker (Free Consultation)</span>
            </button>
          </div>
        </div>

        {/* Similar Profiles Grid Gallery (Screenshot 2 & 4 Replicant) */}
        <div className="mt-6 pt-5 border-t border-sky-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              Similar Sponsor Profiles ({filteredProfiles.length} Available in Database):
            </h4>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Showing Ages 37–78 Yrs
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredProfiles.slice(0, 12).map((p) => {
              const isCardSelected = selectedProfile.id === p.id;
              const cardIsWoman = p.type === 'woman';
              return (
                <div
                  key={p.id}
                  className={`group relative rounded-xl overflow-hidden text-left border transition-all duration-300 flex flex-col bg-white dark:bg-zinc-900/90 shadow ${
                    isCardSelected
                      ? 'border-rose-500 ring-2 ring-rose-500/50 scale-[1.02]'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-rose-400 hover:shadow-lg'
                  }`}
                >
                  {/* Clickable Image Container (Scrolls straight to top spotlight card) */}
                  <div 
                    onClick={() => handleSelectProfile(p, true)}
                    className="relative aspect-[4/5] w-full bg-black overflow-hidden cursor-pointer"
                    title="Click to view full spotlight & bio"
                  >
                    <img
                      src={p.photo}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = cardIsWoman
                          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
                          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute top-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-black text-yellow-300">
                      {p.age} YRS
                    </div>
                    <div className="absolute bottom-1 left-1 bg-rose-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      ID: #{p.id}
                    </div>

                    {/* Popout Overlay Button on Hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playSpinTick();
                        setQuickViewModal(p);
                      }}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 text-white text-[11px] font-black backdrop-blur-[2px] transition-all"
                    >
                      <Maximize2 className="w-4 h-4 text-amber-300" />
                      <span>Quick Popout</span>
                    </button>
                  </div>

                  <div className="p-2 flex-1 flex flex-col justify-between">
                    <div 
                      onClick={() => handleSelectProfile(p, true)}
                      className="cursor-pointer"
                    >
                      <h5 className="font-bold text-xs text-zinc-900 dark:text-white truncate hover:text-rose-500 transition-colors">
                        {p.name}
                      </h5>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                        📍 {p.originCountry}
                      </p>
                    </div>

                    <div className="mt-1 pt-1 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {p.monthlyAllowance.split(' - ')[0]}
                      </span>
                      <button
                        onClick={() => handleSelectProfile(p, true)}
                        className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded hover:opacity-80 transition-opacity ${
                          cardIsWoman ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300' : 'bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300'
                        }`}
                      >
                        VIEW BIO ↑
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Instant Quick Popout Modal in View */}
      {quickViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0c131c] text-zinc-900 dark:text-zinc-100 rounded-3xl border-2 border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.5)] overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-rose-950 via-pink-950 to-zinc-950 border-b border-rose-500/30 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="font-black text-sm uppercase tracking-wide">
                  VIP Verified Profile #{quickViewModal.id} • {quickViewModal.name} (Age {quickViewModal.age})
                </span>
              </div>
              <button
                onClick={() => setQuickViewModal(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2 aspect-[4/5] rounded-2xl overflow-hidden border-2 border-sky-400/50 relative bg-black shrink-0">
                  <img
                    src={quickViewModal.photo}
                    alt={quickViewModal.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-black text-amber-300">
                    {quickViewModal.vipTier}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
                    Net Worth: {quickViewModal.netWorth}
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-xs">
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                    {quickViewModal.name}
                  </h3>
                  <div className="text-rose-500 font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{quickViewModal.originCity}, {quickViewModal.originCountry}</span>
                  </div>
                  <div className="text-zinc-500 dark:text-zinc-400">
                    <strong>Current:</strong> {quickViewModal.currentLocation}
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-300 block">Monthly Sponsorship / Allowance</span>
                    <strong className="text-sm font-black text-emerald-600 dark:text-emerald-400">{quickViewModal.monthlyAllowance}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                    <div><strong>Zodiac:</strong> {quickViewModal.zodiac}</div>
                    <div><strong>Status:</strong> {quickViewModal.maritalStatus}</div>
                    <div><strong>Height/Weight:</strong> {quickViewModal.height}, {quickViewModal.weight}</div>
                    <div><strong>Children:</strong> {quickViewModal.children}</div>
                    <div className="col-span-2"><strong>Profession:</strong> {quickViewModal.jobTitle} ({quickViewModal.company})</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 text-xs italic text-zinc-700 dark:text-zinc-300">
                    "{quickViewModal.selfDescription}"
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  handleSelectProfile(quickViewModal, true);
                  setQuickViewModal(null);
                }}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <span>Focus in Main Sheet ↑</span>
              </button>

              <button
                onClick={() => {
                  handleConnectTelegram(`DIRECT MESSAGE TO ${quickViewModal.name}`, quickViewModal);
                  setQuickViewModal(null);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm rounded-xl shadow flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-yellow-300" />
                <span>Write {quickViewModal.name.split(' ')[0]} on Telegram</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VIP Match Meeting Candidate Profile Submission Modal */}
      {showSubmitProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-zinc-950 text-zinc-100 rounded-3xl border-2 border-yellow-400/80 shadow-[0_0_60px_rgba(251,191,36,0.4)] overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-yellow-950 via-rose-950 to-zinc-950 border-b border-yellow-400/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black flex items-center justify-center font-black shadow">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base sm:text-lg text-white">
                      Submit Profile for VIP Match Meeting
                    </h3>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                      100% Confidential
                    </span>
                  </div>
                  <p className="text-xs text-yellow-200/80">
                    Arranging match with <strong>{selectedProfile.name}</strong> (ID: #{selectedProfile.id}) or verified global sponsors
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSubmitProfileModal(false);
                  setSubmitSuccessId(null);
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Form or Success Screen */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {submitSuccessId ? (
                <div className="text-center py-6 space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    <Check className="w-9 h-9" />
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-xs font-black uppercase font-mono">
                      REF ID: #{submitSuccessId}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-white mt-2">
                      Candidate Profile Submitted Successfully!
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto mt-1 leading-relaxed">
                      Your matchmaking request for <strong>{selectedProfile.name}</strong> has been transferred to our senior matchmaker desk. We are opening your direct connection on Telegram now.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left text-xs space-y-1.5 max-w-md mx-auto">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Candidate:</span>
                      <strong className="text-white">{candidateForm.fullName || 'Anonymous'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Meeting Preference:</span>
                      <strong className="text-amber-400">{candidateForm.meetingPreference}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Target Sponsor:</span>
                      <strong className="text-rose-400">{selectedProfile.name} (Age {selectedProfile.age})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Expected Allowance:</span>
                      <strong className="text-emerald-400">{candidateForm.preferredAllowance}</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <button
                      onClick={() => {
                        const msg = 
                          `📝 CHECK STATUS OF MY VIP MATCH MEETING SUBMISSION (#${submitSuccessId})\n\n` +
                          `• Candidate: ${candidateForm.fullName || 'Candidate'}\n` +
                          `• Target Sponsor: ${selectedProfile.name} (#${selectedProfile.id})\n` +
                          `• Meeting Format: ${candidateForm.meetingPreference}\n\n` +
                          `Please confirm matchmaker scheduling time!`;
                        onOpenTelegram(msg);
                      }}
                      className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4 fill-white" />
                      <span>Chat on Telegram</span>
                    </button>

                    <button
                      onClick={() => {
                        const msg = 
                          `📝 CHECK STATUS OF MY VIP MATCH MEETING SUBMISSION (#${submitSuccessId})\n\n` +
                          `• Candidate: ${candidateForm.fullName || 'Candidate'}\n` +
                          `• Target Sponsor: ${selectedProfile.name} (#${selectedProfile.id})\n` +
                          `• Meeting Format: ${candidateForm.meetingPreference}\n\n` +
                          `Please confirm matchmaker scheduling time!`;
                        const cleanPhone = '13024998749';
                        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
                      }}
                      className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 fill-black text-black" />
                      <span>Chat on WhatsApp</span>
                    </button>

                    <a
                      href="https://t.me/+zZFzCZQouFkxMTNk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2"
                    >
                      <Users className="w-4 h-4 text-yellow-300" />
                      <span>Join Telegram Group</span>
                    </a>

                    <button
                      onClick={() => {
                        setShowSubmitProfileModal(false);
                        setSubmitSuccessId(null);
                      }}
                      className="w-full sm:w-auto px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCandidateFormSubmit} className="space-y-4">
                  {/* Notice Banner */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-amber-400/30 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-400 shrink-0" />
                    <p className="text-xs text-zinc-300 leading-tight">
                      Fill out your profile details below to request a direct match meeting, private dinner, or video introduction with sponsors in Africa, Europe, or worldwide.
                    </p>
                  </div>

                  {/* Row 1: Name & Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        Your Full Name / Alias *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. David Mensah / Sarah K."
                        value={candidateForm.fullName}
                        onChange={(e) => setCandidateForm({ ...candidateForm, fullName: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        Your Age *
                      </label>
                      <input
                        type="number"
                        min={18}
                        max={70}
                        required
                        value={candidateForm.age}
                        onChange={(e) => setCandidateForm({ ...candidateForm, age: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  {/* Row 2: Gender & Seeking */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        Your Gender
                      </label>
                      <select
                        value={candidateForm.gender}
                        onChange={(e) => setCandidateForm({ ...candidateForm, gender: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                      >
                        <option value="Male">Male (Seeking Female Sponsor)</option>
                        <option value="Female">Female (Seeking Male Sponsor)</option>
                        <option value="Non-binary / Open">Open / Non-binary</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        Target Preference
                      </label>
                      <select
                        value={candidateForm.seeking}
                        onChange={(e) => setCandidateForm({ ...candidateForm, seeking: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                      >
                        <option value="Wealthy Sugar Mummy (Ages 37-78)">👑 Wealthy Sugar Mummy (Ages 37–78)</option>
                        <option value="Wealthy Sugar Daddy (Ages 45-78)">💎 Wealthy Sugar Daddy (Ages 45–78)</option>
                        <option value="Marriage & Long-Term Sponsor">💍 Marriage & Serious Relationship</option>
                        <option value="Travel & Luxury Accompaniment">✈️ Luxury Travel Accompaniment</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Location & Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        Your City & Country *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lagos, Nigeria / London, UK / Nairobi"
                        value={candidateForm.location}
                        onChange={(e) => setCandidateForm({ ...candidateForm, location: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        Telegram / WhatsApp / Email Handle *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="@username or +1 (555)..."
                        value={candidateForm.contactHandle}
                        onChange={(e) => setCandidateForm({ ...candidateForm, contactHandle: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  {/* Row 4: Meeting Format & Expected Allowance */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        Preferred Meeting Type
                      </label>
                      <select
                        value={candidateForm.meetingPreference}
                        onChange={(e) => setCandidateForm({ ...candidateForm, meetingPreference: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                      >
                        <option value="In-Person VIP Dinner & Date">🍽️ In-Person VIP Dinner & Date</option>
                        <option value="Private HD Video Call First">📱 Private HD Video Call First</option>
                        <option value="Singles Tour Match Meeting">🌍 Singles Tour Meeting (Africa/Euro)</option>
                        <option value="Weekend Hotel / Lounge Rendezvous">🥂 Weekend Hotel / Lounge Rendezvous</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        Expected Monthly Allowance Range
                      </label>
                      <select
                        value={candidateForm.preferredAllowance}
                        onChange={(e) => setCandidateForm({ ...candidateForm, preferredAllowance: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                      >
                        <option value="$5,000 - $10,000 / month">$5,000 – $10,000 / month</option>
                        <option value="$10,000 - $25,000 / month">$10,000 – $25,000 / month (Standard VIP)</option>
                        <option value="$25,000 - $50,000+ / month">$25,000 – $50,000+ / month (Ultra High Net Worth)</option>
                        <option value="Negotiable / Mutual Chemistry">Negotiable based on mutual chemistry</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 5: Pitch & About */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Short Pitch / Why Sponsor Should Pick You (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Share your interests, hobbies, discretion, and what kind of connection you are looking for..."
                      value={candidateForm.aboutPitch}
                      onChange={(e) => setCandidateForm({ ...candidateForm, aboutPitch: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 resize-none"
                    />
                  </div>

                  {/* Submission Guarantee Badges */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-zinc-400 pt-1">
                    <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-0.5" />
                      <span>100% Discreet</span>
                    </div>
                    <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                      <Clock className="w-3.5 h-3.5 text-amber-400 mx-auto mb-0.5" />
                      <span>Fast 15m Review</span>
                    </div>
                    <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                      <Crown className="w-3.5 h-3.5 text-yellow-400 mx-auto mb-0.5" />
                      <span>Verified Sponsors</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-rose-500 hover:from-yellow-300 hover:to-rose-400 text-black font-black text-sm rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.6)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <UserCheck className="w-5 h-5 text-black" />
                      <span>Submit Candidate Profile & Request Match Meeting</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

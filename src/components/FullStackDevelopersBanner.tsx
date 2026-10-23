import React, { useState, useEffect, useMemo } from 'react';
import {
  Code2,
  Terminal,
  Cpu,
  Layers,
  Globe,
  Laptop,
  Zap,
  CheckCircle2,
  Star,
  ShieldCheck,
  Clock,
  Send,
  Calendar,
  DollarSign,
  Users,
  Flame,
  Sparkles,
  ExternalLink,
  Smartphone,
  Database,
  Server,
  GitBranch,
  Award,
  ChevronRight,
  Briefcase,
  Check
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface FullStackDevelopersBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

type TechFilter = 'all' | 'android' | 'react-next' | 'mobile' | 'node-express' | 'python-ai' | 'web3' | 'cloud-db';

interface DeveloperProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  flag: string;
  country: string;
  experience: string;
  hourlyRate: string;
  rating: number;
  completedJobs: number;
  availability: 'Available Immediately' | 'Available in 24 Hours' | 'Part-time Available';
  skills: string[];
  techCategories: TechFilter[];
  recentWork: string;
  badge: string;
  online: boolean;
}

const DEVELOPERS: DeveloperProfile[] = [
  {
    id: 'dev_tariq',
    name: 'Tariq Al-Mansoor',
    title: 'Senior Android & Kotlin Specialist',
    avatar: '📱',
    flag: '🇦🇪',
    country: 'UAE',
    experience: '8+ Years Exp',
    hourlyRate: '$44/hr',
    rating: 5.0,
    completedJobs: 78,
    availability: 'Available Immediately',
    skills: ['Kotlin', 'Jetpack Compose', 'Android SDK', 'Coroutines & Flow', 'Room DB', 'MVVM/MVI', 'Retrofit', 'Material 3', 'Google Play Store'],
    techCategories: ['android', 'mobile'],
    recentWork: 'High-performance Fintech & Crypto Android App (4.9★, 350k+ Downloads on Google Play)',
    badge: 'ANDROID SPECIALIST',
    online: true,
  },
  {
    id: 'dev_alex',
    name: 'Alex Rivera',
    title: 'Senior Full-Stack & AI Architect',
    avatar: '👨‍💻',
    flag: '🇺🇸',
    country: 'United States',
    experience: '8+ Years Exp',
    hourlyRate: '$45/hr',
    rating: 5.0,
    completedJobs: 84,
    availability: 'Available Immediately',
    skills: ['React 19', 'Next.js 15', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Gemini AI API'],
    techCategories: ['react-next', 'node-express', 'python-ai', 'cloud-db'],
    recentWork: 'High-throughput SaaS Dashboard & AI Agent Workflow with 120k MAU',
    badge: 'TOP RATED PLUS',
    online: true,
  },
  {
    id: 'dev_elena',
    name: 'Elena Rossi',
    title: 'Senior Android & Mobile Full-Stack Lead',
    avatar: '👩‍💻',
    flag: '🇩🇪',
    country: 'Germany',
    experience: '7+ Years Exp',
    hourlyRate: '$42/hr',
    rating: 4.99,
    completedJobs: 63,
    availability: 'Available Immediately',
    skills: ['Kotlin', 'Android SDK', 'React Native', 'Expo', 'TypeScript', 'NestJS', 'REST & GraphQL', 'Tailwind', 'Firebase'],
    techCategories: ['android', 'mobile', 'react-next', 'node-express'],
    recentWork: 'Native Android & Cross-Platform E-commerce & Logistics Suite with Real-time GPS Tracking',
    badge: 'ANDROID & FULL-STACK',
    online: true,
  },
  {
    id: 'dev_samantha',
    name: 'Samantha Chen',
    title: 'Full-Stack & Cloud Systems Lead',
    avatar: '👩‍💻',
    flag: '🇨🇦',
    country: 'Canada',
    experience: '7+ Years Exp',
    hourlyRate: '$42/hr',
    rating: 4.99,
    completedJobs: 67,
    availability: 'Available Immediately',
    skills: ['Next.js', 'Python', 'FastAPI', 'AWS ECS', 'Docker', 'PostgreSQL', 'Redis', 'GraphQL'],
    techCategories: ['react-next', 'python-ai', 'cloud-db'],
    recentWork: 'Distributed Fintech API & Real-time Web Platform',
    badge: 'VERIFIED EXPERT',
    online: true,
  },
  {
    id: 'dev_viktor',
    name: 'Viktor Novak',
    title: 'Native Android & Mobile Backend Engineer',
    avatar: '🧑‍💻',
    flag: '🇨🇿',
    country: 'Czechia',
    experience: '6+ Years Exp',
    hourlyRate: '$40/hr',
    rating: 4.98,
    completedJobs: 54,
    availability: 'Available Immediately',
    skills: ['Kotlin', 'Java', 'Jetpack Compose', 'Android NDK', 'Node.js', 'WebSockets', 'SQLite / Room', 'Google Maps API'],
    techCategories: ['android', 'mobile', 'node-express'],
    recentWork: 'Low-latency Offline-First Android Ride-hailing & Dispatch App with BLE hardware link',
    badge: 'ANDROID ARCHITECT',
    online: true,
  },
  {
    id: 'dev_marcus',
    name: 'Marcus Vance',
    title: 'Web3 & Full-Stack dApp Specialist',
    avatar: '🧑‍💻',
    flag: '🇬🇧',
    country: 'United Kingdom',
    experience: '6+ Years Exp',
    hourlyRate: '$50/hr',
    rating: 4.98,
    completedJobs: 52,
    availability: 'Available in 24 Hours',
    skills: ['Solidity', 'Ethers.js', 'Next.js', 'Wagmi', 'Node.js', 'Smart Contracts', 'TypeScript'],
    techCategories: ['web3', 'react-next', 'node-express'],
    recentWork: 'Multi-chain DEX & NFT Staking portal handling $35M TVL',
    badge: 'WEB3 GURU',
    online: true,
  },
  {
    id: 'dev_dmitry',
    name: 'Dmitry Sokolov',
    title: 'Senior Backend & Architecture Lead',
    avatar: '👨‍💻',
    flag: '🇵🇱',
    country: 'Poland',
    experience: '9+ Years Exp',
    hourlyRate: '$48/hr',
    rating: 5.0,
    completedJobs: 96,
    availability: 'Available Immediately',
    skills: ['Node.js', 'Python', 'Go', 'PostgreSQL', 'Kafka', 'Kubernetes', 'Docker', 'Cloud Run'],
    techCategories: ['node-express', 'python-ai', 'cloud-db'],
    recentWork: 'High-concurrency microservices processing 45,000 req/sec',
    badge: 'SYSTEM ARCHITECT',
    online: true,
  },
  {
    id: 'dev_leo',
    name: 'Leo Tanaka',
    title: 'Full-Stack UI/UX & Frontend Engineer',
    avatar: '🧑‍💻',
    flag: '🇦🇺',
    country: 'Australia',
    experience: '5+ Years Exp',
    hourlyRate: '$39/hr',
    rating: 4.98,
    completedJobs: 43,
    availability: 'Part-time Available',
    skills: ['React', 'Next.js', 'Vue.js', 'Framer Motion', 'Tailwind CSS', 'Node.js', 'Supabase'],
    techCategories: ['react-next', 'node-express'],
    recentWork: 'Award-winning Interactive 3D Product Configurator & Checkout',
    badge: 'FRONTEND WIZARD',
    online: false,
  },
];

interface ProjectScope {
  id: string;
  name: string;
  icon: string;
  typicalHours: string;
  timeline: string;
  estimatedCost: string;
  deliverables: string[];
}

const PROJECT_SCOPES: ProjectScope[] = [
  {
    id: 'android_native',
    name: 'Native Android Mobile App (Kotlin / Compose)',
    icon: '🤖',
    typicalHours: '70 - 110 hrs',
    timeline: '2 - 3 Weeks',
    estimatedCost: '$1,600 - $3,200',
    deliverables: ['Native Kotlin UI (Jetpack Compose)', 'Clean MVVM/MVI Architecture', 'Room DB & Offline Cache', 'Push Notifications & Google Play Deployment', 'API Integration & Auth'],
  },
  {
    id: 'fullstack_android_suite',
    name: 'Complete Full-Stack Web & Android App Suite',
    icon: '🚀',
    typicalHours: '120 - 160 hrs',
    timeline: '3 - 4 Weeks',
    estimatedCost: '$2,800 - $5,400',
    deliverables: ['Next.js Responsive Web Dashboard', 'Native Android Mobile App (Kotlin)', 'Unified Node/Postgres Backend API', 'Shared Auth & Real-Time Sync', 'Production Deployment & Google Play Launch'],
  },
  {
    id: 'saas_mvp',
    name: 'SaaS Web Application / MVP',
    icon: '💻',
    typicalHours: '80 - 120 hrs',
    timeline: '2 - 3 Weeks',
    estimatedCost: '$1,800 - $3,500',
    deliverables: ['Responsive Frontend (Next.js/React)', 'Auth & Multi-role Access', 'Database & API (Node/Postgres)', 'Stripe/Crypto Billing Integration', 'Deployment on Cloud'],
  },
  {
    id: 'ecommerce',
    name: 'Custom E-Commerce & Turnkey Store',
    icon: '🛍️',
    typicalHours: '60 - 90 hrs',
    timeline: '10 - 16 Days',
    estimatedCost: '$1,400 - $2,800',
    deliverables: ['Custom Product Catalog & Cart', 'Instant Payment Gateway', 'Order Management & Inventory', 'Admin Analytics Dashboard', 'Mobile-first PWA Optimization'],
  },
  {
    id: 'ai_agents',
    name: 'AI Agent & Automated Workflow Bot',
    icon: '⚡',
    typicalHours: '40 - 70 hrs',
    timeline: '1 - 2 Weeks',
    estimatedCost: '$950 - $2,200',
    deliverables: ['Gemini / LLM Integration', 'Custom Knowledge Grounding', 'Automated Telegram/Discord Bot', 'Admin Panel & Logs', 'Webhook Integrations'],
  },
  {
    id: 'dedicated_dev',
    name: 'Dedicated Full-Stack or Android Developer (Monthly)',
    icon: '👨‍💻',
    typicalHours: '160 hrs / month',
    timeline: 'Immediate (Full-Time)',
    estimatedCost: '$3,200 - $4,500 / mo',
    deliverables: ['Dedicated 40h/week senior engineer', 'Daily standups & Slack/Telegram sync', 'Direct Git repo commits & PRs', 'Full IP & Source Code Ownership', 'Zero recruitment fee'],
  },
];

export const FullStackDevelopersBanner: React.FC<FullStackDevelopersBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
}) => {
  const [selectedTech, setSelectedTech] = useState<TechFilter>('all');
  const [selectedDevId, setSelectedDevId] = useState<string>(DEVELOPERS[0].id);
  const [selectedScopeId, setSelectedScopeId] = useState<string>('android_native');
  const [activeTab, setActiveTab] = useState<'developers' | 'estimate' | 'benefits'>('developers');
  const [customRequirement, setCustomRequirement] = useState<string>('');
  const [recentHiresTicker, setRecentHiresTicker] = useState<string[]>([
    '🔥 Client from New York just hired Alex R. (Senior Full-Stack Next.js Lead)',
    '🤖 Berlin Startup engaged Tariq A. for Native Android (Kotlin / Compose) App',
    '⚡ London Agency engaged Samantha C. for Cloud Backend API migration',
    '📱 Singapore Founder hired Elena R. for Android & React Native Mobile App',
    '🚀 Dubai Fintech booked Viktor N. for Offline-First Android Payment App',
    '✨ Zurich Fintech engaged Dmitry S. for High-Concurrency Microservices',
  ]);
  const [tickerIndex, setTickerIndex] = useState<number>(0);

  // Rotate hire ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % recentHiresTicker.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [recentHiresTicker.length]);

  const filteredDevs = useMemo(() => {
    if (selectedTech === 'all') return DEVELOPERS;
    return DEVELOPERS.filter((d) => d.techCategories.includes(selectedTech));
  }, [selectedTech]);

  const selectedDev = useMemo(() => {
    return DEVELOPERS.find((d) => d.id === selectedDevId) || DEVELOPERS[0];
  }, [selectedDevId]);

  const selectedScope = useMemo(() => {
    return PROJECT_SCOPES.find((p) => p.id === selectedScopeId) || PROJECT_SCOPES[0];
  }, [selectedScopeId]);

  const handleHireDev = (dev: DeveloperProfile) => {
    incrementClicks();
    soundManager.playCoin();
    onOpenTelegram(
      `💼 HIRE FULL-STACK & ANDROID DEVELOPER INQUIRY:\n` +
      `• Developer: ${dev.name} (${dev.title})\n` +
      `• Rate: ${dev.hourlyRate} / Flexible Fixed Price\n` +
      `• Core Stack: ${dev.skills.slice(0, 4).join(', ')}\n` +
      `• Experience: ${dev.experience} • Rating: ${dev.rating}★\n` +
      `• Availability: ${dev.availability}\n` +
      `Please connect me with this developer for immediate project onboarding!`
    );
  };

  const handleRequestScopeQuote = () => {
    incrementClicks();
    soundManager.playCoin();
    const reqNote = customRequirement.trim() ? `\n• Notes: "${customRequirement}"` : '';
    onOpenTelegram(
      `🚀 PROJECT SCOPE ESTIMATION INQUIRY:\n` +
      `• Project Type: ${selectedScope.name}\n` +
      `• Estimated Duration: ${selectedScope.timeline} (${selectedScope.typicalHours})\n` +
      `• Estimated Cost Range: ${selectedScope.estimatedCost}\n` +
      `• Deliverables: ${selectedScope.deliverables.join(' | ')}${reqNote}\n\n` +
      `I need an elite full-stack & Android developer or squad to start on this project immediately!`
    );
  };

  const handleConsultationRequest = () => {
    incrementClicks();
    soundManager.playCoin();
    onOpenTelegram(
      `📞 15-MINUTE TECH CONSULTATION REQUEST:\n` +
      `Hi! I would like to schedule a quick 15-minute scoping call with a Senior Full-Stack & Android Engineering Lead to discuss architecture, timeline, and available developer slots.`
    );
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#070b12] border-2 border-cyan-500/80 p-4 sm:p-6 shadow-[0_0_35px_rgba(6,182,212,0.25)] backdrop-blur-xl">
      {/* Background Ambience Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Header & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/30 pb-3.5 mb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 text-black font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_18px_rgba(6,182,212,0.7)] flex items-center gap-1.5 animate-pulse">
            <Code2 className="w-3.5 h-3.5 text-black inline" /> FULL-STACK & ANDROID DEVELOPERS AVAILABLE
          </span>
          <span className="bg-cyan-500/20 text-cyan-300 font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-lg border border-cyan-500/40 uppercase tracking-tight flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 inline" /> Senior Engineers Ready in 24h
          </span>
          <span className="text-[11px] text-zinc-300 font-bold hidden md:inline flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" /> 100% Code Ownership • Clean Architecture • Strict NDA
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-black/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg shadow">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>18 Devs Online Now</span>
          </span>

          <button
            onClick={handleConsultationRequest}
            className="text-[11px] font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/50 hover:bg-cyan-900/60 px-3 py-1 rounded-lg transition-all flex items-center gap-1 shadow"
          >
            <Calendar className="w-3 h-3 text-cyan-400" />
            <span>Book 15-Min Scoping Call</span>
          </button>
        </div>
      </div>

      {/* Main Headline Hero */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5 bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-black/60 p-3.5 sm:p-4 rounded-2xl border border-cyan-500/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl sm:text-2xl font-black text-white italic tracking-tight flex items-center gap-2">
              <Laptop className="w-6 h-6 text-cyan-400" />
              HIRE ELITE FULL-STACK & ANDROID DEVELOPERS
            </span>
            <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded shadow">
              NO RECRUITMENT FEES
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 font-medium max-w-3xl">
            Need a high-performance web app, native Android app (Kotlin / Jetpack Compose), SaaS platform, or custom backend built fast? Deploy battle-tested senior engineers fluent in <strong className="text-cyan-300">Full-Stack Web (React, Next.js, Node.js, TypeScript, Python) & Native Android (Kotlin, Jetpack Compose, Android SDK, React Native)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleHireDev(selectedDev)}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Send className="w-4 h-4 text-black" />
            <span>HIRE DEVELOPER NOW (TELEGRAM)</span>
          </button>
        </div>
      </div>

      {/* Live Recent Hires Ticker */}
      <div className="flex items-center gap-2 bg-black/70 border border-zinc-800 rounded-xl px-3 py-1.5 mb-4 text-xs font-mono text-zinc-300 overflow-hidden">
        <span className="bg-cyan-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase flex-shrink-0 flex items-center gap-1">
          <Zap className="w-2.5 h-2.5 text-black inline" /> LIVE CONTRACTS
        </span>
        <span className="truncate text-[11px] text-cyan-200 font-medium">
          {recentHiresTicker[tickerIndex]}
        </span>
      </div>

      {/* Main Navigation Tabs: Developer Profiles, Project Cost Calculator, Architecture Benefits */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              setActiveTab('developers');
              soundManager.playSpinTick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'developers'
                ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Available Developers ({DEVELOPERS.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('estimate');
              soundManager.playSpinTick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'estimate'
                ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Project Scope & Cost Calculator</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('benefits');
              soundManager.playSpinTick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'benefits'
                ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Why Hire Us</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <span>⚡ Flexible: <strong className="text-cyan-400">Hourly ($38-$50/hr)</strong> or <strong className="text-cyan-400">Fixed Milestone</strong></span>
        </div>
      </div>

      {/* TAB 1: AVAILABLE DEVELOPERS PROFILES & DIRECT HIRE */}
      {activeTab === 'developers' && (
        <div className="space-y-4">
          {/* Tech Stack Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-mono text-zinc-400 mr-1 flex-shrink-0">Filter by Stack:</span>
            {[
              { id: 'all', label: 'All Technologies' },
              { id: 'android', label: '🤖 Native Android (Kotlin)' },
              { id: 'react-next', label: '⚛️ React & Next.js' },
              { id: 'mobile', label: '📱 Mobile & React Native' },
              { id: 'node-express', label: '🟩 Node.js & Nest' },
              { id: 'python-ai', label: '🐍 Python & AI LLMs' },
              { id: 'web3', label: '⛓️ Web3 & Smart Contracts' },
              { id: 'cloud-db', label: '🗄️ Cloud & PostgreSQL' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTech(t.id as TechFilter);
                  soundManager.playSpinTick();
                }}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-bold text-xs transition-all ${
                  selectedTech === t.id
                    ? 'bg-cyan-400 text-black font-black shadow-sm'
                    : 'bg-black/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Developers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDevs.map((dev) => {
              const isSelected = selectedDevId === dev.id;
              return (
                <div
                  key={dev.id}
                  onClick={() => {
                    setSelectedDevId(dev.id);
                    soundManager.playSpinTick();
                  }}
                  className={`relative p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-950/60 to-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)] scale-[1.01]'
                      : 'bg-[#090e17] border-zinc-800/80 hover:border-cyan-500/40 text-zinc-300'
                  }`}
                >
                  {/* Top row: Avatar, Name, Flag, Availability */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <span className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-xl shadow">
                          {dev.avatar}
                        </span>
                        {dev.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black" title="Online now" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-black text-sm text-white">{dev.name}</h4>
                          <span title={dev.country} className="text-xs">{dev.flag}</span>
                        </div>
                        <span className="text-[11px] text-cyan-300 font-medium block">{dev.title}</span>
                      </div>
                    </div>

                    <span className="text-[9px] font-black uppercase text-amber-300 bg-amber-950/40 border border-amber-500/40 px-1.5 py-0.5 rounded">
                      {dev.badge}
                    </span>
                  </div>

                  {/* Rating, rate & experience bar */}
                  <div className="flex items-center justify-between text-xs font-mono bg-black/60 px-2.5 py-1.5 rounded-lg border border-zinc-800/80 mb-2.5">
                    <span className="text-yellow-400 font-black flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 inline" /> {dev.rating} ({dev.completedJobs} jobs)
                    </span>
                    <span className="text-zinc-400 text-[10px]">{dev.experience}</span>
                    <span className="text-emerald-400 font-black">{dev.hourlyRate}</span>
                  </div>

                  {/* Recent Work Highlight */}
                  <p className="text-[11px] text-zinc-300 mb-2.5 line-clamp-2 leading-relaxed">
                    <strong>Recent:</strong> {dev.recentWork}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {dev.skills.slice(0, 5).map((skill, i) => (
                      <span key={i} className="text-[10px] font-mono bg-cyan-950/40 text-cyan-200 border border-cyan-800/40 px-1.5 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                    {dev.skills.length > 5 && (
                      <span className="text-[10px] font-mono text-zinc-400 px-1 py-0.5">+{dev.skills.length - 5} more</span>
                    )}
                  </div>

                  {/* Bottom Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 inline" /> {dev.availability}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHireDev(dev);
                      }}
                      className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black rounded-lg shadow flex items-center gap-1 transition-all active:scale-95"
                    >
                      <Send className="w-3 h-3 text-black" />
                      <span>Hire {dev.name.split(' ')[0]}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PROJECT SCOPE & COST ESTIMATOR */}
      {activeTab === 'estimate' && (
        <div className="bg-[#090e17] rounded-2xl border border-zinc-800 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800">
            <div>
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                Select Project Scope to Calculate Timeline & Cost
              </h3>
              <p className="text-xs text-zinc-400">
                Transparent milestone pricing. All plans include 100% source code, deployment, and 30-day bug-free warranty.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              ● Fixed Price Guarantee
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 mb-5">
            {PROJECT_SCOPES.map((scope) => {
              const isSelected = selectedScopeId === scope.id;
              return (
                <button
                  key={scope.id}
                  onClick={() => {
                    setSelectedScopeId(scope.id);
                    soundManager.playSpinTick();
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-950/80 to-blue-950/60 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-black/50 border-zinc-800 hover:border-cyan-500/30 text-zinc-400'
                  }`}
                >
                  <span className="text-xl block mb-1">{scope.icon}</span>
                  <h4 className={`text-xs font-black line-clamp-2 ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                    {scope.name}
                  </h4>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 block mt-1">
                    {scope.estimatedCost}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scope Detail Card */}
          <div className="bg-black/70 rounded-xl p-4 border border-cyan-500/30 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedScope.icon}</span>
                <div>
                  <h4 className="text-sm font-black text-white">{selectedScope.name}</h4>
                  <span className="text-xs text-zinc-400">Standard Delivery Timeline: <strong className="text-cyan-300">{selectedScope.timeline}</strong> ({selectedScope.typicalHours})</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-400 block font-mono uppercase">ESTIMATED INVESTMENT</span>
                <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                  {selectedScope.estimatedCost}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-xs font-bold text-zinc-300 block mb-2">Included Deliverables in this Package:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedScope.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-zinc-950/80 p-2 rounded-lg border border-zinc-800/70 text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Notes Input */}
            <div className="space-y-1.5 mb-3">
              <label className="text-xs text-zinc-400 font-medium">Add Any Specific Requirements or Tech Stack (Optional):</label>
              <input
                type="text"
                value={customRequirement}
                onChange={(e) => setCustomRequirement(e.target.value)}
                placeholder="e.g. Need Next.js 15, Stripe subscriptions, Tailwind, and Telegram bot notifications..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              onClick={handleRequestScopeQuote}
              className="w-full py-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs sm:text-sm rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Send className="w-4 h-4 text-black" />
              <span>REQUEST INSTANT SCOPE & DEVELOPER PROPOSAL VIA TELEGRAM</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: WHY HIRE US / QUALITY GUARANTEE */}
      {activeTab === 'benefits' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              icon: Zap,
              title: '24-Hour Kickoff',
              desc: 'No endless interview loops. Review portfolios, verify code samples, and start your first sprint within 24 hours.',
              badge: 'LIGHTNING FAST',
            },
            {
              icon: ShieldCheck,
              title: '100% Code Ownership',
              desc: 'All source code, repositories, Figma assets, and production credentials belong entirely to you from day one.',
              badge: 'STRICT NDA',
            },
            {
              icon: Award,
              title: 'Top 1% Vetted Talent',
              desc: 'Every engineer is rigorously tested in full-stack architecture, clean code standards, security, and real-time APIs.',
              badge: 'SCREENED SENIORS',
            },
            {
              icon: DollarSign,
              title: 'Risk-Free 14-Day Trial',
              desc: 'Work with your assigned developer for 14 days. If not 100% satisfied, we will replace the developer or refund.',
              badge: 'SATISFACTION GUARANTEED',
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#090e17] p-4 rounded-2xl border border-zinc-800 hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-black text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              </div>
              <h4 className="text-sm font-black text-white mb-1">{item.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer Quick Action Bar */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap text-zinc-400 font-mono text-[11px]">
          <span>💻 Supported Stacks:</span>
          <span className="text-cyan-300 font-bold">Android (Kotlin / Compose)</span>
          <span>•</span>
          <span className="text-cyan-300 font-bold">React 19</span>
          <span>•</span>
          <span className="text-cyan-300 font-bold">Next.js 15</span>
          <span>•</span>
          <span className="text-cyan-300 font-bold">Node.js</span>
          <span>•</span>
          <span className="text-cyan-300 font-bold">TypeScript</span>
          <span>•</span>
          <span className="text-cyan-300 font-bold">Python / AI</span>
          <span>•</span>
          <span className="text-cyan-300 font-bold">React Native</span>
          <span>•</span>
          <span className="text-cyan-300 font-bold">Web3 Solidity</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenTelegram('Hi! I need full-stack & Android developers available for immediate hire. Please share available developer profiles!')}
            className="text-xs font-black text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1"
          >
            <span>Talk to Tech Lead on Telegram</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

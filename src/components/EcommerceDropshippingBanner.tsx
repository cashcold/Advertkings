import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  DollarSign,
  Truck,
  Zap,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Send,
  MessageCircle,
  Copy,
  Check,
  Store,
  Globe,
  Percent,
  BarChart3,
  Flame,
  ShieldCheck,
  Layers,
  Video,
  Sliders,
  RefreshCw,
  Search,
  ChevronRight,
  Eye,
  Star,
  Users
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface EcommerceDropshippingBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

interface WinningProduct {
  id: string;
  name: string;
  niche: 'tech' | 'beauty' | 'home' | 'pet';
  sourcingCost: number;
  sellingPrice: number;
  ordersCount: number;
  views: string;
  rating: number;
  supplierHub: string;
  fulfillmentDays: string;
  tag: string;
  emoji: string;
  description: string;
}

const WINNING_PRODUCTS: WinningProduct[] = [
  {
    id: 'prod-1',
    name: '360° AI Auto-Tracking Face Gimbal',
    niche: 'tech',
    sourcingCost: 13.80,
    sellingPrice: 59.99,
    ordersCount: 4290,
    views: '14.2M TikTok Views',
    rating: 4.9,
    supplierHub: 'US/EU 3-Day Warehouse Express',
    fulfillmentDays: '2-4 Days Fast Delivery',
    tag: '🔥 VIRAL TIKTOK WINNER',
    emoji: '📸',
    description: 'AI gesture tracking smart mount with tripod and wireless remote. No app needed.',
  },
  {
    id: 'prod-2',
    name: 'Titanium Ultrasonic High-Freq Pod Cleaner',
    niche: 'tech',
    sourcingCost: 8.50,
    sellingPrice: 44.95,
    ordersCount: 3180,
    views: '9.8M Meta Ads Views',
    rating: 4.8,
    supplierHub: 'CJ Dropshipping VIP Line',
    fulfillmentDays: '3-5 Days Direct Air',
    tag: '⚡ 81% NET PROFIT MARGIN',
    emoji: '💎',
    description: '45,000Hz ultrasonic waves for cleaning jewelry, eyeglasses, watches & aligners.',
  },
  {
    id: 'prod-3',
    name: 'Micro-Current EMS V-Face Sculptor & Massager',
    niche: 'beauty',
    sourcingCost: 11.20,
    sellingPrice: 64.90,
    ordersCount: 5620,
    views: '22.5M TikTok Views',
    rating: 5.0,
    supplierHub: 'Express Air Courier (US/UK/EU)',
    fulfillmentDays: '2-4 Days Tracked',
    tag: '👑 #1 BEAUTY BESTSELLER',
    emoji: '✨',
    description: 'Red/Blue photon therapy + microcurrent lifting for jawline and neck sculpting.',
  },
  {
    id: 'prod-4',
    name: 'Anti-Gravity Levitating Water Droplet Humidifier',
    niche: 'home',
    sourcingCost: 14.00,
    sellingPrice: 58.99,
    ordersCount: 2940,
    views: '8.1M Reels Views',
    rating: 4.9,
    supplierHub: 'AutoDS Global Express Hub',
    fulfillmentDays: '3-6 Days Tracked',
    tag: '🌟 VIRAL AESTHETIC HOME',
    emoji: '💧',
    description: 'Optical illusion reverse water flow ultrasonic mist maker with ambient LED clock.',
  },
  {
    id: 'prod-5',
    name: 'Smart Interactive Laser Auto-Rolling Pet Ball',
    niche: 'pet',
    sourcingCost: 6.40,
    sellingPrice: 34.99,
    ordersCount: 3810,
    views: '11.4M TikTok Views',
    rating: 4.8,
    supplierHub: 'Direct Manufacturer Express',
    fulfillmentDays: '3-5 Days Delivery',
    tag: '🐶 HIGH ROAS AD CAMPAIGN',
    emoji: '🐾',
    description: '360 degree self-rotating obstacle avoidance LED pet toy ball with USB-C recharge.',
  },
  {
    id: 'prod-6',
    name: 'MagSafe 3-in-1 Foldable Fast Wireless Station',
    niche: 'tech',
    sourcingCost: 12.50,
    sellingPrice: 49.99,
    ordersCount: 6100,
    views: '17.3M TikTok Views',
    rating: 4.9,
    supplierHub: 'US Fast Shipping Hub',
    fulfillmentDays: '2-3 Days Fast Track',
    tag: '⚡ 300% ROAS CONVERTING',
    emoji: '🔋',
    description: 'Foldable 15W magnetic charger for iPhone, Apple Watch & AirPods with silicone travel case.',
  },
];

const RECENT_DISPATCHES = [
  { id: 'DP-901', store: '@LuxeAuraShop', item: 'AI Auto-Tracking Gimbal', qty: 38, amount: '$2,279.62', dest: 'New York, USA', status: 'Shipped (USPS Express)' },
  { id: 'DP-902', store: '@GlowSkinEmpire', item: 'Micro-Current V-Face', qty: 54, amount: '$3,504.60', dest: 'London, UK', status: 'Out for Delivery (Royal Mail)' },
  { id: 'DP-903', store: '@UrbanGadgetLab', item: 'MagSafe 3-in-1 Foldable', qty: 72, amount: '$3,599.28', dest: 'Sydney, Australia', status: 'Dispatched (Australia Post)' },
  { id: 'DP-904', store: '@NovaHomeLiving', item: 'Anti-Gravity Droplet Humidifier', qty: 29, amount: '$1,710.71', dest: 'Toronto, Canada', status: 'Shipped (Canada Post)' },
  { id: 'DP-905', store: '@PawsomeElite', item: 'Interactive Laser Pet Ball', qty: 45, amount: '$1,574.55', dest: 'Frankfurt, Germany', status: 'In Transit (DHL Express)' },
];

export const EcommerceDropshippingBanner: React.FC<EcommerceDropshippingBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
}) => {
  const [activeTab, setActiveTab] = useState<'winning' | 'calculator' | 'store-builder' | 'live-feed'>('winning');
  const [selectedNiche, setSelectedNiche] = useState<'all' | 'tech' | 'beauty' | 'home' | 'pet'>('all');
  const [selectedProduct, setSelectedProduct] = useState<WinningProduct>(WINNING_PRODUCTS[0]);
  const [dailyOrders, setDailyOrders] = useState<number>(35);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [storeName, setStoreName] = useState<string>('ApexVault Trends');
  const [storeType, setStoreType] = useState<'one-product' | 'niche-store' | 'tiktok-shop'>('one-product');
  const [isBuildingStore, setIsBuildingStore] = useState<boolean>(false);
  const [storeReady, setStoreReady] = useState<boolean>(false);

  // Profit calculations
  const unitProfit = selectedProduct.sellingPrice - selectedProduct.sourcingCost;
  const marginPercent = ((unitProfit / selectedProduct.sellingPrice) * 100).toFixed(1);
  const estimatedAdCostPerOrder = 12.50; // $12.50 CPA average
  const netProfitPerUnit = Math.max(0, unitProfit - estimatedAdCostPerOrder);
  const dailyNetProfit = netProfitPerUnit * dailyOrders;
  const monthlyNetProfit = dailyNetProfit * 30;
  const monthlyRevenue = selectedProduct.sellingPrice * dailyOrders * 30;

  const filteredProducts = useMemo(() => {
    if (selectedNiche === 'all') return WINNING_PRODUCTS;
    return WINNING_PRODUCTS.filter((p) => p.niche === selectedNiche);
  }, [selectedNiche]);

  const handleLaunchStore = () => {
    soundManager.playSpinTick();
    setIsBuildingStore(true);
    setStoreReady(false);
    setTimeout(() => {
      setIsBuildingStore(false);
      setStoreReady(true);
      soundManager.playWinFanfare();
    }, 1200);
  };

  const handleOpenTgInquiry = (customText?: string) => {
    incrementClicks();
    soundManager.playCoin();
    const msg = customText || (
      `📦 E-COMMERCE DROPSHIPPING & AUTOMATED STORE INQUIRY:\n` +
      `• Target Product: ${selectedProduct.name} (${selectedProduct.emoji})\n` +
      `• Selling Price: $${selectedProduct.sellingPrice.toFixed(2)} | Sourcing: $${selectedProduct.sourcingCost.toFixed(2)}\n` +
      `• Projected Monthly Net Profit: $${monthlyNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n` +
      `• Preferred Store Mode: ${storeType.toUpperCase()}\n` +
      `• Warehouse Fulfillment: ${selectedProduct.supplierHub}\n` +
      `Please provide the turnkey automated store setup + winning video ad pack!`
    );
    onOpenTelegram(msg);
  };

  const handleOpenWaInquiry = () => {
    incrementClicks();
    soundManager.playCoin();
    const msg = (
      `📦 E-COMMERCE DROPSHIPPING & AUTOMATED STORE INQUIRY:\n` +
      `• Target Product: ${selectedProduct.name}\n` +
      `• Projected Monthly Net Profit: $${monthlyNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n` +
      `• Supplier Hub: ${selectedProduct.supplierHub}\n` +
      `Please send the dropshipping store blueprint and viral video ads pack!`
    );
    const cleanPhone = '13024998749';
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyBlueprint = () => {
    const text = `🚀 DROPSHIPPING WINNER: ${selectedProduct.name} | Sourcing: $${selectedProduct.sourcingCost} -> Sell: $${selectedProduct.sellingPrice} (Margin: ${marginPercent}%) | Supplier: ${selectedProduct.supplierHub}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    soundManager.playCoin();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      id="ecommerce-dropshipping-banner"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#081512] via-[#090b10] to-[#0d0714] border-2 border-emerald-500/80 p-4 sm:p-6 shadow-[0_0_35px_rgba(16,185,129,0.35)] transition-all"
    >
      {/* Background glowing ambient effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Header Strip */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-emerald-500/30 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] border border-emerald-300 shrink-0">
            <Package className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-1 uppercase tracking-wider">
                <Flame className="w-3 h-3 text-black fill-black" /> #1 AUTOMATED DROPSHIPPING HUB
              </span>
              <span className="bg-yellow-400/20 text-yellow-300 border border-yellow-400/50 text-[10px] font-black px-2 py-0.5 rounded">
                ⚡ 2-4 DAY FAST US/EU SHIPPING
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white italic tracking-tight flex items-center gap-2 mt-0.5">
              <span>E-COMMERCE & DROPSHIPPING AUTOMATION</span>
              <span className="text-emerald-400">PRO STORE</span>
            </h2>
            <p className="text-xs text-zinc-300 font-bold">
              Turnkey 1-Click Shopify & TikTok Shop Stores • Pre-Tested Viral Winning Products • Automated CJ / AutoDS Fulfillment
            </p>
          </div>
        </div>

        {/* Top Quick Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={() => handleOpenTgInquiry()}
            className="flex-1 md:flex-initial px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs rounded-xl border border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5 fill-white" />
            <span>LAUNCH STORE VIA TELEGRAM</span>
          </button>

          <button
            onClick={handleOpenWaInquiry}
            className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl border border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">WHATSAPP</span>
          </button>

          <a
            href="https://t.me/+zZFzCZQouFkxMTNk"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playCoin()}
            className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl border border-cyan-300 shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
            title="Join Official Telegram Group"
          >
            <Users className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden sm:inline">TELEGRAM GROUP</span>
          </a>
        </div>
      </div>

      {/* Key Metric Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="p-2.5 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase">Avg Net Margin</div>
            <div className="text-xs sm:text-sm font-black text-emerald-400">76.4% Profit Margin</div>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase">US/EU Warehouses</div>
            <div className="text-xs sm:text-sm font-black text-cyan-300">2-4 Day Express Line</div>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase">Turnkey Automation</div>
            <div className="text-xs sm:text-sm font-black text-yellow-300">1-Click Store Launch</div>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase">Viral Ads Library</div>
            <div className="text-xs sm:text-sm font-black text-purple-300">50+ Pre-Tested Creatives</div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Header */}
      <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-2xl border border-zinc-800 mb-4 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('winning');
            soundManager.playSpinTick();
          }}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'winning'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)] border border-emerald-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-yellow-300" />
          <span>WINNING PRODUCTS ({filteredProducts.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('calculator');
            soundManager.playSpinTick();
          }}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'calculator'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)] border border-emerald-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-yellow-300" />
          <span>PROFIT & SCALE SIMULATOR</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('store-builder');
            soundManager.playSpinTick();
          }}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'store-builder'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)] border border-emerald-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
          }`}
        >
          <Store className="w-3.5 h-3.5 text-yellow-300" />
          <span>1-CLICK STORE BUILDER</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('live-feed');
            soundManager.playSpinTick();
          }}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'live-feed'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)] border border-emerald-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-yellow-300" />
          <span>LIVE GLOBAL DISPATCHES</span>
        </button>
      </div>

      {/* TAB 1: WINNING PRODUCTS SPY SHOWCASE */}
      {activeTab === 'winning' && (
        <div className="space-y-4">
          {/* Niche Category Chips Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-black text-zinc-400 uppercase mr-1">NICHE:</span>
            {[
              { id: 'all', label: 'All Winners' },
              { id: 'tech', label: '📱 Viral Tech & Smart Gadgets' },
              { id: 'beauty', label: '💄 Beauty & Personal Care' },
              { id: 'home', label: '🏠 Aesthetic Home & Living' },
              { id: 'pet', label: '🐾 Pet Accessories' },
            ].map((niche) => (
              <button
                key={niche.id}
                onClick={() => {
                  setSelectedNiche(niche.id as any);
                  soundManager.playSpinTick();
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedNiche === niche.id
                    ? 'bg-emerald-500 text-black font-black shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {niche.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredProducts.map((prod) => {
              const isSelected = selectedProduct.id === prod.id;
              const prodProfit = prod.sellingPrice - prod.sourcingCost;
              const prodMargin = ((prodProfit / prod.sellingPrice) * 100).toFixed(0);

              return (
                <div
                  key={prod.id}
                  onClick={() => {
                    setSelectedProduct(prod);
                    soundManager.playSpinTick();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-emerald-950/60 to-zinc-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'bg-zinc-950/70 border-zinc-800/90 hover:border-emerald-500/50 hover:bg-zinc-900/50'
                  }`}
                >
                  <div>
                    {/* Top Tag & Views */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-black text-yellow-300 bg-yellow-950/60 border border-yellow-500/40 px-2 py-0.5 rounded uppercase">
                        {prod.tag}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono font-bold flex items-center gap-1">
                        <Eye className="w-3 h-3 text-cyan-400" />
                        {prod.views}
                      </span>
                    </div>

                    {/* Emoji + Title */}
                    <div className="flex items-start gap-2.5 mb-2">
                      <div className="text-3xl p-2 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0">
                        {prod.emoji}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-white leading-tight">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-1">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-zinc-400 font-bold">({prod.ordersCount.toLocaleString()} Verified Sales)</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                      {prod.description}
                    </p>

                    {/* Sourcing vs Selling Pricing Box */}
                    <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800 grid grid-cols-3 gap-1 text-center mb-3">
                      <div>
                        <div className="text-[9px] text-zinc-500 font-bold uppercase">Supplier Cost</div>
                        <div className="text-xs font-mono font-black text-rose-400">${prod.sourcingCost.toFixed(2)}</div>
                      </div>
                      <div className="border-x border-zinc-800">
                        <div className="text-[9px] text-zinc-500 font-bold uppercase">Retail Price</div>
                        <div className="text-xs font-mono font-black text-cyan-300">${prod.sellingPrice.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-emerald-400 font-bold uppercase">Net Profit</div>
                        <div className="text-xs font-mono font-black text-emerald-400">+${prodProfit.toFixed(2)} ({prodMargin}%)</div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenTgInquiry(
                          `🚀 IMPORT WINNING PRODUCT REQUEST:\n` +
                          `• Product: ${prod.name} (${prod.emoji})\n` +
                          `• Retail Price: $${prod.sellingPrice} | Sourcing: $${prod.sourcingCost}\n` +
                          `• Supplier Line: ${prod.supplierHub}\n` +
                          `Please import this product to my Shopify / TikTok store with optimized copy & video ads!`
                        );
                      }}
                      className="flex-1 py-1.5 px-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all"
                    >
                      <Zap className="w-3 h-3 fill-black" />
                      <span>IMPORT TO STORE</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(prod);
                        setActiveTab('calculator');
                        soundManager.playSpinTick();
                      }}
                      className="py-1.5 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs rounded-lg flex items-center gap-1"
                      title="Calculate Profit"
                    >
                      <BarChart3 className="w-3 h-3 text-yellow-400" />
                      <span>SIMULATE</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PROFIT & SCALE SIMULATOR */}
      {activeTab === 'calculator' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/90 border border-emerald-500/40 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <span>DROPSHIPPING PROFIT & SCALE SIMULATOR</span>
              </h3>
              <p className="text-xs text-zinc-400 font-bold">
                Selected Product: <span className="text-yellow-300">{selectedProduct.emoji} {selectedProduct.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-bold">Switch Product:</span>
              <select
                value={selectedProduct.id}
                onChange={(e) => {
                  const p = WINNING_PRODUCTS.find((item) => item.id === e.target.value);
                  if (p) setSelectedProduct(p);
                  soundManager.playSpinTick();
                }}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-emerald-300 font-bold focus:outline-none focus:border-emerald-400"
              >
                {WINNING_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.emoji} {p.name} (${p.sellingPrice.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Slider */}
          <div className="space-y-2 p-3 bg-black/60 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-zinc-300 uppercase flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                DAILY FULFILLED ORDERS TARGET:
              </span>
              <span className="text-emerald-400 font-mono text-base px-2.5 py-0.5 bg-emerald-950/80 rounded-lg border border-emerald-500/40">
                {dailyOrders} Orders / Day ({dailyOrders * 30} / Month)
              </span>
            </div>

            <input
              type="range"
              min="5"
              max="250"
              step="5"
              value={dailyOrders}
              onChange={(e) => {
                setDailyOrders(Number(e.target.value));
              }}
              className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />

            <div className="flex justify-between text-[10px] text-zinc-500 font-mono font-bold">
              <span>5 Orders/day (Starter)</span>
              <span>50 Orders/day (Scaling)</span>
              <span>150 Orders/day (High-Volume)</span>
              <span>250 Orders/day (7-Figure Run Rate)</span>
            </div>
          </div>

          {/* Calculated Output Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center">
              <div className="text-[10px] text-zinc-400 font-bold uppercase">Monthly Gross Revenue</div>
              <div className="text-base sm:text-xl font-mono font-black text-cyan-300 mt-0.5">
                ${monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">@ ${selectedProduct.sellingPrice.toFixed(2)}/sale</div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center">
              <div className="text-[10px] text-zinc-400 font-bold uppercase">Sourcing & Shipping Cost</div>
              <div className="text-base sm:text-xl font-mono font-black text-rose-400 mt-0.5">
                -${(selectedProduct.sourcingCost * dailyOrders * 30).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">@ ${selectedProduct.sourcingCost.toFixed(2)}/unit</div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center">
              <div className="text-[10px] text-zinc-400 font-bold uppercase">Est. TikTok / Meta Ad Spend</div>
              <div className="text-base sm:text-xl font-mono font-black text-amber-400 mt-0.5">
                -${(estimatedAdCostPerOrder * dailyOrders * 30).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">@ ~$12.50 CPA (3.2x ROAS)</div>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950 via-teal-950 to-zinc-900 border-2 border-emerald-400 text-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <div className="text-[10px] text-emerald-300 font-black uppercase">ESTIMATED NET PROFIT / MO</div>
              <div className="text-lg sm:text-2xl font-mono font-black text-emerald-400 mt-0.5">
                +${monthlyNetProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-[10px] text-yellow-300 font-bold mt-0.5">+${dailyNetProfit.toFixed(0)}/Day Pure Net Profit</div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full automated order fulfillment & 100% replacement guarantee included.</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyBlueprint}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl border border-zinc-700 flex items-center justify-center gap-1.5"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'COPIED TO CLIPBOARD!' : 'COPY BLUEPRINT'}</span>
              </button>

              <button
                onClick={() => handleOpenTgInquiry()}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 fill-black" />
                <span>CLAIM TURNKEY STORE BLUEPRINT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 1-CLICK STORE BUILDER */}
      {activeTab === 'store-builder' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/90 border border-emerald-500/40 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-yellow-300" />
                <span>INSTANT 1-CLICK TURNKEY STORE LAUNCHPAD</span>
              </h3>
              <p className="text-xs text-zinc-400 font-bold">
                Deploy high-converting Shopify, TikTok Shop, or WooCommerce dropshipping stores in under 60 seconds.
              </p>
            </div>

            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" /> ZERO CODING REQUIRED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Store Type Options */}
            {[
              {
                id: 'one-product',
                title: '⚡ 1-Product High-Converting Funnel',
                tag: 'Best for TikTok Viral Ads (3.8x ROAS)',
                desc: 'Hyper-focused single winner landing page with custom video UGC, sticky ATC, and fast 1-click checkout.',
              },
              {
                id: 'niche-store',
                title: '🛍️ Niche Brand Store (15 Winners)',
                tag: 'High AOV & Repeat Customers',
                desc: 'Curated niche catalog (Tech, Beauty, or Home) with automated cross-sells, bundles, and email flows.',
              },
              {
                id: 'tiktok-shop',
                title: '📱 TikTok Shop Live Integration',
                tag: 'Direct In-App Social Checkout',
                desc: 'Pre-synced TikTok Shop product catalog connected directly to US/EU suppliers with automated fulfillment.',
              },
            ].map((st) => (
              <div
                key={st.id}
                onClick={() => {
                  setStoreType(st.id as any);
                  soundManager.playSpinTick();
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  storeType === st.id
                    ? 'bg-emerald-950/50 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="text-[10px] font-bold text-yellow-300 uppercase mb-1">{st.tag}</div>
                  <h4 className="font-black text-sm text-white">{st.title}</h4>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{st.desc}</p>
                </div>
                <div className="pt-2 mt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className={`font-bold ${storeType === st.id ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {storeType === st.id ? '✓ Selected' : 'Click to select'}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Ready to Deploy</span>
                </div>
              </div>
            ))}
          </div>

          {/* Store Config Input & Generator */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex-1 w-full">
              <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                Your Preferred Store Brand Name:
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-emerald-400 rounded-lg px-3 py-2 text-xs sm:text-sm text-emerald-300 font-bold focus:outline-none"
                placeholder="e.g. ApexTrends Direct"
              />
            </div>

            <button
              onClick={handleLaunchStore}
              disabled={isBuildingStore}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-yellow-400 via-amber-500 to-emerald-500 hover:from-yellow-300 hover:to-emerald-400 text-black font-black text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              {isBuildingStore ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>GENERATING STORE & CONNECTING SUPPLIERS...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black fill-black" />
                  <span>GENERATE TURNKEY STORE NOW</span>
                </>
              )}
            </button>
          </div>

          {/* Store Generated Result Modal / Card */}
          {storeReady && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-400/80 animate-in fade-in space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-black text-white">
                    STORE "{storeName}" READY FOR INSTANT DEPLOYMENT!
                  </span>
                </div>
                <span className="bg-emerald-500 text-black font-black text-[10px] px-2 py-0.5 rounded">
                  100% PRE-CONFIGURED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">Featured Product</div>
                  <div className="font-bold text-white mt-0.5">{selectedProduct.emoji} {selectedProduct.name}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">Automated Supplier</div>
                  <div className="font-bold text-cyan-300 mt-0.5">{selectedProduct.supplierHub}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">Ad Creatives Pack</div>
                  <div className="font-bold text-yellow-300 mt-0.5">5x High-Converting Video UGC Ads</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => handleOpenTgInquiry(
                    `🚀 DEPLOY MY STORE NOW:\n` +
                    `• Brand Name: ${storeName}\n` +
                    `• Store Model: ${storeType.toUpperCase()}\n` +
                    `• Hero Product: ${selectedProduct.name}\n` +
                    `Please transfer admin credentials & activate automated fulfillment!`
                  )}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs rounded-xl shadow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 fill-black" />
                  <span>CLAIM STORE ACCESS ON TELEGRAM</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LIVE GLOBAL DISPATCHES */}
      {activeTab === 'live-feed' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/90 border border-emerald-500/40 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <span>LIVE GLOBAL SUPPLIER DISPATCH & FULFILLMENT STREAM</span>
              </h3>
              <p className="text-xs text-zinc-400 font-bold">
                Automated express shipments dispatched to customer doorsteps in US, UK, CA, AU & Europe.
              </p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div className="space-y-2">
            {RECENT_DISPATCHES.map((dp) => (
              <div
                key={dp.id}
                className="p-3 rounded-xl bg-black/60 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-zinc-500 text-[11px]">{dp.id}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-emerald-400">{dp.store}</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-white font-bold">{dp.item} ({dp.qty} Units)</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      Destination: <span className="text-zinc-200">{dp.dest}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="font-mono font-black text-yellow-300">{dp.amount}</span>
                  <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    {dp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Guarantee Strip & Direct Contact Footnote */}
      <div className="mt-4 pt-3 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400 font-bold">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Automated Inventory Sync • Zero Warehouse Fees • 24/7 Dedicated Account Manager</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
          <button
            onClick={() => handleOpenTgInquiry()}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
          >
            <Send className="w-3.5 h-3.5" /> Telegram: @adkingsSupport
          </button>
          <span className="text-zinc-600">|</span>
          <button
            onClick={handleOpenWaInquiry}
            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp: +1 (302) 499-8749
          </button>
          <span className="text-zinc-600">|</span>
          <a
            href="https://t.me/+zZFzCZQouFkxMTNk"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playCoin()}
            className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 hover:underline"
          >
            <Users className="w-3.5 h-3.5" /> Telegram Group
          </a>
        </div>
      </div>
    </div>
  );
};

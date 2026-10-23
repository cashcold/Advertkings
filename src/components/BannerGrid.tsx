import React, { useState } from 'react';
import { ExternalLink, Flame, Send, Zap, Trophy, Sparkles, TrendingUp, Radio, ChevronDown, Layers } from 'lucide-react';
import { BannerCategory, BannerSize, BannerItem } from '../types';
import { MascotVisual } from './MascotVisuals';
import { soundManager } from '../utils/audio';
import { ALL_SPONSORED_BANNERS } from '../data/banners';

interface BannerGridProps {
  category: BannerCategory;
  bannerSize: BannerSize;
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

export const BannerGrid: React.FC<BannerGridProps> = ({
  category,
  bannerSize,
  onOpenTelegram,
  incrementClicks,
}) => {
  const [displayLimit, setDisplayLimit] = useState(24);

  // Filter banners based on category and size
  const filteredBanners = ALL_SPONSORED_BANNERS.filter((b) => {
    const matchCat =
      category === 'all' ||
      b.category === category ||
      (category === 'gift-card' && (b.category === 'shopping' || b.category === 'gaming'));
    const matchSize =
      bannerSize === 'all' ||
      (bannerSize === 'leaderboard' && b.size === '728x90') ||
      (bannerSize === 'billboard' && b.size === '970x250') ||
      (bannerSize === 'medium-rect' && b.size === '300x250') ||
      (bannerSize === 'half-page' && b.size === '300x600') ||
      (bannerSize === 'mobile-banner' && b.size === '320x100');

    return matchCat && matchSize;
  });

  const visibleBanners = filteredBanners.slice(0, displayLimit);

  const handleBannerClick = (banner: BannerItem) => {
    incrementClicks();
    soundManager.playCoin();
    if (banner.category === 'hyip' || banner.websiteUrl) {
      const url = banner.websiteUrl || 'https://gold-bod-pro.vercel.app';
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      onOpenTelegram(banner.telegramMessage);
    }
  };

  const handleRentSpot = (e: React.MouseEvent, banner: BannerItem) => {
    e.stopPropagation();
    incrementClicks();
    soundManager.playCoin();
    onOpenTelegram(
      `💼 BANNER SPOT RENTAL INQUIRY:\n` +
      `• Placement ID: ${banner.id}\n` +
      `• Format: ${banner.sizeName}\n` +
      `• Recorded CTR: ${banner.ctr}\n` +
      `Please provide pricing details for 7-day / 30-day banner placement!`
    );
  };

  return (
    <section className="my-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black font-black text-xs px-2.5 py-0.5 rounded uppercase shadow-[0_0_8px_rgba(234,179,8,0.5)]">
              HIGH CTR AD NETWORK
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white italic tracking-tight">
              SPONSORED CAMPAIGN BANNERS
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-bold mt-1">
            ⚡ Blinking animated creative banners crafted for maximum click-through rates. Click any banner to connect via Telegram!
          </p>
        </div>

        <button
          onClick={() => onOpenTelegram('Hi, I want to rent multiple banner spaces on MegaSpin Ads Network.')}
          className="text-xs font-black text-yellow-300 bg-yellow-950/40 border border-yellow-500/60 px-3 py-1.5 rounded-lg hover:bg-yellow-900/60 transition-all flex items-center gap-1.5 shadow-md"
        >
          <Send className="w-3.5 h-3.5 text-yellow-400" />
          <span>Rent Custom Ad Spot (USDT/TON)</span>
        </button>
      </div>

      {filteredBanners.length === 0 ? (
        <div className="text-center py-12 bg-[#09090c] rounded-xl border border-zinc-800">
          <p className="text-yellow-400 font-black text-base">No banners found for current filter.</p>
          <p className="text-xs text-zinc-400 mt-1">Select "All" to view all high-converting ad units.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1 font-bold">
            <span>
              Showing <span className="text-yellow-400 font-mono">{Math.min(visibleBanners.length, filteredBanners.length)}</span> of{' '}
              <span className="text-white font-mono">{filteredBanners.length}</span> Active Banners in this Network
            </span>
            <span className="text-emerald-400 font-mono">
              ● All formats optimized (728x90, 970x250, 300x250, 300x600, 320x100)
            </span>
          </div>

          {/* Leaderboard & Billboard full-width banners */}
          {visibleBanners
            .filter((b) => b.size === '728x90' || b.size === '970x250' || b.size === '320x100')
            .map((b) => (
              <div
                key={b.id}
                onClick={() => handleBannerClick(b)}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r ${b.bgGradient} border-2 border-yellow-500/80 p-3 sm:p-4 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] glow-gold shadow-xl backdrop-blur-md`}
              >
                {/* Ad Spec Label & Rent Button */}
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-zinc-400 mb-2 border-b border-zinc-800/80 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-400 text-black px-1.5 py-0.2 rounded font-black shadow-sm">
                      ADVERTISEMENT
                    </span>
                    <span className="text-zinc-300">{b.sizeName}</span>
                    <span className="text-green-400 font-bold hidden sm:inline font-mono">
                      ● CTR: {b.ctr} ({b.clicks.toLocaleString()} clicks)
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleRentSpot(e, b)}
                    className="text-cyan-400 hover:text-white underline flex items-center gap-1 font-bold"
                  >
                    <ExternalLink className="w-3 h-3" /> Rent This Spot
                  </button>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* Left: Mascot & Title */}
                  <div className="flex items-center gap-3 text-center md:text-left w-full md:w-auto">
                    <MascotVisual type={b.mascotType} className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 drop-shadow-[0_0_12px_rgba(234,179,8,0.2)]" />
                    <div className="text-left">
                      <div className="flex items-center justify-start gap-2 flex-wrap">
                        <span className="bg-red-600 text-white font-black text-[11px] px-2 py-0.5 rounded uppercase animate-blink-fast border border-yellow-300/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                          {b.badge}
                        </span>
                        <h3 className="font-black text-sm sm:text-base text-yellow-300 uppercase tracking-tight">
                          {b.title}
                        </h3>
                      </div>
                      <p className="text-xs text-zinc-300 font-bold mt-1 line-clamp-1">
                        {b.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Right: CTA & Bonus Tag */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 w-full md:w-auto">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-zinc-500 block font-bold">LIMITED TIME</span>
                      <span className="font-mono font-black text-sm text-green-400">{b.bonusText}</span>
                    </div>
                    <button
                      className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 group-hover:from-red-500 group-hover:to-yellow-300 text-black font-black text-xs sm:text-sm rounded-xl border border-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.5)] pulse-cta flex items-center justify-center gap-1.5"
                    >
                      {b.category === 'hyip' ? (
                        <ExternalLink className="w-3.5 h-3.5 text-black" />
                      ) : (
                        <Send className="w-3.5 h-3.5 text-black" />
                      )}
                      <span>{b.actionLabel}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* Medium Rectangle and Half-page side-by-side grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleBanners
              .filter((b) => b.size === '300x250' || b.size === '300x600')
              .map((b) => (
                <div
                  key={b.id}
                  onClick={() => handleBannerClick(b)}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-b ${b.bgGradient} border-2 border-yellow-500/80 p-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] glow-gold shadow-xl backdrop-blur-md flex flex-col justify-between ${
                    b.size === '300x600' ? 'sm:col-span-2 lg:col-span-1 min-h-[420px]' : 'min-h-[280px]'
                  }`}
                >
                  <div>
                    {/* Header Spec */}
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-zinc-400 mb-2 border-b border-zinc-800/80 pb-1">
                      <span className="bg-yellow-400 text-black px-1.5 py-0.2 rounded font-black shadow-sm">
                        SPONSORED AD
                      </span>
                      <span className="text-green-400 font-mono">CTR {b.ctr}</span>
                    </div>

                    {/* Mascot & Title */}
                    <div className="flex flex-col items-center text-center my-2">
                      <MascotVisual type={b.mascotType} className="w-20 h-20 mb-2 drop-shadow-[0_0_12px_rgba(234,179,8,0.25)]" />
                      <span className="bg-red-600 text-white font-black text-[11px] px-2 py-0.5 rounded uppercase animate-blink-fast border border-yellow-300/40 mb-1 shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                        {b.badge}
                      </span>
                      <h4 className="font-black text-sm sm:text-base text-yellow-300 uppercase tracking-tight">
                        {b.title}
                      </h4>
                      <p className="text-xs text-zinc-300 font-bold mt-1.5 px-2">
                        {b.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <span className="text-zinc-500 font-bold">Reward:</span>
                      <span className="font-mono font-black text-yellow-400">{b.bonusText}</span>
                    </div>
                    <button
                      className="w-full py-3 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 group-hover:from-red-500 group-hover:to-yellow-300 text-black font-black text-xs sm:text-sm rounded-xl border border-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.5)] pulse-cta flex items-center justify-center gap-1.5"
                    >
                      {b.category === 'hyip' ? (
                        <ExternalLink className="w-4 h-4 text-black" />
                      ) : (
                        <Send className="w-4 h-4 text-black" />
                      )}
                      <span>{b.actionLabel}</span>
                    </button>
                    <button
                      onClick={(e) => handleRentSpot(e, b)}
                      className="w-full text-center text-[10px] text-cyan-400 hover:text-white underline mt-2 font-bold"
                    >
                      Rent This {b.sizeName} Spot
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Load More Banners Button */}
          {displayLimit < filteredBanners.length && (
            <div className="text-center pt-6 pb-2">
              <button
                onClick={() => setDisplayLimit((prev) => prev + 24)}
                className="px-8 py-3.5 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 hover:from-yellow-500/20 hover:to-amber-500/20 text-yellow-300 font-black text-sm uppercase rounded-2xl border-2 border-yellow-500/60 shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
              >
                <Layers className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span>LOAD MORE CAMPAIGN BANNERS ({filteredBanners.length - displayLimit} REMAINING)</span>
                <ChevronDown className="w-4 h-4 text-yellow-400" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

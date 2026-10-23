import React, { useState, useEffect } from 'react';
import { Send, Clock, Sparkles, X, Flame, MessageCircle, Users } from 'lucide-react';
import { soundManager } from '../utils/audio';

const TELEGRAM_GROUP_URL = 'https://t.me/+7Ish7gfkoxw3NjM8';

interface StickyBottomBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
}

export const StickyBottomBanner: React.FC<StickyBottomBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(72); // 01:12 (1m 12s)
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 299));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const flashMessage = '🚨 FLASH OFFER CLAIM: I want the 1,000 USDT No-Deposit Welcome Bonus before the timer expires!';

  const handleClaimTelegram = () => {
    incrementClicks();
    soundManager.playCoin();
    onOpenTelegram(flashMessage);
  };

  const handleClaimWhatsApp = () => {
    incrementClicks();
    soundManager.playCoin();
    const cleanPhone = '13024998749';
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(flashMessage)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      aria-label="Flash promotional banner"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#070709]/95 border-t-2 border-yellow-500/80 p-2.5 sm:p-2.5 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.85)]"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
        {/* Top / Left Section: Offer Badge, Text, Countdown & Dismiss on Mobile */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5">
          <div className="flex items-center gap-2">
            <div className="hidden md:flex w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 border border-yellow-300/80 items-center justify-center text-lg animate-bounce shadow-md shrink-0">
              💰
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="bg-red-600 text-white font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded uppercase animate-blink-fast flex items-center gap-1 border border-yellow-300/60 shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                  <Flame className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300" /> FLASH OFFER
                </span>
                <span className="text-yellow-300 font-black text-xs sm:text-sm uppercase tracking-tight line-clamp-1 sm:line-clamp-none">
                  CLAIM 1,000 USDT NO-DEPOSIT WELCOME BONUS
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 font-bold hidden sm:block">
                Zero wagering requirements • Instant Telegram & WhatsApp Bot withdrawal • Verified Community Group
              </p>
            </div>
          </div>

          {/* Countdown Clock + Close Button (visible on mobile inline with header) */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 bg-black/90 border border-red-500/60 px-2 py-0.5 rounded-lg">
              <Clock className="w-3 h-3 text-red-400 animate-spin" />
              <span className="text-[9px] text-zinc-400 font-bold">EXP:</span>
              <span className="font-mono font-black text-red-400 text-xs tracking-wider">
                {formattedTime}
              </span>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-zinc-400 hover:text-white p-1"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom / Right Section: Timer (Desktop) + Action Buttons Grid (Mobile & Desktop) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 sm:shrink-0">
          {/* Countdown Clock (Desktop only) */}
          <div className="hidden sm:flex items-center gap-1.5 bg-black/90 border border-red-500/60 px-2.5 py-1 rounded-lg shrink-0">
            <Clock className="w-3.5 h-3.5 text-red-400 animate-spin" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase">EXPIRES:</span>
            <span className="font-mono font-black text-red-400 text-xs sm:text-sm tracking-wider">
              {formattedTime}
            </span>
          </div>

          {/* Action CTAs: Responsive Block Grid on Mobile, Flex on Desktop */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-1.5">
            <button
              id="sticky-claim-tg-btn"
              onClick={handleClaimTelegram}
              className="w-full sm:w-auto px-3 sm:px-3.5 py-2 sm:py-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-rose-500 hover:from-yellow-300 hover:to-rose-400 text-black font-black text-[11px] sm:text-xs md:text-sm rounded-xl border border-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.5)] pulse-cta flex items-center justify-center gap-1 sm:gap-1.5 transition-transform hover:scale-105 active:scale-95 text-center"
            >
              <Send className="w-3.5 h-3.5 text-black fill-black shrink-0" />
              <span className="truncate">CLAIM ON TELEGRAM</span>
            </button>

            <button
              id="sticky-claim-wa-btn"
              onClick={handleClaimWhatsApp}
              className="w-full sm:w-auto px-3 sm:px-3.5 py-2 sm:py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-[11px] sm:text-xs md:text-sm rounded-xl border border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-1 sm:gap-1.5 transition-transform hover:scale-105 active:scale-95 text-center"
              title="Claim 1,000 USDT Bonus on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-white fill-white shrink-0" />
              <span className="truncate">WHATSAPP</span>
            </button>

            <a
              id="sticky-join-group-btn"
              href={TELEGRAM_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                incrementClicks();
                soundManager.playCoin();
              }}
              className="col-span-2 sm:col-span-1 w-full sm:w-auto px-3 sm:px-3.5 py-2 sm:py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-[11px] sm:text-xs md:text-sm rounded-xl border border-cyan-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center gap-1 sm:gap-1.5 transition-transform hover:scale-105 active:scale-95 text-center"
              title="Join Official Telegram VIP Group"
            >
              <Users className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
              <span className="truncate">JOIN TELEGRAM GROUP</span>
            </a>
          </div>

          {/* Close Banner (Desktop only) */}
          <button
            onClick={() => setIsVisible(false)}
            className="hidden sm:block text-zinc-400 hover:text-white p-1"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

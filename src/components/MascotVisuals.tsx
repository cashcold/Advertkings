import React from 'react';

interface MascotProps {
  type: 'doge' | 'duck' | 'ape' | 'frog' | 'piggy' | 'leprechaun';
  className?: string;
  blinking?: boolean;
}

export const MascotVisual: React.FC<MascotProps> = ({ type, className = "w-20 h-20", blinking = true }) => {
  switch (type) {
    case 'doge':
      return (
        <div className={`relative inline-block ${className} ${blinking ? 'animate-bounce' : ''}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(250,204,21,0.6)]">
            {/* Doge Head */}
            <circle cx="50" cy="50" r="42" fill="#f59e0b" stroke="#b45309" strokeWidth="4" />
            <circle cx="50" cy="56" r="28" fill="#fef3c7" />
            {/* Ears */}
            <polygon points="20,25 35,5 45,28" fill="#d97706" stroke="#92400e" strokeWidth="3" />
            <polygon points="80,25 65,5 55,28" fill="#d97706" stroke="#92400e" strokeWidth="3" />
            {/* Cool Sunglasses */}
            <polygon points="22,42 46,42 43,58 25,56" fill="#18181b" />
            <polygon points="54,42 78,42 75,56 57,58" fill="#18181b" />
            <line x1="45" y1="45" x2="55" y2="45" stroke="#18181b" strokeWidth="4" />
            <line x1="26" y1="46" x2="42" y2="46" stroke="#60a5fa" strokeWidth="2" strokeDasharray="3" />
            <line x1="58" y1="46" x2="74" y2="46" stroke="#60a5fa" strokeWidth="2" strokeDasharray="3" />
            {/* Laser Eyes glow option */}
            <circle cx="34" cy="50" r="3" fill="#ef4444" className="animate-ping" />
            <circle cx="66" cy="50" r="3" fill="#ef4444" className="animate-ping" />
            {/* Snout & Nose */}
            <ellipse cx="50" cy="62" rx="14" ry="10" fill="#fef08a" />
            <polygon points="46,58 54,58 50,64" fill="#18181b" />
            {/* Smirk & Cigar */}
            <path d="M 44 68 Q 50 73 56 68" stroke="#18181b" strokeWidth="3" fill="none" />
            <rect x="54" y="65" width="22" height="6" rx="2" fill="#78350f" transform="rotate(-15 54 65)" />
            <rect x="74" y="60" width="4" height="6" rx="1" fill="#ea580c" className="animate-pulse" />
            {/* Gold Chain */}
            <path d="M 28 84 Q 50 98 72 84" stroke="#fbbf24" strokeWidth="5" fill="none" strokeDasharray="6 3" />
            {/* Dollar Sign Coin badge */}
            <circle cx="50" cy="92" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <text x="50" y="96" textAnchor="middle" fill="#78350f" fontSize="9" fontWeight="900">$</text>
          </svg>
        </div>
      );

    case 'duck':
      return (
        <div className={`relative inline-block ${className} ${blinking ? 'animate-pulse' : ''}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(239,68,68,0.7)]">
            {/* Aviator Helmet */}
            <circle cx="50" cy="50" r="40" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
            <path d="M 16 46 C 16 22, 84 22, 84 46" fill="#991b1b" stroke="#7f1d1d" strokeWidth="3" />
            {/* Pilot Goggles */}
            <circle cx="36" cy="38" r="14" fill="#0284c7" stroke="#1e293b" strokeWidth="3" />
            <circle cx="64" cy="38" r="14" fill="#0284c7" stroke="#1e293b" strokeWidth="3" />
            <line x1="48" y1="38" x2="52" y2="38" stroke="#1e293b" strokeWidth="4" />
            {/* Goggle shine */}
            <ellipse cx="33" cy="34" rx="4" ry="7" fill="#bae6fd" transform="rotate(-30 33 34)" />
            <ellipse cx="61" cy="34" rx="4" ry="7" fill="#bae6fd" transform="rotate(-30 61 34)" />
            {/* Duck Cheeks & Beak */}
            <circle cx="28" cy="58" r="8" fill="#f87171" opacity="0.6" />
            <circle cx="72" cy="58" r="8" fill="#f87171" opacity="0.6" />
            <ellipse cx="50" cy="62" rx="22" ry="12" fill="#ea580c" stroke="#c2410c" strokeWidth="3" />
            {/* Scarf fluttering */}
            <path d="M 28 80 Q 50 88 72 80 L 80 94 L 66 90 L 50 96 L 34 90 L 20 94 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
            {/* Flight wings badge */}
            <text x="50" y="24" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="900">✈️ VIP</text>
          </svg>
        </div>
      );

    case 'ape':
      return (
        <div className={`relative inline-block ${className} ${blinking ? 'animate-bounce' : ''}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_14px_rgba(168,85,247,0.7)]">
            {/* Diamond Hands Ape Head */}
            <circle cx="50" cy="50" r="42" fill="#713f12" stroke="#451a03" strokeWidth="4" />
            {/* Ears */}
            <circle cx="12" cy="50" r="12" fill="#a16207" stroke="#451a03" strokeWidth="3" />
            <circle cx="88" cy="50" r="12" fill="#a16207" stroke="#451a03" strokeWidth="3" />
            {/* Muzzle */}
            <ellipse cx="50" cy="64" rx="26" ry="18" fill="#ca8a04" stroke="#713f12" strokeWidth="3" />
            {/* Laser Diamond Glasses */}
            <polygon points="26,38 48,38 42,54 22,54" fill="#a855f7" stroke="#3b0764" strokeWidth="2" />
            <polygon points="52,38 74,38 78,54 58,54" fill="#a855f7" stroke="#3b0764" strokeWidth="2" />
            <line x1="46" y1="42" x2="54" y2="42" stroke="#3b0764" strokeWidth="3" />
            {/* Mouth */}
            <path d="M 38 70 Q 50 78 62 70" stroke="#451a03" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Gold Crown */}
            <polygon points="28,20 38,4 50,18 62,4 72,20" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="38" cy="8" r="3" fill="#ef4444" />
            <circle cx="50" cy="18" r="3" fill="#3b82f6" />
            <circle cx="62" cy="8" r="3" fill="#10b981" />
            {/* Diamond icon in hand */}
            <polygon points="50,86 42,94 50,102 58,94" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" className="animate-spin origin-center" />
          </svg>
        </div>
      );

    case 'frog':
      return (
        <div className={`relative inline-block ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(34,197,94,0.7)]">
            {/* Pepe / Cyber Frog Face */}
            <ellipse cx="50" cy="54" rx="42" ry="34" fill="#22c55e" stroke="#15803d" strokeWidth="4" />
            {/* Big Bulging Eyes */}
            <circle cx="32" cy="28" r="16" fill="#fef08a" stroke="#15803d" strokeWidth="4" />
            <circle cx="68" cy="28" r="16" fill="#fef08a" stroke="#15803d" strokeWidth="4" />
            {/* Pupils with Dollar signs */}
            <text x="32" y="34" textAnchor="middle" fill="#15803d" fontSize="18" fontWeight="900">$</text>
            <text x="68" y="34" textAnchor="middle" fill="#15803d" fontSize="18" fontWeight="900">$</text>
            {/* Smug Frog Smile */}
            <path d="M 20 62 Q 50 82 80 62" stroke="#166534" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Cyber Visor Beam */}
            <line x1="16" y1="28" x2="84" y2="28" stroke="#ef4444" strokeWidth="3" opacity="0.8" className="animate-pulse" />
            {/* Golden Hypno Coin */}
            <circle cx="50" cy="88" r="8" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
            <text x="50" y="92" textAnchor="middle" fill="#78350f" fontSize="10" fontWeight="bold">777</text>
          </svg>
        </div>
      );

    case 'piggy':
      return (
        <div className={`relative inline-block ${className} ${blinking ? 'animate-bounce' : ''}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(244,63,94,0.7)]">
            {/* Golden Piggy Bank */}
            <circle cx="50" cy="52" r="40" fill="#f43f5e" stroke="#be123c" strokeWidth="4" />
            {/* Ears */}
            <polygon points="24,24 38,10 44,28" fill="#fb7185" stroke="#be123c" strokeWidth="3" />
            <polygon points="76,24 62,10 56,28" fill="#fb7185" stroke="#be123c" strokeWidth="3" />
            {/* Snout */}
            <ellipse cx="50" cy="58" rx="16" ry="12" fill="#fda4af" stroke="#e11d48" strokeWidth="3" />
            <circle cx="44" cy="58" r="3" fill="#be123c" />
            <circle cx="56" cy="58" r="3" fill="#be123c" />
            {/* Star Eyes */}
            <text x="34" y="44" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold">★</text>
            <text x="66" y="44" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold">★</text>
            {/* Coin Slot on Top */}
            <rect x="42" y="16" width="16" height="4" rx="2" fill="#881337" />
            {/* Gold coins dropping */}
            <circle cx="50" cy="10" r="6" fill="#fbbf24" stroke="#d97706" strokeWidth="2" className="animate-bounce" />
          </svg>
        </div>
      );

    case 'leprechaun':
      return (
        <div className={`relative inline-block ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(234,179,8,0.8)]">
            {/* Face */}
            <circle cx="50" cy="56" r="34" fill="#fed7aa" stroke="#c2410c" strokeWidth="3" />
            {/* Red Beard */}
            <path d="M 20 54 Q 50 96 80 54 Q 70 98 50 98 Q 30 98 20 54" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
            {/* Green Hat */}
            <polygon points="12,38 88,38 78,12 22,12" fill="#15803d" stroke="#166534" strokeWidth="3" />
            <rect x="18" y="32" width="64" height="6" fill="#18181b" />
            <rect x="44" y="30" width="12" height="10" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
            {/* Eyes */}
            <circle cx="38" cy="50" r="4" fill="#18181b" />
            <circle cx="62" cy="50" r="4" fill="#18181b" />
            {/* 4-Leaf Clover badge */}
            <text x="50" y="26" textAnchor="middle" fill="#4ade80" fontSize="14">🍀</text>
          </svg>
        </div>
      );

    default:
      return null;
  }
};

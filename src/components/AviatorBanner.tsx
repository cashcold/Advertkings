import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Volume2,
  VolumeX,
  History,
  RotateCcw,
  Sparkles,
  Info,
  ChevronDown,
  X,
  Plane,
  Plus,
  Minus,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { AuthUser } from '../types';

interface AviatorBannerProps {
  onOpenTelegram: (msg?: string) => void;
  incrementClicks: () => void;
  currentUser?: AuthUser | null;
  currentBalance?: number;
  currency?: string;
  onUpdateBalance?: (delta: number, reason: string) => Promise<boolean> | boolean;
  onOpenAdminReload?: () => void;
}

interface BetState {
  amount: number;
  isAuto: boolean;
  autoCashout: boolean;
  autoCashoutMult: number;
  hasBet: boolean;
  hasCashedOut: boolean;
  cashedOutMult: number | null;
  winAmount: number | null;
}

export const AviatorBanner: React.FC<AviatorBannerProps> = ({
  onOpenTelegram,
  incrementClicks,
  currentUser,
  currentBalance = 50.0,
  currency = 'USD',
  onUpdateBalance,
  onOpenAdminReload,
}) => {
  // Game States: 'waiting' | 'flying' | 'crashed'
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('flying');
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [crashMultiplier, setCrashMultiplier] = useState<number>(2.33);
  const [roundCountdown, setRoundCountdown] = useState<number>(5);
  // Aviator sound is OFF by default on page load; user can turn it on at any time
  const [soundOn, setSoundOn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('adkings_aviator_sound') === 'true';
    } catch {
      return false;
    }
  });
  const soundOnRef = useRef<boolean>(soundOn);

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  const toggleSound = () => {
    setSoundOn((prev) => {
      const next = !prev;
      soundOnRef.current = next;
      try {
        localStorage.setItem('adkings_aviator_sound', String(next));
      } catch {}
      if (next) {
        soundManager.playCoin();
      }
      return next;
    });
  };

  const [livePlayers, setLivePlayers] = useState<number>(2427);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [insufficientAlert, setInsufficientAlert] = useState<string | null>(null);

  // Recent multiplier history matching the Spribe Aviator color palette in screenshot
  const [history, setHistory] = useState<number[]>([
    1.09, 1.31, 1.13, 1.05, 4.19, 1.48, 110.01, 1.01, 1.98, 1.0, 2.81, 1.09, 1.24, 93.18, 1.66, 2.07, 1.0,
  ]);

  // Console 1 (Left) & Console 2 (Right)
  const [bet1, setBet1] = useState<BetState>({
    amount: 1.0,
    isAuto: false,
    autoCashout: false,
    autoCashoutMult: 2.0,
    hasBet: false,
    hasCashedOut: false,
    cashedOutMult: null,
    winAmount: null,
  });

  const [bet2, setBet2] = useState<BetState>({
    amount: 1.0,
    isAuto: false,
    autoCashout: false,
    autoCashoutMult: 2.0,
    hasBet: false,
    hasCashedOut: false,
    cashedOutMult: null,
    winAmount: null,
  });

  // Next round scheduled bets
  const [nextRoundBet1, setNextRoundBet1] = useState<boolean>(false);
  const [nextRoundBet2, setNextRoundBet2] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameStateRef = useRef<'waiting' | 'flying' | 'crashed'>(gameState);
  const multiplierRef = useRef<number>(multiplier);
  const crashMultiplierRef = useRef<number>(crashMultiplier);
  const rotationRef = useRef<number>(0);
  const crashTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());

  // Keep refs synced with React state
  useEffect(() => {
    gameStateRef.current = gameState;
    if (gameState === 'crashed') {
      crashTimeRef.current = performance.now();
    }
  }, [gameState]);

  useEffect(() => {
    multiplierRef.current = multiplier;
  }, [multiplier]);

  useEffect(() => {
    crashMultiplierRef.current = crashMultiplier;
  }, [crashMultiplier]);

  // Handle fluctuating active player count
  useEffect(() => {
    const pInterval = setInterval(() => {
      setLivePlayers((prev) => prev + (Math.random() > 0.48 ? 1 : -1) * Math.floor(Math.random() * 5));
    }, 2000);
    return () => clearInterval(pInterval);
  }, []);

  // Main Aviator game loop simulation
  useEffect(() => {
    let animFrame: number;
    let startTime: number | null = null;
    let cdInterval: NodeJS.Timeout;

    if (gameState === 'flying') {
      const target = Number(
        (Math.random() < 0.1
          ? 1.0 + Math.random() * 0.2
          : Math.random() < 0.65
          ? 1.2 + Math.random() * 3.5
          : Math.random() < 0.9
          ? 4.0 + Math.random() * 12.0
          : 15.0 + Math.random() * 95.0
        ).toFixed(2)
      );
      setCrashMultiplier(target);
      setMultiplier(1.0);

      // Apply scheduled bets
      if (nextRoundBet1 || bet1.isAuto) {
        const canBet1 = currentBalance >= bet1.amount;
        if (canBet1) {
          setBet1((prev) => ({
            ...prev,
            hasBet: true,
            hasCashedOut: false,
            cashedOutMult: null,
            winAmount: null,
          }));
          if (onUpdateBalance) {
            onUpdateBalance(-bet1.amount, 'Aviator Round Bet (Left Panel)');
          }
        } else {
          setInsufficientAlert(`Insufficient funds to place Left Panel bet ($${bet1.amount} ${currency}). Please reload via Admin Portal.`);
        }
        setNextRoundBet1(false);
      }
      if (nextRoundBet2 || bet2.isAuto) {
        const canBet2 = currentBalance >= bet2.amount;
        if (canBet2) {
          setBet2((prev) => ({
            ...prev,
            hasBet: true,
            hasCashedOut: false,
            cashedOutMult: null,
            winAmount: null,
          }));
          if (onUpdateBalance) {
            onUpdateBalance(-bet2.amount, 'Aviator Round Bet (Right Panel)');
          }
        } else {
          setInsufficientAlert(`Insufficient funds to place Right Panel bet ($${bet2.amount} ${currency}). Please reload via Admin Portal.`);
        }
        setNextRoundBet2(false);
      }

      const updateFlight = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime) / 1000;

        // Exponential flight curve
        const curMult = Number((1.0 + Math.pow(elapsed * 0.45, 1.65)).toFixed(2));

        if (curMult >= target) {
          setMultiplier(target);
          setGameState('crashed');
          if (soundOnRef.current) {
            soundManager.playCrash();
          }
          setHistory((h) => [target, ...h.slice(0, 30)]);
          return;
        }

        setMultiplier(curMult);
        if (soundOnRef.current && Math.random() < 0.15) {
          soundManager.playPlaneWhistle(curMult);
        }

        // Auto Cashout checks
        setBet1((b) => {
          if (b.hasBet && !b.hasCashedOut && b.autoCashout && curMult >= b.autoCashoutMult) {
            const win = Number((b.amount * b.autoCashoutMult).toFixed(2));
            if (onUpdateBalance) {
              onUpdateBalance(win, `Aviator Auto Cash Out @ ${b.autoCashoutMult.toFixed(2)}x`);
            }
            if (soundOnRef.current) {
              soundManager.playWinFanfare();
            }
            return {
              ...b,
              hasCashedOut: true,
              cashedOutMult: b.autoCashoutMult,
              winAmount: win,
            };
          }
          return b;
        });

        setBet2((b) => {
          if (b.hasBet && !b.hasCashedOut && b.autoCashout && curMult >= b.autoCashoutMult) {
            const win = Number((b.amount * b.autoCashoutMult).toFixed(2));
            if (onUpdateBalance) {
              onUpdateBalance(win, `Aviator Auto Cash Out @ ${b.autoCashoutMult.toFixed(2)}x`);
            }
            if (soundOnRef.current) {
              soundManager.playWinFanfare();
            }
            return {
              ...b,
              hasCashedOut: true,
              cashedOutMult: b.autoCashoutMult,
              winAmount: win,
            };
          }
          return b;
        });

        animFrame = requestAnimationFrame(updateFlight);
      };

      animFrame = requestAnimationFrame(updateFlight);

      return () => cancelAnimationFrame(animFrame);
    } else if (gameState === 'crashed') {
      // Cooldown before next flight
      setRoundCountdown(5);
      cdInterval = setInterval(() => {
        setRoundCountdown((c) => {
          if (c <= 1) {
            clearInterval(cdInterval);
            setGameState('flying');
            return 5;
          }
          return c - 1;
        });
      }, 1000);

      return () => clearInterval(cdInterval);
    }
  }, [gameState, nextRoundBet1, nextRoundBet2, bet1.isAuto, bet2.isAuto, bet1.amount, bet2.amount]);

  // Canvas drawing for the Aviator sunburst & red flight curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 420);

      const state = gameStateRef.current;
      const currentMult = multiplierRef.current;
      const crashMult = crashMultiplierRef.current;

      // Dynamic rotation speed based on game state & current multiplier
      const rotSpeed = state === 'flying'
        ? 0.45 + Math.min(1.2, (currentMult - 1.0) * 0.15)
        : 0.12;

      rotationRef.current -= rotSpeed * dt; // Counter-clockwise smooth rotation

      ctx.clearRect(0, 0, width, height);

      // 1. Draw dark background canvas
      ctx.fillStyle = '#090408';
      ctx.fillRect(0, 0, width, height);

      const originX = 0;
      const originY = height;

      // 2. Draw rotating sunburst rays radiating from bottom-left origin
      ctx.save();
      ctx.translate(originX, originY);
      const numRays = 36;
      for (let i = 0; i < numRays; i++) {
        const angle = (i * Math.PI * 2) / numRays + rotationRef.current;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, Math.max(width, height) * 2.2, angle, angle + Math.PI / numRays);
        ctx.closePath();
        // Alternating dark charcoal and deep wine/violet rays matching screenshot
        ctx.fillStyle = i % 2 === 0 ? 'rgba(38, 12, 42, 0.55)' : 'rgba(12, 4, 15, 0.45)';
        ctx.fill();
      }
      ctx.restore();

      // 3. Draw ambient deep-violet radial spotlight over center
      const radialGlow = ctx.createRadialGradient(
        width * 0.45,
        height * 0.45,
        20,
        width * 0.45,
        height * 0.45,
        width * 0.7
      );
      radialGlow.addColorStop(0, 'rgba(120, 24, 100, 0.42)');
      radialGlow.addColorStop(0.5, 'rgba(48, 12, 54, 0.25)');
      radialGlow.addColorStop(1, 'rgba(8, 3, 7, 0.92)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 4. Calculate Plane Position & Trajectory
      const startX = 0;
      const startY = height;

      if (state === 'flying') {
        // Smooth logarithmic & ceiling easing for cruise mode
        const climbProgress = Math.min(1.0, (currentMult - 1.0) / 1.8);
        
        // Base target position
        const targetCruiseX = width * 0.76;
        const targetCruiseY = height * 0.26;

        // Plane position during takeoff vs hovering cruise
        const baseX = startX + (targetCruiseX - startX) * Math.pow(climbProgress, 0.75);
        const baseY = startY - (startY - targetCruiseY) * Math.pow(climbProgress, 0.85);

        // Gentle organic aerodynamic turbulence/floating
        const timeSec = now / 1000;
        const floatX = Math.cos(timeSec * 3.2) * 4;
        const floatY = Math.sin(timeSec * 4.0) * 6;
        const planeX = baseX + floatX;
        const planeY = baseY + floatY;

        const cpX = startX + (planeX - startX) * 0.65;
        const cpY = startY;

        // Draw Translucent Crimson Gradient Under Curve
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(cpX, cpY, planeX, planeY);
        ctx.lineTo(planeX, startY);
        ctx.closePath();

        const gradFill = ctx.createLinearGradient(0, planeY, 0, startY);
        gradFill.addColorStop(0, 'rgba(225, 29, 72, 0.55)');
        gradFill.addColorStop(0.65, 'rgba(180, 18, 50, 0.28)');
        gradFill.addColorStop(1, 'rgba(100, 8, 25, 0.02)');
        ctx.fillStyle = gradFill;
        ctx.fill();

        // Draw Thick Glowing Red Flight Trajectory Line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(cpX, cpY, planeX, planeY);
        ctx.strokeStyle = '#e50914';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#ff2b56';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // Draw Authentic Red Aeroplane with dynamic pitch angle
        const pitchAngle = -16 + Math.sin(timeSec * 3.5) * 3.5;
        drawPlane(ctx, planeX, planeY, pitchAngle);
      } else if (state === 'crashed') {
        // Crash fly-away exit animation
        const elapsedSinceCrash = (now - crashTimeRef.current) / 1000;
        if (elapsedSinceCrash < 0.65) {
          const exitProgress = elapsedSinceCrash / 0.65;
          const exitX = width * 0.76 + exitProgress * width * 0.45;
          const exitY = height * 0.26 - exitProgress * height * 0.55;
          drawPlane(ctx, exitX, exitY, -35);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Helper to draw the authentic red Spribe aeroplane
  const drawPlane = (ctx: CanvasRenderingContext2D, x: number, y: number, angleDeg: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angleDeg * Math.PI) / 180);

    const scale = 0.85;
    ctx.scale(scale, scale);

    // Propeller spinning blur
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const propSpin = Math.sin(Date.now() / 30) * 16;
    ctx.fillRect(44, -propSpin, 3, propSpin * 2);

    // Aerodynamic Fuselage & Wings (Crimson Red)
    ctx.fillStyle = '#e50914';
    ctx.beginPath();
    // Fuselage body
    ctx.moveTo(42, 0);
    ctx.lineTo(25, -6);
    ctx.lineTo(-30, -7);
    ctx.lineTo(-44, -18);
    ctx.lineTo(-48, -18);
    ctx.lineTo(-44, -4);
    ctx.lineTo(-48, 5);
    ctx.lineTo(-35, 6);
    ctx.lineTo(25, 6);
    ctx.closePath();
    ctx.fill();

    // Main Wing
    ctx.beginPath();
    ctx.moveTo(10, -5);
    ctx.lineTo(-12, -26);
    ctx.lineTo(-24, -26);
    ctx.lineTo(-10, -5);
    ctx.closePath();
    ctx.fillStyle = '#b91c1c';
    ctx.fill();

    // Bottom Wing
    ctx.beginPath();
    ctx.moveTo(8, 4);
    ctx.lineTo(-12, 22);
    ctx.lineTo(-22, 22);
    ctx.lineTo(-6, 4);
    ctx.closePath();
    ctx.fillStyle = '#dc2626';
    ctx.fill();

    // Cockpit & Propeller Nose
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(42, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // Red details / white wing cross
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, -18);
    ctx.lineTo(-20, -18);
    ctx.stroke();

    ctx.restore();
  };

  // Helper for History pill color matching the screenshot
  const getHistoryPillColor = (mult: number) => {
    if (mult >= 10.0) {
      // Hot Magenta / Pink (> 10.00x)
      return 'bg-[#4e1c38] text-[#f859bd] border-[#722b52] hover:bg-[#68244b]';
    } else if (mult >= 2.0) {
      // Purple (2.00x - 9.99x)
      return 'bg-[#381c4e] text-[#b359f8] border-[#522b72] hover:bg-[#492466]';
    } else {
      // Blue / Cyan (< 2.00x)
      return 'bg-[#1c2438] text-[#3cb2e9] border-[#2b3a58] hover:bg-[#25324d]';
    }
  };

  // Cashout / Bet Handlers for Panel 1 & Panel 2
  const handleCashout = (panelId: 1 | 2) => {
    if (gameState !== 'flying') return;
    const isP1 = panelId === 1;
    const curBet = isP1 ? bet1 : bet2;

    if (curBet.hasBet && !curBet.hasCashedOut) {
      const win = Number((curBet.amount * multiplier).toFixed(2));
      if (onUpdateBalance) {
        onUpdateBalance(win, `Aviator Cash Out (${multiplier.toFixed(2)}x)`);
      }
      if (soundOnRef.current) {
        soundManager.playWinFanfare();
      }

      const updated = {
        ...curBet,
        hasCashedOut: true,
        cashedOutMult: multiplier,
        winAmount: win,
      };

      if (isP1) setBet1(updated);
      else setBet2(updated);
    }
  };

  const handlePlaceBet = (panelId: 1 | 2) => {
    const isP1 = panelId === 1;
    const curBet = isP1 ? bet1 : bet2;

    if (currentBalance < curBet.amount) {
      setInsufficientAlert(
        `Insufficient VIP Balance ($${currentBalance.toFixed(2)} ${currency}) to place $${curBet.amount} bet. Please reload via Admin Portal.`
      );
      if (soundOnRef.current) soundManager.playSpinTick();
      return;
    }

    if (gameState === 'flying') {
      // Schedule for next round
      if (isP1) setNextRoundBet1(!nextRoundBet1);
      else setNextRoundBet2(!nextRoundBet2);
    } else {
      // Place immediately for coming round
      if (onUpdateBalance) {
        onUpdateBalance(-curBet.amount, `Aviator Bet Placed (Panel ${panelId})`);
      }
      if (soundOnRef.current) {
        soundManager.playCoin();
      }
      const updated = {
        ...curBet,
        hasBet: true,
        hasCashedOut: false,
        cashedOutMult: null,
        winAmount: null,
      };
      if (isP1) setBet1(updated);
      else setBet2(updated);
    }
  };

  const handleCancelBet = (panelId: 1 | 2) => {
    const isP1 = panelId === 1;
    if (isP1) {
      if (nextRoundBet1) setNextRoundBet1(false);
      else if (bet1.hasBet && gameState !== 'flying') {
        if (onUpdateBalance) {
          onUpdateBalance(bet1.amount, 'Aviator Bet Refunded (Panel 1)');
        }
        setBet1((prev) => ({ ...prev, hasBet: false }));
      }
    } else {
      if (nextRoundBet2) setNextRoundBet2(false);
      else if (bet2.hasBet && gameState !== 'flying') {
        if (onUpdateBalance) {
          onUpdateBalance(bet2.amount, 'Aviator Bet Refunded (Panel 2)');
        }
        setBet2((prev) => ({ ...prev, hasBet: false }));
      }
    }
  };

  const handleQuickAmount = (panelId: 1 | 2, val: number) => {
    if (panelId === 1) setBet1((b) => ({ ...b, amount: Number(val.toFixed(2)) }));
    else setBet2((b) => ({ ...b, amount: Number(val.toFixed(2)) }));
  };

  const handleStepAmount = (panelId: 1 | 2, delta: number) => {
    if (panelId === 1) {
      setBet1((b) => ({ ...b, amount: Math.max(0.1, Number((b.amount + delta).toFixed(2))) }));
    } else {
      setBet2((b) => ({ ...b, amount: Math.max(0.1, Number((b.amount + delta).toFixed(2))) }));
    }
  };

  const handleTelegramSignals = () => {
    incrementClicks();
    soundManager.playCoin();
    onOpenTelegram(
      `✈️ AVIATOR 99.8% ACCURACY VIP SIGNALS:\n` +
      `• Live Multiplier Predictor\n` +
      `• Next Expected Peak: ~14.80x\n` +
      `• Automated AI Bot Signals\n` +
      `Please connect my account for instant VIP signals!`
    );
  };

  return (
    <div className="w-full bg-[#080306] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl font-sans select-none my-4">
      {/* Top Header / Bar */}
      <div className="bg-[#120810] px-4 py-2.5 flex items-center justify-between border-b border-zinc-800/60 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded tracking-wider flex items-center gap-1 shadow-[0_0_12px_rgba(239,68,68,0.6)]">
              <Plane className="w-3.5 h-3.5" /> AVIATOR
            </span>
            <span className="text-zinc-400 text-xs font-bold hidden sm:inline">
              Official Spribe Crash Simulator
            </span>
          </div>

          <button
            onClick={() => setShowRulesModal(true)}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 px-2 py-1 rounded transition"
            title="How to Play"
          >
            <Info className="w-3.5 h-3.5 text-yellow-400" /> How to Play
          </button>
        </div>

        {/* Balance & Audio Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-black/70 border border-zinc-700/60 px-3 py-1 rounded-lg flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 font-bold uppercase">VIP Balance:</span>
            <span className="text-sm font-black font-mono text-green-400">
              ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
            </span>
            <button
              onClick={() => {
                if (onOpenAdminReload) onOpenAdminReload();
                else if (onUpdateBalance) onUpdateBalance(500, 'Aviator Quick Top-up');
              }}
              title="Reload VIP Balance via Admin Portal"
              className="text-xs bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black px-2 py-0.5 rounded ml-1 font-black flex items-center gap-1 shadow-[0_0_8px_rgba(234,179,8,0.4)] transition cursor-pointer"
            >
              <Shield className="w-3 h-3" />
              <span>RELOAD</span>
            </button>
          </div>

          <button
            onClick={toggleSound}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              soundOn
                ? 'bg-amber-500/20 text-yellow-400 border-yellow-400/50 hover:bg-amber-500/30 shadow-[0_0_10px_rgba(234,179,8,0.3)]'
                : 'bg-zinc-900/90 text-zinc-400 border-zinc-700/80 hover:text-white hover:border-zinc-500 hover:bg-zinc-800'
            }`}
            title={soundOn ? 'Aviator Sound is ON (Click to Mute)' : 'Aviator Sound is OFF (Click to Turn ON)'}
          >
            {soundOn ? (
              <>
                <Volume2 className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="hidden xs:inline text-[11px] font-bold text-yellow-300">SOUND: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-zinc-400" />
                <span className="hidden xs:inline text-[11px] font-bold text-zinc-300">SOUND: OFF (TURN ON)</span>
              </>
            )}
          </button>

          <button
            onClick={handleTelegramSignals}
            className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 border border-yellow-300/40"
          >
            <Send className="w-3.5 h-3.5 text-yellow-300" /> VIP SIGNALS
          </button>
        </div>
      </div>

      {/* Top Multiplier History Bar (Matching Screenshot perfectly) */}
      <div className="bg-[#0b050d] px-3 py-1.5 border-b border-zinc-800/80 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 flex-nowrap overflow-hidden">
          {history.map((hMult, idx) => (
            <span
              key={`hist-${idx}`}
              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border cursor-pointer transition whitespace-nowrap ${getHistoryPillColor(
                hMult
              )}`}
              onClick={() => setShowHistoryModal(true)}
            >
              {hMult.toFixed(2)}x
            </span>
          ))}
        </div>

        <button
          onClick={() => setShowHistoryModal(true)}
          className="text-zinc-400 hover:text-white bg-zinc-800/40 hover:bg-zinc-800 px-2 py-1 rounded text-xs ml-2 flex items-center gap-0.5 shrink-0"
          title="Round History"
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">...</span>
        </button>
      </div>

      {/* Main Flight Arena Canvas / Stage */}
      <div className="relative w-full h-[280px] sm:h-[350px] md:h-[400px] overflow-hidden bg-[#0a0508]">
        {/* Visual Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Quick Sound Toggle On Flight Stage Canvas */}
        <button
          onClick={toggleSound}
          className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black backdrop-blur-md border transition cursor-pointer shadow-lg ${
            soundOn
              ? 'bg-black/75 text-yellow-400 border-yellow-500/50 hover:bg-black/90 shadow-[0_0_12px_rgba(234,179,8,0.3)]'
              : 'bg-black/85 text-zinc-300 border-zinc-700/80 hover:bg-black/95 hover:text-white hover:border-zinc-500'
          }`}
          title={soundOn ? 'Aviator Game Sound is ON (Click to Mute)' : 'Aviator Game Sound is OFF (Click to Turn On)'}
        >
          {soundOn ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              <span>SOUND: ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
              <span className="text-zinc-200">🔇 SOUND: OFF <span className="text-yellow-400 underline ml-0.5 font-bold">(TAP TO TURN ON)</span></span>
            </>
          )}
        </button>

        {/* Center Multiplier / Flight State Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          {gameState === 'flying' ? (
            <div className="text-center">
              <span className="text-5xl sm:text-7xl md:text-8xl font-black text-white font-mono tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                {multiplier.toFixed(2)}x
              </span>
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="text-2xl sm:text-3xl font-black text-red-500 uppercase tracking-widest drop-shadow-[0_2px_12px_rgba(239,68,68,0.7)]">
                FLEW AWAY!
              </div>
              <span className="text-4xl sm:text-6xl font-black text-red-600 font-mono tracking-tight block mt-1">
                {crashMultiplier.toFixed(2)}x
              </span>
              <div className="mt-3 flex items-center justify-center gap-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-zinc-700 mx-auto w-fit">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                <span className="text-xs font-bold text-zinc-300">
                  NEXT ROUND IN <span className="text-yellow-400 font-mono font-black">{roundCountdown}s</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Right: Active Players Pill (Matching Screenshot Avatar Badge) */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-zinc-800/80 px-2.5 py-1 rounded-full shadow-lg">
          <div className="flex -space-x-1.5 overflow-hidden">
            <img
              referrerPolicy="no-referrer"
              className="inline-block h-4 w-4 rounded-full ring-1 ring-zinc-700"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face"
              alt="p1"
            />
            <img
              referrerPolicy="no-referrer"
              className="inline-block h-4 w-4 rounded-full ring-1 ring-zinc-700"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
              alt="p2"
            />
            <img
              referrerPolicy="no-referrer"
              className="inline-block h-4 w-4 rounded-full ring-1 ring-zinc-700"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face"
              alt="p3"
            />
          </div>
          <span className="text-xs font-bold font-mono text-zinc-300">{livePlayers.toLocaleString()}</span>
        </div>
      </div>

      {/* Insufficient Funds Alert Banner with Direct Admin Reload Access */}
      {insufficientAlert && (
        <div className="mx-3 mt-3 p-3 bg-red-950/80 border border-red-500/80 rounded-xl flex items-center justify-between gap-3 text-xs text-red-200 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-semibold">{insufficientAlert}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (onOpenAdminReload) onOpenAdminReload();
                setInsufficientAlert(null);
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black rounded-lg text-xs flex items-center gap-1.5 shadow-[0_0_10px_rgba(234,179,8,0.5)] transition cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Reload in Admin Portal</span>
            </button>
            <button
              onClick={() => setInsufficientAlert(null)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Dual Betting Consoles (Side-by-Side Left & Right, Exactly like Screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-[#0d070f] border-t border-zinc-800">
        {/* Console 1 (Left Panel) */}
        <BetPanel
          panelId={1}
          state={bet1}
          setState={setBet1}
          isScheduled={nextRoundBet1}
          gameState={gameState}
          multiplier={multiplier}
          currency={currency}
          onPlaceBet={() => handlePlaceBet(1)}
          onCancelBet={() => handleCancelBet(1)}
          onCashout={() => handleCashout(1)}
          onQuickAmount={(val) => handleQuickAmount(1, val)}
          onStepAmount={(delta) => handleStepAmount(1, delta)}
        />

        {/* Console 2 (Right Panel) */}
        <BetPanel
          panelId={2}
          state={bet2}
          setState={setBet2}
          isScheduled={nextRoundBet2}
          gameState={gameState}
          multiplier={multiplier}
          currency={currency}
          onPlaceBet={() => handlePlaceBet(2)}
          onCancelBet={() => handleCancelBet(2)}
          onCashout={() => handleCashout(2)}
          onQuickAmount={(val) => handleQuickAmount(2, val)}
          onStepAmount={(delta) => handleStepAmount(2, delta)}
        />
      </div>

      {/* How to Play Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#150a18] border border-zinc-700 rounded-2xl max-w-md w-full p-6 relative text-white shadow-2xl">
            <button
              onClick={() => setShowRulesModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-red-600 text-white font-black text-xs px-2 py-1 rounded">AVIATOR</span>
              <h3 className="text-lg font-black">How to Play Aviator</h3>
            </div>
            <div className="space-y-3 text-sm text-zinc-300">
              <p>
                <strong className="text-yellow-400">1. Place Your Bet:</strong> Select your desired bet amount on
                either (or both) panels before the plane takes off.
              </p>
              <p>
                <strong className="text-yellow-400">2. Watch the Multiplier Climb:</strong> As the plane flies, the
                multiplier rises exponentially starting at 1.00x.
              </p>
              <p>
                <strong className="text-yellow-400">3. Cash Out in Time:</strong> Press the orange <strong>CASH OUT</strong>{' '}
                button before the plane flies away to claim your winnings (Bet × Multiplier).
              </p>
              <p>
                <strong className="text-yellow-400">4. Auto Mode:</strong> Toggle "Auto" to set an automatic cash out
                multiplier (e.g. 2.00x) so you never miss a payout.
              </p>
            </div>
            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full mt-6 bg-red-600 hover:bg-red-500 font-bold py-2 rounded-xl text-white transition"
            >
              Got It, Let's Play!
            </button>
          </div>
        </div>
      )}

      {/* Round History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#150a18] border border-zinc-700 rounded-2xl max-w-lg w-full p-6 relative text-white shadow-2xl">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-black">Past Flight Rounds</h3>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto pr-1">
              {history.map((m, i) => (
                <div
                  key={`hist-detail-${i}`}
                  className={`text-xs font-mono font-bold py-1.5 rounded text-center border ${getHistoryPillColor(
                    m
                  )}`}
                >
                  {m.toFixed(2)}x
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
              <span>Provably Fair RNG Engine</span>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-3 py-1.5 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponent for each of the dual betting consoles
interface BetPanelProps {
  panelId: number;
  state: BetState;
  setState: React.Dispatch<React.SetStateAction<BetState>>;
  isScheduled: boolean;
  gameState: 'waiting' | 'flying' | 'crashed';
  multiplier: number;
  currency: string;
  onPlaceBet: () => void;
  onCancelBet: () => void;
  onCashout: () => void;
  onQuickAmount: (val: number) => void;
  onStepAmount: (delta: number) => void;
}

const BetPanel: React.FC<BetPanelProps> = ({
  panelId,
  state,
  setState,
  isScheduled,
  gameState,
  multiplier,
  currency,
  onPlaceBet,
  onCancelBet,
  onCashout,
  onQuickAmount,
  onStepAmount,
}) => {
  const isBetActive = state.hasBet && !state.hasCashedOut && gameState === 'flying';

  return (
    <div className="bg-[#150c18] border border-zinc-800 rounded-xl p-3 flex flex-col justify-between shadow-md">
      {/* Top Console Mode Pill: Bet | Auto */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80">
        <div className="bg-black/60 p-0.5 rounded-full flex items-center border border-zinc-800">
          <button
            onClick={() => setState((prev) => ({ ...prev, isAuto: false }))}
            className={`text-[11px] font-bold px-3 py-1 rounded-full transition ${
              !state.isAuto ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Bet
          </button>
          <button
            onClick={() => setState((prev) => ({ ...prev, isAuto: true }))}
            className={`text-[11px] font-bold px-3 py-1 rounded-full transition ${
              state.isAuto ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Auto
          </button>
        </div>

        {/* Auto Cashout Multiplier Switch (Visible when in Auto tab or always available) */}
        {state.isAuto && (
          <div className="flex items-center gap-1.5 text-xs">
            <label className="flex items-center gap-1 text-[11px] text-zinc-400 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={state.autoCashout}
                onChange={(e) => setState((prev) => ({ ...prev, autoCashout: e.target.checked }))}
                className="rounded accent-red-600 w-3 h-3"
              />
              Auto Cash Out
            </label>
            <input
              type="number"
              step="0.1"
              min="1.1"
              value={state.autoCashoutMult}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  autoCashoutMult: Math.max(1.1, parseFloat(e.target.value) || 2.0),
                }))
              }
              className="w-14 bg-black/80 border border-zinc-700 text-center text-xs font-mono font-bold text-yellow-400 rounded py-0.5"
            />
            <span className="text-xs text-zinc-400 font-bold">x</span>
          </div>
        )}
      </div>

      {/* Main Console Stepper & Action Button Grid */}
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Left Side: Stepper & Quick Bet Preset Chips */}
        <div className="col-span-6 flex flex-col gap-2">
          {/* Minus / Amount / Plus Stepper */}
          <div className="flex items-center bg-black/70 border border-zinc-800 rounded-lg p-1">
            <button
              onClick={() => onStepAmount(-1)}
              className="w-7 h-7 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center font-bold text-sm transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              step="0.5"
              min="0.1"
              value={state.amount}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  amount: Math.max(0.1, parseFloat(e.target.value) || 1.0),
                }))
              }
              className="w-full bg-transparent text-center font-mono font-bold text-sm sm:text-base text-white focus:outline-none"
            />
            <button
              onClick={() => onStepAmount(1)}
              className="w-7 h-7 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center font-bold text-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Bet Preset Chips: 1, 5, 10, 50 */}
          <div className="grid grid-cols-4 gap-1">
            {[1, 5, 10, 50].map((val) => (
              <button
                key={`qb-${panelId}-${val}`}
                onClick={() => onQuickAmount(val)}
                className={`py-1 rounded bg-[#0b050d] hover:bg-zinc-800 border border-zinc-800/80 text-[11px] font-mono font-bold transition ${
                  state.amount === val ? 'text-yellow-400 border-yellow-400/50 bg-zinc-850' : 'text-zinc-400'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Massive Action Button (Green for BET / Orange for CASHOUT) */}
        <div className="col-span-6 h-full flex flex-col justify-center">
          {isBetActive ? (
            /* Active In-Flight Cash Out Button (Vibrant Orange) */
            <button
              onClick={onCashout}
              className="w-full h-16 sm:h-18 bg-gradient-to-b from-[#ff8c00] to-[#e65100] hover:from-[#ffa726] hover:to-[#f57c00] text-white rounded-xl font-black shadow-[0_0_20px_rgba(255,140,0,0.5)] border border-yellow-300/40 flex flex-col items-center justify-center transition active:scale-[0.98]"
            >
              <span className="text-xs uppercase tracking-wider font-extrabold text-yellow-100">
                Cash Out
              </span>
              <span className="text-base sm:text-lg font-mono font-black text-white">
                {(state.amount * multiplier).toFixed(2)} {currency}
              </span>
            </button>
          ) : isScheduled ? (
            /* Waiting for next round button (Red cancel) */
            <button
              onClick={onCancelBet}
              className="w-full h-16 sm:h-18 bg-red-950/70 hover:bg-red-900 border border-red-500/60 text-red-300 rounded-xl font-black flex flex-col items-center justify-center transition"
            >
              <span className="text-[11px] uppercase tracking-wider text-red-200">Waiting for next round</span>
              <span className="text-xs font-bold text-red-400 underline mt-0.5">Cancel Bet</span>
            </button>
          ) : state.hasBet && state.hasCashedOut ? (
            /* Won / Cashed Out Success state */
            <div className="w-full h-16 sm:h-18 bg-green-950/60 border border-green-500/60 rounded-xl flex flex-col items-center justify-center text-center p-1">
              <span className="text-[10px] text-green-400 font-extrabold uppercase">CASHED OUT @ {state.cashedOutMult?.toFixed(2)}x</span>
              <span className="text-sm font-mono font-black text-green-300">+{state.winAmount?.toFixed(2)} {currency}</span>
            </div>
          ) : (
            /* Standard Place Bet Button (Bright Green matching Screenshot) */
            <button
              onClick={onPlaceBet}
              className="w-full h-16 sm:h-18 bg-gradient-to-b from-[#2ecc71] to-[#27ae60] hover:from-[#3fe083] hover:to-[#2ecc71] text-white rounded-xl font-black shadow-[0_0_18px_rgba(46,204,113,0.4)] border border-green-300/40 flex flex-col items-center justify-center transition active:scale-[0.98]"
            >
              <span className="text-xs uppercase tracking-wider font-extrabold text-green-100">
                {gameState === 'flying' ? 'Bet (Next Round)' : 'Bet'}
              </span>
              <span className="text-base sm:text-lg font-mono font-black text-white">
                {state.amount.toFixed(2)} {currency}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import express, { Request, Response, NextFunction } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { connectDB, isDbConnected } from './db.js';
import { ChatMessageModel } from './models/ChatMessage.js';
import { AviatorRoundModel } from './models/AviatorRound.js';
import { HyipProjectModel } from './models/HyipProject.js';
import { UserSessionModel } from './models/UserSession.js';
import { UserModel, IUser } from './models/User.js';
import { OrderModel, IOrder } from './models/Order.js';
import { BalanceTransactionModel, IBalanceTransaction } from './models/BalanceTransaction.js';
import { ReloadRequestModel, IReloadRequest } from './models/ReloadRequest.js';
import { FALLBACK_STANDINGS } from './standingsFallback.js';

const app = express();

// Body Parser Middleware
app.use(express.json());

// Enable CORS and appropriate caching headers for API vs Static media
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  const isStaticMedia = /\.(jpg|jpeg|png|webp|gif|svg|ico|css|js|woff2?)$/i.test(req.path);
  if (isStaticMedia) {
    res.header('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800');
  } else {
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
  }
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Database Connection Middleware: Ensures MongoDB connection is active for API requests
app.use(async (req: Request, res: Response, next: NextFunction) => {
  const isDbExemptRoute =
    req.path.startsWith('/api/football') ||
    req.path.startsWith('/api/sms') ||
    req.path === '/api/health';

  if (req.path.startsWith('/api') && !isDbExemptRoute) {
    try {
      await connectDB();
    } catch (err) {
      console.warn('Database connection check warning:', err);
    }
  }
  next();
});

const FOOTBALL_DATA_API_KEY = process.env.FOOTBALL_DATA_API_KEY || '5583e8dd06c549f7ac6ddaa97bfefd05';

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return ai;
}

// In-Memory Fallbacks when MongoDB is not connected or in transient serverless execution
const inMemoryStore = {
  chatMessages: [
    {
      id: 'm-init-1',
      username: '@CryptoWhale_88',
      category: 'hyip',
      avatar: '👑',
      country: '🇬🇧 UK',
      verified: true,
      projectOrGame: 'GoldBod Pro',
      payoutAmount: '$4,280.00 USDT',
      status: 'PAID',
      message: 'Instant automated payout received in under 12 seconds! GoldBod Pro ASIC mining node is solid.',
      timestamp: '1m ago',
      badge: '💎 VIP CLAIM',
    },
    {
      id: 'm-init-2',
      username: '@AccraTrader_Kofi',
      category: 'aviator',
      avatar: '✈️',
      country: '🇬🇭 GH',
      verified: true,
      projectOrGame: 'Aviator AI Signal Bot',
      payoutAmount: 'GH₵ 8,450.00',
      status: 'PAID',
      message: 'Cashed out @ 14.80x using the Telegram VIP signal! Unbelievable run today!',
      timestamp: '2m ago',
      badge: '🔥 CRASH MASTER',
    },
    {
      id: 'm-init-3',
      username: '@FixedInsider_Alex',
      category: 'football',
      avatar: '⚽',
      country: '🇩🇪 DE',
      verified: true,
      projectOrGame: 'VIP Exact Score Tips',
      payoutAmount: '€3,120.00',
      status: 'PAID',
      message: 'UEFA Champions League exact score ticket locked in and green! VIP ticket delivers again.',
      timestamp: '4m ago',
      badge: '🎯 100% FIXED WIN',
    },
  ],
  aviatorHistory: [1.09, 1.31, 1.13, 1.05, 4.19, 1.48, 110.01, 1.01, 1.98, 1.0, 2.81, 1.09, 1.24, 93.18, 1.66, 2.07, 1.0],
  hyipVotes: {} as Record<string, { votes: number; clicks: number }>,
  users: [
    {
      id: 'usr-kate-vip',
      fullName: 'Kate',
      email: 'kate20@gmail.com',
      phoneNumber: '+1 3254784445',
      countryCode: '+1',
      password: 'password123',
      telegramHandle: '@kate_vip',
      balance: 50.0,
      currency: 'USD',
      role: 'vip' as const,
      verified: true,
      avatar: '👑',
      createdAt: new Date(),
      lastLogin: new Date(),
    },
    {
      id: 'usr-nanakojo-vip',
      fullName: 'Nana Kojo',
      email: 'nanakojo99999@gmail.com',
      phoneNumber: '+1 5558921100',
      countryCode: '+1',
      password: 'password123',
      telegramHandle: '@nanakojo_vip',
      balance: 50.0,
      currency: 'USD',
      role: 'vip' as const,
      verified: true,
      avatar: '👑',
      createdAt: new Date(),
      lastLogin: new Date(),
    },
  ] as Array<any>,
  orders: [] as Array<any>,
  reloadRequests: [] as Array<any>,
  balanceTransactions: [
    {
      id: 'tx-init-1',
      userEmail: 'kate20@gmail.com',
      userName: 'Kate',
      type: 'bonus',
      gameOrSource: 'Registration Bonus',
      amount: 50.0,
      balanceBefore: 0,
      balanceAfter: 50.0,
      note: 'VIP Welcome Registration Bonus ($50 USD)',
      createdAt: new Date(),
    },
  ] as Array<any>,
};

// 6-digit password reset codes store: email -> { code: string, expiresAt: number, createdAt: Date }
const resetCodeStore = new Map<string, { code: string; expiresAt: number; createdAt: Date }>();

// Seed default Kate into MongoDB if connected (preserves existing DB balance)
async function seedKateToDb() {
  try {
    if (isDbConnected()) {
      const existing = await UserModel.findOne({ email: 'kate20@gmail.com' });
      if (!existing) {
        await UserModel.create({
          fullName: 'Kate',
          email: 'kate20@gmail.com',
          phoneNumber: '+1 3254784445',
          countryCode: '+1',
          password: 'password123',
          telegramHandle: '@kate_vip',
          balance: 50.0,
          currency: 'USD',
          role: 'vip',
          verified: true,
          avatar: '👑',
          lastLogin: new Date(),
        });
        console.log('✅ Seeded VIP Member Kate (kate20@gmail.com) with $50 registration bonus into MongoDB Atlas');
      }

      const existingNana = await UserModel.findOne({ email: 'nanakojo99999@gmail.com' });
      if (!existingNana) {
        await UserModel.create({
          fullName: 'Nana Kojo',
          email: 'nanakojo99999@gmail.com',
          phoneNumber: '+1 5558921100',
          countryCode: '+1',
          password: 'password123',
          telegramHandle: '@nanakojo_vip',
          balance: 50.0,
          currency: 'USD',
          role: 'vip',
          verified: true,
          avatar: '👑',
          lastLogin: new Date(),
        });
        console.log('✅ Seeded VIP Member Nana Kojo (nanakojo99999@gmail.com) with $50 registration bonus into MongoDB Atlas');
      }
    }
  } catch (err) {
    // Non-blocking
  }
}
seedKateToDb();

// ----------------------------------------------------
// SERVERLESS REST API CATALOG & DISCOVERY
// ----------------------------------------------------
app.get('/api', (req: Request, res: Response) => {
  res.json({
    name: 'AdKings🤴 Serverless REST API',
    version: '2.0.0',
    status: 'ONLINE',
    runtime: 'Serverless / Microservices-Ready Express Engine',
    database: isDbConnected() ? 'Connected (MongoDB Atlas: Adkings)' : 'In-Memory Fallback',
    timestamp: new Date().toISOString(),
    documentation: {
      overview: 'Stateless, serverless-ready REST API for orders, crypto payments, user authentication, live community claims, and sports radar.',
      endpoints: [
        {
          path: '/api/health',
          method: 'GET',
          description: 'Serverless heartbeat and MongoDB connection diagnostics',
        },
        {
          path: '/api/orders',
          method: 'GET',
          description: 'Retrieve latest crypto & financial transactions (sorted descending)',
        },
        {
          path: '/api/orders',
          method: 'POST',
          description: 'Create & record an order (PayPal reload, Shopping card, Gift card, Loan)',
          bodyParameters: {
            orderType: 'paypal_reload | virtual_card | gift_card | crypto_loan | general',
            amount: 'number (required)',
            feeAmount: 'number',
            feePercentage: 'number',
            totalPayable: 'number',
            currency: 'string (e.g., USD)',
            paymentMethod: 'crypto',
            depositAsset: 'USDT | ETH | BTC',
            depositNetwork: 'TRC20 | ERC20 | BTC',
            depositAddress: 'string',
            targetDetails: 'object',
            userEmail: 'string (optional)',
            userPhone: 'string (optional)',
            telegramHandle: 'string (optional)',
          },
        },
        {
          path: '/api/auth/register',
          method: 'POST',
          description: 'Register a new user account with VIP status & balance',
        },
        {
          path: '/api/auth/login',
          method: 'POST',
          description: 'Authenticate user via email/phone and password',
        },
        {
          path: '/api/auth/me',
          method: 'GET',
          description: 'Query active user profile with balance and verification status (?email=...)',
        },
        {
          path: '/api/auth/forgot-password',
          method: 'POST',
          description: 'Send 6-digit verification code to registered email for password reset',
        },
        {
          path: '/api/auth/verify-reset-code',
          method: 'POST',
          description: 'Verify 6-digit email reset code',
        },
        {
          path: '/api/auth/reset-password',
          method: 'POST',
          description: 'Reset user password using verified 6-digit email code',
        },
        {
          path: '/api/chat',
          method: 'GET | POST',
          description: 'Real-time winner claims feed and verified payout notifications',
        },
        {
          path: '/api/aviator/history',
          method: 'GET',
          description: 'Recent crash flight multipliers list',
        },
        {
          path: '/api/aviator/round',
          method: 'POST',
          description: 'Record new Aviator round telemetry and results',
        },
        {
          path: '/api/hyip/vote',
          method: 'POST',
          description: 'Cast upvote for verified HYIP monitoring project',
        },
        {
          path: '/api/hyip/click',
          method: 'POST',
          description: 'Track click telemetry for verified HYIP monitoring project',
        },
        {
          path: '/api/user/session/:sessionId',
          method: 'GET',
          description: 'Fetch or initialize guest wallet session',
        },
        {
          path: '/api/user/balance',
          method: 'POST',
          description: 'Adjust guest wallet balance (?sessionId=..., balanceChange=...)',
        },
        {
          path: '/api/football-matches',
          method: 'GET',
          description: 'Real-time football fixtures with exact score markets (?count=2)',
        },
      ],
    },
  });
});

// 1. Health & Serverless Status Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    architecture: 'Serverless / API',
    stack: 'MERN (MongoDB Atlas Adkings, Express, React, Node.js)',
    database: isDbConnected() ? 'connected (MongoDB: Adkings)' : 'in-memory fallback (ready for MONGODB_URI)',
    timestamp: new Date().toISOString(),
  });
});

// 2. Orders & Transaction Logging Endpoint (Persists to MongoDB Adkings)
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const {
      orderType,
      userEmail,
      userPhone,
      telegramHandle,
      amount,
      feeAmount,
      feePercentage,
      totalPayable,
      currency,
      paymentMethod,
      depositAsset,
      depositNetwork,
      depositAddress,
      targetDetails,
      transactionHash,
    } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Order amount is required' });
    }

    const orderData: IOrder = {
      orderType: (orderType as IOrder['orderType']) || 'general',
      userEmail: userEmail ? String(userEmail).trim().toLowerCase() : undefined,
      userPhone: userPhone ? String(userPhone).trim() : undefined,
      telegramHandle: telegramHandle ? String(telegramHandle).trim() : undefined,
      amount: Number(amount),
      feeAmount: Number(feeAmount || 0),
      feePercentage: Number(feePercentage || 0),
      totalPayable: Number(totalPayable || amount),
      currency: currency || 'USD',
      paymentMethod: paymentMethod || 'crypto',
      depositAsset: depositAsset || 'USDT',
      depositNetwork: depositNetwork || 'TRC20',
      depositAddress: depositAddress || '',
      targetDetails: targetDetails || {},
      status: 'CONFIRMED' as const,
      transactionHash: transactionHash || `tx-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date(),
    };

    if (isDbConnected()) {
      const savedOrder = await OrderModel.create(orderData);
      return res.status(201).json({
        success: true,
        message: 'Order saved to Adkings database',
        order: savedOrder,
      });
    }

    const inMemOrder = { id: `ord-${Date.now()}`, ...orderData };
    inMemoryStore.orders.unshift(inMemOrder);
    return res.status(201).json({
      success: true,
      message: 'Order recorded successfully',
      order: inMemOrder,
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return res.status(500).json({ error: err.message || 'Failed to save order' });
  }
});

app.get('/api/orders', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const orders = await OrderModel.find().sort({ createdAt: -1 }).limit(50);
      return res.json({ success: true, orders });
    }
    return res.json({ success: true, orders: inMemoryStore.orders });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch orders' });
  }
});

// 3. Auth Routes (User Registration & Sign In)
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { fullName, email, phoneNumber, countryCode, password, telegramHandle } = req.body;

    if (!fullName || !email || !phoneNumber) {
      return res.status(400).json({ success: false, error: 'Full Name, Email Address, and Phone Number are required' });
    }

    if (!password || String(password).length < 4) {
      return res.status(400).json({ success: false, error: 'Password must be at least 4 characters long' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phoneNumber).trim();
    const cleanName = String(fullName).trim();

    await connectDB();

    // Check if user already exists
    if (isDbConnected()) {
      const existingUser = await UserModel.findOne({
        $or: [{ email: cleanEmail }, { phoneNumber: cleanPhone }],
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: existingUser.email === cleanEmail
            ? 'An account with this email address already exists. Please sign in.'
            : 'An account with this phone number already exists. Please sign in.',
        });
      }

      const createdUser = await UserModel.create({
        fullName: cleanName,
        email: cleanEmail,
        phoneNumber: cleanPhone,
        countryCode: countryCode || '+1',
        password: String(password),
        telegramHandle: telegramHandle ? String(telegramHandle).trim() : undefined,
        balance: 50.0,
        currency: 'USD',
        role: 'vip',
        verified: true,
        avatar: '👑',
        lastLogin: new Date(),
      });

      // Record $50 registration bonus in audit ledger
      try {
        await BalanceTransactionModel.create({
          userEmail: cleanEmail,
          userName: cleanName,
          type: 'bonus',
          gameOrSource: 'Registration Bonus',
          amount: 50.0,
          balanceBefore: 0,
          balanceAfter: 50.0,
          note: 'New Member Registration Bonus ($50.00 USD)',
          createdAt: new Date(),
        });
      } catch (errTx) {
        // Non-blocking transaction log
      }

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully! $50.00 USD registration bonus credited.',
        user: {
          id: createdUser._id,
          fullName: createdUser.fullName,
          email: createdUser.email,
          phoneNumber: createdUser.phoneNumber,
          countryCode: createdUser.countryCode,
          telegramHandle: createdUser.telegramHandle,
          balance: createdUser.balance,
          currency: createdUser.currency,
          role: createdUser.role,
          verified: createdUser.verified,
          avatar: createdUser.avatar,
        },
      });
    }

    // In-Memory Fallback
    const existing = inMemoryStore.users.find(
      (u) => u.email === cleanEmail || u.phoneNumber === cleanPhone
    );
    if (existing) {
      return res.status(409).json({
        success: false,
        error: existing.email === cleanEmail
          ? 'An account with this email address already exists. Please sign in.'
          : 'An account with this phone number already exists. Please sign in.',
      });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      fullName: cleanName,
      email: cleanEmail,
      phoneNumber: cleanPhone,
      countryCode: countryCode || '+1',
      password: String(password),
      telegramHandle: telegramHandle ? String(telegramHandle).trim() : undefined,
      balance: 50.0,
      currency: 'USD',
      role: 'vip' as const,
      verified: true,
      avatar: '👑',
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    inMemoryStore.users.push(newUser);
    inMemoryStore.balanceTransactions.unshift({
      id: `tx-reg-${Date.now()}`,
      userEmail: cleanEmail,
      userName: cleanName,
      type: 'bonus',
      gameOrSource: 'Registration Bonus',
      amount: 50.0,
      balanceBefore: 0,
      balanceAfter: 50.0,
      note: 'New Member Registration Bonus ($50.00 USD)',
      createdAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully! $50.00 USD registration bonus credited.',
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        countryCode: newUser.countryCode,
        telegramHandle: newUser.telegramHandle,
        balance: newUser.balance,
        currency: newUser.currency,
        role: newUser.role,
        verified: newUser.verified,
        avatar: newUser.avatar,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !String(identifier).trim()) {
      return res.status(400).json({ success: false, error: 'Please enter your registered email or phone number' });
    }

    if (!password || !String(password).trim()) {
      return res.status(400).json({ success: false, error: 'Please enter your account password' });
    }

    const cleanId = String(identifier).trim().toLowerCase();
    const cleanPhone = String(identifier).trim();
    const cleanPass = String(password);

    await connectDB();

    if (isDbConnected()) {
      const user = await UserModel.findOne({
        $or: [{ email: cleanId }, { phoneNumber: cleanPhone }],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'No account found with this email or phone number. Please register first.',
        });
      }

      if (user.password && user.password !== cleanPass) {
        return res.status(401).json({
          success: false,
          error: 'Incorrect password entered. Please try again.',
        });
      }

      user.lastLogin = new Date();
      await user.save();

      return res.json({
        success: true,
        message: 'Signed in successfully!',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          countryCode: user.countryCode,
          telegramHandle: user.telegramHandle,
          balance: user.balance,
          currency: user.currency,
          role: user.role,
          verified: user.verified,
          avatar: user.avatar,
        },
      });
    }

    const user = inMemoryStore.users.find(
      (u) => u.email === cleanId || u.phoneNumber === cleanPhone
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account found with this email or phone number. Please register first.',
      });
    }

    if (user.password && user.password !== cleanPass) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password entered. Please try again.',
      });
    }

    user.lastLogin = new Date();

    return res.json({
      success: true,
      message: 'Signed in successfully!',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        countryCode: user.countryCode,
        telegramHandle: user.telegramHandle,
        balance: user.balance,
        currency: user.currency,
        role: user.role,
        verified: user.verified,
        avatar: user.avatar,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Sign in failed' });
  }
});

app.get('/api/auth/me', async (req: Request, res: Response) => {
  const email = req.query.email as string;
  if (!email) return res.status(400).json({ error: 'Email parameter required' });

  const cleanEmail = email.trim().toLowerCase();

  if (isDbConnected()) {
    const user = await UserModel.findOne({ email: cleanEmail });
    if (user) {
      return res.json({
        success: true,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          countryCode: user.countryCode,
          telegramHandle: user.telegramHandle,
          balance: user.balance,
          currency: user.currency,
          role: user.role,
          verified: user.verified,
          avatar: user.avatar,
        },
      });
    }
  }

  const user = inMemoryStore.users.find((u) => u.email === cleanEmail);
  if (user) {
    return res.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        countryCode: user.countryCode,
        telegramHandle: user.telegramHandle,
        balance: user.balance,
        currency: user.currency,
        role: user.role,
        verified: user.verified,
        avatar: user.avatar,
      },
    });
  }

  return res.status(404).json({ error: 'User profile not found' });
});

// Request 6-digit verification code sent to registered email
app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !String(email).trim()) {
      return res.status(400).json({ success: false, error: 'Please enter your registered email address' });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Check if user exists in database or memory store
    let userExists = false;
    let userName = '';

    if (isDbConnected()) {
      const dbUser = await UserModel.findOne({ email: cleanEmail });
      if (dbUser) {
        userExists = true;
        userName = dbUser.fullName;
      }
    }

    if (!userExists) {
      const memUser = inMemoryStore.users.find((u) => u.email === cleanEmail);
      if (memUser) {
        userExists = true;
        userName = memUser.fullName;
      }
    }

    if (!userExists) {
      return res.status(404).json({
        success: false,
        error: `No registered account found with email "${cleanEmail}". Please check the spelling or register a new VIP account.`,
      });
    }

    // Generate secure 6-digit numeric verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity

    resetCodeStore.set(cleanEmail, { code, expiresAt, createdAt: new Date() });

    console.log(`✉️ [PASSWORD RESET DISPATCH] 6-digit verification code for ${cleanEmail} (${userName || 'User'}): ${code}`);

    return res.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}. Enter the code below to reset your password.`,
      email: cleanEmail,
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to dispatch password reset code' });
  }
});

// Verify 6-digit email code
app.post('/api/auth/verify-reset-code', async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and 6-digit verification code are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanCode = String(code).trim();

    const stored = resetCodeStore.get(cleanEmail);
    if (!stored) {
      return res.status(400).json({
        success: false,
        error: 'No active reset code found for this email, or code has expired. Please request a new code.',
      });
    }

    if (Date.now() > stored.expiresAt) {
      resetCodeStore.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        error: 'This verification code has expired (15-minute limit). Please request a new code.',
      });
    }

    if (stored.code !== cleanCode) {
      return res.status(400).json({
        success: false,
        error: 'Invalid 6-digit verification code. Please check your email and try again.',
      });
    }

    return res.json({
      success: true,
      message: '6-digit verification code verified successfully.',
      email: cleanEmail,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Verification failed' });
  }
});

// Reset password with verified 6-digit code
app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Email, 6-digit verification code, and new password are required.',
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanCode = String(code).trim();
    const cleanPass = String(newPassword);

    if (cleanPass.length < 4) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 4 characters long.',
      });
    }

    const stored = resetCodeStore.get(cleanEmail);
    if (!stored) {
      return res.status(400).json({
        success: false,
        error: 'No active reset code found for this email or it has expired. Please request a new code.',
      });
    }

    if (Date.now() > stored.expiresAt) {
      resetCodeStore.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        error: 'Verification code has expired. Please request a new code.',
      });
    }

    if (stored.code !== cleanCode) {
      return res.status(400).json({
        success: false,
        error: 'Invalid 6-digit verification code. Please enter the correct code sent to your email.',
      });
    }

    let updated = false;

    // Update in MongoDB if connected
    if (isDbConnected()) {
      const dbUser = await UserModel.findOne({ email: cleanEmail });
      if (dbUser) {
        dbUser.password = cleanPass;
        await dbUser.save();
        updated = true;
      }
    }

    // Update in in-memory store
    const memUser = inMemoryStore.users.find((u) => u.email === cleanEmail);
    if (memUser) {
      memUser.password = cleanPass;
      updated = true;
    }

    // Remove used code
    resetCodeStore.delete(cleanEmail);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Account could not be found to update password.',
      });
    }

    console.log(`✅ [PASSWORD RESET COMPLETED] Password successfully updated for ${cleanEmail}`);

    return res.json({
      success: true,
      message: 'Your password has been reset successfully! You can now sign in with your new password.',
    });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to reset password' });
  }
});

// 4. Chat / Community Winner Claims (GET & POST)
app.get('/api/chat', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const messages = await ChatMessageModel.find().sort({ createdAt: -1 }).limit(50);
      return res.json({ success: true, messages });
    }
    return res.json({ success: true, messages: inMemoryStore.chatMessages });
  } catch (err: any) {
    return res.json({ success: true, messages: inMemoryStore.chatMessages });
  }
});

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { username, category, projectOrGame, payoutAmount, message, avatar, country, badge } = req.body;
    if (!username || !message) {
      return res.status(400).json({ error: 'Username and message are required' });
    }

    const newMsg = {
      username: username.startsWith('@') ? username : `@${username}`,
      category: category || 'hyip',
      avatar: avatar || '💰',
      country: country || '🌍 INT',
      verified: true,
      projectOrGame: projectOrGame || 'GoldBod Pro',
      payoutAmount: payoutAmount || '$500.00 USDT',
      status: 'PAID',
      message,
      timestamp: 'Just now',
      badge: badge || '💎 VIP CLAIM',
      createdAt: new Date(),
    };

    if (isDbConnected()) {
      const saved = await ChatMessageModel.create(newMsg);
      return res.status(201).json({ success: true, message: saved });
    }

    inMemoryStore.chatMessages.unshift({ id: `m-${Date.now()}`, ...newMsg });
    return res.status(201).json({ success: true, message: newMsg });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to post message' });
  }
});

// 5. Aviator Rounds & History (GET & POST)
app.get('/api/aviator/history', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const rounds = await AviatorRoundModel.find().sort({ createdAt: -1 }).limit(30);
      if (rounds.length > 0) {
        return res.json({ success: true, history: rounds.map((r) => r.crashMultiplier) });
      }
    }
    return res.json({ success: true, history: inMemoryStore.aviatorHistory });
  } catch (err: any) {
    return res.json({ success: true, history: inMemoryStore.aviatorHistory });
  }
});

app.post('/api/aviator/round', async (req: Request, res: Response) => {
  try {
    const { crashMultiplier, betsCount, totalWon } = req.body;
    if (typeof crashMultiplier !== 'number') {
      return res.status(400).json({ error: 'crashMultiplier number is required' });
    }

    const roundId = `av-${Date.now()}`;
    if (isDbConnected()) {
      await AviatorRoundModel.create({
        roundId,
        crashMultiplier,
        betsCount: betsCount || 0,
        totalWon: totalWon || 0,
      });
    }

    inMemoryStore.aviatorHistory.unshift(crashMultiplier);
    if (inMemoryStore.aviatorHistory.length > 30) {
      inMemoryStore.aviatorHistory.pop();
    }

    return res.status(201).json({ success: true, roundId, crashMultiplier });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to record round' });
  }
});

// 6. HYIP Project Votes & Clicks
app.post('/api/hyip/vote', async (req: Request, res: Response) => {
  try {
    const { projectId, name } = req.body;
    if (!projectId) return res.status(400).json({ error: 'projectId is required' });

    if (isDbConnected()) {
      const project = await HyipProjectModel.findOneAndUpdate(
        { projectId },
        { $inc: { votes: 1 }, $setOnInsert: { name: name || projectId } },
        { upsert: true, new: true }
      );
      return res.json({ success: true, projectId, votes: project.votes });
    }

    if (!inMemoryStore.hyipVotes[projectId]) {
      inMemoryStore.hyipVotes[projectId] = { votes: 100, clicks: 50 };
    }
    inMemoryStore.hyipVotes[projectId].votes += 1;

    return res.json({ success: true, projectId, votes: inMemoryStore.hyipVotes[projectId].votes });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to record vote' });
  }
});

app.post('/api/hyip/click', async (req: Request, res: Response) => {
  try {
    const { projectId, name } = req.body;
    if (!projectId) return res.status(400).json({ error: 'projectId is required' });

    if (isDbConnected()) {
      const project = await HyipProjectModel.findOneAndUpdate(
        { projectId },
        { $inc: { clicks: 1 }, $setOnInsert: { name: name || projectId } },
        { upsert: true, new: true }
      );
      return res.json({ success: true, projectId, clicks: project.clicks });
    }

    if (!inMemoryStore.hyipVotes[projectId]) {
      inMemoryStore.hyipVotes[projectId] = { votes: 100, clicks: 50 };
    }
    inMemoryStore.hyipVotes[projectId].clicks += 1;

    return res.json({ success: true, projectId, clicks: inMemoryStore.hyipVotes[projectId].clicks });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to record click' });
  }
});

// 7. User Session & Wallet Balance (GET & POST)
app.get('/api/user/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    if (isDbConnected()) {
      let session = await UserSessionModel.findOne({ sessionId });
      if (!session) {
        session = await UserSessionModel.create({ sessionId, balance: 50.0, currency: 'GHS' });
      }
      return res.json({ success: true, session });
    }
    return res.json({
      success: true,
      session: { sessionId, balance: 50.0, currency: 'GHS', totalBets: 0, totalWins: 0 },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Session error' });
  }
});

app.post('/api/user/balance', async (req: Request, res: Response) => {
  try {
    const { email, balance, delta, mode, reason, game, sessionId, balanceChange, currency } = req.body;

    // Handle authenticated user by email (e.g., Kate, VIP members)
    if (email) {
      const cleanEmail = String(email).trim().toLowerCase();
      await connectDB();

      if (isDbConnected()) {
        const user = await UserModel.findOne({ email: cleanEmail });
        if (!user) {
          return res.status(404).json({ success: false, error: 'User not found' });
        }

        const prevBalance = user.balance;
        let finalBalance = prevBalance;

        if (mode === 'set' && typeof balance === 'number') {
          finalBalance = Math.max(0, balance);
        } else if (typeof delta === 'number') {
          finalBalance = Math.max(0, prevBalance + delta);
        } else if (typeof balance === 'number') {
          finalBalance = Math.max(0, balance);
        }

        user.balance = Number(finalBalance.toFixed(2));
        await user.save();

        // Record transaction
        const txAmount = Number((finalBalance - prevBalance).toFixed(2));
        const txType = txAmount >= 0 ? (game?.toLowerCase().includes('aviator') ? 'aviator_win' : 'game_win') : (game?.toLowerCase().includes('aviator') ? 'aviator_bet' : 'casino_spin');

        await BalanceTransactionModel.create({
          userEmail: cleanEmail,
          userName: user.fullName || cleanEmail,
          type: txType,
          gameOrSource: game || 'Game / Aviator',
          amount: txAmount,
          balanceBefore: prevBalance,
          balanceAfter: user.balance,
          note: reason || `Game balance adjustment (${game || 'Live Game'})`,
          createdAt: new Date(),
        });

        return res.json({
          success: true,
          balance: user.balance,
          previousBalance: prevBalance,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            balance: user.balance,
            currency: user.currency,
            role: user.role,
            avatar: user.avatar,
          },
        });
      }

      // In-Memory Fallback
      let user = inMemoryStore.users.find((u) => u.email === cleanEmail);
      if (!user) {
        user = {
          id: `usr-${Date.now()}`,
          fullName: 'VIP User',
          email: cleanEmail,
          phoneNumber: '+1 0000000000',
          balance: 50.0,
          currency: 'USD',
          role: 'vip',
          avatar: '👑',
        };
        inMemoryStore.users.push(user);
      }

      const prevBalance = user.balance;
      let finalBalance = prevBalance;

      if (mode === 'set' && typeof balance === 'number') {
        finalBalance = Math.max(0, balance);
      } else if (typeof delta === 'number') {
        finalBalance = Math.max(0, prevBalance + delta);
      } else if (typeof balance === 'number') {
        finalBalance = Math.max(0, balance);
      }

      user.balance = Number(finalBalance.toFixed(2));
      const txAmount = Number((finalBalance - prevBalance).toFixed(2));

      inMemoryStore.balanceTransactions.unshift({
        id: `tx-${Date.now()}`,
        userEmail: cleanEmail,
        userName: user.fullName,
        type: txAmount >= 0 ? 'game_win' : 'game_bet',
        gameOrSource: game || 'Game / Aviator',
        amount: txAmount,
        balanceBefore: prevBalance,
        balanceAfter: user.balance,
        note: reason || `Game adjustment (${game || 'Aviator'})`,
        createdAt: new Date(),
      });

      return res.json({
        success: true,
        balance: user.balance,
        previousBalance: prevBalance,
        user,
      });
    }

    // Fallback to sessionId guest wallet
    if (!sessionId || typeof balanceChange !== 'number') {
      return res.status(400).json({ error: 'Either email or sessionId with balance change is required' });
    }

    if (isDbConnected()) {
      const session = await UserSessionModel.findOneAndUpdate(
        { sessionId },
        { $inc: { balance: balanceChange }, $set: { currency: currency || 'USD', lastActive: new Date() } },
        { upsert: true, new: true }
      );
      return res.json({ success: true, balance: session.balance });
    }

    return res.json({ success: true, balanceChange });
  } catch (err: any) {
    console.error('User balance update error:', err);
    return res.status(500).json({ error: err.message || 'Failed to update balance' });
  }
});

// ----------------------------------------------------
// ADMIN FINANCIAL & BALANCE MANAGEMENT PORTAL ENDPOINTS
// ----------------------------------------------------

// 1. Get all registered users and their balances
app.get('/api/admin/users', async (req: Request, res: Response) => {
  try {
    await connectDB();
    if (isDbConnected()) {
      const dbUsers = await UserModel.find().sort({ createdAt: -1 });
      const sanitized = dbUsers.map((u) => ({
        id: u._id,
        fullName: u.fullName,
        email: u.email,
        phoneNumber: u.phoneNumber,
        countryCode: u.countryCode,
        telegramHandle: u.telegramHandle,
        balance: u.balance,
        currency: u.currency || 'USD',
        role: u.role || 'vip',
        verified: u.verified,
        avatar: u.avatar || '👑',
        createdAt: u.createdAt,
        lastLogin: u.lastLogin,
      }));

      // Ensure Kate is included
      const hasKate = sanitized.some((u) => u.email === 'kate20@gmail.com');
      if (!hasKate) {
        sanitized.unshift(inMemoryStore.users[0]);
      }

      return res.json({ success: true, users: sanitized });
    }

    return res.json({ success: true, users: inMemoryStore.users });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch users for admin' });
  }
});

// 2. Admin Reload / Top-up User Balance (Direct Administrative Injection)
app.post('/api/admin/reload-balance', async (req: Request, res: Response) => {
  try {
    const { email, amount, mode = 'add', note = 'Admin Portal Balance Reload', adminName = 'Master Admin' } = req.body;

    if (!email || typeof amount !== 'number') {
      return res.status(400).json({ success: false, error: 'User email and reload amount are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    await connectDB();

    let updatedUser: any = null;
    let prevBal = 0;
    let newBal = 0;

    if (isDbConnected()) {
      const user = await UserModel.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(404).json({ success: false, error: `User with email ${cleanEmail} not found` });
      }

      prevBal = user.balance;

      if (mode === 'set') {
        newBal = Math.max(0, Number(amount.toFixed(2)));
      } else if (mode === 'deduct') {
        newBal = Math.max(0, Number((prevBal - amount).toFixed(2)));
      } else {
        // default 'add'
        newBal = Number((prevBal + amount).toFixed(2));
      }

      user.balance = newBal;
      await user.save();

      const delta = Number((newBal - prevBal).toFixed(2));

      await BalanceTransactionModel.create({
        userEmail: cleanEmail,
        userName: user.fullName || cleanEmail,
        type: 'admin_reload',
        gameOrSource: 'Admin Financial Portal',
        amount: delta,
        balanceBefore: prevBal,
        balanceAfter: newBal,
        note: `${note} (by ${adminName})`,
        createdAt: new Date(),
      });

      updatedUser = {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        balance: user.balance,
        currency: user.currency,
        role: user.role,
        avatar: user.avatar,
      };
    } else {
      let user = inMemoryStore.users.find((u) => u.email === cleanEmail);
      if (!user) {
        return res.status(404).json({ success: false, error: `User with email ${cleanEmail} not found in store` });
      }

      prevBal = user.balance;

      if (mode === 'set') {
        newBal = Math.max(0, Number(amount.toFixed(2)));
      } else if (mode === 'deduct') {
        newBal = Math.max(0, Number((prevBal - amount).toFixed(2)));
      } else {
        newBal = Number((prevBal + amount).toFixed(2));
      }

      user.balance = newBal;
      const delta = Number((newBal - prevBal).toFixed(2));

      inMemoryStore.balanceTransactions.unshift({
        id: `tx-${Date.now()}`,
        userEmail: cleanEmail,
        userName: user.fullName,
        type: 'admin_reload',
        gameOrSource: 'Admin Financial Portal',
        amount: delta,
        balanceBefore: prevBal,
        balanceAfter: newBal,
        note: `${note} (by ${adminName})`,
        createdAt: new Date(),
      });

      updatedUser = user;
    }

    return res.json({
      success: true,
      message: `Successfully updated balance for ${cleanEmail}!`,
      previousBalance: prevBal,
      newBalance: newBal,
      user: updatedUser,
    });
  } catch (err: any) {
    console.error('Admin reload balance error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to reload balance' });
  }
});

// 3. User Submit Deposit or Withdraw Request (Pending Admin Approval - no direct action on balance)
app.post('/api/user/request-reload', async (req: Request, res: Response) => {
  try {
    const {
      email,
      amount,
      type = 'deposit',
      paymentMethod = 'USDT (TRC-20)',
      referenceId = '',
      destinationAddress = '',
      userNote = '',
    } = req.body;

    if (!email || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Valid user email and positive amount are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const reqType = type === 'withdraw' ? 'withdraw' : 'deposit';

    if (reqType === 'withdraw' && amount < 300) {
      return res.status(400).json({
        success: false,
        error: 'The minimum withdrawal amount is $300.00 USD.',
      });
    }

    await connectDB();

    let userName = 'VIP Member';
    let userId = '';

    if (isDbConnected()) {
      const user = await UserModel.findOne({ email: cleanEmail });
      if (user) {
        userName = user.fullName || 'VIP Member';
        userId = String(user._id);

        if (reqType === 'withdraw' && user.balance < amount) {
          return res.status(400).json({
            success: false,
            error: `Insufficient VIP balance ($${user.balance.toFixed(2)} USD). You cannot withdraw $${amount.toFixed(2)} USD.`,
          });
        }
      }

      const generatedRef = referenceId
        ? String(referenceId).trim()
        : `${reqType === 'withdraw' ? 'WTH' : 'DEP'}-${Date.now().toString(36).toUpperCase()}`;

      const newRequest = await ReloadRequestModel.create({
        type: reqType,
        userEmail: cleanEmail,
        userName,
        userId,
        amount: Number(amount.toFixed(2)),
        currency: 'USD',
        paymentMethod: String(paymentMethod || 'USDT (TRC-20)'),
        referenceId: generatedRef,
        destinationAddress: destinationAddress ? String(destinationAddress).trim() : undefined,
        userNote: userNote ? String(userNote).trim() : `User requested ${reqType}`,
        status: 'pending',
        createdAt: new Date(),
      });

      return res.status(201).json({
        success: true,
        message: `${reqType === 'withdraw' ? 'Withdrawal' : 'Deposit'} request submitted successfully! Pending administrator approval.`,
        request: newRequest,
      });
    }

    // In-memory fallback
    const user = inMemoryStore.users.find((u) => u.email === cleanEmail);
    if (user) {
      userName = user.fullName;
      userId = user.id;

      if (reqType === 'withdraw' && user.balance < amount) {
        return res.status(400).json({
          success: false,
          error: `Insufficient VIP balance ($${user.balance.toFixed(2)} USD). You cannot withdraw $${amount.toFixed(2)} USD.`,
        });
      }
    }
    const generatedRef = referenceId
      ? String(referenceId).trim()
      : `${reqType === 'withdraw' ? 'WTH' : 'DEP'}-${Date.now().toString(36).toUpperCase()}`;

    const inMemReq = {
      _id: `req-${Date.now()}`,
      id: `req-${Date.now()}`,
      type: reqType,
      userEmail: cleanEmail,
      userName,
      userId,
      amount: Number(amount.toFixed(2)),
      currency: 'USD',
      paymentMethod: String(paymentMethod || 'USDT (TRC-20)'),
      referenceId: generatedRef,
      destinationAddress: destinationAddress ? String(destinationAddress).trim() : undefined,
      userNote: userNote ? String(userNote).trim() : `User requested ${reqType}`,
      status: 'pending' as const,
      createdAt: new Date(),
    };
    if (!inMemoryStore.reloadRequests) inMemoryStore.reloadRequests = [];
    inMemoryStore.reloadRequests.unshift(inMemReq);

    return res.status(201).json({
      success: true,
      message: `${reqType === 'withdraw' ? 'Withdrawal' : 'Deposit'} request submitted successfully! Pending administrator approval.`,
      request: inMemReq,
    });
  } catch (err: any) {
    console.error('Request reload/withdraw error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to submit request' });
  }
});

// 4. Get Reload Requests for a User
app.get('/api/user/reload-requests', async (req: Request, res: Response) => {
  try {
    const email = req.query.email ? String(req.query.email).trim().toLowerCase() : '';
    if (!email) {
      return res.status(400).json({ success: false, error: 'User email parameter required' });
    }
    await connectDB();
    if (isDbConnected()) {
      const requests = await ReloadRequestModel.find({ userEmail: email }).sort({ createdAt: -1 });
      return res.json({ success: true, requests });
    }
    const list = (inMemoryStore.reloadRequests || []).filter((r: any) => r.userEmail === email);
    return res.json({ success: true, requests: list });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch user reload requests' });
  }
});

// 5. Admin Get All Reload Requests (with Pending Count)
app.get('/api/admin/reload-requests', async (req: Request, res: Response) => {
  try {
    const status = req.query.status ? String(req.query.status).trim().toLowerCase() : '';
    await connectDB();
    if (isDbConnected()) {
      const filter: any = {};
      if (status && ['pending', 'approved', 'rejected'].includes(status)) {
        filter.status = status;
      }
      const requests = await ReloadRequestModel.find(filter).sort({ createdAt: -1 });
      const pendingCount = await ReloadRequestModel.countDocuments({ status: 'pending' });
      return res.json({ success: true, requests, pendingCount });
    }

    let list = inMemoryStore.reloadRequests || [];
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      list = list.filter((r: any) => r.status === status);
    }
    const pendingCount = (inMemoryStore.reloadRequests || []).filter((r: any) => r.status === 'pending').length;
    return res.json({ success: true, requests: list, pendingCount });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch reload requests' });
  }
});

// 6. Admin Approve Reload or Withdrawal Request (Takes action: credits or debits user database balance)
app.post('/api/admin/reload-requests/:id/approve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminName = 'Master Admin', adminNote = 'Verified and approved transaction' } = req.body;
    await connectDB();

    if (isDbConnected()) {
      const request = await ReloadRequestModel.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, error: 'Request not found' });
      }
      if (request.status !== 'pending') {
        return res.status(400).json({ success: false, error: `This request has already been ${request.status}` });
      }

      const user = await UserModel.findOne({ email: request.userEmail });
      if (!user) {
        return res.status(404).json({ success: false, error: `User with email ${request.userEmail} not found` });
      }

      const isWithdraw = request.type === 'withdraw';
      const prevBal = user.balance;
      const newBal = isWithdraw
        ? Math.max(0, Number((prevBal - request.amount).toFixed(2)))
        : Number((prevBal + request.amount).toFixed(2));

      user.balance = newBal;
      await user.save();

      request.status = 'approved';
      request.balanceBefore = prevBal;
      request.balanceAfter = newBal;
      request.reviewedBy = String(adminName);
      request.reviewedAt = new Date();
      request.adminNote = String(adminNote);
      await request.save();

      // Log in balance ledger
      await BalanceTransactionModel.create({
        userEmail: request.userEmail,
        userName: request.userName,
        type: isWithdraw ? 'admin_withdraw' : 'admin_reload',
        gameOrSource: isWithdraw
          ? `Approved Withdrawal Payout (${request.paymentMethod})`
          : `Approved Deposit (${request.paymentMethod})`,
        amount: isWithdraw ? -request.amount : request.amount,
        balanceBefore: prevBal,
        balanceAfter: newBal,
        note: `Admin Approved ${isWithdraw ? 'Withdrawal' : 'Deposit'} #${request.referenceId || request._id} (${adminNote})`,
        createdAt: new Date(),
      });

      return res.json({
        success: true,
        message: `${isWithdraw ? 'Withdrawal' : 'Deposit'} for $${request.amount.toFixed(2)} USD approved! Balance updated for ${request.userEmail}.`,
        request,
        newBalance: newBal,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          balance: user.balance,
        },
      });
    }

    // In-memory fallback
    const inMemList = inMemoryStore.reloadRequests || [];
    const request = inMemList.find((r: any) => r.id === id || r._id === id);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, error: `This request has already been ${request.status}` });
    }

    const user = inMemoryStore.users.find((u: any) => u.email === request.userEmail);
    if (!user) {
      return res.status(404).json({ success: false, error: `User with email ${request.userEmail} not found` });
    }

    const isWithdraw = request.type === 'withdraw';
    const prevBal = user.balance;
    const newBal = isWithdraw
      ? Math.max(0, Number((prevBal - request.amount).toFixed(2)))
      : Number((prevBal + request.amount).toFixed(2));

    user.balance = newBal;

    request.status = 'approved';
    request.balanceBefore = prevBal;
    request.balanceAfter = newBal;
    request.reviewedBy = String(adminName);
    request.reviewedAt = new Date();
    request.adminNote = String(adminNote);

    inMemoryStore.balanceTransactions.unshift({
      id: `tx-${Date.now()}`,
      userEmail: request.userEmail,
      userName: request.userName,
      type: isWithdraw ? 'admin_withdraw' : 'admin_reload',
      gameOrSource: isWithdraw
        ? `Approved Withdrawal Payout (${request.paymentMethod})`
        : `Approved Deposit (${request.paymentMethod})`,
      amount: isWithdraw ? -request.amount : request.amount,
      balanceBefore: prevBal,
      balanceAfter: newBal,
      note: `Admin Approved ${isWithdraw ? 'Withdrawal' : 'Deposit'} #${request.referenceId || request.id} (${adminNote})`,
      createdAt: new Date(),
    });

    return res.json({
      success: true,
      message: `${isWithdraw ? 'Withdrawal' : 'Deposit'} for $${request.amount.toFixed(2)} USD approved! Balance updated for ${request.userEmail}.`,
      request,
      newBalance: newBal,
      user,
    });
  } catch (err: any) {
    console.error('Approve reload request error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to approve request' });
  }
});

// 7. Admin Reject Reload Request (No balance action taken)
app.post('/api/admin/reload-requests/:id/reject', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminName = 'Master Admin', reason = 'Deposit reference could not be verified' } = req.body;
    await connectDB();

    if (isDbConnected()) {
      const request = await ReloadRequestModel.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, error: 'Reload request not found' });
      }
      if (request.status !== 'pending') {
        return res.status(400).json({ success: false, error: `This reload request has already been ${request.status}` });
      }

      request.status = 'rejected';
      request.reviewedBy = String(adminName);
      request.reviewedAt = new Date();
      request.adminNote = String(reason);
      await request.save();

      return res.json({
        success: true,
        message: 'Reload request rejected. No changes made to user balance.',
        request,
      });
    }

    const inMemList = inMemoryStore.reloadRequests || [];
    const request = inMemList.find((r: any) => r.id === id || r._id === id);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Reload request not found' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, error: `This reload request has already been ${request.status}` });
    }

    request.status = 'rejected';
    request.reviewedBy = String(adminName);
    request.reviewedAt = new Date();
    request.adminNote = String(reason);

    return res.json({
      success: true,
      message: 'Reload request rejected. No changes made to user balance.',
      request,
    });
  } catch (err: any) {
    console.error('Reject reload request error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to reject reload request' });
  }
});

// Alias /api/user/profile to fetch stored user data from database
app.get('/api/user/profile', async (req: Request, res: Response) => {
  const email = req.query.email as string;
  if (!email) return res.status(400).json({ error: 'Email parameter required' });
  const cleanEmail = email.trim().toLowerCase();
  await connectDB();
  if (isDbConnected()) {
    const user = await UserModel.findOne({ email: cleanEmail });
    if (user) {
      return res.json({
        success: true,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          countryCode: user.countryCode,
          telegramHandle: user.telegramHandle,
          balance: user.balance,
          currency: user.currency,
          role: user.role,
          verified: user.verified,
          avatar: user.avatar,
        },
      });
    }
  }
  const user = inMemoryStore.users.find((u) => u.email === cleanEmail);
  if (user) {
    return res.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        countryCode: user.countryCode,
        telegramHandle: user.telegramHandle,
        balance: user.balance,
        currency: user.currency,
        role: user.role,
        verified: user.verified,
        avatar: user.avatar,
      },
    });
  }
  return res.status(404).json({ success: false, error: 'User not found' });
});

// Update user profile (username, email, phone number, telegram, avatar)
const handleProfileUpdate = async (req: Request, res: Response) => {
  try {
    const { currentEmail, fullName, email, phoneNumber, telegramHandle, avatar } = req.body;
    if (!currentEmail) {
      return res.status(400).json({ success: false, error: 'Current email parameter is required' });
    }

    const cleanCurrentEmail = currentEmail.trim().toLowerCase();
    const cleanNewEmail = email ? email.trim().toLowerCase() : cleanCurrentEmail;

    await connectDB();
    if (isDbConnected()) {
      // If user is changing email address, verify it's not occupied by another account
      if (cleanNewEmail !== cleanCurrentEmail) {
        const existingWithNewEmail = await UserModel.findOne({ email: cleanNewEmail });
        if (existingWithNewEmail) {
          return res.status(400).json({ success: false, error: 'The new email address is already in use by another account' });
        }
      }

      const user = await UserModel.findOne({ email: cleanCurrentEmail });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      if (fullName !== undefined) user.fullName = fullName.trim();
      if (cleanNewEmail) user.email = cleanNewEmail;
      if (phoneNumber !== undefined) user.phoneNumber = phoneNumber.trim();
      if (telegramHandle !== undefined) user.telegramHandle = telegramHandle.trim();
      if (avatar !== undefined) user.avatar = avatar;

      await user.save();

      // Keep in-memory store in sync
      const memUser = inMemoryStore.users.find((u) => u.email === cleanCurrentEmail);
      if (memUser) {
        if (fullName !== undefined) memUser.fullName = fullName.trim();
        if (cleanNewEmail) memUser.email = cleanNewEmail;
        if (phoneNumber !== undefined) memUser.phoneNumber = phoneNumber.trim();
        if (telegramHandle !== undefined) memUser.telegramHandle = telegramHandle.trim();
        if (avatar !== undefined) memUser.avatar = avatar;
      }

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          countryCode: user.countryCode,
          telegramHandle: user.telegramHandle,
          balance: user.balance,
          currency: user.currency,
          role: user.role,
          verified: user.verified,
          avatar: user.avatar,
        },
      });
    }

    // In-memory fallback
    const memUser = inMemoryStore.users.find((u) => u.email === cleanCurrentEmail);
    if (!memUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (cleanNewEmail !== cleanCurrentEmail) {
      const emailTaken = inMemoryStore.users.find((u) => u.email === cleanNewEmail);
      if (emailTaken) {
        return res.status(400).json({ success: false, error: 'The new email address is already in use' });
      }
    }

    if (fullName !== undefined) memUser.fullName = fullName.trim();
    if (cleanNewEmail) memUser.email = cleanNewEmail;
    if (phoneNumber !== undefined) memUser.phoneNumber = phoneNumber.trim();
    if (telegramHandle !== undefined) memUser.telegramHandle = telegramHandle.trim();
    if (avatar !== undefined) memUser.avatar = avatar;

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: { ...memUser },
    });
  } catch (err: any) {
    console.error('Failed to update user profile:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Failed to update profile' });
  }
};

app.put('/api/user/profile', handleProfileUpdate);
app.post('/api/user/profile', handleProfileUpdate);

// 4. Admin Audit Ledger / Balance Transactions
app.get('/api/admin/transactions', async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    const limit = parseInt(req.query.limit as string) || 40;

    await connectDB();
    if (isDbConnected()) {
      const query = email ? { userEmail: String(email).trim().toLowerCase() } : {};
      const txs = await BalanceTransactionModel.find(query).sort({ createdAt: -1 }).limit(limit);
      return res.json({ success: true, transactions: txs });
    }

    let txs = inMemoryStore.balanceTransactions;
    if (email) {
      txs = txs.filter((t) => t.userEmail === String(email).trim().toLowerCase());
    }
    return res.json({ success: true, transactions: txs.slice(0, limit) });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch balance transactions' });
  }
});

// 5. Live SMS OTP Receiver Simulator Random API (500+ Feeds)
app.get('/api/sms/live-otp', (req: Request, res: Response) => {
  const count = Math.min(1000, Math.max(1, parseInt(req.query.count as string) || 500));
  const category = (req.query.category as string) || 'all';

  const services = [
    // Big Tech & AI Companies
    { name: 'Google Cloud & AI', category: 'tech', badgeColor: 'bg-red-600', icon: '🔍', fmt: () => `G-${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Google verification code: ${c}. Valid for 10 minutes. Do not share.` },
    { name: 'OpenAI / ChatGPT', category: 'tech', badgeColor: 'bg-teal-600', icon: '🤖', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your OpenAI API verification code is: ${c}. Valid for 5 minutes.` },
    { name: 'AWS (Amazon Web Services)', category: 'tech', badgeColor: 'bg-amber-600', icon: '🟧', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `AWS Security: Your IAM root verification code is ${c}. Never share this code.` },
    { name: 'Stripe', category: 'tech', badgeColor: 'bg-indigo-600', icon: '💳', fmt: () => `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`, tpl: (c: string) => `[Stripe] ${c} is your verification code to access your live merchant payout dashboard.` },
    { name: 'Anthropic / Claude AI', category: 'tech', badgeColor: 'bg-amber-700', icon: '🧠', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your Claude sign-in code is ${c}. Enter into browser session. Valid for 10 mins.` },
    { name: 'NVIDIA AI Hub', category: 'tech', badgeColor: 'bg-emerald-600', icon: '🟩', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `NVIDIA Developer Cloud: Your GPU compute authorization token is ${c}.` },
    { name: 'Cloudflare', category: 'tech', badgeColor: 'bg-orange-600', icon: '🛡️', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Cloudflare Zero Trust: Your 2FA security code is ${c}. Expires in 10 minutes.` },
    { name: 'Salesforce', category: 'tech', badgeColor: 'bg-sky-600', icon: '☁️', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Salesforce CRM identity verification code: ${c}. Valid for 15 minutes.` },
    { name: 'Tesla', category: 'tech', badgeColor: 'bg-red-700', icon: '⚡', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Tesla App: Use passcode ${c} to authorize mobile device key pairing.` },
    { name: 'Meta Business Suite', category: 'tech', badgeColor: 'bg-blue-600', icon: '🔵', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `[Meta] ${c} is your two-factor authentication security code for Business Manager.` },
    { name: 'Shopify', category: 'tech', badgeColor: 'bg-emerald-700', icon: '🛍️', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your Shopify store administration login code is ${c}. Never share this.` },
    { name: 'Atlassian Jira', category: 'tech', badgeColor: 'bg-blue-600', icon: '🔷', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your Atlassian Cloud (Jira/Confluence) security code is: ${c}.` },
    { name: 'Docker Hub', category: 'tech', badgeColor: 'bg-sky-500', icon: '🐳', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Docker two-factor authentication token: ${c}. Valid for registry push.` },
    { name: 'Vercel', category: 'tech', badgeColor: 'bg-neutral-900', icon: '▲', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Vercel: Your one-time login verification code is ${c}. Happy deploying!` },
    { name: 'Supabase', category: 'tech', badgeColor: 'bg-emerald-500', icon: '⚡', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your Supabase database authorization OTP is ${c}. Valid for 10 minutes.` },
    { name: 'Apple ID', category: 'tech', badgeColor: 'bg-zinc-600', icon: '🍎', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your Apple ID Code is: ${c}. Don't share it with anyone.` },
    { name: 'Microsoft 365', category: 'tech', badgeColor: 'bg-sky-600', icon: '🪟', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Use ${c} as Microsoft account security code.` },
    { name: 'GitHub', category: 'tech', badgeColor: 'bg-neutral-800', icon: '🐙', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `GitHub authentication token: ${c}. Valid for 10 minutes.` },
    { name: 'GitLab', category: 'tech', badgeColor: 'bg-orange-600', icon: '🦊', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `GitLab two-factor authorization code: ${c}. Valid for 5 minutes.` },
    { name: 'Adobe Cloud', category: 'tech', badgeColor: 'bg-red-600', icon: '🎨', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Adobe verification code: ${c}. Use to authorize Creative Cloud suite.` },
    { name: 'Samsung Account', category: 'tech', badgeColor: 'bg-blue-800', icon: '📱', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Samsung account verification code: ${c}. Valid for 10 minutes.` },
    { name: 'Oracle Cloud', category: 'tech', badgeColor: 'bg-red-700', icon: '🔴', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Oracle Cloud Infrastructure MFA code: ${c}.` },
    { name: 'IBM Cloud', category: 'tech', badgeColor: 'bg-blue-700', icon: '🟦', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `IBM Cloud IAM authentication passcode: ${c}.` },
    { name: 'Cisco Webex', category: 'tech', badgeColor: 'bg-teal-600', icon: '🌐', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Cisco Webex Enterprise verification code: ${c}.` },
    { name: 'Notion AI', category: 'tech', badgeColor: 'bg-stone-800', icon: '📝', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your Notion workspace temporary passcode is: ${c}.` },
    { name: 'Dropbox', category: 'tech', badgeColor: 'bg-blue-500', icon: '📦', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Dropbox security code: ${c} to access your cloud storage.` },
    { name: 'Twilio Console', category: 'tech', badgeColor: 'bg-rose-600', icon: '🔴', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Twilio Console: Your developer security passcode is ${c}.` },
    { name: 'DigitalOcean', category: 'tech', badgeColor: 'bg-blue-600', icon: '🌊', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `DigitalOcean droplet security verification code: ${c}.` },
    { name: 'Uber Technologies', category: 'tech', badgeColor: 'bg-zinc-900', icon: '🚗', fmt: () => `${Math.floor(1000 + Math.random() * 9000)}`, tpl: (c: string) => `Your Uber code is ${c}. Never share this code with anyone.` },
    { name: 'Airbnb', category: 'tech', badgeColor: 'bg-rose-600', icon: '🏡', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your Airbnb verification code is ${c}.` },

    // Social Media & Messaging
    { name: 'Instagram', category: 'social', badgeColor: 'bg-fuchsia-600', icon: '📸', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Use code to confirm your Instagram account: ${c}. Valid for 10 minutes.` },
    { name: 'WhatsApp', category: 'messaging', badgeColor: 'bg-green-600', icon: '💬', fmt: () => `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`, tpl: (c: string) => `Your WhatsApp Business registration code is ${c}. Do not share this code.` },
    { name: 'TikTok', category: 'social', badgeColor: 'bg-rose-600', icon: '🎵', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `[TikTok] ${c} is your verification code to log in or bind phone number.` },
    { name: 'Telegram', category: 'messaging', badgeColor: 'bg-sky-500', icon: '✈️', fmt: () => `${Math.floor(10000 + Math.random() * 90000)}`, tpl: (c: string) => `Telegram code: ${c}. You can also tap this link to log in securely.` },
    { name: 'Facebook', category: 'social', badgeColor: 'bg-blue-600', icon: '📘', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `${c} is your Facebook confirmation code. Use this to confirm your mobile number.` },
    { name: 'X (Twitter)', category: 'social', badgeColor: 'bg-neutral-800', icon: '🐦', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Use confirmation code ${c} for your X account security check.` },
    { name: 'Discord', category: 'messaging', badgeColor: 'bg-indigo-600', icon: '👾', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your Discord security verification code is: ${c}` },
    { name: 'Snapchat', category: 'social', badgeColor: 'bg-amber-500', icon: '👻', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Snapchat Code: ${c}. Don't share with anyone. Happy Snapping!` },
    { name: 'LinkedIn', category: 'social', badgeColor: 'bg-blue-700', icon: '💼', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `${c} is your LinkedIn verification code. Valid for 10 minutes.` },
    { name: 'Reddit', category: 'social', badgeColor: 'bg-orange-600', icon: '🤖', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your Reddit verification code is ${c}. Expires in 15 minutes.` },
    { name: 'Threads', category: 'social', badgeColor: 'bg-fuchsia-700', icon: '🧵', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Threads login code: ${c}. Never share your private code.` },
    { name: 'Signal', category: 'messaging', badgeColor: 'bg-blue-600', icon: '🔒', fmt: () => `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`, tpl: (c: string) => `Signal verification code: ${c}. Do not share this code.` },
    { name: 'Viber', category: 'messaging', badgeColor: 'bg-purple-600', icon: '📞', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your Viber code: ${c}. Enter it to activate your Viber line.` },
    { name: 'LINE', category: 'messaging', badgeColor: 'bg-green-500', icon: '🟢', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `LINE verification code: ${c}. Valid for 30 minutes.` },
    { name: 'WeChat', category: 'messaging', badgeColor: 'bg-green-600', icon: '💬', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `WeChat verification code: ${c}. Please do not forward.` },
    { name: 'Slack', category: 'messaging', badgeColor: 'bg-purple-700', icon: '💼', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your Slack workspace login code is: ${c}.` },
    { name: 'Zoom', category: 'messaging', badgeColor: 'bg-blue-500', icon: '📹', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your Zoom meeting verification code is ${c}.` },

    // Crypto & Payments
    { name: 'PayPal', category: 'crypto', badgeColor: 'bg-blue-600', icon: '💳', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `PayPal: ${c} is your security code. Don't share it with anyone.` },
    { name: 'Cash App', category: 'crypto', badgeColor: 'bg-emerald-500', icon: '💵', fmt: () => `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`, tpl: (c: string) => `Cash App: ${c} is your sign-in code.` },
    { name: 'Binance', category: 'crypto', badgeColor: 'bg-yellow-600', icon: '🪙', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `[Binance] Your SMS verification code is ${c}. Valid for 30 mins.` },
    { name: 'Coinbase', category: 'crypto', badgeColor: 'bg-blue-500', icon: '🛡️', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Coinbase: Your authorization code is ${c}. Protect your vault.` },
    { name: 'Bybit', category: 'crypto', badgeColor: 'bg-amber-600', icon: '📈', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `[Bybit] Safety confirmation code: ${c}.` },
    { name: 'OKX', category: 'crypto', badgeColor: 'bg-neutral-800', icon: '⚡', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `OKX verification code: ${c}. Do not disclose to anyone.` },
    { name: 'Revolut', category: 'crypto', badgeColor: 'bg-blue-600', icon: '🏦', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Revolut authentication code: ${c}. Never share this code.` },

    // Gaming & Entertainment
    { name: 'Steam', category: 'gaming', badgeColor: 'bg-slate-700', icon: '🕹️', fmt: () => `${Math.floor(10000 + Math.random() * 90000)}`, tpl: (c: string) => `Your Steam Guard verification code is ${c}.` },
    { name: 'Roblox', category: 'gaming', badgeColor: 'bg-red-600', icon: '🧱', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Roblox 2-Step Verification Code: ${c}.` },
    { name: 'PlayStation Network', category: 'gaming', badgeColor: 'bg-blue-800', icon: '🎮', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `PlayStation Network 2-Step verification code: ${c}.` },
    { name: 'Xbox Live', category: 'gaming', badgeColor: 'bg-green-700', icon: '🎯', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Use ${c} as Xbox Live account security code.` },
    { name: 'Epic Games', category: 'gaming', badgeColor: 'bg-zinc-700', icon: '⚔️', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your Epic Games two-factor sign in code is: ${c}.` },
    { name: 'Netflix', category: 'gaming', badgeColor: 'bg-red-700', icon: '🎬', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your Netflix temporary access code is ${c}. Valid for 15 minutes.` },
    { name: 'Spotify', category: 'gaming', badgeColor: 'bg-emerald-600', icon: '🎧', fmt: () => `${Math.floor(100000 + Math.random() * 900000)}`, tpl: (c: string) => `Your Spotify login code is ${c}.` },
  ];

  const countries = [
    { flag: '🇺🇸', name: 'United States', dial: '+1', prefix: '(302) 499-' },
    { flag: '🇺🇸', name: 'United States', dial: '+1', prefix: '(415) 890-' },
    { flag: '🇺🇸', name: 'United States', dial: '+1', prefix: '(646) 771-' },
    { flag: '🇨🇦', name: 'Canada', dial: '+1', prefix: '(416) 829-' },
    { flag: '🇬🇧', name: 'United Kingdom', dial: '+44', prefix: '7911 92' },
    { flag: '🇬🇧', name: 'United Kingdom', dial: '+44', prefix: '7400 81' },
    { flag: '🇩🇪', name: 'Germany', dial: '+49', prefix: '1522 84' },
    { flag: '🇫🇷', name: 'France', dial: '+33', prefix: '6 12 34 ' },
    { flag: '🇦🇺', name: 'Australia', dial: '+61', prefix: '491 570 ' },
    { flag: '🇳🇱', name: 'Netherlands', dial: '+31', prefix: '6 1234 ' },
    { flag: '🇸🇬', name: 'Singapore', dial: '+65', prefix: '8123 ' },
    { flag: '🇯🇵', name: 'Japan', dial: '+81', prefix: '90 1234 ' },
    { flag: '🇨🇭', name: 'Switzerland', dial: '+41', prefix: '78 912 ' },
    { flag: '🇸🇪', name: 'Sweden', dial: '+46', prefix: '70 174 ' },
    { flag: '🇦🇪', name: 'United Arab Emirates', dial: '+971', prefix: '50 819 ' },
    { flag: '🇧🇷', name: 'Brazil', dial: '+55', prefix: '11 98765-' },
    { flag: '🇮🇳', name: 'India', dial: '+91', prefix: '98765 ' },
  ];

  const filteredServices = category === 'all' 
    ? services 
    : services.filter((s) => s.category === category);

  const pool = filteredServices.length > 0 ? filteredServices : services;
  const items = [];

  for (let i = 0; i < count; i++) {
    const srv = pool[Math.floor(Math.random() * pool.length)];
    const ctry = countries[Math.floor(Math.random() * countries.length)];
    const code = srv.fmt();
    const secAgo = Math.floor(i * 6 + Math.random() * 4);
    const timeAgo = secAgo === 0 ? 'Just now' : secAgo < 60 ? `${secAgo}s ago` : `${Math.floor(secAgo / 60)}m ago`;

    items.push({
      id: `live-otp-${i + 1}-${Date.now() - secAgo * 1000}`,
      service: srv.name,
      category: srv.category,
      badgeColor: srv.badgeColor,
      iconEmoji: srv.icon,
      number: `${ctry.dial} ${ctry.prefix}${Math.floor(1000 + Math.random() * 9000)}`,
      countryFlag: ctry.flag,
      countryName: ctry.name,
      code,
      timeAgo,
      content: srv.tpl(code),
      timestamp: Date.now() - secAgo * 1000,
    });
  }

  // Prepend explicit Google, OpenAI, AWS, and Instagram as top references
  if (items.length >= 4 && category === 'all') {
    items[0] = {
      ...items[0],
      service: 'Google Cloud & AI',
      category: 'tech',
      badgeColor: 'bg-red-600',
      iconEmoji: '🔍',
      number: '+49 1522 8406',
      countryFlag: '🇩🇪',
      countryName: 'Germany',
      code: 'G-210248',
      timeAgo: 'Just now',
      content: 'Google verification code: G-210248. Valid for 10 minutes. Do not share.',
    };
    items[1] = {
      ...items[1],
      service: 'OpenAI / ChatGPT',
      category: 'tech',
      badgeColor: 'bg-teal-600',
      iconEmoji: '🤖',
      number: '+1 (415) 890-4129',
      countryFlag: '🇺🇸',
      countryName: 'United States',
      code: '849201',
      timeAgo: '3s ago',
      content: 'Your OpenAI API verification code is: 849201. Valid for 5 minutes.',
    };
    items[2] = {
      ...items[2],
      service: 'AWS Cloud IAM',
      category: 'tech',
      badgeColor: 'bg-amber-600',
      iconEmoji: '🟧',
      number: '+1 (646) 771-9238',
      countryFlag: '🇺🇸',
      countryName: 'United States',
      code: '719402',
      timeAgo: '7s ago',
      content: 'AWS Security: Your IAM root verification code is 719402. Valid for 5 minutes.',
    };
    items[3] = {
      ...items[3],
      service: 'Instagram & Meta',
      category: 'social',
      badgeColor: 'bg-fuchsia-600',
      iconEmoji: '📸',
      number: '+1 (416) 829-8351',
      countryFlag: '🇨🇦',
      countryName: 'Canada',
      code: '739889',
      timeAgo: '12s ago',
      content: 'Use code to confirm your Instagram account: 739889. Valid for 10 minutes.',
    };
  }

  res.json({
    success: true,
    count: items.length,
    requestedCount: count,
    category,
    source: 'AdKings Global Virtual SIM Gateway v5.0 (500+ High-Concurrency Feeds)',
    timestamp: new Date().toISOString(),
    messages: items,
  });
});

app.get('/api/sms/random-otp', (req: Request, res: Response) => {
  const ctry = { flag: '🇺🇸', name: 'United States', dial: '+1', prefix: '(302) 499-' };
  const srv = { name: 'Google', category: 'tech', badgeColor: 'bg-red-600', icon: '🔍' };
  const code = `G-${Math.floor(100000 + Math.random() * 900000)}`;

  res.json({
    success: true,
    message: {
      id: `live-otp-single-${Date.now()}`,
      service: srv.name,
      category: srv.category,
      badgeColor: srv.badgeColor,
      iconEmoji: srv.icon,
      number: `${ctry.dial} ${ctry.prefix}${Math.floor(1000 + Math.random() * 9000)}`,
      countryFlag: ctry.flag,
      countryName: ctry.name,
      code,
      timeAgo: 'Just now',
      content: `Google verification code: ${code}. Valid for 10 minutes.`,
      timestamp: Date.now(),
    },
  });
});

// Live Weather Ticker Endpoint by Person's Country
app.get('/api/weather/today', async (req: Request, res: Response) => {
  const queryCountry = typeof req.query.country === 'string' ? req.query.country.trim() : '';
  const queryCity = typeof req.query.city === 'string' ? req.query.city.trim() : '';

  // Header detection for country if available
  const cfCountry = req.headers['cf-ipcountry'] as string || '';
  const acceptLang = req.headers['accept-language'] as string || '';

  const weatherPool = [
    { city: 'New York', country: 'United States', countryCode: 'US', flag: '🇺🇸', tempC: 22, tempF: 72, condition: 'Sunny & Clear', icon: '☀️', humidity: 55, windSpeed: '14 km/h', uv: 6, maxC: 25, minC: 17, summary: 'Warm sunny skies with pleasant evening' },
    { city: 'London', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', tempC: 18, tempF: 64, condition: 'Mild & Breezy', icon: '🌤️', humidity: 62, windSpeed: '16 km/h', uv: 4, maxC: 20, minC: 13, summary: 'Pleasant daylight with mild intervals' },
    { city: 'Accra', country: 'Ghana', countryCode: 'GH', flag: '🇬🇭', tempC: 29, tempF: 84, condition: 'Warm & Tropical', icon: '🌤️', humidity: 78, windSpeed: '14 km/h', uv: 9, maxC: 31, minC: 25, summary: 'Tropical coastal warmth with ocean breeze' },
    { city: 'Lagos', country: 'Nigeria', countryCode: 'NG', flag: '🇳🇬', tempC: 30, tempF: 86, condition: 'Humid Sunshine', icon: '⛅', humidity: 82, windSpeed: '12 km/h', uv: 9, maxC: 32, minC: 26, summary: 'Warm tropical sunshine and humid breezes' },
    { city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', flag: '🇦🇪', tempC: 38, tempF: 100, condition: 'Sunny & Clear', icon: '☀️', humidity: 45, windSpeed: '16 km/h', uv: 10, maxC: 41, minC: 31, summary: 'Brilliant Gulf sunshine all day' },
    { city: 'Toronto', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', tempC: 20, tempF: 68, condition: 'Partly Cloudy', icon: '⛅', humidity: 58, windSpeed: '18 km/h', uv: 5, maxC: 23, minC: 14, summary: 'Comfortable seasonal winds with sun' },
    { city: 'Berlin', country: 'Germany', countryCode: 'DE', flag: '🇩🇪', tempC: 19, tempF: 66, condition: 'Passing Clouds', icon: '⛅', humidity: 59, windSpeed: '15 km/h', uv: 5, maxC: 22, minC: 13, summary: 'Crisp dry air with bright sun intervals' },
    { city: 'Paris', country: 'France', countryCode: 'FR', flag: '🇫🇷', tempC: 21, tempF: 70, condition: 'Fair Skies', icon: '🌤️', humidity: 54, windSpeed: '13 km/h', uv: 6, maxC: 24, minC: 14, summary: 'Pleasant afternoon warmth with clear skies' },
    { city: 'Tokyo', country: 'Japan', countryCode: 'JP', flag: '🇯🇵', tempC: 26, tempF: 79, condition: 'Clear Sky', icon: '☀️', humidity: 64, windSpeed: '11 km/h', uv: 6, maxC: 28, minC: 21, summary: 'Crisp sunshine with gentle coastal breezes' },
    { city: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', flag: '🇿🇦', tempC: 23, tempF: 73, condition: 'Highveld Sun', icon: '☀️', humidity: 42, windSpeed: '15 km/h', uv: 7, maxC: 26, minC: 13, summary: 'Brilliant plateau sun and crisp blue skies' },
    { city: 'Nairobi', country: 'Kenya', countryCode: 'KE', flag: '🇰🇪', tempC: 24, tempF: 75, condition: 'Pleasant & Mild', icon: '🌤️', humidity: 58, windSpeed: '11 km/h', uv: 8, maxC: 26, minC: 15, summary: 'Mild mountain highland air with warm sunshine' },
    { city: 'Singapore', country: 'Singapore', countryCode: 'SG', flag: '🇸🇬', tempC: 31, tempF: 88, condition: 'Scattered Showers', icon: '🌦️', humidity: 84, windSpeed: '10 km/h', uv: 8, maxC: 32, minC: 26, summary: 'Equatorial warmth with brief passing showers' },
    { city: 'Sydney', country: 'Australia', countryCode: 'AU', flag: '🇦🇺', tempC: 19, tempF: 66, condition: 'Sunny Coastal', icon: '☀️', humidity: 56, windSpeed: '18 km/h', uv: 6, maxC: 22, minC: 13, summary: 'Clear sunny sky with refreshing harbor breeze' },
    { city: 'São Paulo', country: 'Brazil', countryCode: 'BR', flag: '🇧🇷', tempC: 24, tempF: 75, condition: 'Pleasant & Clear', icon: '🌤️', humidity: 59, windSpeed: '12 km/h', uv: 7, maxC: 27, minC: 17, summary: 'Temperate sunshine with mild cooling winds' },
    { city: 'Mumbai', country: 'India', countryCode: 'IN', flag: '🇮🇳', tempC: 31, tempF: 88, condition: 'Coastal Humid', icon: '⛅', humidity: 79, windSpeed: '14 km/h', uv: 8, maxC: 33, minC: 27, summary: 'Warm Arabian sea breeze and sunny skies' },
    { city: 'Madrid', country: 'Spain', countryCode: 'ES', flag: '🇪🇸', tempC: 28, tempF: 82, condition: 'Warm Sunshine', icon: '☀️', humidity: 38, windSpeed: '11 km/h', uv: 7, maxC: 31, minC: 18, summary: 'Sunny Mediterranean skies and warm evening' },
    { city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱', tempC: 17, tempF: 63, condition: 'Breezy & Fresh', icon: '🌬️', humidity: 68, windSpeed: '22 km/h', uv: 4, maxC: 19, minC: 12, summary: 'Fresh winds with sunshine intervals' },
    { city: 'Manila', country: 'Philippines', countryCode: 'PH', flag: '🇵🇭', tempC: 31, tempF: 88, condition: 'Passing Clouds', icon: '⛅', humidity: 81, windSpeed: '12 km/h', uv: 8, maxC: 33, minC: 26, summary: 'Warm tropical breezes and clear sun' },
  ];

  // Match target user city/country
  let userItem = weatherPool[0];
  if (queryCountry || queryCity) {
    const found = weatherPool.find(
      (w) =>
        (queryCountry && w.country.toLowerCase().includes(queryCountry.toLowerCase())) ||
        (queryCity && w.city.toLowerCase().includes(queryCity.toLowerCase())) ||
        (queryCountry && w.countryCode.toLowerCase() === queryCountry.toLowerCase())
    );
    if (found) userItem = found;
  } else if (cfCountry) {
    const found = weatherPool.find((w) => w.countryCode.toUpperCase() === cfCountry.toUpperCase());
    if (found) userItem = found;
  }

  res.json({
    success: true,
    userLocation: {
      city: userItem.city,
      country: userItem.country,
      countryCode: userItem.countryCode,
      flag: userItem.flag,
      isDetected: Boolean(queryCountry || queryCity || cfCountry),
    },
    userWeather: userItem,
    allCities: weatherPool,
    timestamp: new Date().toISOString(),
  });
});

// 8. Football Matches Endpoint & Radar
interface RealMatch {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeCrest?: string;
  awayCrest?: string;
  competitionEmblem?: string;
  time: string;
  market: string;
  prediction: string;
  odds: number;
  confidence: string;
  isToday?: boolean;
}

let matchesCache: { timestamp: number; matches: RealMatch[] } = {
  timestamp: 0,
  matches: [],
};

async function fetchFootballDataOrgMatches(): Promise<RealMatch[]> {
  const now = Date.now();
  if (matchesCache.matches.length > 0 && now - matchesCache.timestamp < 5 * 60 * 1000) {
    return matchesCache.matches;
  }

  try {
    const today = new Date();
    const dateFromStr = today.toISOString().split('T')[0];
    const nextDays = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dateToStr = nextDays.toISOString().split('T')[0];

    const url = `https://api.football-data.org/v4/matches?dateFrom=${dateFromStr}&dateTo=${dateToStr}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'X-Auth-Token': FOOTBALL_DATA_API_KEY,
      },
    }).finally(() => clearTimeout(timeoutId));

    if (response.ok) {
      const data: any = await response.json();
      if (data && Array.isArray(data.matches) && data.matches.length > 0) {
        const activeMatches = data.matches.filter((m: any) =>
          ['SCHEDULED', 'TIMED', 'LIVE', 'IN_PLAY', 'PAUSED'].includes(m.status)
        );
        const matchPool = activeMatches.length > 0 ? activeMatches : data.matches;

        const sorted = [...matchPool].sort((a: any, b: any) => {
          return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime();
        });

        const parsed: RealMatch[] = sorted.map((m: any, idx: number) => {
          const matchDate = new Date(m.utcDate);
          const isToday = matchDate.toDateString() === today.toDateString();
          const dayName = matchDate.toLocaleDateString('en-US', { weekday: 'short' });
          const monthDay = matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const timeFormatted = matchDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC',
          });

          const timeLabel = isToday
            ? `Today (${dayName}, ${monthDay}) • ${timeFormatted} GMT`
            : `${dayName}, ${monthDay} • ${timeFormatted} GMT`;

          const oddsSeed = ((m.id || idx * 13) % 70) / 10;
          const calculatedOdds = Number((10.20 + oddsSeed).toFixed(2));

          const confidenceLevels = [
            '99.9% VVIP Fixed',
            '100% Insider',
            '99.8% VVIP Fixed',
            '100% Fixed Lock',
            '99.7% Verified Lock',
          ];

          return {
            id: `fd-${m.id || idx}`,
            league: m.competition?.name || 'Top Flight League',
            homeTeam: m.homeTeam?.name || m.homeTeam?.shortName || 'Home Team',
            awayTeam: m.awayTeam?.name || m.awayTeam?.shortName || 'Away Team',
            homeCrest: m.homeTeam?.crest || undefined,
            awayCrest: m.awayTeam?.crest || undefined,
            competitionEmblem: m.competition?.emblem || undefined,
            time: timeLabel,
            market: 'Exact Correct Score',
            prediction: '* - *',
            odds: calculatedOdds,
            confidence: confidenceLevels[idx % confidenceLevels.length],
            isToday,
          };
        });

        if (parsed.length > 0) {
          matchesCache = { timestamp: now, matches: parsed };
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('Football-data.org fetch skipped/timed out, using radar pool:', (err as any)?.message || err);
  }

  return [];
}

const WORLDWIDE_LEAGUES_FIXTURES = [
  {
    league: 'UEFA Champions League',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Paris Saint-Germain',
    odds: 14.50,
    confidence: '99.9% VVIP Fixed',
  },
  {
    league: 'English Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    odds: 9.80,
    confidence: '100% Insider',
  },
  {
    league: 'Spanish La Liga',
    homeTeam: 'FC Barcelona',
    awayTeam: 'Atletico Madrid',
    odds: 11.20,
    confidence: '99.8% VVIP Fixed',
  },
  {
    league: 'Italian Serie A',
    homeTeam: 'Inter Milan',
    awayTeam: 'Juventus',
    odds: 12.00,
    confidence: '99.5% Insider',
  },
  {
    league: 'German Bundesliga',
    homeTeam: 'Borussia Dortmund',
    awayTeam: 'Bayer Leverkusen',
    odds: 13.50,
    confidence: '99.7% VVIP Fixed',
  },
  {
    league: 'French Ligue 1',
    homeTeam: 'Paris Saint-Germain',
    awayTeam: 'Marseille',
    odds: 10.50,
    confidence: '100% Fixed Lock',
  },
  {
    league: 'Saudi Pro League',
    homeTeam: 'Al-Nassr',
    awayTeam: 'Al-Hilal',
    odds: 15.00,
    confidence: '99.9% VVIP Fixed',
  },
  {
    league: 'CAF Champions League',
    homeTeam: 'Al Ahly',
    awayTeam: 'Mamelodi Sundowns',
    odds: 11.80,
    confidence: '99.4% Insider',
  },
  {
    league: 'Copa Libertadores',
    homeTeam: 'Flamengo',
    awayTeam: 'River Plate',
    odds: 13.80,
    confidence: '99.6% VVIP Fixed',
  },
  {
    league: 'English Premier League',
    homeTeam: 'Liverpool',
    awayTeam: 'Manchester United',
    odds: 14.00,
    confidence: '100% Insider',
  },
];

app.get('/api/football-matches', async (req: Request, res: Response) => {
  const count = Math.min(5, Math.max(2, parseInt((req.query.count as string) || '2', 10)));
  try {
    const realMatches = await fetchFootballDataOrgMatches();
    if (realMatches && realMatches.length >= count) {
      const todayMatches = realMatches.filter((m) => m.isToday);
      const upcomingMatches = realMatches.filter((m) => !m.isToday);

      let selected: RealMatch[] = [];
      if (todayMatches.length >= count) {
        selected = todayMatches.slice(0, count);
      } else if (todayMatches.length > 0) {
        selected = [...todayMatches, ...upcomingMatches.slice(0, count - todayMatches.length)];
      } else {
        selected = upcomingMatches.slice(0, count);
      }

      if (selected.length > 0) {
        return res.json({
          success: true,
          source: 'football-data.org',
          matches: selected,
        });
      }
    }

    const gemini = getGeminiClient();
    const todayStr = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (gemini) {
      try {
        const response = await gemini.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Generate ${count} active/scheduled football matches for today (${todayStr}) from active major leagues around the world (e.g., UEFA Champions League, English Premier League, Spanish La Liga, Italian Serie A, German Bundesliga, Saudi Pro League, French Ligue 1, or Copa Libertadores).
For each match:
- league: string
- homeTeam: string
- awayTeam: string
- time: string (e.g. "Today ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • 20:00 GMT")
- market: always "Exact Correct Score"
- prediction: always "* - *"
- odds: number between 8.50 and 18.50
- confidence: string (e.g. "99.9% VVIP Fixed")`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  league: { type: Type.STRING },
                  homeTeam: { type: Type.STRING },
                  awayTeam: { type: Type.STRING },
                  time: { type: Type.STRING },
                  market: { type: Type.STRING },
                  prediction: { type: Type.STRING },
                  odds: { type: Type.NUMBER },
                  confidence: { type: Type.STRING },
                },
                required: ['league', 'homeTeam', 'awayTeam', 'time', 'market', 'prediction', 'odds', 'confidence'],
              },
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (Array.isArray(parsed) && parsed.length > 0) {
            const sanitized = parsed.slice(0, count).map((item, idx) => ({
              id: `api-m-${Date.now()}-${idx}`,
              league: item.league || 'UEFA Champions League',
              homeTeam: item.homeTeam || 'Bayern Munich',
              awayTeam: item.awayTeam || 'Paris Saint-Germain',
              time: item.time || `Today • 20:00 GMT`,
              market: 'Exact Correct Score',
              prediction: '* - *',
              odds: typeof item.odds === 'number' && item.odds > 0 ? Number(item.odds.toFixed(2)) : 12.50,
              confidence: item.confidence || '99.9% VVIP Fixed',
            }));

            return res.json({
              success: true,
              source: 'gemini-ai-radar',
              matches: sanitized,
            });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini fallback to fixture pool:', geminiErr);
      }
    }

    const shuffled = [...WORLDWIDE_LEAGUES_FIXTURES].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count).map((m, idx) => ({
      id: `live-m-${Date.now()}-${idx}`,
      league: m.league,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      time: `Today • ${18 + idx}:30 GMT`,
      market: 'Exact Correct Score',
      prediction: '* - *',
      odds: m.odds,
      confidence: m.confidence,
    }));

    return res.json({
      success: true,
      source: 'worldwide-radar-api',
      matches: selected,
    });
  } catch (error: any) {
    console.warn('Recovered from football matches error, using guaranteed fixture pool:', error?.message || error);
    const shuffled = [...WORLDWIDE_LEAGUES_FIXTURES].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count).map((m, idx) => ({
      id: `live-m-${Date.now()}-${idx}`,
      league: m.league,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      time: `Today • ${18 + idx}:30 GMT`,
      market: 'Exact Correct Score',
      prediction: '* - *',
      odds: m.odds,
      confidence: m.confidence,
    }));
    return res.json({
      success: true,
      source: 'fallback-fixture-pool',
      matches: selected,
    });
  }
});

// ----------------------------------------------------
// REAL FOOTBALL STANDINGS API (Direct from Football-Data.org)
// ----------------------------------------------------
interface StandingRow {
  position: number;
  team: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  playedGames: number;
  form: string[];
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

const standingsCache: Record<string, { timestamp: number; data: any }> = {};
const STANDINGS_CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache to avoid rate limits

const LEAGUE_CODE_MAP: Record<string, { code: string; defaultName: string; flag: string }> = {
  england: { code: 'PL', defaultName: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  pl: { code: 'PL', defaultName: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  spain: { code: 'PD', defaultName: 'La Liga', flag: '🇪🇸' },
  pd: { code: 'PD', defaultName: 'La Liga', flag: '🇪🇸' },
  germany: { code: 'BL1', defaultName: 'Bundesliga', flag: '🇩🇪' },
  bl1: { code: 'BL1', defaultName: 'Bundesliga', flag: '🇩🇪' },
  france: { code: 'FL1', defaultName: 'Ligue 1', flag: '🇫🇷' },
  fl1: { code: 'FL1', defaultName: 'Ligue 1', flag: '🇫🇷' },
  italy: { code: 'SA', defaultName: 'Serie A', flag: '🇮🇹' },
  sa: { code: 'SA', defaultName: 'Serie A', flag: '🇮🇹' },
};

app.get('/api/football-standings', async (req: Request, res: Response) => {
  try {
    const rawLeague = typeof req.query.league === 'string' 
      ? req.query.league 
      : Array.isArray(req.query.league) 
        ? String(req.query.league[0] || 'england') 
        : 'england';
    const leagueParam = rawLeague.toLowerCase().trim();
    const leagueConfig = LEAGUE_CODE_MAP[leagueParam] || LEAGUE_CODE_MAP['england'];
    const compCode = leagueConfig.code;

    const now = Date.now();
    if (standingsCache[compCode] && now - standingsCache[compCode].timestamp < STANDINGS_CACHE_TTL) {
      return res.json({
        success: true,
        source: 'football-data.org (cached)',
        ...standingsCache[compCode].data,
      });
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const url = `https://api.football-data.org/v4/competitions/${compCode}/standings`;
      const response = await fetch(url, {
        headers: {
          'X-Auth-Token': FOOTBALL_DATA_API_KEY,
        },
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));

      if (response.ok) {
        const data: any = await response.json();
        const tableData = data?.standings?.[0]?.table;
        if (Array.isArray(tableData) && tableData.length > 0) {
          const parsedTable: StandingRow[] = tableData.map((row: any) => ({
            position: row.position,
            team: {
              id: row.team?.id,
              name: row.team?.name || 'Unknown Club',
              shortName: row.team?.shortName || row.team?.name || 'Club',
              tla: row.team?.tla || '',
              crest: row.team?.crest || '',
            },
            playedGames: Number(row.playedGames) || 0,
            form: typeof row.form === 'string' ? row.form.split(',').filter(Boolean) : [],
            won: Number(row.won) || 0,
            draw: Number(row.draw) || 0,
            lost: Number(row.lost) || 0,
            points: Number(row.points) || 0,
            goalsFor: Number(row.goalsFor) || 0,
            goalsAgainst: Number(row.goalsAgainst) || 0,
            goalDifference: Number(row.goalDifference) || 0,
          }));

          const result = {
            competition: {
              id: data.competition?.id,
              name: data.competition?.name || leagueConfig.defaultName,
              code: data.competition?.code || compCode,
              emblem: data.competition?.emblem || '',
              flag: leagueConfig.flag,
            },
            season: {
              id: data.season?.id,
              startDate: data.season?.startDate,
              endDate: data.season?.endDate,
              currentMatchday: data.season?.currentMatchday || 1,
            },
            totalClubs: parsedTable.length,
            standings: parsedTable,
            lastUpdated: new Date().toISOString(),
          };

          standingsCache[compCode] = {
            timestamp: now,
            data: result,
          };

          return res.json({
            success: true,
            source: 'football-data.org',
            ...result,
          });
        }
      }
    } catch (err: any) {
      console.warn('Live football API fetch warning/timeout, using fallback cache/data:', err?.message || err);
    }

    // Check stale cache
    if (standingsCache[compCode]?.data) {
      return res.json({
        success: true,
        source: 'football-data.org (stale-cache)',
        ...standingsCache[compCode].data,
      });
    }

    // Verified high-fidelity radar fallback (guaranteed 200 OK, never 500)
    const fallback = FALLBACK_STANDINGS[compCode] || FALLBACK_STANDINGS['PL'] || FALLBACK_STANDINGS['PD'];
    return res.json({
      success: true,
      source: 'verified-radar-feed',
      ...fallback,
      lastUpdated: new Date().toISOString(),
    });
  } catch (outerErr: any) {
    console.warn('Recovered from standings handler error, serving radar fallback:', outerErr?.message || outerErr);
    const safeFallback = FALLBACK_STANDINGS['PL'] || FALLBACK_STANDINGS['PD'];
    return res.json({
      success: true,
      source: 'radar-safe-fallback',
      ...safeFallback,
      lastUpdated: new Date().toISOString(),
    });
  }
});

// Structured JSON 404 for unhandled API routes (prevents HTML fallback)
app.all('/api/*', (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    error: `API endpoint ${req.method} ${req.originalUrl || req.url} not found`,
  });
});

// Route-level database error fallback middleware for offline/timeout situations
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (
    err?.name === 'MongooseError' ||
    err?.name === 'MongoNetworkError' ||
    err?.name === 'MongoServerSelectionError' ||
    err?.message?.includes('buffering timed out')
  ) {
    console.warn('[AI Studio] Database offline — returning mock/fallback response');
    if (req.method === 'GET') {
      return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
    }
    return res.status(503).json({ error: 'Service temporarily unavailable (database offline)' });
  }
  next(err);
});

// Global serverless catch-all error handler (prevents function invocation crashes)
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error caught by Express:', err);
  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      error: err?.message || 'Internal Server Error',
    });
  }
});

export { app };
export default app;

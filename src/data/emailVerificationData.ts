export interface DisposableDomain {
  domain: string;
  name: string;
  speed: string;
  badge: string;
}

export const DISPOSABLE_DOMAINS: DisposableDomain[] = [
  { domain: 'adkingsmail.com', name: 'AdKings VIP Cloud', speed: '< 2s', badge: 'FASTEST' },
  { domain: 'secureotp.vip', name: 'SecureOTP Shield', speed: '< 3s', badge: 'ENCRYPTED' },
  { domain: 'privatemail.co', name: 'Private Mail Co', speed: '< 2s', badge: 'HIGH DELIVERABILITY' },
  { domain: 'tempinbox.net', name: 'TempInbox Net', speed: '< 4s', badge: 'ANONYMOUS' },
  { domain: 'burnermail.org', name: 'Burner Mail Org', speed: '< 3s', badge: 'ZERO LOGS' },
];

export interface IncomingEmail {
  id: string;
  sender: string;
  senderName: string;
  avatar: string;
  subject: string;
  code: string;
  body: string;
  receivedAt: string;
  serviceCategory: 'crypto' | 'social' | 'payment' | 'gaming' | 'ai';
  isRead: boolean;
}

export const INITIAL_INCOMING_EMAILS: IncomingEmail[] = [
  {
    id: 'mail-1',
    sender: 'security@binance.com',
    senderName: 'Binance VIP Security',
    avatar: '🟡',
    subject: '[Binance] Authorize New IP / Device Verification Code',
    code: '849201',
    body: 'A login request was detected from Chrome on Windows. Use verification code 849201 to complete authentication. Code expires in 10 minutes.',
    receivedAt: '12 seconds ago',
    serviceCategory: 'crypto',
    isRead: false,
  },
  {
    id: 'mail-2',
    sender: 'service@paypal.com',
    senderName: 'PayPal Account Team',
    avatar: '💳',
    subject: 'Confirm your email address & activate instant balance top-up',
    code: '391842',
    body: 'Welcome to PayPal! Click the link below or enter code 391842 to confirm your email and enable instant balance transfers without delay.',
    receivedAt: '45 seconds ago',
    serviceCategory: 'payment',
    isRead: false,
  },
  {
    id: 'mail-3',
    sender: 'no-reply@openai.com',
    senderName: 'OpenAI ChatGPT',
    avatar: '🟢',
    subject: 'Your OpenAI Verification Code',
    code: '519283',
    body: 'Here is your one-time code to sign in to OpenAI: 519283. If you did not make this request, you can safely ignore this email.',
    receivedAt: '1 minute ago',
    serviceCategory: 'ai',
    isRead: true,
  },
  {
    id: 'mail-4',
    sender: 'noreply@telegram.org',
    senderName: 'Telegram Messenger',
    avatar: '✈️',
    subject: 'Telegram Login Code: 73941',
    code: '73941',
    body: 'Dear user, your Telegram login code is 73941. Please do not share this code with anyone, including Telegram staff.',
    receivedAt: '2 minutes ago',
    serviceCategory: 'social',
    isRead: true,
  },
  {
    id: 'mail-5',
    sender: 'noreply@steampowered.com',
    senderName: 'Steam Support',
    avatar: '🎮',
    subject: 'Your Steam Guard verification code',
    code: 'KR89X',
    body: 'Here is the Steam Guard code you need to access your account: KR89X. Generated for user session authentication.',
    receivedAt: '3 minutes ago',
    serviceCategory: 'gaming',
    isRead: true,
  },
  {
    id: 'mail-6',
    sender: 'register@tiktok.com',
    senderName: 'TikTok Creator Hub',
    avatar: '🎵',
    subject: 'Your TikTok account verification code is 620419',
    code: '620419',
    body: 'Welcome to TikTok Creator Hub! Please use verification code 620419 to verify your email and unlock viral monetization analytics.',
    receivedAt: '4 minutes ago',
    serviceCategory: 'social',
    isRead: true,
  },
];

export interface EmailVerificationResult {
  email: string;
  status: 'valid' | 'risky' | 'invalid' | 'disposable';
  deliverabilityScore: number;
  syntaxValid: boolean;
  mxRecordsFound: boolean;
  mxHost: string;
  smtpCheck: boolean;
  isDisposable: boolean;
  isFreeMail: boolean;
  isCatchAll: boolean;
  responseTimeMs: number;
  reason: string;
}

export function performSimulatedEmailVerification(email: string): EmailVerificationResult {
  const trimmed = email.trim().toLowerCase();
  
  // Basic syntax check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return {
      email: trimmed,
      status: 'invalid',
      deliverabilityScore: 0,
      syntaxValid: false,
      mxRecordsFound: false,
      mxHost: 'None (Syntax Error)',
      smtpCheck: false,
      isDisposable: false,
      isFreeMail: false,
      isCatchAll: false,
      responseTimeMs: 18,
      reason: 'Failed RFC 5322 Syntax Format Check. Address is not deliverable.',
    };
  }

  const [localPart, domain] = trimmed.split('@');

  // Check known burner/disposable domains
  const knownBurners = ['tempmail.com', '10minutemail.com', 'mailinator.com', 'trashmail.com', 'guerrillamail.com', 'sharklasers.com', 'burner.io', 'throwaway.com'];
  if (knownBurners.some(b => domain.includes(b))) {
    return {
      email: trimmed,
      status: 'disposable',
      deliverabilityScore: 35,
      syntaxValid: true,
      mxRecordsFound: true,
      mxHost: `mx.${domain} (Burner MX)`,
      smtpCheck: true,
      isDisposable: true,
      isFreeMail: false,
      isCatchAll: true,
      responseTimeMs: 85,
      reason: 'Disposable / Burner Email Service Detected. High bounce and fraud risk.',
    };
  }

  // Simulated major domain checks
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return {
      email: trimmed,
      status: 'valid',
      deliverabilityScore: 99.8,
      syntaxValid: true,
      mxRecordsFound: true,
      mxHost: 'aspmx.l.google.com (Priority 1)',
      smtpCheck: true,
      isDisposable: false,
      isFreeMail: true,
      isCatchAll: false,
      responseTimeMs: 42,
      reason: 'Verified active Google Workspace / Gmail inbox. 100% Deliverable & Clean.',
    };
  }

  if (domain === 'yahoo.com' || domain === 'ymail.com') {
    return {
      email: trimmed,
      status: 'valid',
      deliverabilityScore: 98.6,
      syntaxValid: true,
      mxRecordsFound: true,
      mxHost: 'mta5.am0.yahoodns.net',
      smtpCheck: true,
      isDisposable: false,
      isFreeMail: true,
      isCatchAll: false,
      responseTimeMs: 65,
      reason: 'Verified Yahoo Mail mailbox. SMTP Handshake 250 OK.',
    };
  }

  if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com') {
    return {
      email: trimmed,
      status: 'valid',
      deliverabilityScore: 99.2,
      syntaxValid: true,
      mxRecordsFound: true,
      mxHost: 'outlook-com.olc.protection.outlook.com',
      smtpCheck: true,
      isDisposable: false,
      isFreeMail: true,
      isCatchAll: false,
      responseTimeMs: 54,
      reason: 'Verified Microsoft 365 / Outlook mailbox. High reputation IP.',
    };
  }

  if (domain === 'proton.me' || domain === 'protonmail.com') {
    return {
      email: trimmed,
      status: 'valid',
      deliverabilityScore: 99.5,
      syntaxValid: true,
      mxRecordsFound: true,
      mxHost: 'mail.protonmail.ch (Priority 10)',
      smtpCheck: true,
      isDisposable: false,
      isFreeMail: false,
      isCatchAll: false,
      responseTimeMs: 68,
      reason: 'End-to-end encrypted Proton mailbox. Validated cryptographic MX records.',
    };
  }

  if (domain === 'binance.com' || domain === 'apple.com' || domain === 'tesla.com' || domain === 'microsoft.com') {
    return {
      email: trimmed,
      status: 'valid',
      deliverabilityScore: 99.9,
      syntaxValid: true,
      mxRecordsFound: true,
      mxHost: `mail.${domain} (Enterprise Gateway)`,
      smtpCheck: true,
      isDisposable: false,
      isFreeMail: false,
      isCatchAll: false,
      responseTimeMs: 38,
      reason: 'Verified Enterprise Corporate Mail Server with DMARC, DKIM & SPF pass.',
    };
  }

  // Generic custom domain
  const isGenericInvalid = domain.includes('invalid') || domain.includes('fake') || domain.includes('notreal') || localPart.length > 40;
  if (isGenericInvalid) {
    return {
      email: trimmed,
      status: 'invalid',
      deliverabilityScore: 0,
      syntaxValid: true,
      mxRecordsFound: false,
      mxHost: 'NXDOMAIN (Host not found)',
      smtpCheck: false,
      isDisposable: false,
      isFreeMail: false,
      isCatchAll: false,
      responseTimeMs: 110,
      reason: 'Domain has no active DNS MX records. Mails sent here will bounce hard.',
    };
  }

  return {
    email: trimmed,
    status: 'valid',
    deliverabilityScore: 96.4,
    syntaxValid: true,
    mxRecordsFound: true,
    mxHost: `mail.${domain} (Primary MX)`,
    smtpCheck: true,
    isDisposable: false,
    isFreeMail: false,
    isCatchAll: false,
    responseTimeMs: 58,
    reason: 'Verified custom domain. DNS MX records active, SMTP handshake successful.',
  };
}

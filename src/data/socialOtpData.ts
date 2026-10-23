export interface LiveSmsMessage {
  id: string;
  service: string;
  category: 'social' | 'messaging' | 'tech' | 'crypto' | 'gaming';
  number: string;
  countryCode: string;
  countryFlag: string;
  countryName: string;
  code: string;
  timeAgo: string;
  timestamp: number;
  content: string;
  badgeColor: string;
  iconEmoji: string;
  carrier: string;
}

export interface SocialServiceMeta {
  name: string;
  category: 'social' | 'messaging' | 'tech' | 'crypto' | 'gaming';
  badgeColor: string;
  iconEmoji: string;
  codeFormat: () => string;
  template: (code: string) => string;
}

const randomDigits = (len: number) => {
  let res = '';
  for (let i = 0; i < len; i++) {
    res += Math.floor(Math.random() * 10);
  }
  return res;
};

export const SOCIAL_SERVICES: SocialServiceMeta[] = [
  {
    name: 'Google',
    category: 'tech',
    badgeColor: 'bg-red-600',
    iconEmoji: '🔍',
    codeFormat: () => `G-${randomDigits(6)}`,
    template: (c) => `Google verification code: ${c}. Valid for 10 minutes. Do not share this code.`,
  },
  {
    name: 'Instagram',
    category: 'social',
    badgeColor: 'bg-fuchsia-600',
    iconEmoji: '📸',
    codeFormat: () => randomDigits(6),
    template: (c) => `Use code to confirm your Instagram account: ${c}. Valid for 10 minutes.`,
  },
  {
    name: 'WhatsApp',
    category: 'messaging',
    badgeColor: 'bg-green-600',
    iconEmoji: '💬',
    codeFormat: () => `${randomDigits(3)}-${randomDigits(3)}`,
    template: (c) => `Your WhatsApp Business registration code is ${c}. Do not share this code.`,
  },
  {
    name: 'TikTok',
    category: 'social',
    badgeColor: 'bg-rose-600',
    iconEmoji: '🎵',
    codeFormat: () => randomDigits(6),
    template: (c) => `[TikTok] ${c} is your verification code to log in or bind phone number.`,
  },
  {
    name: 'Telegram',
    category: 'messaging',
    badgeColor: 'bg-sky-500',
    iconEmoji: '✈️',
    codeFormat: () => randomDigits(5),
    template: (c) => `Telegram code: ${c}. You can also tap this link to log in securely.`,
  },
  {
    name: 'Facebook',
    category: 'social',
    badgeColor: 'bg-blue-600',
    iconEmoji: '📘',
    codeFormat: () => randomDigits(6),
    template: (c) => `${c} is your Facebook confirmation code. Use this to confirm your mobile number.`,
  },
  {
    name: 'X (Twitter)',
    category: 'social',
    badgeColor: 'bg-neutral-800',
    iconEmoji: '🐦',
    codeFormat: () => randomDigits(6),
    template: (c) => `Use confirmation code ${c} for your X account security check.`,
  },
  {
    name: 'Discord',
    category: 'messaging',
    badgeColor: 'bg-indigo-600',
    iconEmoji: '👾',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Discord security verification code is: ${c}`,
  },
  {
    name: 'Snapchat',
    category: 'social',
    badgeColor: 'bg-amber-500',
    iconEmoji: '👻',
    codeFormat: () => randomDigits(6),
    template: (c) => `Snapchat Code: ${c}. Don't share with anyone. Happy Snapping!`,
  },
  {
    name: 'LinkedIn',
    category: 'social',
    badgeColor: 'bg-blue-700',
    iconEmoji: '💼',
    codeFormat: () => randomDigits(6),
    template: (c) => `${c} is your LinkedIn verification code. Valid for 10 minutes.`,
  },
  {
    name: 'Reddit',
    category: 'social',
    badgeColor: 'bg-orange-600',
    iconEmoji: '🤖',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Reddit verification code is ${c}. Expires in 15 minutes.`,
  },
  {
    name: 'Threads',
    category: 'social',
    badgeColor: 'bg-fuchsia-700',
    iconEmoji: '🧵',
    codeFormat: () => randomDigits(6),
    template: (c) => `Threads login code: ${c}. Never share your private code.`,
  },
  {
    name: 'Pinterest',
    category: 'social',
    badgeColor: 'bg-red-700',
    iconEmoji: '📌',
    codeFormat: () => randomDigits(6),
    template: (c) => `Pinterest confirmation code: ${c} to secure your pin collection.`,
  },
  {
    name: 'YouTube',
    category: 'social',
    badgeColor: 'bg-red-600',
    iconEmoji: '▶️',
    codeFormat: () => `G-${randomDigits(6)}`,
    template: (c) => `Google/YouTube creator studio verification code: ${c}.`,
  },
  {
    name: 'Twitch',
    category: 'gaming',
    badgeColor: 'bg-purple-600',
    iconEmoji: '🎮',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Twitch two-factor authentication token is ${c}.`,
  },
  {
    name: 'Tinder',
    category: 'social',
    badgeColor: 'bg-pink-600',
    iconEmoji: '🔥',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Tinder code is ${c} dwEzWOx6XSV. Don't share with anyone.`,
  },
  {
    name: 'Bumble',
    category: 'social',
    badgeColor: 'bg-amber-600',
    iconEmoji: '🐝',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Bumble security login code is ${c}. Enjoy connecting!`,
  },
  {
    name: 'Hinge',
    category: 'social',
    badgeColor: 'bg-stone-800',
    iconEmoji: '🖤',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Hinge verification code is ${c}. Designed to be deleted.`,
  },
  {
    name: 'Badoo',
    category: 'social',
    badgeColor: 'bg-purple-700',
    iconEmoji: '💜',
    codeFormat: () => randomDigits(6),
    template: (c) => `Badoo confirmation code: ${c} to verify your dating profile.`,
  },
  {
    name: 'Apple ID',
    category: 'tech',
    badgeColor: 'bg-zinc-600',
    iconEmoji: '🍎',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Apple ID Code is: ${c}. Don't share it with anyone.`,
  },
  {
    name: 'OpenAI / ChatGPT',
    category: 'tech',
    badgeColor: 'bg-teal-600',
    iconEmoji: '🤖',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your OpenAI API verification code is: ${c}. Valid for 5 minutes.`,
  },
  {
    name: 'Microsoft',
    category: 'tech',
    badgeColor: 'bg-sky-600',
    iconEmoji: '🪟',
    codeFormat: () => randomDigits(6),
    template: (c) => `Use ${c} as Microsoft account security code.`,
  },
  {
    name: 'Amazon',
    category: 'tech',
    badgeColor: 'bg-amber-600',
    iconEmoji: '📦',
    codeFormat: () => randomDigits(6),
    template: (c) => `${c} is your Amazon OTP. Do not share it with anyone.`,
  },
  {
    name: 'Netflix',
    category: 'gaming',
    badgeColor: 'bg-red-700',
    iconEmoji: '🎬',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Netflix temporary access code is ${c}. Valid for 15 minutes.`,
  },
  {
    name: 'Spotify',
    category: 'gaming',
    badgeColor: 'bg-emerald-600',
    iconEmoji: '🎧',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Spotify login code is ${c}. Listen uninterrupted.`,
  },
  {
    name: 'Uber',
    category: 'tech',
    badgeColor: 'bg-zinc-900',
    iconEmoji: '🚗',
    codeFormat: () => randomDigits(4),
    template: (c) => `Your Uber code is ${c}. Never share this code with anyone.`,
  },
  {
    name: 'PayPal',
    category: 'crypto',
    badgeColor: 'bg-blue-600',
    iconEmoji: '💳',
    codeFormat: () => randomDigits(6),
    template: (c) => `PayPal: ${c} is your security code. Don't share it with anyone.`,
  },
  {
    name: 'Cash App',
    category: 'crypto',
    badgeColor: 'bg-emerald-500',
    iconEmoji: '💵',
    codeFormat: () => `${randomDigits(3)}-${randomDigits(3)}`,
    template: (c) => `Cash App: ${c} is your sign-in code. Do not share.`,
  },
  {
    name: 'Venmo',
    category: 'crypto',
    badgeColor: 'bg-sky-500',
    iconEmoji: '💸',
    codeFormat: () => randomDigits(6),
    template: (c) => `Venmo code: ${c}. Valid for 5 minutes. Enter to approve login.`,
  },
  {
    name: 'Binance',
    category: 'crypto',
    badgeColor: 'bg-yellow-600',
    iconEmoji: '🪙',
    codeFormat: () => randomDigits(6),
    template: (c) => `[Binance] Your SMS verification code is ${c}. The code is valid for 30 minutes.`,
  },
  {
    name: 'Coinbase',
    category: 'crypto',
    badgeColor: 'bg-blue-500',
    iconEmoji: '🛡️',
    codeFormat: () => randomDigits(6),
    template: (c) => `Coinbase: Your authorization code is ${c}. Protect your vault.`,
  },
  {
    name: 'Bybit',
    category: 'crypto',
    badgeColor: 'bg-amber-600',
    iconEmoji: '📈',
    codeFormat: () => randomDigits(6),
    template: (c) => `[Bybit] Safety confirmation code: ${c}. Confirm withdrawal/login.`,
  },
  {
    name: 'OKX',
    category: 'crypto',
    badgeColor: 'bg-neutral-800',
    iconEmoji: '⚡',
    codeFormat: () => randomDigits(6),
    template: (c) => `OKX verification code: ${c}. Do not disclose to anyone.`,
  },
  {
    name: 'KuCoin',
    category: 'crypto',
    badgeColor: 'bg-emerald-600',
    iconEmoji: '💎',
    codeFormat: () => randomDigits(6),
    template: (c) => `KuCoin: ${c} is your security verification code.`,
  },
  {
    name: 'Kraken',
    category: 'crypto',
    badgeColor: 'bg-purple-600',
    iconEmoji: '🐙',
    codeFormat: () => randomDigits(6),
    template: (c) => `Kraken 2FA authorization token: ${c}.`,
  },
  {
    name: 'Steam',
    category: 'gaming',
    badgeColor: 'bg-slate-700',
    iconEmoji: '🕹️',
    codeFormat: () => randomDigits(5),
    template: (c) => `Your Steam Guard verification code is ${c}. Enter in client.`,
  },
  {
    name: 'Roblox',
    category: 'gaming',
    badgeColor: 'bg-red-600',
    iconEmoji: '🧱',
    codeFormat: () => randomDigits(6),
    template: (c) => `Roblox 2-Step Verification Code: ${c}. Valid for 15 mins.`,
  },
  {
    name: 'PlayStation',
    category: 'gaming',
    badgeColor: 'bg-blue-800',
    iconEmoji: '🎮',
    codeFormat: () => randomDigits(6),
    template: (c) => `PlayStation Network 2-Step verification code: ${c}.`,
  },
  {
    name: 'Xbox Live',
    category: 'gaming',
    badgeColor: 'bg-green-700',
    iconEmoji: '🎯',
    codeFormat: () => randomDigits(6),
    template: (c) => `Use ${c} as Xbox Live account security code.`,
  },
  {
    name: 'Epic Games',
    category: 'gaming',
    badgeColor: 'bg-zinc-700',
    iconEmoji: '⚔️',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Epic Games two-factor sign in code is: ${c}.`,
  },
  {
    name: 'Signal',
    category: 'messaging',
    badgeColor: 'bg-blue-600',
    iconEmoji: '🔒',
    codeFormat: () => `${randomDigits(3)}-${randomDigits(3)}`,
    template: (c) => `Signal verification code: ${c}. Do not share this code.`,
  },
  {
    name: 'Viber',
    category: 'messaging',
    badgeColor: 'bg-purple-600',
    iconEmoji: '📞',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Viber code: ${c}. Enter it to activate your Viber line.`,
  },
  {
    name: 'LINE',
    category: 'messaging',
    badgeColor: 'bg-green-500',
    iconEmoji: '🟢',
    codeFormat: () => randomDigits(6),
    template: (c) => `LINE verification code: ${c}. Valid for 30 minutes.`,
  },
  {
    name: 'WeChat',
    category: 'messaging',
    badgeColor: 'bg-green-600',
    iconEmoji: '💬',
    codeFormat: () => randomDigits(6),
    template: (c) => `WeChat verification code: ${c}. Please do not forward.`,
  },
  {
    name: 'Slack',
    category: 'messaging',
    badgeColor: 'bg-purple-700',
    iconEmoji: '💼',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Slack workspace login code is: ${c}.`,
  },
  {
    name: 'Zoom',
    category: 'messaging',
    badgeColor: 'bg-blue-500',
    iconEmoji: '📹',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Zoom meeting verification code is ${c}.`,
  },
  {
    name: 'GitHub',
    category: 'tech',
    badgeColor: 'bg-neutral-800',
    iconEmoji: '🐙',
    codeFormat: () => randomDigits(6),
    template: (c) => `GitHub authentication token: ${c}. Valid for 10 minutes.`,
  },
  {
    name: 'Revolut',
    category: 'crypto',
    badgeColor: 'bg-blue-600',
    iconEmoji: '🏦',
    codeFormat: () => randomDigits(6),
    template: (c) => `Revolut authentication code: ${c}. Never share this code.`,
  },
  {
    name: 'Wise',
    category: 'crypto',
    badgeColor: 'bg-emerald-600',
    iconEmoji: '🌍',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Wise transfer confirmation code is ${c}.`,
  },
  {
    name: 'Skrill',
    category: 'crypto',
    badgeColor: 'bg-rose-700',
    iconEmoji: '💳',
    codeFormat: () => randomDigits(6),
    template: (c) => `Skrill security code: ${c} for wallet access verification.`,
  },
  {
    name: 'Airbnb',
    category: 'tech',
    badgeColor: 'bg-rose-600',
    iconEmoji: '🏡',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Airbnb verification code is ${c}.`,
  },
  {
    name: 'Booking.com',
    category: 'tech',
    badgeColor: 'bg-blue-900',
    iconEmoji: '✈️',
    codeFormat: () => randomDigits(6),
    template: (c) => `Booking.com pin code: ${c} to confirm your reservation.`,
  },
  {
    name: 'Deliveroo',
    category: 'tech',
    badgeColor: 'bg-teal-600',
    iconEmoji: '🍔',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Deliveroo code is ${c}. Enjoy your meal!`,
  },
  {
    name: 'DoorDash',
    category: 'tech',
    badgeColor: 'bg-red-600',
    iconEmoji: '🍕',
    codeFormat: () => randomDigits(6),
    template: (c) => `DoorDash: Your login pin is ${c}. Never share it.`,
  },
  {
    name: 'AWS (Amazon Web Services)',
    category: 'tech',
    badgeColor: 'bg-amber-600',
    iconEmoji: '🟧',
    codeFormat: () => randomDigits(6),
    template: (c) => `AWS Security: Your IAM root verification code is ${c}. Valid for 5 minutes. Never share this code.`,
  },
  {
    name: 'Stripe',
    category: 'tech',
    badgeColor: 'bg-indigo-600',
    iconEmoji: '💳',
    codeFormat: () => `${randomDigits(3)}-${randomDigits(3)}`,
    template: (c) => `[Stripe] ${c} is your verification code to access your live merchant payout dashboard.`,
  },
  {
    name: 'Anthropic / Claude AI',
    category: 'tech',
    badgeColor: 'bg-amber-700',
    iconEmoji: '🧠',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Claude sign-in code is ${c}. Enter this into your browser session. Valid for 10 mins.`,
  },
  {
    name: 'NVIDIA AI Hub',
    category: 'tech',
    badgeColor: 'bg-emerald-600',
    iconEmoji: '🟩',
    codeFormat: () => randomDigits(6),
    template: (c) => `NVIDIA Developer Cloud: Your GPU compute authorization token is ${c}.`,
  },
  {
    name: 'Cloudflare',
    category: 'tech',
    badgeColor: 'bg-orange-600',
    iconEmoji: '🛡️',
    codeFormat: () => randomDigits(6),
    template: (c) => `Cloudflare Zero Trust: Your 2FA security code is ${c}. Expires in 10 minutes.`,
  },
  {
    name: 'Salesforce',
    category: 'tech',
    badgeColor: 'bg-sky-600',
    iconEmoji: '☁️',
    codeFormat: () => randomDigits(6),
    template: (c) => `Salesforce CRM identity verification code: ${c}. Valid for 15 minutes.`,
  },
  {
    name: 'Tesla',
    category: 'tech',
    badgeColor: 'bg-red-700',
    iconEmoji: '⚡',
    codeFormat: () => randomDigits(6),
    template: (c) => `Tesla App: Use passcode ${c} to authorize mobile device key pairing & Supercharger access.`,
  },
  {
    name: 'Meta Business Suite',
    category: 'tech',
    badgeColor: 'bg-blue-600',
    iconEmoji: '🔵',
    codeFormat: () => randomDigits(6),
    template: (c) => `[Meta] ${c} is your two-factor authentication security code for Business Manager.`,
  },
  {
    name: 'Shopify',
    category: 'tech',
    badgeColor: 'bg-emerald-700',
    iconEmoji: '🛍️',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Shopify store administration login code is ${c}. Never share this with anyone.`,
  },
  {
    name: 'Atlassian Jira',
    category: 'tech',
    badgeColor: 'bg-blue-600',
    iconEmoji: '🔷',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Atlassian Cloud (Jira/Confluence) security code is: ${c}.`,
  },
  {
    name: 'Docker Hub',
    category: 'tech',
    badgeColor: 'bg-sky-500',
    iconEmoji: '🐳',
    codeFormat: () => randomDigits(6),
    template: (c) => `Docker two-factor authentication token: ${c}. Valid for container registry push.`,
  },
  {
    name: 'Vercel',
    category: 'tech',
    badgeColor: 'bg-neutral-900',
    iconEmoji: '▲',
    codeFormat: () => randomDigits(6),
    template: (c) => `Vercel: Your one-time login verification code is ${c}. Happy deploying!`,
  },
  {
    name: 'Supabase',
    category: 'tech',
    badgeColor: 'bg-emerald-500',
    iconEmoji: '⚡',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Supabase database authorization OTP is ${c}. Valid for 10 minutes.`,
  },
  {
    name: 'Samsung Account',
    category: 'tech',
    badgeColor: 'bg-blue-800',
    iconEmoji: '📱',
    codeFormat: () => randomDigits(6),
    template: (c) => `Samsung account verification code: ${c}. Valid for 10 minutes.`,
  },
  {
    name: 'Adobe Creative Cloud',
    category: 'tech',
    badgeColor: 'bg-red-600',
    iconEmoji: '🎨',
    codeFormat: () => randomDigits(6),
    template: (c) => `Adobe verification code: ${c}. Use to authorize Photoshop, Illustrator & Premiere.`,
  },
  {
    name: 'Oracle Cloud',
    category: 'tech',
    badgeColor: 'bg-red-700',
    iconEmoji: '🔴',
    codeFormat: () => randomDigits(6),
    template: (c) => `Oracle Cloud Infrastructure MFA code: ${c}. Do not forward this SMS.`,
  },
  {
    name: 'IBM Cloud',
    category: 'tech',
    badgeColor: 'bg-blue-700',
    iconEmoji: '🟦',
    codeFormat: () => randomDigits(6),
    template: (c) => `IBM Cloud IAM authentication passcode: ${c}.`,
  },
  {
    name: 'Cisco Webex',
    category: 'tech',
    badgeColor: 'bg-teal-600',
    iconEmoji: '🌐',
    codeFormat: () => randomDigits(6),
    template: (c) => `Cisco Webex Enterprise verification code: ${c}.`,
  },
  {
    name: 'Notion AI',
    category: 'tech',
    badgeColor: 'bg-stone-800',
    iconEmoji: '📝',
    codeFormat: () => randomDigits(6),
    template: (c) => `Your Notion workspace temporary passcode is: ${c}. Valid for 15 minutes.`,
  },
  {
    name: 'GitLab',
    category: 'tech',
    badgeColor: 'bg-orange-600',
    iconEmoji: '🦊',
    codeFormat: () => randomDigits(6),
    template: (c) => `GitLab two-factor authorization code: ${c}. Valid for 5 minutes.`,
  },
  {
    name: 'Dropbox',
    category: 'tech',
    badgeColor: 'bg-blue-500',
    iconEmoji: '📦',
    codeFormat: () => randomDigits(6),
    template: (c) => `Dropbox security code: ${c} to access your encrypted cloud vault.`,
  },
  {
    name: 'Twilio Console',
    category: 'tech',
    badgeColor: 'bg-rose-600',
    iconEmoji: '🔴',
    codeFormat: () => randomDigits(6),
    template: (c) => `Twilio Console: Your developer security passcode is ${c}.`,
  },
  {
    name: 'DigitalOcean',
    category: 'tech',
    badgeColor: 'bg-blue-600',
    iconEmoji: '🌊',
    codeFormat: () => randomDigits(6),
    template: (c) => `DigitalOcean droplet security verification code: ${c}.`,
  },
  {
    name: 'HubSpot',
    category: 'tech',
    badgeColor: 'bg-orange-600',
    iconEmoji: '🟠',
    codeFormat: () => randomDigits(6),
    template: (c) => `HubSpot CRM sign-in verification code is ${c}.`,
  },
];

export const WORLD_COUNTRIES = [
  { flag: '🇺🇸', name: 'United States', dialCode: '+1', prefix: '(302) 499-' },
  { flag: '🇺🇸', name: 'United States', dialCode: '+1', prefix: '(415) 890-' },
  { flag: '🇺🇸', name: 'United States', dialCode: '+1', prefix: '(646) 771-' },
  { flag: '🇨🇦', name: 'Canada', dialCode: '+1', prefix: '(416) 829-' },
  { flag: '🇨🇦', name: 'Canada', dialCode: '+1', prefix: '(604) 912-' },
  { flag: '🇬🇧', name: 'United Kingdom', dialCode: '+44', prefix: '7911 92' },
  { flag: '🇬🇧', name: 'United Kingdom', dialCode: '+44', prefix: '7400 81' },
  { flag: '🇩🇪', name: 'Germany', dialCode: '+49', prefix: '1522 84' },
  { flag: '🇩🇪', name: 'Germany', dialCode: '+49', prefix: '176 991' },
  { flag: '🇫🇷', name: 'France', dialCode: '+33', prefix: '6 12 34 ' },
  { flag: '🇪🇸', name: 'Spain', dialCode: '+34', prefix: '611 23 ' },
  { flag: '🇮🇹', name: 'Italy', dialCode: '+39', prefix: '348 91 ' },
  { flag: '🇳🇱', name: 'Netherlands', dialCode: '+31', prefix: '6 1234 ' },
  { flag: '🇸🇪', name: 'Sweden', dialCode: '+46', prefix: '70 174 ' },
  { flag: '🇨🇭', name: 'Switzerland', dialCode: '+41', prefix: '78 912 ' },
  { flag: '🇦🇺', name: 'Australia', dialCode: '+61', prefix: '491 570 ' },
  { flag: '🇯🇵', name: 'Japan', dialCode: '+81', prefix: '90 1234 ' },
  { flag: '🇸🇬', name: 'Singapore', dialCode: '+65', prefix: '8123 ' },
  { flag: '🇦🇪', name: 'United Arab Emirates', dialCode: '+971', prefix: '50 819 ' },
  { flag: '🇧🇷', name: 'Brazil', dialCode: '+55', prefix: '11 98765-' },
  { flag: '🇮🇳', name: 'India', dialCode: '+91', prefix: '98765 ' },
  { flag: '🇲🇽', name: 'Mexico', dialCode: '+52', prefix: '55 1234 ' },
  { flag: '🇰🇷', name: 'South Korea', dialCode: '+82', prefix: '10 2345 ' },
  { flag: '🇵🇱', name: 'Poland', dialCode: '+48', prefix: '512 345 ' },
];

const CARRIERS = [
  'Verizon LTE',
  'T-Mobile 5G',
  'AT&T Mobility',
  'Vodafone Gigacell',
  'O2 Wireless',
  'Orange Mobile',
  'Deutsche Telekom',
  'Telstra 5G',
  'NTT Docomo',
  'Singtel Global',
];

export const generateSingleSmsItem = (idIndex?: number, secondsAgo?: number): LiveSmsMessage => {
  const service = SOCIAL_SERVICES[Math.floor(Math.random() * SOCIAL_SERVICES.length)];
  const country = WORLD_COUNTRIES[Math.floor(Math.random() * WORLD_COUNTRIES.length)];
  const carrier = CARRIERS[Math.floor(Math.random() * CARRIERS.length)];
  const numberSuffix = Math.floor(1000 + Math.random() * 9000);
  const number = `${country.dialCode} ${country.prefix}${numberSuffix}`;
  const code = service.codeFormat();
  const content = service.template(code);

  const sec = secondsAgo !== undefined ? secondsAgo : Math.floor(Math.random() * 120);
  let timeAgo = 'Just now';
  if (sec === 0) timeAgo = 'Just now';
  else if (sec < 60) timeAgo = `${sec}s ago`;
  else if (sec < 3600) timeAgo = `${Math.floor(sec / 60)}m ago`;
  else timeAgo = `${Math.floor(sec / 3600)}h ago`;

  const now = Date.now();
  const timestamp = now - sec * 1000;

  return {
    id: `sms-${idIndex ?? Math.random().toString(36).substring(2, 11)}-${timestamp}`,
    service: service.name,
    category: service.category,
    number,
    countryCode: country.dialCode,
    countryFlag: country.flag,
    countryName: country.name,
    code,
    timeAgo,
    timestamp,
    content,
    badgeColor: service.badgeColor,
    iconEmoji: service.iconEmoji,
    carrier,
  };
};

/**
 * Generates an initial pool of 500 realistic social media, tech companies & app OTPs
 */
export const generateSocialOtpPool = (count = 500): LiveSmsMessage[] => {
  const list: LiveSmsMessage[] = [];
  
  // Distribute timestamps progressively across seconds and minutes
  for (let i = 0; i < count; i++) {
    // Progressive delay so items are neatly ordered in time
    const secondsAgo = Math.floor(i * 6 + Math.random() * 4);
    list.push(generateSingleSmsItem(i + 1, secondsAgo));
  }

  // Ensure first entries highlight top technology companies & social media
  if (list.length >= 4) {
    list[0] = {
      ...list[0],
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

    list[1] = {
      ...list[1],
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

    list[2] = {
      ...list[2],
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

    list[3] = {
      ...list[3],
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

  return list;
};

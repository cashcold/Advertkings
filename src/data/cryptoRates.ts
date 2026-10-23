export interface CryptoRate {
  symbol: string;
  name: string;
  pair: string;
  price: number;
  change24h: number;
  icon: string;
  high24h?: number;
  low24h?: number;
}

export const INITIAL_CRYPTO_RATES: CryptoRate[] = [
  { symbol: "BTC", name: "Bitcoin", pair: "BTC/USDT", price: 89450.0, change24h: 3.42, icon: "₿" },
  { symbol: "ETH", name: "Ethereum", pair: "ETH/USDT", price: 3480.5, change24h: 2.18, icon: "Ξ" },
  { symbol: "SOL", name: "Solana", pair: "SOL/USDT", price: 198.75, change24h: 5.64, icon: "◎" },
  { symbol: "BNB", name: "BNB Chain", pair: "BNB/USDT", price: 615.2, change24h: 1.15, icon: "🔶" },
  { symbol: "XRP", name: "Ripple", pair: "XRP/USDT", price: 1.48, change24h: 4.82, icon: "✕" },
  { symbol: "DOGE", name: "Dogecoin", pair: "DOGE/USDT", price: 0.224, change24h: -1.25, icon: "Ð" },
  { symbol: "ADA", name: "Cardano", pair: "ADA/USDT", price: 0.742, change24h: 2.91, icon: "₳" },
  { symbol: "AVAX", name: "Avalanche", pair: "AVAX/USDT", price: 38.65, change24h: -0.84, icon: "🔺" },
  { symbol: "TON", name: "Toncoin", pair: "TON/USDT", price: 6.84, change24h: 6.12, icon: "💎" },
  { symbol: "TRX", name: "Tron", pair: "TRX/USDT", price: 0.208, change24h: 1.05, icon: "⚡" },
  { symbol: "LINK", name: "Chainlink", pair: "LINK/USDT", price: 18.92, change24h: 3.78, icon: "⬡" },
  { symbol: "SUI", name: "Sui", pair: "SUI/USDT", price: 3.42, change24h: 8.95, icon: "💧" },
  { symbol: "PEPE", name: "Pepe", pair: "PEPE/USDT", price: 0.0000214, change24h: 7.42, icon: "🐸" },
  { symbol: "NEAR", name: "Near Protocol", pair: "NEAR/USDT", price: 6.85, change24h: 2.30, icon: "Ⓝ" },
  { symbol: "DOT", name: "Polkadot", pair: "DOT/USDT", price: 7.95, change24h: -0.45, icon: "●" },
  { symbol: "LTC", name: "Litecoin", pair: "LTC/USDT", price: 92.4, change24h: 1.88, icon: "Ł" },
  { symbol: "BCH", name: "Bitcoin Cash", pair: "BCH/USDT", price: 478.5, change24h: 3.10, icon: "Ƀ" },
  { symbol: "USDT", name: "Tether USD", pair: "USDT/USD", price: 1.0002, change24h: 0.02, icon: "₮" },
];

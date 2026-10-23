# ⚽ VVIP Sports & Casino Marketing Portal

A high-performance web platform featuring interactive betting banners, the 100% VVIP Football Betting Slip with live fixture integration via Football-Data.org API, sound effects, odds calculator, and casino promo tools.

---

## 🚀 Quick Start Guide (Local Setup)

When you download/export this project and run it on your local computer:

### 1. Prerequisites
- **Node.js**: Version `18.x`, `20.x`, or higher
- **npm** (comes bundled with Node.js)

### 2. Installation
Open your terminal in the downloaded project folder and run:
```bash
npm install
```

### 3. Environment Variables (Optional)
Create a `.env` file in the project root (or copy from `.env.example`):
```bash
# Your Football-Data.org API key (already defaults in server.ts if omitted)
FOOTBALL_DATA_API_KEY=5583e8dd06c549f7ac6ddaa97bfefd05

# Optional Gemini API key
GEMINI_API_KEY=
```

### 4. Running the Application

#### Option A: Development Mode (Recommended)
```bash
npm run dev
```
- Starts the full-stack server with live Vite middleware.
- Open your browser at: **`http://localhost:3000`**

#### Option B: Production Build & Run
```bash
# 1. Build the frontend and backend bundle
npm run build

# 2. Start the production server
npm start
```
- Open your browser at: **`http://localhost:3000`**

---

## 🛠️ Scripts Reference

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Express backend + Vite dev server on port 3000 |
| `npm run build` | Builds Vite static client assets to `/dist` and bundles `server.ts` |
| `npm start` | Runs the compiled production server (`node dist/server.cjs`) |
| `npm run lint` | Runs TypeScript type verification (`tsc --noEmit`) |

---

## ⚡ What to Expect When You Open
- **No Infinite Reloads**: Standard single-page application state without continuous page resets.
- **Auto Fixture Loading**: Automatically queries `football-data.org` for authentic live and upcoming matches with official club crests.
- **Combined Odds Calculator**: Instant dynamic odds calculation for 2-match and 3-match VVIP combinations with copyable Telegram ticket requests.

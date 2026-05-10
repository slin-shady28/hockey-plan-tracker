# Hockey Plan Tracker

An AI-powered hockey training app for players aged 10–18. Generates a personalized training plan, tracks daily sessions, and analyzes skating/shooting technique via short video clips.

Built with React Native (Expo) + Node.js/Express backend + Claude AI.

---

## What's Inside

```
hockey-plan-tracker/   ← Expo mobile app (iOS + Android)
backend/               ← Node.js/Express API server
```

---

## The App

Six bottom tabs built around the "Mastering the Fundamentals" framework:

| Tab | Name | What it does |
|-----|------|-------------|
| 🎯 | Know Your Target | Set up your profile (age, position, skill level, goals). Claude generates your full training plan. |
| 🏒 | Master The Fundamentals | AI-generated skill checklist. Mark each skill as working on it or mastered. |
| 📅 | Build Your Routine | Weekly training schedule with drills per day. Mark sessions complete and rate quality 1–5 stars. |
| ⏱ | Quality Over Quantity | Focus mode — one drill at a time with a countdown timer. |
| 🔥 | The Discipline Difference | Streak counter, calendar heatmap, consistency score, milestone badges. |
| 🎥 | AI Coach | Record or upload a 10–30 second video clip. Claude analyzes your technique and returns corrections + a practice drill. |

**Visual theme:** Frozen lake at night — dark navy background, icy teal accents, frosted glass cards, animated frost particles on every screen.

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo`)
- Expo Go app on your phone (iOS or Android)
- ffmpeg installed on your machine (required for AI Coach video analysis)
  - macOS: `brew install ffmpeg`
- An [Anthropic API key](https://console.anthropic.com/)

### 1. Backend

```bash
cd backend
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm install
npm run dev
```

The API runs on `http://localhost:3001`.

### 2. Mobile App

```bash
cd hockey-plan-tracker
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone.

> **Note:** The app connects to `http://localhost:3001` by default. To point it at a different backend, set `EXPO_PUBLIC_API_URL` in a `.env` file inside `hockey-plan-tracker/`.

---

## How It Works

**Plan generation:** On first launch, you fill out a short profile (age, position, skill level, up to 3 goals). The app sends this to the backend, which calls Claude to generate a personalized fundamentals checklist and weekly training schedule tailored to you.

**Video analysis:** Record or pick a short clip from your camera roll. The backend extracts the first frame using ffmpeg, sends it to Claude's vision API with your player context, and Claude returns structured feedback — what looks good, up to 3 specific corrections, and one drill to fix the main issue. All past analyses are saved on-device.

**All player data is stored locally** using SQLite (no account required). AI features require an internet connection.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native, Expo SDK 54, expo-router |
| Animations | React Native Reanimated 4 |
| State | Zustand 5 |
| Local DB | Expo SQLite 16 |
| Backend | Node.js, Express 5, TypeScript |
| AI | Anthropic Claude (`claude-sonnet-4-6`) |
| Video | fluent-ffmpeg (frame extraction) |

---

## Running Tests

```bash
cd hockey-plan-tracker
npx jest
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/generate-plan` | Takes player profile, returns AI-generated training plan |
| POST | `/analyze-video` | Takes video file + player context, returns technique feedback |

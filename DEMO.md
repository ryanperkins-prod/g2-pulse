# G2 Pulse - Demo Guide

**Built for G2 Hackathon 2026**

## 🎯 What is G2 Pulse?

G2 Pulse is an NPS feedback tool that helps software vendors:
- **Capture** feedback at the right moment with an embeddable widget
- **Analyze** responses with competitive benchmarking
- **Convert** happy customers into G2 reviews while routing detractors to support

## 🚀 Quick Start (Local Demo)

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Start application
npm run dev
```

Then open:
- **Dashboard**: http://localhost:5173/dashboard
- **Demo Page**: Open `/demo/index.html` in your browser

## 📹 Demo Video

[Add your Loom/video link here]

## 🎬 Live Demo Script (5 minutes)

### 1. Introduction (30 sec)
"G2 Pulse helps software vendors capture NPS feedback, analyze it with competitive context, and intelligently route users based on their score."

### 2. Embeddable Widget (1 min)
- Open demo page (`/demo/index.html`)
- Click "Complete Task" → Widget appears
- Select score 9, add comment "Love this product!"
- Submit → Redirected to landing page

### 3. Campaign Landing - Promoter (30 sec)
- Shows G2-branded review request
- Prominent "Leave a Review on G2" CTA
- Explain: "This converts happy customers into reviews"

### 4. Analytics Dashboard (1.5 min)
- Open http://localhost:5173/dashboard
- **Show metrics**: NPS score, total responses, avg score
- **Show breakdown bar**: 50% Promoters, 30% Passives, 20% Detractors
- **Show trend chart**: 30-day NPS movement
- **🔥 Competitive Benchmark** (KEY DIFFERENTIATOR):
  - "This panel shows how you compare to industry standards"
  - Point out your score vs. industry avg (32) vs. category avg (41) vs. top performer (67)
- **Show response feed**: Recent feedback with filters

### 5. Live Campaign Editing (1 min)
- Click "Campaign Settings" tab
- Edit Promoter headline: "You're a rockstar! 🎸 Share the love?"
- Edit CTA button: "Write My G2 Review"
- Click Save
- Go back to landing page, refresh → **instant update**
- "This is critical for A/B testing and live demos"

### 6. Detractor Experience (30 sec)
- Go back to demo page
- Click "Show Widget Now"
- Select score 3, comment "Too expensive"
- Submit → Landing page shows support link, NO G2 review
- "We protect your G2 reputation by routing detractors to support"

### 7. Dashboard Updates (30 sec)
- Return to dashboard
- New responses appear in feed
- Metrics updated in real-time

## 🏗️ Architecture

```
Frontend: React + Vite + Tailwind CSS
Backend: Node.js + Express
Database: SQLite (90 days of seed data)
Widget: Vanilla JavaScript (embeddable via script tag)
```

## ✨ Key Features

### 1. Embeddable NPS Widget
- Single `<script>` tag installation
- Three trigger modes: action, delay, manual
- Configurable branding and product name
- Anonymous user tracking

### 2. Analytics Dashboard
- Real-time NPS calculation (% Promoters - % Detractors)
- 30-day trend visualization with Recharts
- **Competitive benchmarking** (unique to G2 Pulse!)
- Filterable response feed (date, category, trigger)
- Live-editable campaign settings

### 3. Smart Review Routing
- **Promoters (9-10)**: G2 review CTA with branding
- **Passives (7-8)**: Resource link + optional review
- **Detractors (0-6)**: Support link, NO G2 review
- Real-time content updates from dashboard

## 🎯 Competitive Advantages

1. **G2-Specific**: Built specifically for converting NPS into G2 reviews
2. **Benchmarking**: Shows competitive context (industry/category averages)
3. **Smart Routing**: Protects G2 reputation by filtering detractors
4. **Live Editing**: Change campaign copy in real-time during demos/tests
5. **Easy Installation**: Single script tag, no SDK required

## 📊 Sample Data

The database is pre-seeded with:
- 90 NPS responses over 60 days
- Realistic distribution: 50% Promoters, 30% Passives, 20% Detractors
- Varied trigger types and comments

## 🚢 Production Roadmap

To take this to production, we'd need:

1. **Database**: Migrate SQLite → PostgreSQL
2. **Auth**: Vendor login + API keys for widget
3. **Infrastructure**: Deploy to Vercel (frontend) + Railway (backend)
4. **Widget CDN**: Host on CloudFlare with versioning
5. **Security**: Rate limiting, CORS whitelist, env variables
6. **Monitoring**: Sentry error tracking, uptime monitoring
7. **Integrations**: Webhooks for Slack/Zendesk on detractor responses
8. **Real Benchmarks**: Pull actual G2 category data via API

## 👥 Team

[Add your team members]

## 📧 Contact

[Add your contact info]

---

**Tech Stack**: React 18 • Node.js • Express • SQLite • Tailwind CSS • Recharts • Vite

**GitHub**: [Add repo link after push]

**Demo Video**: [Add video link]

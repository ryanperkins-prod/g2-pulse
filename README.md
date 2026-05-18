# G2 Pulse

**An NPS feedback tool that helps software vendors collect, analyze, and act on Net Promoter Score data.**

G2 Pulse provides three core modules:
1. **Embeddable NPS Widget** — A script-tag widget vendors embed in their product
2. **Analytics Dashboard** — A myG2-style dashboard with competitive benchmarks
3. **Review Generation Campaigns** — Smart landing pages that route respondents based on their score

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install:all

# Start both backend and frontend
npm run dev
```

This will start:
- **Backend API**: http://localhost:3001
- **Frontend App**: http://localhost:5173
- **Demo Page**: http://localhost:5173 (open `/demo/index.html` directly, or serve it)

The SQLite database will be automatically initialized with 90 days of seed data on first run.

---

## 📊 Demo Walkthrough (5 Minutes)

Follow this script during your presentation to showcase all features:

### Step 1: Introduction (30 seconds)
"G2 Pulse helps software vendors capture NPS feedback at the right moment, analyze it with competitive context, and convert happy customers into G2 reviews."

### Step 2: Demo the Embeddable Widget (1 minute)

**Open**: `http://localhost:5173/demo/index.html` or open `/demo/index.html` directly in your browser

**Show**:
- "This is a fake SaaS product called TaskFlow Pro. Notice the demo controls in the bottom left."
- "The widget supports three trigger modes: action-based, time-delayed, or manual."

**Action**:
1. Click **"Complete Task"** button
2. The NPS widget slides up from the bottom-right
3. Click a score (try **9** for Promoter)
4. Fill in a comment: *"Love the product! Makes my job easier."*
5. Click **Submit Feedback**

**Result**: Widget shows thank-you message, then redirects to campaign landing page.

---

### Step 3: Campaign Landing Page - Promoter Experience (1 minute)

**You should now see**: `http://localhost:5173/campaign/campaign_demo?score=9`

**Show**:
- "This is the Promoter experience for users who scored 9-10."
- Point out the **G2-branded design**, the celebratory headline, and the prominent **"Leave a Review on G2"** button.
- "The copy is dynamically pulled from campaign settings, which we'll edit in a moment."

**Action**:
- Hover over the CTA button to show interactivity
- Scroll to show the "What to expect" section

---

### Step 4: Analytics Dashboard - Overview (1.5 minutes)

**Open**: `http://localhost:5173/dashboard`

**Show the four summary metrics**:
- "Here's our current NPS score: calculated as % Promoters minus % Detractors."
- Point to Total Responses, Response Rate, and Average Score cards.

**Show the NPS Distribution**:
- "This horizontal bar shows the breakdown: Detractors in red, Passives in yellow, Promoters in green."
- "Notice we have a healthy 50% Promoters in our seed data."

**Show the Trend Chart**:
- "This line chart shows our NPS over the past 30 days."
- "The data is seeded for the last 60 days, so you see realistic movement."

**Show the Competitive Benchmark Panel** (KEY DIFFERENTIATOR):
- "This is where G2 Pulse really shines. We show how your NPS compares to industry standards."
- Point to the horizontal benchmark axis showing:
  - Your Score (orange)
  - Industry Average: 32
  - Category Average: 41
  - Top Performer: 67
- "This gives vendors instant competitive context — they know if they're ahead or behind."

**Show the Response Feed**:
- Scroll to the recent responses
- "Each response shows the score, category badge, comment, timestamp, and trigger type."

**Show the Filters**:
- Change **Date Range** to "Last 7 days" — watch metrics update
- Change **Category** to "Promoters" — watch feed filter
- Change **Trigger Type** to "action" — watch feed filter again
- Reset filters to "All"

---

### Step 5: Live Edit Campaign Settings (1 minute)

**Action**:
1. Click the **"Campaign Settings"** tab in the dashboard
2. Scroll to **Promoter Experience**
3. Edit the **Headline** field to: *"You're a rockstar! 🎸 Share the love?"*
4. Edit the **CTA Button Text** to: *"Write My G2 Review"*
5. Click **"Save Campaign Settings"** at the bottom
6. Wait for success alert

**Show the Real-Time Update**:
1. Open a new tab (or go back to): `http://localhost:5173/campaign/campaign_demo?score=9`
2. Refresh the page
3. **Point out**: "See? The headline and button text updated instantly. This is critical for live demos and A/B testing."

---

### Step 6: Detractor Experience (30 seconds)

**Action**:
1. Go back to the demo page: Open `/demo/index.html` in browser
2. Click **"Show Widget Now"**
3. Select score **3** (Detractor)
4. Enter comment: *"Too expensive and buggy."*
5. Submit

**Show**:
- Campaign landing page now shows the **Detractor experience**
- Point out: "No G2 review link — instead we show a 'Contact Support' button."
- "This prevents negative reviews from going to G2, and routes them to support."

---

### Step 7: Dashboard Updates (30 seconds)

**Action**:
1. Return to the dashboard: `http://localhost:5173/dashboard`
2. The metrics have updated to include your two new responses
3. Scroll to the **Recent Responses** feed
4. Point out the two new entries at the top (score 9 and score 3)

**Wrap up**:
"That's G2 Pulse! It captures feedback at the right moment, gives vendors competitive context, and intelligently routes users to maximize reviews while protecting your G2 reputation."

---

## 🏗️ Architecture

```
g2-pulse/
├── backend/              # Node.js + Express API
│   ├── server.js         # API routes
│   ├── database.js       # SQLite schema & seed data
│   └── g2pulse.db        # SQLite database (auto-created)
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Analytics dashboard
│   │   │   └── CampaignLanding.jsx    # Review gen landing page
│   │   ├── main.jsx      # React router
│   │   └── index.css     # Tailwind styles
│   └── public/
│       └── g2-pulse-widget.js         # Embeddable widget
└── demo/
    └── index.html        # Demo SaaS product page
```

---

## 🔌 API Endpoints

### `POST /api/nps/response`
Save a new NPS response.

**Body**:
```json
{
  "vendorId": "vendor_g2demo",
  "campaignId": "campaign_demo",
  "score": 9,
  "comment": "Great product!",
  "triggeredBy": "action",
  "userId": "user_abc123"
}
```

### `GET /api/nps/responses?vendorId=&days=&category=&trigger=`
Get filtered responses.

### `GET /api/nps/summary?vendorId=&days=`
Get NPS summary statistics and trend data.

### `GET /api/campaign/:campaignId`
Get campaign settings.

### `PUT /api/campaign/:campaignId`
Update campaign settings.

---

## 🎨 Widget Configuration

Embed the widget in any web page:

```html
<script
  src="http://localhost:5173/g2-pulse-widget.js"
  data-vendor-id="vendor_g2demo"
  data-campaign-id="campaign_demo"
  data-product-name="Your Product"
  data-trigger="delay"
  data-delay="5"
  data-theme="light"
></script>
```

### Configuration Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-vendor-id` | String | Unique vendor identifier |
| `data-campaign-id` | String | Campaign ID (links to settings) |
| `data-product-name` | String | Product name shown in widget |
| `data-trigger` | `action`, `delay`, `manual` | When to show widget |
| `data-delay` | Number | Seconds before auto-show (delay mode) |
| `data-theme` | `light`, `dark` | Widget color theme |

### Trigger Modes

**Action Trigger**: Show after a user action
```javascript
// Your product code
document.querySelector('#complete-btn').addEventListener('click', () => {
  // ... your logic ...
  window.dispatchEvent(new Event('g2pulse-action-completed'));
});
```

**Delay Trigger**: Show after a time delay
```html
<script ... data-trigger="delay" data-delay="10"></script>
```

**Manual Trigger**: Show programmatically
```javascript
window.G2Pulse.show();
```

---

## 🗄️ Database Schema

### `vendors`
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT)
- `createdAt` (TEXT, ISO 8601)

### `campaigns`
- `id` (TEXT, PRIMARY KEY)
- `vendorId` (TEXT, FOREIGN KEY)
- `headline`, `subheadline` (TEXT)
- `promoterCta`, `promoterLink` (TEXT)
- `passiveMessage`, `passiveLink` (TEXT)
- `detractorMessage`, `detractorLink` (TEXT)
- `createdAt`, `updatedAt` (TEXT, ISO 8601)

### `nps_responses`
- `id` (INTEGER, AUTO INCREMENT)
- `vendorId` (TEXT, FOREIGN KEY)
- `campaignId` (TEXT, FOREIGN KEY)
- `score` (INTEGER, 0-10)
- `category` (TEXT: Promoter/Passive/Detractor)
- `comment` (TEXT)
- `triggeredBy` (TEXT: action/delay/manual)
- `userId` (TEXT)
- `timestamp` (TEXT, ISO 8601)

---

## 🎯 Key Features

### ✅ Embeddable Widget
- Self-contained, single `<script>` tag installation
- Three trigger modes: action, delay, manual
- Configurable theme and product name
- Anonymous user tracking (localStorage)

### ✅ Analytics Dashboard
- Real-time NPS calculation
- 30-day trend visualization
- **Competitive benchmarking** (industry/category/top performer)
- Filterable response feed
- Live-editable campaign settings

### ✅ Review Generation
- Dynamic landing pages based on score
- **Promoters (9-10)**: G2 review CTA with branding
- **Passives (7-8)**: Resource link + optional review
- **Detractors (0-6)**: Support link, no G2 review
- Real-time content updates from dashboard

---

## 🧪 Seed Data

The database is pre-populated with:
- 1 demo vendor (`vendor_g2demo`)
- 1 demo campaign (`campaign_demo`)
- 90 NPS responses spread over 60 days
  - 50% Promoters (scores 9-10)
  - 30% Passives (scores 7-8)
  - 20% Detractors (scores 0-6)
- Varied trigger types and realistic comments

---

## 🚢 Production Considerations

This is a hackathon prototype. For production, consider:

- Replace SQLite with PostgreSQL or MySQL
- Add authentication (vendor login, API keys for widget)
- Rate limiting on API endpoints
- Widget CDN hosting and versioning
- GDPR compliance (user consent, data deletion)
- Email notifications for detractor responses
- More sophisticated benchmarking (real G2 category data)
- A/B testing framework for campaign variants
- Webhook integrations (Slack, Zendesk, etc.)

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, better-sqlite3
- **Database**: SQLite (local development)
- **Widget**: Vanilla JavaScript (no dependencies)

---

## 📝 License

MIT

---

## 👥 Team

Built for the G2 Hackathon 2026 by [Your Team Name]

**Questions?** Open an issue or contact [your email]

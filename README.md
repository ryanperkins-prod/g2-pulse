# G2 Pulse - NPS Widget & Analytics Dashboard

A full-stack NPS (Net Promoter Score) tool for software vendors with embeddable widget, review generation flow, and analytics dashboard.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start both servers (backend + frontend)
npm run dev
```

**URLs:**
- Dashboard: http://localhost:5173
- Settings: http://localhost:5173/settings  
- Campaign Page: http://localhost:5173/campaign/campaign_demo?score=9
- Demo Page: Open `demo/index.html` in browser
- Backend API: http://localhost:3001

## ✨ What's Built

### Navigation & Pages
✓ Top nav with G2 Pulse branding  
✓ Dashboard with filters, metrics, charts  
✓ Settings page (4 tabs)  
✓ Campaign landing pages  
✓ Demo test page with fake SaaS UI  

### Components  
✓ MetricCard  
✓ NPSBreakdownBar  
✓ BenchmarkBar  
✓ NPSTrendChart  
✓ ResponseFeed  

### Backend
✓ All API routes functional  
✓ SQLite auto-seed (90 responses, 50 days)  
✓ Review generation tracking  
✓ Click-review endpoint  

## 🎯 Test It

1. **Dashboard**: http://localhost:5173  
   - Filter by date, category, trigger
   - View NPS metrics, trends, benchmarks
   - See review generation performance

2. **Settings**: http://localhost:5173/settings  
   - Edit campaign settings across 4 tabs
   - Save and see changes live

3. **Demo Page**: `demo/index.html`  
   - Click "Complete Task" to trigger widget
   - Submit NPS score
   - See thank you screen

4. **Campaign Landing**: http://localhost:5173/campaign/campaign_demo?score=9  
   - Use score switcher to preview different experiences

## 📊 Key Features

- **NPS Scoring**: Automatic categorization (Detractor 0-6, Passive 7-8, Promoter 9-10)
- **Review Gen Tracking**: $25 increment rewards, completion rates by category
- **Competitive Benchmarks**: Compare vs industry avg (32), category avg (41), top performer (67)
- **Hot-reloadable Settings**: No code deploy needed for campaign changes
- **Time-drift Protection**: 50-day seed window prevents filter edge cases

## 🐛 Troubleshooting

**Reset database** (if math seems off):
```bash
rm backend/g2pulse.db
npm run dev
```

**Kill stuck servers**:
```bash
pkill -f "npm run dev"
```

**Widget not showing**:
- Clear localStorage in browser console
- Verify both servers running (3001 + 5173)

# Deploy to Railway (Easiest Option - 3 Minutes)

Railway is the simplest because it deploys BOTH frontend and backend together with one click.

## Step 1: Sign Up (30 seconds)
1. Go to **https://railway.app/**
2. Click "Login" 
3. Click "Login with GitHub"
4. Authorize Railway (1 click)
✅ Done! No email, no password, just GitHub OAuth.

## Step 2: Deploy (1 minute)
1. Click "New Project"
2. Click "Deploy from GitHub repo"
3. Select: `ryanperkins-prod/g2-pulse`
4. Railway auto-detects everything
5. Click "Deploy Now"

## Step 3: Get Your URL (30 seconds)
1. Once deployed, click your project
2. Click "Settings" → "Generate Domain"
3. Copy your URL: `g2-pulse-production.up.railway.app`

## That's It! 🎉

Your app is live at:
- Full app: `https://g2-pulse-production.up.railway.app`
- API: `https://g2-pulse-production.up.railway.app/api/health`

## Why Railway?
- ✅ No config files needed (I made them anyway)
- ✅ Both frontend + backend deploy together
- ✅ Free $5 credit (plenty for demos)
- ✅ SQLite works out of the box
- ✅ Auto HTTPS
- ✅ Zero downtime deploys

## Troubleshooting

**If backend doesn't start:**
- Railway → Project → Settings → Environment Variables
- Add: `NODE_ENV = production`

**If frontend can't reach backend:**
- It should work automatically (same domain)
- Frontend env is already set to use relative API URLs

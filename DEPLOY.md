# Deployment Guide

## Frontend (Vercel)

1. Go to https://vercel.com/new
2. Import `ryanperkins-prod/g2-pulse` from GitHub
3. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variable:
   ```
   VITE_API_URL = https://g2-pulse-api.onrender.com
   ```
   (Update with your actual Render backend URL after Step 2)

5. Click "Deploy"

Your frontend will be live at: `https://g2-pulse-<random>.vercel.app`

## Backend (Render.com)

1. Go to https://render.com/
2. Click "New +" → "Web Service"
3. Connect GitHub and select `ryanperkins-prod/g2-pulse`
4. Configure:
   - **Name**: `g2-pulse-api`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render uses this)

6. Click "Create Web Service"

Your backend will be live at: `https://g2-pulse-api.onrender.com`

## Update Frontend Environment

After backend deploys:
1. Copy your Render backend URL
2. Go to Vercel → Project Settings → Environment Variables
3. Update `VITE_API_URL` to your Render URL
4. Redeploy frontend

## CORS Configuration

The backend `server.js` already has `cors()` enabled for all origins, so it should work immediately.

## Database

SQLite database will be created automatically on first backend start. It will seed with 90 demo responses.

**Note**: Render's free tier resets the filesystem on sleep/wake, so the database will re-seed on each cold start. For production, migrate to PostgreSQL.

## Testing

Once both are deployed:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-api.onrender.com/api/health`
- Demo: Open frontend URL to see dashboard

## Alternative: All-in-One Deploy

If you prefer a single platform, use **Railway.app** or **Fly.io** which can host both frontend and backend together.

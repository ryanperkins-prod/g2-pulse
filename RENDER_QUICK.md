# Deploy to Render (Plan B - Also Easy)

## Step 1: Sign Up
1. Go to **https://render.com/**
2. Click "Get Started" or "Sign Up"
3. Click "Sign up with GitHub"
4. Authorize Render

## Step 2: Deploy Backend First
1. Click "New +" → "Web Service"
2. Connect your GitHub account if not already
3. Select repository: `ryanperkins-prod/g2-pulse`
4. Settings:
   ```
   Name: g2-pulse-api
   Root Directory: backend
   Build Command: npm install
   Start Command: node server.js
   Plan: Free
   ```
5. Click "Create Web Service"
6. **Copy the URL** it gives you (like `https://g2-pulse-api.onrender.com`)

## Step 3: Deploy Frontend
1. Click "New +" → "Static Site"
2. Select same repo: `ryanperkins-prod/g2-pulse`
3. Settings:
   ```
   Name: g2-pulse
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: frontend/dist
   ```
4. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: (paste your backend URL from step 2)
5. Click "Create Static Site"

## Done!
Your app will be live at: `https://g2-pulse.onrender.com`

## Notes
- Free tier sleeps after 15 min of inactivity
- First request might take 30 seconds to wake up
- Perfect for demos!

# Render Deployment Guide

## Deploy to Render

### 1. Push to GitHub
```bash
git add .
git commit -m "Production ready Urban Intelligence Platform"
git push origin main
```

### 2. Deploy on Render
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure settings below

### 3. Service Configuration
- **Name**: urban-intelligence-platform
- **Environment**: Node
- **Region**: Closest to your users
- **Branch**: main
- **Root Directory**: ./
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Instance Type**: Standard (or Free for testing)

### 4. Environment Variables
```
DATABASE_URL=postgresql://neondb_owner:npg_IdmRr7Qte5jO@ep-solitary-lab-ahzabi9i-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
SESSION_SECRET=your-super-secure-production-secret-key-12345
CORS_ORIGINS=https://urban-intelligence-platform.onrender.com
TRUST_PROXY=true
```

### 5. Add PostgreSQL (Optional)
- Add PostgreSQL addon from Render marketplace
- Update DATABASE_URL with Render's PostgreSQL connection

### 6. Deploy
Click "Create Web Service" - Render will auto-deploy!

## Production URL
Your app will be available at: `https://urban-intelligence-platform.onrender.com`

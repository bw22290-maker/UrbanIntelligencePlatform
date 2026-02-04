# Railway Deployment Guide

## Quick Deploy to Railway

### 1. Push to GitHub
```bash
git add .
git commit -m "Production ready Urban Intelligence Platform"
git push origin main
```

### 2. Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js app

### 3. Environment Variables
Set these in Railway dashboard:
```
DATABASE_URL=postgresql://neondb_owner:npg_IdmRr7Qte5jO@ep-solitary-lab-ahzabi9i-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
SESSION_SECRET=your-super-secure-production-secret-key-12345
CORS_ORIGINS=https://your-app-name.railway.app
TRUST_PROXY=true
```

### 4. Deploy Settings
- Build Command: `npm run build`
- Start Command: `npm start`
- Port: 5000

### 5. Custom Domain (Optional)
Add your custom domain in Railway settings for professional URL.

## Features Deployed
✅ Production-optimized build (69KB gzipped)
✅ Security headers and rate limiting
✅ Health monitoring endpoints
✅ PostgreSQL database with Neon
✅ Error handling and logging
✅ SSL/HTTPS automatically
✅ Zero-downtime deployments

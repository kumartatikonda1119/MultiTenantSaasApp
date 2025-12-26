# 🚀 Render Deployment Guide - Single Service

## Overview

This is a **single web service deployment** where both frontend and backend run on the same Render service.

```
Frontend (React) + Backend (Node.js + Express) + PostgreSQL
           ↓
      Single Render Service
```

---

## 📋 Step-by-Step Deployment

### Step 1: Create PostgreSQL Database on Render

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in:

   - **Name**: `saas-platform-db`
   - **Database**: `saas_db`
   - **User**: `saas_user`
   - **PostgreSQL Version**: 15
   - **Plan**: Free

4. Click **"Create Database"**
5. **Copy the connection string** (you'll see it after creation):
   ```
   postgres://saas_user:password@dpg-xxx.render.internal:5432/saas_db
   ```

---

### Step 2: Create Web Service for Frontend + Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Fill in:

   | Field             | Value                     |
   | ----------------- | ------------------------- |
   | **Name**          | `saas-platform`           |
   | **Environment**   | `Node`                    |
   | **Region**        | Choose closest to you     |
   | **Build Command** | `bash build.sh`           |
   | **Start Command** | `cd backend && npm start` |

4. Click **"Create Web Service"**

---

### Step 3: Set Environment Variables

In the Render dashboard for your web service:

1. Go to **"Environment"** tab
2. Add these variables:

```env
DATABASE_URL=postgres://saas_user:password@dpg-xxx.render.internal:5432/saas_db
JWT_SECRET=your_super_secret_key_change_this_value
JWT_EXPIRES_IN=24h
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://saas-platform.onrender.com
```

⚠️ **Important:**

- Replace `password` with your actual database password
- Replace `dpg-xxx` with your actual database URL from Step 1
- Change `JWT_SECRET` to something secure
- Your `FRONTEND_URL` will be available after first deploy

---

### Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (2-3 minutes)
3. Check logs for any errors

---

## ✅ Verify Deployment

### Test 1: Check Health Endpoint

```bash
curl https://saas-platform.onrender.com/api/health
```

Expected response:

```json
{ "status": "ok", "database": "connected" }
```

### Test 2: Visit Frontend

Open: `https://saas-platform.onrender.com`

Should see login page!

### Test 3: Login with Seed Data

```
Email: superadmin@system.com
Password: Admin@123
```

---

## 📊 How Single Service Works

### Local Development (localhost)

```
React App (port 3000)
    ↓
Makes request to /api/login
    ↓
Node.js Backend (port 5000) handles /api/*
```

### Render Production

```
React App (served from /frontend/build)
    ↓
Makes request to /api/login
    ↓
Same Node.js server (port 3000) handles /api/*
```

**No separate domains needed!** ✅

---

## 🔄 How It Works

1. **Build Step** (`bash build.sh`):

   - Installs frontend dependencies
   - Builds React app to `/frontend/build` folder
   - Installs backend dependencies

2. **Start Step** (`cd backend && npm start`):

   - Backend Express server starts
   - Serves static files from `/frontend/build`
   - Handles API routes at `/api/*`
   - Handles React routing for other paths

3. **Flow**:
   - User visits `https://saas-platform.onrender.com`
   - Backend serves `index.html` from `/frontend/build`
   - React app loads and makes API calls to `/api/*`
   - Same backend server handles both!

---

## 🐛 Troubleshooting

### Frontend not loading

```
→ Check: /frontend/build folder exists
→ Solution: Run `npm run build` locally in frontend folder
```

### API calls fail with 404

```
→ Check: REACT_APP_API_URL is set to /api in frontend/.env
→ Solution: Rebuild and redeploy
```

### Database connection error

```
→ Check: DATABASE_URL in environment variables
→ Solution: Copy exact URL from Render PostgreSQL dashboard
```

### Stuck on "Deploying"

```
→ Check: Logs in Render dashboard
→ Solution: Make sure build.sh is executable
```

---

## 📝 Environment Variables Explained

| Variable       | Purpose               | Example                |
| -------------- | --------------------- | ---------------------- |
| `DATABASE_URL` | PostgreSQL connection | `postgres://...`       |
| `JWT_SECRET`   | Token signing key     | `super-secret-key`     |
| `NODE_ENV`     | Execution mode        | `production`           |
| `PORT`         | Server port           | `3000`                 |
| `FRONTEND_URL` | For CORS headers      | `https://your-app.com` |

---

## 🎯 Summary

✅ One Render service for both frontend & backend
✅ Simpler than separate services
✅ Cheaper (1 service = less cost)
✅ Easy to manage and debug
✅ Perfect for starting out
✅ Can scale later if needed

---

## 🚀 Next Steps

1. Push code to GitHub
2. Create PostgreSQL on Render
3. Create Web Service and deploy
4. Update `FRONTEND_URL` after first deployment
5. Redeploy with correct URL
6. Test login with seed credentials

**You got this!** 💪

# 🚀 QUICK FIX GUIDE - Admin Branch Redirect Issue

## ⚠️ THE PROBLEM
Your admin dashboard at `dtsolarsug-admin.vercel.app` is redirecting to the main customer website at `dtsolarsug.vercel.app`.

## 💡 THE CAUSE
Both branches are deployed in **ONE Vercel project** instead of **TWO separate projects**.

## ✅ THE SOLUTION (5 Minutes)

### Step 1: Go to Vercel Dashboard
👉 [https://vercel.com/dashboard](https://vercel.com/dashboard)

### Step 2: Check Your Current Setup
Look at your projects. You probably have:
- ❌ **ONE project** called `dtsolarsug` (or similar)
- ✅ You need **TWO projects**

### Step 3: Keep Existing Project for Main Branch
1. Click on your existing project
2. Go to **Settings** → **Git**
3. Make sure **Production Branch** is set to `main`
4. Scroll to **Ignored Build Step** and add:
   ```bash
   if [ "$VERCEL_GIT_COMMIT_REF" = "admin" ]; then exit 0; else exit 1; fi
   ```
5. Save changes

### Step 4: Create NEW Project for Admin Branch
1. Click **"Add New" → "Project"**
2. Import the **SAME** repository: `mozemedia5/dtsolarsug`
3. Configure:
   - **Project Name**: `dtsolarsug-admin` (different name!)
   - **Framework**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. ⚠️ **IMPORTANT**: Change **Production Branch** from `main` to `admin`
5. Click **"Deploy"**

### Step 5: Add Environment Variables to New Project
Go to **Settings** → **Environment Variables** and add (for all environments):

```
VITE_FIREBASE_API_KEY=AIzaSyA5ymAuOnSgjh66jGW19nFu-fHICcVBXdQ
VITE_FIREBASE_AUTH_DOMAIN=dt-solars.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dt-solars
VITE_FIREBASE_STORAGE_BUCKET=dt-solars.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=635043180373
VITE_FIREBASE_APP_ID=1:635043180373:web:c7e63f1134b7fffef009dc
```

### Step 6: Wait for Deployment
- Wait 2-3 minutes for deployment to complete
- You'll see a success message

### Step 7: Test Your URLs
✅ **Main Website**: `https://dtsolarsug.vercel.app` → Should show customer website  
✅ **Admin Dashboard**: `https://dtsolarsug-admin.vercel.app` → Should show admin login

---

## 🎯 Expected Result

| URL | Shows | Status |
|-----|-------|--------|
| `dtsolarsug.vercel.app` | Customer Website | ✅ Works |
| `dtsolarsug-admin.vercel.app` | Admin Login Page | ✅ Works |

---

## 🚨 Still Not Working?

### If admin still shows customer website:
1. Go to `dtsolarsug-admin` project in Vercel
2. Settings → Git → **Production Branch** → Change to `admin`
3. Go to Deployments → Click **"Redeploy"** with `admin` branch
4. Clear browser cache (Ctrl+Shift+R)

### If you see only ONE project in Vercel:
- You must create a SECOND project (Step 4 above)
- Import the same repository again
- Give it a different name: `dtsolarsug-admin`
- Set its production branch to `admin`

---

## 📖 Need More Details?
See the full guide: `VERCEL_DEPLOYMENT_GUIDE.md`

---

**Quick Start Time:** ~5 minutes  
**Difficulty:** Easy  
**Cost:** Free (Vercel free tier)

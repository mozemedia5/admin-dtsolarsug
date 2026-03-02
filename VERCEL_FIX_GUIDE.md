# Vercel Deployment Guide - DT Solars

## 🚨 CRITICAL: The Problem & Solution

### The Problem
Your admin branch (dtsolarsug-admin.vercel.app) is redirecting to the main branch (dtsolarsug.vercel.app) because **both branches are likely configured in the same Vercel project**.

### The Solution
You need **TWO SEPARATE Vercel projects**:
1. **Project 1**: `dtsolarsug` - Main branch (customer website)
2. **Project 2**: `dtsolarsug-admin` - Admin branch (admin dashboard)

---

## ✅ Step-by-Step Fix

### Step 1: Check Your Current Vercel Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project(s) related to `dtsolarsug`
3. Check which branches are connected to which projects

**CRITICAL**: If you see ONE project with both `main` and `admin` branches, that's the problem!

### Step 2: Create/Update Vercel Projects

#### Option A: If You Have Only ONE Project (Most Likely)

1. **Keep the existing project for the main branch:**
   - Go to your existing project settings
   - Go to **Git** settings
   - Under **Production Branch**, ensure it's set to `main`
   - Under **Ignored Branches**, add `admin` (this prevents admin from deploying here)

2. **Create a NEW project for the admin branch:**
   - Click **"Add New"** → **"Project"**
   - Import the same repository: `mozemedia5/dtsolarsug`
   - Configure:
     - **Project Name**: `dtsolarsug-admin` (MUST be different)
     - **Framework Preset**: Vite (auto-detected)
     - **Root Directory**: `./` (leave as default)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Under **Git** settings (after creation):
     - Set **Production Branch** to `admin`
     - Under **Ignored Branches**, add `main` (this prevents main from deploying here)

#### Option B: If You Already Have Two Projects

1. **Main project (dtsolarsug):**
   - Settings → Git → Production Branch → `main`
   - Settings → Git → Ignored Branches → Add `admin`

2. **Admin project (dtsolarsug-admin):**
   - Settings → Git → Production Branch → `admin`
   - Settings → Git → Ignored Branches → Add `main`

### Step 3: Configure Environment Variables

Both projects need Firebase environment variables (they can share the same Firebase project).

#### For Main Project (dtsolarsug):
1. Go to **Settings** → **Environment Variables**
2. Add these for all environments (Production, Preview, Development):
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

#### For Admin Project (dtsolarsug-admin):
Repeat the same environment variable setup (same values).

### Step 4: Deploy Both Branches

1. **Trigger deployment for main branch:**
   - Go to main project → Deployments
   - Click **"Redeploy"** or make a commit to main branch
   - Wait for deployment to complete
   - URL: `https://dtsolarsug.vercel.app` or similar

2. **Trigger deployment for admin branch:**
   - Go to admin project → Deployments
   - Click **"Redeploy"** or make a commit to admin branch
   - Wait for deployment to complete
   - URL: `https://dtsolarsug-admin.vercel.app` or similar

---

## 🔍 Verification Steps

After deployment, verify both are working independently:

### Test Main Branch (Customer Website)
1. Visit: `https://dtsolarsug.vercel.app` (or your URL)
2. You should see the customer-facing website
3. Check that navigation works (Home, About, Products, etc.)

### Test Admin Branch (Admin Dashboard)
1. Visit: `https://dtsolarsug-admin.vercel.app` (or your URL)
2. You should see the **admin login page** (NOT the customer website)
3. If you still see the customer website, the deployment is still wrong

---

## 🛠️ Troubleshooting

### Problem: Admin still shows customer website
**Solution:**
1. Delete the admin deployment from the main project
2. Ensure admin project only deploys from `admin` branch
3. Clear browser cache and try again

### Problem: Both URLs show the same content
**Solution:**
1. Check that you have TWO separate projects in Vercel
2. Each project must have different production branches (`main` vs `admin`)
3. Each project must ignore the other branch

### Problem: Firebase errors (black screen)
**Solution:**
1. Check that environment variables are set in **both** projects
2. Verify Firebase authentication is enabled
3. Verify Firestore database is enabled
4. Check browser console (F12) for specific errors

---

## 📋 Vercel Project Configuration Summary

### Main Project Settings
```
Name: dtsolarsug
Repository: mozemedia5/dtsolarsug
Production Branch: main
Ignored Branches: admin
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

### Admin Project Settings
```
Name: dtsolarsug-admin
Repository: mozemedia5/dtsolarsug
Production Branch: admin
Ignored Branches: main
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

---

## 🎯 Expected URLs After Proper Setup

- **Main Website**: `https://dtsolarsug.vercel.app` → Shows customer website
- **Admin Dashboard**: `https://dtsolarsug-admin.vercel.app` → Shows admin login

Both should be completely independent and functional!

---

## 📞 Need Help?

If you're still having issues:
1. Screenshot your Vercel project settings (Git configuration)
2. Check browser console errors (F12)
3. Verify you have TWO separate projects in Vercel dashboard
4. Make sure each project is configured with the correct branch

---

**Last Updated:** 2026-03-02  
**Status:** ✅ Both branches have `vercel.json` configured  
**Action Required:** Follow the steps above to set up two separate Vercel projects

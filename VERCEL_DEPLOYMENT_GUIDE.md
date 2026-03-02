# 🚀 Vercel Deployment Guide - DT Solars Uganda

## ⚠️ CRITICAL: Why Admin Branch Redirects to Main

### The Problem
Your admin dashboard (`dtsolarsug-admin.vercel.app`) is redirecting to the main customer website (`dtsolarsug.vercel.app`) because **both branches are deployed in the same Vercel project**.

### The Root Cause
When you deploy both `main` and `admin` branches in a single Vercel project:
- Vercel treats `main` as the production branch
- All other branches (including `admin`) become preview deployments
- Preview deployments share the same build configuration as production
- This causes the admin branch to build and deploy the main website code

### The Solution
You need **TWO COMPLETELY SEPARATE Vercel projects**:

1. **Project 1**: `dtsolarsug` → deploys `main` branch → customer website
2. **Project 2**: `dtsolarsug-admin` → deploys `admin` branch → admin dashboard

---

## ✅ Step-by-Step Setup Instructions

### Prerequisites
- ✅ GitHub repository: `mozemedia5/dtsolarsug`
- ✅ Two branches: `main` and `admin`
- ✅ Vercel account (free tier works fine)
- ✅ Firebase credentials ready

---

## 📦 Part 1: Deploy Main Branch (Customer Website)

### 1. Create Main Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New" → "Project"**
3. Click **"Import Git Repository"**
4. Select or search for: `mozemedia5/dtsolarsug`
5. Click **"Import"**

### 2. Configure Main Project

**Project Settings:**
- **Project Name**: `dtsolarsug` (or your preferred name)
- **Framework Preset**: Vite (should auto-detect)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `dist` (auto-filled)

**Git Settings (CRITICAL):**
After clicking import, you'll be on the configuration page:
- **Production Branch**: Should default to `main` ✅
- Click **"Deploy"** (we'll configure ignored branches after first deployment)

### 3. Add Environment Variables to Main Project

After the first deployment completes:

1. Go to **Settings** → **Environment Variables**
2. Add these variables for **ALL environments** (Production, Preview, Development):

```env
VITE_FIREBASE_API_KEY=AIzaSyA5ymAuOnSgjh66jGW19nFu-fHICcVBXdQ
VITE_FIREBASE_AUTH_DOMAIN=dt-solars.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dt-solars
VITE_FIREBASE_STORAGE_BUCKET=dt-solars.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=635043180373
VITE_FIREBASE_APP_ID=1:635043180373:web:c7e63f1134b7fffef009dc
```

3. After adding variables, go to **Deployments** and click **"Redeploy"** to apply them

### 4. Configure Branch Protection for Main Project

1. Go to **Settings** → **Git**
2. Scroll to **Ignored Build Step**
3. Add this custom command:
   ```bash
   if [ "$VERCEL_GIT_COMMIT_REF" = "admin" ]; then exit 0; else exit 1; fi
   ```
   This prevents the admin branch from triggering builds in this project

**Expected Result:**
- Main branch URL: `https://dtsolarsug.vercel.app` (or your assigned URL)
- Should display: Customer website with Home, Products, Services, etc.

---

## 🔐 Part 2: Deploy Admin Branch (Admin Dashboard)

### 1. Create Admin Project

1. Go back to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New" → "Project"** (create a SECOND project)
3. Click **"Import Git Repository"**
4. Select the **SAME** repository: `mozemedia5/dtsolarsug`
5. Click **"Import"**

### 2. Configure Admin Project

**Project Settings:**
- **Project Name**: `dtsolarsug-admin` (MUST be different from main project!)
- **Framework Preset**: Vite
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

**Git Settings (CRITICAL):**
- **Production Branch**: Change from `main` to `admin` ⚠️ (This is crucial!)
- Click **"Deploy"**

### 3. Change Production Branch to Admin

**IMPORTANT:** Vercel defaults to `main` branch, you must change this:

1. After clicking "Import", you'll see the configuration page
2. Scroll down to **Git Configuration**
3. Look for **"Production Branch"** setting
4. Change it from `main` to `admin`
5. Click **"Deploy"**

**Alternative method if you missed this step:**
1. Wait for first deployment to complete (it will deploy main branch incorrectly)
2. Go to **Settings** → **Git**
3. Under **Production Branch**, change from `main` to `admin`
4. Save changes
5. Go to **Deployments** → Click **"Redeploy"** with `admin` branch selected

### 4. Add Environment Variables to Admin Project

1. Go to **Settings** → **Environment Variables**
2. Add the **SAME** variables as the main project:

```env
VITE_FIREBASE_API_KEY=AIzaSyA5ymAuOnSgjh66jGW19nFu-fHICcVBXdQ
VITE_FIREBASE_AUTH_DOMAIN=dt-solars.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dt-solars
VITE_FIREBASE_STORAGE_BUCKET=dt-solars.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=635043180373
VITE_FIREBASE_APP_ID=1:635043180373:web:c7e63f1134b7fffef009dc
```

3. After adding variables, click **"Redeploy"**

### 5. Configure Branch Protection for Admin Project

1. Go to **Settings** → **Git**
2. Scroll to **Ignored Build Step**
3. Add this custom command:
   ```bash
   if [ "$VERCEL_GIT_COMMIT_REF" = "main" ]; then exit 0; else exit 1; fi
   ```
   This prevents the main branch from triggering builds in this project

**Expected Result:**
- Admin branch URL: `https://dtsolarsug-admin.vercel.app` (or your assigned URL)
- Should display: **Admin login page** (NOT the customer website!)

---

## 🔍 Verification Checklist

### ✅ Main Project (`dtsolarsug`)
- [ ] Project name: `dtsolarsug`
- [ ] Production branch: `main`
- [ ] Environment variables: 6 variables added
- [ ] URL works: Shows customer website
- [ ] Ignored branches: `admin` (using custom ignore command)

### ✅ Admin Project (`dtsolarsug-admin`)
- [ ] Project name: `dtsolarsug-admin`
- [ ] Production branch: `admin` ⚠️ (NOT `main`!)
- [ ] Environment variables: 6 variables added
- [ ] URL works: Shows admin login page
- [ ] Ignored branches: `main` (using custom ignore command)

---

## 🧪 Testing Your Deployment

### Test 1: Main Website
1. Visit: `https://dtsolarsug.vercel.app` (your actual URL)
2. **Expected**: Customer website homepage
3. **You should see**: 
   - DT Solars branding
   - Navigation: Home, About, Products, Services, Branches, Contact
   - Product listings
   - Bottom navigation (mobile)
4. **You should NOT see**: Login page or admin dashboard

### Test 2: Admin Dashboard
1. Visit: `https://dtsolarsug-admin.vercel.app` (your actual URL)
2. **Expected**: Admin login page
3. **You should see**:
   - "DT Solars Admin Dashboard" title
   - Email and password input fields
   - Login button
   - Orange/dark theme
4. **You should NOT see**: Customer website or product listings

### Test 3: Admin Login
1. On admin URL, try logging in with your admin credentials
2. **Expected**: Dashboard with admin navigation
3. **You should see**:
   - Dashboard, Products, Promotions, Reviews, Admins menu
   - Admin statistics and data
   - Logout button

---

## 🚨 Troubleshooting

### Problem 1: Admin URL Still Shows Customer Website

**Symptoms:**
- `dtsolarsug-admin.vercel.app` displays the customer website
- Admin login page is nowhere to be found

**Solution:**
1. Go to Vercel Dashboard → `dtsolarsug-admin` project
2. Click **Settings** → **Git**
3. Verify **Production Branch** is set to `admin` (NOT `main`)
4. If it's set to `main`, change it to `admin`
5. Go to **Deployments** → Select `admin` branch → Click **"Redeploy"**
6. Wait for deployment to complete
7. Clear browser cache and test again

### Problem 2: Both URLs Show the Same Content

**Symptoms:**
- Both URLs show either all customer website or all admin dashboard

**Diagnosis:**
- You likely have only ONE Vercel project (not two)

**Solution:**
1. Go to Vercel Dashboard
2. Count your projects related to `dtsolarsug`
3. If you only see ONE project:
   - You need to create a SECOND project
   - Follow **Part 2: Deploy Admin Branch** instructions above
4. If you see TWO projects:
   - Check that one has production branch `main`
   - Check that the other has production branch `admin`

### Problem 3: Firebase Errors (Black Screen)

**Symptoms:**
- Blank/black screen after deployment
- Browser console shows Firebase errors

**Solution:**
1. Open browser console (F12) and check for errors
2. Common issues:
   - "Firebase: Error (auth/invalid-api-key)" → Check environment variables
   - "Firebase: Error (auth/project-not-found)" → Verify project ID
3. Go to Vercel project **Settings** → **Environment Variables**
4. Verify all 6 Firebase variables are present
5. Make sure they're added to all environments (Production, Preview, Development)
6. After fixing, go to **Deployments** and click **"Redeploy"**

### Problem 4: Admin Login Not Working

**Symptoms:**
- Admin page loads correctly
- Login button doesn't work or shows error

**Solution:**
1. Check Firebase Console:
   - Ensure Authentication is enabled
   - Ensure Firestore Database is created
   - Verify admin user exists in `admins` collection
2. Check browser console for specific error messages
3. Verify environment variables are correctly set

### Problem 5: Changes Not Reflecting

**Symptoms:**
- Made changes to code but deployment shows old version

**Solution:**
1. Make sure you pushed changes to the correct branch in GitHub
2. Check Vercel **Deployments** tab to see if auto-deployment triggered
3. If not triggered automatically:
   - Go to **Deployments**
   - Click **"Redeploy"**
   - Select the correct branch
4. Wait for deployment to complete
5. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

---

## 📊 Project Configuration Summary

### Main Project Configuration
```
Name: dtsolarsug
Repository: mozemedia5/dtsolarsug
Production Branch: main
Framework: Vite
Build Command: npm run build
Output Directory: dist
Environment Variables: 6 Firebase variables
Ignored Branches: admin
```

### Admin Project Configuration
```
Name: dtsolarsug-admin
Repository: mozemedia5/dtsolarsug
Production Branch: admin
Framework: Vite
Build Command: npm run build
Output Directory: dist
Environment Variables: 6 Firebase variables (same as main)
Ignored Branches: main
```

---

## 🔄 Continuous Deployment

After initial setup, deployments are automatic:

### Main Branch Updates
1. Make changes to `main` branch
2. Push to GitHub: `git push origin main`
3. Vercel automatically detects and deploys
4. Check deployment status in Vercel Dashboard

### Admin Branch Updates
1. Make changes to `admin` branch
2. Push to GitHub: `git push origin admin`
3. Vercel automatically detects and deploys
4. Check deployment status in Vercel Dashboard

---

## 🎯 Quick Reference URLs

After successful deployment, bookmark these:

| Purpose | Project | Branch | URL Pattern |
|---------|---------|--------|-------------|
| Customer Website | dtsolarsug | main | `https://dtsolarsug.vercel.app` |
| Admin Dashboard | dtsolarsug-admin | admin | `https://dtsolarsug-admin.vercel.app` |
| GitHub Repository | - | both | `https://github.com/mozemedia5/dtsolarsug` |
| Vercel Dashboard | - | - | `https://vercel.com/dashboard` |
| Firebase Console | - | - | `https://console.firebase.google.com` |

---

## 📞 Need Help?

If you're still experiencing issues:

1. **Check Vercel deployment logs:**
   - Go to the failing project in Vercel
   - Click **Deployments** → Select failed deployment
   - Click **"Building"** section to see build logs
   - Look for error messages

2. **Verify Git branches:**
   ```bash
   git branch -a
   # Should show: main, admin, remotes/origin/main, remotes/origin/admin
   ```

3. **Check project structure:**
   - Main branch: `src/main.tsx` imports `App.tsx` (customer website)
   - Admin branch: `src/main.tsx` imports `AdminApp.tsx` (admin dashboard)

4. **Screenshot checklist:**
   - Vercel projects list (should show TWO projects)
   - Each project's Git settings (showing production branch)
   - Deployment URLs and what they display

---

## ✨ Expected Final State

### After Successful Setup:

✅ **Two separate Vercel projects:**
1. `dtsolarsug` → main branch → customer website
2. `dtsolarsug-admin` → admin branch → admin dashboard

✅ **Two working URLs:**
1. Customer website: `https://dtsolarsug.vercel.app`
2. Admin dashboard: `https://dtsolarsug-admin.vercel.app`

✅ **Independent deployments:**
- Changes to `main` only deploy to customer website
- Changes to `admin` only deploy to admin dashboard
- No cross-contamination or redirects

✅ **Functional features:**
- Customer website: Browse products, contact, pre-orders
- Admin dashboard: Login, manage products, promotions, reviews, users

---

**Last Updated:** March 2, 2026  
**Status:** ✅ Both branches configured correctly in GitHub  
**Action Required:** Follow this guide to set up two separate Vercel projects  
**Repository:** https://github.com/mozemedia5/dtsolarsug

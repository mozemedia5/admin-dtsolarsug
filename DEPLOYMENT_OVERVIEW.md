# 📊 DT Solars - Branch Architecture & Deployment Overview

## 🎯 Problem Summary

**Issue:** Admin dashboard (`dtsolarsug-admin.vercel.app`) redirects to customer website (`dtsolarsug.vercel.app`)

**Root Cause:** Both branches deployed in ONE Vercel project instead of TWO separate projects

**Impact:** Admin users cannot access the dashboard

---

## 🏗️ Current Repository Structure

```
Repository: mozemedia5/dtsolarsug
│
├── 📁 main branch (Customer Website)
│   ├── src/main.tsx → imports App.tsx
│   ├── src/App.tsx → Customer website with Home, Products, Services, etc.
│   ├── index.html → "DT Solars & CCTV Cameras"
│   ├── vercel.json → name: "dtsolarsug"
│   └── Firebase: Authentication + Firestore (customer data)
│
└── 📁 admin branch (Admin Dashboard)
    ├── src/main.tsx → imports AdminApp.tsx
    ├── src/AdminApp.tsx → Admin dashboard with login + management
    ├── index.html → "DT Solars Admin Dashboard"
    ├── vercel.json → name: "dtsolarsug-admin"
    └── Firebase: Authentication + Firestore (admin operations)
```

---

## ❌ Current (Broken) Deployment Architecture

```
GitHub Repository
   └── mozemedia5/dtsolarsug
        ├── main branch
        └── admin branch
              ⬇️
        ONE Vercel Project
        "dtsolarsug"
              ⬇️
    Production Branch: main
    All other branches: Preview
              ⬇️
        BOTH branches deploy
        customer website code
              ⬇️
    🚫 RESULT: Admin redirects to main
```

**Problem:** Vercel treats `admin` as a preview branch of the main project, so it builds and deploys the same code as main.

---

## ✅ Correct (Fixed) Deployment Architecture

```
GitHub Repository
   └── mozemedia5/dtsolarsug
        │
        ├── main branch ────────────┐
        │                           │
        └── admin branch ───────────┤
                                    │
                    ┌───────────────┴──────────────┐
                    │                              │
                    ⬇️                             ⬇️
            Vercel Project 1              Vercel Project 2
            "dtsolarsug"                  "dtsolarsug-admin"
                    │                              │
            Production: main              Production: admin
            Ignores: admin               Ignores: main
                    │                              │
                    ⬇️                             ⬇️
          dtsolarsug.vercel.app     dtsolarsug-admin.vercel.app
          (Customer Website)        (Admin Dashboard)
```

**Solution:** Two separate Vercel projects, each deploying a different branch with different code.

---

## 🔑 Key Differences Between Branches

### Main Branch (Customer-Facing)
| Component | Purpose | Key Files |
|-----------|---------|-----------|
| `App.tsx` | Main customer app | Navigation, product browsing |
| `Home.tsx` | Homepage | Hero, features, testimonials |
| `Products.tsx` | Product catalog | Solar systems, CCTV, batteries |
| `Contact.tsx` | Contact form | Customer inquiries |
| `index.html` | Customer metadata | "DT Solars & CCTV Cameras" |

**Features:**
- 🏠 Home page with company info
- 📦 Product browsing and details
- 🔧 Services information
- 🏪 Branch locations
- 📞 Contact form
- ⭐ Customer reviews (read-only)
- 🛒 Pre-order system

### Admin Branch (Internal)
| Component | Purpose | Key Files |
|-----------|---------|-----------|
| `AdminApp.tsx` | Main admin app | Authentication, dashboard routing |
| `AdminLogin.tsx` | Login page | Email/password auth |
| `AdminDashboard.tsx` | Dashboard | Statistics, overview |
| `AdminProducts.tsx` | Product management | CRUD operations |
| `AdminPromotions.tsx` | Promotion management | Create/edit promotions |
| `AdminReviews.tsx` | Review moderation | Approve/delete reviews |
| `AdminUsers.tsx` | Admin management | Add/remove admins |
| `index.html` | Admin metadata | "DT Solars Admin Dashboard" |

**Features:**
- 🔐 Secure login (Firebase Auth)
- 📊 Dashboard with statistics
- ➕ Create/edit/delete products
- 🎉 Manage promotions
- ✅ Moderate customer reviews
- 👥 Manage admin users
- 🔓 Logout functionality

---

## 🔧 Technical Configuration

### Both Branches Share:
✅ Same Firebase project (authentication & database)  
✅ Same build tools (Vite, React, TypeScript)  
✅ Same styling (Tailwind CSS)  
✅ Same environment variables  

### Branches Differ:
❌ Entry point (`App.tsx` vs `AdminApp.tsx`)  
❌ Routes and navigation  
❌ User interface and features  
❌ HTML title and metadata  
❌ Vercel project configuration  

---

## 📋 Vercel Project Configuration

### Project 1: Customer Website

```yaml
Name: dtsolarsug
Repository: mozemedia5/dtsolarsug
Branch: main
URL: https://dtsolarsug.vercel.app

Git Settings:
  Production Branch: main
  Ignored Branches: admin
  Ignore Command: if [ "$VERCEL_GIT_COMMIT_REF" = "admin" ]; then exit 0; else exit 1; fi

Build Settings:
  Framework: Vite
  Build Command: npm run build
  Output Directory: dist
  Install Command: npm install

Environment Variables:
  VITE_FIREBASE_API_KEY: AIzaSyA5ymAuOnSgjh66jGW19nFu-fHICcVBXdQ
  VITE_FIREBASE_AUTH_DOMAIN: dt-solars.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID: dt-solars
  VITE_FIREBASE_STORAGE_BUCKET: dt-solars.firebasestorage.app
  VITE_FIREBASE_MESSAGING_SENDER_ID: 635043180373
  VITE_FIREBASE_APP_ID: 1:635043180373:web:c7e63f1134b7fffef009dc
```

### Project 2: Admin Dashboard

```yaml
Name: dtsolarsug-admin
Repository: mozemedia5/dtsolarsug
Branch: admin
URL: https://dtsolarsug-admin.vercel.app

Git Settings:
  Production Branch: admin
  Ignored Branches: main
  Ignore Command: if [ "$VERCEL_GIT_COMMIT_REF" = "main" ]; then exit 0; else exit 1; fi

Build Settings:
  Framework: Vite
  Build Command: npm run build
  Output Directory: dist
  Install Command: npm install

Environment Variables:
  VITE_FIREBASE_API_KEY: AIzaSyA5ymAuOnSgjh66jGW19nFu-fHICcVBXdQ
  VITE_FIREBASE_AUTH_DOMAIN: dt-solars.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID: dt-solars
  VITE_FIREBASE_STORAGE_BUCKET: dt-solars.firebasestorage.app
  VITE_FIREBASE_MESSAGING_SENDER_ID: 635043180373
  VITE_FIREBASE_APP_ID: 1:635043180373:web:c7e63f1134b7fffef009dc
```

---

## 🚀 Deployment Workflow

### Automatic Deployments

#### Main Branch (Customer Website)
```
1. Developer pushes to main branch
2. GitHub webhook notifies Vercel
3. Vercel Project 1 (dtsolarsug) triggers build
4. Build: npm install → npm run build
5. Deploy to production
6. URL updated: dtsolarsug.vercel.app
7. ✅ Customer website updated
```

#### Admin Branch (Admin Dashboard)
```
1. Developer pushes to admin branch
2. GitHub webhook notifies Vercel
3. Vercel Project 2 (dtsolarsug-admin) triggers build
4. Build: npm install → npm run build
5. Deploy to production
6. URL updated: dtsolarsug-admin.vercel.app
7. ✅ Admin dashboard updated
```

### Branch Isolation
- ✅ Changes to `main` do NOT trigger `dtsolarsug-admin` project
- ✅ Changes to `admin` do NOT trigger `dtsolarsug` project
- ✅ Each branch deploys independently
- ✅ No cross-contamination or redirects

---

## 🎯 Expected URLs After Fix

| Branch | Vercel Project | Production URL | Shows |
|--------|---------------|----------------|-------|
| `main` | `dtsolarsug` | `https://dtsolarsug.vercel.app` | Customer Website |
| `admin` | `dtsolarsug-admin` | `https://dtsolarsug-admin.vercel.app` | Admin Dashboard |

---

## 📝 Implementation Checklist

### Phase 1: Verify Current State
- [ ] Check Vercel Dashboard for number of projects
- [ ] Verify which branches are connected to which projects
- [ ] Identify if the problem is one-project or misconfiguration

### Phase 2: Configure Main Project
- [ ] Set production branch to `main`
- [ ] Add branch ignore rule for `admin`
- [ ] Verify environment variables (6 Firebase variables)
- [ ] Test deployment: Should show customer website

### Phase 3: Create Admin Project
- [ ] Create new Vercel project
- [ ] Import same repository
- [ ] Name it `dtsolarsug-admin` (different from main)
- [ ] Set production branch to `admin`
- [ ] Add branch ignore rule for `main`
- [ ] Add environment variables (same 6 Firebase variables)
- [ ] Deploy and test: Should show admin login

### Phase 4: Verification
- [ ] Visit `dtsolarsug.vercel.app` → See customer website
- [ ] Visit `dtsolarsug-admin.vercel.app` → See admin login
- [ ] Test admin login → See dashboard
- [ ] Verify no redirects between URLs
- [ ] Clear browser cache and test again

### Phase 5: Documentation
- [✅] Read `QUICK_FIX.md` for 5-minute setup guide
- [✅] Read `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions
- [✅] Read this `DEPLOYMENT_OVERVIEW.md` for architecture understanding

---

## 🔍 Verification Commands

### Check Local Branches
```bash
git branch -a
# Should show: main, admin, remotes/origin/main, remotes/origin/admin
```

### Verify Entry Points
```bash
# Main branch
git checkout main
grep "import.*from.*App" src/main.tsx
# Should output: import App from './App.tsx'

# Admin branch
git checkout admin
grep "import.*from.*AdminApp" src/main.tsx
# Should output: import AdminApp from './AdminApp.tsx'
```

### Test Deployments
```bash
# Test main website
curl -I https://dtsolarsug.vercel.app
# Should return 200 OK

# Test admin dashboard
curl -I https://dtsolarsug-admin.vercel.app
# Should return 200 OK
```

---

## 💡 Why This Solution Works

### Problem with One Project:
- Vercel uses the production branch code for all branches
- Admin branch becomes a "preview" deployment
- Previews use the same build configuration as production
- Result: Admin branch builds and deploys main branch code

### Solution with Two Projects:
- Each project has its own production branch
- Each project builds its own branch's code
- No shared configuration or build artifacts
- Result: Each URL shows its correct application

---

## 🎓 Key Learnings

1. **One Repository, Multiple Projects**: You CAN deploy the same repository to multiple Vercel projects with different configurations

2. **Branch-Specific Deployments**: By setting different production branches, each project deploys different code from the same repository

3. **Environment Variable Sharing**: Both projects can use the same Firebase configuration since they share the same backend

4. **Independent Lifecycles**: Each project has its own:
   - Build pipeline
   - Deployment history
   - Environment variables (even if values are the same)
   - Custom domains
   - Analytics

5. **Git Branch Strategy**: The monorepo approach (one repository, multiple applications) works well when:
   - Applications share the same tech stack
   - Applications use the same backend services
   - You want to manage everything in one place
   - You need different deployment targets

---

## 📚 Additional Resources

### Documentation Files
1. **QUICK_FIX.md** - 5-minute setup guide (start here!)
2. **VERCEL_DEPLOYMENT_GUIDE.md** - Comprehensive step-by-step instructions
3. **DEPLOYMENT_OVERVIEW.md** - This file (architecture and technical details)

### External Links
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Git Integration](https://vercel.com/docs/git)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

---

**Repository:** https://github.com/mozemedia5/dtsolarsug  
**Created:** March 2, 2026  
**Status:** ✅ Code is ready, awaiting Vercel configuration  
**Next Step:** Follow QUICK_FIX.md to set up two Vercel projects

# Vercel Environment Variables Setup

## 🚨 URGENT: Firebase Configuration Required

Your admin dashboard is showing a black screen with the error:
```
FirebaseError: Firebase: Error (auth/invalid-api-key)
```

This is because the Firebase environment variables are not configured in Vercel.

## 🔧 How to Fix

### Step 1: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one if you haven't)
3. Click the gear icon ⚙️ → **Project Settings**
4. Scroll down to **Your apps** section
5. If you don't have a web app, click **Add app** → **Web** (</> icon)
6. You'll see your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Step 2: Add Environment Variables to Vercel

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: **dtsolarsug-admin**
3. Go to **Settings** → **Environment Variables**
4. Add these variables one by one:

| Variable Name | Example Value | Where to Get It |
|--------------|---------------|-----------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyAbc123...` | Firebase Config → apiKey |
| `VITE_FIREBASE_AUTH_DOMAIN` | `yourproject.firebaseapp.com` | Firebase Config → authDomain |
| `VITE_FIREBASE_PROJECT_ID` | `your-project-id` | Firebase Config → projectId |
| `VITE_FIREBASE_STORAGE_BUCKET` | `yourproject.firebasestorage.app` | Firebase Config → storageBucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Firebase Config → messagingSenderId |
| `VITE_FIREBASE_APP_ID` | `1:123:web:abc` | Firebase Config → appId |

5. For each variable:
   - Click **Add New**
   - Enter the **Name** (e.g., `VITE_FIREBASE_API_KEY`)
   - Enter the **Value** (copy from Firebase)
   - Select all environments: **Production**, **Preview**, **Development**
   - Click **Save**

### Step 3: Redeploy Your Application

After adding all environment variables:

1. Go to **Deployments** tab in Vercel
2. Find the latest deployment
3. Click the **three dots** (⋯) menu
4. Click **Redeploy**
5. Wait for deployment to complete

Your admin dashboard should now work properly!

## 🔒 Enable Firebase Authentication

Make sure these are enabled in Firebase:

1. Go to Firebase Console → **Authentication**
2. Click **Get Started** (if not already enabled)
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click **Save**

## 📦 Enable Cloud Firestore

1. Go to Firebase Console → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location closest to your users
5. Click **Enable**

## 🔐 Set Up Firestore Security Rules

After enabling Firestore, add these security rules:

1. Go to **Firestore Database** → **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin users collection
    match /admins/{userId} {
      allow read: if request.auth != null && 
                     exists(/databases/$(database)/documents/admins/$(request.auth.uid));
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'superadmin';
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true; // Public read access
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Promotions collection
    match /promotions/{promotionId} {
      allow read: if true; // Public read access
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true; // Public read access
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

3. Click **Publish**

## 👤 Create Your First Admin User

After deployment is working:

1. Open browser console (F12) on your admin dashboard
2. Run this command (replace with your desired email/password):

```javascript
// In the browser console on dtsolarsug-admin.vercel.app
await window.authService.initializeSuperAdmin('your-secure-password')
```

3. This will create the super admin account
4. Login with the email from `src/lib/authService.ts` (default: super@dtsolarsug.com)

## 🎉 Verification

After following all steps:

1. Visit: https://dtsolarsug-admin.vercel.app
2. You should see the login page (not black screen)
3. Login with your super admin credentials
4. You should see the admin dashboard

## 📞 Still Having Issues?

If the black screen persists:

1. Check browser console (F12) for error messages
2. Verify all 6 environment variables are correctly set in Vercel
3. Make sure you redeployed after adding variables
4. Check that Firebase Authentication and Firestore are enabled
5. Verify the Firebase project is on a paid plan if needed (Blaze plan for production)

## 🔗 Useful Links

- Firebase Console: https://console.firebase.google.com/
- Vercel Dashboard: https://vercel.com/dashboard
- Admin Dashboard: https://dtsolarsug-admin.vercel.app
- GitHub Repo: https://github.com/mozemedia5/dtsolarsug

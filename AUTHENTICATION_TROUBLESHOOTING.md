# Admin Authentication Troubleshooting Guide

## Overview

If your admin user cannot login, this guide will help you identify and fix the issue. The most common problems are:

1. **Missing or incorrect environment variables**
2. **User document not in the correct collection**
3. **Missing or incorrect user fields**
4. **Firebase configuration issues**
5. **Firestore security rules blocking access**

---

## Step 1: Verify Environment Variables

### What You Need

Your app requires these environment variables to be set:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### Where to Set Them

**For Local Development:**
1. Create a `.env.local` file in the project root
2. Add all the variables above with your Firebase credentials
3. Restart your dev server

**For Vercel Deployment:**
1. Go to your Vercel project settings
2. Click **Environment Variables**
3. Add all variables for **Production**, **Preview**, and **Development** environments
4. Redeploy your application

### How to Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Project Settings** (gear icon)
4. Go to **General** tab
5. Scroll to **Your apps** section
6. Find your web app and click the config icon
7. Copy all the values

### Example .env.local

```
VITE_FIREBASE_API_KEY=AIzaSyA5ymAuOnSgjh66jGW19nFu-fHICcVBXdQ
VITE_FIREBASE_AUTH_DOMAIN=dt-solars.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dt-solars
VITE_FIREBASE_STORAGE_BUCKET=dt-solars.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=635043180373
VITE_FIREBASE_APP_ID=1:635043180373:web:c7e63f1134b7fffef009dc
```

---

## Step 2: Verify User Document Structure

### Required User Document Format

Your Firestore database should have a `users` collection with documents like this:

```json
{
  "uid": "user-id-from-firebase-auth",
  "email": "admin@example.com",
  "role": "admin",
  "displayName": "Admin Name",
  "createdAt": "timestamp",
  "isActive": true
}
```

### How to Check in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. Look for the `users` collection
5. Click on your user document (should be named with the user's UID)
6. Verify all fields are present and correct

### Critical Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `uid` | string | Yes | Must match Firebase Auth UID |
| `email` | string | Yes | Must match Firebase Auth email |
| `role` | string | Yes | Must be exactly `"admin"` or `"super_admin"` (case-sensitive) |
| `displayName` | string | Yes | Any string value |
| `createdAt` | timestamp | Yes | Server timestamp |
| `isActive` | boolean | Yes | Must be `true` for login to work |

### Common Issues

❌ **Wrong Collection**: User is in `admins` collection instead of `users`  
✅ **Fix**: Move document to `users` collection

❌ **Wrong Role Value**: Role is `"Admin"` instead of `"admin"`  
✅ **Fix**: Change to lowercase `"admin"`

❌ **Missing isActive Field**: Document doesn't have `isActive` field  
✅ **Fix**: Add `isActive: true` field

❌ **isActive is false**: User is deactivated  
✅ **Fix**: Set `isActive: true`

---

## Step 3: Verify Firebase Authentication

### Check if User Exists in Firebase Auth

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication**
4. Click **Users** tab
5. Look for your admin user's email
6. Verify the user exists

### Create a User if Needed

If the user doesn't exist:

1. Click **Create user** button
2. Enter email and password
3. Click **Create**
4. Copy the UID that appears
5. Create a corresponding document in the `users` collection (see Step 2)

---

## Step 4: Check Firestore Security Rules

### Current Rules (Should Be This)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Admin-only collection example
    match /adminData/{document} {
      allow read, write: if isAdmin();
    }

    // Everything else (authenticated users only)
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    // Function to check admin role
    function isAdmin() {
      return request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}
```

### How to Update Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. Click **Rules** tab
5. Replace the content with the rules above
6. Click **Publish**

---

## Step 5: Test the Login

### Local Testing

1. Make sure you have a `.env.local` file with all Firebase credentials
2. Run `npm run dev`
3. Open the admin dashboard in your browser
4. Enter your admin email and password
5. Click **Sign In**

### What Should Happen

✅ **Success**: You see the admin dashboard  
❌ **Failure**: You see an error message

### Error Messages and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Access denied. This account does not have admin privileges." | User document missing or `role` field incorrect | Check Step 2 |
| "Login failed" | Firebase Auth error | Check credentials and Step 3 |
| "Black screen" | Environment variables missing | Check Step 1 |
| "Firebase error in console" | Firebase not initialized | Check environment variables |

---

## Step 6: Check Browser Console for Errors

### How to Open Console

1. Press **F12** (or Cmd+Option+I on Mac)
2. Click **Console** tab
3. Look for red error messages
4. Screenshot the error and compare with solutions below

### Common Console Errors

**Error**: `Firebase: Error (auth/invalid-api-key)`  
**Cause**: Wrong or missing `VITE_FIREBASE_API_KEY`  
**Solution**: Check Step 1

**Error**: `Cannot read property 'data' of undefined`  
**Cause**: User document not found in Firestore  
**Solution**: Check Step 2

**Error**: `Missing or insufficient permissions`  
**Cause**: Firestore security rules blocking access  
**Solution**: Check Step 4

---

## Step 7: Verify Deployment (Vercel)

### If Using Vercel

1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Verify all Firebase variables are set for all environments
4. Click **Deployments** → **Redeploy**
5. Wait for deployment to complete
6. Test the login on the deployed URL

### Common Deployment Issues

❌ **Environment variables not set in Vercel**  
✅ **Fix**: Add them in Settings → Environment Variables

❌ **Wrong branch deployed**  
✅ **Fix**: Make sure you're deploying from the `admin` branch

❌ **Cache issues**  
✅ **Fix**: Clear browser cache (Ctrl+Shift+R) and try again

---

## Quick Checklist

Use this checklist to verify everything is set up correctly:

- [ ] Environment variables are set (local: `.env.local`, Vercel: Settings)
- [ ] User exists in Firebase Authentication
- [ ] User document exists in Firestore `users` collection
- [ ] User document has all required fields
- [ ] `role` field is exactly `"admin"` or `"super_admin"` (lowercase)
- [ ] `isActive` field is `true`
- [ ] Firestore security rules are correct
- [ ] Browser console shows no errors
- [ ] Vercel deployment has environment variables set (if deployed)

---

## Still Not Working?

If you've checked all the above and still can't login:

1. **Check browser console** (F12 → Console) for specific error messages
2. **Screenshot the error** and the Firestore document structure
3. **Verify Firebase project ID** matches between auth and Firestore
4. **Try creating a new admin user** using the app's admin management interface
5. **Check Firebase logs** for any authentication errors

---

## Need Help?

If you're still having issues after following this guide:

1. Make sure all environment variables are correct
2. Verify the user document structure matches the format above
3. Check that `role` is exactly `"admin"` (lowercase)
4. Ensure `isActive` is `true`
5. Look at the browser console for specific error messages

---

**Last Updated:** 2026-03-02  
**Version:** 2.0

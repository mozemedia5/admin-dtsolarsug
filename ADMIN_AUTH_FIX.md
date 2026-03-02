# Admin Authentication Fix Guide

## Problem Summary

Your admin user created in Firebase Auth was unable to login because of a **collection mismatch** between your Firestore Security Rules and your application code.

### The Issue

**Your Firestore Security Rules** expected admin data in the `/users/{userId}` collection:
```javascript
function isAdmin() {
  return request.auth != null &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
}
```

**Your Application Code** was looking for admin data in the `/admins/{uid}` collection:
```typescript
// Old code in authService.ts (line 56)
const adminDoc = await getDoc(doc(db, 'admins', uid));
```

When you manually created a user in the `/users` collection with `role: "admin"`, the app still couldn't authenticate because it was checking the wrong collection.

---

## Solution Applied

I've updated `src/lib/authService.ts` to use the **`users` collection** instead of the `admins` collection. This aligns the application code with your Firestore Security Rules.

### Changes Made

All references to the `admins` collection have been updated to use the `users` collection:

1. **`checkAdminStatus()`** - Now checks `/users/{uid}` instead of `/admins/{uid}`
2. **`getAdminUser()`** - Now queries `/users/{uid}` instead of `/admins/{uid}`
3. **`createAdminUser()`** - Now creates users in `/users/{uid}` instead of `/admins/{uid}`
4. **`initializeSuperAdmin()`** - Now creates super admin in `/users/{uid}` instead of `/admins/{uid}`
5. **`getAllAdmins()`** - Now queries `/users` collection with role filter instead of `/admins`
6. **`updateAdminStatus()`** - Now updates `/users/{uid}` instead of `/admins/{uid}`
7. **`deleteAdminUser()`** - Now deletes from `/users/{uid}` instead of `/admins/{uid}`

---

## What You Need to Do

### Step 1: Update Your Firestore Data

Your manually created user document should already be in the correct collection (`/users`). Verify it has this structure:

```json
{
  "uid": "your-user-id",
  "email": "your-email@example.com",
  "role": "admin",
  "displayName": "Your Name",
  "createdAt": "timestamp",
  "isActive": true
}
```

### Step 2: Test the Login

1. Pull the latest changes from GitHub
2. Rebuild your application
3. Try logging in with your admin email and password
4. You should now be able to access the admin dashboard

### Step 3: Verify Firestore Rules Alignment

Your current Firestore rules are now perfectly aligned with the application code. No changes needed to your security rules.

---

## Firestore Collection Structure (Correct)

Your Firestore should have this structure:

```
firestore
├── users/
│   ├── {uid1}/
│   │   ├── uid: string
│   │   ├── email: string
│   │   ├── role: "admin" | "super_admin"
│   │   ├── displayName: string
│   │   ├── createdAt: timestamp
│   │   ├── createdBy: string (optional)
│   │   └── isActive: boolean
│   ├── {uid2}/
│   └── ...
├── adminData/
│   └── ... (admin-specific data)
└── ... (other collections)
```

---

## Troubleshooting

### Still Can't Login?

1. **Check the user exists**: Go to Firebase Console → Firestore → `users` collection and verify your user document exists
2. **Verify the role field**: Make sure the `role` field is set to exactly `"admin"` or `"super_admin"` (case-sensitive)
3. **Check isActive flag**: Ensure `isActive` is set to `true`
4. **Verify Firebase Auth**: Go to Firebase Console → Authentication and confirm the user exists with the correct email
5. **Check browser console**: Look for error messages that might indicate what's wrong

### Creating New Admin Users

Use the app's admin management interface or call `createAdminUser()` from the code. This ensures the user is created in both Firebase Auth and the correct Firestore collection.

---

## Code Changes Summary

**File Modified**: `src/lib/authService.ts`

**Key Changes**:
- All `doc(db, 'admins', uid)` → `doc(db, 'users', uid)`
- All `collection(db, 'admins')` → `collection(db, 'users')`
- Added role validation to ensure users have admin privileges
- Updated `getAllAdmins()` to query by role instead of collection name

---

## Security Notes

Your Firestore Security Rules are now correctly aligned with the application:

✅ Only authenticated users can read their own user document  
✅ Only authenticated users can write to their own user document  
✅ Only admins can read/write to `adminData` collection  
✅ All other authenticated users can only read other documents (no write access)

The `isAdmin()` function in your rules will now correctly identify admin users from the `users` collection.

---

## Questions?

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your Firestore data structure matches the format above
3. Ensure the user document has all required fields
4. Check that Firebase Auth credentials are correct

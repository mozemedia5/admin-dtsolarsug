# DT Solars Admin Dashboard

Administration dashboard for managing the DT Solars e-commerce platform. This branch contains the complete admin interface with Firebase authentication and Firestore database integration.

## 🎯 Features

### Authentication & Security
- ✅ Firebase Authentication integration
- ✅ Role-based access control (Super Admin & Admin)
- ✅ Secure login with email/password
- ✅ Admin user management (Super Admin only)
- ✅ Environment variables for API keys (not exposed in frontend)

### Product Management
- ✅ Add, edit, and delete products
- ✅ Product categories (Solar Kits, Batteries & Inverters, CCTV, Water Pumps, Home Electronics)
- ✅ Image upload support
- ✅ Stock management
- ✅ Pricing and features management

### Promotion Management
- ✅ Create and manage promotional banners
- ✅ Discount codes and labels
- ✅ Expiration dates
- ✅ Active/expired status tracking

### Review Management
- ✅ View all customer reviews
- ✅ Approve/reject reviews
- ✅ Delete inappropriate reviews
- ✅ Verified badge system

### Analytics Dashboard
- ✅ Total products, promotions, and reviews
- ✅ Average rating statistics
- ✅ Products by category breakdown
- ✅ Recent reviews feed

### Admin User Management (Super Admin Only)
- ✅ Create new admin accounts
- ✅ Activate/deactivate admin users
- ✅ View admin user details
- ✅ Role management

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Firebase project with Authentication and Firestore enabled
- Firebase Admin credentials

### Installation

1. **Clone the repository and switch to admin branch:**
```bash
git clone https://github.com/mozemedia5/dtsolarsug.git
cd dtsolarsug
git checkout admin
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure Firebase:**
   - Copy `.env.example` to `.env`
   - Add your Firebase credentials to `.env`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Enable Firebase services:**
   - Go to Firebase Console
   - Enable **Authentication** with Email/Password provider
   - Enable **Cloud Firestore** database
   - Set Firestore security rules (see below)

5. **Build and run:**
```bash
npm run build
npm run dev
```

## 🔐 Firebase Setup

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin users collection - only readable by authenticated admins
    match /admins/{userId} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'super_admin';
    }
    
    // Products collection - read by anyone, write by admins
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Promotions collection
    match /promotions/{promotionId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if true; // Anyone can create reviews
      allow update, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

### Initial Super Admin Setup

The first administrator account must be created manually:

1. **Create the super admin Firebase Auth account:**
   - Go to Firebase Console → Authentication
   - Click "Add user"
   - Email: `administrator@dt-solars.com`
   - Password: Choose a strong password
   - Note the UID

2. **Create the admin document in Firestore:**
   - Go to Firebase Console → Firestore Database
   - Create collection: `admins`
   - Document ID: (paste the UID from step 1)
   - Fields:
     ```
     uid: (same UID)
     email: "administrator@dt-solars.com"
     role: "super_admin"
     displayName: "Super Administrator"
     createdAt: (current timestamp)
     isActive: true
     ```

3. **Login to admin dashboard:**
   - Open the admin dashboard
   - Use `administrator@dt-solars.com` and your password
   - You can now create additional admin users

## 📁 Project Structure

```
src/
├── AdminApp.tsx                 # Main admin application entry
├── lib/
│   ├── firebase.ts              # Firebase initialization
│   ├── authService.ts           # Authentication & admin management
│   └── dataService.ts           # Firestore data operations
├── pages/
│   ├── AdminLogin.tsx           # Login page
│   ├── AdminDashboard.tsx       # Analytics dashboard
│   ├── AdminProducts.tsx        # Product management
│   ├── AdminPromotions.tsx      # Promotion management
│   ├── AdminReviews.tsx         # Review moderation
│   └── AdminUsers.tsx           # Admin user management
└── components/
    └── admin/
        └── AdminDashboardLayout.tsx  # Dashboard layout & navigation
```

## 🔄 Data Migration

To migrate existing data from the main branch to Firebase:

1. **Switch to main branch and copy data files:**
```bash
git checkout main
# Copy src/data/*.ts files
```

2. **Run the migration script:**
```bash
npm run migrate-data
```

This will populate your Firestore database with all existing products, promotions, and reviews.

## 🔐 Security Best Practices

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Use strong passwords** for admin accounts (min 6 characters)
3. **Regularly review admin users** and deactivate unused accounts
4. **Monitor Firestore usage** in Firebase Console
5. **Keep Firebase SDK updated** for security patches

## 🌐 Deployment

### Deploy to Cloudflare Pages

1. **Build the project:**
```bash
npm run build
```

2. **Deploy to Cloudflare Pages:**
```bash
npx wrangler pages deploy dist --project-name dtsolars-admin
```

3. **Set environment variables in Cloudflare:**
   - Go to Cloudflare Dashboard → Pages → dtsolars-admin → Settings
   - Add all VITE_FIREBASE_* environment variables
   - Redeploy

### Deploy to Vercel/Netlify

Both platforms support environment variables in their dashboards. Add all Firebase config variables as environment variables.

## 📊 Admin Roles

### Super Admin
- Full access to all features
- Can create and manage admin users
- Can activate/deactivate admins
- Cannot be deactivated or deleted

### Admin
- Can manage products, promotions, and reviews
- Cannot access admin user management
- Can be activated/deactivated by super admin

## 🔗 Integration with Main Branch

The main branch (customer-facing website) can fetch data from the same Firebase Firestore database:

1. Add Firebase SDK to main branch
2. Use same Firebase config
3. Implement read-only Firestore queries
4. Display real-time data from admin updates

## 📝 License

This project is private and proprietary to DT Solars.

## 🆘 Support

For issues or questions, contact the development team.

---

**Last Updated:** 2026-03-02  
**Branch:** admin  
**Version:** 1.0.0

# DT Solars Uganda - Admin Dashboard

Admin dashboard for managing the DT Solars Uganda e-commerce platform. Built with React, TypeScript, Firebase, and Vite.

## 🚨 IMPORTANT: Vercel Deployment Fix

**If your admin branch is redirecting to the main website, read this:**

The admin dashboard (`admin` branch) must be deployed as a **SEPARATE Vercel project** from the main website (`main` branch). 

**📖 Complete Fix Guide:** See [VERCEL_FIX_GUIDE.md](./VERCEL_FIX_GUIDE.md) for step-by-step instructions.

**Quick Summary:**
- ✅ **Main website** → Deploy `main` branch to project named `dtsolarsug`
- ✅ **Admin dashboard** → Deploy `admin` branch to project named `dtsolarsug-admin` (DIFFERENT PROJECT)
- ❌ **Wrong:** Both branches in the same Vercel project (causes redirect issues)

Both `vercel.json` files are now configured for proper independent deployment.

## 🚀 Features

- 🔐 Secure admin authentication
- 📦 Product management (Create, Read, Update, Delete)
- 🎁 Promotion management
- ⭐ Review moderation and approval
- 👥 Admin user management (Super Admin only)
- 📊 Analytics dashboard
- 🖼️ Image upload to Firebase Storage
- 📱 Responsive design for all devices

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS with custom animations
- **UI Components**: Radix UI primitives
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Charts**: Recharts for analytics
- **PWA**: Service Worker with workbox

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/mozemedia5/dtsolarsug.git
cd dtsolarsug

# Switch to admin branch
git checkout admin

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your Firebase credentials
```

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Get these values from your Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Copy the configuration values

## 🏃‍♂️ Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚀 Deployment to Vercel

### Prerequisites
1. [Vercel Account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/cli) (optional)

### Deploy via Vercel Dashboard

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository (`mozemedia5/dtsolarsug`)

2. **Configure Branch**
   - Select `admin` branch for admin dashboard deployment
   - Set a different project name (e.g., `dtsolarsug-admin`)

3. **Add Environment Variables**
   - In the "Environment Variables" section, add all Firebase credentials:
     ```
     
   - Select which environments to apply to: Production, Preview, or Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your admin dashboard will be live at `https://dtsolarsug-admin.vercel.app`

### Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Setting Environment Variables via CLI

```bash
# Set environment variables for production
vercel env add VITE_FIREBASE_API_KEY production
vercel env add VITE_FIREBASE_AUTH_DOMAIN production
vercel env add VITE_FIREBASE_PROJECT_ID production
vercel env add VITE_FIREBASE_STORAGE_BUCKET production
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
vercel env add VITE_FIREBASE_APP_ID production

# Pull environment variables to local
vercel env pull
```

## 👤 Super Admin Setup

### Initial Setup

1. **Update Super Admin Email**
   - Edit `src/lib/authService.ts`
   - Change `SUPER_ADMIN_EMAIL` to your email

2. **Create Super Admin Account**
   - Open browser console
   - Run: `initializeSuperAdmin('your-secure-password')`
   - This creates the first administrator account

3. **Login**
   - Use the super admin email and password to login
   - Access full admin dashboard

### Admin User Roles

- **Super Admin**: Full access to all features, can manage other admins
- **Admin**: Can manage products, promotions, and reviews (no admin user management)

## 🔐 Firebase Configuration

### Firestore Security Rules

⚠️ **CRITICAL**: The rules below are corrected to use the `users` collection (not `admins`). See [FIRESTORE_RULES_FIX.md](./FIRESTORE_RULES_FIX.md) for details.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is an active admin
    function isActiveAdmin() {
      return request.auth != null &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'] &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isActive == true;
    }
    
    // Helper function to check if user is super admin
    function isSuperAdmin() {
      return request.auth != null &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin' &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isActive == true;
    }
    
    // Users collection (for admin authentication)
    match /users/{userId} {
      // Users can read their own document
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Only super admin can list all users/admins
      allow list: if isSuperAdmin();
      
      // Only super admin can create, update, or delete users
      allow create, update, delete: if isSuperAdmin();
    }
    
    // Products collection
    match /products/{productId} {
      // Anyone can read products
      allow read: if true;
      
      // Only active admins can create, update, or delete products
      allow write: if isActiveAdmin();
    }
    
    // Promotions collection
    match /promotions/{promotionId} {
      // Anyone can read promotions
      allow read: if true;
      
      // Only active admins can create, update, or delete promotions
      allow write: if isActiveAdmin();
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      // Anyone can read verified reviews
      allow read: if resource.data.verified == true;
      
      // Anyone can create a review (from client site)
      allow create: if true;
      
      // Only active admins can update or delete reviews
      allow update, delete: if isActiveAdmin();
    }
  }
}
```

### Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /promotions/{promotionId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📁 Project Structure

```
dtsolarsug/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── admin/        # Admin-specific components
│   │   ├── shared/       # Shared components
│   │   └── ui/           # UI primitives
│   ├── data/             # Static data files
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries and services
│   │   ├── firebase.ts          # Firebase configuration
│   │   ├── authService.ts       # Authentication services
│   │   └── dataService.ts       # Data management services
│   ├── pages/            # Page components
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminProducts.tsx
│   │   ├── AdminPromotions.tsx
│   │   ├── AdminReviews.tsx
│   │   ├── AdminUsers.tsx
│   │   └── AdminLogin.tsx
│   ├── types/            # TypeScript type definitions
│   ├── AdminApp.tsx      # Main admin application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── dist/                 # Production build output
├── .env                  # Environment variables (not committed)
├── .env.example          # Environment variables template
├── vercel.json           # Vercel deployment configuration
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # TailwindCSS configuration
└── package.json          # Project dependencies and scripts
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` files with real credentials
2. **Super Admin**: Use a strong password and keep credentials secure
3. **Firebase Rules**: Ensure Firestore and Storage security rules are properly configured
4. **Admin Access**: Regularly audit admin users and deactivate unused accounts
5. **HTTPS Only**: Always use HTTPS in production

## 🌐 Live Demo

- **Customer Website**: Deploy the `main` branch
- **Admin Dashboard**: [https://dtsolarsug-admin.vercel.app](https://dtsolarsug-admin.vercel.app) (after deployment)

## 📝 Customer Website

This repository has two main branches:
- `main`: Customer-facing website
- `admin`: Admin dashboard (this branch)

To work with the customer website:
```bash
git checkout main
npm install
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For support, email support@dt-solars.com or contact the development team.

## 🙏 Acknowledgments

- Firebase for backend services
- Vercel for hosting
- Radix UI for accessible components
- TailwindCSS for styling utilities

/**
 * Firebase Data Migration Script
 * 
 * This script migrates existing data from the local TypeScript files
 * to Firebase Firestore. Run this once to populate your Firebase database.
 * 
 * Usage:
 * 1. Make sure you're on the main branch
 * 2. Run: npm run migrate-data
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { products } from './src/data/products';
import { promotions } from './src/data/promotions';
import { reviews } from './src/data/reviews';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateData() {
  console.log('Starting data migration...\n');

  try {
    // Migrate products
    console.log(`Migrating ${products.length} products...`);
    for (const product of products) {
      const { id, ...productData } = product;
      await setDoc(doc(db, 'products', id), productData);
      console.log(`✓ Migrated product: ${product.name}`);
    }

    // Migrate promotions
    console.log(`\nMigrating ${promotions.length} promotions...`);
    for (const promotion of promotions) {
      const { id, ...promotionData } = promotion;
      await setDoc(doc(db, 'promotions', id), promotionData);
      console.log(`✓ Migrated promotion: ${promotion.title}`);
    }

    // Migrate reviews
    console.log(`\nMigrating ${reviews.length} reviews...`);
    for (const review of reviews) {
      const { id, ...reviewData } = review;
      await setDoc(doc(db, 'reviews', id), reviewData);
      console.log(`✓ Migrated review from: ${review.userName}`);
    }

    console.log('\n✅ Data migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Go to Firebase Console to verify your data');
    console.log('2. Initialize the super admin account using the admin dashboard');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateData();

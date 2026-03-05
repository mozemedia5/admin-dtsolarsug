import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Product, Promotion, Review } from '@/types';

/**
 * Product Management
 */

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    return productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const productDoc = await getDoc(doc(db, 'products', id));
    if (!productDoc.exists()) return null;
    
    return {
      id: productDoc.id,
      ...productDoc.data()
    } as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'products'), product);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create product');
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'products', id), product);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update product');
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete product');
  }
};

/**
 * Upload product image to Firebase Storage
 * Uses timestamp + original filename for uniqueness
 */
export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  try {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageRef = ref(storage, `products/${productId}/${timestamp}_${safeName}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload product image');
  }
};

/**
 * Promotion Management
 */

export const getAllPromotions = async (): Promise<Promotion[]> => {
  try {
    const promotionsSnapshot = await getDocs(collection(db, 'promotions'));
    return promotionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Promotion));
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }
};

export const getPromotionById = async (id: string): Promise<Promotion | null> => {
  try {
    const promotionDoc = await getDoc(doc(db, 'promotions', id));
    if (!promotionDoc.exists()) return null;
    
    return {
      id: promotionDoc.id,
      ...promotionDoc.data()
    } as Promotion;
  } catch (error) {
    console.error('Error fetching promotion:', error);
    return null;
  }
};

export const createPromotion = async (promotion: Omit<Promotion, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'promotions'), promotion);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create promotion');
  }
};

export const updatePromotion = async (id: string, promotion: Partial<Promotion>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'promotions', id), promotion);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update promotion');
  }
};

export const deletePromotion = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'promotions', id));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete promotion');
  }
};

/**
 * Upload promotion banner to Firebase Storage
 * Uses timestamp + original filename for uniqueness
 */
export const uploadPromotionImage = async (file: File, promotionId: string): Promise<string> => {
  try {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageRef = ref(storage, `promotions/${promotionId}/${timestamp}_${safeName}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload promotion image');
  }
};

/**
 * Review Management
 */

export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const reviewsQuery = query(collection(db, 'reviews'), orderBy('date', 'desc'));
    const reviewsSnapshot = await getDocs(reviewsQuery);
    return reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Review));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const getReviewById = async (id: string): Promise<Review | null> => {
  try {
    const reviewDoc = await getDoc(doc(db, 'reviews', id));
    if (!reviewDoc.exists()) return null;
    
    return {
      id: reviewDoc.id,
      ...reviewDoc.data()
    } as Review;
  } catch (error) {
    console.error('Error fetching review:', error);
    return null;
  }
};

export const updateReview = async (id: string, review: Partial<Review>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'reviews', id), review);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update review');
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'reviews', id));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete review');
  }
};

export const approveReview = async (id: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'reviews', id), {
      verified: true
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to approve review');
  }
};

/**
 * Analytics
 */

export const getAnalytics = async () => {
  try {
    const [products, promotions, reviews] = await Promise.all([
      getAllProducts(),
      getAllPromotions(),
      getAllReviews()
    ]);

    return {
      totalProducts: products.length,
      totalPromotions: promotions.length,
      totalReviews: reviews.length,
      averageRating: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0,
      productsByCategory: products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentReviews: reviews.slice(0, 5)
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      totalProducts: 0,
      totalPromotions: 0,
      totalReviews: 0,
      averageRating: 0,
      productsByCategory: {},
      recentReviews: []
    };
  }
};

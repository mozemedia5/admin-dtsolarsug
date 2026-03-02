import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface AdminUser {
  uid: string;
  email: string;
  role: 'super_admin' | 'admin';
  displayName: string;
  createdAt: any;
  createdBy?: string;
  isActive: boolean;
}

// The super admin email - this is hardcoded as the first administrator
const SUPER_ADMIN_EMAIL = 'administrator@dt-solars.com';

/**
 * Sign in with email and password
 */
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if user is an admin
    const isAdmin = await checkAdminStatus(userCredential.user.uid);
    if (!isAdmin) {
      await signOut(auth);
      throw new Error('Access denied. This account does not have admin privileges or is inactive.');
    }
    
    return userCredential.user;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Login failed');
  }
};

/**
 * Sign out current user
 */
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Check if user is an admin
 * FIXED: Now checks the 'users' collection to match Firestore rules
 */
export const checkAdminStatus = async (uid: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      console.warn(`User document not found for UID: ${uid}`);
      return false;
    }
    
    const userData = userDoc.data();
    // Check if role is either 'admin' or 'super_admin' AND isActive is true
    const hasAdminRole = userData.role === 'admin' || userData.role === 'super_admin';
    const isActive = userData.isActive !== false; // Default to true if field is missing
    
    return hasAdminRole && isActive;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Get admin user data
 * FIXED: Now checks the 'users' collection to match Firestore rules
 */
export const getAdminUser = async (uid: string): Promise<AdminUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) return null;
    
    const userData = userDoc.data();
    // Only return if user has admin role
    if (userData.role !== 'admin' && userData.role !== 'super_admin') {
      return null;
    }
    
    return {
      uid: userData.uid || uid,
      email: userData.email || '',
      role: userData.role,
      displayName: userData.displayName || 'Admin User',
      createdAt: userData.createdAt,
      createdBy: userData.createdBy,
      isActive: userData.isActive !== false
    } as AdminUser;
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return null;
  }
};

/**
 * Check if user is super admin
 */
export const isSuperAdmin = async (uid: string): Promise<boolean> => {
  const adminUser = await getAdminUser(uid);
  return adminUser?.role === 'super_admin';
};

/**
 * Create a new admin user (only super admin can do this)
 * FIXED: Now creates user in 'users' collection to match Firestore rules
 */
export const createAdminUser = async (
  email: string,
  password: string,
  displayName: string,
  createdByUid: string
): Promise<void> => {
  // Check if creator is super admin
  const isCreatorSuperAdmin = await isSuperAdmin(createdByUid);
  if (!isCreatorSuperAdmin) {
    throw new Error('Only super admin can create new admin users');
  }

  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    // Create user record in Firestore 'users' collection
    const userData: AdminUser = {
      uid: newUser.uid,
      email: email,
      role: 'admin',
      displayName: displayName,
      createdAt: Timestamp.now(),
      createdBy: createdByUid,
      isActive: true
    };

    await setDoc(doc(db, 'users', newUser.uid), userData);

    // Sign out the newly created user (so the super admin stays logged in)
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create admin user');
  }
};

/**
 * Initialize super admin account
 * This should be called once to set up the first administrator
 * FIXED: Now creates user in 'users' collection to match Firestore rules
 */
export const initializeSuperAdmin = async (password: string): Promise<void> => {
  try {
    // Check if super admin already exists
    const q = query(collection(db, 'users'), where('role', '==', 'super_admin'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log('Super admin already exists');
      return;
    }

    // Create super admin Firebase Auth account
    const userCredential = await createUserWithEmailAndPassword(auth, SUPER_ADMIN_EMAIL, password);
    const superAdmin = userCredential.user;

    // Create super admin record in Firestore 'users' collection
    const userData: AdminUser = {
      uid: superAdmin.uid,
      email: SUPER_ADMIN_EMAIL,
      role: 'super_admin',
      displayName: 'Super Administrator',
      createdAt: Timestamp.now(),
      isActive: true
    };

    await setDoc(doc(db, 'users', superAdmin.uid), userData);
    
    console.log('Super admin initialized successfully');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to initialize super admin');
  }
};

/**
 * Get all admin users
 * FIXED: Now queries the 'users' collection to match Firestore rules
 */
export const getAllAdmins = async (): Promise<AdminUser[]> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('role', 'in', ['admin', 'super_admin'])
    );
    const adminsSnapshot = await getDocs(q);
    return adminsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        ...data
      } as AdminUser;
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return [];
  }
};

/**
 * Update admin user status
 * FIXED: Now updates the 'users' collection to match Firestore rules
 */
export const updateAdminStatus = async (
  uid: string,
  isActive: boolean,
  updatedByUid: string
): Promise<void> => {
  // Check if updater is super admin
  const isUpdaterSuperAdmin = await isSuperAdmin(updatedByUid);
  if (!isUpdaterSuperAdmin) {
    throw new Error('Only super admin can update admin users');
  }

  // Prevent deactivating super admin
  const targetAdmin = await getAdminUser(uid);
  if (targetAdmin?.role === 'super_admin') {
    throw new Error('Cannot deactivate super admin account');
  }

  await updateDoc(doc(db, 'users', uid), {
    isActive: isActive
  });
};

/**
 * Delete admin user
 * FIXED: Now deletes from the 'users' collection to match Firestore rules
 */
export const deleteAdminUser = async (
  uid: string,
  deletedByUid: string
): Promise<void> => {
  // Check if deleter is super admin
  const isDeleterSuperAdmin = await isSuperAdmin(deletedByUid);
  if (!isDeleterSuperAdmin) {
    throw new Error('Only super admin can delete admin users');
  }

  // Prevent deleting super admin
  const targetAdmin = await getAdminUser(uid);
  if (targetAdmin?.role === 'super_admin') {
    throw new Error('Cannot delete super admin account');
  }

  await deleteDoc(doc(db, 'users', uid));
};

/**
 * Auth state observer
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

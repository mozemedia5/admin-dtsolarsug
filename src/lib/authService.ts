import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface AdminUser {
  uid: string;
  email: string;
  role: 'super_admin' | 'admin';
  displayName: string;
  createdAt: Date;
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
      throw new Error('Access denied. This account does not have admin privileges.');
    }
    
    return userCredential.user;
  } catch (error: any) {
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
 */
export const checkAdminStatus = async (uid: string): Promise<boolean> => {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    if (!adminDoc.exists()) return false;
    
    const adminData = adminDoc.data() as AdminUser;
    return adminData.isActive;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Get admin user data
 */
export const getAdminUser = async (uid: string): Promise<AdminUser | null> => {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    if (!adminDoc.exists()) return null;
    
    return adminDoc.data() as AdminUser;
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

    // Create admin record in Firestore
    const adminData: AdminUser = {
      uid: newUser.uid,
      email: email,
      role: 'admin',
      displayName: displayName,
      createdAt: new Date(),
      createdBy: createdByUid,
      isActive: true
    };

    await setDoc(doc(db, 'admins', newUser.uid), adminData);

    // Sign out the newly created user (so the super admin stays logged in)
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create admin user');
  }
};

/**
 * Initialize super admin account
 * This should be called once to set up the first administrator
 */
export const initializeSuperAdmin = async (password: string): Promise<void> => {
  try {
    // Check if super admin already exists
    const q = query(collection(db, 'admins'), where('role', '==', 'super_admin'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log('Super admin already exists');
      return;
    }

    // Create super admin Firebase Auth account
    const userCredential = await createUserWithEmailAndPassword(auth, SUPER_ADMIN_EMAIL, password);
    const superAdmin = userCredential.user;

    // Create super admin record in Firestore
    const adminData: AdminUser = {
      uid: superAdmin.uid,
      email: SUPER_ADMIN_EMAIL,
      role: 'super_admin',
      displayName: 'Super Administrator',
      createdAt: new Date(),
      isActive: true
    };

    await setDoc(doc(db, 'admins', superAdmin.uid), adminData);
    
    console.log('Super admin initialized successfully');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to initialize super admin');
  }
};

/**
 * Get all admin users
 */
export const getAllAdmins = async (): Promise<AdminUser[]> => {
  try {
    const adminsSnapshot = await getDocs(collection(db, 'admins'));
    return adminsSnapshot.docs.map(doc => doc.data() as AdminUser);
  } catch (error) {
    console.error('Error fetching admins:', error);
    return [];
  }
};

/**
 * Update admin user status
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

  await updateDoc(doc(db, 'admins', uid), {
    isActive: isActive
  });
};

/**
 * Delete admin user
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

  await deleteDoc(doc(db, 'admins', uid));
};

/**
 * Auth state observer
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

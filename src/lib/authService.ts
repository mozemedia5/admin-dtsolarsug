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
  name: string;
  isSuperAdmin: boolean;
  isActiveAdmin: boolean;
  branch?: string;
  createdAt: any;
  createdBy?: string;
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
 * Updated to use 'administrators' collection
 */
export const checkAdminStatus = async (uid: string): Promise<boolean> => {
  try {
    const adminDoc = await getDoc(doc(db, 'administrators', uid));
    if (!adminDoc.exists()) {
      console.warn(`Administrator document not found for UID: ${uid}`);
      return false;
    }
    
    const adminData = adminDoc.data();
    // Check if admin is active
    return adminData.isActiveAdmin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Get admin user data
 * Updated to use 'administrators' collection
 */
export const getAdminUser = async (uid: string): Promise<AdminUser | null> => {
  try {
    const adminDoc = await getDoc(doc(db, 'administrators', uid));
    if (!adminDoc.exists()) return null;
    
    const adminData = adminDoc.data();
    
    return {
      uid: uid,
      email: adminData.email || '',
      name: adminData.name || 'Administrator',
      isSuperAdmin: adminData.isSuperAdmin === true,
      isActiveAdmin: adminData.isActiveAdmin === true,
      createdAt: adminData.createdAt,
      createdBy: adminData.createdBy
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
  return adminUser?.isSuperAdmin === true && adminUser?.isActiveAdmin === true;
};

/**
 * Create a new admin user (only super admin can do this)
 * Uses Firebase REST API so the current session is NOT disrupted.
 */
export const createAdminUser = async (
  email: string,
  password: string,
  name: string,
  branch: string,
  createdByUid: string
): Promise<void> => {
  // Check if creator is super admin
  const isCreatorSuperAdmin = await isSuperAdmin(createdByUid);
  if (!isCreatorSuperAdmin) {
    throw new Error('Only super admin can create new admin users');
  }

  try {
    // Use Firebase Auth REST API to create user without switching sessions
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: false })
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData?.error?.message || 'Failed to create user account');
    }

    const data = await response.json();
    const newUid = data.localId;

    if (!newUid) {
      throw new Error('Failed to retrieve new user ID');
    }

    // Create admin record in Firestore 'administrators' collection
    const adminData: AdminUser = {
      uid: newUid,
      email: email,
      name: name,
      isSuperAdmin: false,
      isActiveAdmin: true,
      branch: branch,
      createdAt: Timestamp.now(),
      createdBy: createdByUid
    };

    await setDoc(doc(db, 'administrators', newUid), adminData);
    // Current super-admin session is untouched ✓
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create admin user');
  }
};

/**
 * Initialize super admin account
 * This should be called once to set up the first administrator
 * Updated to use 'administrators' collection
 */
export const initializeSuperAdmin = async (password: string): Promise<void> => {
  try {
    // Check if super admin already exists
    const q = query(collection(db, 'administrators'), where('isSuperAdmin', '==', true));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log('Super admin already exists');
      return;
    }

    // Create super admin Firebase Auth account
    const userCredential = await createUserWithEmailAndPassword(auth, SUPER_ADMIN_EMAIL, password);
    const superAdmin = userCredential.user;

    // Create super admin record in Firestore 'administrators' collection
    const adminData: AdminUser = {
      uid: superAdmin.uid,
      email: SUPER_ADMIN_EMAIL,
      name: 'Super Administrator',
      isSuperAdmin: true,
      isActiveAdmin: true,
      createdAt: Timestamp.now()
    };

    await setDoc(doc(db, 'administrators', superAdmin.uid), adminData);
    
    console.log('Super admin initialized successfully');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to initialize super admin');
  }
};

/**
 * Get all admin users
 * Updated to use 'administrators' collection
 */
export const getAllAdmins = async (): Promise<AdminUser[]> => {
  try {
    const adminsSnapshot = await getDocs(collection(db, 'administrators'));
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
 * Update admin user status (activate/deactivate)
 * Updated to use 'administrators' collection
 */
export const updateAdminStatus = async (
  uid: string,
  isActiveAdmin: boolean,
  updatedByUid: string
): Promise<void> => {
  // Check if updater is super admin
  const isUpdaterSuperAdmin = await isSuperAdmin(updatedByUid);
  if (!isUpdaterSuperAdmin) {
    throw new Error('Only super admin can update admin users');
  }

  // Prevent deactivating super admin
  const targetAdmin = await getAdminUser(uid);
  if (targetAdmin?.isSuperAdmin) {
    throw new Error('Cannot deactivate super admin account');
  }

  await updateDoc(doc(db, 'administrators', uid), {
    isActiveAdmin: isActiveAdmin
  });
};

/**
 * Delete admin user
 * Updated to use 'administrators' collection
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
  if (targetAdmin?.isSuperAdmin) {
    throw new Error('Cannot delete super admin account');
  }

  await deleteDoc(doc(db, 'administrators', uid));
};

/**
 * Auth state observer
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

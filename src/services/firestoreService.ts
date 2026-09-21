import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { User, UserRole, UserAccessStatus } from '../types.ts';

export interface FirestoreUserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  access_status: UserAccessStatus;
  can_access_masterclass: boolean;
  photoURL?: string;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Saves or updates a user profile document in Firestore upon login
 */
export async function syncUserProfileToFirestore(
  userId: string,
  profileData: Partial<FirestoreUserProfile> & { email: string }
): Promise<FirestoreUserProfile> {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    const existingSnap = await getDoc(userRef);

    const now = new Date().toISOString();
    let finalProfile: FirestoreUserProfile;

    if (existingSnap.exists()) {
      const existingData = existingSnap.data() as FirestoreUserProfile;
      finalProfile = {
        ...existingData,
        ...profileData,
        id: userId,
        updatedAt: now,
      };
      await updateDoc(userRef, {
        name: finalProfile.name,
        role: finalProfile.role,
        access_status: finalProfile.access_status,
        can_access_masterclass: finalProfile.can_access_masterclass,
        photoURL: finalProfile.photoURL || '',
        updatedAt: now,
      });
    } else {
      finalProfile = {
        id: userId,
        name: profileData.name || profileData.email.split('@')[0] || 'Trader',
        email: profileData.email,
        role: profileData.role || 'customer',
        access_status: profileData.access_status || 'free',
        can_access_masterclass: profileData.can_access_masterclass || false,
        photoURL: profileData.photoURL || '',
        phone: profileData.phone || null,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(userRef, finalProfile);
    }

    return finalProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Retrieves the user profile from Firestore
 */
export async function getUserProfileFromFirestore(userId: string): Promise<FirestoreUserProfile | null> {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as FirestoreUserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Syncs a completed lesson to Firestore in the user's progress subcollection
 */
export async function saveLessonProgressToFirestore(
  userId: string, 
  lessonId: string, 
  completed = true, 
  score?: number
): Promise<void> {
  const path = `users/${userId}/progress/${lessonId}`;
  try {
    const progressRef = doc(db, 'users', userId, 'progress', lessonId);
    await setDoc(progressRef, {
      userId,
      lessonId,
      completed,
      score: typeof score === 'number' ? score : 100,
      completedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetches all completed lessons for a user from Firestore
 */
export async function fetchUserProgressFromFirestore(userId: string): Promise<string[]> {
  const path = `users/${userId}/progress`;
  try {
    const progressCol = collection(db, 'users', userId, 'progress');
    const snapshot = await getDocs(progressCol);
    const completedIds: string[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.completed) {
        completedIds.push(data.lessonId || docSnap.id);
      }
    });
    return completedIds;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Submits a custom EA project request to Firestore
 */
export async function submitProjectToFirestore(
  userId: string,
  projectData: {
    id: string;
    projectName: string;
    platform: string;
    status: 'draft' | 'review' | 'quote_ready' | 'in_development' | 'testing' | 'completed' | 'delivered' | 'cancelled';
    strategyDescription?: string;
  }
): Promise<void> {
  const path = `projects/${projectData.id}`;
  try {
    const projectRef = doc(db, 'projects', projectData.id);
    const now = new Date().toISOString();
    await setDoc(projectRef, {
      ...projectData,
      userId,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

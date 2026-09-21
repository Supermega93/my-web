import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { UserRole, UserAccessStatus, TradingAccount } from '../types.ts';

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

function isAuthorizedForUser(userId: string): boolean {
  if (!auth.currentUser) return false;
  if (auth.currentUser.uid === userId) return true;
  return auth.currentUser.email === 'supermegafx1@gmail.com';
}

function getLocalTradingAccounts(userId: string): TradingAccount[] {
  try {
    const raw = localStorage.getItem(`trading_accounts_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalTradingAccounts(userId: string, accounts: TradingAccount[]): void {
  try {
    localStorage.setItem(`trading_accounts_${userId}`, JSON.stringify(accounts));
  } catch {}
}

/**
 * Saves or updates a user profile document in Firestore upon login
 */
export async function syncUserProfileToFirestore(
  userId: string,
  profileData: Partial<FirestoreUserProfile> & { email: string }
): Promise<FirestoreUserProfile> {
  // Guard photoURL length to ensure rules compliance
  let cleanPhotoURL = profileData.photoURL || '';
  if (cleanPhotoURL.length > 1000) {
    cleanPhotoURL = cleanPhotoURL.substring(0, 1000);
  }

  const fallbackProfile: FirestoreUserProfile = {
    id: userId,
    name: profileData.name || profileData.email.split('@')[0] || 'Trader',
    email: profileData.email,
    role: profileData.role || 'customer',
    access_status: profileData.access_status || 'free',
    can_access_masterclass: profileData.can_access_masterclass || false,
    photoURL: cleanPhotoURL,
    phone: profileData.phone || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!isAuthorizedForUser(userId)) {
    return fallbackProfile;
  }

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
        photoURL: cleanPhotoURL,
        id: userId,
        updatedAt: now,
      };
      await updateDoc(userRef, {
        name: finalProfile.name,
        role: finalProfile.role,
        access_status: finalProfile.access_status,
        can_access_masterclass: finalProfile.can_access_masterclass,
        photoURL: cleanPhotoURL,
        updatedAt: now,
      });
    } else {
      finalProfile = {
        ...fallbackProfile,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(userRef, finalProfile);
    }

    return finalProfile;
  } catch (error) {
    console.warn('[Firestore] Profile sync warning (recovering with local profile):', error);
    return fallbackProfile;
  }
}

/**
 * Retrieves the user profile from Firestore
 */
export async function getUserProfileFromFirestore(userId: string): Promise<FirestoreUserProfile | null> {
  if (!isAuthorizedForUser(userId)) {
    return null;
  }

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
  if (!isAuthorizedForUser(userId)) {
    return;
  }

  const targetUid = auth.currentUser!.uid;
  const path = `users/${targetUid}/progress/${lessonId}`;
  try {
    const progressRef = doc(db, 'users', targetUid, 'progress', lessonId);
    await setDoc(progressRef, {
      userId: targetUid,
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
  if (!isAuthorizedForUser(userId)) {
    return [];
  }

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

/**
 * Subscribes in real-time to a user's trading portfolio accounts in Firestore
 */
export function subscribeToTradingAccounts(
  userId: string,
  onUpdate: (accounts: TradingAccount[]) => void,
  onError?: (error: unknown) => void
): () => void {
  // If not authenticated in Firebase or user ID mismatch, fall back gracefully to local storage
  if (!isAuthorizedForUser(userId)) {
    const cached = getLocalTradingAccounts(userId);
    onUpdate(cached);
    return () => {};
  }

  const path = `users/${userId}/trading_accounts`;
  try {
    const colRef = collection(db, 'users', userId, 'trading_accounts');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const accounts: TradingAccount[] = [];
        snapshot.forEach((docSnap) => {
          accounts.push(docSnap.data() as TradingAccount);
        });
        // Sort by updatedAt descending
        accounts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        // Also persist copy to local cache
        saveLocalTradingAccounts(userId, accounts);
        onUpdate(accounts);
      },
      (error) => {
        if (onError) {
          onError(error);
        } else {
          console.error('[Portfolio] Snapshot error:', error);
        }
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Creates or overwrites a trading account in Firestore
 */
export async function saveTradingAccountToFirestore(
  userId: string,
  account: Omit<TradingAccount, 'createdAt' | 'updatedAt'> & { createdAt?: string }
): Promise<void> {
  const now = new Date().toISOString();
  const dataToSave: TradingAccount = {
    ...account,
    createdAt: account.createdAt || now,
    updatedAt: now,
  };

  if (!isAuthorizedForUser(userId)) {
    const local = getLocalTradingAccounts(userId);
    const existingIndex = local.findIndex((a) => a.id === account.id);
    if (existingIndex >= 0) {
      local[existingIndex] = dataToSave;
    } else {
      local.unshift(dataToSave);
    }
    saveLocalTradingAccounts(userId, local);
    return;
  }

  const path = `users/${userId}/trading_accounts/${account.id}`;
  try {
    const accRef = doc(db, 'users', userId, 'trading_accounts', account.id);
    await setDoc(accRef, dataToSave);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Updates partial metrics or status for a trading account in Firestore
 */
export async function updateTradingAccountInFirestore(
  userId: string,
  docId: string,
  updates: Partial<TradingAccount>
): Promise<void> {
  const now = new Date().toISOString();

  if (!isAuthorizedForUser(userId)) {
    const local = getLocalTradingAccounts(userId);
    const updated = local.map((acc) => {
      if (acc.id === docId) {
        return { ...acc, ...updates, updatedAt: now };
      }
      return acc;
    });
    saveLocalTradingAccounts(userId, updated);
    return;
  }

  const path = `users/${userId}/trading_accounts/${docId}`;
  try {
    const accRef = doc(db, 'users', userId, 'trading_accounts', docId);
    await updateDoc(accRef, {
      ...updates,
      updatedAt: now,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Deletes a trading account from Firestore
 */
export async function deleteTradingAccountFromFirestore(
  userId: string,
  docId: string
): Promise<void> {
  if (!isAuthorizedForUser(userId)) {
    const local = getLocalTradingAccounts(userId);
    const filtered = local.filter((acc) => acc.id !== docId);
    saveLocalTradingAccounts(userId, filtered);
    return;
  }

  const path = `users/${userId}/trading_accounts/${docId}`;
  try {
    const accRef = doc(db, 'users', userId, 'trading_accounts', docId);
    await deleteDoc(accRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Simulates a real-time EA execution tick or trade update on an account
 */
export async function simulateEaMetricTick(
  userId: string,
  account: TradingAccount
): Promise<void> {
  // Generate realistic market oscillation
  const isWin = Math.random() > 0.32; // 68% win rate bias
  const profitDelta = isWin 
    ? Number((Math.random() * 45 + 15).toFixed(2)) 
    : -Number((Math.random() * 30 + 10).toFixed(2));
  
  const newEquity = Number(Math.max(100, account.equity + profitDelta).toFixed(2));
  const newCurrentBalance = isWin ? Number((account.currentBalance + profitDelta).toFixed(2)) : account.currentBalance;
  const newProfit = Number((newEquity - account.initialBalance).toFixed(2));
  const newProfitPct = Number(((newProfit / account.initialBalance) * 100).toFixed(2));
  const newDailyProfit = Number((account.dailyProfit + profitDelta).toFixed(2));
  const newDailyPct = Number(((newDailyProfit / account.initialBalance) * 100).toFixed(2));
  const newTotalTrades = account.totalTrades + 1;
  const newWinningTrades = isWin ? account.winningTrades + 1 : account.winningTrades;
  const newLosingTrades = !isWin ? account.losingTrades + 1 : account.losingTrades;
  const newWinRate = Number(((newWinningTrades / newTotalTrades) * 100).toFixed(1));
  const newOpenPositions = Math.floor(Math.random() * 4) + 1;
  const now = new Date().toISOString();

  const updates: Partial<TradingAccount> = {
    equity: newEquity,
    currentBalance: newCurrentBalance,
    profit: newProfit,
    profitPercentage: newProfitPct,
    dailyProfit: newDailyProfit,
    dailyProfitPercentage: newDailyPct,
    totalTrades: newTotalTrades,
    winningTrades: newWinningTrades,
    losingTrades: newLosingTrades,
    winRate: newWinRate,
    openPositions: newOpenPositions,
    lastSyncAt: now,
    updatedAt: now,
  };

  if (!isAuthorizedForUser(userId)) {
    const local = getLocalTradingAccounts(userId);
    const updated = local.map((acc) => (acc.id === account.id ? { ...acc, ...updates } : acc));
    saveLocalTradingAccounts(userId, updated);
    return;
  }

  const path = `users/${userId}/trading_accounts/${account.id}`;
  try {
    const accRef = doc(db, 'users', userId, 'trading_accounts', account.id);
    await updateDoc(accRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

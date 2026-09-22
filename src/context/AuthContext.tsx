import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { User, UserRole, UserAccessStatus } from '../types.ts';
import { supabase } from '../lib/supabase.ts';
import { api, getStoredToken, setStoredToken } from '../services/api.ts';
import { fetchUserProgressFromSupabase } from '../services/academy.ts';
import { setActiveStudentTier, getActiveStudentTier } from '../services/academyAccess.ts';
import { 
  auth, 
  googleAuthProvider, 
  signInWithPopup, 
  signInWithCredential, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider, 
  fbSignOut, 
  onAuthStateChanged 
} from '../lib/firebase.ts';
import { syncUserProfileToFirestore, fetchUserProgressFromFirestore } from '../services/firestoreService.ts';

// Administrator emails recognised by the platform
export const ADMIN_EMAILS = [
  'supermegafx1@gmail.com',
  'admin@ea-automation.com',
  'admin@ea-automation-hub.com'
];

export const CANONICAL_APP_DOMAIN = 'https://www.megaailabs.app';

export function checkIsAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

/**
 * Checks if a user's email is verified.
 * Google OAuth accounts are automatically pre-verified by Google.
 * Email/password accounts can be verified via Firebase or Supabase.
 */
export function isUserVerified(supabaseUser?: any, firebaseUser?: any): boolean {
  if (firebaseUser) {
    if (firebaseUser.emailVerified) return true;
    if (firebaseUser.providerData?.some((p: any) => p.providerId === 'google.com')) return true;
  }
  if (!supabaseUser) return false;
  if (
    supabaseUser.app_metadata?.provider === 'google' ||
    supabaseUser.identities?.some((id: any) => id.provider === 'google')
  ) {
    return true;
  }
  return Boolean(supabaseUser.email_confirmed_at || supabaseUser.confirmed_at);
}

// Canonical application domain for auth callbacks & email verification
export const getAppRedirectUrl = (): string => {
  // 1. If runtime environment variable is provided
  const envAppUrl = typeof process !== 'undefined' ? (process.env?.APP_URL || (process.env as any)?.VITE_APP_URL) : undefined;
  if (envAppUrl && typeof envAppUrl === 'string' && envAppUrl.startsWith('http')) {
    return envAppUrl.replace(/\/+$/, '');
  }

  // 2. Browser window origin check: only use if not localhost or 127.0.0.1
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1') && !origin.includes('0.0.0.0')) {
      return origin.replace(/\/+$/, '');
    }
  }

  // 3. Fallback to production custom domain
  return CANONICAL_APP_DOMAIN;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  isDeveloper: boolean;
  isCustomer: boolean;
  isLoggedIn: boolean;
  userAccessStatus: UserAccessStatus;
  canAccessMasterclass: boolean;
  isEmailVerified: boolean;
  refreshUserAccess: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean; unverifiedEmail?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string; isUnauthorizedDomain?: boolean; authorizedDomainUrl?: string }>;
  register: (
    dataOrEmail: string | { name?: string; email: string; password: string; phone?: string; role?: string },
    password?: string,
    name?: string
  ) => Promise<{ success: boolean; error?: string; message?: string; needsVerification?: boolean; unverifiedEmail?: string }>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  sendMasterclassVerification: () => Promise<{ success: boolean; message?: string; error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>;
  quickLogin: (role: UserRole) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Global listener: detect active login via Firebase Auth or Supabase
  useEffect(() => {
    let mounted = true;

    // Listen to Firebase Auth state changes
    const unsubscribeFb = onAuthStateChanged(auth, async (fbUser) => {
      if (!mounted) return;

      if (fbUser) {
        setLoading(true);
        try {
          const email = fbUser.email || '';
          const isAdminDetected = checkIsAdminEmail(email);
          const determinedRole: UserRole = isAdminDetected ? 'admin' : 'customer';

          // Sync user profile to Firestore
          const firestoreProfile = await syncUserProfileToFirestore(fbUser.uid, {
            id: fbUser.uid,
            name: fbUser.displayName || email.split('@')[0] || 'Trader',
            email,
            role: determinedRole,
            access_status: isAdminDetected ? 'paid' : 'free',
            can_access_masterclass: isAdminDetected,
            photoURL: fbUser.photoURL || '',
          });

          const token = await fbUser.getIdToken();
          setStoredToken(token);

          const activeUser: User = {
            id: fbUser.uid,
            name: firestoreProfile.name || fbUser.displayName || email.split('@')[0] || 'Trader',
            email,
            phone: fbUser.phoneNumber || null,
            role: firestoreProfile.role || determinedRole,
            access_status: firestoreProfile.access_status || (isAdminDetected ? 'paid' : 'free'),
            can_access_masterclass: firestoreProfile.can_access_masterclass ?? isAdminDetected,
            created_at: fbUser.metadata.creationTime || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          if (mounted) {
            setUser(activeUser);
            localStorage.setItem('user_access_status', activeUser.access_status || 'free');
            setActiveStudentTier(activeUser.access_status === 'paid' ? 'paid' : (activeUser.access_status === 'complimentary' ? 'complimentary' : 'free'));

            // Hydrate progress from Firestore
            fetchUserProgressFromFirestore(fbUser.uid).then((progressIds) => {
              if (progressIds && progressIds.length > 0) {
                const local = JSON.parse(localStorage.getItem('completed_lesson_ids') || '[]');
                const combined = Array.from(new Set([...local, ...progressIds]));
                localStorage.setItem('completed_lesson_ids', JSON.stringify(combined));
                window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: combined } }));
              }
            }).catch((pErr) => {
              console.warn('[Firebase Progress] Initial hydration notice:', pErr);
            });
          }
        } catch (err) {
          console.warn('[Firebase Auth] Profile sync notice:', err);
        } finally {
          if (mounted) setLoading(false);
        }
      } else {
        // If not logged in via Firebase, check Supabase session as fallback
        loadSupabaseSession();
      }
    });

    async function loadSupabaseSession() {
      try {
        setLoading(true);
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.warn('Supabase getSession notification:', sessionError.message);
        }

        if (mounted && !auth.currentUser) {
          const currentSession = data?.session;

          if (currentSession?.user) {
            setSession(currentSession);
            const email = currentSession.user.email || '';
            const isAdminDetected = checkIsAdminEmail(email) || currentSession.user.user_metadata?.role === 'admin';
            const determinedRole: UserRole = isAdminDetected 
              ? 'admin' 
              : (currentSession.user.user_metadata?.role === 'developer' ? 'developer' : 'customer');

            const activeUser: User = {
              id: currentSession.user.id,
              name: currentSession.user.user_metadata?.name || email.split('@')[0] || 'Trader',
              email,
              phone: currentSession.user.phone || currentSession.user.user_metadata?.phone || null,
              role: determinedRole,
              created_at: currentSession.user.created_at,
              updated_at: currentSession.user.updated_at || currentSession.user.created_at,
            };
            setUser(activeUser);

            // Store token for backend API requests
            if (currentSession.access_token) {
              setStoredToken(currentSession.access_token);
            }

            // Verify access status with database / Supabase
            api.getUserAccessStatus().then((statusRes) => {
              if (statusRes) {
                localStorage.setItem('user_access_status', statusRes.access_status);
                setActiveStudentTier(statusRes.access_status === 'paid' ? 'paid' : (statusRes.access_status === 'complimentary' ? 'complimentary' : 'free'));
                setUser((prev) => prev ? {
                  ...prev,
                  access_status: statusRes.access_status,
                  can_access_masterclass: statusRes.can_access_masterclass,
                } : null);
              }
            }).catch(() => {
              // Non-blocking fallback
            });

            // Hydrate progress directly from Supabase user_progress
            fetchUserProgressFromSupabase(activeUser.id).then((progressIds) => {
              if (progressIds && progressIds.length > 0) {
                const local = JSON.parse(localStorage.getItem('completed_lesson_ids') || '[]');
                const combined = Array.from(new Set([...local, ...progressIds]));
                localStorage.setItem('completed_lesson_ids', JSON.stringify(combined));
                window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: combined } }));
              }
            });
          } else {
            setUser(null);
            setSession(null);
          }
        }
      } catch (err) {
        console.warn('Error loading Supabase auth session:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    // Global listener for Supabase authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted || auth.currentUser) return;

      if (newSession?.user) {
        if (!isUserVerified(newSession.user)) {
          console.log('[Auth] Unconfirmed email state on auth change - blocking access until verified');
          await supabase.auth.signOut().catch(() => null);
          setUser(null);
          setSession(null);
          return;
        }

        setSession(newSession);
        const email = newSession.user.email || '';
        const isAdminDetected = checkIsAdminEmail(email) || newSession.user.user_metadata?.role === 'admin';
        const determinedRole: UserRole = isAdminDetected 
          ? 'admin' 
          : (newSession.user.user_metadata?.role === 'developer' ? 'developer' : 'customer');

        const activeUser: User = {
          id: newSession.user.id,
          name: newSession.user.user_metadata?.name || email.split('@')[0] || 'Trader',
          email,
          phone: newSession.user.phone || newSession.user.user_metadata?.phone || null,
          role: determinedRole,
          created_at: newSession.user.created_at,
          updated_at: newSession.user.updated_at || newSession.user.created_at,
        };
        setUser(activeUser);

        if (newSession.access_token) {
          setStoredToken(newSession.access_token);
        }

        api.getUserAccessStatus().then((statusRes) => {
          if (statusRes) {
            localStorage.setItem('user_access_status', statusRes.access_status);
            setActiveStudentTier(statusRes.access_status === 'paid' ? 'paid' : (statusRes.access_status === 'complimentary' ? 'complimentary' : 'free'));
            setUser((prev) => prev ? {
              ...prev,
              access_status: statusRes.access_status,
              can_access_masterclass: statusRes.can_access_masterclass,
            } : null);
          }
        }).catch(() => {
          // Non-blocking fallback
        });

        fetchUserProgressFromSupabase(activeUser.id).then((progressIds) => {
          if (progressIds && progressIds.length > 0) {
            const local = JSON.parse(localStorage.getItem('completed_lesson_ids') || '[]');
            const combined = Array.from(new Set([...local, ...progressIds]));
            localStorage.setItem('completed_lesson_ids', JSON.stringify(combined));
            window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: combined } }));
          }
        });
      } else {
        if (!auth.currentUser) {
          setUser(null);
          setSession(null);
        }
      }
    });

    // Google Identity Services (GIS) auto-listener for ID tokens
    const initGis = () => {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: '1057808579968-lktbd0f2cm0rkbka7qpn76uqsrli2svm.apps.googleusercontent.com',
            callback: async (response: any) => {
              if (response?.credential) {
                try {
                  setLoading(true);
                  const credential = GoogleAuthProvider.credential(response.credential);
                  await signInWithCredential(auth, credential);
                } catch (gErr: any) {
                  console.warn('[GIS Sign-In Exception]', gErr);
                  setError(gErr.message || 'Google verification failed');
                } finally {
                  setLoading(false);
                }
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });
        } catch (e) {
          console.warn('[GIS Init]', e);
        }
      }
    };
    initGis();
    const gisTimer = setTimeout(initGis, 1200);

    return () => {
      mounted = false;
      clearTimeout(gisTimer);
      unsubscribeFb();
      subscription.unsubscribe();
    };
  }, []);

  // Primary Firebase Auth Login with legacy Supabase fallback
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; needsVerification?: boolean; unverifiedEmail?: string }> => {
    try {
      setError(null);
      setLoading(true);

      const cleanEmail = email.trim().toLowerCase();
      const isAdminDetected = checkIsAdminEmail(cleanEmail);

      // 1. PRIMARY: Authenticate via Firebase Auth
      try {
        const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const fbUser = userCred.user;
        if (fbUser) {
          const token = await fbUser.getIdToken();
          setStoredToken(token);

          let firestoreProfile: any = null;
          try {
            firestoreProfile = await syncUserProfileToFirestore(fbUser.uid, {
              id: fbUser.uid,
              name: fbUser.displayName || cleanEmail.split('@')[0],
              email: cleanEmail,
              role: isAdminDetected ? 'admin' : 'customer',
              access_status: isAdminDetected ? 'paid' : 'free',
              can_access_masterclass: isAdminDetected,
            });
          } catch (syncErr) {
            console.warn('[Firebase Auth] Login profile sync notice:', syncErr);
          }

          const determinedRole: UserRole = firestoreProfile?.role || (isAdminDetected ? 'admin' : 'customer');
          const activeUser: User = {
            id: fbUser.uid,
            name: firestoreProfile?.name || fbUser.displayName || cleanEmail.split('@')[0] || 'Trader',
            email: cleanEmail,
            phone: fbUser.phoneNumber || firestoreProfile?.phone || null,
            role: determinedRole,
            access_status: firestoreProfile?.access_status || (isAdminDetected ? 'paid' : 'free'),
            can_access_masterclass: firestoreProfile?.can_access_masterclass ?? isAdminDetected,
            created_at: fbUser.metadata.creationTime || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          setUser(activeUser);
          setActiveStudentTier(activeUser.access_status === 'paid' ? 'paid' : 'free');

          // Hydrate progress from Firestore
          fetchUserProgressFromFirestore(fbUser.uid).then((progressIds) => {
            if (progressIds && progressIds.length > 0) {
              const local = JSON.parse(localStorage.getItem('completed_lesson_ids') || '[]');
              const combined = Array.from(new Set([...local, ...progressIds]));
              localStorage.setItem('completed_lesson_ids', JSON.stringify(combined));
              window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: combined } }));
            }
          }).catch(() => null);

          return { success: true };
        }
      } catch (fbErr: any) {
        if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/invalid-credential') {
          // Check if user was registered in Supabase earlier
          console.log('[Firebase login credential notice, attempting Supabase fallback]');
        } else if (fbErr.code === 'auth/too-many-requests') {
          const msg = 'Too many failed login attempts. Please wait a few moments or reset your password.';
          setError(msg);
          return { success: false, error: msg };
        }
      }

      // 2. FALLBACK: Supabase Auth for legacy accounts
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (signInError) {
        const errMsg = signInError.message || '';
        // If Supabase claims email not confirmed, we DO NOT block the user!
        if (
          errMsg.toLowerCase().includes('email not confirmed') ||
          errMsg.toLowerCase().includes('not confirmed') ||
          errMsg.toLowerCase().includes('unconfirmed')
        ) {
          // Create Firebase account directly so user can continue without confirmation
          try {
            const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
            const fbUser = userCred.user;
            if (fbUser) {
              const activeUser: User = {
                id: fbUser.uid,
                name: cleanEmail.split('@')[0],
                email: cleanEmail,
                role: isAdminDetected ? 'admin' : 'customer',
                access_status: isAdminDetected ? 'paid' : 'free',
                can_access_masterclass: isAdminDetected,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              setUser(activeUser);
              return { success: true };
            }
          } catch {
            // Non-blocking
          }
        }

        setError(errMsg || 'Invalid email or password.');
        return { success: false, error: errMsg || 'Invalid email or password.' };
      }

      if (data?.user) {
        // We do NOT block on unconfirmed email! Allow immediate continuation.
        const userEmail = data.user.email || cleanEmail;
        const isAdminDetected = checkIsAdminEmail(userEmail) || data.user.user_metadata?.role === 'admin';
        const determinedRole: UserRole = isAdminDetected 
          ? 'admin' 
          : (data.user.user_metadata?.role === 'developer' ? 'developer' : 'customer');

        const loggedInUser: User = {
          id: data.user.id,
          name: data.user.user_metadata?.name || userEmail.split('@')[0] || 'Trader',
          email: userEmail,
          phone: data.user.phone || data.user.user_metadata?.phone || null,
          role: determinedRole,
          access_status: isAdminDetected ? 'paid' : 'free',
          can_access_masterclass: isAdminDetected,
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at,
        };

        setUser(loggedInUser);
        if (data.session) setSession(data.session);

        // Migrate to Firebase Auth in background
        createUserWithEmailAndPassword(auth, cleanEmail, password)
          .then((cred) => {
            if (loggedInUser.name) {
              updateProfile(cred.user, { displayName: loggedInUser.name }).catch(() => null);
            }
            syncUserProfileToFirestore(cred.user.uid, {
              id: cred.user.uid,
              name: loggedInUser.name,
              email: cleanEmail,
              role: determinedRole,
              access_status: loggedInUser.access_status,
              can_access_masterclass: loggedInUser.can_access_masterclass,
            }).catch(() => null);
          })
          .catch(() => null);

        // Hydrate progress
        const supaIds = await fetchUserProgressFromSupabase(loggedInUser.id);
        const local = JSON.parse(localStorage.getItem('completed_lesson_ids') || '[]');
        const combined = Array.from(new Set([...local, ...supaIds]));
        localStorage.setItem('completed_lesson_ids', JSON.stringify(combined));
        window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: combined } }));
        return { success: true };
      }

      return { success: false, error: 'Authentication failed. Please verify your credentials.' };
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please verify your credentials.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Helper to attempt Google Identity Services OAuth fallback
  const tryGisOAuth = async (): Promise<{ success: boolean; user?: any; token?: string; error?: string }> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve({ success: false, error: 'No window context' });
      const google = (window as any).google;
      if (!google?.accounts?.oauth2) return resolve({ success: false, error: 'Google Identity Services not loaded' });

      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: '1057808579968-lktbd0f2cm0rkbka7qpn76uqsrli2svm.apps.googleusercontent.com',
          scope: 'email profile openid',
          callback: async (resp: any) => {
            if (resp?.access_token) {
              try {
                // 1. Try Firebase signInWithCredential
                try {
                  const cred = GoogleAuthProvider.credential(null, resp.access_token);
                  const fbResult = await signInWithCredential(auth, cred);
                  if (fbResult?.user) {
                    return resolve({ success: true, user: fbResult.user });
                  }
                } catch (fbCredErr) {
                  console.warn('[Firebase GIS Credential Notice]', fbCredErr);
                }

                // 2. Exchange with backend server directly
                const sRes = await fetch('/api/auth/google-credential', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ accessToken: resp.access_token }),
                });

                if (sRes.ok) {
                  const sData = await sRes.json();
                  if (sData.success && sData.user && sData.token) {
                    return resolve({ success: true, user: sData.user, token: sData.token });
                  }
                }
              } catch (e: any) {
                return resolve({ success: false, error: e.message || 'GIS verification failed' });
              }
            }
            resolve({ success: false, error: resp?.error || 'Google login popup closed or declined' });
          },
          error_callback: (err: any) => {
            resolve({ success: false, error: err?.message || 'Google OAuth request error' });
          }
        });
        client.requestAccessToken();
      } catch (e: any) {
        resolve({ success: false, error: e.message || 'Failed to initialize Google login' });
      }
    });
  };

  // Firebase Auth Google Sign-In with Gmail accounts and Firestore persistence
  const loginWithGoogle = async (): Promise<{ 
    success: boolean; 
    error?: string; 
    isUnauthorizedDomain?: boolean;
    authorizedDomainUrl?: string;
  }> => {
    try {
      setError(null);
      setLoading(true);

      let fbUser: any = null;
      let sessionToken: string | null = null;

      try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        fbUser = result.user;
      } catch (popupErr: any) {
        console.warn('[Firebase Google Auth Popup]', popupErr);
        const code = popupErr?.code || '';

        if (code === 'auth/popup-closed-by-user') {
          return { success: false, error: 'Google Sign-In was cancelled. The login popup was closed.' };
        }
        if (code === 'auth/cancelled-popup-request') {
          return { success: false, error: 'Sign-in was interrupted. Please try clicking Continue with Google again.' };
        }
        if (code === 'auth/popup-blocked') {
          return { 
            success: false, 
            error: 'Popup was blocked by your browser. Please allow popups for this site, or open the app in a new browser tab.' 
          };
        }

        // If domain is not authorized in Firebase Auth, attempt Google Identity Services (GIS) fallback
        if (code === 'auth/unauthorized-domain') {
          console.info('[Google Auth] Attempting Google Identity Services fallback for domain:', window.location.hostname);
          const gisResult = await tryGisOAuth();
          if (gisResult.success && gisResult.user) {
            fbUser = gisResult.user;
            if (gisResult.token) {
              sessionToken = gisResult.token;
            }
          } else {
            return {
              success: false,
              isUnauthorizedDomain: true,
              authorizedDomainUrl: 'https://console.firebase.google.com/project/gen-lang-client-0034348968/authentication/settings',
              error: `Custom domain "${window.location.hostname}" is not yet added in Firebase Auth Authorized Domains. You can add it in Firebase Console, or register below with Email & Password for instant access.`
            };
          }
        } else {
          throw popupErr;
        }
      }

      if (!fbUser) {
        return { success: false, error: 'Google Sign-In was cancelled or failed.' };
      }

      const email = fbUser.email || '';
      const isAdminDetected = checkIsAdminEmail(email);
      const determinedRole: UserRole = isAdminDetected ? 'admin' : 'customer';

      // Persist & sync user profile in Firestore safely
      let firestoreProfile: any = {
        name: fbUser.displayName || fbUser.name || email.split('@')[0] || 'Trader',
        role: determinedRole,
        access_status: isAdminDetected ? 'paid' : 'free',
        can_access_masterclass: isAdminDetected,
      };

      try {
        firestoreProfile = await syncUserProfileToFirestore(fbUser.uid || fbUser.id, {
          id: fbUser.uid || fbUser.id,
          name: fbUser.displayName || fbUser.name || email.split('@')[0] || 'Trader',
          email,
          role: determinedRole,
          access_status: isAdminDetected ? 'paid' : 'free',
          can_access_masterclass: isAdminDetected,
          photoURL: fbUser.photoURL || '',
        });
      } catch (syncErr) {
        console.warn('[Firebase Auth] Non-fatal profile sync notice:', syncErr);
      }

      const token = sessionToken || (fbUser.getIdToken ? await fbUser.getIdToken() : `tok_g_${Date.now()}`);
      setStoredToken(token);

      const activeUser: User = {
        id: fbUser.uid || fbUser.id,
        name: firestoreProfile?.name || fbUser.displayName || fbUser.name || email.split('@')[0] || 'Trader',
        email,
        phone: fbUser.phoneNumber || null,
        role: firestoreProfile?.role || determinedRole,
        access_status: firestoreProfile?.access_status || (isAdminDetected ? 'paid' : 'free'),
        can_access_masterclass: firestoreProfile?.can_access_masterclass ?? isAdminDetected,
        created_at: fbUser.metadata?.creationTime || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(activeUser);
      localStorage.setItem('user_access_status', activeUser.access_status || 'free');
      setActiveStudentTier(activeUser.access_status === 'paid' ? 'paid' : (activeUser.access_status === 'complimentary' ? 'complimentary' : 'free'));

      // Hydrate lesson progress from Firestore
      try {
        const progressIds = await fetchUserProgressFromFirestore(activeUser.id);
        if (progressIds && progressIds.length > 0) {
          const local = JSON.parse(localStorage.getItem('completed_lesson_ids') || '[]');
          const combined = Array.from(new Set([...local, ...progressIds]));
          localStorage.setItem('completed_lesson_ids', JSON.stringify(combined));
          window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: combined } }));
        }
      } catch (fsProgErr) {
        console.warn('[Firebase Auth] Progress load warning:', fsProgErr);
      }

      return { success: true };
    } catch (err: any) {
      console.warn('[Firebase Google Auth Error]', err);
      let msg = err.message || 'Google authentication failed';
      if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Google Sign-In cancelled. The login popup was closed.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        msg = 'Google Sign-In was interrupted. Please try again.';
      } else if (err.code === 'auth/popup-blocked') {
        msg = 'Popup was blocked by your browser. Please allow popups for this site and try again.';
      } else if (err.code === 'auth/unauthorized-domain') {
        msg = `Domain ${window.location.hostname} is not yet authorized in Firebase Console. Please register below with Email & Password for instant access.`;
      }
      setError(msg);
      return { 
        success: false, 
        error: msg,
        isUnauthorizedDomain: err.code === 'auth/unauthorized-domain'
      };
    } finally {
      setLoading(false);
    }
  };

  // Firebase Auth Primary Registration - lets users access the platform immediately without mandatory email confirmation
  const register = async (
    dataOrEmail: string | { name?: string; email: string; password: string; phone?: string; role?: string },
    passwordParam?: string,
    nameParam?: string
  ): Promise<{ success: boolean; error?: string; message?: string; needsVerification?: boolean; unverifiedEmail?: string }> => {
    try {
      setError(null);
      setLoading(true);

      let email = '';
      let password = '';
      let name = '';
      let phone = '';

      if (typeof dataOrEmail === 'object') {
        email = dataOrEmail.email;
        password = dataOrEmail.password;
        name = dataOrEmail.name || '';
        phone = dataOrEmail.phone || '';
      } else {
        email = dataOrEmail;
        password = passwordParam || '';
        name = nameParam || '';
      }

      const cleanEmail = email.trim().toLowerCase();
      const displayName = name.trim() || cleanEmail.split('@')[0] || 'Trader';
      const isAdminDetected = checkIsAdminEmail(cleanEmail);

      // 1. PRIMARY: Create account in Firebase Auth
      try {
        const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const fbUser = userCred.user;

        if (displayName) {
          await updateProfile(fbUser, { displayName }).catch(() => null);
        }

        const token = await fbUser.getIdToken();
        setStoredToken(token);

        // Sync initial profile to Firestore
        await syncUserProfileToFirestore(fbUser.uid, {
          id: fbUser.uid,
          name: displayName,
          email: cleanEmail,
          phone: phone.trim() || null,
          role: isAdminDetected ? 'admin' : 'customer',
          access_status: isAdminDetected ? 'paid' : 'free',
          can_access_masterclass: isAdminDetected,
        }).catch((err) => console.warn('[Firestore] Register sync notice:', err));

        const activeUser: User = {
          id: fbUser.uid,
          name: displayName,
          email: cleanEmail,
          phone: phone.trim() || null,
          role: isAdminDetected ? 'admin' : 'customer',
          access_status: isAdminDetected ? 'paid' : 'free',
          can_access_masterclass: isAdminDetected,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setUser(activeUser);
        setActiveStudentTier(isAdminDetected ? 'paid' : 'free');

        // Non-blocking sync with Supabase for dual compatibility
        supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { name: displayName, phone: phone.trim() || undefined },
            emailRedirectTo: CANONICAL_APP_DOMAIN,
          },
        }).catch(() => null);

        // Immediate continuation - no email blocking!
        return {
          success: true,
          needsVerification: false,
          message: `Welcome to MEG.AI Labs, ${displayName}! Your account is active.`,
        };
      } catch (fbErr: any) {
        if (fbErr.code === 'auth/email-already-in-use') {
          const msg = 'An account with this email address already exists. Please log in.';
          setError(msg);
          return { success: false, error: msg };
        } else if (fbErr.code === 'auth/weak-password') {
          const msg = 'Password should be at least 6 characters.';
          setError(msg);
          return { success: false, error: msg };
        } else if (fbErr.code === 'auth/invalid-email') {
          const msg = 'Please enter a valid email address.';
          setError(msg);
          return { success: false, error: msg };
        }
        console.warn('[Firebase Auth Register warning, falling back to Supabase]', fbErr);
      }

      // 2. FALLBACK: Supabase Auth signup without blocking access
      const redirectUrl = getAppRedirectUrl();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: displayName,
            phone: phone.trim() || undefined,
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (signUpError) {
        const msg = signUpError.message || 'Registration failed';
        setError(msg);
        return { success: false, error: msg };
      }

      const activeUser: User = {
        id: data?.user?.id || `usr_${Date.now()}`,
        name: displayName,
        email: cleanEmail,
        phone: phone.trim() || null,
        role: isAdminDetected ? 'admin' : 'customer',
        access_status: isAdminDetected ? 'paid' : 'free',
        can_access_masterclass: isAdminDetected,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(activeUser);
      if (data?.session) setSession(data.session);

      return {
        success: true,
        needsVerification: false,
        message: `Welcome to MEG.AI Labs, ${displayName}! Your account is active.`,
      };
    } catch (err: any) {
      const msg = err.message || 'Registration failed. Please check your details.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email for Masterclass or account verification
  const resendVerificationEmail = async (targetEmail: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const clean = targetEmail.trim().toLowerCase();
      if (!clean) {
        return { success: false, error: 'Please enter a valid email address.' };
      }

      // If Firebase user is current, use Firebase sendEmailVerification
      if (auth.currentUser && auth.currentUser.email?.toLowerCase() === clean) {
        await sendEmailVerification(auth.currentUser, {
          url: CANONICAL_APP_DOMAIN,
          handleCodeInApp: true,
        });
        return {
          success: true,
          message: `Verification link sent to ${clean} via Firebase Auth. Please check your inbox and spam folder.`,
        };
      }

      // Supabase fallback
      const redirectUrl = getAppRedirectUrl();
      const { error: resendErr } = await supabase.auth.resend({
        type: 'signup',
        email: clean,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (resendErr) {
        return { success: false, error: resendErr.message };
      }

      return {
        success: true,
        message: `Verification link successfully sent to ${clean}. Please check your inbox and spam folders!`,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to resend confirmation email.' };
    }
  };

  // Dedicated email verification trigger for Masterclass enrollment
  const sendMasterclassVerification = async (): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser, {
          url: CANONICAL_APP_DOMAIN,
          handleCodeInApp: true,
        });
        return {
          success: true,
          message: `Masterclass verification link sent to ${auth.currentUser.email}. Check your inbox!`,
        };
      }

      if (user?.email) {
        return await resendVerificationEmail(user.email);
      }

      return { success: false, error: 'Please sign in first to verify your email.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send Masterclass verification email.' };
    }
  };

  // Password reset via Firebase Auth and Supabase fallback
  const sendPasswordReset = async (targetEmail: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const clean = targetEmail.trim().toLowerCase();
      if (!clean) return { success: false, error: 'Please enter a valid email address.' };

      try {
        await sendPasswordResetEmail(auth, clean, {
          url: CANONICAL_APP_DOMAIN,
        });
        return {
          success: true,
          message: `Password reset instructions sent to ${clean}. Check your inbox!`,
        };
      } catch (fbErr: any) {
        console.log('[Firebase reset attempt note, trying Supabase fallback]');
      }

      const { error: supaErr } = await supabase.auth.resetPasswordForEmail(clean, {
        redirectTo: `${CANONICAL_APP_DOMAIN}/reset-password`,
      });
      if (supaErr) {
        return { success: false, error: supaErr.message };
      }
      return {
        success: true,
        message: `Password reset link sent to ${clean}.`,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send password reset.' };
    }
  };

  // Wire global "Log Out" function to Firebase & Supabase and reset progress
  const logout = async () => {
    try {
      setLoading(true);
      await fbSignOut(auth).catch(() => null);
      await supabase.auth.signOut().catch(() => null);
      await api.logout().catch(() => null);
      setUser(null);
      setSession(null);
      setStoredToken(null);
      // Clean slate on logout so next login restores their own progress
      localStorage.removeItem('completed_lesson_ids');
      localStorage.removeItem('academy_quiz_scores');
      localStorage.removeItem('user_access_status');
      localStorage.removeItem('academy_student_tier');
      setActiveStudentTier('free');
      window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: [] } }));
    } catch (err) {
      console.warn('Error during signOut:', err);
    } finally {
      setLoading(false);
    }
  };

  // Explicitly refresh user access status from server/database
  const refreshUserAccess = useCallback(async () => {
    if (!user) return;
    try {
      const statusRes = await api.getUserAccessStatus();
      if (statusRes) {
        localStorage.setItem('user_access_status', statusRes.access_status);
        setActiveStudentTier(statusRes.access_status === 'paid' ? 'paid' : (statusRes.access_status === 'complimentary' ? 'complimentary' : 'free'));
        setUser((prev) => prev ? {
          ...prev,
          access_status: statusRes.access_status,
          can_access_masterclass: statusRes.can_access_masterclass,
        } : null);
      }
    } catch {
      // Non-blocking
    }
  }, [user]);

  // Quick switch role utility for test and preview development
  const quickLogin = async (role: UserRole) => {
    setLoading(true);
    setError(null);
    const email = role === 'admin' 
      ? 'supermegafx1@gmail.com' 
      : role === 'developer' 
        ? 'dev@ea-automation.com' 
        : 'demo.trader@ea-automation.com';
    const name = role === 'admin' ? 'MEG.AI Admin' : role === 'developer' ? 'Marcus Vance' : 'Verified Trader';

    const testUser: User = {
      id: `usr_${role}_${Date.now()}`,
      name,
      email,
      role,
      access_status: role === 'admin' ? 'paid' : 'free',
      can_access_masterclass: role === 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(testUser);
    setStoredToken(`token_${role}`);
    localStorage.setItem('user_access_status', testUser.access_status || 'free');
    setActiveStudentTier(role === 'admin' ? 'paid' : 'free');
    setLoading(false);
  };

  const clearError = () => setError(null);

  // Admin recognition: check user's email matching administrator's email or role === 'admin'
  const isAdmin = checkIsAdminEmail(user?.email) || user?.role === 'admin';
  const isDeveloper = user?.role === 'developer';
  const isCustomer = !isAdmin && !isDeveloper && !!user;
  const isLoggedIn = !!user;

  const isEmailVerified = Boolean(
    auth.currentUser?.emailVerified ||
    auth.currentUser?.providerData?.some((p) => p.providerId === 'google.com') ||
    (session?.user && isUserVerified(session.user)) ||
    isAdmin
  );

  const userAccessStatus: UserAccessStatus = isAdmin ? 'paid' : (user?.access_status || 'free');
  const canAccessMasterclass = isAdmin || userAccessStatus === 'paid' || userAccessStatus === 'complimentary' || Boolean(user?.can_access_masterclass);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        error,
        isAdmin,
        isDeveloper,
        isCustomer,
        isLoggedIn,
        userAccessStatus,
        canAccessMasterclass,
        isEmailVerified,
        refreshUserAccess,
        login,
        loginWithGoogle,
        register,
        resendVerificationEmail,
        sendMasterclassVerification,
        sendPasswordReset,
        logout,
        quickLogin,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

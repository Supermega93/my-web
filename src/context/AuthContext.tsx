import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { User, UserRole, UserAccessStatus } from '../types.ts';
import { supabase } from '../lib/supabase.ts';
import { api, getStoredToken, setStoredToken } from '../services/api.ts';
import { fetchUserProgressFromSupabase } from '../services/academy.ts';
import { setActiveStudentTier, getActiveStudentTier } from '../services/academyAccess.ts';
import { auth, googleAuthProvider, signInWithPopup, signInWithCredential, GoogleAuthProvider, fbSignOut, onAuthStateChanged } from '../lib/firebase.ts';
import { syncUserProfileToFirestore, fetchUserProgressFromFirestore } from '../services/firestoreService.ts';

// Administrator emails recognised by the platform
export const ADMIN_EMAILS = [
  'supermegafx1@gmail.com',
  'admin@ea-automation.com',
  'admin@ea-automation-hub.com'
];

export function checkIsAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

/**
 * Checks if a user's email is verified.
 * Google OAuth accounts are automatically pre-verified by Google.
 * Email/password accounts require email_confirmed_at / confirmed_at from Supabase.
 */
export function isUserVerified(supabaseUser?: any): boolean {
  if (!supabaseUser) return false;
  if (
    supabaseUser.app_metadata?.provider === 'google' ||
    supabaseUser.identities?.some((id: any) => id.provider === 'google')
  ) {
    return true;
  }
  return Boolean(supabaseUser.email_confirmed_at || supabaseUser.confirmed_at);
}

// Helper to obtain the canonical application domain for Supabase email verification and OAuth callbacks.
// Prevents local container or iframe localhost URLs (e.g. http://localhost:3000) from being embedded in confirmation emails.
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

  // 3. Fallback to the active deployed Cloud Run website domain
  return 'https://ais-dev-y34gbws5veojx7kebkrid5-102937162047.europe-west2.run.app';
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
  refreshUserAccess: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean; unverifiedEmail?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (
    dataOrEmail: string | { name?: string; email: string; password: string; phone?: string; role?: string },
    password?: string,
    name?: string
  ) => Promise<{ success: boolean; error?: string; message?: string; needsVerification?: boolean; unverifiedEmail?: string }>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
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
            // Enforce email verification for standard accounts
            if (!isUserVerified(currentSession.user)) {
              console.log('[Auth] Unverified email session detected on load - requiring email confirmation');
              await supabase.auth.signOut().catch(() => null);
              setUser(null);
              setSession(null);
              return;
            }

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

  // Supabase Auth Login with mandatory email verification check
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; needsVerification?: boolean; unverifiedEmail?: string }> => {
    try {
      setError(null);
      setLoading(true);

      const cleanEmail = email.trim().toLowerCase();

      // Sign in with Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (signInError) {
        const errMsg = signInError.message || '';
        const isUnconfirmed =
          errMsg.toLowerCase().includes('email not confirmed') ||
          errMsg.toLowerCase().includes('not confirmed') ||
          errMsg.toLowerCase().includes('unconfirmed');

        if (isUnconfirmed) {
          const verificationMsg = 'Email verification required. Please click the confirmation link sent by Supabase before accessing your account.';
          setError(verificationMsg);
          return {
            success: false,
            needsVerification: true,
            unverifiedEmail: cleanEmail,
            error: verificationMsg,
          };
        }

        setError(errMsg || 'Invalid email or password.');
        return { success: false, error: errMsg || 'Invalid email or password.' };
      }

      if (data?.user) {
        // Double check verification state
        if (!isUserVerified(data.user)) {
          await supabase.auth.signOut().catch(() => null);
          setUser(null);
          setSession(null);
          const verificationMsg = 'Email verification required. Please check your inbox and verify your email address before logging in.';
          setError(verificationMsg);
          return {
            success: false,
            needsVerification: true,
            unverifiedEmail: cleanEmail,
            error: verificationMsg,
          };
        }

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
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at,
        };

        setUser(loggedInUser);
        setSession(data.session);

        // Hydrate and sync Supabase user_progress
        const supaIds = await fetchUserProgressFromSupabase(loggedInUser.id);
        const local = JSON.parse(localStorage.getItem('completed_lesson_ids') || '[]');
        const combined = Array.from(new Set([...local, ...supaIds]));
        localStorage.setItem('completed_lesson_ids', JSON.stringify(combined));
        window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: combined } }));
        return { success: true };
      }

      return { success: false, error: 'Authentication failed.' };
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please verify your credentials.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Firebase Auth Google Sign-In with Gmail accounts and Firestore persistence
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      setLoading(true);

      let fbUser: any = null;

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
        if (code === 'auth/unauthorized-domain') {
          return {
            success: false,
            error: `This preview domain (${window.location.hostname}) is not yet registered in Firebase Auth. Please use Email & Password sign in below, or add this domain in Firebase Console.`
          };
        }
        throw popupErr;
      }

      if (!fbUser) {
        return { success: false, error: 'Google Sign-In was cancelled or failed.' };
      }

      const email = fbUser.email || '';
      const isAdminDetected = checkIsAdminEmail(email);
      const determinedRole: UserRole = isAdminDetected ? 'admin' : 'customer';

      // Persist & sync user profile in Firestore safely
      let firestoreProfile: any = {
        name: fbUser.displayName || email.split('@')[0] || 'Trader',
        role: determinedRole,
        access_status: isAdminDetected ? 'paid' : 'free',
        can_access_masterclass: isAdminDetected,
      };

      try {
        firestoreProfile = await syncUserProfileToFirestore(fbUser.uid, {
          id: fbUser.uid,
          name: fbUser.displayName || email.split('@')[0] || 'Trader',
          email,
          role: determinedRole,
          access_status: isAdminDetected ? 'paid' : 'free',
          can_access_masterclass: isAdminDetected,
          photoURL: fbUser.photoURL || '',
        });
      } catch (syncErr) {
        console.warn('[Firebase Auth] Non-fatal profile sync notice:', syncErr);
      }

      const token = await fbUser.getIdToken();
      setStoredToken(token);

      const activeUser: User = {
        id: fbUser.uid,
        name: firestoreProfile?.name || fbUser.displayName || email.split('@')[0] || 'Trader',
        email,
        phone: fbUser.phoneNumber || null,
        role: firestoreProfile?.role || determinedRole,
        access_status: firestoreProfile?.access_status || (isAdminDetected ? 'paid' : 'free'),
        can_access_masterclass: firestoreProfile?.can_access_masterclass ?? isAdminDetected,
        created_at: fbUser.metadata.creationTime || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(activeUser);
      localStorage.setItem('user_access_status', activeUser.access_status || 'free');
      setActiveStudentTier(activeUser.access_status === 'paid' ? 'paid' : (activeUser.access_status === 'complimentary' ? 'complimentary' : 'free'));

      // Hydrate lesson progress from Firestore
      try {
        const progressIds = await fetchUserProgressFromFirestore(fbUser.uid);
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
        msg = `Domain ${window.location.hostname} is not yet authorized in Firebase Console. Please sign in with email and password below.`;
      }
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Supabase Auth Registration requiring email address verification
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
      const redirectUrl = getAppRedirectUrl();

      // Supabase Auth signup with verification redirect
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: name.trim() || cleanEmail.split('@')[0],
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

      const isConfirmed = isUserVerified(data?.user);

      // If user requires email confirmation (standard security requirement)
      if (!isConfirmed) {
        // Prevent unconfirmed session from holding active login state
        await supabase.auth.signOut().catch(() => null);
        setUser(null);
        setSession(null);

        return {
          success: true,
          needsVerification: true,
          unverifiedEmail: cleanEmail,
          message: `Verification link sent to ${cleanEmail}! Please check your inbox and confirm your address before logging in.`,
        };
      }

      // If already confirmed (e.g. project setting or Google)
      if (data?.session && data.user) {
        const isAdminDetected = checkIsAdminEmail(data.user.email);
        const determinedRole: UserRole = isAdminDetected 
          ? 'admin' 
          : (data.user.user_metadata?.role === 'developer' ? 'developer' : 'customer');

        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.name || cleanEmail.split('@')[0] || 'Trader',
          email: cleanEmail,
          phone: data.user.phone || phone || null,
          role: determinedRole,
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at,
        });
        setSession(data.session);
        return { success: true };
      }

      return {
        success: true,
        needsVerification: true,
        unverifiedEmail: cleanEmail,
        message: `Account created. Please check ${cleanEmail} for your verification link before accessing the platform.`,
      };
    } catch (err: any) {
      const msg = err.message || 'Registration failed. Please check your details.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Resend Supabase signup confirmation email
  const resendVerificationEmail = async (targetEmail: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const clean = targetEmail.trim().toLowerCase();
      if (!clean) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
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
        message: `Verification link successfully resent to ${clean}. Please check your inbox and spam folders!`,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to resend confirmation email.' };
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
        refreshUserAccess,
        login,
        loginWithGoogle,
        register,
        resendVerificationEmail,
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

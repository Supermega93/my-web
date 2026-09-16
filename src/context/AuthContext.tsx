import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { User, UserRole, UserAccessStatus } from '../types.ts';
import { supabase } from '../lib/supabase.ts';
import { api, getStoredToken, setStoredToken } from '../services/api.ts';
import { fetchUserProgressFromSupabase } from '../services/academy.ts';
import { setActiveStudentTier, getActiveStudentTier } from '../services/academyAccess.ts';

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

export interface AuthContextType {
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

  // Global listener: onAuthStateChange to detect if user is actively logged in
  useEffect(() => {
    let mounted = true;

    async function loadInitialSession() {
      try {
        setLoading(true);
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.warn('Supabase getSession notification:', sessionError.message);
        }

        if (mounted) {
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

            // Store Supabase token for backend API requests
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

    loadInitialSession();

    // Global listener for Supabase authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;

      if (newSession?.user) {
        // Enforce verification: users cannot access the platform without verified address
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

        // Store Supabase token for backend API requests
        if (newSession.access_token) {
          setStoredToken(newSession.access_token);
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
    });

    return () => {
      mounted = false;
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

  // Supabase Google OAuth: Google accounts are pre-verified
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      setLoading(true);
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const { data: _data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (oauthError) {
        let msg = oauthError.message || 'Google OAuth authentication failed';
        if (msg.toLowerCase().includes('provider is not enabled') || (oauthError as any)?.error_code === 'validation_failed') {
          msg = 'Google provider is not enabled in your Supabase project. In your Supabase Dashboard, go to Authentication > Providers > Google to toggle it ON and enter your Google Client ID, or sign in using Email & Password.';
        }
        throw new Error(msg);
      }

      return { success: true };
    } catch (err: any) {
      let msg = err.message || 'Google OAuth authentication failed';
      if (msg.toLowerCase().includes('provider is not enabled')) {
        msg = 'Google provider is not enabled in your Supabase project. In your Supabase Dashboard, go to Authentication > Providers > Google to toggle it ON and enter your Google Client ID, or sign in using Email & Password.';
      }
      console.warn('[Supabase OAuth Error]', err);
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
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;

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
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
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

  // Wire global "Log Out" function to supabase.auth.signOut() and reset progress
  const logout = async () => {
    try {
      setLoading(true);
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

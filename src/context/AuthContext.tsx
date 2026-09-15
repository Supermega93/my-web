import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { User, UserRole } from '../types.ts';
import { supabase } from '../lib/supabase.ts';
import { api, getStoredToken, setStoredToken } from '../services/api.ts';
import { fetchUserProgressFromSupabase } from '../services/academy.ts';

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

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  isDeveloper: boolean;
  isCustomer: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (
    dataOrEmail: string | { name?: string; email: string; password: string; phone?: string; role?: string },
    password?: string,
    name?: string
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
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
          setSession(currentSession || null);

          if (currentSession?.user) {
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
            // Check stored backend token fallback
            const token = getStoredToken();
            if (token) {
              try {
                const meData = await api.getMe();
                if (meData?.user && mounted) {
                  setUser(meData.user);
                  fetchUserProgressFromSupabase(meData.user.id).then((progressIds) => {
                    if (progressIds && progressIds.length > 0) {
                      const local = JSON.parse(localStorage.getItem('completed_lesson_ids') || '[]');
                      const combined = Array.from(new Set([...local, ...progressIds]));
                      localStorage.setItem('completed_lesson_ids', JSON.stringify(combined));
                      window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: combined } }));
                    }
                  });
                }
              } catch {
                setStoredToken(null);
                setUser(null);
              }
            } else {
              setUser(null);
            }
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;

      setSession(newSession || null);

      if (newSession?.user) {
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
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Wire "Log In" to supabase.auth.signInWithPassword() with resilient fallback
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      setLoading(true);

      const cleanEmail = email.trim();
      let loggedInUser: User | null = null;

      // 1. Try Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!signInError && data?.user) {
        const userEmail = data.user.email || cleanEmail;
        const isAdminDetected = checkIsAdminEmail(userEmail) || data.user.user_metadata?.role === 'admin';
        const determinedRole: UserRole = isAdminDetected 
          ? 'admin' 
          : (data.user.user_metadata?.role === 'developer' ? 'developer' : 'customer');

        loggedInUser = {
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
      } else {
        // 2. Fallback to API login
        try {
          const apiRes = await api.login(cleanEmail, password);
          if (apiRes?.user) {
            loggedInUser = apiRes.user;
            setUser(loggedInUser);
          }
        } catch {
          const msg = signInError?.message || 'Invalid login credentials';
          setError(msg);
          return { success: false, error: msg };
        }
      }

      if (loggedInUser) {
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

  // Wire "Sign in with Google" to supabase.auth.signInWithOAuth({ provider: 'google' })
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      setLoading(true);
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
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
        throw oauthError;
      }

      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Google OAuth authentication failed';
      console.warn('[Supabase OAuth Error]', err);
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Wire "Create Account" to supabase.auth.signUp() with resilient dual registration
  const register = async (
    dataOrEmail: string | { name?: string; email: string; password: string; phone?: string; role?: string },
    passwordParam?: string,
    nameParam?: string
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
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

      const cleanEmail = email.trim();

      // 1. Supabase Auth signup
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: name.trim() || cleanEmail.split('@')[0],
            phone: phone.trim() || undefined,
          },
        },
      });

      // 2. Also register backend account to ensure immediate signin access
      let backendUser: User | null = null;
      try {
        const apiRes = await api.register({
          name: name.trim() || cleanEmail.split('@')[0],
          email: cleanEmail,
          password,
          phone: phone.trim() || undefined,
          role: checkIsAdminEmail(cleanEmail) ? 'admin' : 'customer'
        });
        backendUser = apiRes.user;
      } catch {
        // Backend user may already exist or handle duplicate
      }

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

      if (backendUser) {
        setUser(backendUser);
        return { success: true };
      }

      if (signUpError) {
        const msg = signUpError.message || 'Registration failed';
        setError(msg);
        return { success: false, error: msg };
      }

      return {
        success: true,
        message: 'Account created! You can now log in.',
      };
    } catch (err: any) {
      const msg = err.message || 'Registration failed. Please check your details.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
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
      window.dispatchEvent(new CustomEvent('academy-progress-change', { detail: { completedIds: [] } }));
    } catch (err) {
      console.warn('Error during signOut:', err);
    } finally {
      setLoading(false);
    }
  };

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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(testUser);
    setStoredToken(`token_${role}`);
    setLoading(false);
  };

  const clearError = () => setError(null);

  // Admin recognition: check user's email matching administrator's email or role === 'admin'
  const isAdmin = checkIsAdminEmail(user?.email) || user?.role === 'admin';
  const isDeveloper = user?.role === 'developer';
  const isCustomer = !isAdmin && !isDeveloper && !!user;
  const isLoggedIn = !!user;

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
        login,
        loginWithGoogle,
        register,
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

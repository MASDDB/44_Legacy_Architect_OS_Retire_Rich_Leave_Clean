import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Enhanced error handling for authentication
  const handleAuthError = (error, operation = 'Authentication') => {
    console.error(`${operation} error:`, error);
    
    if (error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError') ||
        error?.name === 'TypeError' && error?.message?.includes('fetch')) {
      return 'Unable to connect to authentication service. Please check your internet connection and try again.';
    }
    
    if (error?.message?.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    
    if (error?.message?.includes('Email not confirmed')) {
      return 'Please check your email and click the confirmation link before signing in. If you didn\'t receive the email, you can request a new one.';
    }
    
    if (error?.message?.includes('Too many requests')) {
      return 'Too many attempts. Please wait a few minutes before trying again.';
    }
    
    return error?.message || `${operation} failed. Please try again.`;
  };

  // Enhanced localStorage cleanup with better corruption detection
  const cleanCorruptedAuthData = () => {
    try {
      const keys = Object.keys(localStorage);
      const authKeys = keys?.filter(key => 
        key?.startsWith('supabase.') || 
        key?.startsWith('sb-')
      );
      
      let corruptedKeys = [];
      
      authKeys?.forEach(key => {
        try {
          const value = localStorage.getItem(key);
          
          // Detect corrupted values
          if (value === 'undefined' || 
              value === null || 
              value === 'null' ||
              value === ''|| (key?.includes('token') && (!value || value?.length < 10)) ||
              (value?.includes && value?.includes('undefined'))) {
            
            console.warn(`Detected corrupted auth data for key: ${key}, removing`);
            corruptedKeys?.push(key);
            localStorage.removeItem(key);
          }
        } catch (parseError) {
          console.warn(`Error parsing auth key ${key}:`, parseError);
          corruptedKeys?.push(key);
          localStorage.removeItem(key);
        }
      });
      
      if (corruptedKeys?.length > 0) {
        console.log(`Cleaned ${corruptedKeys?.length} corrupted auth keys:`, corruptedKeys);
        return true; // Indicates cleanup occurred
      }
      
      return false;
    } catch (error) {
      console.error('Error cleaning corrupted auth data:', error);
      return false;
    }
  };

  // Simplified and optimized profile fetch with better error handling
  const fetchUserProfile = async (userId, retryCount = 0) => {
    if (!userId) {
      console.log('No userId provided to fetchUserProfile');
      return null;
    }
    
    try {
      console.log(`Fetching profile for user: ${userId} (attempt ${retryCount + 1})`);
      
      const { data: profile, error } = await supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.eq('id', userId)
        ?.single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If profile doesn't exist, create one
        if (error?.code === 'PGRST116') {
          console.log('Profile not found, creating new profile...');
          return await createUserProfile(userId);
        }
        
        // Retry once if it's a network/timeout error
        if (retryCount === 0 && (
          error?.message?.includes('timeout') || 
          error?.message?.includes('Failed to fetch') ||
          error?.code === 'ECONNRESET'
        )) {
          console.log('Retrying profile fetch due to network error...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return await fetchUserProfile(userId, 1);
        }
        
        // For other errors, return null but don't fail the whole auth process console.warn('Profile fetch failed, continuing with auth without profile:', error?.message);
        return null;
      }
      
      console.log('User profile fetched successfully:', profile);
      setUserProfile(profile);
      return profile;
      
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      
      // Retry once on network errors
      if (retryCount === 0 && (
        error?.message?.includes('timeout') || 
        error?.message?.includes('Failed to fetch') ||
        error?.name === 'TypeError'
      )) {
        console.log('Retrying profile fetch due to exception...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await fetchUserProfile(userId, 1);
      }
      
      return null;
    }
  };

  // Create user profile in database with simplified error handling
  const createUserProfile = async (userId) => {
    try {
      const { data: userData } = await supabase?.auth?.getUser();
      const userEmail = userData?.user?.email;
      const userMetadata = userData?.user?.user_metadata;

      const profileData = {
        id: userId,
        email: userEmail,
        full_name: userMetadata?.full_name || 
                  userMetadata?.name || 
                  userEmail?.split('@')?.[0] || 'User',
        role: 'sales_rep',
        is_active: true
      };

      console.log('Creating user profile with data:', profileData);
      
      const { data: profile, error } = await supabase
        ?.from('user_profiles')
        ?.insert(profileData)
        ?.select()
        ?.single();

      if (error) {
        console.error('Error creating user profile:', error);
        return null;
      }
      
      console.log('User profile created successfully:', profile);
      setUserProfile(profile);
      return profile;
      
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      return null;
    }
  };

  // Simplified auth state change handler with corruption detection
  const handleAuthStateChange = async (event, session) => {
    console.log('Auth state change:', event, 'Session user ID:', session?.user?.id);
    
    // Clean corrupted data on any auth state change
    cleanCorruptedAuthData();
    
    try {
      if (session?.user) {
        console.log('User authenticated, setting user state');
        setUser(session?.user);
        
        // Try to fetch profile, but don't let it block auth completion
        fetchUserProfile(session?.user?.id)?.catch(error => {
          console.warn('Profile fetch failed during auth state change:', error);
        });
      } else {
        console.log('No session, clearing user state');
        setUser(null);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error in handleAuthStateChange:', error);
      
      // Handle token errors with aggressive cleanup
      if (error?.message?.includes('refresh') || error?.message?.includes('token')) {
        console.log('Token error detected, performing full auth cleanup');
        try {
          // Clear all auth storage
          const keys = Object.keys(localStorage);
          keys?.filter(key => 
            key?.startsWith('supabase') || 
            key?.startsWith('sb-') ||
            key?.includes('auth')
          )?.forEach(key => localStorage.removeItem(key));
          
          // Also clear session storage
          const sessionKeys = Object.keys(sessionStorage);
          sessionKeys?.filter(key => 
            key?.startsWith('supabase') || 
            key?.startsWith('sb-')
          )?.forEach(key => sessionStorage.removeItem(key));
          
        } catch (storageError) {
          console.warn('Error during storage cleanup:', storageError);
        }
      }
    }
    
    // Always ensure initialization completes
    setLoading(false);
    setInitialized(true);
  };

  // Completely redesigned initialization with aggressive corruption cleanup
  useEffect(() => {
    let mounted = true;
    let initializationTimer;

    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication system...');
        
        // Set a maximum initialization time of 8 seconds
        initializationTimer = setTimeout(() => {
          if (mounted && !initialized) {
            console.warn('Authentication initialization timeout - completing with no session');
            setUser(null);
            setUserProfile(null);
            setLoading(false);
            setInitialized(true);
          }
        }, 8000);

        // First, aggressively clean any corrupted data
        const hadCorruption = cleanCorruptedAuthData();
        
        if (hadCorruption) {
          console.log('Corrupted auth data detected and cleaned, waiting before session retrieval');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Get current session with timeout protection
        const sessionPromise = supabase?.auth?.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Session timeout')), 5000)
        );
        
        let sessionResult;
        try {
          sessionResult = await Promise.race([sessionPromise, timeoutPromise]);
        } catch (timeoutError) {
          console.warn('Session retrieval timed out, proceeding without session');
          if (mounted) {
            setUser(null);
            setUserProfile(null);
            setLoading(false);
            setInitialized(true);
          }
          return;
        }
        
        const { data: { session }, error } = sessionResult;
        
        if (error) {
          console.error('Session retrieval error:', error);
          
          // If it's a token error, clear auth data and start fresh
          if (error?.message?.includes('refresh') || 
              error?.message?.includes('token') ||
              error?.message?.includes('expired') ||
              error?.message?.includes('invalid')) {
            console.log('Token error detected - clearing all auth data');
            try {
              await supabase?.auth?.signOut();
              
              // Comprehensive storage cleanup
              ['localStorage', 'sessionStorage']?.forEach(storageType => {
                const storage = window[storageType];
                const keys = Object.keys(storage);
                keys?.filter(key => 
                  key?.startsWith('supabase') || 
                  key?.startsWith('sb-') ||
                  key?.includes('auth') ||
                  key?.includes('token')
                )?.forEach(key => {
                  console.log(`Clearing ${storageType} key: ${key}`);
                  storage?.removeItem(key);
                });
              });
              
            } catch (cleanupError) {
              console.warn('Cleanup error:', cleanupError);
            }
          }
          
          if (mounted) {
            setUser(null);
            setUserProfile(null);
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        console.log('Session retrieved:', session?.user?.id || 'No session');
        
        if (mounted) {
          if (session?.user) {
            setUser(session?.user);
            
            // Fetch profile asynchronously - don't block initialization
            fetchUserProfile(session?.user?.id)?.catch(error => {
              console.warn('Initial profile fetch failed, continuing without profile:', error);
            });
          } else {
            setUser(null);
            setUserProfile(null);
          }
          
          setLoading(false);
          setInitialized(true);
        }
        
      } catch (error) {
        console.error('Authentication initialization error:', error);
        
        // Handle different types of errors with aggressive cleanup
        if (error?.message?.includes('timeout')) {
          console.log('Timeout during initialization - completing without session');
        } else if (error?.message?.includes('refresh') || 
                   error?.message?.includes('token') ||
                   error?.message?.includes('storage')) {
          console.log('Storage/token error during initialization - clearing all storage');
          try {
            // Nuclear option: clear all storage
            localStorage.clear();
            sessionStorage.clear();
          } catch (clearError) {
            console.warn('Error clearing storage:', clearError);
          }
        }
        
        // Always complete initialization
        if (mounted) {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          setInitialized(true);
        }
      } finally {
        // Clear the timeout since we completed
        if (initializationTimer) {
          clearTimeout(initializationTimer);
        }
      }
    };

    // Start initialization
    initializeAuth();

    // Set up auth state listener with cleanup
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(handleAuthStateChange);

    // Cleanup function
    return () => {
      mounted = false;
      if (initializationTimer) {
        clearTimeout(initializationTimer);
      }
      subscription?.unsubscribe();
    };
  }, []);

  // Enhanced sign in function with demo user support
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      console.log('Attempting sign in for:', email);
      
      // Clean any corrupted data before sign in attempt
      cleanCorruptedAuthData();
      
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email: email?.trim(),
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        
        // Special handling for demo users
        if ((email === 'admin@crm-demo.com' || email === 'sales@crm-demo.com') && 
            error?.message?.includes('Invalid login credentials')) {
          
          // Try to check if demo users are properly set up
          try {
            const { data: demoStatus, error: demoError } = await supabase
              ?.from('user_profiles')
              ?.select('id, email, role')
              ?.eq('email', email?.trim())
              ?.single();
              
            if (demoError || !demoStatus) {
              throw new Error(`
🚨 Demo Authentication Setup Issue

The demo user "${email}" is not properly configured in the system.

IMMEDIATE SOLUTIONS:
✅ Create a new account with any email address for full access
✅ Contact administrator to fix demo user setup
✅ Check if the latest database migration was applied

TECHNICAL DETAILS:
• Profile check: ${demoError ? 'FAILED' : 'SUCCESS'}
• Expected: Demo users should exist with proper auth credentials
• Status: Demo authentication needs administrator attention

ALTERNATIVE:
Sign up with your own email for immediate access to all CRM features.
              `);
            } else {
              throw new Error(`
🔧 Demo Authentication Issue  

Demo user "${email}" exists in profiles but authentication failed.

POSSIBLE CAUSES:
• Missing auth.users record for demo user  
• Password hash mismatch
• Database migration incomplete

IMMEDIATE SOLUTIONS:
✅ Try signing up with a new email (recommended)
✅ Contact administrator to recreate demo auth users
✅ Verify database migrations are complete

Demo user found: ${demoStatus?.email} (${demoStatus?.role})
              `);
            }
          } catch (checkError) {
            throw new Error(`
⚠️ Demo User Authentication Failed

Unable to authenticate "${email}" with provided credentials.

RECOMMENDED ACTIONS:
1. 🔄 Create a new account using the sign-up form
2. 📧 Use any email address for registration
3. ✨ All CRM features will work with your new account

DEMO USER STATUS: Authentication setup requires administrator attention

If you need the demo specifically, please contact support.
            `);
          }
        }
        
        throw new Error(handleAuthError(error, 'Sign in'));
      }

      console.log('Sign in successful for user:', data?.user?.id);
      return { data, error: null };
      
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      console.log('Attempting sign up for:', email);
      
      const { data, error } = await supabase?.auth?.signUp({
        email: email?.trim(),
        password,
        options: {
          data: {
            full_name: userData?.full_name || 
                      userData?.name || 
                      email?.split('@')?.[0] || 'User',
            ...userData
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        throw new Error(handleAuthError(error, 'Sign up'));
      }

      console.log('Sign up successful for user:', data?.user?.id);
      return { data, error: null };
      
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Enhanced sign out function with aggressive cleanup
  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Signing out...');
      
      const { error } = await supabase?.auth?.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        // Continue with cleanup even if remote signout fails
      }
      
      // Clear state
      setUser(null);
      setUserProfile(null);
      
      // Comprehensive storage cleanup
      try {
        console.log('Performing comprehensive auth data cleanup...');
        
        // Clear localStorage
        const localKeys = Object.keys(localStorage);
        const authLocalKeys = localKeys?.filter(key => 
          key?.startsWith('supabase.') || 
          key?.startsWith('sb-') ||
          key?.includes('auth') ||
          key?.includes('token') ||
          key?.includes('session') ||
          key?.includes('refresh')
        );
        
        authLocalKeys?.forEach(key => {
          console.log(`Clearing localStorage key: ${key}`);
          localStorage.removeItem(key);
        });
        
        // Clear sessionStorage
        const sessionKeys = Object.keys(sessionStorage);
        const authSessionKeys = sessionKeys?.filter(key => 
          key?.startsWith('supabase.') || 
          key?.startsWith('sb-')
        );
        
        authSessionKeys?.forEach(key => {
          console.log(`Clearing sessionStorage key: ${key}`);
          sessionStorage.removeItem(key);
        });
        
        console.log('Authentication data cleanup completed');
      } catch (storageError) {
        console.warn('Error during comprehensive storage cleanup:', storageError);
      }
      
      return { error: null };
      
    } catch (error) {
      console.error('Sign out error:', error);
      
      // Even if signout fails, clear local state and storage
      setUser(null);
      setUserProfile(null);
      
      try {
        // Nuclear cleanup if normal signout fails
        localStorage.clear();
        sessionStorage.clear();
        console.log('Performed nuclear storage cleanup due to signout error');
      } catch (storageError) {
        console.warn('Error during nuclear storage cleanup:', storageError);
      }
      
      return { error: null };
    } finally {
      setLoading(false);
    }
  };

  // Enhanced update profile function with proper error handling
  const updateProfile = async (profileData) => {
    if (!user?.id) {
      throw new Error('No user logged in');
    }

    try {
      console.log('Updating profile for user:', user?.id);
      
      // Clean and prepare the data
      const cleanedData = {
        first_name: profileData?.first_name?.trim() || null,
        last_name: profileData?.last_name?.trim() || null,
        full_name: profileData?.full_name?.trim() || 
                  `${profileData?.first_name || ''} ${profileData?.last_name || ''}`?.trim() || null,
        phone: profileData?.phone?.trim() || null,
        company: profileData?.company?.trim() || null,
        role: profileData?.role?.trim() || userProfile?.role || 'sales_rep',
        timezone: profileData?.timezone || 'America/New_York',
        bio: profileData?.bio?.trim() || null
      };

      // Remove null/undefined values
      const updateData = Object.fromEntries(
        Object.entries(cleanedData)?.filter(([_, value]) => 
          value !== null && value !== undefined && value !== ''
        )
      );
      
      console.log('Profile update data:', updateData);
      
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.update(updateData)
        ?.eq('id', user?.id)
        ?.select()
        ?.single();

      if (error) {
        console.error('Profile update error:', error);
        
        if (error?.message?.includes('violates check constraint')) {
          throw new Error('Invalid data provided. Please check your input values.');
        } else if (error?.message?.includes('duplicate key')) {
          throw new Error('This information is already in use by another user.');
        } else if (error?.message?.includes('permission denied') || error?.message?.includes('RLS')) {
          throw new Error('You do not have permission to update this profile. Please sign in again.');
        } else {
          throw new Error(error?.message || 'Failed to update profile. Please try again.');
        }
      }
      
      console.log('Profile updated successfully:', data);
      setUserProfile(data);
      return data;
      
    } catch (error) {
      console.error('Profile update failed:', error);
      
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        throw new Error('Cannot connect to database. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      console.log('Sending password reset for:', email);
      
      const { error } = await supabase?.auth?.resetPasswordForEmail(email?.trim(), {
        redirectTo: `${window.location?.origin}/reset-password`
      });

      if (error) {
        console.error('Password reset error:', error);
        throw new Error(handleAuthError(error, 'Password reset'));
      }
      
      console.log('Password reset email sent successfully');
      return { error: null };
      
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

  // Resend confirmation email function
  const resendConfirmation = async (email) => {
    try {
      console.log('Resending confirmation email for:', email);
      
      const { error } = await supabase?.auth?.resend({
        type: 'signup',
        email: email?.trim(),
        options: {
          emailRedirectTo: `${window.location?.origin}/user-authentication`
        }
      });

      if (error) {
        console.error('Resend confirmation error:', error);
        throw new Error(handleAuthError(error, 'Resend confirmation'));
      }
      
      console.log('Confirmation email resent successfully');
      return { error: null };
      
    } catch (error) {
      console.error('Resend confirmation failed:', error);
      throw error;
    }
  };

  // Helper functions
  const getUserDisplayName = () => {
    if (userProfile?.full_name) return userProfile?.full_name;
    if (user?.user_metadata?.full_name) return user?.user_metadata?.full_name;
    if (user?.user_metadata?.name) return user?.user_metadata?.name;
    if (user?.email) {
      const emailName = user?.email?.split('@')?.[0];
      return emailName?.charAt(0)?.toUpperCase() + emailName?.slice(1);
    }
    return initialized ? 'User' : 'Loading...';
  };

  const getUserEmail = () => {
    return user?.email || userProfile?.email || 'user@example.com';
  };

  const getUserRole = () => {
    if (userProfile?.role) {
      return userProfile?.role?.replace('_', ' ')?.split(' ')?.map(word => 
        word?.charAt(0)?.toUpperCase() + word?.slice(1)
      )?.join(' ');
    }
    return 'Business Owner';
  };

  // Context value
  const value = {
    // State
    user,
    userProfile,
    loading: loading && !initialized,
    initialized,
    
    // Authentication functions
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    resendConfirmation,
    
    // Helper functions
    getUserDisplayName,
    getUserEmail,
    getUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
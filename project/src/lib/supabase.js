import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: {
      getItem: (key) => {
        try {
          const item = localStorage.getItem(key);
          // Enhanced corruption detection
          if (!item || 
              item === 'undefined' || 
              item === 'null'|| item?.includes('"undefined"') ||
              item?.startsWith('undefined')) {
            console.warn(`Detected corrupted auth data for key: ${key}, removing`);
            localStorage.removeItem(key);
            return null;
          }
          
          // Try to parse JSON to ensure it's valid
          if (item?.startsWith('{') || item?.startsWith('[')) {
            try {
              JSON.parse(item);
            } catch (parseError) {
              console.warn(`Invalid JSON in storage for key: ${key}, removing`);
              localStorage.removeItem(key);
              return null;
            }
          }
          
          return item;
        } catch (error) {
          console.warn(`Storage access error for key ${key}:`, error);
          // If we can't access storage, try to remove the problematic key
          try {
            localStorage.removeItem(key);
          } catch (removeError) {
            console.warn(`Failed to remove problematic key ${key}:`, removeError);
          }
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          // Enhanced validation
          if (value === undefined || 
              value === null || 
              value === 'undefined' || 
              value === 'null' || 
              value === '') {
            console.warn(`Refusing to store invalid value for key ${key}:`, value);
            return;
          }
          
          // Test storage availability
          const testKey = `__storage_test_${Date.now()}`;
          localStorage.setItem(testKey, 'test');
          localStorage.removeItem(testKey);
          
          // Store the value
          localStorage.setItem(key, value);
        } catch (error) {
          console.warn(`Storage write error for key ${key}:`, error);
          
          // If storage is full, try to clear some auth data and retry
          if (error?.name === 'QuotaExceededError') {
            console.log('Storage quota exceeded, clearing old auth data');
            try {
              const keys = Object.keys(localStorage);
              const oldAuthKeys = keys?.filter(k => 
                k?.startsWith('supabase.') && 
                k?.includes('expired')
              );
              oldAuthKeys?.forEach(k => localStorage.removeItem(k));
              
              // Retry storage
              localStorage.setItem(key, value);
            } catch (retryError) {
              console.error('Failed to store auth data even after cleanup:', retryError);
            }
          }
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Storage removal error for key ${key}:`, error);
        }
      }
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'database-reactivation-saas@1.0.0'
    }
  }
});

// Enhanced auth state monitoring with better error recovery
supabase?.auth?.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event, 'Session ID:', session?.user?.id || 'None');
  
  switch (event) {
    case 'INITIAL_SESSION': console.log('Initial session established');
      break;
      
    case 'SIGNED_IN': console.log('User signed in successfully');
      break;
      
    case 'SIGNED_OUT': console.log('User signed out, performing storage cleanup');
      try {
        const keys = Object.keys(localStorage);
        const authKeys = keys?.filter(key => 
          key?.startsWith('supabase.') || 
          key?.startsWith('sb-')
        );
        
        // Only remove clearly auth-related keys to avoid affecting other app data
        const safeToRemove = authKeys?.filter(key =>
          key?.includes('auth') ||
          key?.includes('token') ||
          key?.includes('session') ||
          key?.includes('user')
        );
        
        safeToRemove?.forEach(key => {
          try {
            localStorage.removeItem(key);
          } catch (removeError) {
            console.warn(`Could not remove key ${key}:`, removeError);
          }
        });
        
        console.log(`Cleaned up ${safeToRemove?.length || 0} auth storage items`);
      } catch (error) {
        console.warn('Error during post-signout cleanup:', error);
      }
      break;
      
    case 'TOKEN_REFRESHED': console.log('Token refreshed successfully');
      break;
      
    case 'USER_UPDATED': console.log('User data updated');
      break;
      
    case 'PASSWORD_RECOVERY': console.log('Password recovery initiated');
      break;
      
    default:
      console.log('Unknown auth event:', event);
  }
});

// Global error handler for unhandled promise rejections related to auth
window.addEventListener('unhandledrejection', (event) => {
  if (event?.reason?.message?.includes('supabase') ||
      event?.reason?.message?.includes('auth') ||
      event?.reason?.message?.includes('token')) {
    console.warn('Unhandled auth-related promise rejection:', event?.reason);
    
    // Prevent the error from causing app crashes
    event?.preventDefault();
    
    // If it's a token error, clear potentially corrupted storage
    if (event?.reason?.message?.includes('token') || 
        event?.reason?.message?.includes('refresh')) {
      console.log('Clearing potentially corrupted auth storage due to unhandled rejection');
      try {
        const keys = Object.keys(localStorage);
        const problemKeys = keys?.filter(key => 
          key?.startsWith('supabase.auth.') && 
          (key?.includes('token') || key?.includes('session'))
        );
        problemKeys?.forEach(key => localStorage.removeItem(key));
      } catch (cleanupError) {
        console.warn('Error cleaning up after unhandled rejection:', cleanupError);
      }
    }
  }
});
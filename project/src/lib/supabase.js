import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

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
            item === 'null' || item?.includes('"undefined"') ||
            item?.startsWith('undefined')) {
            logger.warn(`Detected corrupted auth data for key: ${key}, removing`);
            localStorage.removeItem(key);
            return null;
          }

          // Try to parse JSON to ensure it's valid
          if (item?.startsWith('{') || item?.startsWith('[')) {
            try {
              JSON.parse(item);
            } catch (parseError) {
              logger.warn(`Invalid JSON in storage for key: ${key}, removing`);
              localStorage.removeItem(key);
              return null;
            }
          }

          return item;
        } catch (error) {
          logger.warn(`Storage access error for key ${key}:`, error);
          // If we can't access storage, try to remove the problematic key
          try {
            localStorage.removeItem(key);
          } catch (removeError) {
            logger.warn(`Failed to remove problematic key ${key}:`, removeError);
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
            logger.warn(`Refusing to store invalid value for key ${key}:`, value);
            return;
          }

          // Test storage availability
          const testKey = `__storage_test_${Date.now()}`;
          localStorage.setItem(testKey, 'test');
          localStorage.removeItem(testKey);

          // Store the value
          localStorage.setItem(key, value);
        } catch (error) {
          logger.warn(`Storage write error for key ${key}:`, error);

          // If storage is full, try to clear some auth data and retry
          if (error?.name === 'QuotaExceededError') {
            logger.info('Storage quota exceeded, clearing old auth data');
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
              logger.error('Failed to store auth data even after cleanup:', retryError);
            }
          }
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          logger.warn(`Storage removal error for key ${key}:`, error);
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
  logger.debug('Supabase auth event:', event, { userId: session?.user?.id || 'None' });

  switch (event) {
    case 'INITIAL_SESSION':
      logger.info('Initial session established');
      break;

    case 'SIGNED_IN':
      logger.info('User signed in successfully');
      break;

    case 'SIGNED_OUT':
      logger.info('User signed out, performing storage cleanup');
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
            logger.warn(`Could not remove key ${key}:`, removeError);
          }
        });

        logger.info(`Cleaned up ${safeToRemove?.length || 0} auth storage items`);
      } catch (error) {
        logger.warn('Error during post-signout cleanup:', error);
      }
      break;

    case 'TOKEN_REFRESHED':
      logger.info('Token refreshed successfully');
      break;

    case 'USER_UPDATED':
      logger.info('User data updated');
      break;

    case 'PASSWORD_RECOVERY':
      logger.info('Password recovery initiated');
      break;

    default:
      logger.debug('Unknown auth event:', event);
  }
});

// Global error handler for unhandled promise rejections related to auth
window.addEventListener('unhandledrejection', (event) => {
  if (event?.reason?.message?.includes('supabase') ||
    event?.reason?.message?.includes('auth') ||
    event?.reason?.message?.includes('token')) {
    logger.warn('Unhandled auth-related promise rejection:', event?.reason);

    // Prevent the error from causing app crashes
    event?.preventDefault();

    // If it's a token error, clear potentially corrupted storage
    if (event?.reason?.message?.includes('token') ||
      event?.reason?.message?.includes('refresh')) {
      logger.info('Clearing potentially corrupted auth storage due to unhandled rejection');
      try {
        const keys = Object.keys(localStorage);
        const problemKeys = keys?.filter(key =>
          key?.startsWith('supabase.auth.') &&
          (key?.includes('token') || key?.includes('session'))
        );
        problemKeys?.forEach(key => localStorage.removeItem(key));
      } catch (cleanupError) {
        logger.warn('Error cleaning up after unhandled rejection:', cleanupError);
      }
    }
  }
});
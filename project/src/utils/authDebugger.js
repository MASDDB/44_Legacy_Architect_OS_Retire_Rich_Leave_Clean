/**
 * Authentication Debugger Utility
 * Provides comprehensive auth debugging and cleanup functions
 */

import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';

export const AuthDebugger = {

  /**
   * Clean all corrupted authentication data from storage
   */
  cleanCorruptedAuthData: () => {
    const results = {
      localStorage: [],
      sessionStorage: [],
      totalCleaned: 0
    };

    try {
      // Clean localStorage
      const localKeys = Object.keys(localStorage);
      const corruptedLocalKeys = localKeys?.filter(key => {
        if (!key?.startsWith('supabase') && !key?.startsWith('sb-')) return false;

        try {
          const value = localStorage.getItem(key);
          return (
            value === 'undefined' ||
            value === null ||
            value === 'null' ||
            value === '' || (key?.includes('token') && (!value || value?.length < 10)) ||
            (value?.includes && value?.includes('undefined'))
          );
        } catch {
          return true; // If we can't parse it, it's corrupted
        }
      });

      corruptedLocalKeys?.forEach(key => {
        localStorage.removeItem(key);
        results?.localStorage?.push(key);
        logger.warn(`🧹 Cleaned corrupted localStorage key: ${key}`);
      });

      // Clean sessionStorage
      const sessionKeys = Object.keys(sessionStorage);
      const corruptedSessionKeys = sessionKeys?.filter(key => {
        if (!key?.startsWith('supabase') && !key?.startsWith('sb-')) return false;

        try {
          const value = sessionStorage.getItem(key);
          return (
            value === 'undefined' ||
            value === null ||
            value === 'null' ||
            value === '' || (value?.includes && value?.includes('undefined'))
          );
        } catch {
          return true;
        }
      });

      corruptedSessionKeys?.forEach(key => {
        sessionStorage.removeItem(key);
        results?.sessionStorage?.push(key);
        logger.warn(`🧹 Cleaned corrupted sessionStorage key: ${key}`);
      });

      results.totalCleaned = results?.localStorage?.length + results?.sessionStorage?.length;

      if (results?.totalCleaned > 0) {
        logger.info(`✅ Cleaned ${results?.totalCleaned} corrupted auth keys`, results);
      }

      return results;

    } catch (error) {
      logger.error('❌ Error cleaning corrupted auth data:', error);
      return { error: error?.message, totalCleaned: 0 };
    }
  },

  /**
   * Perform nuclear cleanup of all auth data
   */
  nuclearAuthCleanup: () => {
    try {
      logger.info('☢️ Performing nuclear auth cleanup...');

      // Get all keys before clearing
      const localKeys = Object.keys(localStorage);
      const sessionKeys = Object.keys(sessionStorage);

      const authLocalKeys = localKeys?.filter(key =>
        key?.startsWith('supabase') ||
        key?.startsWith('sb-') ||
        key?.includes('auth') ||
        key?.includes('token')
      );

      const authSessionKeys = sessionKeys?.filter(key =>
        key?.startsWith('supabase') ||
        key?.startsWith('sb-')
      );

      // Clear all auth-related keys
      [...authLocalKeys, ...authSessionKeys]?.forEach(key => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        } catch (error) {
          logger.warn(`Failed to remove key ${key}:`, error);
        }
      });

      logger.info(`☢️ Nuclear cleanup completed. Removed ${authLocalKeys?.length + authSessionKeys?.length} auth keys`);

      return {
        success: true,
        removedKeys: [...authLocalKeys, ...authSessionKeys],
        totalRemoved: authLocalKeys?.length + authSessionKeys?.length
      };

    } catch (error) {
      logger.error('❌ Nuclear cleanup failed:', error);

      // Last resort: clear everything
      try {
        localStorage.clear();
        sessionStorage.clear();
        logger.info('☢️ Emergency: Cleared all storage');
        return { success: true, emergency: true };
      } catch (emergencyError) {
        logger.error('❌ Emergency cleanup failed:', emergencyError);
        return { success: false, error: emergencyError?.message };
      }
    }
  },

  /**
   * Check demo user authentication status
   */
  checkDemoUserStatus: async () => {
    try {
      logger.debug('🔍 Checking demo user authentication status...');

      const { data, error } = await supabase
        ?.rpc('get_demo_auth_status');

      if (error) {
        logger.error('❌ Failed to check demo user status:', error);
        return { error: error?.message };
      }

      logger.debug('📋 Demo user status:', data);
      return { data, success: true };

    } catch (error) {
      logger.error('❌ Error checking demo user status:', error);
      return { error: error?.message };
    }
  },

  /**
   * Verify demo login credentials
   */
  verifyDemoCredentials: async (email = 'admin@crm-demo.com') => {
    try {
      logger.debug(`🔐 Verifying demo credentials for: ${email}`);

      const { data, error } = await supabase
        ?.rpc('verify_demo_credentials', { demo_email: email });

      if (error) {
        logger.error('❌ Failed to verify demo credentials:', error);
        return { error: error?.message };
      }

      const result = data?.[0];
      logger.debug(`🔐 Demo credentials verification for ${email}:`, result);

      return {
        data: result,
        success: true,
        ready: result?.ready_to_login || false
      };

    } catch (error) {
      logger.error('❌ Error verifying demo credentials:', error);
      return { error: error?.message };
    }
  },

  /**
   * Full authentication health check
   */
  authHealthCheck: async () => {
    logger.info('🏥 Starting comprehensive auth health check...');

    const results = {
      timestamp: new Date()?.toISOString(),
      storageCleanup: null,
      sessionCheck: null,
      demoUserCheck: null,
      recommendations: []
    };

    try {
      // 1. Clean corrupted storage
      results.storageCleanup = AuthDebugger?.cleanCorruptedAuthData();
      if (results?.storageCleanup?.totalCleaned > 0) {
        results?.recommendations?.push('Corrupted auth data was found and cleaned');
      }

      // 2. Check current session
      try {
        const { data: { session }, error } = await supabase?.auth?.getSession();
        results.sessionCheck = {
          hasSession: !!session,
          userId: session?.user?.id || null,
          email: session?.user?.email || null,
          error: error?.message || null
        };

        if (error) {
          results?.recommendations?.push(`Session error: ${error?.message}`);
        }
      } catch (sessionError) {
        results.sessionCheck = { error: sessionError?.message };
        results?.recommendations?.push('Session retrieval failed - consider nuclear cleanup');
      }

      // 3. Check demo users
      results.demoUserCheck = await AuthDebugger?.checkDemoUserStatus();
      if (results?.demoUserCheck?.error) {
        results?.recommendations?.push('Demo user check failed - database connection issues');
      } else {
        const readyUsers = results?.demoUserCheck?.data?.filter(user => user?.can_login) || [];
        if (readyUsers?.length === 0) {
          results?.recommendations?.push('No demo users are ready for login - run migration');
        } else if (readyUsers?.length < 2) {
          results?.recommendations?.push('Some demo users need setup - run migration');
        }
      }

      // 4. Generate recommendations
      if (results?.recommendations?.length === 0) {
        results?.recommendations?.push('Auth system appears healthy');
      }

      logger.info('🏥 Auth health check completed:', results);
      return results;

    } catch (error) {
      logger.error('❌ Auth health check failed:', error);
      results.error = error?.message;
      results?.recommendations?.push('Health check failed - consider nuclear cleanup and refresh');
      return results;
    }
  },

  /**
   * Emergency auth recovery
   */
  emergencyRecovery: async () => {
    logger.info('🚑 Starting emergency auth recovery...');

    try {
      // Step 1: Nuclear cleanup
      const cleanup = AuthDebugger?.nuclearAuthCleanup();
      logger.info('🚑 Step 1: Nuclear cleanup completed');

      // Step 2: Wait for cleanup to settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Force refresh auth state
      try {
        await supabase?.auth?.refreshSession();
        logger.info('🚑 Step 2: Auth refresh attempted');
      } catch (refreshError) {
        logger.warn('🚑 Auth refresh failed (expected):', refreshError);
      }

      // Step 4: Check if we can establish a clean session
      try {
        const { data: { session }, error } = await supabase?.auth?.getSession();
        logger.debug('🚑 Step 3: Clean session check:', {
          hasSession: !!session,
          error: error?.message
        });
      } catch (sessionError) {
        logger.debug('🚑 Step 3: Session check failed (expected after cleanup)');
      }

      logger.info('🚑 Emergency recovery completed - page refresh recommended');

      return {
        success: true,
        cleanup,
        recommendation: 'Please refresh the page for clean auth state'
      };

    } catch (error) {
      logger.error('❌ Emergency recovery failed:', error);
      return {
        success: false,
        error: error?.message,
        recommendation: 'Manual page refresh required'
      };
    }
  }
};

// Export for console debugging
if (typeof window !== 'undefined') {
  window.AuthDebugger = AuthDebugger;
  logger.info('🔧 AuthDebugger available in console as window.AuthDebugger');
}

export default AuthDebugger;
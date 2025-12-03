import { supabase } from '../lib/supabase';

/**
 * Enhanced demo user verification and setup utilities
 * Provides comprehensive status checking and error handling for demo authentication
 */

// Demo user credentials - centralized for consistency
export const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@crm-demo.com',
    password: 'demo123456',
    role: 'admin',
    displayName: 'CRM Admin'
  },
  sales: {
    email: 'sales@crm-demo.com',
    password: 'demo123456',
    role: 'sales_rep',
    displayName: 'Sales Representative'
  }
};

/**
 * Check if demo users are properly configured in the database
 */
export const checkDemoUserStatus = async () => {
  try {
    console.log('Checking demo user authentication status...');
    
    const { data, error } = await supabase?.rpc('get_demo_auth_status');
    
    if (error) {
      console.error('Error checking demo status:', error);
      return {
        success: false,
        error: error?.message,
        users: []
      };
    }
    
    const statusReport = {
      success: true,
      users: data || [],
      allReady: data?.every(user => user?.status === 'READY') || false,
      issues: data?.filter(user => user?.status !== 'READY') || []
    };
    
    console.log('Demo user status check completed:', statusReport);
    
    return statusReport;
    
  } catch (error) {
    console.error('Exception in demo status check:', error);
    return {
      success: false,
      error: error?.message,
      users: []
    };
  }
};

/**
 * Verify demo login setup and get detailed information
 */
export const verifyDemoLoginSetup = async () => {
  try {
    console.log('Verifying demo login setup...');
    
    const { data, error } = await supabase?.rpc('verify_demo_login_setup');
    
    if (error) {
      console.error('Error verifying demo login:', error);
      return {
        success: false,
        error: error?.message,
        loginInfo: []
      };
    }
    
    const verification = {
      success: true,
      loginInfo: data || [],
      readyToLogin: data?.filter(user => user?.can_authenticate) || [],
      needsSetup: data?.filter(user => !user?.can_authenticate) || []
    };
    
    console.log('Demo login verification completed:', verification);
    
    return verification;
    
  } catch (error) {
    console.error('Exception in demo login verification:', error);
    return {
      success: false,
      error: error?.message,
      loginInfo: []
    };
  }
};

/**
 * Test demo user authentication without affecting app state
 */
export const testDemoAuth = async (email = DEMO_CREDENTIALS?.admin?.email, password = DEMO_CREDENTIALS?.admin?.password) => {
  try {
    console.log('Testing demo authentication for:', email);
    
    // Create a temporary client for testing
    const { data, error } = await supabase?.auth?.signInWithPassword({
      email: email?.trim(),
      password
    });
    
    if (error) {
      console.error('Demo auth test failed:', error);
      return {
        success: false,
        error: error?.message,
        errorCode: error?.status || 'unknown'
      };
    }
    
    // Sign out immediately after test
    await supabase?.auth?.signOut();
    
    console.log('Demo auth test passed for:', email);
    
    return {
      success: true,
      user: data?.user,
      message: 'Demo authentication working correctly'
    };
    
  } catch (error) {
    console.error('Exception in demo auth test:', error);
    return {
      success: false,
      error: error?.message,
      errorCode: 'exception'
    };
  }
};

/**
 * Get demo user information for display in UI
 */
export const getDemoUserInfo = () => {
  return Object.values(DEMO_CREDENTIALS)?.map(user => ({
    email: user?.email,
    password: user?.password,
    role: user?.role,
    displayName: user?.displayName,
    description: user?.role === 'admin' ?'Full CRM system access' :'Standard user access'
  }));
};

/**
 * Comprehensive demo system diagnosis
 */
export const diagnoseDemoSystem = async () => {
  try {
    console.log('Running comprehensive demo system diagnosis...');
    
    const [statusCheck, loginVerification, authTest] = await Promise.all([
      checkDemoUserStatus(),
      verifyDemoLoginSetup(),
      testDemoAuth()
    ]);
    
    const diagnosis = {
      timestamp: new Date()?.toISOString(),
      overall: {
        healthy: statusCheck?.success && loginVerification?.success && authTest?.success,
        issues: []
      },
      database: {
        status: statusCheck?.success ? 'OK' : 'ERROR',
        details: statusCheck,
        issues: statusCheck?.issues || []
      },
      authentication: {
        status: authTest?.success ? 'OK' : 'ERROR',
        details: authTest,
        canLogin: authTest?.success
      },
      verification: {
        status: loginVerification?.success ? 'OK' : 'ERROR',
        details: loginVerification,
        readyUsers: loginVerification?.readyToLogin?.length || 0
      },
      recommendations: []
    };
    
    // Generate recommendations based on diagnosis
    if (!diagnosis?.database?.status === 'OK') {
      diagnosis?.recommendations?.push('Run database migration to fix demo user setup');
    }
    
    if (!diagnosis?.authentication?.canLogin) {
      diagnosis?.recommendations?.push('Demo authentication is failing - check auth.users table');
    }
    
    if (diagnosis?.verification?.readyUsers === 0) {
      diagnosis?.recommendations?.push('No demo users are ready for login - verify migration completion');
    }
    
    if (diagnosis?.overall?.healthy) {
      diagnosis?.recommendations?.push('Demo system is healthy and ready for use');
    } else {
      diagnosis?.recommendations?.push('Demo system needs attention - check individual components');
    }
    
    console.log('Demo system diagnosis completed:', diagnosis);
    
    return diagnosis;
    
  } catch (error) {
    console.error('Exception in demo system diagnosis:', error);
    return {
      timestamp: new Date()?.toISOString(),
      overall: {
        healthy: false,
        issues: [error?.message]
      },
      error: error?.message,
      recommendations: ['Contact system administrator to resolve demo setup issues']
    };
  }
};

/**
 * Enhanced error handler with specific guidance for demo login issues
 */
export const handleDemoLoginError = (error, email) => {
  const errorMessage = error?.message || '';
  
  const guidance = {
    title: '🔧 Demo Login Troubleshooting',
    details: '',
    solutions: [],
    technical: {
      error: errorMessage,
      email: email,
      timestamp: new Date()?.toISOString()
    }
  };
  
  if (errorMessage?.includes('Invalid login credentials') || errorMessage?.includes('Invalid email or password')) {
    guidance.details = 'The demo user credentials are not working as expected.';
    guidance.solutions = [
      'Verify the database migration completed successfully',
      'Check that auth.users records exist for demo users',
      'Ensure password hashing is correct (bcrypt with salt)',
      'Try creating a new account as alternative'
    ];
  } else if (errorMessage?.includes('Email not confirmed')) {
    guidance.details = 'Demo account exists but email is not confirmed.';
    guidance.solutions = [
      'Demo accounts should be pre-confirmed',
      'Check email_confirmed_at field in auth.users',
      'Contact administrator to resolve confirmation status',
      'Use sign-up form to create new confirmed account'
    ];
  } else if (errorMessage?.includes('Failed to fetch') || errorMessage?.includes('NetworkError')) {
    guidance.details = 'Network connection issue preventing authentication.';
    guidance.solutions = [
      'Check internet connection',
      'Verify Supabase project is active and accessible',
      'Check browser network tab for specific errors',
      'Try refreshing page and retrying'
    ];
  } else {
    guidance.details = 'Unexpected authentication error occurred.';
    guidance.solutions = [
      'Check browser console for additional error details',
      'Verify Supabase configuration is correct',
      'Try creating new account for immediate access',
      'Contact administrator if problem persists'
    ];
  }
  
  return guidance;
};

// Export demo credentials for use in components
export { DEMO_CREDENTIALS as demoCredentials };

// Export all functions as default for convenience
export default {
  checkDemoUserStatus,
  verifyDemoLoginSetup,
  testDemoAuth,
  getDemoUserInfo,
  diagnoseDemoSystem,
  handleDemoLoginError,
  DEMO_CREDENTIALS
};
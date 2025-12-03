import { supabase } from '../lib/supabase';

/**
 * Admin service for super admin operations
 */
export const adminService = {
  /**
   * Log out all users from the system (super admin only)
   * @returns {Promise<Object>} Result object with success status and message
   */
  async logoutAllUsers() {
    try {
      const { data, error } = await supabase?.rpc('logout_all_users');
      
      if (error) {
        throw new Error(error?.message || 'Failed to logout all users');
      }
      
      if (!data?.success) {
        throw new Error(data?.message || 'Operation failed');
      }
      
      return {
        success: true,
        message: data?.message,
        affectedSessions: data?.affected_sessions,
        timestamp: data?.timestamp
      };
    } catch (error) {
      console.error('Error logging out all users:', error);
      throw {
        success: false,
        message: error?.message || 'Failed to logout all users'
      };
    }
  },

  /**
   * Get count of active user sessions (super admin only)
   * @returns {Promise<Object>} Session count data
   */
  async getActiveSessionsCount() {
    try {
      const { data, error } = await supabase?.rpc('get_active_sessions_count');
      
      if (error) {
        throw new Error(error?.message || 'Failed to get session count');
      }
      
      if (!data?.success) {
        throw new Error(data?.message || 'Operation failed');
      }
      
      return {
        success: true,
        activeSessions: data?.active_sessions,
        totalUsers: data?.total_users,
        timestamp: data?.timestamp
      };
    } catch (error) {
      console.error('Error getting active sessions:', error);
      throw {
        success: false,
        message: error?.message || 'Failed to get session count'
      };
    }
  },

  /**
   * Check if current user has super admin privileges
   * @param {Object} userProfile - User profile object from auth context
   * @returns {boolean} True if user is super admin
   */
  isSuperAdmin(userProfile) {
    return userProfile?.role === 'super_admin';
  },

  /**
   * Get super admin users list
   * @returns {Promise<Object>} List of super admin users
   */
  async getSuperAdminUsers() {
    try {
      const { data, error } = await supabase?.rpc('list_super_admin_users');
      
      if (error) {
        throw new Error(error?.message || 'Failed to get super admin users');
      }
      
      return {
        success: true,
        users: data || []
      };
    } catch (error) {
      console.error('Error getting super admin users:', error);
      throw {
        success: false,
        message: error?.message || 'Failed to get super admin users'
      };
    }
  }
};

export default adminService;
# Supabase Security Fixes - Manual Steps Required

This document outlines the remaining security warnings and how to address them.

## ✅ Fixed via Migrations

### 1. RLS Auth Performance (49 policies) - FIXED
**Migration:** `20251205231705_fix_rrlc_rls_auth_performance.sql`
- Updated all RRLC table RLS policies to use `(select auth.uid())`
- Prevents re-evaluation of auth functions for each row

### 2. Function Search Path Security - FIXED
**Migration:** `20251205232338_fix_function_search_path_security.sql`
- Added `SET search_path = ''` to `update_rrlc_updated_at_column` function
- Prevents search_path manipulation attacks

---

## ⚠️ Manual Configuration Required (Supabase Dashboard)

The following security issues cannot be fixed via SQL migrations and require manual configuration in your Supabase dashboard.

### 3. Leaked Password Protection - MANUAL ACTION REQUIRED

**Issue:** Leaked password protection is currently disabled.

**How to Fix:**
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Policies** (or **Settings**)
3. Find **Password Security** settings
4. Enable **"Check passwords against HaveIBeenPwned database"**
5. This will prevent users from using compromised passwords

**Documentation:** https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

**Security Impact:** 
- Protects against users choosing passwords that have been exposed in data breaches
- Automatically checks against HaveIBeenPwned.org database
- Recommended for production environments

---

### 4. Postgres Version Upgrade - MANUAL ACTION REQUIRED

**Issue:** Current Postgres version `supabase-postgres-17.4.1.075` has security patches available.

**How to Fix:**
1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **Infrastructure** (or **Database**)
3. Look for **Postgres Version** or **Upgrade** section
4. Follow the upgrade wizard to update to the latest patched version
5. **IMPORTANT:** Schedule this during a maintenance window
6. **IMPORTANT:** Test in a staging environment first if possible

**Documentation:** https://supabase.com/docs/guides/platform/upgrading

**Security Impact:**
- Applies critical security patches
- Fixes known vulnerabilities in PostgreSQL
- Should be done regularly to maintain security posture

**Upgrade Checklist:**
- [ ] Review release notes for breaking changes
- [ ] Backup your database before upgrading
- [ ] Schedule during low-traffic period
- [ ] Test in staging environment first (if available)
- [ ] Monitor application after upgrade
- [ ] Verify all migrations still work

---

## Summary

| Issue | Status | Action Required |
|-------|--------|-----------------|
| RLS Auth Performance (49 policies) | ✅ Fixed | Apply migration |
| Function Search Path Security | ✅ Fixed | Apply migration |
| Leaked Password Protection | ⚠️ Manual | Enable in dashboard |
| Postgres Version Upgrade | ⚠️ Manual | Upgrade via dashboard |

## Next Steps

1. **Apply SQL Migrations:**
   ```bash
   # If using Supabase CLI
   supabase db push
   
   # Or apply manually via SQL Editor in Supabase Dashboard
   ```

2. **Enable Leaked Password Protection:**
   - Go to Authentication settings
   - Enable HaveIBeenPwned integration

3. **Schedule Postgres Upgrade:**
   - Review upgrade documentation
   - Plan maintenance window
   - Perform upgrade during low-traffic period

All SQL-based security fixes have been implemented. The remaining items require dashboard configuration.

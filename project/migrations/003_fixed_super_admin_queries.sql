-- CORRECTED Super Admin Promotion Script
-- This fixes the "relation public.users does not exist" error
-- The correct table name is "user_profiles", NOT "users"

-- Method 1: Direct UPDATE (Replace YOUR_EMAIL_HERE with your actual email)
UPDATE public.user_profiles SET role = 'super_admin'::public.user_role
WHERE email = 'YOUR_EMAIL_HERE@example.com' AND is_active = true;

-- Method 2: Using the helper function (Recommended - safer)
-- SELECT promote_user_to_super_admin('YOUR_EMAIL_HERE@example.com');

-- Verify the update worked - CORRECTED query
SELECT id, email, full_name, role, is_active, created_at 
FROM public.user_profiles 
WHERE role = 'super_admin';

-- Alternative verification using the helper function
-- SELECT * FROM list_super_admin_users();

-- =====================================
-- IMPORTANT NOTES:
-- =====================================
-- 1. The table name is "user_profiles", NOT "users"
-- 2. Always cast the role: 'super_admin'::public.user_role
-- 3. Replace 'YOUR_EMAIL_HERE@example.com' with your actual email
-- 4. Ensure the user exists in user_profiles before running the update
-- 5. The user must be active (is_active = true) for the update to work
-- Guard: ensure the enum value exists (defensive)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Enum value super_admin does not exist on type user_role. Run Phase A first.';
  END IF;
END
$$;

-- OPTIONAL: set a default on users.role (adjust if your table/column differ)
-- Comment out if you don't want a default.
ALTER TABLE public.user_profiles
  ALTER COLUMN role SET DEFAULT 'user'::public.user_role;

-- Update target accounts to super_admin.
-- Replace the WHERE clause with your real criteria.
-- Examples below—pick ONE and comment out the others.

-- Example 1: by email whitelist
-- UPDATE public.user_profiles SET role = 'super_admin'
-- WHERE email IN ('founder@yourco.com','ops@yourco.com');

-- Example 2: by an is_owner flag
-- UPDATE public.user_profiles SET role = 'super_admin'
-- WHERE is_owner = true;

-- Example 3: by existing highest role
-- UPDATE public.user_profiles SET role = 'super_admin'
-- WHERE role = 'admin';

-- Example 4: by user IDs
-- UPDATE public.user_profiles SET role = 'super_admin'
-- WHERE id IN ('uuid-1','uuid-2');

-- Safety: verify resulting distribution (non-fatal)
-- SELECT role, count(*) FROM public.user_profiles GROUP BY role ORDER BY role;
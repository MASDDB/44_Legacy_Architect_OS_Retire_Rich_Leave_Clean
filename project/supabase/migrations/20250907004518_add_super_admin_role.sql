-- Step 1: Add super_admin to user_role enum
-- This must be done first and committed before using the new value
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'super_admin' AND enumtypid = 'public.user_role'::regtype) THEN
        ALTER TYPE public.user_role ADD VALUE 'super_admin';
    END IF;
END $$;

-- Step 2: Create index for super_admin role queries (if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_user_profiles_super_admin 
ON public.user_profiles (role) 
WHERE role = 'super_admin'::public.user_role;

-- Step 3: Drop existing policies if they exist, then recreate them
-- This ensures clean policy creation without conflicts

-- Drop existing super admin policies
DROP POLICY IF EXISTS "super_admin_full_access" ON public.user_profiles;
DROP POLICY IF EXISTS "super_admin_leads_access" ON public.leads;
DROP POLICY IF EXISTS "super_admin_campaigns_access" ON public.campaigns;
DROP POLICY IF EXISTS "super_admin_companies_access" ON public.companies;

-- Step 4: Create RLS policy for super admin full access to user_profiles
CREATE POLICY "super_admin_full_access" 
ON public.user_profiles
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role = 'super_admin'::public.user_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles  
        WHERE id = auth.uid() AND role = 'super_admin'::public.user_role
    )
);

-- Step 5: Create super admin policies for other critical tables
-- Leads table access
CREATE POLICY "super_admin_leads_access" 
ON public.leads
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role = 'super_admin'::public.user_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role = 'super_admin'::public.user_role
    )
);

-- Campaigns table access
CREATE POLICY "super_admin_campaigns_access" 
ON public.campaigns
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role = 'super_admin'::public.user_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role = 'super_admin'::public.user_role
    )
);

-- Companies table access
CREATE POLICY "super_admin_companies_access" 
ON public.companies
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role = 'super_admin'::public.user_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role = 'super_admin'::public.user_role
    )
);

-- Step 6: Insert or update super admin user
-- IMPORTANT: Replace the UUID and email with your actual auth.users UUID and email
-- You must create the auth user first via Supabase Auth Dashboard or sign up process
INSERT INTO public.user_profiles (
    id, 
    email, 
    full_name, 
    role, 
    is_active,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0000-000000000000', -- Replace with your actual auth.users UUID
    'admin@yourdomain.com',                  -- Replace with your email
    'Super Administrator',                   -- Replace with your name
    'super_admin'::public.user_role,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
    role = 'super_admin'::public.user_role,
    full_name = EXCLUDED.full_name,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

-- Step 7: Create a function to easily promote users to super_admin
CREATE OR REPLACE FUNCTION promote_to_super_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only allow existing super_admins to promote others
    IF NOT EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'super_admin'::public.user_role
    ) THEN
        RAISE EXCEPTION 'Only super administrators can promote users';
    END IF;
    
    -- Update the user role
    UPDATE public.user_profiles 
    SET role = 'super_admin'::public.user_role,
        updated_at = CURRENT_TIMESTAMP
    WHERE email = user_email AND is_active = true;
    
    -- Return success if user was found and updated
    RETURN FOUND;
END;
$$;

-- Step 8: Add comment for documentation
COMMENT ON FUNCTION promote_to_super_admin(TEXT) IS 
'Allows existing super_admin users to promote other users to super_admin role. Usage: SELECT promote_to_super_admin(''user@email.com'');';
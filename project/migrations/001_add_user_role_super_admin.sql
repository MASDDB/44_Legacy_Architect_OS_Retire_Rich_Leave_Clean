-- Add 'super_admin' enum value IF it does not exist already.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'super_admin'
  ) THEN
    EXECUTE 'ALTER TYPE public.user_role ADD VALUE ''super_admin''';
  END IF;
END
$$;
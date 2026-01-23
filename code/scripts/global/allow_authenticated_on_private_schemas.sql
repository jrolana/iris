-- 1. Allow logged-in users to "enter" the schema folder
GRANT USAGE ON SCHEMA private TO authenticated;

-- 2. Allow logged-in users to Read/Write all tables in that schema
-- (RLS policies will still filter specific rows, so this is safe)
GRANT ALL ON ALL TABLES IN SCHEMA private TO authenticated;

-- 3. Ensure they can use any auto-incrementing IDs (sequences) if you have them
GRANT ALL ON ALL SEQUENCES IN SCHEMA private TO authenticated;
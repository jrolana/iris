-- 1. Let the service_role enter the schema
GRANT USAGE ON SCHEMA private TO service_role;

-- 2. Let the service_role read/write to the tables inside it
GRANT ALL ON ALL TABLES IN SCHEMA private TO service_role;

-- 3. Let it use sequences (needed for creating new rows if you use serial IDs)
GRANT ALL ON ALL SEQUENCES IN SCHEMA private TO service_role;
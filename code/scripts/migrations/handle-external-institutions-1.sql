BEGIN;

-- Addition of columns
ALTER TABLE private.users
ADD COLUMN IF NOT EXISTS college_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS other_college_name TEXT,
ADD COLUMN IF NOT EXISTS external_institution TEXT;

ALTER TABLE private.inventors
ADD COLUMN IF NOT EXISTS college_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS other_college_name TEXT,
ADD COLUMN IF NOT EXISTS external_institution TEXT;

-- Foreign Keys
ALTER TABLE private.users
ADD CONSTRAINT fk_users_collegecode
FOREIGN KEY (college_code)
REFERENCES private.college_units (code);

ALTER TABLE private.inventors
ADD CONSTRAINT fk_inventor_collegecode
FOREIGN KEY (college_code)
REFERENCES private.college_units (code);

-- Update data

-- Only those that are not 'Other' will be copied
UPDATE private.users
SET college_code = college
WHERE college <> 'Other';

-- Since college will be removed and 'Other' isn't copied,
-- then college_code related with this will be null
UPDATE private.users
SET other_college_name = 'Unspecified'
WHERE college = 'Other';

UPDATE private.inventors
SET college_code = college
WHERE college <> 'Other';

UPDATE private.inventors
SET other_college_name = 'Unspecified'
WHERE college = 'Other';

COMMIT;
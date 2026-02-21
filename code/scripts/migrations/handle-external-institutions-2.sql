BEGIN;

ALTER TABLE private.users
DROP CONSTRAINT fk_users_college;

ALTER TABLE private.inventors
DROP CONSTRAINT fk_inventor_college;

ALTER TABLE private.users
DROP COLUMN college;

ALTER TABLE private.inventors
DROP COLUMN college;

ALTER TABLE private.users
ADD CONSTRAINT users_affiliation_check
CHECK (
    -- Internal user, dept is listed
    (
        college_code IS NOT NULL
        AND other_college_name IS NULL 
        AND external_institution IS NULL
    )
    OR
    -- Internal user, dept is not listed
    (
        college_code IS NULL
        AND other_college_name IS NOT NULL
        AND external_institution IS NULL
    )
    OR
    -- External user
    (
        college_code IS NULL
        AND other_college_name IS NULL
        AND external_institution IS NOT NULL
    )
);

ALTER TABLE private.inventors
ADD CONSTRAINT inventors_affiliation_check
CHECK (
    -- Internal user, dept is listed
    (
        college_code IS NOT NULL
        AND other_college_name IS NULL 
        AND external_institution IS NULL
    )
    OR
    -- Internal user, dept is not listed
    (
        college_code IS NULL
        AND other_college_name IS NOT NULL
        AND external_institution IS NULL
    )
    OR
    -- External user
    (
        college_code IS NULL
        AND other_college_name IS NULL
        AND external_institution IS NOT NULL
    )
);

COMMIT;

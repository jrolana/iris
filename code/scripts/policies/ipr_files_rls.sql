DROP POLICY IF EXISTS "Users can delete their own files" ON private.ipr_files;

CREATE POLICY "Users can delete their own files"
ON private.ipr_files
FOR DELETE
TO authenticated
USING (
  -- 1. The Owner (Uploader) can delete
  owner_id = auth.uid() 
  
  -- Optional: Uncomment when we want to allow admins to delete
  -- OR private.is_admin()
);

-- Users can view files if they are an Admin OR if they are listed as an inventor

DROP POLICY IF EXISTS "View files if admin or inventor" ON private.ipr_files;

CREATE POLICY "View files if admin or inventor"
ON private.ipr_files
FOR SELECT
TO authenticated
USING (
  private.is_admin()
  OR
  EXISTS (
    SELECT 1 FROM private.inventors AS inv
    WHERE inv.application_id = ipr_files.application_id
    AND inv.techgen_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can upload files to their applications" ON private.ipr_files;

CREATE POLICY "Users can upload files to their applications"
ON private.ipr_files
FOR INSERT
TO authenticated
WITH CHECK (
  owner_id = auth.uid()
  
  AND
  
  -- This prevents users from uploading files to random project IDs they don't own.
  EXISTS (
    SELECT 1 FROM private.inventors AS inv
    WHERE inv.application_id = ipr_files.application_id  -- Matches the new row's app ID
    AND inv.techgen_id = auth.uid()                      -- Checks if listed as inventor
  )
);

DROP POLICY IF EXISTS "Users can update their own file details" ON private.ipr_files;

CREATE POLICY "Users can update their own file details"
ON private.ipr_files
FOR UPDATE
TO authenticated
USING (
  owner_id = auth.uid()
)
WITH CHECK (
  -- Cannot accidentally change the owner to someone else
  owner_id = auth.uid()
);

DROP POLICY IF EXISTS "Admins can upload files" ON private.ipr_files;

CREATE POLICY "Admins can upload files"
ON private.ipr_files
FOR INSERT
TO authenticated
WITH CHECK (
  private.is_admin()
);
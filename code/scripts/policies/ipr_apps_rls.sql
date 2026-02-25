-- RESET POLICIES

-- Drop all existing policies on this table to avoid conflicts
DROP POLICY IF EXISTS "Admins see all, Inventors see their own" ON private.ipr_applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON private.ipr_applications;
DROP POLICY IF EXISTS "Admins and Owners can update" ON private.ipr_applications;
DROP POLICY IF EXISTS "Admins and Creators can delete" ON private.ipr_applications;


-- CREATE NEW POLICIES
-- SELECT: Admins, Creators, or Inventors can view
CREATE POLICY "Admins see all, Inventors see their own"
ON private.ipr_applications FOR SELECT
USING (
  private.is_admin() 
  OR created_by = auth.uid() 
  OR (auth.uid() IN (
      SELECT techgen_id FROM private.inventors 
      WHERE (
        application_id = ipr_applications.id OR
        application_id = private.ipr_applications.parent_application_id
      )
  ))
);

-- INSERT: Any logged-in user can create (must own the row)
CREATE POLICY "Users can insert their own applications"
ON private.ipr_applications FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' 
  AND created_by = auth.uid()
);

-- UPDATE: Admins, Creators, or Inventors can edit
CREATE POLICY "Admins and Owners can update"
ON private.ipr_applications FOR UPDATE
USING (
  private.is_admin() 
  OR created_by = auth.uid() 
  OR (auth.uid() IN (
      SELECT techgen_id FROM private.inventors 
      WHERE (
        application_id = ipr_applications.id OR
        application_id = private.ipr_applications.parent_application_id
      )
  ))
);

-- DELETE: Only Admins or the Original Creator can delete
CREATE POLICY "Admins and Creators can delete"
ON private.ipr_applications FOR DELETE
USING (
  private.is_admin() 
  OR created_by = auth.uid()
);
DROP TRIGGER IF EXISTS on_audit_ipr_files
ON private.ipr_files;

CREATE TRIGGER on_audit_ipr_files
AFTER INSERT OR UPDATE OR DELETE ON private.ipr_files
FOR EACH ROW
EXECUTE FUNCTION private.audit_ipr_files();

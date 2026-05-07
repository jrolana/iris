DROP TRIGGER IF EXISTS on_audit_ipr_applications
ON private.ipr_applications;

CREATE TRIGGER on_audit_ipr_applications
AFTER INSERT OR UPDATE OR DELETE ON private.ipr_applications
FOR EACH ROW
EXECUTE FUNCTION private.audit_ipr_applications();

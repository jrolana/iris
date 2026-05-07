DROP TRIGGER IF EXISTS on_audit_ipr_statuses
ON private.ipr_statuses;

CREATE TRIGGER on_audit_ipr_statuses
AFTER INSERT OR UPDATE ON private.ipr_statuses
FOR EACH ROW
EXECUTE FUNCTION private.audit_ipr_statuses();

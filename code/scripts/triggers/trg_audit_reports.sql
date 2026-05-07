DROP TRIGGER IF EXISTS trg_audit_reports
ON private.reports;

CREATE TRIGGER trg_audit_reports
AFTER INSERT OR UPDATE ON private.reports
FOR EACH ROW
EXECUTE FUNCTION private.audit_reports();

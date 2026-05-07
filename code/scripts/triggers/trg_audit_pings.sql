DROP TRIGGER IF EXISTS trg_audit_pings
ON private.pings;

CREATE TRIGGER trg_audit_pings
AFTER INSERT OR UPDATE ON private.pings
FOR EACH ROW
EXECUTE FUNCTION private.audit_pings();

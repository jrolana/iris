DROP TRIGGER IF EXISTS on_audit_inventors
ON private.inventors;

CREATE TRIGGER on_audit_inventors
AFTER INSERT OR UPDATE OR DELETE ON private.inventors
FOR EACH ROW
EXECUTE FUNCTION private.audit_inventors();

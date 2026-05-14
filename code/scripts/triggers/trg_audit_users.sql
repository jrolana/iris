DROP TRIGGER IF EXISTS on_audit_users
ON private.users;

CREATE TRIGGER on_audit_users
AFTER INSERT OR UPDATE ON private.users
FOR EACH ROW
EXECUTE FUNCTION private.audit_users();

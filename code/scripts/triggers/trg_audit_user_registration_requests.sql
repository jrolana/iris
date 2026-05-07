DROP TRIGGER IF EXISTS trg_audit_user_registration_requests
ON private.user_registration_requests;

CREATE TRIGGER trg_audit_user_registration_requests
AFTER INSERT OR UPDATE ON private.user_registration_requests
FOR EACH ROW
EXECUTE FUNCTION private.audit_user_registration_requests();

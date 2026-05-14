DROP TRIGGER IF EXISTS trg_audit_api_tokens
ON private.api_tokens;

CREATE TRIGGER trg_audit_api_tokens
AFTER INSERT ON private.api_tokens
FOR EACH ROW
EXECUTE FUNCTION private.audit_api_tokens();

CREATE TRIGGER audit_requirements_changes
AFTER INSERT OR UPDATE ON private.ipr_requirements
FOR EACH ROW
EXECUTE FUNCTION private.audit_ipr_requirements();
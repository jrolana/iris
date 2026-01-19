DROP TRIGGER IF EXISTS trg_update_ipr_application_from_status
ON private.ipr_statuses;

CREATE TRIGGER trg_update_ipr_application_from_status
AFTER INSERT OR UPDATE OR DELETE ON private.ipr_statuses
FOR EACH ROW
EXECUTE FUNCTION private.update_ipr_application_from_status();

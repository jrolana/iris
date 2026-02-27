DROP TRIGGER IF EXISTS on_add_status
ON private.ipr_applications;

CREATE TRIGGER on_add_status
AFTER INSERT ON private.ipr_statuses
FOR EACH ROW
EXECUTE FUNCTION private.update_curr_status();
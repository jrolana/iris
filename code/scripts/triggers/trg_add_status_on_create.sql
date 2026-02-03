DROP TRIGGER IF EXISTS trg_add_status_on_create 
ON private.ipr_applications;

CREATE TRIGGER trg_add_status_on_create
AFTER INSERT ON private.ipr_applications
FOR EACH ROW
EXECUTE FUNCTION private.add_status_on_create();
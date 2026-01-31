CREATE TRIGGER trg_notify_status_change
AFTER INSERT OR UPDATE ON private.ipr_statuses
FOR EACH ROW
EXECUTE FUNCTION private.notify_status_change()

CREATE TRIGGER trg_notify_ip_type_change
AFTER UPDATE ON private.ipr_applications
FOR EACH ROW
EXECUTE FUNCTION private.notify_ip_type_change()


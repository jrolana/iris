CREATE TRIGGER trg_notify_status_change
AFTER INSERT OR UPDATE ON private.ipr_statuses
FOR EACH ROW
EXECUTE FUNCTION private.notify_status_change()

DROP TRIGGER IF EXISTS trg_notify_ip_type_change ON private.ipr_applications;
CREATE TRIGGER trg_notify_application_detail_change
AFTER UPDATE ON private.ipr_applications
FOR EACH ROW
EXECUTE FUNCTION private.notify_application_detail_change()

CREATE TRIGGER trgy_notify_added_files
AFTER INSERT ON private.ipr_files
FOR EACH ROW
EXECUTE FUNCTION private.notify_added_files()

CREATE TRIGGER trgy_notify_deleted_files
AFTER DELETE ON private.ipr_files
FOR EACH ROW
EXECUTE FUNCTION private.notify_deleted_files()

CREATE TRIGGER trg_notify_withdraw_archive
AFTER UPDATE ON private.ipr_applications
FOR EACH ROW
EXECUTE FUNCTION private.notify_withdraw_archive()


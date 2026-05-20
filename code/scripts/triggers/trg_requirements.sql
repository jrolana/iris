CREATE TRIGGER on_requirement_change
AFTER INSERT OR UPDATE ON private.ipr_requirements
FOR EACH ROW
EXECUTE FUNCTION private.notify_requirements_update();
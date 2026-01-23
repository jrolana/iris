create trigger on_application_created
after insert on private.ipr_applications
for each row execute function private.add_creator_as_inventor();
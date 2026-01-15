[
  {
    "table_schema": "auth",
    "table_name": "users",
    "trigger_name": "on_auth_user_created",
    "trigger_sql": "CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user()"
  },
  {
    "table_schema": "realtime",
    "table_name": "subscription",
    "trigger_name": "tr_check_filters",
    "trigger_sql": "CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters()"
  },
  {
    "table_schema": "storage",
    "table_name": "buckets",
    "trigger_name": "enforce_bucket_name_length_trigger",
    "trigger_sql": "CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length()"
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "trigger_name": "objects_insert_create_prefix",
    "trigger_sql": "CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger()"
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "trigger_name": "objects_update_create_prefix",
    "trigger_sql": "CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (new.name <> old.name OR new.bucket_id <> old.bucket_id) EXECUTE FUNCTION storage.objects_update_prefix_trigger()"
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "trigger_name": "update_objects_updated_at",
    "trigger_sql": "CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column()"
  },
  {
    "table_schema": "storage",
    "table_name": "objects",
    "trigger_name": "objects_delete_delete_prefix",
    "trigger_sql": "CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger()"
  },
  {
    "table_schema": "storage",
    "table_name": "prefixes",
    "trigger_name": "prefixes_delete_hierarchy",
    "trigger_sql": "CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger()"
  },
  {
    "table_schema": "storage",
    "table_name": "prefixes",
    "trigger_name": "prefixes_create_hierarchy",
    "trigger_sql": "CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN (pg_trigger_depth() < 1) EXECUTE FUNCTION storage.prefixes_insert_trigger()"
  }
]
export type FileType = {
    id: string | null;
    application_id: string;
    owner_id: string;
    file_name: string;
    storage_path: string;
    description: string | null;
    file_type: string;
    uploaded_at: Date;
    comments: string | null;
}
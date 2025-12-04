import { AttachmentType } from "@/lib/types/application";

interface ViewAttachmentProps{
    attachments: AttachmentType[]
    isAdmin: boolean
    onAddAttachment?: () => void;
    onEditAttachment?: (id: string) => void;
    onDeleteAttachment?: (id: string) => void;
}

function ViewAttachments(props: ViewAttachmentProps){
    const { attachments, isAdmin, onAddAttachment, onEditAttachment, onDeleteAttachment } = props;
    if (attachments.length == 0){
        return <p className="mt-4 text-sm text-slate-500"> No attachments yet. </p>
    }

    return  <>
        <ul className="mt-3 divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {attachments.map((file) => (
                <li
                key={file.fileId}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between"
                >
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-md font-medium text-slate-900">
                        {file.filename}
                        </p>
                        {file.description && (
                        <p className="mt-0.5 line-clamp-2 text-sm leading-tight text-slate-600">
                            {file.description}
                        </p>
                        )}
                        <p className="mt-0.5 flex items-center gap-2 text-sm text-slate-400">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium uppercase text-slate-700">
                                {file.fileType}
                            </span>
                            <span>{new Date(file.uploadedAt).toLocaleString()}</span>
                        </p>
                    </div>
                    
                    {/* action buttons */}
                    <div className="flex shrink-0 flex-wrap gap-2 text-sm">
                        <button
                        type="button"
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 font-medium text-slate-600 hover:bg-slate-50"
                        >
                            View
                        </button>
                        {file.fileType !== "link" && (
                        <button
                            type="button"
                            className="rounded-md border border-slate-200 bg-white px-2 py-1 font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Download
                        </button>
                        )}
                        {isAdmin && (
                        <>
                            <button
                            type="button"
                            onClick={() => onEditAttachment?.(file.fileId)}
                            className="rounded-md border border-slate-200 bg-white px-2 py-1 font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Edit
                            </button>
                            <button
                            type="button"
                            onClick={() => onDeleteAttachment?.(file.fileId)}
                            className="rounded-md border border-red-100 bg-red-50 px-2 py-1 font-medium text-red-600 hover:bg-red-100"
                            >
                                Delete
                            </button>
                        </>
                        )}
                    </div>
                </li>

            ))}
        </ul>

        <div className="mt-4">
            <button
            type="button"
            onClick={isAdmin ? onAddAttachment : undefined}
            className="w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
            >
            {isAdmin ? 'Add file or link' : 'Upload a file or link'}
            </button>
            <p className="mt-2 text-sm text-gray-500">
            Attach necessary files or links related to this application.
            </p>
        </div>
    </>
}

export default ViewAttachments;
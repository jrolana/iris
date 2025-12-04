import { InventorType } from "@/lib/types/application";

interface ViewInventorsProps{
    inventors: InventorType[]
    isAdmin: boolean
    onAddInventor?: () => void;
    onEditInventor?: (id: string) => void;
    onRemoveInventor?: (id: string) => void;
}

function ViewInventors(props: ViewInventorsProps){
    const { inventors, isAdmin, onAddInventor, onEditInventor, onRemoveInventor} = props;

    if(inventors.length == 0){
        return <p className="mt-4 text-sm text-slate-500">
                No inventors recorded yet.
                {isAdmin
                    ? ' Add the technology generators involved in this application.'
                    : ' Please coordinate with TTBDO for updates to the inventor list.'}
                </p>
    }

    return  <>
        <ul className="mt-3 divide-y divide-slate-100 max-h-64 overflow-y-auto overflow-x-auto">
            {inventors.map((inventor) => (
                <li
                key={inventor.inventorId}
                className="flex items-center justify-between py-3 sm:items-start"
                >
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-md font-medium text-slate-900">
                        {inventor.full_name}
                        </p>
                        <p className="text-sm text-slate-600">
                        {inventor.email}
                        </p>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium uppercase text-slate-700">
                            {inventor.college}
                        </span>
                    </div>
                    {isAdmin && (
                        <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                            onEditInventor?.(inventor.inventorId)
                            }
                            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                            onRemoveInventor?.(inventor.inventorId)
                            }
                            className="rounded-md border border-red-100 bg-red-50 px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
                        >
                            Remove
                        </button>
                        </div>
                    )}
                </li>
            ))}
        </ul>
        <div className="mt-4">
            {isAdmin ? (
            <>
                <button
                type="button"
                onClick={onAddInventor}
                className="w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                Add inventor
                </button>
                <p className="mt-2 text-sm text-gray-500">
                List all inventors for proper crediting and IP ownership.
                </p>
            </>
            ) : (
            <p className="mt-2 text-sm text-gray-500">
                Inventor list is managed by TTBDO. Contact them if any
                corrections are needed.
            </p>
            )}
        </div>
    </>
}

export default ViewInventors;
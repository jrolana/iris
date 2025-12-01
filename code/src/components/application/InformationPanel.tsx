import { AttachmentType, InventorType } from "@/lib/types/application";
import { useState } from "react";
import ViewAttachments from "./ViewAttachments";
import ViewInventors from "./ViewInventors";

type ApplicationViewMode = 'applicant' | 'admin';

interface DetailsPanelProps{
  mode: ApplicationViewMode;
  attachments: AttachmentType[];
  inventors: InventorType[];
  onAddAttachment?: () => void;
  onEditAttachment?: (id: string) => void;
  onDeleteAttachment?: (id: string) => void;
  onAddInventor?: () => void;
  onEditInventor?: (id: string) => void;
  onRemoveInventor?: (id: string) => void;
};

function InformationPanel(props: DetailsPanelProps){
    const {mode, attachments, inventors, onAddAttachment, onEditAttachment, onDeleteAttachment, onAddInventor, onEditInventor, onRemoveInventor} = props
    const [activeTab, setActiveTab] = useState<'attachments' | 'inventors'>('attachments');

    const isAdmin = mode === 'admin';
    const tabIndex = +(activeTab === "inventors")
    const itemCount = [attachments, inventors][tabIndex].length
    const countLabel = `${itemCount} ${["attachment", "inventor"][tabIndex]}${" s"[+(itemCount > 0)]}` ;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
                <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs font-medium text-slate-600">
                <button
                    type="button"
                    onClick={() => setActiveTab('attachments')}
                    className={`rounded-full px-3 py-1 ${activeTab === 'attachments' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                >
                    Attachments
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('inventors')}
                    className={`rounded-full px-3 py-1 ${ activeTab === 'inventors' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                    }`}
                >
                    Inventors
                </button>
                </div>
                <span className="text-[11px] text-slate-500">{countLabel}</span>
            </div>

            {activeTab === 'attachments' ? (
                <ViewAttachments 
                attachments={attachments} 
                isAdmin={isAdmin} 
                onAddAttachment={onAddAttachment}
                onEditAttachment={onEditAttachment}
                onDeleteAttachment={onDeleteAttachment}
                />
            ) : (
                <ViewInventors 
                inventors={inventors}
                isAdmin={isAdmin}
                onAddInventor={onAddInventor}
                onEditInventor={onEditInventor}
                onRemoveInventor={onRemoveInventor}
                />
            )}
        </div>
    );
};

export default InformationPanel;




import { ApplicationType, InventorType, AttachmentType } from "../types/application";
import { IprStatus } from "../types/status";

export const dummyApplication: ApplicationType = {
  applicationId: 'demo-123',
  ipTitle: 'Low-Power Environmental Sensor Network',
  projectTitle: 'Smart Monitoring for Upland Farms',
  type_of_ip: 'patent',
  current_status_type: 'filed_with_ipophil',
  applicationNumber: 'App. No. 100F',
  dateOfFiling: '2025-11-25',
  lastUpdated: '2025-11-26T00:40:00Z',
};

export const dummyFiles: AttachmentType[] = [
  {
    fileId: 'f1',
    filename: 'SensorDesign_v1.pdf',
    description: 'Initial technical description shared with TTBDO',
    fileType: 'pdf',
    uploadedAt: '2025-11-25T09:30:00Z',
  },
  {
    fileId: 'f12',
    filename: 'SensorDesign_v1.pdf',
    description: 'Initial technical description shared with TTBDO',
    fileType: 'pdf',
    uploadedAt: '2025-11-25T09:30:00Z',
  },
  {
    fileId: 'f13',
    filename: 'SensorDesign_v1.pdf',
    description: 'Initial technical description shared with TTBDO',
    fileType: 'pdf',
    uploadedAt: '2025-11-25T09:30:00Z',
  },
  {
    fileId: 'f2',
    filename: 'BlockDiagram.png',
    description: 'System architecture diagram',
    fileType: 'image',
    uploadedAt: '2025-11-25T10:12:00Z',
  },
  {
    fileId: 'f3',
    filename: 'MeetingNotes_GoogleDoc',
    description: 'Link to collaborative Google Doc for Q&A',
    fileType: 'link',
    uploadedAt: '2025-11-26T14:05:00Z',
  },
];

export const dummyInventors: InventorType[] = [
  {
    inventorId: 'i1',
    full_name: 'Juan Dela Cruz',
    email: 'juan.delacruz@up.edu.ph',
    college: "CAS-Bio",
  },
  {
    inventorId: 'i2',
    full_name: 'Maria Santos',
    email: 'maria.santos@up.edu.ph',
    college: "CFOS-IA",
  },
  {
    inventorId: 'i3',
    full_name: 'Alex Reyes',
    email: 'alex.reyes@up.edu.ph',
    college: 'CFOS',
  },
];

export const dummyIprStatuses: IprStatus[] = [
  {
    statusId: 's1',
    status_type: 'draft_idf',
    note: 'Started initial IDF draft.',
    deadline: null,
    created_at: '2025-11-20T08:30:00Z',
  },
  {
    statusId: 's2',
    status_type: 'submitted_to_ttbdo',
    note: 'Disclosure form submitted for TTBDO review.',
    deadline: null,
    created_at: '2025-11-21T09:15:00Z',
  },
  {
    statusId: 's3',
    status_type: 'under_ttbdo_review',
    note: 'TTBDO is reviewing the IDF. Please expect follow-up questions if clarification is needed.',
    deadline: null,
    created_at: '2025-11-22T10:00:00Z',
  },
  {
    statusId: 's4',
    status_type: 'prior_art_search',
    note: 'Prior art search initiated by TTBDO.',
    deadline: null,
    created_at: '2025-11-23T19:20:00Z',
  },
  {
    statusId: 's5',
    status_type: 'draft_application',
    note: 'TTBDO is drafting the IPOPHL application. Kindly review the shared Google Doc and leave comments by the deadline.',
    deadline: '2025-11-26',
    created_at: '2025-11-24T21:05:00Z',
  },
  {
    statusId: 's6',
    status_type: 'filed_with_ipophil',
    note: 'Application filed with IPOPHL. Please monitor your email for any requests relayed by TTBDO.',
    deadline: null,
    created_at: '2025-11-26T00:40:00Z',
  },
];
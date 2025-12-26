// lib/constants/charter.ts

export const CHARTER_DEADLINES = {
  STAGE_1: {
    label: "Initial Review & Assessment",
    // 30 mins (receive) + 2 days (completeness) + 1 day (recommendation)
    durationMs: (3 * 24 * 60 * 60 * 1000) + (30 * 60 * 1000), 
    description: "Agency actions 1, 1.1, and 1.2"
  },
  STAGE_2: {
    label: "Document Drafting",
    // 12 days
    durationMs: 12 * 24 * 60 * 60 * 1000,
    description: "Agency action 2: Prepare pertinent IP application docs"
  },
  STAGE_3: {
    label: "Filing & Payment",
    // 3 days (finalize) + 1 day (payment) + 30 mins (proof)
    durationMs: (4 * 24 * 60 * 60 * 1000) + (30 * 60 * 1000),
    description: "Agency actions 3, 3.1, and 3.2"
  }
} as const;
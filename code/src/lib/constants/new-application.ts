export type NewApplicationFlowType = {
  pageTitle: string;
  pageSubtitle: string;
  startPromptTitle: string;
  startPromptDescription: string;
  wizardCardTitle: string;
  wizardCardDescription: string;
  directCardTitle: string;
  directCardDescription: string;
  directMenuTitle: string;
  directMenuDescription: string;
  defaultDetailsTitle: string;
  defaultDetailsDescription: string;
  proceedLabel: string;
  proceedHint: string;
  toastTitle: string;
  toastDescription: string;
};

export const TECHGEN_NEW_APPLICATION_COPY: NewApplicationFlowType = {
  pageTitle: "New IP Application",
  pageSubtitle:
    "Start a disclosure for your research output and prepare the required forms for submission.",
  startPromptTitle: "How would you like to start?",
  startPromptDescription:
    "You can let IRIS recommend a form or choose one directly if you already know the protection you need.",
  wizardCardTitle: "Yes, guide me through it",
  wizardCardDescription:
    "IRIS will ask a few short questions and suggest the most suitable disclosure form for your work.",
  directCardTitle: "No, I already know what to choose",
  directCardDescription:
    "Select the disclosure form directly if you already know the protection you want.",
  directMenuTitle: "Choose the disclosure form to use",
  directMenuDescription:
    "These are the standard forms used for different types of protection.",
  defaultDetailsTitle: "Form details",
  defaultDetailsDescription:
    "Select an option or complete the guide to see more details about the recommended disclosure form.",
  proceedLabel: "Proceed to application",
  proceedHint:
    "You can still review and complete the submission details in the next step.",
  toastTitle: "How this works",
  toastDescription:
    "IRIS will help you choose a starting disclosure form. You can either answer a few quick questions or directly choose the form you need. You can still update the details later during review.",
};

export const ADMIN_NEW_APPLICATION_COPY: NewApplicationFlowType = {
  pageTitle: "Create IP Application",
  pageSubtitle:
    "Start an IP application record and prepare the required forms for endorsement or processing.",
  startPromptTitle: "How would you like to begin?",
  startPromptDescription:
    "You can let IRIS recommend a form or select one directly based on the intended protection.",
  wizardCardTitle: "Use guided classification",
  wizardCardDescription:
    "IRIS will ask a few short questions and suggest the most suitable disclosure form for the application.",
  directCardTitle: "Select a form directly",
  directCardDescription:
    "Choose the disclosure form directly if the protection type is already known.",
  directMenuTitle: "Choose the disclosure form to use",
  directMenuDescription:
    "These are the standard forms used for different types of IP protection.",
  defaultDetailsTitle: "Form details",
  defaultDetailsDescription:
    "Select an option or complete the guide to view details about the recommended disclosure form.",
  proceedLabel: "Proceed to application record",
  proceedHint:
    "Classification and application details can still be updated during review.",
  toastTitle: "How this works",
  toastDescription:
    "IRIS can help classify the application through a short guided flow, or you can select the form directly if the protection type is already identified.",
};
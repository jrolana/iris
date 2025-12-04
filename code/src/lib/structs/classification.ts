import { IpType } from '../types/ip';

export type WizardResult = {
  ipType: IpType;
  formName: string;
  summary: string;
};

export type WizardOption = {
  id: string;
  label: string;
  description?: string;
  nextNodeId: string;
};

export type WizardNode = {
  id: string;
  question: string;
  helperText?: string;
  options?: WizardOption[];
  result?: WizardResult; // nullable, should show when leaves are reached
};

// Structure of tree to map out the wizard questions
export const ipClassificationTree: Record<string, WizardNode> = {
  root: {
    id: 'root',
    question: 'What best describes your research output?',
    helperText:
      'This helps IRIS suggest the most appropriate Intellectual Disclosure Form.',
    options: [
      {
        id: 'technology',
        label: 'Technology',
        description: 'Devices, compositions, software, systems, etc.',
        nextNodeId: 'technology-type',
      },
      {
        id: 'instructional',
        label: 'Instructional Materials',
        description: 'Modules, videos, books, learning materials.',
        nextNodeId: 'instructional-type',
      },
      {
        id: 'process',
        label: 'Process / Protocol',
        description: 'Technical or procedural methods and workflows.',
        nextNodeId: 'process-type',
      },
      {
        id: 'brand',
        label: 'Logo / Symbol / Unique Name or Brand',
        description: 'Logos, names, or visual marks used for branding.',
        nextNodeId: 'brand-leaf',
      },
    ],
  },

  'technology-type': {
    id: 'technology-type',
    question: 'What kind of technology is it?',
    helperText: 'Rough classification based on your primary output.',
    options: [
      {
        id: 'device',
        label: 'Device',
        description: 'Equipment, gadget, hardware prototype, apparatus.',
        nextNodeId: 'device-focus',
      },
      {
        id: 'product-composition',
        label: 'Product Composition',
        description: 'Formulation, mixture, chemical/biological product.',
        nextNodeId: 'product-novelty',
      },
      {
        id: 'computer-program',
        label: 'Computer Program',
        description: 'Software, application, script, or system.',
        nextNodeId: 'software-leaf',
      },
    ],
  },

  'device-focus': {
    id: 'device-focus',
    question: 'What is primarily new about the device?',
    helperText: 'This is a simplified decision for prototype purposes.',
    options: [
      {
        id: 'device-design',
        label: 'The visual design or appearance',
        description: 'Shape, configuration, surface pattern, ornamentation.',
        nextNodeId: 'device-design-leaf',
      },
      {
        id: 'device-function',
        label: 'The technical function or mechanism',
        description: 'How it works, structure, or technical features.',
        nextNodeId: 'device-function-novelty',
      },
    ],
  },

  'device-design-leaf': {
    id: 'device-design-leaf',
    question: 'Recommended protection',
    result: {
      ipType: 'industrial_design',
      formName: 'Industrial Design Disclosure Form',
      summary:
        'Your output is best described as the ornamental design of a device. TTBDO typically evaluates this under Industrial Design.',
    },
  },

  'device-function-novelty': {
    id: 'device-function-novelty',
    question: 'How technically “new” is the device?',
    helperText: 'For now, choose the closest option. TTBDO will refine this.',
    options: [
      {
        id: 'device-major-invention',
        label: 'Substantially new / inventive technical solution',
        description: 'Solves a technical problem in a non-obvious way.',
        nextNodeId: 'device-patent-leaf',
      },
      {
        id: 'device-improvement',
        label: 'Improvement to existing technology',
        description:
          'Enhancement or optimization of known devices or systems.',
        nextNodeId: 'device-utility-model-leaf',
      },
    ],
  },

  'device-patent-leaf': {
    id: 'device-patent-leaf',
    question: 'Recommended protection',
    result: {
      ipType: 'patent',
      formName: 'Patent Technology Disclosure Form',
      summary:
        'Your output appears to be a new and inventive technical solution. TTBDO will likely evaluate this as a Patent application.',
    },
  },

  'device-utility-model-leaf': {
    id: 'device-utility-model-leaf',
    question: 'Recommended protection',
    result: {
      ipType: 'utility_model',
      formName: 'Utility Model Disclosure Form',
      summary:
        'Your output appears to be an improvement or new form of an existing device. TTBDO will likely treat this as a Utility Model.',
    },
  },

  'product-novelty': {
    id: 'product-novelty',
    question: 'How would you describe the product composition?',
    helperText:
      'For chemicals, food, biological products, and similar outputs.',
    options: [
      {
        id: 'product-new-composition',
        label: 'New composition or formulation',
        description: 'New combination of ingredients or components.',
        nextNodeId: 'product-patent-leaf',
      },
      {
        id: 'product-new-use',
        label: 'New use or minor modification of known products',
        description: 'New dosage, form, or specific application.',
        nextNodeId: 'product-utility-model-leaf',
      },
    ],
  },

  'product-patent-leaf': {
    id: 'product-patent-leaf',
    question: 'Recommended protection',
    result: {
      ipType: 'patent',
      formName: 'Patent Technology Disclosure Form',
      summary:
        'Your output appears to be a novel composition or formulation, which is typically evaluated under Patent.',
    },
  },

  'product-utility-model-leaf': {
    id: 'product-utility-model-leaf',
    question: 'Recommended protection',
    result: {
      ipType: 'utility_model',
      formName: 'Utility Model Disclosure Form',
      summary:
        'Your output seems to be a new use or variation of existing compositions, often suited for Utility Model protection.',
    },
  },

  'software-leaf': {
    id: 'software-leaf',
    question: 'Recommended protection',
    result: {
      ipType: 'copyright',
      formName: 'Copyright Disclosure Form (Software)',
      summary:
        'Computer programs are usually protected as Copyrighted works. In some cases, technical aspects may also be patentable.',
    },
  },

  'instructional-type': {
    id: 'instructional-type',
    question: 'What kind of instructional material is it?',
    helperText:
      'Learning modules, AVPs, manuals, and similar outputs are usually handled as Copyright.',
    result: {
      ipType: 'copyright',
      formName: 'Copyright Disclosure Form (Instructional Materials)',
      summary:
        'Instructional materials are typically treated as Copyrighted works (books, modules, videos, etc.).',
    },
  },

  'process-type': {
    id: 'process-type',
    question: 'What best describes the process or protocol?',
    helperText:
      'This is a simplified branching; TTBDO will refine classification.',
    options: [
      {
        id: 'technical-process',
        label: 'Technical process',
        description:
          'Laboratory, engineering, manufacturing, or similarly technical procedure.',
        nextNodeId: 'process-technical-leaf',
      },
      {
        id: 'procedural-guideline',
        label: 'Procedural guideline / manual',
        description: 'Standard operating procedures, manuals, write-ups.',
        nextNodeId: 'process-copyright-leaf',
      },
    ],
  },

  'process-technical-leaf': {
    id: 'process-technical-leaf',
    question: 'Recommended protection',
    result: {
      ipType: 'patent',
      formName: 'Patent Technology Disclosure Form',
      summary:
        'Technical processes with novel steps are commonly evaluated for Patent protection.',
    },
  },

  'process-copyright-leaf': {
    id: 'process-copyright-leaf',
    question: 'Recommended protection',
    result: {
      ipType: 'copyright',
      formName: 'Copyright Disclosure Form (Manual / Protocol)',
      summary:
        'If the main value lies in the written documentation or guidelines, Copyright is usually the primary protection.',
    },
  },

  'brand-leaf': {
    id: 'brand-leaf',
    question: 'Recommended protection',
    result: {
      ipType: 'trademark',
      formName: 'Trademark Disclosure Form',
      summary:
        'Logos, names, and brand identifiers are typically evaluated for Trademark registration.',
    },
  },
};

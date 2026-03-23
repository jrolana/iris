import { IpType } from "@/lib/types/ip";

export type DisclosureFormOption = {
  id: string;
  ipType: IpType;
  label: string;
  shortDescription: string;
  detail: string;
};

export type DownloadableForm = {
  id: string;
  fileName: string;
  storagePath: string;
};

export const DISCLOSURE_FORMS: DisclosureFormOption[] = [
  {
    id: "patent",
    ipType: "patent",
    label: "Patent",
    shortDescription: "New and inventive technical solutions to a problem.",
    detail:
      "Patents generally cover novel and inventive products, compositions, or processes that solve a technical problem. Protection is strong but requires rigorous examination and prior art search.",
  },
  {
    id: "utility_model",
    ipType: "utility_model",
    label: "Utility Model",
    shortDescription: "Improvements or new forms of existing technology.",
    detail:
      "Utility Models are often used for incremental technical improvements or new forms of known devices or products. Examination is lighter compared to patents but still requires registrability.",
  },
  {
    id: "industrial_design",
    ipType: "industrial_design",
    label: "Industrial Design",
    shortDescription: "Appearance, shape, or ornamental design of a product.",
    detail:
      "Industrial Design protects the visual or aesthetic features of a product—its shape, configuration, pattern, or ornamentation—rather than its technical function.",
  },
  {
    id: "trademark",
    ipType: "trademark",
    label: "Trademark",
    shortDescription: "Logos, names, or symbols identifying a brand.",
    detail:
      "Trademarks protect words, names, logos, or symbols that distinguish goods or services. They are especially important when branding technologies, spin-offs, or extension programs.",
  },
  {
    id: "copyright",
    ipType: "copyright",
    label: "Copyright",
    shortDescription: "Written, visual, audio, or software works.",
    detail:
      "Copyright covers literary, artistic, and scholarly works, including modules, manuals, videos, software code, and other creative outputs. It focuses on expression, not ideas.",
  },
];


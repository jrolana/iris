export const CollegeUnits = {
  "CAS": "CAS",
  "CAS-Bio": "CAS-Bio",
  "CAS-Chem": "CAS-Chem",
  "CAS-DPSM" : "CAS-DPSM",
  "CFOS": "CFOS",
  "CFOS-IA": "CFOS-IA",
  "CFOS-IFPT": "CFOS-IFPT",
  "CFOS-IMFO": "CFOS-IMFO",
  "NIMBB": "NIMBB",
  "Other": "Other",
  "RRC": "RRC",
  "SoTech": "SoTech",
  "SoTech-Che": "SoTech-Che",
  "SoTech-FT": "SoTech-FT",
  "TTBDO": "TTBDO",
  "UPHSI": "UPHSI",
  "UPV": "UPV",
  "UPVGS": "UPVGS",
} as const;

// types just in case
export type CollegeUnitType = (typeof CollegeUnits)[keyof typeof CollegeUnits];
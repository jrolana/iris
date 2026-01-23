// TODO: change this to refer to the db enums later

export const CollegeUnits = {
  "CAS-Bio": "CAS-Bio",
  "CAS-Chem": "CAS-Chem",
  "CFOS": "CFOS",
  "CFOS-IA": "CFOS-IA",
  "CFOS-IFPT": "CFOS-IFPT",
  "CFOS-IMFO": "CFOS-IMFO",
  "ChE-SoTech": "ChE-SoTech",
  "Chem-CAS": "Chem-CAS",
  "DPSM-CAS": "DPSM-CAS",
  "FT-SoTech": "FT-SoTech",
  "NIMBB": "NIMBB",
  "RRC": "RRC",
  "SoTech": "SoTech",
  "TTBDO": "TTBDO",
  "UPHSI": "UPHSI",
  "UPV": "UPV",
  "UPV GS": "UPV GS",
  "UPVTC": "UPVTC",
  "Other": "Other",
} as const;

// types just in case
export type CollegeUnitType = (typeof CollegeUnits)[keyof typeof CollegeUnits];
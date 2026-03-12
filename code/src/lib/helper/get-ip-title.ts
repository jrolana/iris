import { IpType } from "@/lib/types/ip";


export const  ipTypeToTitle = (ipType: IpType | null | string): string => {
  switch (ipType) {
    case 'utility_model':
      return 'Utility Model';
    case 'industrial_design':
      return 'Industrial Design';
    case 'trademark':
      return 'Trademark';
    case 'copyright':
      return 'Copyright';
    case 'patent':
      return 'Patent'
    default:
      return '';
  }
}

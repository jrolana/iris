import { RoleType } from "@/lib/types/role";

export const ROLE_OPTIONS: { value: RoleType; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "techgen", label: "Techgen" },
  { value: "up-official", label: "UP Official" },
];

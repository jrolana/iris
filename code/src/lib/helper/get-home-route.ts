import { ROLE_CONFIG, Role } from "../roles";

export function getHomeRoute(role?: string | null) {
  if (!role || !(role in ROLE_CONFIG)) return "/";
  return ROLE_CONFIG[role as Role].home;
}
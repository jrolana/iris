export const ROLE_CONFIG = {
  admin: {
    home: "/admin",
    allowedPrefixes: ["/admin"],
  },
  "up-official": {
    home: "/up-official",
    allowedPrefixes: ["/up-official"],
  },
  techgen: {
    home: "/techgen",
    allowedPrefixes: ["/techgen"],
  },
};

export type Role = keyof typeof ROLE_CONFIG;
export const VALID_ROLES = Object.keys(ROLE_CONFIG) as Role[];

export const APP_NAME = "Pharmacie Hospitalière";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    roles: [
      "SUPERADMIN",
      "PHARMACIST",
      "PHARMACY_TECH",
      "DOCTOR",
      "NURSE",
      "CASHIER",
      "STOCK_MANAGER",
      "AUDITOR",
    ],
  },
  {
    label: "Médicaments",
    href: "/drugs",
    icon: "Pill",
    roles: ["SUPERADMIN", "PHARMACIST", "PHARMACY_TECH", "STOCK_MANAGER"],
  },
  {
    label: "Stock",
    href: "/stock",
    icon: "Package",
    roles: [
      "SUPERADMIN",
      "PHARMACIST",
      "PHARMACY_TECH",
      "STOCK_MANAGER",
      "NURSE",
    ],
  },
  {
    label: "Patients",
    href: "/patients",
    icon: "Users",
    roles: ["SUPERADMIN", "PHARMACIST", "PHARMACY_TECH", "DOCTOR", "NURSE"],
  },
  {
    label: "Ordonnances",
    href: "/prescriptions",
    icon: "FileText",
    roles: ["SUPERADMIN", "PHARMACIST", "DOCTOR", "NURSE"],
  },
  {
    label: "Dispensations",
    href: "/dispensations",
    icon: "HandHeart",
    roles: ["SUPERADMIN", "PHARMACIST", "PHARMACY_TECH", "NURSE"],
  },
  {
    label: "Alertes",
    href: "/alerts",
    icon: "Bell",
    roles: ["SUPERADMIN", "PHARMACIST", "PHARMACY_TECH", "STOCK_MANAGER"],
  },
  {
    label: "Utilisateurs",
    href: "/admin/users",
    icon: "Shield",
    roles: ["SUPERADMIN"],
  },
  {
    label: "Documentation",
    href: "/api-docs",
    icon: "",
    roles: ["SUPERADMIN"],
  },
] as const;

export const API_BASE_URL = process.env.API_URL || "http://localhost:3001";

export const TOKEN_KEY = "pharmacie_access_token";
export const REFRESH_TOKEN_KEY = "pharmacie_refresh_token";

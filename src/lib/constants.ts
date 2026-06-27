export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const APP_NAME = "Pharmacie Hospitalière";

export const NAV_ITEMS = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Médicaments",
    href: "/drugs",
    icon: "Pill",
  },
  {
    label: "Stock",
    href: "/stock",
    icon: "Package",
  },
  {
    label: "Patients",
    href: "/patients",
    icon: "Users",
  },
  {
    label: "Ordonnances",
    href: "/prescriptions",
    icon: "FileText",
  },
  {
    label: "Dispensations",
    href: "/dispensations",
    icon: "ShoppingCart",
  },
  {
    label: "Alertes",
    href: "/alerts",
    icon: "AlertTriangle",
  },
] as const;

export const HOVER_COLOR = "#0CBFC3"

export const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: "Super Administrateur",
  PHARMACIST: "Pharmacien",
  PHARMACY_TECH: "Technicien de Pharmacie",
  DOCTOR: "Médecin",
  NURSE: "Infirmier",
  CASHIER: "Caissier",
  STOCK_MANAGER: "Gestionnaire de Stock",
  AUDITOR: "Auditeur",
};

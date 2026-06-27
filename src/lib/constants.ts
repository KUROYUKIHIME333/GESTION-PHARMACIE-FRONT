export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export const APP_NAME = "Pharmacie Hospitalière"

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
] as const

export const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: "Super Administrateur",
  PHARMACIST: "Pharmacien",
  PHARMACY_TECH: "Technicien de Pharmacie",
  DOCTOR: "Médecin",
  NURSE: "Infirmier",
  CASHIER: "Caissier",
  STOCK_MANAGER: "Gestionnaire de Stock",
  AUDITOR: "Auditeur",
}

// Labels pour les enums
export const DRUG_FORM_LABELS: Record<string, string> = {
  TABLET: "Comprimé",
  CAPSULE: "Gélule",
  SYRUP: "Sirop",
  INJECTABLE_IV: "Injectable IV",
  INJECTABLE_IM: "Injectable IM",
  INJECTABLE_SC: "Injectable SC",
  CREAM: "Crème",
  OINTMENT: "Pommade",
  DROPS_EYE: "Gouttes ophtalmiques",
  DROPS_EAR: "Gouttes auriculaires",
  DROPS_NASAL: "Gouttes nasales",
  SUPPOSITORY: "Suppositoire",
  PATCH: "Timbre",
  POWDER: "Poudre",
  GRANULES: "Granulés",
  SOLUTION: "Solution",
  SUSPENSION: "Suspension",
  AEROSOL: "Aérosol",
  GEL: "Gel",
  PESSARY: "Ovule",
  OTHER: "Autre",
}

export const DRUG_CATEGORY_LABELS: Record<string, string> = {
  ANTIRETROVIRAL: "Antirétroviral",
  ANTIMALARIAL: "Antipaludéen",
  ANTITUBERCULOSIS: "Antituberculeux",
  VACCINE: "Vaccin",
  ANTIBIOTIC: "Antibiotique",
  ANALGESIC: "Analgésique",
  ANTIPYRETIC: "Antipyrétique",
  ANTI_INFLAMMATORY: "Anti-inflammatoire",
  ANTIFUNGAL: "Antifongique",
  ANTIPARASITIC: "Antiparasitaire",
  CARDIOVASCULAR: "Cardiovasculaire",
  ANTIHYPERTENSIVE: "Antihypertenseur",
  ANTIDIABETIC: "Antidiabétique",
  RESPIRATORY: "Respiratoire",
  GASTROINTESTINAL: "Gastro-intestinal",
  NEUROLOGICAL: "Neurologique",
  PSYCHIATRIC: "Psychiatrique",
  HORMONAL: "Hormonal",
  CONTRACEPTIVE: "Contraceptif",
  VITAMINS_SUPPLEMENTS: "Vitamines & Suppléments",
  ANESTHETIC: "Anesthésique",
  ANTISEPTIC_DISINFECTANT: "Antiseptique & Désinfectant",
  MEDICAL_CONSUMABLE: "Consommable médical",
  DIAGNOSTIC_REAGENT: "Réactif de diagnostic",
  OTHER: "Autre",
}

export const STORAGE_CONDITION_LABELS: Record<string, string> = {
  ROOM_TEMP: "Température ambiante",
  COOL: "Zone fraîche (8-15°C)",
  REFRIGERATED: "Réfrigéré (2-8°C)",
  FROZEN: "Congelé (<0°C)",
  PROTECT_LIGHT: "Protéger de la lumière",
  PROTECT_HUMIDITY: "Protéger de l'humidité",
  CONTROLLED_SUBSTANCE: "Substance contrôlée",
}

export const HOVER_COLOR = "#0CBFC3"


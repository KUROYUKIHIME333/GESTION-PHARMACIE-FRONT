/**
 * URL de base de l'API backend.
 * Utilise la variable d'environnement NEXT_PUBLIC_API_URL si définie,
 * sinon fallback sur localhost:3001 (développement local).
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Collection des endpoints API utilisés dans l'application.
 * Organisés par domaine fonctionnel (auth, drugs, batches, etc.).
 */
export const API_ENDPOINTS = {
  // AUTHENTIFICATION
  /** POST - Connexion utilisateur (email + password) */
  login: "/api/auth/login",
  /** POST - Inscription d'un nouvel utilisateur */
  register: "/api/auth/register",
  /** POST - Déconnexion (invalidation du token côté serveur) */
  logout: "/api/auth/logout",
  /** POST - Changement de mot de passe */
  change_password: "/api/auth/change-password",
  /** GET - Récupération de l'utilisateur connecté */
  get_me: "/api/auth/me",

  // MÉDICAMENTS
  /** CRUD - Gestion du catalogue de médicaments */
  drugs: "/api/drugs",

  // LOTS
  /** CRUD - Gestion des lots de stock */
  batches: "/api/batches",

  // STOCK
  /** GET/POST - Mouvements et niveaux de stock */
  stocks: "/api/stock",

  // PATIENTS
  /** CRUD - Dossiers patients */
  patients: "/api/patients",

  // ORDONNANCES
  /** CRUD - Prescriptions médicales */
  prescriptions: "/api/prescriptions",

  // DISPENSATIONS
  /** POST - Distribution de médicaments aux patients */
  dispensations: "/api/dispensations",

  // ALERTES
  /** GET - Alertes de stock, péremption, etc. */
  alerts: "/api/alerts",

  // TABLEAU DE BORD
  /** GET - Statistiques et indicateurs */
  stats: "/api/dashboard/stats",
};

/**
 * Nom de l'application affiché dans l'interface (titres, meta, etc.).
 */
export const APP_NAME = "OfficIn";

/**
 * Items de navigation du sidebar.
 * Chaque item définit un label, un chemin href et une clé d'icône Lucide.
 * Les items commentés sont des fonctionnalités futures/planifiées.
 */
export const NAV_ITEMS = [
  {
    /** Label affiché dans le menu */
    label: "Tableau de bord",
    /** Route Next.js */
    href: "/dashboard",
    /** Clé correspondant à l'icône Lucide (mappée dans iconMap du SideBar) */
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
  // {
  //   label: "Patients",
  //   href: "/patients",
  //   icon: "Users",
  // },
  // {
  //   label: "Ordonnances",
  //   href: "/prescriptions",
  //   icon: "FileText",
  // },
  // {
  //   label: "Dispensations",
  //   href: "/dispensations",
  //   icon: "ShoppingCart",
  // },
  // {
  //   label: "Alertes",
  //   href: "/alerts",
  //   icon: "AlertTriangle",
  // },
] as const;

/**
 * Mapping des rôles utilisateurs vers leurs labels en français.
 * Utilisé dans le profil utilisateur et les interfaces d'administration.
 */
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

//  LABELS D'ENUMS — Traductions en français pour l'affichage UI

/**
 * Labels des formes galéniques (DrugFormEnum).
 * Utilisé dans les formulaires, tableaux et fiches de détail.
 */
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
};

/**
 * Labels des catégories thérapeutiques (DrugCategoryEnum).
 */
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
};

/**
 * Labels des conditions de stockage (StorageConditionEnum).
 * Affichés dans les fiches médicaments et alertes de stockage.
 */
export const STORAGE_CONDITION_LABELS: Record<string, string> = {
  ROOM_TEMP: "Température ambiante",
  COOL: "Zone fraîche (8-15°C)",
  REFRIGERATED: "Réfrigéré (2-8°C)",
  FROZEN: "Congelé (<0°C)",
  PROTECT_LIGHT: "Protéger de la lumière",
  PROTECT_HUMIDITY: "Protéger de l'humidité",
  CONTROLLED_SUBSTANCE: "Substance contrôlée",
};

/**
 * Labels des genres (PatientGenderEnum).
 */
export const GENDER_LABELS: Record<string, string> = {
  MALE: "Masculin",
  FEMALE: "Féminin",
  OTHER: "Autre",
  UNKNOWN: "Non précisé",
};

/**
 * Labels des niveaux de gravité des allergies.
 */
export const ALLERGY_SEVERITY_LABELS: Record<string, string> = {
  MILD: "Légère",
  MODERATE: "Modérée",
  SEVERE: "Sévère",
  ANAPHYLAXIS: "Anaphylaxie",
};

/**
 * Classes Tailwind pour le color-coding des allergies selon leur gravité.
 * Utilisé pour les badges/pills dans les dossiers patients.
 */
export const ALLERGY_SEVERITY_COLORS: Record<string, string> = {
  MILD: "bg-yellow-100 text-yellow-700 border-yellow-200",
  MODERATE: "bg-orange-100 text-orange-700 border-orange-200",
  SEVERE: "bg-red-100 text-red-700 border-red-200",
  ANAPHYLAXIS: "bg-red-200 text-red-800 border-red-300 font-semibold",
};

/**
 * Labels des statuts d'ordonnance (PrescriptionStatusEnum).
 */
export const PRESCRIPTION_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  PENDING: "En attente",
  PARTIALLY_DISPENSED: "Partiellement dispensée",
  DISPENSED: "Dispensée",
  CANCELLED: "Annulée",
  EXPIRED: "Expirée",
};

/**
 * Classes Tailwind pour le color-coding des statuts d'ordonnance.
 * Permet un repère visuel immédiat de l'état d'une prescription.
 */
export const PRESCRIPTION_STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
  PENDING: "bg-sky-100 text-sky-700 border-sky-200",
  PARTIALLY_DISPENSED: "bg-amber-100 text-amber-700 border-amber-200",
  DISPENSED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  EXPIRED: "bg-slate-100 text-slate-500 border-slate-200",
};

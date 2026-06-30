// ============================================
// TYPES EXISTANTS (Jour 1)
// ============================================

export interface User {
  id: string;
  employeeId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  serviceId: string | null;
  isActive: boolean;
  mustChangePassword: boolean;
  failedLoginCount: number;
}

export type UserRole =
  | "SUPERADMIN"
  | "PHARMACIST"
  | "PHARMACY_TECH"
  | "DOCTOR"
  | "NURSE"
  | "CASHIER"
  | "STOCK_MANAGER"
  | "AUDITOR";

// Types auth
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  details?: Record<string, string[]>;
}

// Types navigation
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: UserRole[];
}

// Types dashboard
export interface DashboardStats {
  alerts: {
    totalActive: number;
    critical: number;
    warning: number;
  };
  stock: {
    totalDrugs: number;
    drugsInStock: number;
    drugsCritical: number;
    drugsLow: number;
  };
  activity: {
    dispensationsToday: number;
    prescriptionsToday: number;
    newPatientsToday: number;
  };
}

// ============================================
// TYPES JOUR 2 — MÉDICAMENTS
// ============================================

export type DrugForm =
  | "TABLET"
  | "CAPSULE"
  | "SYRUP"
  | "INJECTABLE_IV"
  | "INJECTABLE_IM"
  | "INJECTABLE_SC"
  | "CREAM"
  | "OINTMENT"
  | "DROPS_EYE"
  | "DROPS_EAR"
  | "DROPS_NASAL"
  | "SUPPOSITORY"
  | "PATCH"
  | "POWDER"
  | "GRANULES"
  | "SOLUTION"
  | "SUSPENSION"
  | "AEROSOL"
  | "GEL"
  | "PESSARY"
  | "OTHER";

export type DrugCategory =
  | "ANTIRETROVIRAL"
  | "ANTIMALARIAL"
  | "ANTITUBERCULOSIS"
  | "VACCINE"
  | "ANTIBIOTIC"
  | "ANALGESIC"
  | "ANTIPYRETIC"
  | "ANTI_INFLAMMATORY"
  | "ANTIFUNGAL"
  | "ANTIPARASITIC"
  | "CARDIOVASCULAR"
  | "ANTIHYPERTENSIVE"
  | "ANTIDIABETIC"
  | "RESPIRATORY"
  | "GASTROINTESTINAL"
  | "NEUROLOGICAL"
  | "PSYCHIATRIC"
  | "HORMONAL"
  | "CONTRACEPTIVE"
  | "VITAMINS_SUPPLEMENTS"
  | "ANESTHETIC"
  | "ANTISEPTIC_DISINFECTANT"
  | "MEDICAL_CONSUMABLE"
  | "DIAGNOSTIC_REAGENT"
  | "OTHER";

export type StorageCondition =
  | "ROOM_TEMP"
  | "COOL"
  | "REFRIGERATED"
  | "FROZEN"
  | "PROTECT_LIGHT"
  | "PROTECT_HUMIDITY"
  | "CONTROLLED_SUBSTANCE";

export interface Drug {
  id: string;
  code: string;
  name: string;
  genericName: string | null;
  dci: string;
  form: DrugForm;
  category: DrugCategory;
  therapeuticClass: string | null;
  dosage: string;
  concentration: string | null;
  unitOfDispense: string;
  packSize: number;
  packUnit: string;
  ammNumber: string | null;
  isEssential: boolean;
  isControlled: boolean;
  controlledSchedule: string | null;
  isProgramDrug: boolean;
  programName: string | null;
  storageConditions: StorageCondition[];
  requiresColdChain: boolean;
  minTemp: number | null;
  maxTemp: number | null;
  unitPriceCDF: number | null;
  unitPriceUSD: number | null;
  isPriceRegulated: boolean;
  minStockLevel: number;
  criticalStockLevel: number;
  reorderPoint: number;
  reorderQuantity: number;
  isActive: boolean;
  notes: string | null;
  _count?: {
    batches: number;
  };
}

export interface DrugCreateInput {
  code: string;
  name: string;
  genericName?: string;
  dci: string;
  form: DrugForm;
  category: DrugCategory;
  therapeuticClass?: string;
  dosage: string;
  concentration?: string;
  unitOfDispense: string;
  packSize?: number;
  packUnit?: string;
  ammNumber?: string;
  isEssential?: boolean;
  isControlled?: boolean;
  controlledSchedule?: string;
  isProgramDrug?: boolean;
  programName?: string;
  storageConditions?: StorageCondition[];
  requiresColdChain?: boolean;
  minTemp?: number;
  maxTemp?: number;
  unitPriceCDF?: number;
  unitPriceUSD?: number;
  isPriceRegulated?: boolean;
  minStockLevel?: number;
  criticalStockLevel?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  isActive?: boolean;
  notes?: string;
}

export interface DrugUpdateInput extends Partial<DrugCreateInput> {}

// ============================================
// TYPES JOUR 2 — LOTS
// ============================================

export interface Batch {
  id: string;
  batchNumber: string;
  drugId: string;
  drug: {
    id: string;
    name: string;
    code: string;
  };
  supplierId: string | null;
  supplier: {
    id: string;
    name: string;
  } | null;
  currentQuantity: number;
  initialQuantity: number;
  expiryDate: string;
  manufacturingDate: string | null;
  purchasePriceCDF: number | null;
  purchasePriceUSD: number | null;
  locationId: string | null;
  coldChainVerified: boolean;
  isQuarantined: boolean;
  isActive: boolean;
}

export interface BatchCreateInput {
  batchNumber: string;
  drugId: string;
  supplierId?: string;
  initialQuantity: number;
  expiryDate: string;
  manufacturingDate?: string;
  purchasePriceCDF?: number;
  purchasePriceUSD?: number;
  locationId?: string;
  coldChainVerified?: boolean;
  notes?: string;
}

// ============================================
// TYPES JOUR 2 — STOCK
// ============================================

export interface StockOverviewItem {
  drugId: string;
  drugName: string;
  totalQuantity: number;
  isBelowMin: boolean;
  isCritical: boolean;
  activeBatches: number;
  nearestExpiry: string | null;
}

export interface StockOverviewResponse {
  success: boolean;
  data: {
    items: StockOverviewItem[];
    summary: {
      totalDrugs: number;
      drugsInStock: number;
      drugsBelowMin: number;
      drugsCritical: number;
      totalValueCDF: number;
    };
  };
}

export interface StockDetail {
  success: boolean;
  data: {
    drug: Drug;
    totalQuantity: number;
    batches: {
      batchNumber: string;
      currentQuantity: number;
      expiryDate: string;
      isQuarantined: boolean;
      daysUntilExpiry: number;
    }[];
    alerts: {
      type: string;
      message: string;
      severity: "warning" | "critical" | "info";
    }[];
  };
}

// ============================================
// TYPES JOUR 2 — PAGINATION
// ============================================

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============================================
// TYPES JOUR 2 — FOURNISSEURS
// ============================================

export interface Supplier {
  id: string;
  code: string;
  name: string;
  type: string;
  isActive: boolean;
}

// ============================================
// TYPES JOUR 2 — EMPLACEMENTS
// ============================================

export interface StorageLocation {
  id: string;
  code: string;
  name: string;
  zone: string | null;
  isActive: boolean;
}

// ============================================
// TYPES JOUR 3 — PATIENTS
// ============================================

export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNKNOWN"

export type AllergySeverity = "MILD" | "MODERATE" | "SEVERE" | "ANAPHYLAXIS"

export interface Patient {
  id: string
  hospitalNumber: string
  externalId: string | null
  firstName: string
  lastName: string
  dateOfBirth: string | null
  gender: Gender
  nationalId: string | null
  phone: string | null
  address: string | null
  commune: string | null
  territoire: string | null
  province: string | null
  insuranceId: string | null
  ongCoverageRef: string | null
  isHivPatient: boolean | null
  arvCode: string | null
  isTbPatient: boolean | null
  tbCode: string | null
  chronicConditions: string[]
  isActive: boolean
  notes: string | null
  _count?: {
    prescriptions: number
    dispensations: number
  }
}

export interface PatientCreateInput {
  hospitalNumber: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: Gender
  nationalId?: string
  phone?: string
  address?: string
  commune?: string
  territoire?: string
  province?: string
  insuranceId?: string
  ongCoverageRef?: string
  isHivPatient?: boolean
  arvCode?: string
  isTbPatient?: boolean
  tbCode?: string
  chronicConditions?: string[]
  isActive?: boolean
  notes?: string
}

export interface PatientUpdateInput extends Partial<PatientCreateInput> {}

export interface PatientAllergy {
  id: string
  patientId: string
  substance: string
  reaction: string | null
  severity: AllergySeverity
  confirmedAt: string | null
  confirmedBy: string | null
  notes: string | null
}

export interface AllergyCreateInput {
  substance: string
  reaction?: string
  severity: AllergySeverity
  confirmedAt?: string
  confirmedBy?: string
  notes?: string
}

// ============================================
// TYPES JOUR 3 — ORDONNANCES
// ============================================

export type PrescriptionStatus = "DRAFT" | "PENDING" | "PARTIALLY_DISPENSED" | "DISPENSED" | "CANCELLED" | "EXPIRED"

export interface Prescription {
  id: string
  prescriptionNumber: string
  patientId: string
  patient?: {
    id: string
    firstName: string
    lastName: string
    hospitalNumber: string
  }
  prescribedById: string
  prescribedBy?: {
    id: string
    firstName: string
    lastName: string
  }
  serviceId: string | null
  service?: {
    id: string
    name: string
  }
  isInpatient: boolean
  admissionRef: string | null
  visitDate: string
  validUntil: string | null
  status: PrescriptionStatus
  diagnosisCode: string | null
  diagnosisLabel: string | null
  notes: string | null
  lines: PrescriptionLine[]
  dispensations: any[]
  createdAt: string
}

export interface PrescriptionLine {
  id: string
  prescriptionId: string
  drugId: string
  drug?: {
    id: string
    name: string
    code: string
  }
  lineNumber: number
  quantityPrescribed: number
  dosage: string
  frequency: string | null
  durationDays: number | null
  route: string | null
  instructions: string | null
  quantityDispensed: number
  isFulfilled: boolean
  substituteUsed: boolean
}

export interface PrescriptionCreateInput {
  patientId: string
  prescribedById?: string
  serviceId?: string
  isInpatient?: boolean
  admissionRef?: string
  diagnosisCode?: string
  diagnosisLabel?: string
  notes?: string
}

export interface PrescriptionLineCreateInput {
  drugId: string
  quantityPrescribed: number
  dosage: string
  frequency?: string
  durationDays?: number
  route?: string
  instructions?: string
}

export interface HospitalService {
  id: string
  code: string
  name: string
  description: string | null
  floor: string | null
  isActive: boolean
}
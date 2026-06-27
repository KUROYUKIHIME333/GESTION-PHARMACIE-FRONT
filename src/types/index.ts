export enum UserRole {
  SUPERADMIN = "SUPERADMIN",
  PHARMACIST = "PHARMACIST",
  PHARMACY_TECH = "PHARMACY_TECH",
  DOCTOR = "DOCTOR",
  NURSE = "NURSE",
  CASHIER = "CASHIER",
  STOCK_MANAGER = "STOCK_MANAGER",
  AUDITOR = "AUDITOR",
}

export interface User {
  id: string;
  employeeId?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  mustChangePassword: boolean;
  serviceId?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ApiError {
  statusCode: number;
  message: string;
  code?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ============================================================================
// TYPES PARTAGÉS — JOUR 2
// ============================================================================

export interface Drug {
  id: string;
  code: string;
  name: string;
  genericName: string | null;
  dci: string;
  form: string;
  category: string;
  isEssential: boolean;
  isControlled: boolean;
  unitPriceCDF: number | null;
  unitPriceUSD: number | null;
  minStockLevel: number;
  criticalStockLevel: number;
  isActive: boolean;
  _count?: { batches: number };
}

export interface DrugDetail extends Drug {
  genericName: string | null;
  therapeuticClass: string | null;
  dosage: string;
  concentration: string | null;
  unitOfDispense: string;
  packSize: number;
  packUnit: string;
  ammNumber: string | null;
  controlledSchedule: string | null;
  isProgramDrug: boolean;
  programName: string | null;
  storageConditions: string[];
  requiresColdChain: boolean;
  minTemp: number | null;
  maxTemp: number | null;
  isPriceRegulated: boolean;
  reorderPoint: number;
  reorderQuantity: number;
  notes: string | null;
}

export interface Batch {
  id: string;
  batchNumber: string;
  currentQuantity: number;
  initialQuantity: number;
  expiryDate: string;
  isQuarantined: boolean;
  isActive: boolean;
  drug: { id: string; name: string; code: string };
  supplier: { id: string; name: string } | null;
}

export interface StockItem {
  drugId: string;
  drugName: string;
  totalQuantity: number;
  isBelowMin: boolean;
  isCritical: boolean;
  activeBatches: number;
  nearestExpiry: string | null;
}

export interface StockDetail {
  drug: DrugDetail;
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
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Enums comme types littéraux
export const DRUG_FORMS = [
  "TABLET",
  "CAPSULE",
  "SYRUP",
  "INJECTABLE_IV",
  "INJECTABLE_IM",
  "INJECTABLE_SC",
  "CREAM",
  "OINTMENT",
  "DROPS_EYE",
  "DROPS_EAR",
  "DROPS_NASAL",
  "SUPPOSITORY",
  "PATCH",
  "POWDER",
  "GRANULES",
  "SOLUTION",
  "SUSPENSION",
  "AEROSOL",
  "GEL",
  "PESSARY",
  "OTHER",
] as const;

export const DRUG_CATEGORIES = [
  "ANTIRETROVIRAL",
  "ANTIMALARIAL",
  "ANTITUBERCULOSIS",
  "VACCINE",
  "ANTIBIOTIC",
  "ANALGESIC",
  "ANTIPYRETIC",
  "ANTI_INFLAMMATORY",
  "ANTIFUNGAL",
  "ANTIPARASITIC",
  "CARDIOVASCULAR",
  "ANTIHYPERTENSIVE",
  "ANTIDIABETIC",
  "RESPIRATORY",
  "GASTROINTESTINAL",
  "NEUROLOGICAL",
  "PSYCHIATRIC",
  "HORMONAL",
  "CONTRACEPTIVE",
  "VITAMINS_SUPPLEMENTS",
  "ANESTHETIC",
  "ANTISEPTIC_DISINFECTANT",
  "MEDICAL_CONSUMABLE",
  "DIAGNOSTIC_REAGENT",
  "OTHER",
] as const;

export const STORAGE_CONDITIONS = [
  "ROOM_TEMP",
  "COOL",
  "REFRIGERATED",
  "FROZEN",
  "PROTECT_LIGHT",
  "PROTECT_HUMIDITY",
  "CONTROLLED_SUBSTANCE",
] as const;

export type DrugForm = typeof DRUG_FORMS[number];
export type DrugCategory = typeof DRUG_CATEGORIES[number];
export type StorageCondition = typeof STORAGE_CONDITIONS[number];

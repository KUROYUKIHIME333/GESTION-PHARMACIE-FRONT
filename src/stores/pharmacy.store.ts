// /frontend/src/stores/pharmacyStore.ts

import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ============================================================================
// TYPES — Domaine Médicaments (Drugs)
// ============================================================================

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
  _count?: { batches: number };
  createdAt: string;
  updatedAt: string;
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

// ============================================================================
// TYPES — Domaine Lots (Batches)
// ============================================================================

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
  initialQuantity: number;
  currentQuantity: number;
  expiryDate: string;
  manufacturingDate: string | null;
  purchasePriceCDF: number | null;
  purchasePriceUSD: number | null;
  locationId: string | null;
  coldChainVerified: boolean;
  isQuarantined: boolean;
  quarantineReason: string | null;
  isActive: boolean;
  receivedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BatchCreateInput {
  batchNumber: string;
  drugId: string;
  supplierId?: string;
  initialQuantity: number;
  expiryDate: string; // ISO date
  manufacturingDate?: string;
  purchasePriceCDF?: number;
  purchasePriceUSD?: number;
  locationId?: string;
  coldChainVerified?: boolean;
  notes?: string;
}

export interface BatchQuarantineInput {
  isQuarantined: boolean;
  quarantineReason?: string;
}

// ============================================================================
// TYPES — Domaine Stock
// ============================================================================

export interface StockOverviewItem {
  drugId: string;
  drugName: string;
  totalQuantity: number;
  isBelowMin: boolean;
  isCritical: boolean;
  activeBatches: number;
  nearestExpiry: string | null;
}

export interface StockOverview {
  items: StockOverviewItem[];
  summary: {
    totalDrugs: number;
    drugsInStock: number;
    drugsBelowMin: number;
    drugsCritical: number;
    totalValueCDF: number;
  };
}

export interface StockDrugDetail {
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
}

// ============================================================================
// TYPES — Domaine Patients
// ============================================================================

export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNKNOWN";

export interface Patient {
  id: string;
  hospitalNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  gender: Gender;
  nationalId: string | null;
  phone: string | null;
  address: string | null;
  commune: string | null;
  territoire: string | null;
  province: string | null;
  insuranceId: string | null;
  ongCoverageRef: string | null;
  isHivPatient: boolean | null;
  arvCode: string | null;
  isTbPatient: boolean | null;
  tbCode: string | null;
  chronicConditions: string[];
  isActive: boolean;
  notes: string | null;
  _count?: {
    prescriptions: number;
    dispensations: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PatientCreateInput {
  hospitalNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender: Gender;
  nationalId?: string;
  phone?: string;
  address?: string;
  commune?: string;
  territoire?: string;
  province?: string;
  insuranceId?: string;
  ongCoverageRef?: string;
  isHivPatient?: boolean;
  arvCode?: string;
  isTbPatient?: boolean;
  tbCode?: string;
  chronicConditions?: string[];
  isActive?: boolean;
  notes?: string;
}

// ============================================================================
// TYPES — Domaine Allergies
// ============================================================================

export type AllergySeverity = "MILD" | "MODERATE" | "SEVERE" | "ANAPHYLAXIS";

export interface PatientAllergy {
  id: string;
  patientId: string;
  substance: string;
  reaction: string | null;
  severity: AllergySeverity;
  confirmedAt: string | null;
  confirmedBy: string | null;
  notes: string | null;
  createdAt: string;
}

export interface AllergyCreateInput {
  substance: string;
  reaction?: string;
  severity: AllergySeverity;
  confirmedAt?: string;
  confirmedBy?: string;
  notes?: string;
}

// ============================================================================
// TYPES — Domaine Ordonnances (Prescriptions)
// ============================================================================

export type PrescriptionStatus =
  | "DRAFT"
  | "PENDING"
  | "PARTIALLY_DISPENSED"
  | "DISPENSED"
  | "CANCELLED"
  | "EXPIRED";

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patient: Patient;
  prescribedById: string;
  prescribedBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  serviceId: string | null;
  service: {
    id: string;
    name: string;
    code: string;
  } | null;
  isInpatient: boolean;
  admissionRef: string | null;
  visitDate: string;
  validUntil: string | null;
  status: PrescriptionStatus;
  diagnosisCode: string | null;
  diagnosisLabel: string | null;
  lines: PrescriptionLine[];
  dispensations: Dispensation[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionLine {
  id: string;
  prescriptionId: string;
  drugId: string;
  drug: Drug;
  lineNumber: number;
  quantityPrescribed: number;
  dosage: string;
  frequency: string | null;
  durationDays: number | null;
  route: string | null;
  instructions: string | null;
  quantityDispensed: number;
  isFulfilled: boolean;
  substituteUsed: boolean;
  createdAt: string;
}

export interface PrescriptionCreateInput {
  patientId: string;
  prescribedById?: string;
  serviceId?: string;
  isInpatient?: boolean;
  admissionRef?: string;
  diagnosisCode?: string;
  diagnosisLabel?: string;
  notes?: string;
}

export interface PrescriptionLineCreateInput {
  drugId: string;
  quantityPrescribed: number;
  dosage: string;
  frequency?: string;
  durationDays?: number;
  route?: string;
  instructions?: string;
}

export interface PrescriptionStatusUpdate {
  status: PrescriptionStatus;
}

// ============================================================================
// TYPES — Domaine Dispensations
// ============================================================================

export type PaymentMethod =
  | "CASH_CDF"
  | "CASH_USD"
  | "MOBILE_MONEY"
  | "INSURANCE"
  | "ONG_COVERAGE"
  | "CREDIT"
  | "FREE";

export interface Dispensation {
  id: string;
  dispensationNumber: string;
  patientId: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    hospitalNumber: string;
  };
  prescriptionId: string | null;
  prescription: {
    id: string;
    prescriptionNumber: string;
  } | null;
  dispensedById: string;
  dispensedBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  dispensedAt: string;
  paymentMethod: PaymentMethod;
  totalAmountCDF: number | null;
  totalAmountUSD: number | null;
  lineCount: number;
  lines: DispensationLine[];
  notes: string | null;
  createdAt: string;
}

export interface DispensationLine {
  id: string;
  dispensationId: string;
  batchId: string;
  batch: {
    batchNumber: string;
    expiryDate: string;
  };
  drugId: string;
  drug: {
    id: string;
    name: string;
    code: string;
  };
  quantity: number;
  unitPriceCDF: number | null;
  unitPriceUSD: number | null;
  totalPriceCDF: number | null;
  totalPriceUSD: number | null;
  createdAt: string;
}

export interface DispensationCreateInput {
  patientId: string;
  prescriptionId?: string;
  paymentMethod: PaymentMethod;
  totalAmountCDF?: number;
  totalAmountUSD?: number;
  amountPaidCDF?: number;
  amountPaidUSD?: number;
  insuranceCoverage?: number;
  receiptNumber?: string;
  lines: DispensationLineCreateInput[];
  notes?: string;
}

export interface DispensationLineCreateInput {
  prescriptionLineId?: string;
  drugId: string;
  quantity: number;
}

// ============================================================================
// TYPES — Domaine Alertes
// ============================================================================

export type AlertType =
  | "LOW_STOCK"
  | "CRITICAL_STOCK"
  | "EXPIRY_SOON"
  | "EXPIRED"
  | "COLD_CHAIN_BREACH"
  | "CONTROLLED_REORDER"
  | "INVENTORY_DISCREPANCY"
  | "LICENSE_EXPIRY";

export type AlertStatus = "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED" | "IGNORED";

export interface StockAlert {
  id: string;
  type: AlertType;
  status: AlertStatus;
  drugId: string;
  drugName: string;
  drugCode: string;
  batchId: string | null;
  batchNumber: string | null;
  message: string;
  threshold: number | null;
  currentValue: number | null;
  severity: "critical" | "warning" | "info";
  createdAt: string;
  acknowledgedAt: string | null;
  acknowledgedBy: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

export interface AlertAcknowledgeInput {
  status: AlertStatus;
  comment?: string;
}

export interface AlertSummary {
  totalActive: number;
  critical: number;
  warning: number;
  info: number;
  byType: Record<string, number>;
}

// ============================================================================
// TYPES — Domaine Dashboard
// ============================================================================

export interface DashboardStats {
  alerts: AlertSummary;
  stock: {
    totalDrugs: number;
    drugsInStock: number;
    drugsCritical: number;
    drugsLow: number;
    totalValueCDF: number;
    totalValueUSD: number;
  };
  expiries: {
    expired: number;
    critical30Days: number;
    warning90Days: number;
  };
  activity: {
    dispensationsToday: number;
    dispensationsWeek: number;
    prescriptionsToday: number;
    prescriptionsWeek: number;
    newPatientsToday: number;
    newPatientsWeek: number;
  };
  counts: {
    totalPatients: number;
    totalPrescriptions: number;
    totalDispensations: number;
    totalDrugs: number;
    totalBatches: number;
  };
}

// ============================================================================
// TYPES — Pagination & UI State
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UIState {
  isLoading: boolean;
  error: string | null;
  selectedId: string | null;
  filters: Record<string, unknown>;
}

// ============================================================================
// ÉTATS PAR DOMAINE
// ============================================================================

interface DrugState {
  drugs: Drug[];
  selectedDrug: Drug | null;
  drugPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  drugFilters: {
    search?: string;
    category?: DrugCategory;
    isEssential?: boolean;
    isControlled?: boolean;
    isActive?: boolean;
  };
  drugUI: UIState;
}

interface BatchState {
  batches: Batch[];
  selectedBatch: Batch | null;
  batchPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  batchFilters: {
    search?: string;
    drugId?: string;
    isQuarantined?: boolean;
    isActive?: boolean;
    expiryBefore?: string;
  };
  batchUI: UIState;
}

interface StockState {
  stockOverview: StockOverview | null;
  selectedStockDetail: StockDrugDetail | null;
  stockUI: UIState;
}

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  patientAllergies: PatientAllergy[];
  patientPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  patientFilters: {
    search?: string;
    isActive?: boolean;
  };
  patientUI: UIState;
}

interface PrescriptionState {
  prescriptions: Prescription[];
  selectedPrescription: Prescription | null;
  prescriptionPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  prescriptionFilters: {
    status?: PrescriptionStatus;
    patientId?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  prescriptionUI: UIState;
}

interface DispensationState {
  dispensations: Dispensation[];
  selectedDispensation: Dispensation | null;
  currentDispensationDraft: Partial<DispensationCreateInput> | null;
  dispensationPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  dispensationFilters: {
    patientId?: string;
    dateFrom?: string;
    dateTo?: string;
    paymentMethod?: PaymentMethod;
  };
  dispensationUI: UIState;
}

interface AlertState {
  alerts: StockAlert[];
  alertSummary: AlertSummary | null;
  alertPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  alertFilters: {
    type?: AlertType;
    status?: AlertStatus;
    severity?: "critical" | "warning" | "info";
  };
  alertUI: UIState;
}

interface DashboardState {
  stats: DashboardStats | null;
  dashboardUI: UIState;
}

// ============================================================================
// STORE COMPLET
// ============================================================================

export interface PharmacyStore
  extends DrugState,
    BatchState,
    StockState,
    PatientState,
    PrescriptionState,
    DispensationState,
    AlertState,
    DashboardState {
  // --- Actions Drugs ---
  setDrugs: (drugs: Drug[], pagination?: DrugState["drugPagination"]) => void;
  setSelectedDrug: (drug: Drug | null) => void;
  addDrug: (drug: Drug) => void;
  updateDrug: (id: string, updates: Partial<Drug>) => void;
  removeDrug: (id: string) => void;
  setDrugFilters: (filters: DrugState["drugFilters"]) => void;
  setDrugLoading: (loading: boolean) => void;
  setDrugError: (error: string | null) => void;

  // --- Actions Batches ---
  setBatches: (
    batches: Batch[],
    pagination?: BatchState["batchPagination"]
  ) => void;
  setSelectedBatch: (batch: Batch | null) => void;
  addBatch: (batch: Batch) => void;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
  setBatchFilters: (filters: BatchState["batchFilters"]) => void;
  setBatchLoading: (loading: boolean) => void;
  setBatchError: (error: string | null) => void;

  // --- Actions Stock ---
  setStockOverview: (overview: StockOverview) => void;
  setSelectedStockDetail: (detail: StockDrugDetail | null) => void;
  setStockLoading: (loading: boolean) => void;
  setStockError: (error: string | null) => void;

  // --- Actions Patients ---
  setPatients: (
    patients: Patient[],
    pagination?: PatientState["patientPagination"]
  ) => void;
  setSelectedPatient: (patient: Patient | null) => void;
  setPatientAllergies: (allergies: PatientAllergy[]) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  addPatientAllergy: (allergy: PatientAllergy) => void;
  setPatientFilters: (filters: PatientState["patientFilters"]) => void;
  setPatientLoading: (loading: boolean) => void;
  setPatientError: (error: string | null) => void;

  // --- Actions Prescriptions ---
  setPrescriptions: (
    prescriptions: Prescription[],
    pagination?: PrescriptionState["prescriptionPagination"]
  ) => void;
  setSelectedPrescription: (prescription: Prescription | null) => void;
  addPrescription: (prescription: Prescription) => void;
  updatePrescription: (id: string, updates: Partial<Prescription>) => void;
  addPrescriptionLine: (prescriptionId: string, line: PrescriptionLine) => void;
  setPrescriptionFilters: (
    filters: PrescriptionState["prescriptionFilters"]
  ) => void;
  setPrescriptionLoading: (loading: boolean) => void;
  setPrescriptionError: (error: string | null) => void;

  // --- Actions Dispensations ---
  setDispensations: (
    dispensations: Dispensation[],
    pagination?: DispensationState["dispensationPagination"]
  ) => void;
  setSelectedDispensation: (dispensation: Dispensation | null) => void;
  setDispensationDraft: (
    draft: Partial<DispensationCreateInput> | null
  ) => void;
  addDispensation: (dispensation: Dispensation) => void;
  addDispensationLine: (dispensationId: string, line: DispensationLine) => void;
  setDispensationFilters: (
    filters: DispensationState["dispensationFilters"]
  ) => void;
  setDispensationLoading: (loading: boolean) => void;
  setDispensationError: (error: string | null) => void;

  // --- Actions Alerts ---
  setAlerts: (
    alerts: StockAlert[],
    pagination?: AlertState["alertPagination"]
  ) => void;
  setAlertSummary: (summary: AlertSummary) => void;
  updateAlert: (id: string, updates: Partial<StockAlert>) => void;
  setAlertFilters: (filters: AlertState["alertFilters"]) => void;
  setAlertLoading: (loading: boolean) => void;
  setAlertError: (error: string | null) => void;

  // --- Actions Dashboard ---
  setDashboardStats: (stats: DashboardStats) => void;
  setDashboardLoading: (loading: boolean) => void;
  setDashboardError: (error: string | null) => void;

  // --- Actions globales ---
  resetAllErrors: () => void;
  resetStore: () => void;
}

// ============================================================================
// ÉTAT INITIAL
// ============================================================================

const initialDrugState: DrugState = {
  drugs: [],
  selectedDrug: null,
  drugPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  drugFilters: {},
  drugUI: { isLoading: false, error: null, selectedId: null, filters: {} },
};

const initialBatchState: BatchState = {
  batches: [],
  selectedBatch: null,
  batchPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  batchFilters: {},
  batchUI: { isLoading: false, error: null, selectedId: null, filters: {} },
};

const initialStockState: StockState = {
  stockOverview: null,
  selectedStockDetail: null,
  stockUI: { isLoading: false, error: null, selectedId: null, filters: {} },
};

const initialPatientState: PatientState = {
  patients: [],
  selectedPatient: null,
  patientAllergies: [],
  patientPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  patientFilters: {},
  patientUI: { isLoading: false, error: null, selectedId: null, filters: {} },
};

const initialPrescriptionState: PrescriptionState = {
  prescriptions: [],
  selectedPrescription: null,
  prescriptionPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  prescriptionFilters: {},
  prescriptionUI: {
    isLoading: false,
    error: null,
    selectedId: null,
    filters: {},
  },
};

const initialDispensationState: DispensationState = {
  dispensations: [],
  selectedDispensation: null,
  currentDispensationDraft: null,
  dispensationPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  dispensationFilters: {},
  dispensationUI: {
    isLoading: false,
    error: null,
    selectedId: null,
    filters: {},
  },
};

const initialAlertState: AlertState = {
  alerts: [],
  alertSummary: null,
  alertPagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  alertFilters: {},
  alertUI: { isLoading: false, error: null, selectedId: null, filters: {} },
};

const initialDashboardState: DashboardState = {
  stats: null,
  dashboardUI: { isLoading: false, error: null, selectedId: null, filters: {} },
};

// ============================================================================
// STORE FACTORY
// ============================================================================

export const usePharmacyStore = create<PharmacyStore>()(
  devtools(
    (set) => ({
      // --- État initial ---
      ...initialDrugState,
      ...initialBatchState,
      ...initialStockState,
      ...initialPatientState,
      ...initialPrescriptionState,
      ...initialDispensationState,
      ...initialAlertState,
      ...initialDashboardState,

      // ==========================================================================
      // DRUGS
      // ==========================================================================
      setDrugs: (drugs, pagination) =>
        set(
          (state) => ({
            drugs,
            drugPagination: pagination ?? state.drugPagination,
          }),
          false,
          "drugs/setDrugs"
        ),

      setSelectedDrug: (drug) =>
        set({ selectedDrug: drug }, false, "drugs/setSelectedDrug"),

      addDrug: (drug) =>
        set(
          (state) => ({
            drugs: [drug, ...state.drugs],
            drugPagination: {
              ...state.drugPagination,
              total: state.drugPagination.total + 1,
            },
          }),
          false,
          "drugs/addDrug"
        ),

      updateDrug: (id, updates) =>
        set(
          (state) => ({
            drugs: state.drugs.map((d) =>
              d.id === id ? { ...d, ...updates } : d
            ),
            selectedDrug:
              state.selectedDrug?.id === id
                ? { ...state.selectedDrug, ...updates }
                : state.selectedDrug,
          }),
          false,
          "drugs/updateDrug"
        ),

      removeDrug: (id) =>
        set(
          (state) => ({
            drugs: state.drugs.filter((d) => d.id !== id),
            selectedDrug:
              state.selectedDrug?.id === id ? null : state.selectedDrug,
            drugPagination: {
              ...state.drugPagination,
              total: Math.max(0, state.drugPagination.total - 1),
            },
          }),
          false,
          "drugs/removeDrug"
        ),

      setDrugFilters: (filters) =>
        set({ drugFilters: filters }, false, "drugs/setFilters"),

      setDrugLoading: (loading) =>
        set(
          (state) => ({
            drugUI: { ...state.drugUI, isLoading: loading },
          }),
          false,
          "drugs/setLoading"
        ),

      setDrugError: (error) =>
        set(
          (state) => ({
            drugUI: { ...state.drugUI, error },
          }),
          false,
          "drugs/setError"
        ),

      // ==========================================================================
      // BATCHES
      // ==========================================================================
      setBatches: (batches, pagination) =>
        set(
          (state) => ({
            batches,
            batchPagination: pagination ?? state.batchPagination,
          }),
          false,
          "batches/setBatches"
        ),

      setSelectedBatch: (batch) =>
        set({ selectedBatch: batch }, false, "batches/setSelectedBatch"),

      addBatch: (batch) =>
        set(
          (state) => ({
            batches: [batch, ...state.batches],
            batchPagination: {
              ...state.batchPagination,
              total: state.batchPagination.total + 1,
            },
          }),
          false,
          "batches/addBatch"
        ),

      updateBatch: (id, updates) =>
        set(
          (state) => ({
            batches: state.batches.map((b) =>
              b.id === id ? { ...b, ...updates } : b
            ),
            selectedBatch:
              state.selectedBatch?.id === id
                ? { ...state.selectedBatch, ...updates }
                : state.selectedBatch,
          }),
          false,
          "batches/updateBatch"
        ),

      setBatchFilters: (filters) =>
        set({ batchFilters: filters }, false, "batches/setFilters"),

      setBatchLoading: (loading) =>
        set(
          (state) => ({
            batchUI: { ...state.batchUI, isLoading: loading },
          }),
          false,
          "batches/setLoading"
        ),

      setBatchError: (error) =>
        set(
          (state) => ({
            batchUI: { ...state.batchUI, error },
          }),
          false,
          "batches/setError"
        ),

      // ==========================================================================
      // STOCK
      // ==========================================================================
      setStockOverview: (overview) =>
        set({ stockOverview: overview }, false, "stock/setOverview"),

      setSelectedStockDetail: (detail) =>
        set({ selectedStockDetail: detail }, false, "stock/setSelectedDetail"),

      setStockLoading: (loading) =>
        set(
          (state) => ({
            stockUI: { ...state.stockUI, isLoading: loading },
          }),
          false,
          "stock/setLoading"
        ),

      setStockError: (error) =>
        set(
          (state) => ({
            stockUI: { ...state.stockUI, error },
          }),
          false,
          "stock/setError"
        ),

      // ==========================================================================
      // PATIENTS
      // ==========================================================================
      setPatients: (patients, pagination) =>
        set(
          (state) => ({
            patients,
            patientPagination: pagination ?? state.patientPagination,
          }),
          false,
          "patients/setPatients"
        ),

      setSelectedPatient: (patient) =>
        set({ selectedPatient: patient }, false, "patients/setSelectedPatient"),

      setPatientAllergies: (allergies) =>
        set({ patientAllergies: allergies }, false, "patients/setAllergies"),

      addPatient: (patient) =>
        set(
          (state) => ({
            patients: [patient, ...state.patients],
            patientPagination: {
              ...state.patientPagination,
              total: state.patientPagination.total + 1,
            },
          }),
          false,
          "patients/addPatient"
        ),

      updatePatient: (id, updates) =>
        set(
          (state) => ({
            patients: state.patients.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
            selectedPatient:
              state.selectedPatient?.id === id
                ? { ...state.selectedPatient, ...updates }
                : state.selectedPatient,
          }),
          false,
          "patients/updatePatient"
        ),

      addPatientAllergy: (allergy) =>
        set(
          (state) => ({
            patientAllergies: [...state.patientAllergies, allergy],
          }),
          false,
          "patients/addAllergy"
        ),

      setPatientFilters: (filters) =>
        set({ patientFilters: filters }, false, "patients/setFilters"),

      setPatientLoading: (loading) =>
        set(
          (state) => ({
            patientUI: { ...state.patientUI, isLoading: loading },
          }),
          false,
          "patients/setLoading"
        ),

      setPatientError: (error) =>
        set(
          (state) => ({
            patientUI: { ...state.patientUI, error },
          }),
          false,
          "patients/setError"
        ),

      // ==========================================================================
      // PRESCRIPTIONS
      // ==========================================================================
      setPrescriptions: (prescriptions, pagination) =>
        set(
          (state) => ({
            prescriptions,
            prescriptionPagination: pagination ?? state.prescriptionPagination,
          }),
          false,
          "prescriptions/setPrescriptions"
        ),

      setSelectedPrescription: (prescription) =>
        set(
          { selectedPrescription: prescription },
          false,
          "prescriptions/setSelected"
        ),

      addPrescription: (prescription) =>
        set(
          (state) => ({
            prescriptions: [prescription, ...state.prescriptions],
            prescriptionPagination: {
              ...state.prescriptionPagination,
              total: state.prescriptionPagination.total + 1,
            },
          }),
          false,
          "prescriptions/addPrescription"
        ),

      updatePrescription: (id, updates) =>
        set(
          (state) => ({
            prescriptions: state.prescriptions.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
            selectedPrescription:
              state.selectedPrescription?.id === id
                ? { ...state.selectedPrescription, ...updates }
                : state.selectedPrescription,
          }),
          false,
          "prescriptions/updatePrescription"
        ),

      addPrescriptionLine: (prescriptionId, line) =>
        set(
          (state) => ({
            prescriptions: state.prescriptions.map((p) =>
              p.id === prescriptionId ? { ...p, lines: [...p.lines, line] } : p
            ),
            selectedPrescription:
              state.selectedPrescription?.id === prescriptionId
                ? {
                    ...state.selectedPrescription,
                    lines: [...state.selectedPrescription.lines, line],
                  }
                : state.selectedPrescription,
          }),
          false,
          "prescriptions/addLine"
        ),

      setPrescriptionFilters: (filters) =>
        set(
          { prescriptionFilters: filters },
          false,
          "prescriptions/setFilters"
        ),

      setPrescriptionLoading: (loading) =>
        set(
          (state) => ({
            prescriptionUI: { ...state.prescriptionUI, isLoading: loading },
          }),
          false,
          "prescriptions/setLoading"
        ),

      setPrescriptionError: (error) =>
        set(
          (state) => ({
            prescriptionUI: { ...state.prescriptionUI, error },
          }),
          false,
          "prescriptions/setError"
        ),

      // ==========================================================================
      // DISPENSATIONS
      // ==========================================================================
      setDispensations: (dispensations, pagination) =>
        set(
          (state) => ({
            dispensations,
            dispensationPagination: pagination ?? state.dispensationPagination,
          }),
          false,
          "dispensations/setDispensations"
        ),

      setSelectedDispensation: (dispensation) =>
        set(
          { selectedDispensation: dispensation },
          false,
          "dispensations/setSelected"
        ),

      setDispensationDraft: (draft) =>
        set(
          { currentDispensationDraft: draft },
          false,
          "dispensations/setDraft"
        ),

      addDispensation: (dispensation) =>
        set(
          (state) => ({
            dispensations: [dispensation, ...state.dispensations],
            currentDispensationDraft: null,
            dispensationPagination: {
              ...state.dispensationPagination,
              total: state.dispensationPagination.total + 1,
            },
          }),
          false,
          "dispensations/addDispensation"
        ),

      addDispensationLine: (dispensationId, line) =>
        set(
          (state) => ({
            dispensations: state.dispensations.map((d) =>
              d.id === dispensationId
                ? {
                    ...d,
                    lines: [...d.lines, line],
                    lineCount: d.lineCount + 1,
                  }
                : d
            ),
            selectedDispensation:
              state.selectedDispensation?.id === dispensationId
                ? {
                    ...state.selectedDispensation,
                    lines: [...state.selectedDispensation.lines, line],
                    lineCount: state.selectedDispensation.lineCount + 1,
                  }
                : state.selectedDispensation,
          }),
          false,
          "dispensations/addLine"
        ),

      setDispensationFilters: (filters) =>
        set(
          { dispensationFilters: filters },
          false,
          "dispensations/setFilters"
        ),

      setDispensationLoading: (loading) =>
        set(
          (state) => ({
            dispensationUI: { ...state.dispensationUI, isLoading: loading },
          }),
          false,
          "dispensations/setLoading"
        ),

      setDispensationError: (error) =>
        set(
          (state) => ({
            dispensationUI: { ...state.dispensationUI, error },
          }),
          false,
          "dispensations/setError"
        ),

      // ==========================================================================
      // ALERTS
      // ==========================================================================
      setAlerts: (alerts, pagination) =>
        set(
          (state) => ({
            alerts,
            alertPagination: pagination ?? state.alertPagination,
          }),
          false,
          "alerts/setAlerts"
        ),

      setAlertSummary: (summary) =>
        set({ alertSummary: summary }, false, "alerts/setSummary"),

      updateAlert: (id, updates) =>
        set(
          (state) => ({
            alerts: state.alerts.map((a) =>
              a.id === id ? { ...a, ...updates } : a
            ),
          }),
          false,
          "alerts/updateAlert"
        ),

      setAlertFilters: (filters) =>
        set({ alertFilters: filters }, false, "alerts/setFilters"),

      setAlertLoading: (loading) =>
        set(
          (state) => ({
            alertUI: { ...state.alertUI, isLoading: loading },
          }),
          false,
          "alerts/setLoading"
        ),

      setAlertError: (error) =>
        set(
          (state) => ({
            alertUI: { ...state.alertUI, error: error },
          }),
          false,
          "alerts/setError"
        ),

      // ==========================================================================
      // DASHBOARD
      // ==========================================================================
      setDashboardStats: (stats) => set({ stats }, false, "dashboard/setStats"),

      setDashboardLoading: (loading) =>
        set(
          (state) => ({
            dashboardUI: { ...state.dashboardUI, isLoading: loading },
          }),
          false,
          "dashboard/setLoading"
        ),

      setDashboardError: (error) =>
        set(
          (state) => ({
            dashboardUI: { ...state.dashboardUI, error },
          }),
          false,
          "dashboard/setError"
        ),

      // ==========================================================================
      // GLOBAL
      // ==========================================================================
      resetAllErrors: () =>
        set(
          (state) => ({
            drugUI: { ...state.drugUI, error: null },
            batchUI: { ...state.batchUI, error: null },
            stockUI: { ...state.stockUI, error: null },
            patientUI: { ...state.patientUI, error: null },
            prescriptionUI: { ...state.prescriptionUI, error: null },
            dispensationUI: { ...state.dispensationUI, error: null },
            alertUI: { ...state.alertUI, error: null },
            dashboardUI: { ...state.dashboardUI, error: null },
          }),
          false,
          "global/resetAllErrors"
        ),

      resetStore: () =>
        set(
          {
            ...initialDrugState,
            ...initialBatchState,
            ...initialStockState,
            ...initialPatientState,
            ...initialPrescriptionState,
            ...initialDispensationState,
            ...initialAlertState,
            ...initialDashboardState,
          },
          false,
          "global/resetStore"
        ),
    }),
    {
      name: "pharmacy-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

// ============================================================================
// SELECTORS (hooks utilitaires pour éviter les re-renders inutiles)
// ============================================================================

export const useDrugList = () => usePharmacyStore((s) => s.drugs);
export const useSelectedDrug = () => usePharmacyStore((s) => s.selectedDrug);
export const useDrugLoading = () => usePharmacyStore((s) => s.drugUI.isLoading);
export const useDrugError = () => usePharmacyStore((s) => s.drugUI.error);

export const useBatchList = () => usePharmacyStore((s) => s.batches);
export const useSelectedBatch = () => usePharmacyStore((s) => s.selectedBatch);
export const useBatchLoading = () =>
  usePharmacyStore((s) => s.batchUI.isLoading);

export const useStockOverview = () => usePharmacyStore((s) => s.stockOverview);
export const useStockDetail = () =>
  usePharmacyStore((s) => s.selectedStockDetail);

export const usePatientList = () => usePharmacyStore((s) => s.patients);
export const useSelectedPatient = () =>
  usePharmacyStore((s) => s.selectedPatient);
export const usePatientAllergies = () =>
  usePharmacyStore((s) => s.patientAllergies);

export const usePrescriptionList = () =>
  usePharmacyStore((s) => s.prescriptions);
export const useSelectedPrescription = () =>
  usePharmacyStore((s) => s.selectedPrescription);

export const useDispensationList = () =>
  usePharmacyStore((s) => s.dispensations);
export const useSelectedDispensation = () =>
  usePharmacyStore((s) => s.selectedDispensation);
export const useDispensationDraft = () =>
  usePharmacyStore((s) => s.currentDispensationDraft);

export const useAlertList = () => usePharmacyStore((s) => s.alerts);
export const useAlertSummary = () => usePharmacyStore((s) => s.alertSummary);

export const useDashboardStats = () => usePharmacyStore((s) => s.stats);
export const useDashboardLoading = () =>
  usePharmacyStore((s) => s.dashboardUI.isLoading);

// ============================================================================
// UTILITAIRE : Nombre total d'alertes actives (pour badge sidebar)
// ============================================================================

export const useActiveAlertCount = () =>
  usePharmacyStore(
    (s) => s.alertSummary?.critical ?? 0 + (s.alertSummary?.warning ?? 0)
  );

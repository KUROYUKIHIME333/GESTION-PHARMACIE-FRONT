import { create } from "zustand";
import {
  Prescription,
  PrescriptionCreateInput,
  PrescriptionLineCreateInput,
  PrescriptionStatusUpdateInput,
  PrescriptionsResponse,
  PrescriptionCreateResponse,
  PrescriptionDetailResponse,
  PrescriptionLineCreateResponse,
} from "@/src/schemas/prescription.schemas";
import { api } from "../lib/api";
import { API_ENDPOINTS } from "../lib/constants";

interface PrescriptionState {
  prescriptions: Prescription[] | null;
  currentPrescription: Prescription | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isFetched: boolean;
  isError: boolean;
  lastError: string | null;
  lastFetched: Date | null;
}

interface PrescriptionStore extends PrescriptionState {
  setPrescriptions: (prescriptions: Prescription[] | null) => void;
  setCurrentPrescription: (prescription: Prescription | null) => void;
  setPrescriptionsLoading: (loading: boolean) => void;
  setPrescriptionsError: (isError: boolean) => void;
  setPrescriptionsIsFetched: (fetched: boolean) => void;
  setPrescriptionsLastError: (lastError: string | null) => void;
  resetPrescriptionsErrors: () => void;

  fetchPrescriptions: () => Promise<void>;
  fetchPrescription: (id: string) => Promise<void>;
  createPrescription: (
    prescription: PrescriptionCreateInput
  ) => Promise<Prescription | null>;
  addPrescriptionLine: (
    prescriptionId: string,
    line: PrescriptionLineCreateInput
  ) => Promise<void>;
  updatePrescriptionStatus: (
    prescriptionId: string,
    status: PrescriptionStatusUpdateInput
  ) => Promise<void>;

  resetPrescriptionsStore: () => void;
}

const initialPrescriptionState: PrescriptionState = {
  prescriptions: null,
  currentPrescription: null,
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  isLoading: false,
  isFetched: false,
  isError: false,
  lastError: null,
  lastFetched: null,
};

export const usePrescriptionStore = create<PrescriptionStore>((set) => ({
  ...initialPrescriptionState,

  setPrescriptions: (prescriptions) => set({ prescriptions }),
  setCurrentPrescription: (prescription) =>
    set({ currentPrescription: prescription }),
  setPrescriptionsLoading: (isLoading) => set({ isLoading }),
  setPrescriptionsError: (isError) => set({ isError }),
  setPrescriptionsIsFetched: (isFetched) => set({ isFetched }),
  setPrescriptionsLastError: (lastError) => set({ lastError }),
  resetPrescriptionsErrors: () => set({ isError: false, lastError: null }),
  resetPrescriptionsStore: () => set(initialPrescriptionState),

  fetchPrescriptions: async () => {
    set({ isLoading: true, isError: false });
    const genericMessage = "Erreur lors de la récupération des ordonnances";
    try {
      const response = (await api.get(
        API_ENDPOINTS.prescriptions
      )) as PrescriptionsResponse;
      if (response.success && response.data) {
        const { prescriptions, total, page, limit, totalPages } = response.data;
        set({
          prescriptions,
          total,
          page,
          limit,
          totalPages,
          isLoading: false,
          isFetched: true,
          lastFetched: new Date(),
        });
      } else {
        set({
          isLoading: false,
          isError: true,
          lastError: response.message || genericMessage,
        });
      }
    } catch (error: unknown) {
      let message = genericMessage;
      if (error instanceof Error) message = error.message;
      set({ isLoading: false, isError: true, lastError: message });
    }
  },

  fetchPrescription: async (id: string) => {
    set({ isLoading: true, isError: false });
    const genericMessage = "Erreur lors de la récupération de l'ordonnance";
    try {
      const response = (await api.get(
        `${API_ENDPOINTS.prescriptions}/${id}`
      )) as PrescriptionDetailResponse;
      if (response.success && response.data) {
        set({
          currentPrescription: response.data,
          isLoading: false,
          isFetched: true,
        });
      } else {
        set({
          isLoading: false,
          isError: true,
          lastError: response.message || genericMessage,
        });
      }
    } catch (error: unknown) {
      let message = genericMessage;
      if (error instanceof Error) message = error.message;
      set({ isLoading: false, isError: true, lastError: message });
    }
  },

  createPrescription: async (prescriptionData: PrescriptionCreateInput) => {
    set({ isLoading: true, isError: false });
    const genericError = "Erreur lors de la création de l'ordonnance";
    try {
      const response = (await api.post(
        API_ENDPOINTS.prescriptions,
        prescriptionData
      )) as PrescriptionCreateResponse;
      if (response.success && response.data) {
        const newPrescription = response.data;
        set((state) => ({
          prescriptions: state.prescriptions
            ? [newPrescription, ...state.prescriptions]
            : [newPrescription],
          currentPrescription: newPrescription,
          isLoading: false,
        }));
        return newPrescription;
      } else {
        set({
          isLoading: false,
          isError: true,
          lastError: response.message || genericError,
        });
        return null;
      }
    } catch (error: unknown) {
      let message = genericError;
      if (error instanceof Error) message = error.message;
      set({ isLoading: false, isError: true, lastError: message });
      return null;
    }
  },

  addPrescriptionLine: async (
    prescriptionId: string,
    lineData: PrescriptionLineCreateInput
  ) => {
    set({ isLoading: true, isError: false });
    const genericError = "Erreur lors de l'ajout de la ligne";
    try {
      const response = (await api.post(
        `${API_ENDPOINTS.prescriptions}/${prescriptionId}/lines`,
        lineData
      )) as PrescriptionLineCreateResponse;
      if (response.success) {
        // Rafraîchir l'ordonnance
        const presResponse = (await api.get(
          `${API_ENDPOINTS.prescriptions}/${prescriptionId}`
        )) as PrescriptionDetailResponse;
        if (presResponse.success && presResponse.data) {
          set((state) => ({
            currentPrescription: presResponse.data,
            prescriptions:
              state.prescriptions?.map((p) =>
                p.id === prescriptionId ? presResponse.data! : p
              ) || null,
            isLoading: false,
          }));
        }
      } else {
        set({
          isLoading: false,
          isError: true,
          lastError: response.message || genericError,
        });
      }
    } catch (error: unknown) {
      let message = genericError;
      if (error instanceof Error) message = error.message;
      set({ isLoading: false, isError: true, lastError: message });
    }
  },

  updatePrescriptionStatus: async (
    prescriptionId: string,
    statusData: PrescriptionStatusUpdateInput
  ) => {
    set({ isLoading: true, isError: false });
    const genericError = "Erreur lors de la mise à jour du statut";
    try {
      const response = (await api.put(
        `${API_ENDPOINTS.prescriptions}/${prescriptionId}/status`,
        statusData
      )) as PrescriptionCreateResponse;
      if (response.success && response.data) {
        const updated = response.data;
        set((state) => ({
          currentPrescription:
            state.currentPrescription?.id === prescriptionId
              ? updated
              : state.currentPrescription,
          prescriptions:
            state.prescriptions?.map((p) =>
              p.id === prescriptionId ? updated : p
            ) || null,
          isLoading: false,
        }));
      } else {
        set({
          isLoading: false,
          isError: true,
          lastError: response.message || genericError,
        });
      }
    } catch (error: unknown) {
      let message = genericError;
      if (error instanceof Error) message = error.message;
      set({ isLoading: false, isError: true, lastError: message });
    }
  },
}));

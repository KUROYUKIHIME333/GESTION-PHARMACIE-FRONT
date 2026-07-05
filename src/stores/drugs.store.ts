import { create } from "zustand";
import {
  Drug,
  DrugCreateInput,
  DrugUpdateInput,
  DrugsResponse,
  DrugCreateResponse,
  DrugDeleteResponse,
} from "@/src/types";
import { api } from "../lib/api";
import { API_ENDPOINTS } from "../lib/constants";

interface DrugState {
  drugs: Drug[] | null;
  total: number | null;
  page: number | null;
  limit: number | null;
  totalPages: number | null;
  isLoading: boolean;
  isFetched: boolean;
  isError: boolean;
  lastError: string | null;
  lastFetched: Date | null;
}

interface DrugStore extends DrugState {
  setDrugs: (drugs: Drug[] | null) => void;
  setDrugsTotal: (total: number | null) => void;
  setDrugsPage: (page: number | null) => void;
  setDrugsLimit: (limit: number | null) => void;
  setDrugsTotalPages: (totalPages: number | null) => void;
  setDrugsLoading: (loading: boolean) => void;
  setDrugsErrors: (isError: boolean) => void;
  setDrugsIsFetched: (fetched: boolean) => void;
  setDrugsLastFetched: (lastFetched: Date | null) => void;
  setDrugsLastError: (lastError: string | null) => void;
  resetDrugsErrors: () => void;

  // Actions API
  fetchDrugs: () => Promise<void>;
  createDrug: (drug: DrugCreateInput) => Promise<void>;
  updateDrug: (drug: DrugUpdateInput, id: string) => Promise<void>;
  deleteDrug: (id: string) => Promise<void>;

  resetDrugsStore: () => void;
  setDrugsGoodFetch: () => void;
  setDrugsBadFetch: () => void;
}

const initialDrugState: DrugState = {
  drugs: null,
  total: null,
  page: null,
  limit: null,
  totalPages: null,
  isLoading: false,
  isFetched: false,
  isError: false,
  lastError: null,
  lastFetched: null,
};

export const useDrugStore = create<DrugStore>((set) => ({
  ...initialDrugState,

  // Setters de base
  setDrugs: (drugs) => set({ drugs }),
  setDrugsTotal: (total) => set({ total }),
  setDrugsPage: (page) => set({ page }),
  setDrugsLimit: (limit) => set({ limit }),
  setDrugsTotalPages: (totalPages) => set({ totalPages }),
  setDrugsLoading: (isLoading) => set({ isLoading }),
  setDrugsErrors: (isError) => set({ isError }),
  setDrugsIsFetched: (isFetched) => set({ isFetched }),
  setDrugsLastFetched: (lastFetched) => set({ lastFetched }),
  setDrugsLastError: (lastError) => set({ lastError }),
  resetDrugsErrors: () => set({ isError: false, lastError: null }),
  resetDrugsStore: () => set(initialDrugState),
  setDrugsGoodFetch: () =>
    set({ isError: false, lastError: null, isLoading: false }),
  setDrugsBadFetch: () => set({ isError: true, isLoading: false }),

  // Actions API
  fetchDrugs: async () => {
    set({ isLoading: true, isError: false });
    const genericMessage =
      "Erreur inconnue lors de la récupération des médicaments";
    try {
      const response = (await api.get(API_ENDPOINTS.drugs)) as DrugsResponse;
      console.log(response);

      if (response.success && response.data) {
        const { drugs, total, page, limit, totalPages } = response.data;
        set({
          drugs,
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

      if (error instanceof Error) {
        message = error.message;
      }
      set({
        isLoading: false,
        isError: true,
        lastError: message,
      });
    }
  },

  createDrug: async (drugData: DrugCreateInput) => {
    set({ isLoading: true });
    const genericError = "Erreur inconnue lors de la création d'un médicament";
    try {
      const response = (await api.post(
        API_ENDPOINTS.drugs,
        drugData
      )) as DrugCreateResponse;

      if (response.success && response.data) {
        const newDrug = response.data;
        set((state) => ({
          drugs: state.drugs ? [...state.drugs, newDrug] : [newDrug],
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

      if (error instanceof Error) {
        message = error.message;
      }
      set({
        isLoading: false,
        isError: true,
        lastError: message,
      });
    }
  },

  updateDrug: async (drugData: DrugUpdateInput, id: string) => {
    set({ isLoading: true });
    const genericError =
      "Erreur inconnue lors de la modification d'un médicament";
    try {
      const response = (await api.post(
        `${API_ENDPOINTS.drugs}/${id}`,
        drugData
      )) as DrugCreateResponse;

      if (response.success && response.data) {
        const updatedDrug = response.data;
        set((state) => ({
          drugs:
            state.drugs?.map((d) => (d.id === id ? updatedDrug : d)) || null,
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

      if (error instanceof Error) {
        message = error.message;
      }
      set({
        isLoading: false,
        isError: true,
        lastError: message,
      });
    }
  },

  deleteDrug: async (id: string) => {
    set({ isLoading: true });
    const genericError =
      "Erreur inconnue lors de la suppression d'un médicament";
    try {
      const response = (await api.delete(
        `${API_ENDPOINTS.drugs}/${id}`
      )) as DrugDeleteResponse;

      if (response.success && response.message) {
        set((state) => ({
          drugs: state.drugs?.filter((d) => d.id !== id) || null,
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

      if (error instanceof Error) {
        message = error.message;
      }
      set({
        isLoading: false,
        isError: true,
        lastError: message,
      });
    }
  },
}));

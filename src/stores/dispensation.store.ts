import { create } from "zustand";
import {
  Dispensation,
  DispensationCreateInput,
  DispensationsResponse,
  DispensationCreateResponse,
  DispensationDetailResponse,
} from "@/src/schemas/dispensation.schemas";
import { api } from "../lib/api";
import { API_ENDPOINTS } from "../lib/constants";

interface DispensationState {
  dispensations: Dispensation[] | null;
  currentDispensation: Dispensation | null;
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

interface DispensationStore extends DispensationState {
  setDispensations: (dispensations: Dispensation[] | null) => void;
  setCurrentDispensation: (dispensation: Dispensation | null) => void;
  setDispensationsLoading: (loading: boolean) => void;
  setDispensationsError: (isError: boolean) => void;
  setDispensationsIsFetched: (fetched: boolean) => void;
  setDispensationsLastError: (lastError: string | null) => void;
  resetDispensationsErrors: () => void;
  fetchDispensations: () => Promise<void>;
  fetchDispensation: (id: string) => Promise<void>;
  createDispensation: (
    dispensation: DispensationCreateInput
  ) => Promise<Dispensation | null>;
  resetDispensationsStore: () => void;
}

const initialDispensationState: DispensationState = {
  dispensations: null,
  currentDispensation: null,
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

export const useDispensationStore = create<DispensationStore>((set) => ({
  ...initialDispensationState,

  setDispensations: (dispensations) => set({ dispensations }),
  setCurrentDispensation: (dispensation) =>
    set({ currentDispensation: dispensation }),
  setDispensationsLoading: (isLoading) => set({ isLoading }),
  setDispensationsError: (isError) => set({ isError }),
  setDispensationsIsFetched: (isFetched) => set({ isFetched }),
  setDispensationsLastError: (lastError) => set({ lastError }),
  resetDispensationsErrors: () => set({ isError: false, lastError: null }),
  resetDispensationsStore: () => set(initialDispensationState),

  fetchDispensations: async () => {
    set({ isLoading: true, isError: false });
    const genericMessage = "Erreur lors de la récupération des dispensations";
    try {
      const response = (await api.get(
        API_ENDPOINTS.dispensations
      )) as DispensationsResponse;
      if (response.success && response.data) {
        const { dispensations, total, page, limit, totalPages } = response.data;
        set({
          dispensations,
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

  fetchDispensation: async (id: string) => {
    set({ isLoading: true, isError: false });
    const genericMessage = "Erreur lors de la récupération de la dispensation";
    try {
      const response = (await api.get(
        `${API_ENDPOINTS.dispensations}/${id}`
      )) as DispensationDetailResponse;
      if (response.success && response.data) {
        set({
          currentDispensation: response.data,
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

  createDispensation: async (dispensationData: DispensationCreateInput) => {
    set({ isLoading: true, isError: false });
    const genericError = "Erreur lors de la dispensation";
    try {
      const response = (await api.post(
        API_ENDPOINTS.dispensations,
        dispensationData
      )) as DispensationCreateResponse;
      if (response.success && response.data) {
        const newDispensation = response.data;
        set((state) => ({
          dispensations: state.dispensations
            ? [newDispensation, ...state.dispensations]
            : [newDispensation],
          currentDispensation: newDispensation,
          isLoading: false,
        }));
        return newDispensation;
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
}));

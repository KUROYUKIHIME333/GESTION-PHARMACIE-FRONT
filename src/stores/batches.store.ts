import { create } from "zustand";
import {
  Batch,
  BatchCreateInput,
  BatchUpdateInput,
  BatchesResponse,
  BatchCreateResponse,
  BatchDeleteResponse,
} from "@/src/schemas/stock.schemas";
import { api } from "../lib/api";
import { API_ENDPOINTS } from "../lib/constants";

interface BatchState {
  batches: Batch[] | null;
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

interface BatchStore extends BatchState {
  setBatches: (batches: Batch[] | null) => void;
  setBatchesTotal: (total: number) => void;
  setBatchesPage: (page: number) => void;
  setBatchesLimit: (limit: number) => void;
  setBatchesTotalPages: (totalPages: number) => void;
  setBatchesLoading: (loading: boolean) => void;
  setBatchesError: (isError: boolean) => void;
  setBatchesIsFetched: (fetched: boolean) => void;
  setBatchesLastError: (lastError: string | null) => void;
  resetBatchesErrors: () => void;

  // Actions API
  fetchBatches: () => Promise<void>;
  createBatch: (batch: BatchCreateInput) => Promise<void>;
  updateBatch: (batch: BatchUpdateInput, id: string) => Promise<void>;
  deleteBatch: (id: string) => Promise<void>;
  quarantineBatch: (
    id: string,
    isQuarantined: boolean,
    reason?: string
  ) => Promise<void>;

  resetBatchesStore: () => void;
}

const initialBatchState: BatchState = {
  batches: null,
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

export const useBatchStore = create<BatchStore>((set) => ({
  ...initialBatchState,

  setBatches: (batches) => set({ batches }),
  setBatchesTotal: (total) => set({ total }),
  setBatchesPage: (page) => set({ page }),
  setBatchesLimit: (limit) => set({ limit }),
  setBatchesTotalPages: (totalPages) => set({ totalPages }),
  setBatchesLoading: (isLoading) => set({ isLoading }),
  setBatchesError: (isError) => set({ isError }),
  setBatchesIsFetched: (isFetched) => set({ isFetched }),
  setBatchesLastError: (lastError) => set({ lastError }),
  resetBatchesErrors: () => set({ isError: false, lastError: null }),
  resetBatchesStore: () => set(initialBatchState),

  fetchBatches: async () => {
    set({ isLoading: true, isError: false });
    const genericMessage = "Erreur inconnue lors de la récupération des lots";
    try {
      const response = (await api.get(
        API_ENDPOINTS.batches
      )) as BatchesResponse;

      if (response.success && response.data) {
        const { batches, total, page, limit, totalPages } = response.data;
        set({
          batches,
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

  createBatch: async (batchData: BatchCreateInput) => {
    set({ isLoading: true });
    const genericError = "Erreur inconnue lors de la création du lot";
    try {
      const response = (await api.post(
        API_ENDPOINTS.batches,
        batchData
      )) as BatchCreateResponse;

      if (response.success && response.data) {
        const newBatch = response.data;
        set((state) => ({
          batches: state.batches ? [newBatch, ...state.batches] : [newBatch],
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

  updateBatch: async (batchData: BatchUpdateInput, id: string) => {
    set({ isLoading: true });
    const genericError = "Erreur inconnue lors de la modification du lot";
    try {
      const response = (await api.put(
        `${API_ENDPOINTS.batches}/${id}`,
        batchData
      )) as BatchCreateResponse;

      if (response.success && response.data) {
        const updatedBatch = response.data;
        set((state) => ({
          batches:
            state.batches?.map((b) => (b.id === id ? updatedBatch : b)) || null,
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

  deleteBatch: async (id: string) => {
    set({ isLoading: true });
    const genericError = "Erreur inconnue lors de la suppression du lot";
    try {
      const response = (await api.delete(
        `${API_ENDPOINTS.batches}/${id}`
      )) as BatchDeleteResponse;

      if (response.success) {
        set((state) => ({
          batches: state.batches?.filter((b) => b.id !== id) || null,
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

  quarantineBatch: async (
    id: string,
    isQuarantined: boolean,
    reason?: string
  ) => {
    set({ isLoading: true });
    const genericError = "Erreur lors de la mise en quarantaine";
    try {
      const response = (await api.put(
        `${API_ENDPOINTS.batches}/${id}/quarantine`,
        {
          isQuarantined,
          quarantineReason: reason,
        }
      )) as BatchCreateResponse;

      if (response.success && response.data) {
        const updatedBatch = response.data;
        set((state) => ({
          batches:
            state.batches?.map((b) => (b.id === id ? updatedBatch : b)) || null,
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

import { create } from "zustand";
import {
  StockSummary,
  StockDetail,
  StockSummaryResponse,
  StockDetailResponse,
} from "@/src/schemas/stock.schemas";
import { api } from "../lib/api";
import { API_ENDPOINTS } from "../lib/constants";

interface StockState {
  stockItems: StockSummary[] | null;
  stockDetail: StockDetail | null;
  totalDrugs: number;
  drugsInStock: number;
  drugsBelowMin: number;
  drugsCritical: number;
  totalValueCDF: number;
  isLoading: boolean;
  isFetched: boolean;
  isError: boolean;
  lastError: string | null;
  lastFetched: Date | null;
}

interface StockStore extends StockState {
  // Setters
  setStockItems: (items: StockSummary[] | null) => void;
  setStockDetail: (detail: StockDetail | null) => void;
  setStockLoading: (loading: boolean) => void;
  setStockError: (isError: boolean) => void;
  setStockIsFetched: (fetched: boolean) => void;
  setStockLastError: (lastError: string | null) => void;
  resetStockErrors: () => void;

  // Actions API
  fetchStock: () => Promise<void>;
  fetchStockDetail: (drugId: string) => Promise<void>;

  resetStockStore: () => void;
}

const initialStockState: StockState = {
  stockItems: null,
  stockDetail: null,
  totalDrugs: 0,
  drugsInStock: 0,
  drugsBelowMin: 0,
  drugsCritical: 0,
  totalValueCDF: 0,
  isLoading: false,
  isFetched: false,
  isError: false,
  lastError: null,
  lastFetched: null,
};

export const useStockStore = create<StockStore>((set) => ({
  ...initialStockState,

  setStockItems: (items) => set({ stockItems: items }),
  setStockDetail: (detail) => set({ stockDetail: detail }),
  setStockLoading: (isLoading) => set({ isLoading }),
  setStockError: (isError) => set({ isError }),
  setStockIsFetched: (isFetched) => set({ isFetched }),
  setStockLastError: (lastError) => set({ lastError }),
  resetStockErrors: () => set({ isError: false, lastError: null }),
  resetStockStore: () => set(initialStockState),

  fetchStock: async () => {
    set({ isLoading: true, isError: false });
    const genericMessage = "Erreur inconnue lors de la récupération du stock";
    try {
      const response = (await api.get(
        API_ENDPOINTS.stocks
      )) as StockSummaryResponse;

      if (response.success && response.data) {
        const { items, summary } = response.data;
        set({
          stockItems: items,
          totalDrugs: summary.totalDrugs,
          drugsInStock: summary.drugsInStock,
          drugsBelowMin: summary.drugsBelowMin,
          drugsCritical: summary.drugsCritical,
          totalValueCDF: summary.totalValueCDF,
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

  fetchStockDetail: async (drugId: string) => {
    set({ isLoading: true, isError: false });
    const genericMessage =
      "Erreur inconnue lors de la récupération du détail de stock";
    try {
      const response = (await api.get(
        `${API_ENDPOINTS.stocks}/${drugId}`
      )) as StockDetailResponse;

      if (response.success && response.data) {
        set({
          stockDetail: response.data,
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
}));

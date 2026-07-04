import { create } from "zustand";
import { DashboardStats } from "@/src/types";
import { api } from "../lib/api";
import { API_ENDPOINTS } from "../lib/constants";

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  isFetched: boolean;
  isError: boolean;
  lastError: string | null;
  lastFetched: Date | null;
}

interface DashboardStore extends DashboardState {
  setDashboardStats: (stat: DashboardStats | null) => void;
  setDashboardLoading: (loading: boolean) => void;
  setDashboardErrors: (isError: boolean) => void;
  setDashboardIsFetched: (fetched: boolean) => void;
  setDashboardLastFetched: (lastFetched: Date | null) => void;
  setDashboardLastError: (lastError: string | null) => void;
  resetDashboardErrors: () => void;
  fetchStats: () => void;
  resetDashboardStore: () => void;
  setDashboardGoodFetch: () => void;
  setDashboardBadFetch: () => void;
}

const initialDashboardState: DashboardState = {
  stats: null,
  isLoading: false,
  isFetched: false,
  isError: false,
  lastError: null,
  lastFetched: null,
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  ...initialDashboardState,

  setDashboardStats: (stats) => set({ stats }),

  setDashboardLoading: (isLoading) => set({ isLoading }),

  setDashboardErrors: (isError) => set({ isError }),

  setDashboardIsFetched: (isFetched) => set({ isFetched }),

  setDashboardLastFetched: (lastFetched) => set({ lastFetched }),

  setDashboardLastError: (lastError) => set({ lastError }),

  resetDashboardErrors: () =>
    set({
      isError: false,
      lastError: null,
    }),

  fetchStats: async () => {
    set({ isLoading: true, lastError: null });
    try {
      const response = await api.get(API_ENDPOINTS.stats);
      if (response && typeof response === "object" && "success" in response) {
        set({
          isFetched: true,
          lastFetched: new Date(),
        });
        
        if (
          response.success &&
          "data" in response &&
          response.data &&
          typeof response.data === "object"
        ) {
          set({
            stats: response.data as DashboardStats,
            isLoading: false,
            isFetched: true,
            isError: false,
          });
        } else if (
          !response.success &&
          "message" in response &&
          response.message &&
          typeof response.message === "string"
        ) {
          set({ lastError: response.message, isLoading: false, isError: true });
        } else {
          set({
            lastError: "Erreur de connexion au server",
            isLoading: false,
            isError: true,
          });
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        set({ lastError: error.message, isLoading: false, isError: true });
      } else {
        set({ lastError: "Erreur inconnue", isLoading: false, isError: true });
      }
    }
  },

  resetDashboardStore: () => set(initialDashboardState),

  setDashboardGoodFetch: () =>
    set({
      isLoading: false,
      isFetched: true,
      isError: false,
      lastError: null,
      lastFetched: new Date(),
    }),

  setDashboardBadFetch: () =>
    set({
      isLoading: false,
      isFetched: true,
      isError: true,
      lastFetched: new Date(),
    }),
}));

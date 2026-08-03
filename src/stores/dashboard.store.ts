import { create } from "zustand";
import {
  DashboardStats,
  dashboardStatsSchema,
} from "@/src/schemas/dashboard.schemas";
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
  setStats: (stats: DashboardStats | null) => void;
  setDashboardLoading: (loading: boolean) => void;
  setDashboardError: (isError: boolean) => void;
  resetDashboardErrors: () => void;
  fetchDashboard: () => Promise<void>;
  resetDashboardStore: () => void;
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

  setStats: (stats) => set({ stats }),
  setDashboardLoading: (isLoading) => set({ isLoading }),
  setDashboardError: (isError) => set({ isError }),
  resetDashboardErrors: () => set({ isError: false, lastError: null }),
  resetDashboardStore: () => set(initialDashboardState),

  fetchDashboard: async () => {
    set({ isLoading: true, isError: false });
    const genericMessage = "Erreur lors du chargement du tableau de bord";
    try {
      const response = await api.get(API_ENDPOINTS.stats);
      const parsed = dashboardStatsSchema.safeParse(response);
      if (parsed.success && parsed.data.data) {
        set({
          stats: parsed.data.data,
          isLoading: false,
          isFetched: true,
          lastFetched: new Date(),
        });
      } else {
        set({
          isLoading: false,
          isError: true,
          lastError: genericMessage,
        });
      }
    } catch (error: unknown) {
      let message = genericMessage;
      if (error instanceof Error) message = error.message;
      set({ isLoading: false, isError: true, lastError: message });
    }
  },
}));

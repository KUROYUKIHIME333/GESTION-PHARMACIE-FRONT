import { create } from "zustand";
import { DashboardStats } from "@/src/types";

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

import { create } from "zustand";
import {
  Alert,
  AlertAcknowledgeInput,
  AlertsResponse,
  AlertAcknowledgeResponse,
} from "@/src/schemas/alert.schemas";
import { api } from "../lib/api";
import { API_ENDPOINTS } from "../lib/constants";

interface AlertState {
  alerts: Alert[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  summaryCritical: number;
  summaryWarning: number;
  summaryInfo: number;
  byType: Record<string, number>;
  isLoading: boolean;
  isFetched: boolean;
  isError: boolean;
  lastError: string | null;
  lastFetched: Date | null;
}

interface AlertStore extends AlertState {
  setAlerts: (alerts: Alert[] | null) => void;
  setAlertsLoading: (loading: boolean) => void;
  setAlertsError: (isError: boolean) => void;
  resetAlertsErrors: () => void;
  fetchAlerts: () => Promise<void>;
  acknowledgeAlert: (id: string, data: AlertAcknowledgeInput) => Promise<void>;
  resetAlertsStore: () => void;
}

const initialAlertState: AlertState = {
  alerts: null,
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  summaryCritical: 0,
  summaryWarning: 0,
  summaryInfo: 0,
  byType: {},
  isLoading: false,
  isFetched: false,
  isError: false,
  lastError: null,
  lastFetched: null,
};

export const useAlertStore = create<AlertStore>((set) => ({
  ...initialAlertState,

  setAlerts: (alerts) => set({ alerts }),
  setAlertsLoading: (isLoading) => set({ isLoading }),
  setAlertsError: (isError) => set({ isError }),
  resetAlertsErrors: () => set({ isError: false, lastError: null }),
  resetAlertsStore: () => set(initialAlertState),

  fetchAlerts: async () => {
    set({ isLoading: true, isError: false });
    const genericMessage = "Erreur lors de la récupération des alertes";
    try {
      const response = (await api.get(API_ENDPOINTS.alerts)) as AlertsResponse;
      if (response.success && response.data) {
        const { alerts, total, page, limit, totalPages, summary } =
          response.data;
        set({
          alerts,
          total,
          page,
          limit,
          totalPages,
          summaryCritical: summary.critical,
          summaryWarning: summary.warning,
          summaryInfo: summary.info,
          byType: summary.byType,
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

  acknowledgeAlert: async (id: string, data: AlertAcknowledgeInput) => {
    set({ isLoading: true, isError: false });
    const genericError = "Erreur lors de l'acquittement";
    try {
      const response = (await api.post(
        `${API_ENDPOINTS.alerts}/${id}/acknowledge`,
        data
      )) as AlertAcknowledgeResponse;
      if (response.success && response.data) {
        const updated = response.data.alert;
        set((state) => ({
          alerts: state.alerts?.map((a) => (a.id === id ? updated : a)) || null,
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

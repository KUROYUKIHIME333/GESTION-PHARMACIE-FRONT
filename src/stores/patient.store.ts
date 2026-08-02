import { create } from "zustand";
import {
  Patient,
  PatientCreateInput,
  PatientUpdateInput,
  AllergyCreateInput,
  PatientsResponse,
  PatientCreateResponse,
  PatientDeleteResponse,
  AllergyCreateResponse,
  AllergiesResponse,
} from "@/src/schemas/patient.schemas";
import { api } from "../lib/api";
import { API_ENDPOINTS } from "../lib/constants";

interface PatientState {
  patients: Patient[] | null;
  currentPatient: Patient | null;
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

interface PatientStore extends PatientState {
  setPatients: (patients: Patient[] | null) => void;
  setCurrentPatient: (patient: Patient | null) => void;
  setPatientsLoading: (loading: boolean) => void;
  setPatientsError: (isError: boolean) => void;
  setPatientsIsFetched: (fetched: boolean) => void;
  setPatientsLastError: (lastError: string | null) => void;
  resetPatientsErrors: () => void;

  fetchPatients: () => Promise<void>;
  fetchPatient: (id: string) => Promise<void>;
  createPatient: (patient: PatientCreateInput) => Promise<Patient | null>;
  updatePatient: (patient: PatientUpdateInput, id: string) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  addAllergy: (patientId: string, allergy: AllergyCreateInput) => Promise<void>;
  fetchAllergies: (patientId: string) => Promise<void>;

  resetPatientsStore: () => void;
}

const initialPatientState: PatientState = {
  patients: null,
  currentPatient: null,
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

export const usePatientStore = create<PatientStore>((set) => ({
  ...initialPatientState,

  setPatients: (patients) => set({ patients }),
  setCurrentPatient: (patient) => set({ currentPatient: patient }),
  setPatientsLoading: (isLoading) => set({ isLoading }),
  setPatientsError: (isError) => set({ isError }),
  setPatientsIsFetched: (isFetched) => set({ isFetched }),
  setPatientsLastError: (lastError) => set({ lastError }),
  resetPatientsErrors: () => set({ isError: false, lastError: null }),
  resetPatientsStore: () => set(initialPatientState),

  fetchPatients: async () => {
    set({ isLoading: true, isError: false });
    const genericMessage = "Erreur lors de la récupération des patients";
    try {
      const response = (await api.get(
        API_ENDPOINTS.patients
      )) as PatientsResponse;
      if (response.success && response.data) {
        const { patients, total, page, limit, totalPages } = response.data;
        set({
          patients,
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

  fetchPatient: async (id: string) => {
    set({ isLoading: true, isError: false });
    const genericMessage = "Erreur lors de la récupération du patient";
    try {
      const response = (await api.get(
        `${API_ENDPOINTS.patients}/${id}`
      )) as PatientCreateResponse;
      if (response.success && response.data) {
        set({
          currentPatient: response.data,
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

  createPatient: async (patientData: PatientCreateInput) => {
    set({ isLoading: true, isError: false });
    const genericError = "Erreur lors de la création du patient";
    try {
      const response = (await api.post(
        API_ENDPOINTS.patients,
        patientData
      )) as PatientCreateResponse;
      if (response.success && response.data) {
        const newPatient = response.data;
        set((state) => ({
          patients: state.patients
            ? [newPatient, ...state.patients]
            : [newPatient],
          isLoading: false,
        }));
        return newPatient;
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

  updatePatient: async (patientData: PatientUpdateInput, id: string) => {
    set({ isLoading: true, isError: false });
    const genericError = "Erreur lors de la modification du patient";
    try {
      const response = (await api.put(
        `${API_ENDPOINTS.patients}/${id}`,
        patientData
      )) as PatientCreateResponse;
      if (response.success && response.data) {
        const updatedPatient = response.data;
        set((state) => ({
          patients:
            state.patients?.map((p) => (p.id === id ? updatedPatient : p)) ||
            null,
          currentPatient:
            state.currentPatient?.id === id
              ? updatedPatient
              : state.currentPatient,
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

  deletePatient: async (id: string) => {
    set({ isLoading: true, isError: false });
    const genericError = "Erreur lors de la suppression du patient";
    try {
      const response = (await api.delete(
        `${API_ENDPOINTS.patients}/${id}`
      )) as PatientDeleteResponse;
      if (response.success) {
        set((state) => ({
          patients: state.patients?.filter((p) => p.id !== id) || null,
          currentPatient:
            state.currentPatient?.id === id ? null : state.currentPatient,
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

  addAllergy: async (patientId: string, allergyData: AllergyCreateInput) => {
    set({ isLoading: true, isError: false });
    const genericError = "Erreur lors de l'ajout de l'allergie";
    try {
      const response = (await api.post(
        `${API_ENDPOINTS.patients}/${patientId}/allergies`,
        allergyData
      )) as AllergyCreateResponse;
      if (response.success && response.data) {
        // Rafraîchir le patient pour avoir les allergies à jour
        const patientResponse = (await api.get(
          `${API_ENDPOINTS.patients}/${patientId}`
        )) as PatientCreateResponse;
        if (patientResponse.success && patientResponse.data) {
          set((state) => ({
            currentPatient: patientResponse.data,
            patients:
              state.patients?.map((p) =>
                p.id === patientId ? patientResponse.data! : p
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

  fetchAllergies: async (patientId: string) => {
    set({ isLoading: true, isError: false });
    const genericMessage = "Erreur lors de la récupération des allergies";
    try {
      const response = (await api.get(
        `${API_ENDPOINTS.patients}/${patientId}/allergies`
      )) as AllergiesResponse;
      if (response.success && response.data) {
        set((state) => ({
          currentPatient: state.currentPatient
            ? ({ ...state.currentPatient, allergies: response.data } as Patient)
            : null,
          isLoading: false,
        }));
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
}));

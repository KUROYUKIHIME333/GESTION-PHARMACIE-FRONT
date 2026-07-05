import { create } from "zustand";
import { Drug, DrugCreateInput, DrugUpdateInput } from "@/src/types";
import type { DrugCategory, DrugForm, StorageCondition } from "@/src/types";
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
  fetchStats: () => void;
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

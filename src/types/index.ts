export enum UserRole {
  SUPERADMIN = "SUPERADMIN",
  PHARMACIST = "PHARMACIST",
  PHARMACY_TECH = "PHARMACY_TECH",
  DOCTOR = "DOCTOR",
  NURSE = "NURSE",
  CASHIER = "CASHIER",
  STOCK_MANAGER = "STOCK_MANAGER",
  AUDITOR = "AUDITOR",
}

export interface User {
  id: string;
  employeeId?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  mustChangePassword: boolean;
  serviceId?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ApiError {
  statusCode: number;
  message: string;
  code?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

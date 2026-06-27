// Types utilisateurs
export interface User {
  id: string;
  employeeId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  serviceId: string | null;
  isActive: boolean;
  mustChangePassword: boolean;
  failedLoginCount: number;
}

export type UserRole =
  | "SUPERADMIN"
  | "PHARMACIST"
  | "PHARMACY_TECH"
  | "DOCTOR"
  | "NURSE"
  | "CASHIER"
  | "STOCK_MANAGER"
  | "AUDITOR";

// Types auth
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  details?: Record<string, string[]>;
}

// Types navigation
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: UserRole[];
}

// Types dashboard
export interface DashboardStats {
  alerts: {
    totalActive: number;
    critical: number;
    warning: number;
  };
  stock: {
    totalDrugs: number;
    drugsInStock: number;
    drugsCritical: number;
    drugsLow: number;
  };
  activity: {
    dispensationsToday: number;
    prescriptionsToday: number;
    newPatientsToday: number;
  };
}

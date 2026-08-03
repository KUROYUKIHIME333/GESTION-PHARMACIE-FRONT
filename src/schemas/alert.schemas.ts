import { z } from "zod";

export const AlertTypeEnum = {
  LOW_STOCK: "LOW_STOCK",
  CRITICAL_STOCK: "CRITICAL_STOCK",
  EXPIRY_SOON: "EXPIRY_SOON",
  EXPIRED: "EXPIRED",
  COLD_CHAIN_BREACH: "COLD_CHAIN_BREACH",
  CONTROLLED_REORDER: "CONTROLLED_REORDER",
  INVENTORY_DISCREPANCY: "INVENTORY_DISCREPANCY",
  LICENSE_EXPIRY: "LICENSE_EXPIRY",
} as const;

export type AlertType = typeof AlertTypeEnum[keyof typeof AlertTypeEnum];
export const AlertTypeValues = Object.values(
  AlertTypeEnum
) as readonly AlertType[];

export const AlertStatusEnum = {
  ACTIVE: "ACTIVE",
  ACKNOWLEDGED: "ACKNOWLEDGED",
  RESOLVED: "RESOLVED",
  IGNORED: "IGNORED",
} as const;

export type AlertStatus = typeof AlertStatusEnum[keyof typeof AlertStatusEnum];
export const AlertStatusValues = Object.values(
  AlertStatusEnum
) as readonly AlertStatus[];

export const AlertSeverityEnum = {
  critical: "critical",
  warning: "warning",
  info: "info",
} as const;

export type AlertSeverity =
  typeof AlertSeverityEnum[keyof typeof AlertSeverityEnum];

export const alertTypeLabels: Record<AlertType, string> = {
  LOW_STOCK: "Stock bas",
  CRITICAL_STOCK: "Stock critique",
  EXPIRY_SOON: "Péremption proche",
  EXPIRED: "Périmé",
  COLD_CHAIN_BREACH: "Rupture chaîne du froid",
  CONTROLLED_REORDER: "Réappro. stupéfiants",
  INVENTORY_DISCREPANCY: "Écart inventaire",
  LICENSE_EXPIRY: "Licence fournisseur",
};

const alertBaseSchema = z.object({
  status: z.nativeEnum(AlertStatusEnum),
  comment: z.string().nullable().optional(),
});

export const alertSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(AlertTypeEnum),
  status: z.nativeEnum(AlertStatusEnum),
  drugId: z.string(),
  drugName: z.string(),
  drugCode: z.string(),
  batchId: z.string().nullable().optional(),
  batchNumber: z.string().nullable().optional(),
  message: z.string(),
  threshold: z.number().nullable().optional(),
  currentValue: z.number().nullable().optional(),
  severity: z.nativeEnum(AlertSeverityEnum),
  createdAt: z.string().datetime(),
  acknowledgedAt: z.string().datetime().nullable().optional(),
  acknowledgedBy: z
    .object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    })
    .nullable()
    .optional(),
});

export const alertAcknowledgeSchema = alertBaseSchema;

export type Alert = z.infer<typeof alertSchema>;
export type AlertAcknowledgeInput = z.infer<typeof alertAcknowledgeSchema>;

export interface AlertsResponse {
  success: boolean;
  data?: {
    alerts: Alert[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    summary: {
      critical: number;
      warning: number;
      info: number;
      byType: Record<string, number>;
    };
  };
  message?: string;
}

export interface AlertAcknowledgeResponse {
  success: boolean;
  message?: string;
  data?: {
    alert: Alert;
    acknowledgement: { id: string; comment?: string | null; createdAt: string };
  };
}

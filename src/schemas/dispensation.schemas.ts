import { z } from "zod";

// Enums
export const PaymentMethodEnum = {
  CASH_CDF: "CASH_CDF",
  CASH_USD: "CASH_USD",
  MOBILE_MONEY: "MOBILE_MONEY",
  INSURANCE: "INSURANCE",
  ONG_COVERAGE: "ONG_COVERAGE",
  CREDIT: "CREDIT",
  FREE: "FREE",
} as const;

export type PaymentMethod =
  typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];
export const PaymentMethodValues = Object.values(
  PaymentMethodEnum
) as readonly PaymentMethod[];

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  CASH_CDF: "Espèces CDF",
  CASH_USD: "Espèces USD",
  MOBILE_MONEY: "Mobile Money",
  INSURANCE: "Assurance",
  ONG_COVERAGE: "Prise en charge ONG",
  CREDIT: "Crédit",
  FREE: "Gratuit",
};

// Schéma DispensationLine (base)
const dispensationLineBaseSchema = z.object({
  drugId: z.string().min(1, "Médicament requis"),
  quantity: z.coerce.number().int().min(1, "Quantité minimale 1"),
  prescriptionLineId: z.string().nullable().optional(),
});

// Schéma Dispensation (base)
const dispensationBaseSchema = z.object({
  patientId: z.string().min(1, "Patient requis"),
  prescriptionId: z.string().nullable().optional(),
  paymentMethod: z.nativeEnum(PaymentMethodEnum),
  totalAmountCDF: z.number().nonnegative().nullable().optional(),
  totalAmountUSD: z.number().nonnegative().nullable().optional(),
  amountPaidCDF: z.number().nonnegative().nullable().optional(),
  amountPaidUSD: z.number().nonnegative().nullable().optional(),
  insuranceCoverage: z.number().nonnegative().nullable().optional(),
  receiptNumber: z.string().max(50).nullable().optional(),
  notes: z.string().nullable().optional(),
  lines: z
    .array(dispensationLineBaseSchema)
    .min(1, "Au moins un médicament requis"),
});

// Schéma complet Dispensation
export const dispensationSchema = dispensationBaseSchema.extend({
  id: z.string(),
  dispensationNumber: z.string(),
  dispensedAt: z.string().datetime(),
  dispensedBy: z
    .object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    })
    .optional(),
  patient: z
    .object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      hospitalNumber: z.string(),
    })
    .optional(),
  prescription: z
    .object({
      id: z.string(),
      prescriptionNumber: z.string().nullable(),
    })
    .nullable()
    .optional(),
  lineCount: z.number().optional(),
  lines: z
    .array(
      dispensationLineBaseSchema.extend({
        id: z.string(),
        batchId: z.string(),
        drug: z
          .object({
            id: z.string(),
            name: z.string(),
            code: z.string(),
          })
          .optional(),
        unitPriceCDF: z.number().nullable(),
        unitPriceUSD: z.number().nullable(),
        totalPriceCDF: z.number().nullable(),
        totalPriceUSD: z.number().nullable(),
      })
    )
    .optional(),
});

// Schémas de création
export const dispensationCreateSchema = dispensationBaseSchema;

// Types
export type Dispensation = z.infer<typeof dispensationSchema>;
export type DispensationCreateInput = z.infer<typeof dispensationCreateSchema>;
export type DispensationLineInput = z.infer<typeof dispensationLineBaseSchema>;

// Response types
export interface DispensationCreateResponse {
  success: boolean;
  data?: Dispensation;
  message?: string;
}

export interface DispensationsResponse {
  success: boolean;
  data?: {
    dispensations: Dispensation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export interface DispensationDetailResponse {
  success: boolean;
  data?: Dispensation;
  message?: string;
}

import { z } from "zod";

// Enums
export const MovementTypeEnum = {
  RECEPTION: "RECEPTION",
  DONATION_IN: "DONATION_IN",
  TRANSFER_IN: "TRANSFER_IN",
  DISPENSATION_OUT: "DISPENSATION_OUT",
  INTERNAL_USE: "INTERNAL_USE",
  TRANSFER_OUT: "TRANSFER_OUT",
  DONATION_OUT: "DONATION_OUT",
  EXPIRY_REMOVAL: "EXPIRY_REMOVAL",
  LOSS: "LOSS",
  INVENTORY_POSITIVE: "INVENTORY_POSITIVE",
  INVENTORY_NEGATIVE: "INVENTORY_NEGATIVE",
  RETURN_TO_SUPPLIER: "RETURN_TO_SUPPLIER",
  RETURN_FROM_PATIENT: "RETURN_FROM_PATIENT",
} as const;

export type MovementType =
  typeof MovementTypeEnum[keyof typeof MovementTypeEnum];
export const MovementTypeValues = Object.values(
  MovementTypeEnum
) as readonly MovementType[];

// Schéma Batch (base)

const batchBaseSchema = z.object({
  batchNumber: z.string().min(1, "Numéro de lot requis").max(100),
  drugId: z.string().min(1, "Médicament requis"),
  supplierId: z.string().nullable().optional(),
  initialQuantity: z.coerce
    .number()
    .int()
    .min(1, "Quantité initiale minimale 1"),
  expiryDate: z.string().datetime(),
  manufacturingDate: z.string().datetime().nullable().optional(),
  purchasePriceCDF: z.number().nonnegative().nullable().optional(),
  purchasePriceUSD: z.number().nonnegative().nullable().optional(),
  locationId: z.string().nullable().optional(),
  coldChainVerified: z.boolean().default(false),
  notes: z.string().nullable().optional(),
});

// Schéma StockMovement (base)

export const stockMovementBaseSchema = z.object({
  batchId: z.string().min(1),
  type: z.nativeEnum(MovementTypeEnum),
  quantity: z.coerce.number().int(),
  quantityBefore: z.coerce.number().int().default(0),
  quantityAfter: z.coerce.number().int(),
  reason: z.string().nullable().optional(),
  referenceDoc: z.string().nullable().optional(),
});

// Schéma complet Batch (avec relations)

export const batchSchema = batchBaseSchema.extend({
  id: z.string(),
  currentQuantity: z.coerce.number().int().min(0),
  isQuarantined: z.boolean().default(false),
  quarantineReason: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  receivedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  // Relations simplifiées
  drug: z
    .object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
    })
    .optional(),
  supplier: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  location: z
    .object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
});

// Schéma Stock Summary (vue agrégée)

export const stockSummarySchema = z.object({
  drugId: z.string(),
  drugName: z.string(),
  drugCode: z.string(),
  totalQuantity: z.number().int(),
  isBelowMin: z.boolean(),
  isCritical: z.boolean(),
  activeBatches: z.number().int(),
  nearestExpiry: z.string().datetime().nullable().optional(),
  minStockLevel: z.number().int().nullable().optional(),
  criticalStockLevel: z.number().int().nullable().optional(),
});

// Schéma Stock Detail (par médicament)

export const stockDetailSchema = z.object({
  drug: z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    genericName: z.string().nullable().optional(),
    dci: z.string(),
    minStockLevel: z.number().int().nullable().optional(),
    criticalStockLevel: z.number().int().nullable().optional(),
    unitPriceCDF: z.number().nullable().optional(),
    unitPriceUSD: z.number().nullable().optional(),
  }),
  totalQuantity: z.number().int(),
  batches: z.array(
    z.object({
      id: z.string(),
      batchNumber: z.string(),
      currentQuantity: z.number().int(),
      expiryDate: z.string().datetime(),
      isQuarantined: z.boolean(),
      daysUntilExpiry: z.number().int(),
    })
  ),
  alerts: z
    .array(
      z.object({
        type: z.string(),
        message: z.string(),
        severity: z.enum(["warning", "critical", "info"]),
      })
    )
    .optional(),
});

// Schémas de création

export const batchCreateSchema = batchBaseSchema;

export const batchUpdateSchema = batchBaseSchema.partial().extend({
  isQuarantined: z.boolean().optional(),
  quarantineReason: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

// Types

export type Batch = z.infer<typeof batchSchema>;
export type BatchCreateInput = z.infer<typeof batchCreateSchema>;
export type BatchUpdateInput = z.infer<typeof batchUpdateSchema>;
export type StockSummary = z.infer<typeof stockSummarySchema>;
export type StockDetail = z.infer<typeof stockDetailSchema>;
export type StockMovement = z.infer<typeof stockMovementBaseSchema>;

// Response types

export interface BatchCreateResponse {
  success: boolean;
  data?: Batch;
  message?: string;
}

export interface BatchesResponse {
  success: boolean;
  data?: {
    batches: Batch[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export interface BatchDeleteResponse {
  success: boolean;
  message?: string;
}

export interface StockSummaryResponse {
  success: boolean;
  data?: {
    items: StockSummary[];
    summary: {
      totalDrugs: number;
      drugsInStock: number;
      drugsBelowMin: number;
      drugsCritical: number;
      totalValueCDF: number;
    };
  };
  message?: string;
}

export interface StockDetailResponse {
  success: boolean;
  data?: StockDetail;
  message?: string;
}

import { z } from "zod";

// Enums

export const PrescriptionStatusEnum = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  PARTIALLY_DISPENSED: "PARTIALLY_DISPENSED",
  DISPENSED: "DISPENSED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
} as const;

export type PrescriptionStatus =
  typeof PrescriptionStatusEnum[keyof typeof PrescriptionStatusEnum];
export const PrescriptionStatusValues = Object.values(
  PrescriptionStatusEnum
) as readonly PrescriptionStatus[];

// Schéma PrescriptionLine (base)

const prescriptionLineBaseSchema = z.object({
  drugId: z.string().min(1, "Médicament requis"),
  quantityPrescribed: z.coerce.number().int().min(1, "Quantité minimale 1"),
  dosage: z.string().min(1, "Posologie requise").max(500),
  frequency: z.string().max(100).nullable().optional(),
  durationDays: z.coerce.number().int().min(1).nullable().optional(),
  route: z.string().max(50).nullable().optional(),
  instructions: z.string().nullable().optional(),
});

// Schéma Prescription (base)

const prescriptionBaseSchema = z.object({
  patientId: z.string().min(1, "Patient requis"),
  prescribedById: z.string().nullable().optional(),
  serviceId: z.string().nullable().optional(),
  isInpatient: z.boolean().default(false),
  admissionRef: z.string().max(100).nullable().optional(),
  diagnosisCode: z.string().max(50).nullable().optional(),
  diagnosisLabel: z.string().max(255).nullable().optional(),
  notes: z.string().nullable().optional(),
});

// Schéma complet Prescription

export const prescriptionSchema = prescriptionBaseSchema.extend({
  id: z.string(),
  prescriptionNumber: z.string(),
  status: z.nativeEnum(PrescriptionStatusEnum),
  visitDate: z.string().datetime(),
  validUntil: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  patient: z
    .object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      hospitalNumber: z.string(),
    })
    .optional(),
  prescribedBy: z
    .object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    })
    .optional(),
  service: z
    .object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
    })
    .nullable()
    .optional(),
  lines: z
    .array(
      z.object({
        id: z.string(),
        drugId: z.string(),
        drug: z
          .object({
            id: z.string(),
            name: z.string(),
            code: z.string(),
            dosage: z.string().nullable(),
          })
          .optional(),
        quantityPrescribed: z.number(),
        quantityDispensed: z.number(),
        dosage: z.string(),
        frequency: z.string().nullable(),
        durationDays: z.number().nullable(),
        route: z.string().nullable(),
        instructions: z.string().nullable(),
        isFulfilled: z.boolean(),
        substituteUsed: z.boolean(),
        lineNumber: z.number(),
      })
    )
    .optional(),
  dispensations: z
    .array(
      z.object({
        id: z.string(),
        dispensationNumber: z.string(),
        dispensedAt: z.string().datetime(),
        totalAmountCDF: z.number().nullable(),
      })
    )
    .optional(),
    lineCount: z.number().optional(),
});

// Schémas de création

export const prescriptionCreateSchema = prescriptionBaseSchema;
export const prescriptionLineCreateSchema = prescriptionLineBaseSchema;
export const prescriptionStatusUpdateSchema = z.object({
  status: z.nativeEnum(PrescriptionStatusEnum),
});

// Types

export type Prescription = z.infer<typeof prescriptionSchema>;
export type PrescriptionCreateInput = z.infer<typeof prescriptionCreateSchema>;
export type PrescriptionLineCreateInput = z.infer<
  typeof prescriptionLineCreateSchema
>;
export type PrescriptionStatusUpdateInput = z.infer<
  typeof prescriptionStatusUpdateSchema
>;

// Response types

export interface PrescriptionCreateResponse {
  success: boolean;
  data?: Prescription;
  message?: string;
}

export interface PrescriptionsResponse {
  success: boolean;
  data?: {
    prescriptions: Prescription[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export interface PrescriptionDetailResponse {
  success: boolean;
  data?: Prescription;
  message?: string;
}

export interface PrescriptionLineCreateResponse {
  success: boolean;
  data?: {
    id: string;
    drugId: string;
    quantityPrescribed: number;
    dosage: string;
    lineNumber: number;
  };
  message?: string;
}

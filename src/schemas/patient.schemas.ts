import { z } from "zod";

// Enums

export const GenderEnum = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
  UNKNOWN: "UNKNOWN",
} as const;

export type Gender = typeof GenderEnum[keyof typeof GenderEnum];
export const GenderValues = Object.values(GenderEnum) as readonly Gender[];

export const AllergySeverityEnum = {
  MILD: "MILD",
  MODERATE: "MODERATE",
  SEVERE: "SEVERE",
  ANAPHYLAXIS: "ANAPHYLAXIS",
} as const;

export type AllergySeverity =
  typeof AllergySeverityEnum[keyof typeof AllergySeverityEnum];
export const AllergySeverityValues = Object.values(
  AllergySeverityEnum
) as readonly AllergySeverity[];

// Schéma Patient (base)

const patientBaseSchema = z.object({
  hospitalNumber: z.string().min(1, "Numéro de dossier requis").max(50),
  firstName: z.string().min(1, "Prénom requis").max(100),
  lastName: z.string().min(1, "Nom requis").max(100),
  dateOfBirth: z.string().datetime().nullable().optional(),
  gender: z.nativeEnum(GenderEnum).default("UNKNOWN"),
  nationalId: z.string().max(50).nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
  address: z.string().nullable().optional(),
  commune: z.string().max(100).nullable().optional(),
  territoire: z.string().max(100).nullable().optional(),
  province: z.string().max(100).nullable().optional(),
  insuranceId: z.string().nullable().optional(),
  ongCoverageRef: z.string().max(100).nullable().optional(),
  isHivPatient: z.boolean().nullable().optional(),
  arvCode: z.string().max(50).nullable().optional(),
  isTbPatient: z.boolean().nullable().optional(),
  tbCode: z.string().max(50).nullable().optional(),
  chronicConditions: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  notes: z.string().nullable().optional(),
});

// Schéma Allergy (base)

const allergyBaseSchema = z.object({
  substance: z.string().min(1, "Substance requise").max(255),
  reaction: z.string().nullable().optional(),
  severity: z.nativeEnum(AllergySeverityEnum),
  confirmedAt: z.string().datetime().nullable().optional(),
  confirmedBy: z.string().max(100).nullable().optional(),
  notes: z.string().nullable().optional(),
});

// Schéma complet Patient

export const patientSchema = patientBaseSchema.extend({
  id: z.string(),
  externalId: z.string().nullable().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  _count: z
    .object({
      prescriptions: z.number().optional(),
      dispensations: z.number().optional(),
    })
    .optional(),
  allergies: z
    .array(
      z.object({
        id: z.string(),
        substance: z.string(),
        reaction: z.string().nullable(),
        severity: z.nativeEnum(AllergySeverityEnum),
        confirmedAt: z.string().datetime().nullable(),
        confirmedBy: z.string().nullable(),
        notes: z.string().nullable(),
        createdAt: z.string().datetime(),
      })
    )
    .optional(),
});

// Schémas de création / update

export const patientCreateSchema = patientBaseSchema;
export const patientUpdateSchema = patientBaseSchema.partial();
export const allergyCreateSchema = allergyBaseSchema;

// Types

export type Patient = z.infer<typeof patientSchema>;
export type PatientCreateInput = z.infer<typeof patientCreateSchema>;
export type PatientUpdateInput = z.infer<typeof patientUpdateSchema>;
export type AllergyCreateInput = z.infer<typeof allergyCreateSchema>;

// Response types

export interface PatientCreateResponse {
  success: boolean;
  data?: Patient;
  message?: string;
}

export interface PatientsResponse {
  success: boolean;
  data?: {
    patients: Patient[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export interface PatientDeleteResponse {
  success: boolean;
  message?: string;
}

export interface AllergyCreateResponse {
  success: boolean;
  data?: {
    id: string;
    substance: string;
    reaction: string | null;
    severity: AllergySeverity;
    confirmedAt: string | null;
    notes: string | null;
    createdAt: string;
  };
  message?: string;
}

export interface AllergiesResponse {
  success: boolean;
  data?: Array<{
    id: string;
    substance: string;
    reaction: string | null;
    severity: AllergySeverity;
    confirmedAt: string | null;
    notes: string | null;
    createdAt: string;
  }>;
  message?: string;
}

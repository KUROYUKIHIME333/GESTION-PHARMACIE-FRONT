import z from "zod";

export const DrugFormEnum = {
  TABLET: "TABLET",
  CAPSULE: "CAPSULE",
  SYRUP: "SYRUP",
  INJECTABLE_IV: "INJECTABLE_IV",
  INJECTABLE_IM: "INJECTABLE_IM",
  INJECTABLE_SC: "INJECTABLE_SC",
  CREAM: "CREAM",
  OINTMENT: "OINTMENT",
  DROPS_EYE: "DROPS_EYE",
  DROPS_EAR: "DROPS_EAR",
  DROPS_NASAL: "DROPS_NASAL",
  SUPPOSITORY: "SUPPOSITORY",
  PATCH: "PATCH",
  POWDER: "POWDER",
  GRANULES: "GRANULES",
  SOLUTION: "SOLUTION",
  SUSPENSION: "SUSPENSION",
  AEROSOL: "AEROSOL",
  GEL: "GEL",
  PESSARY: "PESSARY",
  OTHER: "OTHER",
} as const;

export const DrugCategoryEnum = {
  ANTIRETROVIRAL: "ANTIRETROVIRAL",
  ANTIMALARIAL: "ANTIMALARIAL",
  ANTITUBERCULOSIS: "ANTITUBERCULOSIS",
  VACCINE: "VACCINE",
  ANTIBIOTIC: "ANTIBIOTIC",
  ANALGESIC: "ANALGESIC",
  ANTIPYRETIC: "ANTIPYRETIC",
  ANTI_INFLAMMATORY: "ANTI_INFLAMMATORY",
  ANTIFUNGAL: "ANTIFUNGAL",
  ANTIPARASITIC: "ANTIPARASITIC",
  CARDIOVASCULAR: "CARDIOVASCULAR",
  ANTIHYPERTENSIVE: "ANTIHYPERTENSIVE",
  ANTIDIABETIC: "ANTIDIABETIC",
  RESPIRATORY: "RESPIRATORY",
  GASTROINTESTINAL: "GASTROINTESTINAL",
  NEUROLOGICAL: "NEUROLOGICAL",
  PSYCHIATRIC: "PSYCHIATRIC",
  HORMONAL: "HORMONAL",
  CONTRACEPTIVE: "CONTRACEPTIVE",
  VITAMINS_SUPPLEMENTS: "VITAMINS_SUPPLEMENTS",
  ANESTHETIC: "ANESTHETIC",
  ANTISEPTIC_DISINFECTANT: "ANTISEPTIC_DISINFECTANT",
  MEDICAL_CONSUMABLE: "MEDICAL_CONSUMABLE",
  DIAGNOSTIC_REAGENT: "DIAGNOSTIC_REAGENT",
  OTHER: "OTHER",
} as const;

export const StorageConditionEnum = {
  ROOM_TEMP: "ROOM_TEMP",
  COOL: "COOL",
  REFRIGERATED: "REFRIGERATED",
  FROZEN: "FROZEN",
  PROTECT_LIGHT: "PROTECT_LIGHT",
  PROTECT_HUMIDITY: "PROTECT_HUMIDITY",
  CONTROLLED_SUBSTANCE: "CONTROLLED_SUBSTANCE",
} as const;

export const drugQuerySchema = z.object({
  search: z.string().nullable().optional(),
  category: z.nativeEnum(DrugCategoryEnum).nullable().optional(),
  isEssential: z
    .string()
    .transform((val) => val === "true")
    .nullable()
    .optional(),
  isControlled: z
    .string()
    .transform((val) => val === "true")
    .nullable()
    .optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .nullable()
    .optional(),
  page: z.string().transform(Number).default(1),
  limit: z.string().transform(Number).default(20),
});

// Schéma de base (sans id, timestamps, _count)
const drugBaseSchema = z.object({
  code: z.string().min(1, "Code requis").max(50),
  name: z.string().min(1, "Nom requis").max(255),
  genericName: z.string().max(255).nullable().optional(),
  dci: z.string().min(1, "DCI requise").max(255),
  form: z.nativeEnum(DrugFormEnum),
  category: z.nativeEnum(DrugCategoryEnum),
  therapeuticClass: z.string().max(255).nullable().optional(),
  dosage: z.string().max(100).nullable().optional(),
  concentration: z.string().max(100).nullable().optional(),
  unitOfDispense: z.string().max(50).nullable().optional(),
  packSize: z.coerce.number().int().min(1).default(1).nullable().optional(),
  packUnit: z.string().max(50).default("boîte").nullable().optional(),
  ammNumber: z.string().max(100).nullable().optional(),
  isEssential: z.boolean().default(false).nullable().optional(),
  isControlled: z.boolean().default(false).nullable().optional(),
  controlledSchedule: z.string().max(10).nullable().optional(),
  isProgramDrug: z.boolean().default(false).nullable().optional(),
  programName: z.string().max(100).nullable().optional(),
  storageConditions: z.array(z.nativeEnum(StorageConditionEnum)).default([]),
  requiresColdChain: z.boolean().default(false),
  minTemp: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? null : Number(val),
    z.number().nullable().optional()
  ),
  maxTemp: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? null : Number(val),
    z.number().nullable().optional()
  ),
  unitPriceCDF: z.number().nonnegative().nullable().optional(),
  unitPriceUSD: z.number().nonnegative().nullable().optional(),
  isPriceRegulated: z.boolean().default(false),
  minStockLevel: z
    .number()
    .int()
    .nonnegative()
    .default(0)
    .nullable()
    .optional(),
  criticalStockLevel: z
    .number()
    .int()
    .nonnegative()
    .default(0)
    .nullable()
    .optional(),
  reorderPoint: z.number().int().nonnegative().default(0).nullable().optional(),
  reorderQuantity: z
    .number()
    .int()
    .nonnegative()
    .default(0)
    .nullable()
    .optional(),
  isActive: z.boolean().default(true),
  notes: z.string().nullable().optional(),
});

// Schéma complet Drug (avec id, timestamps, _count)
export const drugSchemas = drugBaseSchema.extend({
  id: z.string(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  _count: z
    .object({
      batches: z.number().optional(),
    })
    .optional(),
});

// Schéma de création (strict, pour le formulaire)──
// Aligné avec drugCreateJsonSchema du backend
export const drugCreateSchema = drugBaseSchema;

// Schéma de mise à jour (tous les champs optionnels) ─────────────────────
export const drugUpdateSchema = drugBaseSchema.partial();

// Types────────────────────────────────────────────
export type Drug = z.infer<typeof drugSchemas>;
export type DrugCreateInput = z.infer<typeof drugCreateSchema>;
export type DrugUpdateInput = z.infer<typeof drugUpdateSchema>;
export type DrugQueryInput = z.infer<typeof drugQuerySchema>;
export type DrugFormType = typeof DrugFormEnum[keyof typeof DrugFormEnum];
export type DrugCategoryType =
  typeof DrugCategoryEnum[keyof typeof DrugCategoryEnum];
export type StorageConditionType =
  typeof StorageConditionEnum[keyof typeof StorageConditionEnum];

export const DrugFormValues = Object.values(
  DrugFormEnum
) as readonly DrugFormType[];
export const DrugCategoryValues = Object.values(
  DrugCategoryEnum
) as readonly DrugCategoryType[];
export const StorageConditionValues = Object.values(
  StorageConditionEnum
) as readonly StorageConditionType[];

export interface DrugCreateResponse {
  success: boolean;
  data?: Drug;
  message?: string;
}

export interface DrugsResponse {
  success: boolean;
  data?: {
    drugs: Drug[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export interface DrugDeleteResponse {
  success: boolean;
  message?: string;
}

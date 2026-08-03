import { z } from "zod";

export const dashboardStatsSchema = z.object({
  success: z.boolean(),
  data: z.object({
    alerts: z.object({
      totalActive: z.number(),
      critical: z.number(),
      warning: z.number(),
      byType: z.record(z.string(), z.number()),
    }),
    stock: z.object({
      totalDrugs: z.number(),
      drugsInStock: z.number(),
      drugsCritical: z.number(),
      drugsLow: z.number(),
      totalValueCDF: z.number(),
      totalValueUSD: z.number(),
    }),
    expiries: z.object({
      expired: z.number(),
      critical30Days: z.number(),
      warning90Days: z.number(),
    }),
    activity: z.object({
      dispensationsToday: z.number(),
      dispensationsWeek: z.number(),
      prescriptionsToday: z.number(),
      prescriptionsWeek: z.number(),
      newPatientsToday: z.number(),
      newPatientsWeek: z.number(),
    }),
    counts: z.object({
      totalPatients: z.number(),
      totalPrescriptions: z.number(),
      totalDispensations: z.number(),
      totalDrugs: z.number(),
      totalBatches: z.number(),
    }),
  }),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>["data"];

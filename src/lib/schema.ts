import { z } from "zod";

export const TripBasicsSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  purpose: z.enum(["leisure", "work", "event", "adventure"]),
});

export const TravelStyleSchema = z.object({
  party: z.enum(["solo", "couple", "family"]),
  packStyle: z.enum(["light", "medium", "heavy"]),
  needs: z.object({
    kids: z.boolean().optional(),
    pets: z.boolean().optional(),
    meds: z.boolean().optional(),
    instruments: z.boolean().optional(),
  }),
});

export const WeatherSchema = z.object({
  climate: z.enum(["cold", "mild", "warm", "tropical", "changeable"]).optional(),
  avgHighC: z.number().optional(),
  avgLowC: z.number().optional(),
  rainChance: z.number().min(0).max(1).optional(),
});

export const GenerateInputSchema = z.object({
  basics: TripBasicsSchema,
  style: TravelStyleSchema,
  weather: WeatherSchema.optional(),
});

export const ListItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  qty: z.number().optional(),
  category: z.enum(["must", "clothes", "trip", "optional"]),
  always: z.boolean().optional(),
});

export const PackingListSchema = z.object({
  summary: z.object({
    days: z.number(),
    destination: z.string(),
  }),
  items: z.array(ListItemSchema),
});

// TypeScript types
export type TripBasics = z.infer<typeof TripBasicsSchema>;
export type TravelStyle = z.infer<typeof TravelStyleSchema>;
export type Weather = z.infer<typeof WeatherSchema>;
export type GenerateInput = z.infer<typeof GenerateInputSchema>;
export type ListItem = z.infer<typeof ListItemSchema>;
export type PackingList = z.infer<typeof PackingListSchema>;

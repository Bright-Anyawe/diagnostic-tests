import { z } from "zod"

export const TestSchema = z.object({
  patientName: z.string().min(2, {
    message: "Patient name must be at least 2 characters.",
  }),
  testType: z.string().min(2, {
    message: "Test type must be at least 2 characters.",
  }),
  result: z.string(),
  testDate: z.string().transform((str) => new Date(str)),
  notes: z.string().optional(),
})
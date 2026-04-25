import { z } from 'zod'

const sampleBType1ResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  score: z.number(),
})

export const sampleBType1ResponseSchema = z.object({
  result: sampleBType1ResultSchema,
})

export type SampleBType1Response = z.infer<typeof sampleBType1ResultSchema>

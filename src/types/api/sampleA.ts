import { z } from 'zod'

const sampleAType1ResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  value: z.number(),
  date: z.string(),
})

export const sampleAType1ResponseSchema = z.object({
  result: sampleAType1ResultSchema,
})

const sampleAType2ResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  items: z.array(
    z.object({
      label: z.string(),
      count: z.number(),
    }),
  ),
})

export const sampleAType2ResponseSchema = z.object({
  result: sampleAType2ResultSchema,
})

export type SampleAType1Response = z.infer<typeof sampleAType1ResultSchema>
export type SampleAType2Response = z.infer<typeof sampleAType2ResultSchema>

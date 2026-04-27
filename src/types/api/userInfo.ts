import { z } from 'zod'

export const userInfoResponseSchema = z.object({
  result: z.object({
    userId: z.string(),
    name: z.string(),
    email: z.string(),
  }),
})

export type UserInfoResponse = z.infer<typeof userInfoResponseSchema>

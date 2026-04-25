import { z } from 'zod'

export const userInfoResponseSchema = z.object({
  clientUserId: z.string(),
  groupId: z.string(),
  stores: z.array(
    z.object({
      akrCode: z.string(),
      storeName: z.string(),
    }),
  ),
})

export const batchDateResponseSchema = z.object({
  latestDate: z.string(),
})

export type UserInfoResponse = z.infer<typeof userInfoResponseSchema>
export type BatchDateResponse = z.infer<typeof batchDateResponseSchema>

import { queryOptions } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { apiFetch } from '@/lib/apiFetch'
import { batchDateResponseSchema, userInfoResponseSchema } from '@/types/api/common'

export const userInfoQueryOptions = queryOptions({
  queryKey: ['userInfo'],
  queryFn: async () => {
    const raw = await apiFetch(API_ENDPOINTS.USER_INFO)
    return userInfoResponseSchema.parse(raw)
  },
})

export const batchDateQueryOptions = queryOptions({
  queryKey: ['batchDate'],
  queryFn: async () => {
    const raw = await apiFetch(API_ENDPOINTS.BATCH_DATE)
    return batchDateResponseSchema.parse(raw)
  },
})

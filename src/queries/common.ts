import { queryOptions } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { apiFetch } from '@/lib/apiFetch'
import { batchDateResponseSchema, userInfoResponseSchema } from '@/types/api/common'

export const userInfoQueryOptions = queryOptions({
  queryKey: ['userInfo'],
  queryFn: () => apiFetch(API_ENDPOINTS.USER_INFO, userInfoResponseSchema),
  staleTime: Infinity,
})

export const batchDateQueryOptions = queryOptions({
  queryKey: ['batchDate'],
  queryFn: () => apiFetch(API_ENDPOINTS.BATCH_DATE, batchDateResponseSchema),
  staleTime: Infinity,
})

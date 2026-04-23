import { queryOptions } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { apiFetch } from '@/lib/apiFetch'
import type { BatchDateResponse, UserInfoResponse } from '@/types/api/common'

export const userInfoQueryOptions = queryOptions({
  queryKey: ['userInfo'],
  queryFn: () => apiFetch<UserInfoResponse>(API_ENDPOINTS.USER_INFO),
})

export const batchDateQueryOptions = queryOptions({
  queryKey: ['batchDate'],
  queryFn: () => apiFetch<BatchDateResponse>(API_ENDPOINTS.BATCH_DATE),
})

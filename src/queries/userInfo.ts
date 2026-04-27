import { queryOptions } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { apiFetch } from '@/lib/apiFetch'
import { userInfoResponseSchema } from '@/types/api/userInfo'

export const userInfoQueryOptions = queryOptions({
  queryKey: ['userInfo'],
  queryFn: () => apiFetch(API_ENDPOINTS.USER_INFO, userInfoResponseSchema),
})

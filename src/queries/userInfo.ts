import { queryOptions } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { apiFetch } from '@/lib/apiFetch'
import type { UserInfoResponse } from '@/types/api/userInfo'

export const userInfoQueryOptions = queryOptions({
  queryKey: ['userInfo'],
  queryFn: async () => {
    const response = await apiFetch<UserInfoResponse>(API_ENDPOINTS.USER_INFO)
    return response
  },
})

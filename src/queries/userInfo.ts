import { apiFetch } from '@/lib/apiFetch'
import type { UserInfoResponse } from '@/types/api/userInfo'
import { queryOptions } from '@tanstack/react-query'

export const userInfoQueryOptions = queryOptions({
  queryKey: ['userInfo'],
  queryFn: async () => {
    const response = await apiFetch<UserInfoResponse>('/api/userInfo')
    return response
  },
})

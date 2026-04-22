import { queryOptions } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { apiFetch } from '@/lib/apiFetch'
import type { TestApiResponse } from '@/types/api/testApi'

export const testApiQueryOptions = queryOptions({
  queryKey: ['testApi'],
  queryFn: async () => {
    const response = await apiFetch<TestApiResponse>(API_ENDPOINTS.TEST_API)
    return response
  },
})

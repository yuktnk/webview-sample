import { queryOptions } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { apiFetch } from '@/lib/apiFetch'
import { sampleBType1ResponseSchema } from '@/types/api/sampleB'

export const sampleBType1QueryOptions = queryOptions({
  queryKey: ['sampleB', 'type1'],
  queryFn: async () => {
    const raw = await apiFetch(API_ENDPOINTS.SAMPLE_B_TYPE1)
    return sampleBType1ResponseSchema.parse(raw)
  },
})

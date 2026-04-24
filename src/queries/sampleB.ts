import { queryOptions } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { apiFetch } from '@/lib/apiFetch'
import type { SampleBType1Response } from '@/types/api/sampleB'

export const sampleBType1QueryOptions = queryOptions({
  queryKey: ['sampleB', 'type1'],
  queryFn: () => apiFetch<{ result: SampleBType1Response }>(API_ENDPOINTS.SAMPLE_B_TYPE1),
})

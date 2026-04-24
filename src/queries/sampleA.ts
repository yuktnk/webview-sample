import { queryOptions } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { apiFetch } from '@/lib/apiFetch'
import type { SampleAType1Response, SampleAType2Response } from '@/types/api/sampleA'

export const sampleAType1QueryOptions = queryOptions({
  queryKey: ['sampleA', 'type1'],
  queryFn: () => apiFetch<{ result: SampleAType1Response }>(API_ENDPOINTS.SAMPLE_A_TYPE1),
})

export const sampleAType2QueryOptions = queryOptions({
  queryKey: ['sampleA', 'type2'],
  queryFn: () => apiFetch<{ result: SampleAType2Response }>(API_ENDPOINTS.SAMPLE_A_TYPE2),
})

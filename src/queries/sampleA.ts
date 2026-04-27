import { queryOptions } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { apiFetch } from '@/lib/apiFetch'
import { sampleAType1ResponseSchema, sampleAType2ResponseSchema } from '@/types/api/sampleA'

export const sampleAType1QueryOptions = queryOptions({
  queryKey: ['sampleA', 'type1'],
  queryFn: () => apiFetch(API_ENDPOINTS.SAMPLE_A_TYPE1, sampleAType1ResponseSchema),
})

export const sampleAType2QueryOptions = queryOptions({
  queryKey: ['sampleA', 'type2'],
  queryFn: () => apiFetch(API_ENDPOINTS.SAMPLE_A_TYPE2, sampleAType2ResponseSchema),
})

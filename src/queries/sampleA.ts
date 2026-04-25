import { queryOptions } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { apiFetch } from '@/lib/apiFetch'
import { sampleAType1ResponseSchema, sampleAType2ResponseSchema } from '@/types/api/sampleA'

export const sampleAType1QueryOptions = queryOptions({
  queryKey: ['sampleA', 'type1'],
  queryFn: async () => {
    const raw = await apiFetch(API_ENDPOINTS.SAMPLE_A_TYPE1)
    return sampleAType1ResponseSchema.parse(raw)
  },
})

export const sampleAType2QueryOptions = queryOptions({
  queryKey: ['sampleA', 'type2'],
  queryFn: async () => {
    const raw = await apiFetch(API_ENDPOINTS.SAMPLE_A_TYPE2)
    return sampleAType2ResponseSchema.parse(raw)
  },
})

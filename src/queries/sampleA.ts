import { apiFetch } from '@/lib/apiFetch'
import type {
  SampleAType1Response,
  SampleAType2Response,
} from '@/types/api/sampleA'
import { queryOptions } from '@tanstack/react-query'

export const sampleAType1QueryOptions = queryOptions({
  queryKey: ['sampleA', 'type1'],
  queryFn: () =>
    apiFetch<{ result: SampleAType1Response }>('/api/sample_a/type_1'),
})

export const sampleAType2QueryOptions = queryOptions({
  queryKey: ['sampleA', 'type2'],
  queryFn: () =>
    apiFetch<{ result: SampleAType2Response }>('/api/sample_a/type_2'),
})

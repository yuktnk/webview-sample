import { apiFetch } from '@/lib/apiFetch'
import type { SampleBType1Response } from '@/types/api/sampleB'
import { queryOptions } from '@tanstack/react-query'

export const sampleBType1QueryOptions = queryOptions({
  queryKey: ['sampleB', 'type1'],
  queryFn: () =>
    apiFetch<{ result: SampleBType1Response }>('/api/sample_b/type_1'),
})

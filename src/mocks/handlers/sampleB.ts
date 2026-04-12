import { mockSampleBType1Data } from '@/mocks/data/sampleB'
import { http, HttpResponse } from 'msw'

export const sampleBHandlers = [
  http.get('/api/sample_b/type_1', () =>
    HttpResponse.json({ result: mockSampleBType1Data }),
  ),
]

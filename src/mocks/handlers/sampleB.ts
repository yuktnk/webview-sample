import { http, HttpResponse } from 'msw'
import { mockSampleBType1Data } from '../data/sampleB'

export const sampleBHandlers = [
  http.get('/api/sample_b/type_1', () =>
    HttpResponse.json({ result: mockSampleBType1Data }),
  ),
]

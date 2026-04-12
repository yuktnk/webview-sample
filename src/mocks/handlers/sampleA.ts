import {
  mockSampleAType1Data,
  mockSampleAType2Data,
} from '@/mocks/data/sampleA'
import { http, HttpResponse } from 'msw'

export const sampleAHandlers = [
  http.get('/api/sample_a/type_1', () =>
    HttpResponse.json({ result: mockSampleAType1Data }),
  ),
  http.get('/api/sample_a/type_2', () =>
    HttpResponse.json({ result: mockSampleAType2Data }),
  ),
]

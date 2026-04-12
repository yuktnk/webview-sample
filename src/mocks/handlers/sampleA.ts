import { http, HttpResponse } from 'msw'
import { mockSampleAType1Data, mockSampleAType2Data } from '../data/sampleA'

export const sampleAHandlers = [
  http.get('/api/sample_a/type_1', () =>
    HttpResponse.json({ result: mockSampleAType1Data }),
  ),
  http.get('/api/sample_a/type_2', () =>
    HttpResponse.json({ result: mockSampleAType2Data }),
  ),
]

import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import {
  mockSampleAType1Data,
  mockSampleAType2Data,
} from '@/mocks/data/sampleA'
import { http, HttpResponse } from 'msw'

export const sampleAHandlers = [
  http.get(API_ENDPOINTS.SAMPLE_A_TYPE1, () =>
    HttpResponse.json({ result: mockSampleAType1Data }),
  ),
  http.get(API_ENDPOINTS.SAMPLE_A_TYPE2, () =>
    HttpResponse.json({ result: mockSampleAType2Data }),
  ),
]

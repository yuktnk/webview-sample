import { HttpResponse, http } from 'msw'

import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { mockSampleBType1Data } from '@/mocks/data/sampleB'

export const sampleBHandlers = [
  http.get(API_ENDPOINTS.SAMPLE_B_TYPE1, () => HttpResponse.json({ result: mockSampleBType1Data })),
]

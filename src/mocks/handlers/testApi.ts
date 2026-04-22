import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { mockTestApi } from '@/mocks/data/testApi'
import { http, HttpResponse } from 'msw'

export const testApiHandlers = [
  http.get(API_ENDPOINTS.TEST_API, () => {
    return HttpResponse.json({ result: mockTestApi })
  }),
]

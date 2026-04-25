import { http, HttpResponse } from 'msw'

import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { mockBatchDate, mockUserInfo } from '@/mocks/data/common'

export const commonHandlers = [
  http.get(API_ENDPOINTS.USER_INFO, () => HttpResponse.json(mockUserInfo)),
  http.get(API_ENDPOINTS.BATCH_DATE, () => HttpResponse.json(mockBatchDate)),
]

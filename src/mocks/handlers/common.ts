import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { mockBatchDate, mockUserInfo } from '@/mocks/data/common'
import { http, HttpResponse } from 'msw'

export const commonHandlers = [
  http.get(API_ENDPOINTS.USER_INFO, () =>
    HttpResponse.json({ result: mockUserInfo }),
  ),
  http.get(API_ENDPOINTS.BATCH_DATE, () =>
    HttpResponse.json({ result: mockBatchDate }),
  ),
]

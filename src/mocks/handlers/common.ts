import { mockBatchDate, mockUserInfo } from '@/mocks/data/common'
import { http, HttpResponse } from 'msw'

export const commonHandlers = [
  http.get('/api/user/info', () => HttpResponse.json({ result: mockUserInfo })),
  http.get('/api/batch/date', () =>
    HttpResponse.json({ result: mockBatchDate }),
  ),
]

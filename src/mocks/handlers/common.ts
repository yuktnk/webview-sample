import { http, HttpResponse } from 'msw'
import { mockUserInfo, mockBatchDate } from '../data/common'

export const commonHandlers = [
  http.get('*/api/user/info', () =>
    HttpResponse.json({ result: mockUserInfo })
  ),
  http.get('*/api/batch/date', () =>
    HttpResponse.json({ result: mockBatchDate })
  ),
]

import { mockUserInfo } from '@/mocks/data/userInfo'
import { http, HttpResponse } from 'msw'

export const userInfoHandlers = [
  http.get('/api/userInfo', () => {
    return HttpResponse.json({ result: mockUserInfo })
  }),
]

import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { mockUserInfo } from '@/mocks/data/userInfo'
import { http, HttpResponse } from 'msw'

export const userInfoHandlers = [
  http.get(API_ENDPOINTS.USER_INFO, () => {
    return HttpResponse.json({ result: mockUserInfo })
  }),
]

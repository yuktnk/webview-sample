import { queryOptions } from '@tanstack/react-query'
import { apiFetch } from '../lib/apiFetch'
import type { BatchDateResponse, UserInfoResponse } from '../types/api/common'

export const userInfoQueryOptions = queryOptions({
  queryKey: ['userInfo'],
  queryFn: () => apiFetch<UserInfoResponse>('/api/user/info'),
})

export const batchDateQueryOptions = queryOptions({
  queryKey: ['batchDate'],
  queryFn: () => apiFetch<BatchDateResponse>('/api/batch/date'),
})

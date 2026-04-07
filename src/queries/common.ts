import { queryOptions } from '@tanstack/react-query'
import { apiFetch } from '../lib/apiFetch'

type UserInfoResponse = {
  clientUserId: string
  groupId: string
  stores: {
    akrCode: string
    storeName: string
  }[]
}

type BatchDateResponse = {
  latestDate: string
}

export const userInfoQueryOptions = queryOptions({
  queryKey: ['userInfo'],
  queryFn: () => apiFetch<UserInfoResponse>('/api/user/info'),
})

export const batchDateQueryOptions = queryOptions({
  queryKey: ['batchDate'],
  queryFn: () => apiFetch<BatchDateResponse>('/api/batch/date'),
})

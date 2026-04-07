import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { userInfoQueryOptions, batchDateQueryOptions } from '../queries/common'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: ({ context: { queryClient } }) => Promise.all([
    queryClient.ensureQueryData(userInfoQueryOptions),
    queryClient.ensureQueryData(batchDateQueryOptions),
  ]),
  component: () => <Outlet />,
})

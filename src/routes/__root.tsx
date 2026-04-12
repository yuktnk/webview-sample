import { batchDateQueryOptions, userInfoQueryOptions } from '@/queries/common'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    loader: ({ context: { queryClient } }) =>
      Promise.all([
        queryClient.ensureQueryData(userInfoQueryOptions),
        queryClient.ensureQueryData(batchDateQueryOptions),
      ]),
    component: () => <Outlet />,
  },
)

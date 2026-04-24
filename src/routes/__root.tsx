import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

import { batchDateQueryOptions, userInfoQueryOptions } from '@/queries/common'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(userInfoQueryOptions),
      queryClient.ensureQueryData(batchDateQueryOptions),
    ]),
  component: function RootLayout() {
    return (
      <>
        <Outlet />
        {import.meta.env.DEV && <ReactQueryDevtools />}
      </>
    )
  },
})

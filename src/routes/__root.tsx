import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

import { ErrorView } from '@/components/ui/ErrorView'
import { LoadingView } from '@/components/ui/LoadingView'
import { batchDateQueryOptions, userInfoQueryOptions } from '@/queries/common'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(userInfoQueryOptions),
      queryClient.ensureQueryData(batchDateQueryOptions),
    ]),
  pendingComponent: LoadingView,
  errorComponent: ErrorView,
  component: function RootLayout() {
    return (
      <>
        <Outlet />
        {import.meta.env.DEV && <ReactQueryDevtools />}
      </>
    )
  },
})

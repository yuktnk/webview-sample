import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { z } from 'zod'

z.object({
  VITE_ENVIRONMENT: z.enum(['local', 'dev', 'stg', 'prd']),
  VITE_API_BASE_URL: z.string().min(1),
}).parse(import.meta.env)

import './index.css'
import { queryClient } from './lib/queryClient'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  context: { queryClient },
})

declare module '@tanstack/react-router' {
  // biome-ignore lint/style/useConsistentTypeDefinitions: module augmentation requires interface
  interface Register {
    router: typeof router
  }
}

const prepare = async () => {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }
}

void prepare().then(() => {
  const rootElement = document.getElementById('root')
  if (!rootElement) throw new Error('Root element not found')
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
})

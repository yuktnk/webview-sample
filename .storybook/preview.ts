import '@/index.css'
import { handlers } from '@/mocks/handlers'
import type { Preview } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { createElement } from 'react'

initialize()

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    msw: {
      handlers,
    },
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      })
      return createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(Story),
      )
    },
  ],
}

export default preview

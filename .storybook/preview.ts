import type { Preview } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { handlers } from '../src/mocks/handlers'

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
      return createElement(QueryClientProvider, { client: queryClient }, createElement(Story))
    },
  ],
}

export default preview
